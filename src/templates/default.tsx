import Footer from '@/components/Footer'
import Header from '@/components/Header'
import { Toaster } from 'react-hot-toast'

export default function DefaultTemplate({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-dvh flex flex-col">
      <Header />
      <main className="flex-1 flex items-center justify-center ">
        {children}
      </main>
      <Footer />
      <Toaster position="bottom-right" />
    </div>
  )
}
