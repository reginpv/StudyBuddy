import { Toaster } from 'react-hot-toast'

export default function TemplateBare({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <section className="min-h-dvh flex flex-col items-center justify-center p-5">
      {children}
      <Toaster position="bottom-right" />
    </section>
  )
}
