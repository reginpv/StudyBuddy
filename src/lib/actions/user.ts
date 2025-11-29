'use server'

import prisma from '@/lib/prisma'
import { hash } from 'bcrypt'
import { revalidateTag, unstable_cache as nextCache } from 'next/cache'
import { cache } from 'react'
import { User } from '@prisma/client'

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

// CREATE USER
export async function createUser(
  prevState: ActionResponse<User>,
  formData: FormData
): Promise<ActionResponse<User>> {
  // Extract data
  const name = formData.get('name')?.toString().trim() ?? ''
  const email = formData.get('email')?.toString().trim() ?? ''
  const password = formData.get('password')?.toString().trim() ?? ''

  const errors: ActionError[] = []

  if (!name) errors.push({ field: 'name', message: 'Name is required' })
  if (!email) errors.push({ field: 'email', message: 'Email is required' })
  if (!password)
    errors.push({ field: 'password', message: 'Password is required' })

  if (errors.length > 0) {
    return {
      success: false,
      payload: null,
      message: null,
      errors,
      input: { name, email },
    }
  }

  // Proceed
  try {
    // Check if email already exists
    const userExist = await prisma.user.findFirst({
      where: {
        email: email,
      },
    })

    // If email already exists, return error
    if (userExist) {
      return {
        success: false,
        message: `User ${email} already exists.`,
        payload: null,
        errors: [
          {
            field: 'email',
            message: `User with email ${email} already exists`,
          },
        ],
        input: {
          name,
          email,
        },
      }
    }

    // Create user
    const hashedPass = await hash(password, 12)
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPass + '',
      },
    })

    // Do some revalidation
    revalidateTag('users')

    // Return
    return {
      success: true,
      errors: [],
      message: 'User created successfully',
      payload: user,
    }

    //
  } catch (error) {
    // Handle Prisma unique constraint error
    if (error instanceof Error && error.message.includes('Unique constraint')) {
      return {
        success: false,
        message: 'Email already exists',
        payload: null,
        errors: [
          { field: 'email', message: 'This email is already registered' },
        ],
      }
    }

    return {
      success: false,
      message: 'Failed to create user',
      payload: null,
      errors: [{ field: 'system', message: 'An unexpected error occurred' }],
    }
  }
}
