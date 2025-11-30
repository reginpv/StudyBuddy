'use server'

import { put } from '@vercel/blob'
import prisma from '@/lib/prisma'
import { revalidatePath, revalidateTag } from 'next/cache'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/authOptions'

// 1. Import the new library
import PDFParser from 'pdf2json'

// AI SDK
import { embedMany } from 'ai'
import { google } from '@ai-sdk/google'
import { raw } from '@prisma/client/runtime/library'

// LlamaParse

// We use 'require' to avoid the strict ESM error with pdf-parse
// This fixes the "no default export" error you saw earlier
// const pdf = require('pdf-parse/lib/pdf-parse.js')

// --- CUSTOM HELPER FUNCTION: TEXT SPLITTER ---
// This replaces LangChain's RecursiveCharacterTextSplitter
// It splits text into chunks of ~1000 characters with some overlap
// --- HELPER 2: CHUNK TEXT (FIXED) ---
function chunkText(
  text: string,
  chunkSize: number = 1000,
  overlap: number = 200
) {
  if (!text || text.length === 0) return [] // Guard against empty text

  const chunks: string[] = []
  let start = 0

  while (start < text.length) {
    const end = start + chunkSize
    let chunk = text.slice(start, end)

    // Optional: Cut at period to avoid breaking sentences
    if (end < text.length) {
      const lastPeriod = chunk.lastIndexOf('.')
      // Ensure we don't cut off too much if the period is very early
      if (lastPeriod > 0 && lastPeriod > chunk.length * 0.5) {
        chunk = chunk.slice(0, lastPeriod + 1)
      }
    }

    chunks.push(chunk)

    // --- CRITICAL FIX START ---
    // Calculate how much to move the cursor forward
    const step = chunk.length - overlap

    // If step is 0 or negative (because the chunk is small/end of file),
    // we must forcibly move forward by at least 1 to prevent infinite loops.
    // Ideally, if it's the end, we just finish.
    if (step <= 0) {
      start = text.length // Force end of loop
    } else {
      start += step
    }
    // --- CRITICAL FIX END ---
  }

  return chunks
}

// --- HELPER 1: PARSE PDF (The Fix) ---
// This wraps pdf2json in a Promise so we can use "await"
function parsePDF(buffer: Buffer): Promise<string> {
  return new Promise((resolve, reject) => {
    // CHANGE 1 to true
    const parser = new PDFParser(null, true)

    parser.on('pdfParser_dataError', (errData: any) =>
      reject(errData.parserError)
    )

    parser.on('pdfParser_dataReady', () => {
      resolve(parser.getRawTextContent())
    })

    parser.parseBuffer(buffer)
  })
}

export async function uploadAndEmbedFile(prevState: any, formData: FormData) {
  // Session
  const session = await getServerSession(authOptions)
  if (!session) return { error: 'Unauthorized' }

  // TODO: Replace with real user session
  const userId = session.user.id

  // File
  const file = formData.get('file') as File

  //
  if (!file || file.size === 0) return { error: 'No file provided.' }

  // PDF only
  if (file.type !== 'application/pdf') return { error: 'File must be a PDF.' }

  try {
    // Vercel blob
    // 1. Upload to Blob
    const blob = await put(`${userId}/${file.name}`, file, {
      access: 'public',
      addRandomSuffix: true,
    })

    // 2. Create DB Record
    const fileRecord = await prisma.file.create({
      data: {
        name: file.name,
        url: blob.url,
        mimeType: file.type,
        user: {
          connect: {
            id: userId,
          },
        },
        status: 'PROCESSING',
      },
    })

    // 3. Parse PDF - Works for Next.js ESM
    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    // Use our new helper function
    const rawText = await parsePDF(buffer)

    // 4. Split Text (Using our custom function)
    const chunks = chunkText(rawText)
    console.log(`Split into ${chunks.length} chunks`)

    // 5. Embed with AI SDK
    const { embeddings } = await embedMany({
      model: google.textEmbeddingModel('text-embedding-004'),
      values: chunks,
    })

    // 6. Save to DB
    await Promise.all(
      chunks.map(async (chunk, i) => {
        await prisma.$executeRaw`
          INSERT INTO "Embedding" ("id", "content", "vector", "fileId")
          VALUES (
            gen_random_uuid(), 
            ${chunk}, 
            ${JSON.stringify(embeddings[i])}::vector, 
            ${fileRecord.id}
          );
        `
      })
    )

    // 7. Finish
    await prisma.file.update({
      where: { id: fileRecord.id },
      data: { status: 'COMPLETED' },
    })

    // revalidatePath('/dashboard')
    revalidateTag(`files-${userId}`)

    return {
      success: true,
      message: 'File processed successfully!',
    }
  } catch (error) {
    console.error('Pipeline error:', error)
    return { error: 'Failed to process file.' }
  }
}

uploadAndEmbedFile.maxDuration = 60
