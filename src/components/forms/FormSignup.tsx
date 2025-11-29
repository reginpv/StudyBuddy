'use client'

import { createUser } from '@/lib/actions/user'
import { useActionState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function FormSignup() {
  // Init
  const initialState = {
    success: false,
    payload: null,
    message: null,
    errors: [],
    input: null,
  }

  // Router
  const { push: redirect } = useRouter()

  const [state, handleSubmit, isPending] = useActionState(
    createUser,
    initialState
  )

  useEffect(() => {
    console.log(state)
    if (state.success) {
      redirect('/login')
    }
  }, [state])

  return (
    <form
      data-loading={isPending}
      action={handleSubmit}
      className="flex flex-col gap-3"
    >
      <div>
        <input
          type="text"
          name="name"
          placeholder="Your name"
          defaultValue={state?.input?.name}
          className={`${
            state?.errors.find((error) => error.field === 'name')
              ? 'border-red-500! bg-red-50!'
              : ''
          }`}
        />
        {state?.errors.find((error) => error.field === 'name') && (
          <p className="form-error">
            {state?.errors.find((error) => error.field === 'name')?.message}
          </p>
        )}
      </div>
      <div>
        <input
          type="email"
          name="email"
          placeholder="Your email"
          defaultValue={state?.input?.email}
          className={`${
            state?.errors.find((error) => error.field === 'email')
              ? 'border-red-500! bg-red-50!'
              : ''
          }`}
        />
        {state?.errors.find((error) => error.field === 'email') && (
          <p className="form-error">
            {state?.errors.find((error) => error.field === 'email')?.message}
          </p>
        )}
      </div>
      <div>
        <input
          type="password"
          name="password"
          placeholder="Your password"
          className={`${
            state?.errors.find((error) => error.field === 'password')
              ? 'border-red-500! bg-red-50!'
              : ''
          }`}
        />
        {state?.errors.find((error) => error.field === 'password') && (
          <p className="form-error">
            {state?.errors.find((error) => error.field === 'password')?.message}
          </p>
        )}
      </div>
      <div className="flex justify-center">
        <button type="submit" className="button button--default">
          {isPending ? 'Please wait...' : 'Sign up'}
        </button>
      </div>
    </form>
  )
}
