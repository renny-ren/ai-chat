import React, { useState, useEffect } from "react"
import axios from "axios"
import { message } from "antd"

interface MenuProps {
  isMobile?: boolean
  onShowSignInModal?: () => void
  conversations: any
}

const Menu: React.FC<MenuProps> = ({ onShowSignInModal, conversations, isMobile = false }) => {
  const [status, setStatus] = useState("initial")

  const isCurrent = (conversation) => {
    return window.location.pathname === `/chats/${conversation.id}` || !!conversation.current
  }

  const renderTitle = (conversation, i) => {
    switch (status) {
      case "initial":
        return conversation.title
      case "pendingDelete":
        return `删除「${conversation.title}」？`
      default:
        return ""
    }
  }

  const newConversation = () => {
    if (conversations.length >= 20) {
      return message.error("目前最多能创建 20 个会话，请删除现有会话后再试")
    }
    window.location.href = "/chats/new"
  }

  const deleteConversation = async (conversationId) => {
    await axios.delete(`/v1/conversations/${conversationId}`)
    window.location.href = "/chats/new"
  }

  return (
    <>
      <ul role="list">
        <li className="relative mt-6 md:mt-0">
          <h2 className="text-xs font-semibold text-zinc-900 dark:text-white">聊天室</h2>
          <div className="relative mt-3 pl-2">
            <div
              className="absolute inset-x-0 top-0 bg-zinc-800/2.5 will-change-transform dark:bg-white/2.5"
              style={{
                height: "32px",
                top: "0px",
                opacity: "1",
                borderRadius: "2.95203% / 25%",
                transform: "none",
                transformOrigin: "50% 50% 0px",
              }}
            ></div>
            <div className="absolute inset-y-0 left-2 w-px bg-zinc-900/10 dark:bg-white/5"></div>
            {/*<div className="absolute left-2 h-6 w-px bg-emerald-500" style={{ top: "4px", opacity: 1 }}></div>*/}
            <ul role="list" className="border-l border-transparent">
              <li
                className={`relative ${
                  window.location.pathname === "/" ? "border-l border-emerald-400 bg-zinc-800/[.025]" : ""
                }`}
              >
                <a
                  aria-current="page"
                  className="flex justify-between gap-2 py-1 pr-3 text-sm transition pl-4 text-zinc-900 dark:text-white"
                  href="/"
                >
                  <span className="truncate">ChatGPT 交流群</span>
                </a>
              </li>
            </ul>
          </div>
        </li>
        <li className="relative mt-6">
          <div className="flex items-center justify-between">
            <span className="relative text-xs font-semibold text-zinc-900 dark:text-white">个人会话</span>
            <button
              title="新的会话"
              onClick={newConversation}
              className="outline-none inline-flex ml-2 px-2 py-1 text-xs text-gray-600 transition-colors duration-300 transform border rounded-lg dark:text-gray-200 dark:border-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                className="inline-block w-4 h-4"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
              </svg>
              <span>新的会话</span>
            </button>
          </div>

          <div className="relative mt-3 pl-2 max-h-72 overflow-y-auto">
            <div
              className="absolute inset-x-0 top-0 bg-zinc-800/2.5 will-change-transform dark:bg-white/2.5"
              style={{
                height: "32px",
                top: "0px",
                opacity: "1",
                borderRadius: "2.95203% / 25%",
                transform: "none",
                transformOrigin: "50% 50% 0px",
              }}
            ></div>
            <ul role="list" className="border-l">
              {conversations.map((conversation, i) =>
                isCurrent(conversation) ? (
                  <li key={i} className="relative border-l border-emerald-400 bg-zinc-800/[.025]">
                    <a className="flex justify-between gap-2 py-1 pr-3 text-sm transition pl-4 text-zinc-600 dark:text-zinc-400 ">
                      <div className="truncate">{renderTitle(conversation, i)}</div>
                      <div className="relative w-8 z-10"></div>
                      <div className="absolute flex right-1 z-10 visible gap-2">
                        {status === "pendingDelete" ? (
                          <>
                            <button
                              className="pt-px hover:text-zinc-900 dark:hover:text-white"
                              onClick={() => deleteConversation(conversation.id)}
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth="1.5"
                                stroke="currentColor"
                                className="w-4 h-4"
                              >
                                <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                              </svg>
                            </button>
                            <button
                              className="pt-px hover:text-zinc-900 dark:hover:text-white"
                              onClick={() => setStatus("initial")}
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth="1.5"
                                stroke="currentColor"
                                className="w-4 h-4"
                              >
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                              </svg>
                            </button>
                          </>
                        ) : (
                          <button
                            className="pt-px hover:text-zinc-900 dark:hover:text-white"
                            onClick={() => setStatus("pendingDelete")}
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                              strokeWidth="1.5"
                              stroke="currentColor"
                              className="w-4 h-4"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
                              />
                            </svg>
                          </button>
                        )}
                      </div>
                    </a>
                  </li>
                ) : (
                  <li key={i} className="relative">
                    <a
                      className="flex justify-between gap-2 py-1 pr-3 text-sm transition pl-4 text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white"
                      href={`/chats/${conversation.id}`}
                    >
                      <span className="truncate">{conversation.title}</span>
                    </a>
                  </li>
                )
              )}
            </ul>
          </div>
        </li>
        <li className="relative mt-6">
          <h2 className="text-xs font-semibold text-zinc-900 dark:text-white">菜单</h2>
          <div className="relative mt-3 pl-2">
            <div className="absolute inset-y-0 left-2 w-px bg-zinc-900/10 dark:bg-white/5"></div>
            <ul role="list" className="border-l border-transparent">
              {/*<li className="relative">
                <a
                  className="flex justify-between gap-2 py-1 pr-3 text-sm transition pl-4 text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white"
                  href="#"
                >
                  <span className="truncate">夜间模式</span>
                </a>
              </li>*/}
              <li className="relative">
                <a
                  className="flex justify-between gap-2 py-1 pr-3 text-sm transition pl-4 text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white"
                  href="/qa"
                >
                  <span className="truncate">常见问题</span>
                </a>
              </li>
              <li className="relative">
                <a
                  className="flex justify-between gap-2 py-1 pr-3 text-sm transition pl-4 text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white"
                  href="/disclaimer"
                >
                  <span className="truncate">免责声明</span>
                </a>
              </li>
              {isMobile && (
                <li className="sticky bottom-0 z-10 mt-6 min-[416px]:hidden">
                  <div
                    className="inline-flex gap-0.5 justify-center overflow-hidden text-sm font-medium transition rounded-full bg-zinc-900 py-1 px-3 text-white hover:bg-zinc-700 dark:bg-emerald-500 dark:text-white dark:hover:bg-emerald-400 w-full"
                    onClick={onShowSignInModal}
                  >
                    登录
                  </div>
                </li>
              )}
            </ul>
          </div>
        </li>
      </ul>
    </>
  )
}

export default Menu
