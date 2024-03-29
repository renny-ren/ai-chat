import React, { useEffect, useState, useContext } from "react"
import { AppContext } from "./AppContext"
import currentUser from "stores/current_user_store"
import Sidebar from "./Sidebar"
import MobileMenu from "./MobileMenu"
import CustomerService from "./CustomerService"
import Notification from "./notification"
import UserBar from "./user/UserBar"
import { Transition } from "@headlessui/react"
import { CDN_HOST } from "shared/constants"
import { Tag } from "antd"

interface HeaderProps {
  customContent?: any
  conversations: any
}

const Header: React.FC<HeaderProps> = ({ customContent, conversations }) => {
  const [isShowMobileMenu, setIsShowMobileMenu] = useState(false)
  const { showSignInModal, setShowSigninModal } = useContext(AppContext)

  const onShowSignInModal = () => {
    setIsShowMobileMenu(false)
    setShowSigninModal(true)
  }

  const toggleDarkMode = () => {
    if (document.documentElement.classList.contains("dark")) {
      localStorage.theme = "light"
      document.documentElement.classList.remove("dark")
    } else {
      localStorage.theme = "dark"
      document.documentElement.classList.add("dark")
    }
  }

  return (
    <>
      <header className="contents lg:pointer-events-none lg:fixed lg:inset-0 lg:z-40 lg:flex">
        <div className="contents c-scrollbar lg:pointer-events-auto lg:block lg:w-64 lg:overflow-y-auto lg:border-r lg:border-zinc-900/10 lg:px-6 lg:pt-4 lg:pb-8 lg:dark:border-white/10 xl:w-72">
          <div className="hidden lg:flex">
            <a aria-label="Home" href="/"></a>
          </div>
          <div
            className="fixed inset-x-0 top-0 z-50 flex h-12 md:h-14 items-center justify-between gap-12 px-4 transition sm:px-6 lg:left-64 lg:z-30 lg:px-8 xl:left-72 backdrop-blur-sm dark:backdrop-blur lg:left-64 xl:left-72 bg-white/[var(--bg-opacity-light)] dark:bg-zinc-900/[var(--bg-opacity-dark)]"
            style={{ "--bg-opacity-light": "0.5", "--bg-opacity-dark": "0.2" }}
          >
            <div className="absolute inset-x-0 top-full h-px transition bg-zinc-900/[.075] dark:bg-white/[.075]"></div>
            <div className="flex items-center">
              <div className="hidden lg:block lg:max-w-md lg:flex-auto">
                <a aria-label="Home" href="/">
                  <img src={`${CDN_HOST}/assets/logo.png`} width="70px" />
                </a>
              </div>

              <div className="flex items-center gap-2 lg:hidden">
                <button
                  type="button"
                  className="flex h-6 w-6 items-center justify-center rounded-md transition hover:bg-zinc-900/5 dark:hover:bg-white/5"
                  aria-label="Toggle navigation"
                  onClick={() => setIsShowMobileMenu((isShowMobileMenu) => !isShowMobileMenu)}
                >
                  <svg
                    viewBox="0 0 10 9"
                    fill="none"
                    strokeLinecap="round"
                    aria-hidden="true"
                    className="w-2.5 stroke-zinc-900 dark:stroke-white"
                  >
                    <path d="M.5 1h9M.5 8h9M.5 4.5h9"></path>
                  </svg>
                </button>
                <a aria-label="Home" href="/">
                  <img src={`${CDN_HOST}/assets/logo.png`} width="60px" />
                </a>
              </div>
              {currentUser.isSignedIn() && (
                <div className="ml-3 md:ml-4">
                  <a href="/pricing" className="inline-block w-4">
                    {currentUser.membership() === "free" ? (
                      <Tag className="text-gray-500 dark:text-white m-0">{currentUser.membershipName()}</Tag>
                    ) : (
                      <Tag color="green" className="bg-transparent dark:text-gray-400 dark:border-gray-400 m-0">
                        {currentUser.membershipName()}
                      </Tag>
                    )}
                  </a>
                </div>
              )}
            </div>

            <div className="flex items-center gap-4">
              <nav className="hidden md:block">
                {/*<ul role="list" className="flex items-center gap-8">
                  <li>
                    <a
                      className="text-sm leading-5 text-zinc-600 transition hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white"
                      href="/#"
                    >
                      Support
                    </a>
                  </li>
                </ul>*/}
              </nav>
              {/*<div className="hidden md:block md:h-5 md:w-px md:bg-zinc-900/10 md:dark:bg-white/15"></div>*/}
              <div className="flex gap-4 md:gap-5">
                {customContent}
                <CustomerService className="hidden md:block" />
                {currentUser.isSignedIn() && <Notification className="hidden md:block" />}
              </div>
              <div className="hidden md:block md:h-5 md:w-px md:bg-zinc-900/10 md:dark:bg-white/15"></div>
              <button
                type="button"
                className="hidden md:block flex h-6 w-6 items-center justify-center rounded-md transition hover:bg-zinc-900/5 dark:hover:bg-white/5"
                aria-label="Toggle dark mode"
                onClick={toggleDarkMode}
              >
                <svg viewBox="0 0 20 20" fill="none" aria-hidden="true" className="h-5 w-5 stroke-zinc-900 dark:hidden">
                  <path d="M12.5 10a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0Z"></path>
                  <path
                    strokeLinecap="round"
                    d="M10 5.5v-1M13.182 6.818l.707-.707M14.5 10h1M13.182 13.182l.707.707M10 15.5v-1M6.11 13.889l.708-.707M4.5 10h1M6.11 6.111l.708.707"
                  ></path>
                </svg>
                <svg viewBox="0 0 20 20" fill="none" aria-hidden="true" className="hidden h-5 w-5 stroke-white dark:block">
                  <path d="M15.224 11.724a5.5 5.5 0 0 1-6.949-6.949 5.5 5.5 0 1 0 6.949 6.949Z"></path>
                </svg>
              </button>

              <div>
                {currentUser.isSignedIn() ? (
                  <UserBar />
                ) : (
                  <div
                    className="cursor-pointer inline-flex gap-0.5 justify-center overflow-hidden text-sm font-medium transition rounded-full bg-zinc-900 py-1 px-3 text-white hover:bg-zinc-700 dark:bg-emerald-400/10 dark:text-emerald-400 dark:ring-1 dark:ring-inset dark:ring-emerald-400/20 dark:hover:bg-emerald-400/10 dark:hover:text-emerald-300 dark:hover:ring-emerald-300"
                    onClick={onShowSignInModal}
                  >
                    登录
                  </div>
                )}
              </div>
            </div>
          </div>
          <Sidebar conversations={conversations} />
        </div>
      </header>
      <Transition show={isShowMobileMenu}>
        <MobileMenu
          setIsShow={setIsShowMobileMenu}
          onShowSignInModal={onShowSignInModal}
          conversations={conversations}
          toggleDarkMode={toggleDarkMode}
        />
      </Transition>
    </>
  )
}

export default Header
