import React, { useState } from "react"

interface SidebarProps {}

const Sidebar: React.FC<SidebarProps> = ({}) => {
  return (
    <nav className="hidden lg:mt-10 lg:block">
      <ul role="list">
        <li className="md:hidden">
          <a
            className="block py-1 text-sm text-zinc-600 transition hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white"
            href="/"
          >
            API
          </a>
        </li>
        <li className="md:hidden">
          <a
            className="block py-1 text-sm text-zinc-600 transition hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white"
            href="/#"
          >
            Documentation
          </a>
        </li>
        <li className="md:hidden">
          <a
            className="block py-1 text-sm text-zinc-600 transition hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white"
            href="/#"
          >
            Support
          </a>
        </li>
        <li className="relative mt-6 md:mt-0">
          <h2 className="text-xs font-semibold text-zinc-900 dark:text-white">会话</h2>
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
            <div className="absolute left-2 h-6 w-px bg-emerald-500" style={{ top: "4px", opacity: 1 }}></div>
            <ul role="list" className="border-l border-transparent">
              <li className="relative">
                <a
                  aria-current="page"
                  className="flex justify-between gap-2 py-1 pr-3 text-sm transition pl-4 text-zinc-900 dark:text-white"
                  href="/"
                >
                  <span className="truncate">会话1</span>
                </a>
              </li>
              <li className="relative">
                <a
                  className="flex justify-between gap-2 py-1 pr-3 text-sm transition pl-4 text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white"
                  href="/"
                >
                  <span className="truncate">会话2</span>
                </a>
              </li>
            </ul>
          </div>
        </li>
        <li className="relative mt-6">
          <h2 className="text-xs font-semibold text-zinc-900 dark:text-white">菜单</h2>
          <div className="relative mt-3 pl-2">
            <div className="absolute inset-y-0 left-2 w-px bg-zinc-900/10 dark:bg-white/5"></div>
            <ul role="list" className="border-l border-transparent">
              <li className="relative">
                <a
                  className="flex justify-between gap-2 py-1 pr-3 text-sm transition pl-4 text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white"
                  href="/contacts"
                >
                  <span className="truncate">清空会话</span>
                </a>
              </li>
              <li className="relative">
                <a
                  className="flex justify-between gap-2 py-1 pr-3 text-sm transition pl-4 text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white"
                  href="/conversations"
                >
                  <span className="truncate">夜间模式</span>
                </a>
              </li>
              <li className="relative">
                <a
                  className="flex justify-between gap-2 py-1 pr-3 text-sm transition pl-4 text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white"
                  href="/messages"
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
            </ul>
          </div>
        </li>
        <li className="sticky bottom-0 z-10 mt-6 min-[416px]:hidden">
          <a
            className="inline-flex gap-0.5 justify-center overflow-hidden text-sm font-medium transition rounded-full bg-zinc-900 py-1 px-3 text-white hover:bg-zinc-700 dark:bg-emerald-500 dark:text-white dark:hover:bg-emerald-400 w-full"
            href="/#"
          >
            Sign in
          </a>
        </li>
      </ul>
    </nav>
  )
}

export default Sidebar
