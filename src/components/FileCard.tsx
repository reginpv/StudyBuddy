'use client'

import { useState } from 'react'
import Image from 'next/image'
import type { File } from '@prisma/client'
import Modal from '@/components/Modal'
import { format } from 'date-fns'
import FormDeleteFile from './forms/FormDeleteFile'

export default function FileCard({ file }: { file: File }) {
  // State
  const [showModal, setShowModal] = useState(false)

  return (
    <>
      <div
        onClick={() => setShowModal(true)}
        title={file.name}
        className="group relative bg-gray-100 p-3 rounded-lg overflow-hidden hover:bg-gray-200 animated cursor-pointer flex flex-col gap-2"
      >
        <div className=" text-center flex justify-center">
          <Image
            src="/icon-pdf.png"
            width={64}
            height={64}
            alt={file.name}
            className="opacity-75 group-hover:opacity-100 animated"
          />
        </div>
        <div className="text-sm two-line">{file.name}</div>
      </div>
      {showModal && (
        <Modal
          title={file.name}
          isOpen={showModal}
          onClose={() => setShowModal(false)}
        >
          <div className="flex flex-col gap-5">
            <div className="flex justify-between items-center">
              <div>{format(file.createdAt, 'MMM dd, yyyy')}</div>

              <FormDeleteFile setShowModal={setShowModal} file={file} />
            </div>
            <div className="w-full h-[50dvh]">
              <iframe
                src={file.url}
                width="100%"
                height="100%"
                style={{ border: 'none' }}
              ></iframe>
            </div>
          </div>
        </Modal>
      )}
    </>
  )
}
