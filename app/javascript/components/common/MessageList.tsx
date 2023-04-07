import React, { useEffect, useState, useRef } from "react"
import currentUser from "stores/current_user_store"
import Markdown from "marked-react"
import SyntaxHighlighter from "react-syntax-highlighter"
import { arduinoLight } from "react-syntax-highlighter/dist/esm/styles/hljs"

interface MessageListProps {
  messages: any
  isLoading: boolean
  gptName?: string
}

const MessageList: React.FC<MessageListProps> = ({ messages, isLoading, gptName }) => {
  const messagesEndRef = useRef(null)

  const renderer = {
    code(snippet, language) {
      return (
        <SyntaxHighlighter
          children={snippet}
          key={this.elementId}
          language={language}
          style={arduinoLight}
          className="my-2"
          codeTagProps={{ className: "my-2" }}
        />
      )
    },
    list(body, ordered) {
      return ordered ? <ol className="c-ordered-list">{body}</ol> : <ul className="c-list">{body}</ul>
    },
  }

  const isSelf = (message) => {
    if (currentUser.isSignedIn()) {
      return message.role === "user"
    } else {
      return false
    }
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  return (
    <>
      <div className="message-list-container overflow-auto" style={{ scrollbarGutter: "stable both-edges" }}>
        <div className="grid grid-cols-12 gap-y-2">
          {messages.map((message, i) => {
            return isSelf(message) ? (
              <div key={i} className="col-start-2 md:col-start-4 col-end-13 p-3 rounded-lg">
                <div className="flex items-start justify-start flex-row-reverse">
                  <img className="h-10 w-10 cursor-pointer rounded-full aspect-square mt-1" src={currentUser.avatarUrl()} />
                  <div className="flex flex-col gap-1 items-end">
                    <div className="flex items-baseline mr-3">
                      <div className="text-sm font-medium dark:text-white">{currentUser.nickname()}</div>
                    </div>
                    <div className="relative ml-4 mr-2 text-sm bg-indigo-100 py-2 px-4 shadow rounded-xl">
                      <div className="whitespace-pre-line">{message.content}</div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div key={i} className="col-start-1 col-end-12 md:col-end-10 p-3 rounded-lg">
                <div className="flex flex-row items-start">
                  <div className="relative mt-1">
                    <div className="inline-block h-10 w-10">
                      <img className="rounded-full aspect-square mt-1" src={gon.gpt_user.avatar_url} />
                    </div>
                  </div>

                  <div className="flex flex-col gap-1 max-w-full">
                    <div className="flex items-baseline">
                      <div className="text-sm font-medium ml-3 dark:text-white">{gptName || "ChatGPT"}</div>
                    </div>
                    <div
                      className={`markdown ai-response relative ml-2 mr-4 text-sm bg-white py-2 px-4 shadow rounded-xl break-words whitespace-pre-line max-w-max ${
                        isLoading && i === messages.length - 1 ? "ai-response-loading" : ""
                      }`}
                    >
                      {message.content ? <Markdown value={message.content} renderer={renderer} /> : <p></p>}
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
        <div ref={messagesEndRef}></div>
        <div className="w-full h-2 sm:h-6 flex-shrink-0"></div>
      </div>
    </>
  )
}

export default MessageList