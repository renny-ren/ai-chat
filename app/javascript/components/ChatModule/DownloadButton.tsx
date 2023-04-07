import React, { useEffect, useState, Fragment } from "react"
import * as UserApi from "shared/api/user"
import { Tooltip } from "antd"
import { Dialog, Transition } from "@headlessui/react"
import currentUser from "stores/current_user_store"
import UpgradeButton from "components/common/UpgradeButton"

interface DownloadButtonProps {
  messages: any
  conversationId: number
}

const DownloadButton: React.FC<DownloadButtonProps> = ({ messages, conversationId }) => {
  let [isOpen, setIsOpen] = useState(false)

  const closeModal = () => {
    setIsOpen(false)
  }

  const openModal = () => {
    setIsOpen(true)
  }

  const onClickDownload = (type = "md") => {
    fetchConversation().then((data) => {
      const content = messages
        .map((msg) =>
          msg.role === "user" ? `我: ${msg.content}\n` : `AI: ${msg.content}\n\n======================================\n`
        )
        .join("\n")
      const file = new Blob([content], { type: type === "md" ? "text/markdown" : "text/plain" })
      const downloadLink = document.createElement("a")
      downloadLink.download = `${data.conversation.title} - aii.chat 对话记录.${type}`
      downloadLink.href = URL.createObjectURL(file)

      document.body.appendChild(downloadLink)
      downloadLink.click()
    })
  }

  const fetchConversation = async () => {
    const res = await UserApi.fetchConversation(conversationId)
    return res.json
  }

  return (
    <>
      <Tooltip title="导出对话内容">
        <button
          type="button"
          onClick={openModal}
          className="outline-none inline-flex mr-2 px-2 py-1 text-xs text-gray-600 transition-colors duration-300 transform border rounded-md dark:text-gray-200 dark:border-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
        >
          <svg className="h-5 w-5 icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M917.333333 443.733333V426.666667c0-164.266667-134.4-298.666667-298.666666-298.666667-113.066667 0-215.466667 64-264.533334 162.133333-21.333333-8.533333-42.666667-12.8-66.133333-12.8C187.733333 277.333333 106.666667 358.4 106.666667 458.666667v17.066666c-64 38.4-106.666667 108.8-106.666667 185.6 0 117.333333 96 213.333333 213.333333 213.333334h106.666667c23.466667 0 42.666667-19.2 42.666667-42.666667s-19.2-42.666667-42.666667-42.666667h-106.666667c-70.4 0-128-57.6-128-128 0-53.333333 34.133333-102.4 85.333334-119.466666 21.333333-8.533333 34.133333-32 25.6-53.333334-2.133333-10.666667-4.266667-19.2-4.266667-29.866666C192 405.333333 234.666667 362.666667 288 362.666667c21.333333 0 42.666667 6.4 59.733333 21.333333 10.666667 8.533333 25.6 10.666667 38.4 8.533333 12.8-4.266667 23.466667-14.933333 27.733334-27.733333 27.733333-89.6 110.933333-149.333333 204.8-149.333333 117.333333 0 213.333333 96 213.333333 213.333333 0 10.666667 0 21.333333-2.133333 32-2.133333 19.2 6.4 36.266667 23.466666 44.8 51.2 25.6 85.333333 76.8 85.333334 134.4 0 76.8-57.6 140.8-132.266667 149.333333H704c-23.466667 0-42.666667 19.2-42.666667 42.666667s19.2 42.666667 42.666667 42.666667h106.666667c4.266667 0 10.666667 0 14.933333-2.133334C938.666667 853.333333 1024 755.2 1024 640c0-78.933333-40.533333-153.6-106.666667-196.266667"
              fill="#707070"
            ></path>
            <path
              d="M512 448c-23.466667 0-42.666667 19.2-42.666667 42.666667v196.266666l-34.133333-34.133333c-17.066667-17.066667-42.666667-17.066667-59.733333 0s-17.066667 42.666667 0 59.733333l106.666666 106.666667c2.133333 2.133333 4.266667 4.266667 6.4 4.266667 2.133333 0 2.133333 2.133333 4.266667 2.133333s2.133333 2.133333 4.266667 2.133333 2.133333 0 4.266666 2.133334h25.6c2.133333 0 2.133333 0 4.266667-2.133334 2.133333 0 2.133333-2.133333 4.266667-2.133333s2.133333-2.133333 4.266666-2.133333c2.133333-2.133333 4.266667-2.133333 6.4-4.266667l106.666667-106.666667c17.066667-17.066667 17.066667-42.666667 0-59.733333s-42.666667-17.066667-59.733333 0L554.666667 686.933333V490.666667c0-23.466667-19.2-42.666667-42.666667-42.666667"
              fill="#707070"
            ></path>
          </svg>
        </button>
      </Tooltip>

      <Transition appear show={isOpen} as={Fragment}>
        <Dialog as="div" className="relative z-50" onClose={closeModal}>
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
                    导出会话
                  </Dialog.Title>

                  {currentUser.plan().export_conversation ? (
                    <>
                      <div className="text-center text-sm text-gray-600">请选择导出的格式</div>
                      <div className="mt-4 flex justify-center gap-6">
                        <button
                          type="button"
                          className="inline-flex justify-center rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                          onClick={() => onClickDownload("md")}
                        >
                          Markdown
                        </button>
                        <button
                          type="button"
                          className="inline-flex justify-center rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                          onClick={() => onClickDownload("txt")}
                        >
                          TXT
                        </button>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="text-center text-sm text-gray-600">当前套餐不支持导出</div>
                      <div className="text-center mt-4">
                        <UpgradeButton size="small" />
                      </div>
                    </>
                  )}
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  )
}

export default DownloadButton
