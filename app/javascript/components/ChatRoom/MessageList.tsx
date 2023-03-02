import React, { useEffect } from "react"
import currentUser from "stores/current_user_store"
import hljs from "highlight.js"
import ReactMarkdown from "react-markdown"

const MessageList = ({ messages }) => {
  useEffect(() => {
    hljs.highlightAll()
  }, [messages])

  const includeCode = (text: string | null | undefined) => {
    const regexp = /^(?:\s{4}|\t).+/gm
    return !!(text?.includes(" = ") || text?.match(regexp))
  }

  return (
    <>
      {messages.map((message, i) => {
        return message.user_id === currentUser.id() ? (
          <div key={i} className="col-start-6 col-end-13 p-3 rounded-lg">
            <div className="flex items-center justify-start flex-row-reverse">
              <img className="inline-block h-10 w-10 rounded-full ring-2 ring-white" src={currentUser.avatarUrl()} />
              <div className="relative mr-3 text-sm bg-indigo-100 py-2 px-4 shadow rounded-xl">
                <div className="flex items-center">
                  {message.mentioned_users_nickname.map((name) => `@${name}`)} {message.content}
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div key={i} className="col-start-1 col-end-10 md:col-end-8 p-3 rounded-lg">
            <div className="flex flex-row">
              <img className="inline-block h-10 w-10 rounded-full ring-2 ring-white" src={message.user_avatar_url} />
              <div className="relative ml-3 text-sm bg-white py-2 px-4 shadow rounded-xl break-words whitespace-pre-line">
                <div>
                  <ReactMarkdown
                    className={`${message.loading && "ai-response-loading"}`}
                    children={`${message.mentioned_users_nickname.map((name) => `@${name}`)} ${message.content}`}
                    components={{
                      code({ className, children }) {
                        return <code className={className}>{children}</code>
                      },
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        )
      })}
    </>
  )
}

export default MessageList
