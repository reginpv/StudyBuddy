import FormChat from '@/components/forms/FormChat'
import DefaultTemplate from '@/templates/default'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/authOptions'
import { getFilesByUser } from '@/lib/actions/file'
import type { File } from '@prisma/client'
import Image from 'next/image'
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
            <div>
              <h1 className="text-3xl font-bold">
                Hello, <span className="capitalize">{session.user.name}!</span>
              </h1>
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
        {session && session.user && files.length > 0 && (
          <div className="max-w-md w-full mx-auto">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-5 ">
              {files.map((file: File, i: number) => (
                <div
                  title={file.name}
                  key={i}
                  className="group bg-gray-100 p-3 rounded hover:bg-gray-200 animated cursor-pointer flex flex-col gap-2"
                >
                  <div className="text-center flex justify-center">
                    <Image
                      src="/icon-pdf.png"
                      width={64}
                      height={64}
                      alt={file.name}
                      className="opacity-75 group-hover:opacity-100 animated"
                    />
                  </div>
                  <div className="text-sm two-line">{file.name}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/** Form chat */}
        <FormChat className="max-w-md w-full mx-auto" />
      </div>
    </DefaultTemplate>
  )
}
