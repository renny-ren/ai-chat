import React, { useEffect, useState } from "react"
import currentUser from "stores/current_user_store"
import { message } from "antd"
import PromptInput from "./PromptInput"

message.config({
  maxCount: 1,
})

interface FooterProps {
  setIsShowModal: () => void
  prompt: string
  setPrompt: () => void
  handleSubmit: () => void
}

const Footer: React.FC<FooterProps> = ({
  setIsShowModal,
  uniqueIdToRetry,
  regenerateResponse,
  prompt,
  setPrompt,
  handleSubmit,
}) => {
  return (
    <>
      <div className="absolute bottom-0 left-0 w-full dark:border-transparent bg-vert-light-gradient dark:bg-vert-dark-gradient input-area">
        <form className="stretch mx-2 flex flex-row gap-3 last:mb-2 md:last:mb-6 lg:mx-auto lg:max-w-3xl">
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
              <PromptInput prompt={prompt} setPrompt={setPrompt} onSubmit={handleSubmit} key="prompt-input" />
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
        </form>
        <footer className="px-3 pt-2 pb-2 text-center text-xs text-black/50 dark:text-white/50 md:px-4 md:pt-3">
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
