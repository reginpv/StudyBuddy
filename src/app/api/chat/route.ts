import { google } from '@ai-sdk/google'
import { streamText, convertToModelMessages } from 'ai'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/authOptions'
import prisma from '@/lib/prisma'
import { embed } from 'ai'

export async function POST(req: Request) {
  const session = await getServerSession(authOptions)
  const user = session?.user
  const name = user?.name || 'Guest'

  const { messages } = await req.json()
  const lastUserMessage = messages[messages.length - 1]?.content ?? ''

  // -------------------------------------
  // 1. If logged in -> run RAG retrieval
  // -------------------------------------
  let ragContext = ''

  if (session) {
    // 1.1 Create embedding for the user's query
    const queryEmbedding = await embed({
      model: google.textEmbedding('text-embedding-004'),
      value: lastUserMessage,
    })

    // 1.2 Vector similarity search in Neon PostgreSQL
    const results = await prisma.$queryRawUnsafe<
      {
        content: string
        metadata: any
        similarity: number
      }[]
    >(`
      SELECT 
        "content",
        "metadata",
        1 - ("vector" <=> '${JSON.stringify(
          queryEmbedding.embedding
        )}') as similarity
      FROM "Embedding"
      WHERE "fileId" IN (
        SELECT id FROM "File"
        WHERE "userId" = '${user.id}' AND status = 'COMPLETED'
      )
      ORDER BY "vector" <=> '${JSON.stringify(queryEmbedding.embedding)}'
      LIMIT 5;
    `)

    // 1.3 Combine retrieved chunks
    if (results.length > 0) {
      ragContext = results.map((r) => r.content).join('\n\n---\n\n')
    }
  }

  // -------------------------------------
  // 2. SYSTEM prompt
  // -------------------------------------
  const systemPrompt = !session
    ? `
    You are StudyBuddy, a friendly virtual tutor.
    The user is not logged in, so politely explain that signing in will unlock:
    - Personalized tutoring and chat experience
    - Answers based on their uploaded documents (RAG)
    - Saved conversations for future reference
    Encourage them to log in to get the best learning experience, but do NOT answer their actual question.
  `
    : `
    You are StudyBuddy, a helpful virtual tutor for the user named ${name}.
    Use the RAG context below if it is relevant to the user's question.
    If no files have been uploaded or the RAG context is not relevant, answer normally.
    If the user hasn't uploaded PDFs yet, gently remind them to upload files so you can provide better, personalized tutoring.

    --- RAG CONTEXT START ---
    ${ragContext || 'No relevant uploaded file content found.'}
    --- RAG CONTEXT END ---
  `

  // -------------------------------------
  // 3. Run model
  // -------------------------------------
  const result = streamText({
    model: google('gemini-2.5-flash'),
    messages: convertToModelMessages(messages),
    system: systemPrompt,
    maxOutputTokens: 500,
  })

  return result.toUIMessageStreamResponse()
}
