import React, { useState, useEffect } from "react"
import axios from "axios"

interface MenuProps {
  isMobile?: boolean
  onShowSignInModal?: () => void
}

const Menu: React.FC<MenuProps> = ({ onShowSignInModal, isMobile = false }) => {
  const [conversations, setConversations] = useState([])
  const [isFetching, setIsFetching] = useState(false)

  useEffect(() => {
    fetchConversations()
  }, [])

  const fetchConversations = async (page = 1) => {
    setIsFetching(true)
    const csrf = document.querySelector("meta[name='csrf-token']").getAttribute("content")
    const response = await axios.get(`/v1/conversations`, {
      headers: {
        "X-CSRF-Token": csrf,
      },
    })
    setConversations(response.data.conversations)
    console.log("conversations", response.data.conversations)
    setIsFetching(false)
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
          <h2 className="text-xs font-semibold text-zinc-900 dark:text-white">个人会话</h2>
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
            <ul role="list" className="border-l border-transparent">
              {conversations.map((conversation, i) => (
                <li
                  key={i}
                  className={`relative ${
                    window.location.pathname === `/chats/${conversation.id}`
                      ? "border-l border-emerald-400 bg-zinc-800/[.025]"
                      : ""
                  }`}
                >
                  <a
                    className="flex justify-between gap-2 py-1 pr-3 text-sm transition pl-4 text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white"
                    href={`/chats/${conversation.id}`}
                  >
                    <span className="truncate">{conversation.title || `新的会话${i + 1}`}</span>
                  </a>
                </li>
              ))}
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
