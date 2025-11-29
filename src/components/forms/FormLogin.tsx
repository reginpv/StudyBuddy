export default function FormLogin() {
  return (
    <form className="flex flex-col gap-3">
      <div>
        <input type="email" name="email" placeholder="Your email" />
      </div>
      <div>
        <input type="password" name="password" placeholder="Your password" />
      </div>
      <div className="flex justify-center">
        <button type="submit" className="button button--default">
          Login
        </button>
      </div>
    </form>
  )
}
