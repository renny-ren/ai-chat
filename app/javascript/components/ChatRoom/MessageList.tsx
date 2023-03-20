import React, { useEffect, useState, useRef, useCallback, useMemo } from "react"
import currentUser from "stores/current_user_store"
import hljs from "highlight.js"
// import ReactMarkdown from "react-markdown"
// import { marked } from "marked"
import Markdown from "marked-react"
import SyntaxHighlighter from "react-syntax-highlighter"
import { github, arduinoLight, atelierSeasideLight } from "react-syntax-highlighter/dist/esm/styles/hljs"
import Avatar from "./Avatar"
import useInfiniteScroll from "react-infinite-scroll-hook"
import { Spin } from "antd"

const MessageList = ({ messages, fetchMessages, isFetching, openModal, pagination }) => {
  const [currentPage, setCurrentPage] = useState(1)
  const scrollableRootRef = useRef<HTMLDivElement | null>(null)
  const lastScrollDistanceToBottomRef = useRef<number>()
  const messagesEndRef = useRef(null)

  const includeCode = (text: string | null | undefined) => {
    const regexp = /^(?:\s{4}|\t).+/gm
    return !!(text?.includes(" = ") || text?.match(regexp))
  }

  const renderer = {
    code(snippet, language) {
      return (
        <SyntaxHighlighter
          children={snippet}
          key={this.elementId}
          language={language}
          style={github}
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
      return currentUser.id() === message.user_id
    } else {
      return false
    }
  }

  const renderContent = (message) => {
    return isRobot(message) ? (
      <Markdown
        value={`${message.mentioned_users_nickname.map((name) => `@${name}`)} ${message.content}`}
        renderer={renderer}
      />
    ) : (
      <div className="whitespace-pre-line">{message.content}</div>
    )
  }

  const isRobot = (message) => {
    return message.role === "assistant"
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

  return (
    <>
      <div className="container" style={{ overflow: "auto" }} ref={rootRefSetter} onScroll={handleRootScroll}>
        <div className="sentry text-center" ref={infiniteRef}>
          {isFetching && <Spin />}
        </div>
        <div className="grid grid-cols-12 gap-y-2">
          {messages.map((message, i) => {
            return isSelf(message) ? (
              <div key={i} className="col-start-2 md:col-start-4 col-end-13 p-3 rounded-lg">
                <div className="flex items-start justify-start flex-row-reverse">
                  <Avatar src={currentUser.avatarUrl()} />
                  <div className="flex flex-col gap-1 items-end">
                    <div className="flex items-baseline mr-3">
                      <div className="text-sm font-medium">{message.user_nickname}</div>
                      <p className="text-xs text-gray-500 ml-2">{message.created_at}</p>
                    </div>
                    <div className="relative ml-4 mr-2 text-sm bg-indigo-100 py-2 px-4 shadow rounded-xl">
                      {renderContent(message)}
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div key={i} className="col-start-1 col-end-12 md:col-end-10 p-3 rounded-lg">
                <div className="flex flex-row items-start">
                  <Avatar src={message.user_avatar_url} isRobot={isRobot(message)} openModal={openModal} />
                  <div className="flex flex-col gap-1 max-w-full">
                    <div className="flex items-baseline">
                      <div className="text-sm font-medium ml-3">{message.user_nickname}</div>
                      <p className="text-xs text-gray-500 ml-2">{message.created_at}</p>
                    </div>
                    <div
                      className={`relative ml-2 mr-4 text-sm bg-white py-2 px-4 shadow rounded-xl break-words whitespace-pre-line max-w-max ${
                        message.loading ? "ai-response-loading" : ""
                      }`}
                    >
                      {renderContent(message)}
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
        <div ref={messagesEndRef}></div>
      </div>
    </>
  )
}

export default MessageList
