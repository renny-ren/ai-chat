import React, { useEffect, useState } from "react"
import currentUser from "stores/current_user_store"
import { message } from "antd"

message.config({
  maxCount: 1,
})

interface FooterProps {
  setIsShowModal: () => void
  prompt: string
  setPrompt: () => void
  handleSubmit: () => void
  inputRef: any
  messageLimitPerDay: integer
}

const Footer: React.FC<FooterProps> = ({
  setIsShowModal,
  uniqueIdToRetry,
  regenerateResponse,
  prompt,
  setPrompt,
  handleSubmit,
  inputRef,
  messageLimitPerDay,
}) => {
  const checkKeyPress = (e) => {
    if (e.key === "Enter") {
      if (e.ctrlKey || e.shiftKey) {
      } else {
        handleSubmit(e)
      }
    }
  }

  const handlePromptChange = (e) => {
    value = e.target.value
    if (value.length > 500) {
      return message.error("消息已达最大长度限制")
    }
    setPrompt(value)
    e.target.style.height = "24px"
    e.target.style.height = e.target.scrollHeight + "px"
  }

  return (
    <>
      <div className="absolute bottom-0 left-0 w-full dark:border-transparent bg-vert-light-gradient dark:bg-vert-dark-gradient input-area">
        <form className="stretch mx-2 flex flex-row gap-3 last:mb-2 md:last:mb-6 lg:mx-auto lg:max-w-3xl">
          {currentUser.isSignedIn() ? (
            <div className="relative flex h-full flex-1 flex-col">
              <div className="w-full flex gap-2 justify-center mb-3">
                {uniqueIdToRetry && (
                  <button onClick={regenerateResponse} className="btn flex justify-center gap-2 btn-neutral">
                    <span role="img" className="semi-icon semi-icon-default">
                      <svg
                        stroke="currentColor"
                        fill="none"
                        strokeWidth="1.5"
                        viewBox="0 0 24 24"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        className="h-3 w-3"
                        height="1em"
                        width="1em"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <polyline points="1 4 1 10 7 10"></polyline>
                        <polyline points="23 20 23 14 17 14"></polyline>
                        <path d="M20.49 9A9 9 0 0 0 5.64 5.64L1 10m22 4l-4.64 4.36A9 9 0 0 1 3.51 15"></path>
                      </svg>
                    </span>
                    Regenerate response
                  </button>
                )}
              </div>
              <div className="flex flex-col w-full py-2 flex-grow md:py-3 md:pl-4 relative border border-black/10 bg-white dark:border-gray-900/50 dark:text-white dark:bg-gray-700 rounded-md shadow-[0_0_10px_rgba(0,0,0,0.10)] dark:shadow-[0_0_15px_rgba(0,0,0,0.10)]">
                <textarea
                  ref={inputRef}
                  className="max-h-52 m-0 w-full resize-none border-0 bg-transparent p-0 pl-2 md:pl-0 pr-7 focus:ring-0 focus-visible:ring-0 dark:bg-transparent"
                  value={prompt}
                  onChange={handlePromptChange}
                  style={{ height: "24px" }}
                  onKeyPress={checkKeyPress}
                ></textarea>
                <button
                  onClick={handleSubmit}
                  type="button"
                  className="absolute p-1 rounded-md text-gray-500 bottom-1.5 right-1 md:bottom-2.5 md:right-2 hover:bg-gray-100 dark:hover:text-gray-400 dark:hover:bg-gray-900 disabled:hover:bg-transparent dark:disabled:hover:bg-transparent"
                >
                  <svg
                    stroke={prompt ? "currentColor" : "#cdcdcd"}
                    fill="none"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-4 w-4 mr-1"
                    height="1em"
                    width="1em"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <line x1="22" y1="2" x2="11" y2="13"></line>
                    <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                  </svg>
                </button>
              </div>
            </div>
          ) : (
            <div
              onClick={() => setIsShowModal(true)}
              className="cursor-pointer flex flex-col w-full py-2 flex-grow md:py-3 md:pl-2 relative border border-black/10 bg-white dark:border-gray-900/50 dark:text-white dark:bg-gray-700 rounded-md shadow-[0_0_10px_rgba(0,0,0,0.10)] dark:shadow-[0_0_15px_rgba(0,0,0,0.10)]"
            >
              <div className="flex h-6 w-full items-center pl-2 pr-3 text-sm text-zinc-500 transition dark:bg-white/5 dark:text-zinc-400 focus:[&amp;:not(:focus-visible)]:outline-none">
                <svg
                  viewBox="0 0 20 20"
                  aria-hidden="true"
                  className="h-5 w-5 fill-zinc-500/10 stroke-zinc-500 transition-colors duration-300 group-hover:stroke-zinc-900 dark:fill-white/10 dark:stroke-zinc-400 dark:group-hover:fill-emerald-300/10 dark:group-hover:stroke-emerald-400"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M10 16.5c4.142 0 7.5-3.134 7.5-7s-3.358-7-7.5-7c-4.142 0-7.5 3.134-7.5 7 0 1.941.846 3.698 2.214 4.966L3.5 17.5c2.231 0 3.633-.553 4.513-1.248A8.014 8.014 0 0 0 10 16.5Z"
                  ></path>
                  <path fill="none" strokeLinecap="round" strokeLinejoin="round" d="M7.5 8.5h5M8.5 11.5h3"></path>
                </svg>
                <span className="pl-1">登录以开始聊天</span>
              </div>
            </div>
          )}
        </form>
        <footer className="px-3 pt-2 pb-2 text-center text-xs text-black/50 dark:text-white/50 md:px-4 md:pt-3">
          <span className="mr-4">
            {currentUser.isSignedIn() && <span>今日剩余次数：{messageLimitPerDay - currentUser.usedMessageCount()}</span>}
          </span>
          本站点基于外部 API 开发，仅供学习交流使用，使用前请知晓
          <a className="underline" href="/disclaimer" rel="noreferrer">
            免责申明
          </a>
        </footer>
      </div>
    </>
  )
}

export default Footer
