import { google } from '@ai-sdk/google'
import { streamText, UIMessage, convertToModelMessages } from 'ai'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/authOptions'

export async function POST(req: Request) {
  // Session
  const session = await getServerSession(authOptions)
  const name = session?.user?.name || 'Guest'

  //
  const { messages }: { messages: UIMessage[] } = await req.json()

  const result = streamText({
    model: google('gemini-2.5-flash'),
    messages: convertToModelMessages(messages),
    system: !session
      ? `You are a helpful assistant, but the user is not logged in. 
         Politely explain that to get a full answer, they should sign in or create a free account.
         Mention benefits like: saving chat history, personalized responses, and advanced features.
         Keep your response brief and encouraging. Do not answer their actual question.`
      : `You are a helpful assistant that provides concise, accurate responses. You will address the user as ${name}. Also encourage the user to upload a PDF file so we can use it as knowledgebase like a RAG application and as a tutor.`,
    maxOutputTokens: 500,
  })

  return result.toUIMessageStreamResponse()
}
