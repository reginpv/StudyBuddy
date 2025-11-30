import FormChat from '@/components/forms/FormChat'
import DefaultTemplate from '@/templates/default'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/authOptions'
import { getFilesByUser } from '@/lib/actions/file'
import type { File } from '@prisma/client'
import Files from '@/components/Files'
import Link from 'next/link'

export default async function Home() {
  // Session
  const session = (await getServerSession(authOptions)) ?? null

  // Get files
  let files: File[] = []
  if (session) {
    const resFiles = await getFilesByUser(session.user.id)
    files = resFiles?.success ? resFiles.payload : []
  }

  return (
    <DefaultTemplate>
      <div className="container mx-auto p-5 flex flex-col gap-10 items-center justify-center">
        {/** User */}
        {session && session.user ? (
          <div className="max-w-md w-full mx-auto text-center">
            <div className="flex flex-col gap-2">
              <h1 className="text-3xl font-bold">
                Hello, <span className="capitalize">{session.user.name}!</span>
              </h1>
              {files && files.length === 0 && (
                <p>
                  Upload your first PDF to let Study Buddy start helping you
                  study smarter!
                </p>
              )}
            </div>
          </div>
        ) : (
          <div className="max-w-md w-full mx-auto text-center">
            <div className="flex flex-col gap-2">
              <h1 className="text-3xl font-bold">Hello, Guest!</h1>
              <p>
                Welcome to Study Buddy!{' '}
                <Link href="/signup" className="underline">
                  Create your free account
                </Link>{' '}
                and upload your notes to get instant AI-powered study help.
              </p>
            </div>
          </div>
        )}

        {/** Files */}
        {session && session.user && files.length > 0 && <Files files={files} />}

        {/** Form chat */}
        <FormChat className="max-w-md w-full mx-auto" />
      </div>
    </DefaultTemplate>
  )
}
