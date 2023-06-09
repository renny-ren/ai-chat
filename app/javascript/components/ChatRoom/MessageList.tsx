import React, { useEffect, useState, useRef, useCallback, useMemo } from "react"
import currentUser from "stores/current_user_store"
import hljs from "highlight.js"
// import ReactMarkdown from "react-markdown"
// import { marked } from "marked"
import Markdown from "marked-react"
import SyntaxHighlighter from "react-syntax-highlighter"
import { github, routeros, arduinoLight, atelierSeasideLight } from "react-syntax-highlighter/dist/esm/styles/hljs"
import Avatar from "./Avatar"
import useInfiniteScroll from "react-infinite-scroll-hook"
import { Spin, Tooltip } from "antd"
import AudioButton from "components/common/AudioButton"
import CopyButton from "components/common/CopyButton"
import { ExclamationCircleOutlined, CopyOutlined } from "@ant-design/icons"

const MessageList = ({ messages, fetchMessages, isFetching, openModal, pagination, setPrompt, generatingMsgId }) => {
  const [currentPage, setCurrentPage] = useState(1)
  const [playingMessageId, setPlayingMessageId] = useState(0)
  const scrollableRootRef = useRef<HTMLDivElement | null>(null)
  const lastScrollDistanceToBottomRef = useRef<number>()
  const messagesEndRef = useRef(null)
  const audioRef = useRef(null)

  const includeCode = (text: string | null | undefined) => {
    const regexp = /^(?:\s{4}|\t).+/gm
    return !!(text?.includes(" = ") || text?.match(regexp))
  }

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
    image(href, title, text) {
      if (text) {
        const size = text.split("x") || []
        return <img key={href} src={href} alt={title} width={size[0]} height={size[1]} />
      } else {
        return <img key={href} src={href} />
      }
    },
  }

  const isSelf = (message) => {
    if (currentUser.isSignedIn()) {
      return currentUser.id() === message.user_id
    } else {
      return false
    }
  }

  const isRobot = (message) => {
    return message.role === "assistant"
  }

  const renderContent = (message) => {
    return isRobot(message) ? (
      <>
        <span>{message.mentions?.map((name) => `@${name}`)} </span>
        <Markdown value={message.content} renderer={renderer} />
      </>
    ) : (
      <div className="whitespace-pre-line">{message.content}</div>
    )
  }

  const fetchMoreData = () => {
    nextPage = currentPage + 1
    fetchMessages(nextPage)
    setCurrentPage(nextPage)
  }

  const [infiniteRef, { rootRef }] = useInfiniteScroll({
    loading: isFetching,
    hasNextPage: pagination.current < pagination.total && currentPage <= 20,
    onLoadMore: fetchMoreData,
    rootMargin: "400px 0px 0px 0px",
  })

  // Keep the scroll position when new items are added.
  useEffect(() => {
    const scrollableRoot = scrollableRootRef.current
    const lastScrollDistanceToBottom = lastScrollDistanceToBottomRef.current ?? 0
    if (scrollableRoot) {
      scrollableRoot.scrollTop = scrollableRoot.scrollHeight - lastScrollDistanceToBottom
    }
  }, [messages, rootRef])

  useEffect(() => {
    // scrollToBottom()
  }, [messages])

  const rootRefSetter = useCallback(
    (node: HTMLDivElement) => {
      rootRef(node)
      scrollableRootRef.current = node
    },
    [rootRef]
  )

  const handleRootScroll = useCallback(() => {
    const rootNode = scrollableRootRef.current
    if (rootNode) {
      const scrollDistanceToBottom = rootNode.scrollHeight - rootNode.scrollTop
      lastScrollDistanceToBottomRef.current = scrollDistanceToBottom
    }
  }, [])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
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
      <div
        className="message-list-container c-scrollbar overflow-auto"
        style={{ scrollbarGutter: "stable both-edges" }}
        ref={rootRefSetter}
        onScroll={handleRootScroll}
      >
        <div className="sentry text-center" ref={infiniteRef}>
          {isFetching && <Spin />}
        </div>
        <div className="grid grid-cols-12 gap-y-2 overflow-hidden">
          {messages.map((message, i) => {
            return isSelf(message) ? (
              <div key={i} className="col-start-2 md:col-start-4 col-end-13 p-3 rounded-lg">
                <div className="flex items-start justify-start flex-row-reverse">
                  <Avatar src={currentUser.avatarUrl()} />
                  <div className="relative flex flex-col gap-1 items-end max-w-[82%] md:max-w-full">
                    <div className="flex items-baseline mr-3">
                      <div className="text-sm font-medium dark:text-white">{message.user_nickname}</div>
                      <p className="text-xs text-gray-500 ml-2">{message.created_at}</p>
                    </div>
                    <div className="relative mr-2 text-sm bg-indigo-100 py-2 px-4 shadow rounded-xl max-w-full break-words">
                      {renderContent(message)}
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
                  <Avatar
                    src={message.user_avatar_url}
                    nickname={message.user_nickname}
                    setPrompt={setPrompt}
                    isRobot={isRobot(message)}
                    isSelf={false}
                    openModal={openModal}
                  />
                  <div className="relative flex flex-col gap-1 max-w-[98%]">
                    <div className="flex items-baseline">
                      <div className="text-sm font-medium ml-3 dark:text-white">{message.user_nickname}</div>
                      <p className="text-xs text-gray-500 ml-2">{message.created_at}</p>
                    </div>
                    <div
                      className={`markdown ai-response relative ml-2 mr-4 text-sm bg-white py-2 px-4 shadow rounded-xl break-words whitespace-pre-line max-w-max ${
                        generatingMsgId === message.id ? "ai-response-loading" : ""
                      }`}
                    >
                      {renderContent(message)}
                    </div>
                    {isRobot(message) && (
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
                        />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
        <div ref={messagesEndRef}></div>
        <div className="w-full h-4 flex-shrink-0"></div>
      </div>
    </>
  )
}

export default MessageList
