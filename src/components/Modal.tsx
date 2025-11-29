'use client'

import React, { useEffect } from 'react'
import { createPortal } from 'react-dom'
import { X } from 'lucide-react'

interface ModalProps {
  title?: string
  isOpen: boolean
  onClose: () => void
  children: React.ReactNode
}

const Modal: React.FC<ModalProps> = ({ title, isOpen, onClose, children }) => {
  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  if (!isOpen) return null

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    // Only close if clicking the backdrop itself, not its children
    if (e.target === e.currentTarget) {
      onClose()
    }
  }

  const modalContent = (
    <div
      className="fixed inset-0 z-9999 flex items-center justify-center bg-black/30 p-5 "
      onClick={handleBackdropClick}
      style={{ isolation: 'isolate' }}
    >
      {/* Modal content */}
      <div className="relative bg-white rounded-lg shadow-lg max-w-md w-full h-auto max-h-[90dvh] ">
        <button
          className="absolute cursor-pointer rounded-full aspect-square p-2 border border-white bg-neutral-700 -top-3 -right-3 text-white text-xl"
          onClick={onClose}
        >
          <X />
        </button>
        {/** Title */}
        {title && (
          <div className="font-bold p-5 border-b border-border">{title}</div>
        )}
        <div className="p-5 max-h-[83dvh] overflow-y-auto">{children}</div>
      </div>
    </div>
  )

  // Render the modal at the document body level
  return createPortal(modalContent, document.body)
}

export default Modal
