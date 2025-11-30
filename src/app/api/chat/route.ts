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
  // 1. If logged in → run RAG retrieval
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
      You are a helpful assistant, but the user is not logged in.
      Politely explain they should sign in to access personalized chat, knowledge base RAG,
      saved conversations, and better answers.
      Do NOT answer their actual question.
    `
    : `
      You are a helpful assistant for the user named ${name}.
      If the RAG context below is relevant, answer using it.
      If it is NOT relevant, answer normally.
      If no files were uploaded, answer normally and encourage them to upload PDFs.

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
