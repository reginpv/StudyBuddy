import FormChat from '@/components/forms/FormChat'
import DefaultTemplate from '@/templates/default'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/authOptions'

export default async function Home() {
  // Session
  const session = await getServerSession(authOptions)

  return (
    <DefaultTemplate>
      <div className="container mx-auto p-5 flex flex-col gap-10 items-center justify-center">
        {/** User */}
        {session && session.user && (
          <div>
            <div>
              <h1 className="text-3xl font-bold">
                Hello, {session.user.name}!
              </h1>
            </div>
          </div>
        )}

        {/** Form chat */}
        <FormChat className="max-w-md w-full mx-auto" />
      </div>
    </DefaultTemplate>
  )
}
