'use client'

import { useState } from 'react'
import Modal from '@/components/Modal'
import FormUploadFile from './forms/FormUploadFile'

export default function ButtonUploadFile() {
  const [showModal, setShowModal] = useState(false)

  return (
    <>
      <button
        onClick={() => setShowModal(true)}
        className="button button--default"
      >
        Upload file
      </button>
      {showModal && (
        <Modal
          title={`Upload file`}
          isOpen={showModal}
          onClose={() => setShowModal(false)}
        >
          <div className="flex flex-col gap-5">
            <p className="text-sm">Accepts PDF file only.</p>
            <FormUploadFile />
          </div>
        </Modal>
      )}
    </>
  )
}
