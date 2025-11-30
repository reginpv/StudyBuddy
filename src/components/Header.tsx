import Link from 'next/link'
import NavUser from './NavUser'

export default function Header() {
  return (
    <header className="p-5 sticky top-0 bg-white">
      <div className="container mx-auto flex gap-5 items-center justify-between">
        <div className="text-2xl font-bold">
          <Link href="/" className="tracking-[-2px] font-bold">
            StudyBuddy
          </Link>
        </div>
        <div className="flex items-center">
          <NavUser />
        </div>
      </div>
    </header>
  )
}
