import React, { FC, useEffect, useRef } from "react"
import type { MessageInterface } from "./types"
import { CDN_HOST } from "shared/constants"
import Markdown from "marked-react"
import SyntaxHighlighter from "react-syntax-highlighter"
import { tomorrowNight, ocean, atomOneDark, nord, hybrid } from "react-syntax-highlighter/dist/esm/styles/hljs"
import currentUser from "stores/current_user_store"

interface MessageListProps {
  messages: MessageInterface[]
  messagesEndRef: any
  isLoading: boolean
}

const MessageList: FC<MessageListProps> = ({ messages, messagesEndRef, isLoading }) => {
  const responseListRef = useRef<HTMLDivElement>(null)

  const isSelf = (message) => {
    return message.role === "user"
  }

  const renderer = {
    code(snippet, language) {
      return (
        <SyntaxHighlighter
          children={snippet}
          key={this.elementId}
          language={language}
          style={hybrid}
          className="my-2"
          codeTagProps={{ className: "my-2" }}
        />
      )
    },
    list(body, ordered) {
      return ordered ? <ol className="c-ordered-list">{body}</ol> : <ul className="c-list">{body}</ul>
    },
  }

  return (
    <div className="flex flex-col items-center text-sm h-full dark:bg-gray-800 overflow-y-auto">
      {messages.map((msg, i) => (
        <div
          className={
            "w-full border-b border-gray/10 dark:border-gray-900/50 text-gray-800 dark:text-gray-100 group  " +
            (isSelf(msg) ? "dark:bg-gray-800" : "bg-gray-50/75 dark:bg-[#444654]")
          }
          key={i}
        >
          <div className="text-base gap-4 md:gap-6 m-auto md:max-w-2xl lg:max-w-2xl xl:max-w-3xl p-4 md:py-6 flex lg:px-0">
            <div className="w-[30px] h-[30px] flex flex-col relative items-end">
              <img
                className="h-10 w-10 rounded-sm aspect-square"
                src={isSelf(msg) ? currentUser.avatarUrl() : `${CDN_HOST}/assets/chatgpt_logo.png`}
              />
            </div>
            <div className="relative flex w-[calc(100%-50px)] flex-col gap-1 md:gap-3 lg:w-[calc(100%-115px)]">
              <div className="min-h-[20px] flex flex-col items-start gap-4 whitespace-pre-wrap">
                <div
                  className={`prompt-content max-w-full ${msg.isLoading ? "ai-response-loading" : ""} ${
                    msg.error ? "error-response" : ""
                  }`}
                >
                  {msg.content ? <Markdown value={msg.content} renderer={renderer} /> : <p></p>}
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
      <div ref={messagesEndRef}></div>
      <div className="w-full h-24 flex-shrink-0"></div>
    </div>
  )
}

export default MessageList