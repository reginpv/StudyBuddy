import FormSignup from '@/components/forms/FormSignup'
import TemplateBare from '@/templates/Bare'
import Link from 'next/link'

export default function Signup() {
  return (
    <TemplateBare>
      <div className="container">
        <div className="max-w-xl mx-auto flex flex-col gap-5">
          <h1 className="text-2xl font-bold text-center">Signup</h1>
          <FormSignup />
          <div className="flex flex-col gap-5 text-center">
            <hr className="text-gray-300" />
            <span>
              Already have an account?{' '}
              <Link href="/login" className="underline">
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
