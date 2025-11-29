'use client'

export default function FormUploadFile() {
  return (
    <form className="flex flex-col gap-5">
      <div>
        <input type="file" name="file" placeholder="File for LLM" />
      </div>

      {/** System error */}

      {/** */}
      <div className="flex justify-center">
        <button type="submit" className="button button--default">
          Upload
        </button>
      </div>
    </form>
  )
}
