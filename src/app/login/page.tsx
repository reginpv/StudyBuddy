import FormLogin from '@/components/forms/FormLogin'
import TemplateBare from '@/templates/Bare'
import Link from 'next/link'

export default function Login() {
  return (
    <TemplateBare>
      <div className="container">
        <div className="max-w-xl mx-auto flex flex-col gap-5">
          <h1 className="text-2xl font-bold text-center">Login</h1>
          <FormLogin />
          <div className="flex flex-col gap-5 text-center">
            <hr className="text-gray-300" />
            <span>
              Dont have an account?{' '}
              <Link href="/signup" className="underline">
                Click here
              </Link>
              <p>-</p>
              <Link href="/" className="underline">
                Back to Home
              </Link>
            </span>
          </div>
        </div>
      </div>
    </TemplateBare>
  )
}
