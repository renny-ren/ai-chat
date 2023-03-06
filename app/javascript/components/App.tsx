import React, { useState } from "react"
import Routes from "../routes"
import { Dialog, Popover, Tab, Transition } from "@headlessui/react"
import SignInModal from "./user/SignInModal"
import UserBar from "./user/UserBar"
import MobileMenu from "./MobileMenu"
import Sidebar from "./Sidebar"
import currentUser from "stores/current_user_store"

const App = (props) => {
  const [isShowModal, setIsShowModal] = useState(false)
  const [isShowMobileMenu, setIsShowMobileMenu] = useState(false)

  const onShowSignInModal = () => {
    setIsShowMobileMenu(false)
    setIsShowModal(true)
  }

  return (
    <>
      <div className="h-full lg:ml-64 xl:ml-72">
        <header className="contents lg:pointer-events-none lg:fixed lg:inset-0 lg:z-40 lg:flex">
          <div className="contents lg:pointer-events-auto lg:block lg:w-64 lg:overflow-y-auto lg:border-r lg:border-zinc-900/10 lg:px-6 lg:pt-4 lg:pb-8 lg:dark:border-white/10 xl:w-72">
            <div className="hidden lg:flex">
              <a aria-label="Home" href="/"></a>
            </div>
            <div
              className="fixed inset-x-0 top-0 z-50 flex h-14 items-center justify-between gap-12 px-4 transition sm:px-6 lg:left-64 lg:z-30 lg:px-8 xl:left-72 backdrop-blur-sm dark:backdrop-blur lg:left-64 xl:left-72 bg-white/[var(--bg-opacity-light)] dark:bg-zinc-900/[var(--bg-opacity-dark)]"
              style={{ "--bg-opacity-light": "0.5", "--bg-opacity-dark": "0.2" }}
            >
              <div className="absolute inset-x-0 top-full h-px transition bg-zinc-900/[.075] dark:bg-white/[.075]"></div>
              <div className="hidden lg:block lg:max-w-md lg:flex-auto">
                <a aria-label="Home" href="/">
                  <img src="/assets/logo.png" width="60px" />
                </a>
              </div>
              <div className="flex items-center gap-5 lg:hidden">
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
                  <img src="/assets/logo.png" width="60px" />
                </a>
              </div>
              <div className="flex items-center gap-5">
                <nav className="hidden md:block">
                  <ul role="list" className="flex items-center gap-8">
                    <li>
                      <a
                        className="text-sm leading-5 text-zinc-600 transition hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white"
                        href="/#"
                      >
                        Support
                      </a>
                    </li>
                  </ul>
                </nav>
                <div className="hidden md:block md:h-5 md:w-px md:bg-zinc-900/10 md:dark:bg-white/15"></div>
                <div className="flex gap-4">
                  <button
                    type="button"
                    className="flex h-6 w-6 items-center justify-center rounded-md transition hover:bg-zinc-900/5 dark:hover:bg-white/5"
                    aria-label="Toggle dark mode"
                  ></button>
                </div>
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
            <Sidebar />
          </div>
        </header>
        <Routes setIsShowModal={setIsShowModal} />
        <Transition
          show={isShowMobileMenu}
          enter="transition-opacity duration-75"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="transition-opacity duration-150"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <MobileMenu setIsShow={setIsShowMobileMenu} onShowSignInModal={onShowSignInModal} />
        </Transition>
        <SignInModal isShow={isShowModal} setOpen={setIsShowModal} />
      </div>
    </>
  )
}
export default App
