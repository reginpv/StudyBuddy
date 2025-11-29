import Link from 'next/link'
import NavUser from './NavUser'

export default function Header() {
  return (
    <header className="p-5">
      <div className="container mx-auto flex gap-5 items-center justify-between">
        <div className="text-2xl font-bold">
          <Link href="/">MyApp</Link>
        </div>
        <div className="flex items-center">
          <NavUser />
        </div>
      </div>
    </header>
  )
}
