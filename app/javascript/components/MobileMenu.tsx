import React, { useState } from "react"
import Sidebar from "./Sidebar"
import Menu from "./Menu"
import { CDN_HOST } from "shared/constants"
import CustomerService from "./CustomerService"
import Notification from "./notification"
import currentUser from "stores/current_user_store"

interface MobileMenuProps {
  setIsShow: boolean
  onShowSignInModal: () => void
  conversations: any
  toggleDarkMode: () => void
}

const MobileMenu: React.FC<MobileMenuProps> = ({ setIsShow, onShowSignInModal, conversations, toggleDarkMode }) => {
  const closeMobileMenu = () => {
    setIsShow(false)
  }

  return (
    <div>
      <div>
        <div>
          <div className="fixed inset-0 z-50 lg:hidden" role="dialog" aria-modal="true" data-headlessui-state="open">
            <div className="fixed inset-0 top-14 bg-zinc-400/20 backdrop-blur-sm dark:bg-black/40 opacity-100"></div>
            <div id="headlessui-dialog-panel-:r4t:" data-headlessui-state="open">
              <div
                className="fixed inset-x-0 top-0 z-50 flex h-14 items-center justify-between gap-12 px-4 transition sm:px-6 lg:left-72 lg:z-30 lg:px-8 xl:left-80 bg-white dark:bg-zinc-900 opacity-100"
                style={{ "--bg-opacity-light": "0.5", "--bg-opacity-dark": "0.2" }}
              >
                <div className="absolute inset-x-0 top-full h-px transition bg-zinc-900/7.5 dark:bg-white/7.5"></div>
                <div className="flex items-center gap-5 lg:hidden">
                  <button
                    type="button"
                    className="flex h-6 w-6 items-center justify-center rounded-md transition hover:bg-zinc-900/5 dark:hover:bg-white/5"
                    aria-label="Toggle navigation"
                    tabIndex="0"
                    onClick={closeMobileMenu}
                  >
                    <svg
                      viewBox="0 0 10 9"
                      fill="none"
                      strokeLinecap="round"
                      aria-hidden="true"
                      className="w-2.5 stroke-zinc-900 dark:stroke-white"
                    >
                      <path d="m1.5 1 7 7M8.5 1l-7 7"></path>
                    </svg>
                  </button>
                  <a aria-label="Home" href="/">
                    <img src={`${CDN_HOST}/assets/logo.png`} width="70px" />
                  </a>
                </div>
                <div className="flex items-center gap-4">
                  <CustomerService />
                  {currentUser.isSignedIn() && <Notification />}

                  <div className="h-5 w-px bg-zinc-900/10 dark:bg-zinc-600"></div>
                  <button
                    type="button"
                    className="flex h-6 w-6 items-center justify-center rounded-md transition hover:bg-zinc-900/5 dark:hover:bg-white/5"
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
                    <svg
                      viewBox="0 0 20 20"
                      fill="none"
                      aria-hidden="true"
                      className="hidden h-5 w-5 stroke-white dark:block"
                    >
                      <path d="M15.224 11.724a5.5 5.5 0 0 1-6.949-6.949 5.5 5.5 0 1 0 6.949 6.949Z"></path>
                    </svg>
                  </button>
                </div>
              </div>
              <div className="fixed left-0 top-14 bottom-0 w-full overflow-y-auto bg-white px-4 pt-6 pb-4 shadow-lg shadow-zinc-900/10 ring-1 ring-zinc-900/7.5 dark:bg-zinc-900 dark:ring-zinc-800 min-[416px]:max-w-sm sm:px-6 sm:pb-10 translate-x-0">
                <Menu
                  isMobile={true}
                  onShowSignInModal={onShowSignInModal}
                  conversations={conversations}
                  closeMobileMenu={closeMobileMenu}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default MobileMenu
