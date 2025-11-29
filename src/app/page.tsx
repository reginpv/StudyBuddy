import FormChat from '@/components/forms/FormChat'
import DefaultTemplate from '@/templates/default'

export default function Home() {
  return (
    <DefaultTemplate>
      <div className="container mx-auto p-5">
        <FormChat className="max-w-md mx-auto" />
      </div>
    </DefaultTemplate>
  )
}
