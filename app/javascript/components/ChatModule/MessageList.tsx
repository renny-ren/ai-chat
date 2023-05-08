import React, { FC, useEffect, useState, useRef } from "react"
import type { MessageInterface } from "./types"
import { CDN_HOST } from "shared/constants"
import Markdown from "marked-react"
import SyntaxHighlighter from "react-syntax-highlighter"
// import { tomorrowNight, ocean, atomOneDark, hybrid, railscasts } from "react-syntax-highlighter/dist/esm/styles/hljs"
import { hybrid } from "react-syntax-highlighter/dist/esm/styles/hljs"
import currentUser from "stores/current_user_store"
import AudioButton from "components/common/AudioButton"
import CopyButton from "components/common/CopyButton"

interface MessageListProps {
  messages: MessageInterface[]
  messagesEndRef: any
  isLoading: boolean
  model?: any
}

const MessageList: FC<MessageListProps> = ({ messages, messagesEndRef, isLoading, model }) => {
  const [playingMessageId, setPlayingMessageId] = useState(0)
  const responseListRef = useRef<HTMLDivElement>(null)
  const audioRef = useRef(null)

  const isSelf = (message) => {
    return message.role === "user"
  }

  const renderer = {
    code(snippet, language) {
      return (
        <div className="mt-3 shadow-md">
          <div className="flex items-center relative text-gray-200 bg-gray-600 px-4 py-2 text-xs font-sans justify-between rounded-t-md">
            <span>{language}</span>
            <CopyButton color="#bfbfbf" className="flex ml-auto gap-2 rounded-md" label="Copy code" content={snippet} />
          </div>
          <SyntaxHighlighter
            children={snippet}
            key={this.elementId}
            language={language}
            style={hybrid}
            customStyle={{ padding: "1rem" }}
            className="mb-3 rounded-b-md"
            codeTagProps={{ className: "my-2" }}
          />
        </div>
      )
    },
    list(body, ordered) {
      return ordered ? (
        <ol key={Math.random().toString(16)} className="c-ordered-list">
          {body}
        </ol>
      ) : (
        <ul key={Math.random().toString(16)} className="c-list">
          {body}
        </ul>
      )
    },
  }

  const playAudio = (src) => {
    audioRef.current.src = src
    audioRef.current.play()
    audioRef.current.onended = () => setPlayingMessageId(0)
  }

  const pauseAudio = () => {
    if (audioRef.current && !audioRef.current.paused) {
      audioRef.current.pause()
    }
  }

  return (
    <>
      <audio ref={audioRef}></audio>
      <div className="flex flex-col items-center text-sm h-full dark:bg-gray-800 overflow-y-auto">
        {messages.map((msg, i) => {
          return isSelf(msg) ? (
            <div
              className="w-full border-b border-gray/10 dark:border-gray-900/50 text-gray-800 dark:text-gray-100 group dark:bg-gray-800"
              key={i}
            >
              <div className="text-base gap-4 md:gap-6 m-auto md:max-w-2xl lg:max-w-2xl xl:max-w-3xl p-4 md:py-6 flex lg:px-0">
                <div className="w-[30px] h-[30px] flex flex-col relative items-end">
                  <img className="h-10 w-10 rounded-sm aspect-square" src={currentUser.avatarUrl()} />
                </div>
                <div className="relative flex w-[calc(100%-50px)] flex-col gap-1 md:gap-3 lg:w-[calc(100%-115px)]">
                  <div className="min-h-[20px] flex flex-col items-start gap-4 whitespace-pre-wrap">
                    <div className="prompt-content max-w-full overflow-auto">{msg.content}</div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div
              className="w-full border-b border-gray/10 dark:border-gray-900/50 text-gray-800 dark:text-gray-100 group bg-gray-50/75 dark:bg-[#444654]"
              key={i}
            >
              <div className="text-base gap-4 md:gap-6 m-auto md:max-w-2xl lg:max-w-2xl xl:max-w-3xl p-4 md:py-6 flex lg:px-0">
                <div className="w-[30px] h-[30px] flex-shrink-0 flex flex-col relative items-end">
                  <img
                    className="h-10 w-10 rounded-sm aspect-square"
                    src={model.avatar_url || `${CDN_HOST}/assets/chatgpt_logo.png`}
                  />
                </div>
                <div className="relative flex w-[calc(100%-50px)] flex-col gap-1 md:gap-3 lg:w-[calc(100%-115px)]">
                  <div className="min-h-[20px] flex flex-col items-start gap-4 whitespace-pre-wrap">
                    <div
                      className={`markdown max-w-full overflow-auto ${
                        isLoading && i === messages.length - 1 ? "ai-response-loading" : ""
                      } ${msg.error ? "error-response" : ""}`}
                    >
                      {msg.content ? <Markdown value={msg.content} renderer={renderer} /> : <p></p>}
                    </div>
                  </div>
                </div>
                <div className="hidden md:block flex justify-between">
                  <div className="flex">
                    <CopyButton
                      className="p-1 rounded-md hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-gray-200"
                      content={msg.content}
                    />
                    <AudioButton
                      className="p-1 rounded-md hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-gray-200"
                      message={msg}
                      playAudio={playAudio}
                      pauseAudio={pauseAudio}
                      playingMessageId={playingMessageId}
                      setPlayingMessageId={setPlayingMessageId}
                      voice={model.voice || ""}
                    />
                  </div>
                </div>
              </div>
            </div>
          )
        })}
        <div ref={messagesEndRef}></div>
        <div className="w-full h-16 flex-shrink-0"></div>
      </div>
    </>
  )
}

export default MessageList
