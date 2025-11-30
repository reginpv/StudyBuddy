import Logo from '@/components/Logo'
import NavUser from '@/components/NavUser'

export default function Header() {
  return (
    <header className="p-5 sticky top-0 bg-white h-20">
      <div className="container mx-auto flex gap-5 items-center justify-between">
        <div className="text-2xl font-bold">
          <Logo />
        </div>
        <div className="flex items-center">
          <NavUser />
        </div>
      </div>
    </header>
  )
}
