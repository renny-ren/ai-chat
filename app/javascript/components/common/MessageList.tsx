import React, { useEffect, useState, useRef } from "react"
import currentUser from "stores/current_user_store"
import Markdown from "marked-react"
import SyntaxHighlighter from "react-syntax-highlighter"
import { github, arduinoLight } from "react-syntax-highlighter/dist/esm/styles/hljs"
import AudioButton from "./AudioButton"
import { Tooltip } from "antd"
import { ExclamationCircleOutlined } from "@ant-design/icons"
import CopyButton from "components/common/CopyButton"

interface MessageListProps {
  messages: any
  isLoading: boolean
  gptName?: string
  voice?: string
  avatarUrl?: string
}

const MessageList: React.FC<MessageListProps> = ({ messages, isLoading, gptName, voice, avatarUrl }) => {
  const [playingMessageId, setPlayingMessageId] = useState(0)
  const messagesEndRef = useRef(null)
  const audioRef = useRef(null)

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const renderer = {
    code(snippet, language) {
      return (
        <div key={Math.random().toString(16)} className="mt-3 shadow-sm">
          <div className="flex items-center relative text-gray-600 bg-gray-200 px-4 py-2 text-xs font-sans justify-between rounded-t-md">
            <span>{language}</span>
            <CopyButton className="flex ml-auto gap-2 rounded-md hover:text-gray-700" label="Copy code" content={snippet} />
          </div>
          <SyntaxHighlighter
            children={snippet}
            key={this.elementId}
            language={language}
            style={github}
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

  const isSelf = (message) => {
    if (currentUser.isSignedIn()) {
      return message.role === "user"
    } else {
      return false
    }
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

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  return (
    <>
      <audio ref={audioRef}></audio>
      <div className="message-list-container c-scrollbar overflow-auto" style={{ scrollbarGutter: "stable both-edges" }}>
        <div className="grid grid-cols-12 gap-y-2">
          {messages.map((message, i) => {
            return isSelf(message) ? (
              <div key={i} className="col-start-2 md:col-start-4 col-end-13 p-3 rounded-lg">
                <div className="flex items-start justify-start flex-row-reverse">
                  <img className="h-10 w-10 cursor-pointer rounded-full aspect-square mt-1" src={currentUser.avatarUrl()} />
                  <div className="relative flex flex-col gap-1 items-end max-w-[82%] md:max-w-full">
                    <div className="flex items-baseline mr-3">
                      <div className="text-sm font-medium dark:text-white">{currentUser.nickname()}</div>
                    </div>
                    <div className="relative mr-2 text-sm bg-indigo-100 py-2 px-4 shadow rounded-xl max-w-full break-words">
                      <div className="whitespace-pre-line">{message.content}</div>
                    </div>
                    {message.content.length > 2200 && (
                      <div className="absolute bottom-0 -left-8">
                        <Tooltip
                          title={
                            <div>
                              <div>由于此消息过长，可能会在后续对话中被 AI 遗忘，缺乏语境连续性</div>
                              <div>建议精简提问以获得更好的回复内容</div>
                            </div>
                          }
                        >
                          <svg className="h-4 w-4" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg">
                            <path
                              d="M849.12 928.704 174.88 928.704c-45.216 0-81.536-17.728-99.68-48.64-18.144-30.912-15.936-71.296 6.08-110.752L421.472 159.648c22.144-39.744 55.072-62.528 90.304-62.528s68.128 22.752 90.336 62.464l340.544 609.792c22.016 39.456 24.288 79.808 6.112 110.72C930.656 911.008 894.304 928.704 849.12 928.704zM511.808 161.12c-11.2 0-24.032 11.104-34.432 29.696L137.184 800.544c-10.656 19.136-13.152 36.32-6.784 47.168 6.368 10.816 22.592 17.024 44.48 17.024l674.24 0c21.92 0 38.112-6.176 44.48-17.024 6.336-10.816 3.872-28-6.816-47.136L546.24 190.816C535.872 172.224 522.976 161.12 511.808 161.12z"
                              fill="#9a9a9a"
                            ></path>
                            <path
                              d="M512 640c-17.664 0-32-14.304-32-32l0-288c0-17.664 14.336-32 32-32s32 14.336 32 32l0 288C544 625.696 529.664 640 512 640z"
                              fill="#9a9a9a"
                            ></path>
                            <path d="M512 752.128m-48 0a1.5 1.5 0 1 0 96 0 1.5 1.5 0 1 0-96 0Z" fill="#9a9a9a"></path>
                          </svg>
                        </Tooltip>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <div key={i} className="col-start-1 col-end-12 md:col-end-10 p-3 rounded-lg">
                <div className="flex flex-row items-start">
                  <div className="relative mt-1">
                    <div className="inline-block h-10 w-10">
                      <img
                        className="rounded-full aspect-square mt-1 h-10 w-10"
                        src={avatarUrl || gon.gpt_user.avatar_url}
                      />
                    </div>
                  </div>

                  <div className="relative flex flex-col gap-1 max-w-[98%]">
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
                    <div className="absolute flex flex-col md:flex-row bottom-0 -right-2 md:-right-9">
                      <CopyButton
                        className="p-1 rounded-md hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-gray-200 disabled:dark:hover:text-gray-400"
                        content={message.content}
                      />
                      <AudioButton
                        className="p-1 rounded-md hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-gray-200 disabled:dark:hover:text-gray-400"
                        message={message}
                        playAudio={playAudio}
                        pauseAudio={pauseAudio}
                        playingMessageId={playingMessageId}
                        setPlayingMessageId={setPlayingMessageId}
                        voice={voice || ""}
                      />
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
