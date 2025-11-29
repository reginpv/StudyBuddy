'use client'

import { useChat } from '@ai-sdk/react'
import { useEffect, useRef, useState } from 'react'
import { UserRound, Bot } from 'lucide-react'

// Define props to accept the status
interface FormChatProps {
  className?: string
  isLoggedIn?: boolean
  hasFiles?: boolean
}

export default function FormChat({
  className,
  isLoggedIn,
  hasFiles,
}: FormChatProps) {
  // AI SDK
  const { messages, sendMessage } = useChat({
    onError: (error) => {
      console.log('Error: ', error)
      setError(error.toString())
    },
  })

  // Ref for auto-scrolling
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // State
  const [error, setError] = useState('')
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  // Util
  // Scroll to bottom whenever messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  async function handleChat(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()

    if (!input) return

    try {
      setIsLoading(true)
      await sendMessage({ text: input })
      setInput('')
    } catch (error) {
      console.log(error)
      setError(error.toString())
    } finally {
      setIsLoading(false)
    }
  }

  // Handle Enter key
  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault() // Prevent newline

      // Trigger form submission
      const form = e.currentTarget.form
      if (form && input.trim()) {
        form.requestSubmit()
      }
    }
  }

  return (
    <div className={`flex flex-col gap-2 h-full ${className}`}>
      {/* Message Display Area */}
      {messages && messages.length > 0 && (
        <div className="flex-1 flex flex-col gap-1">
          {messages.map((message) => (
            <div
              data-loading={isLoading}
              key={message.id}
              className="flex gap-3  p-2"
            >
              {message.role === 'user' ? (
                <div className="h-10 w-10 aspect-square rounded-full border flex items-center justify-center bg-gray-300">
                  <UserRound />
                </div>
              ) : (
                <div className="h-10 w-10 aspect-square rounded-full border flex items-center justify-center bg-gray-300">
                  <Bot />
                </div>
              )}
              {message.parts.map((part, i) => {
                switch (part.type) {
                  case 'text':
                    return (
                      <div
                        key={`${message.id}-${i}`}
                        className="bg-gray-200 flex flex-col items-center p-3 rounded-md"
                      >
                        {part.text}
                      </div>
                    )
                }
              })}
            </div>
          ))}
          {/** Mark end of chat */}
          <div ref={messagesEndRef} />
        </div>
      )}

      {/* --- 4. The Form --- */}
      <form
        data-loading={isLoading}
        onSubmit={(e) => handleChat(e)}
        className={`${className} flex-1 sticky bottom-[40px] flex flex-col gap-2 bg-white`}
      >
        <div className="form-control">
          <textarea
            placeholder="What do you want to know?"
            value={input} // Bind to SDK
            className="w-full p-2 border rounded resize-none" // Added basic styling
            onChange={(e) => setInput(e.currentTarget.value)}
            onKeyDown={handleKeyDown} // Handle Enter key
          ></textarea>
        </div>

        {/* Error */}
        {error && <div className="alert alert--error">{error}</div>}

        <div className="flex justify-center mt-2">
          <button
            type="submit"
            disabled={isLoading}
            className="button button--default"
          >
            {isLoading ? 'Thinking...' : 'Send'}
          </button>
        </div>
      </form>
    </div>
  )
}
