import React, { useState, useEffect } from "react"
import { Link, useLocation } from "react-router-dom"
import { message, Tooltip } from "antd"
import { PlusCircleOutlined, DeleteOutlined } from "@ant-design/icons"
import ConversationList from "./ConversationList"
import * as _ from "lodash"
import Fuse from "fuse.js"

interface MenuProps {
  conversations: any
  isMobile?: boolean
  onShowSignInModal?: () => void
  closeMobileMenu?: () => void
}

const Menu: React.FC<MenuProps> = ({ onShowSignInModal, conversations, closeMobileMenu, isMobile = false }) => {
  // const [selectedPath, setSelectedPath] = useState("")
  const [filteredConversations, setFilteredConversations] = useState(conversations)
  const location = useLocation()

  useEffect(() => {
    setFilteredConversations(conversations)
  }, [conversations])

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

  const onSearch = (value) => {
    if (!value) return setFilteredConversations(conversations)
    const fuse = new Fuse(conversations, {
      keys: ["title", "item_keys"],
      threshold: 0.2,
    })
    const result = fuse.search(value).map((r) => r.item)
    setFilteredConversations(result)
  }

  const debouncedSearch = _.debounce(onSearch, 600)

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
                  <span className="truncate">ChatGPT 在线聊天室</span>
                </Link>
              </li>
            </ul>
          </div>
        </li>
        <li className="relative mt-6">
          <div className="flex items-center space-x-2">
            <span className="relative text-xs font-semibold text-zinc-900 dark:text-white">个人会话</span>
            <Tooltip title="新的会话" placement="bottom">
              <button
                onClick={newConversation}
                className="outline-none inline-flex rounded-md text-zinc-500 hover:text-zinc-600 dark:text-zinc-300 dark:hover:text-zinc-200"
              >
                <PlusCircleOutlined />
              </button>
            </Tooltip>
            <div className="relative text-xs bg-transparent text-gray-800 flex-1">
              <div className="flex items-center border-b border-gray-200 py-2">
                <input
                  placeholder="搜索"
                  className="boder-b leading-tight outline-none bg-transparent"
                  onChange={(e) => debouncedSearch(e.target.value)}
                />
              </div>
            </div>
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
              <ConversationList conversations={filteredConversations} handleClick={onClickLink} />
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
