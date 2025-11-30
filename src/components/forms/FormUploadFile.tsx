'use client'

import { useActionState } from 'react'
import { uploadAndEmbedFile } from '@/lib/actions/embedding'
import { useState } from 'react'

// 1. Define the initial state for the Server Action response
const initialState = {
  message: '',
  error: '',
  success: false,
}

export default function FormUploadFile() {
  // 3. Bind the Server Action to the form state
  const [state, handleSubmit, isPending] = useActionState(
    uploadAndEmbedFile,
    initialState
  )

  // 4. Local state for immediate client-side validation errors
  const [clientError, setClientError] = useState<string | null>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    setClientError(null) // Reset errors

    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        // 5MB Limit
        setClientError('File is too large. Max size is 5MB.')
        e.target.value = '' // Clear the input
      }
    }
  }

  return (
    <form
      data-loading={isPending}
      action={handleSubmit}
      className="flex flex-col gap-5 rounded-lg bg-white "
      noValidate
    >
      <div>
        <label className="block text-sm font-medium text-gray-700 "></label>
        <input
          type="file"
          name="file"
          accept=".pdf,.txt,.md"
          required
          onChange={handleFileChange}
          className="block w-full text-sm text-gray-500
            file:mr-4 file:py-2 file:px-4
            file:rounded-md file:border-0
            file:text-sm file:font-semibold
            file:bg-blue-50 file:text-blue-700
            hover:file:bg-blue-100"
        />
        <p className="mt-1 text-xs text-gray-500 ">
          Max 5MB. This will be added to your AI knowledge base.
        </p>
      </div>

      {/** Error / Success Feedback Section */}

      {clientError && <p className="alert alert--error">{clientError}</p>}

      {state?.error && (
        <p className="alert alert--error">Error: {state.error}</p>
      )}

      {state?.success && (
        <p className="text-green-600 text-sm bg-green-50 p-2 rounded border border-green-100">
          ✅ {state.message}
        </p>
      )}

      <div className="flex justify-center">
        <button
          type="submit"
          disabled={isPending}
          className={`button button--default ${
            isPending ? 'opacity-50 cursor-wait' : ''
          }`}
        >
          {isPending ? 'Uploading & Embedding...' : 'Upload Knowledge'}
        </button>
      </div>
    </form>
  )
}
