'use server'

import prisma from '@/lib/prisma'
import { revalidateTag, unstable_cache as nextCache } from 'next/cache'
import { cache } from 'react'
import type { File } from '@prisma/client'
import { del } from '@vercel/blob'

// TYPES
type ActionError = {
  field: string
  message: string
}

type ActionResponse<T = unknown> = {
  success: boolean
  payload: T | null
  message: string | null
  errors: ActionError[] // ALWAYS array
  input?: any
}

// GET FILES BY USER
export const getFilesByUser = cache(
  async (userId: string): Promise<ActionResponse<File[]>> => {
    const data = await nextCache(
      async () => {
        try {
          // Get files
          const files = await prisma.file.findMany({
            where: {
              userId: userId,
            },
            orderBy: {
              createdAt: 'desc',
            },
          })

          //
          console.log(`---DB HIT: getFilesByUser ${userId}`)

          if (!files) {
            return {
              success: true,
              payload: [],
              message: null,
              errors: [],
            }
          }

          return {
            success: true,
            payload: files,
            message: 'Files fetched successfully',
            errors: [],
          }

          //
        } catch (error) {
          console.log(`getFilesByUser error: `, error)
          return {
            success: false,
            payload: null,
            message: 'Failed to fetch files',
            errors: [
              { field: 'system', message: 'An unexpected error occurred' },
            ],
          }
        }

        //
      },
      ['getFilesByUser', userId],
      {
        tags: [`files-${userId}`, 'files', 'cache'],
      }
    )()

    return data
  }
)

// DELETE FILE AND FILE RECORD
export async function deleteFile(
  prevState: ActionResponse<File>,
  formData: FormData
): Promise<ActionResponse<File>> {
  try {
    // Parse the file data from FormData
    const fileData = formData.get('file') as string
    const file: File = JSON.parse(fileData)

    // Use promise all or maybe transaction?
    const deletions = await Promise.all([
      del(file.url),
      prisma.file.delete({
        where: {
          id: file.id,
        },
      }),
    ])

    console.log('Deletions', deletions)

    revalidateTag(`files-${file.userId}`)

    return {
      success: true,
      payload: file,
      message: 'File successfully deleted.',
      errors: [],
    }

    //
  } catch (error) {
    console.log('Error deleting file: ', error)
    return {
      success: false,
      payload: null,
      message: '',
      errors: [
        {
          field: 'system',
          message: 'Error deleting file. Please contact admin.',
        },
      ],
    }
  }
}
