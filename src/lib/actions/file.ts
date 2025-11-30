'use server'

import prisma from '@/lib/prisma'
import { revalidateTag, unstable_cache as nextCache } from 'next/cache'
import { cache } from 'react'
import type { File } from '@prisma/client'

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
