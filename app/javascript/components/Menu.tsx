import React, { useState, useEffect } from "react"
import { Link, useLocation } from "react-router-dom"
import { message } from "antd"
import ConversationList from "./ConversationList"

interface MenuProps {
  conversations: any
  isMobile?: boolean
  onShowSignInModal?: () => void
  closeMobileMenu?: () => void
}

const Menu: React.FC<MenuProps> = ({ onShowSignInModal, conversations, closeMobileMenu, isMobile = false }) => {
  // const [selectedPath, setSelectedPath] = useState("")
  const location = useLocation()

  // useEffect(() => {
  //   setSelectedPath(location.pathname)
  // }, [location])

  const newConversation = () => {
    if (conversations.length >= 50) {
      return message.error("目前最多能创建 50 个会话，请删除现有会话后再试")
    }
    window.location.href = "/chats/new"
  }

  const onClickLink = () => {
    if (closeMobileMenu) closeMobileMenu()
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
                className={`relative hover:bg-gray-50 dark:hover:bg-white/5 ${
                  location.pathname === "/" ? "border-l border-emerald-400 bg-zinc-800/[.025]" : ""
                }`}
              >
                <Link
                  aria-current="page"
                  className="flex justify-between gap-2 py-1 pr-3 text-sm transition pl-4 text-zinc-900 dark:text-white"
                  to="/"
                  onClick={onClickLink}
                >
                  <span className="truncate">AI 在线聊天室</span>
                </Link>
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
              className="outline-none inline-flex ml-2 px-2 py-1 text-xs text-gray-600 transition-colors duration-300 transform border rounded-md dark:text-gray-200 dark:border-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
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

          <div className="relative mt-3 pl-2 max-h-64 overflow-y-auto">
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
              <ConversationList conversations={conversations} handleClick={onClickLink} />
            </ul>
          </div>
        </li>
        <li className="relative mt-6">
          <h2 className="text-xs font-semibold text-zinc-900 dark:text-white">功能</h2>
          <div className="relative mt-3 pl-2">
            <div className="absolute inset-y-0 left-2 w-px bg-zinc-900/10 dark:bg-white/5"></div>
            <ul role="list" className="border-l border-transparent">
              <li
                className={`relative hover:bg-gray-50 dark:hover:bg-white/5 ${
                  location.pathname === "/images" ? "border-l border-emerald-400 bg-zinc-800/[.025]" : ""
                }`}
              >
                <Link
                  className="flex justify-between gap-2 py-1 pr-3 text-sm transition pl-4 text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white"
                  to="/images"
                  onClick={onClickLink}
                >
                  <span className="truncate">AI 绘画</span>
                </Link>
              </li>
              <li
                className={`relative hover:bg-gray-50 dark:hover:bg-white/5 ${
                  location.pathname === "/girlfriend" ? "border-l border-emerald-400 bg-zinc-800/[.025]" : ""
                }`}
              >
                <Link
                  className="flex justify-between gap-2 py-1 pr-3 text-sm transition pl-4 text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white"
                  to="/girlfriend"
                  onClick={onClickLink}
                >
                  <span className="truncate">AI 女友</span>
                </Link>
              </li>
              <li
                className={`relative hover:bg-gray-50 dark:hover:bg-white/5 ${
                  location.pathname === "/fortune" ? "border-l border-emerald-400 bg-zinc-800/[.025]" : ""
                }`}
              >
                <Link
                  className="flex justify-between gap-2 py-1 pr-3 text-sm transition pl-4 text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white"
                  to="/fortune"
                  onClick={onClickLink}
                >
                  <span className="truncate">命理大师</span>
                </Link>
              </li>
              <li
                className={`relative hover:bg-gray-50 dark:hover:bg-white/5 ${
                  location.pathname === "/developer_assistant" ? "border-l border-emerald-400 bg-zinc-800/[.025]" : ""
                }`}
              >
                <Link
                  className="flex justify-between gap-2 py-1 pr-3 text-sm transition pl-4 text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white"
                  to="/developer_assistant"
                  onClick={onClickLink}
                >
                  <span className="truncate">程序员助手</span>
                </Link>
              </li>

              <li
                className={`relative hover:bg-gray-50 dark:hover:bg-white/5 ${
                  location.pathname === "/models" ? "border-l border-emerald-400 bg-zinc-800/[.025]" : ""
                }`}
              >
                <Link
                  className="flex justify-between gap-2 py-1 pr-3 text-sm transition pl-4 text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white"
                  to="/models"
                  onClick={onClickLink}
                >
                  <span className="truncate">自定义模型</span>
                </Link>
              </li>
            </ul>
          </div>
        </li>
        <li className="relative mt-6">
          <h2 className="text-xs font-semibold text-zinc-900 dark:text-white">菜单</h2>
          <div className="relative mt-3 pl-2">
            <div className="absolute inset-y-0 left-2 w-px bg-zinc-900/10 dark:bg-white/5"></div>
            <ul role="list" className="border-l border-transparent">
              <li
                className={`relative hover:bg-gray-50 dark:hover:bg-white/5 ${
                  location.pathname === "/faqs" ? "border-l border-emerald-400 bg-zinc-800/[.025]" : ""
                }`}
              >
                <Link
                  className="flex justify-between gap-2 py-1 pr-3 text-sm transition pl-4 text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white"
                  to="/faqs"
                  onClick={onClickLink}
                >
                  <span className="truncate">常见问题</span>
                </Link>
              </li>
              <li
                className={`relative hover:bg-gray-50 dark:hover:bg-white/5 ${
                  location.pathname === "/pricing" ? "border-l border-emerald-400 bg-zinc-800/[.025]" : ""
                }`}
              >
                <Link
                  className="flex justify-between gap-2 py-1 pr-3 text-sm transition pl-4 text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white"
                  to="/pricing"
                  onClick={onClickLink}
                >
                  <span className="truncate">升级套餐</span>
                </Link>
              </li>
              <li
                className={`relative hover:bg-gray-50 dark:hover:bg-white/5 ${
                  location.pathname === "/disclaimer" ? "border-l border-emerald-400 bg-zinc-800/[.025]" : ""
                }`}
              >
                <Link
                  className="flex justify-between gap-2 py-1 pr-3 text-sm transition pl-4 text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white"
                  to="/disclaimer"
                  onClick={onClickLink}
                >
                  <span className="truncate">免责声明</span>
                </Link>
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
