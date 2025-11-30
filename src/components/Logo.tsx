import Link from 'next/link'

export default function Logo({ className }: { className?: string }) {
  return (
    <Link
      href="/"
      className={`tracking-[-2px] font-bold text-2xl ${className}`}
    >
      StudyBuddy
    </Link>
  )
}
