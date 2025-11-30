'use client'

import { deleteFile } from '@/lib/actions/file'
import type { File } from '@prisma/client'
import { useActionState, useEffect } from 'react'
import toast from 'react-hot-toast'

export default function FormDeleteFile({
  setShowModal,
  file,
}: {
  setShowModal: React.Dispatch<React.SetStateAction<boolean>>
  file: File
}) {
  const [state, handleSubmit, isPending] = useActionState(deleteFile, null)

  //
  useEffect(() => {
    if (state?.success) {
      setShowModal(false)
      toast.success(state.message)
    } else {
      if (state?.errors.length > 0) {
        state.errors.forEach((error) => {
          toast.error(error.message)
        })
      }
    }
  }, [state])

  return (
    <form data-loading={isPending} action={handleSubmit}>
      <input type="hidden" name="file" value={JSON.stringify(file)} />

      <button className="button button--default">
        {isPending ? 'Deleting...' : 'Delete'}
      </button>
    </form>
  )
}
