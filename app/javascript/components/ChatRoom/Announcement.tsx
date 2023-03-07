import React, { Fragment, useState } from "react"
import currentUser from "stores/current_user_store"
import { Dialog, Transition } from "@headlessui/react"

interface AnnouncementProps {}

const Announcement: React.FC<AnnouncementProps> = ({ src, isRobot }) => {
  let [isOpen, setIsOpen] = useState(false)

  function closeModal() {
    setIsOpen(false)
  }

  function openModal() {
    setIsOpen(true)
  }
  return (
    <>
      <button
        onClick={openModal}
        type="button"
        className="flex h-6 w-6 outline-none sm:hover:bg-zinc-900/5 dark:hover:bg-white/5"
      >
        {/* https://www.iconfont.cn/collections/detail?spm=a313x.7781069.0.da5a778a4&cid=33
        https://www.iconfont.cn/collections/detail?spm=a313x.7781069.0.da5a778a4&cid=12583*/}
        <svg className="h-5 w-5 icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M295.23 535.28h380.58c17.62 0 35.27 0.36 52.88 0h0.78c15.71 0 30.77-13.82 30-30s-13.2-30.05-30-30.05H348.89c-17.62 0-35.27-0.35-52.88 0h-0.78c-15.71 0-30.77 13.82-30 30.05s13.2 30 30 30zM294.51 658.59h380.58c17.61 0 35.27 0.36 52.88 0h0.77c15.72 0 30.77-13.82 30-30s-13.2-30-30-30H348.16c-17.61 0-35.27-0.36-52.88 0h-0.77c-15.72 0-30.77 13.81-30 30s13.2 30 30 30zM295.23 789.56h217.12c15.72 0 30.77-13.82 30-30s-13.2-30-30-30H295.23c-15.71 0-30.77 13.81-30 30s13.2 30 30 30z"
            fill="#707070"
          ></path>
          <path
            d="M959 663.28V437.83c0-14.61 0.58-29.35-4.06-43.49a91.76 91.76 0 0 0-87.62-63.4H757.5l-70.61-73.44-124.35-129.32-28.22-29.35c-11.13-11.57-31.34-11.49-42.49 0l-79.05 81.45-125.1 128.89-21.13 21.77h-107.9c-2.1 0-4.21 0-6.31 0.06-29.6 1.36-54.79 16-71.95 39.84C67.32 389 65 410.54 65 432.05v409.07c0 10.27 1 20.83 4.48 30.55 9.79 27.75 30.86 48.89 58.92 58.1 12 3.94 24.35 4.05 36.76 4.05h703.69c30.07-0.34 56.32-14.86 74-38.86 10.86-14.77 16.08-33.68 16.16-51.88v-30.33zM887.17 397a11.48 11.48 0 0 1-1.41-1.1c0.09-0.07 0.69 0.43 1.41 1.1z m-506.71-97.16l125.11-128.9 7.41-7.63q28.5 29.66 57 59.3l104.18 108.33H350.28z m-249.4 102.9a11.17 11.17 0 0 1-1.1 1.42c-0.07-0.1 0.43-0.69 1.1-1.42z m5.75 465a11.48 11.48 0 0 1 1.41 1.1c-0.1 0.09-0.69-0.41-1.41-1.08z m582.89 6H155.87c-1.58 0-3.16-0.06-4.73-0.16a67 67 0 0 1-7.73-2.12 61.31 61.31 0 0 1-6-3.43c-0.37-0.24-0.74-0.49-1.1-0.75-1.1-1-2.28-2.23-2.39-2.34-1-1-1.89-2.12-2.86-3.15a59 59 0 0 1-3.66-6.35 64.26 64.26 0 0 1-2.1-7.6c-0.29-4.58-0.18-9.19-0.18-13.78V470.73c0-16.46-0.14-32.92 0-49.38 0-1.43 0.06-2.85 0.15-4.27a65.15 65.15 0 0 1 2.13-7.77 59.33 59.33 0 0 1 3.43-6c0.24-0.37 0.49-0.74 0.75-1.1 1-1.1 2.23-2.28 2.34-2.39 1-1 2.12-1.89 3.15-2.86a58.85 58.85 0 0 1 6.34-3.66 64.54 64.54 0 0 1 7.7-2.12c7.1-0.5 14.35-0.16 21.42-0.16H868.11c1.59 0 3.18 0.06 4.77 0.16a64.33 64.33 0 0 1 7.72 2.12 58.4 58.4 0 0 1 6 3.43c0.37 0.24 0.73 0.49 1.1 0.75 1.1 1 2.27 2.23 2.39 2.34 1 1 1.89 2.12 2.86 3.15a60.58 60.58 0 0 1 3.66 6.34 64.91 64.91 0 0 1 2.09 7.61c0.29 4.58 0.19 9.18 0.19 13.77V794c0 16.45 0.14 32.92 0 49.37 0 1.44-0.06 2.86-0.16 4.28a65 65 0 0 1-2.12 7.76 60.31 60.31 0 0 1-3.43 6c-0.24 0.37-0.5 0.73-0.75 1.1-1 1.1-2.23 2.28-2.34 2.39-1 1-2.12 1.89-3.16 2.86a60.58 60.58 0 0 1-6.34 3.66 64.84 64.84 0 0 1-7.75 2.13c-1.33 0.08-2.66 0.14-4 0.15H719.7zM892.92 862a11.48 11.48 0 0 1 1.1-1.41c0.07 0.1-0.43 0.7-1.1 1.41z"
            fill="#707070"
          ></path>
        </svg>
      </button>

      <Transition appear show={isOpen} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={closeModal}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-25" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                  <Dialog.Title as="h3" className="text-lg font-medium leading-6 text-gray-900">
                    公告
                  </Dialog.Title>
                  <div className="mt-2">
                    <p className="text-sm text-gray-500">
                      <span>
                        点击下方聊天框左边
                        <svg
                          className="h-5 w-5 relative inline-block"
                          viewBox="0 0 1024 1024"
                          strokeWidth="2"
                          version="1.1"
                          xmlns="http://www.w3.org/2000/svg"
                          style={{ top: "-2px" }}
                        >
                          <path
                            d="M405.333333 149.333333l67.562667 184.234667h91.776L632.234667 149.333333h64l-67.562667 184.234667h110.229333a64 64 0 0 1 64 64v407.274667a64 64 0 0 1-64 64H285.098667a64 64 0 0 1-64-64v-407.253334a64 64 0 0 1 64-64l123.797333-0.021333L341.333333 149.333333h64z m333.568 248.234667H285.098667v407.274667h453.802666v-407.253334zM192 496.490667v213.333333H128v-213.333333h64z m698.176 0v213.333333h-64v-213.333333h64zM405.333333 519.744a42.666667 42.666667 0 1 1 0 85.333333 42.666667 42.666667 0 0 1 0-85.333333z m213.333334 0a42.666667 42.666667 0 1 1 0 85.333333 42.666667 42.666667 0 0 1 0-85.333333z"
                            fill="#cdcdcd"
                          ></path>
                        </svg>
                        机器人按钮即可与AI交流
                      </span>
                    </p>
                  </div>

                  <div className="mt-4">
                    <button
                      type="button"
                      className="inline-flex justify-center rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                      onClick={closeModal}
                    >
                      好的
                    </button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  )
}

export default Announcement
