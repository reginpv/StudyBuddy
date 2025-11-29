import Link from 'next/link'

export default function DefaultTemplate({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className=" min-h-dvh flex flex-col">
      <header className="p-5">
        <div className="container mx-auto flex gap-5 justify-between">
          <div className="text-2xl font-bold">
            <Link href="/">MyApp</Link>
          </div>
          <div className="flex items-center">
            <ul className="flex items-center gap-2">
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
            </ul>
          </div>
        </div>
      </header>
      <main className="flex-1 flex items-center justify-center ">
        {children}
      </main>
      <footer className="container mx-auto flex justify-center text-sm p-3">
        Copyright MyApp
      </footer>
    </div>
  )
}
