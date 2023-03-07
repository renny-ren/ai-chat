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
      <div className="flex gap-4">
        <button onClick={openModal} type="button" className="flex h-6 w-6 outline-none">
          <svg className="h-5 w-5 icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M512 127.808L768.064 384 800 384a96 96 0 0 1 95.552 86.784L896 480v320a96 96 0 0 1-86.784 95.552L800 896h-576a96 96 0 0 1-95.552-86.784L128 800v-320a96 96 0 0 1 86.784-95.552L224 384h31.744l256.192-256.192zM832 448H192v384h640V448z m-128 224v64H320v-64h384z m-128-128v64H320v-64h256zM512 218.304L346.24 384h331.328L511.936 218.304z"
              fill="#52525B"
            ></path>
          </svg>
        </button>
      </div>

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
                        点击下方聊天框左边机器人按钮
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
                        即可与AI交流
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
