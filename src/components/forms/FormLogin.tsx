'use client'

import { useState, useRef, useEffect } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'

export default function FormLogin() {
  // Refs
  const formRef = useRef<HTMLFormElement>(null)

  // Hooks
  const router = useRouter()
  const { push: redirect } = router

  // Local state
  const [state, setState] = useState({
    message: '',
    success: false,
    errors: {
      email: '',
      password: '',
      system: '',
    },
    input: {
      email: '',
      password: '',
    },
  })
  const [pending, setPending] = useState(false)

  useEffect(() => {
    console.log(state)
  }, [state])

  // Handle
  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()

    setPending(true)

    // Data
    // ?? undefined or null check like if (!formRef.current) return
    const formData = new FormData(formRef.current ?? undefined)
    const email = formData.get('email')?.toString().trim()
    const password = formData.get('password')?.toString().trim()

    if (!email || !password) {
      setState({
        message: '',
        success: false,
        errors: {
          email: !email ? 'Email is required.' : '',
          password: !password ? 'Password is required.' : '',
          system: '',
        },
        input: {
          email: email ?? '',
          password: password ?? '',
        },
      })
      setPending(false)
      return
    }

    try {
      // NextAuth
      const res = await signIn('credentials', {
        email,
        password,
        redirect: false,
      })

      console.log('RES: ', res)

      if (res?.ok === true) {
        setState({
          message: 'Logged in successfully!',
          success: true,
          errors: {
            email: '',
            password: '',
            system: '',
          },
          input: {
            email: '',
            password: '',
          },
        })

        // Fetch the session to get user role
        const sessionRes = await fetch('/api/auth/session')
        const session = await sessionRes.json()

        console.log('Session: ', session)

        // Do some toast
        toast.success('Logged in successfully! Redirecting...')

        // Wait 1 second before redirecting
        setTimeout(() => {
          //
          redirect(`/`)
        }, 1000)

        //
      } else {
        console.log('Failed to login: ', res)
        setState({
          message: 'Login failed.',
          success: false,
          errors: {
            email: '',
            password: '',
            system: 'Login failed. Please check your credentials.',
          },
          input: {
            email: email ?? '',
            password: password ?? '',
          },
        })
      }

      //
    } catch (error) {
      //
      console.log(error)

      //
      setState({
        message: '',
        success: false,
        errors: {
          email: '',
          password: '',
          system: 'System error, please contact admin.',
        },
        input: {
          email: email ?? '',
          password: password ?? '',
        },
      })
    } finally {
      setPending(false)
    }
  }

  return (
    <form
      data-loading={pending}
      ref={formRef}
      onSubmit={handleSubmit}
      noValidate
      className="flex flex-col gap-3"
    >
      <div>
        <input
          type="email"
          name="email"
          placeholder="Your email"
          defaultValue={state?.input?.email}
          className={`${
            state?.errors.email ? 'border-red-500! bg-red-50!' : ''
          }`}
        />
        {state?.errors.email && (
          <p className="form-error">{state?.errors.email}</p>
        )}
      </div>
      <div>
        <input
          type="password"
          name="password"
          placeholder="Your password"
          defaultValue={state?.input?.password}
          className={`${
            state?.errors.password ? 'border-red-500! bg-red-50!' : ''
          }`}
        />
        {state?.errors.password && (
          <p className="form-error">{state?.errors.password}</p>
        )}
      </div>

      {/** System error */}
      {state?.errors?.system && (
        <p className="alert alert--error">{state?.errors?.system}</p>
      )}

      <div className="flex justify-center">
        <button type="submit" className="button button--default">
          {pending ? 'Please wait...' : 'Log in'}
        </button>
      </div>
    </form>
  )
}
