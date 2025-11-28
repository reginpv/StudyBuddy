export default function FormChat({ className }: { className?: string }) {
  return (
    <form className={className}>
      <div className="form-control">
        <textarea placeholder="What do you want to know?"></textarea>
      </div>
      <div className="flex justify-center">
        <button type="submit" className="button button--default">
          Send
        </button>
      </div>
    </form>
  )
}
