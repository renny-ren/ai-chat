import React, { Fragment, useState } from "react"
import currentUser from "stores/current_user_store"
import { Dialog, Transition } from "@headlessui/react"
import axios from "axios"
import { message } from "antd"

interface ClearConversationModalProps {
  isOpen: boolean
  closeModal: () => void
}

const ClearConversationModal: React.FC<ClearConversationModalProps> = ({ isOpen, closeModal }) => {
  const [loading, setLoading] = useState(false)

  const headers = {
    "X-CSRF-Token": document.querySelector("meta[name='csrf-token']").getAttribute("content"),
  }

  const clearConversations = async () => {
    try {
      setLoading(true)
      const response = await axios.post("/v1/users/clear_conversations", { headers: headers })
      message.success("清除记忆成功！")
      closeModal()
    } catch (error) {
      message.error(error.response.data.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
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
                    确认要清除记忆吗
                  </Dialog.Title>
                  <div className="mt-2 text-sm text-gray-500">
                    <p>确认后将清除 AI 机器人最近和你的会话记忆</p>
                    <p>你可以和他开始一轮全新的对话</p>
                  </div>

                  <div className="mt-4 flex gap-2">
                    <button
                      type="button"
                      className="inline-flex justify-center rounded-md border border-transparent bg-indigo-100 px-4 py-2 text-sm font-medium text-indigo-900 hover:bg-indigo-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                      onClick={clearConversations}
                    >
                      确认
                    </button>
                    <button
                      type="button"
                      className="inline-flex justify-center rounded-md border border-transparent bg-gray-100 px-4 py-2 text-sm font-medium text-gray-900 hover:bg-gray-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-500 focus-visible:ring-offset-2"
                      onClick={closeModal}
                    >
                      取消
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

export default ClearConversationModal
