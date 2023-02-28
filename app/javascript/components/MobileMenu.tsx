import React, { useState } from "react"
import Sidebar from "./Sidebar"
import Menu from "./Menu"

interface MobileMenuProps {
  setIsShow: boolean
  onShowSignInModal: () => void
}

const MobileMenu: React.FC<MobileMenuProps> = ({ setIsShow, onShowSignInModal }) => {
  return (
    <div>
      <div data-headlessui-portal="">
        <button
          type="button"
          data-headlessui-focus-guard="true"
          aria-hidden="true"
          style={{
            position: "fixed",
            top: "1px",
            left: "1px",
            width: "1px",
            height: "0px",
            padding: "0px",
            margin: "-1px",
            overflow: "hidden",
            clip: "rect(0px, 0px, 0px, 0px)",
            whiteSpace: "nowrap",
            borderWidth: "0px",
          }}
        ></button>
        <div>
          <div
            className="fixed inset-0 z-50 lg:hidden"
            id="headlessui-dialog-:r4s:"
            role="dialog"
            aria-modal="true"
            data-headlessui-state="open"
          >
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
                    onClick={() => setIsShow(false)}
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
                    <img src="/assets/logo.png" width="60px" />
                  </a>
                </div>
              </div>
              <div className="fixed left-0 top-14 bottom-0 w-full overflow-y-auto bg-white px-4 pt-6 pb-4 shadow-lg shadow-zinc-900/10 ring-1 ring-zinc-900/7.5 dark:bg-zinc-900 dark:ring-zinc-800 min-[416px]:max-w-sm sm:px-6 sm:pb-10 translate-x-0">
                <Menu isMobile={true} onShowSignInModal={onShowSignInModal} />
              </div>
            </div>
          </div>
        </div>
        <button
          type="button"
          data-headlessui-focus-guard="true"
          aria-hidden="true"
          style={{
            position: "fixed",
            top: "1px",
            left: "1px",
            width: "1px",
            height: "0px",
            padding: "0px",
            margin: "-1px",
            overflow: "hidden",
            clip: "rect(0px, 0px, 0px, 0px)",
            whiteSpace: "nowrap",
            borderWidth: "0px",
          }}
        ></button>
      </div>
    </div>
  )
}

export default MobileMenu
