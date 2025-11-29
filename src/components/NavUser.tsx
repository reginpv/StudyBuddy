'use client'

import Link from 'next/link'
import { useSession, signOut } from 'next-auth/react'
import ButtonUploadFile from './ButtonUploadFile'

export default function NavUser() {
  // Sessions
  const { data: session, status } = useSession()

  if (status === 'loading') {
    return null
  }

  return (
    <ul className="flex items-center gap-2">
      {status === 'authenticated' ? (
        <>
          <li>
            <ButtonUploadFile />
          </li>
          <li>
            <button
              onClick={() => signOut()}
              className="button button--default"
            >
              Logout
            </button>
          </li>
        </>
      ) : (
        <>
          {[
            {
              label: 'Login',
              href: '/login',
            },
            {
              label: 'Signup',
              href: '/signup',
            },
          ].map((item, i) => (
            <li key={i}>
              <Link href={item.href} className="button button--default">
                {item.label}
              </Link>
            </li>
          ))}
        </>
      )}
    </ul>
  )
}
