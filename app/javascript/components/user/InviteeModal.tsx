import React, { Fragment, useState, useEffect } from "react"
import { Dialog, Transition } from "@headlessui/react"

interface InviteeModalProps {
  isOpen: boolean
  setIsOpen: () => void
}

const InviteeModal: React.FC<InviteeModalProps> = ({ isOpen, setIsOpen }) => {
  function closeModal() {
    setIsOpen(false)
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
                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-center align-middle shadow-xl transition-all">
                  <Dialog.Title as="h3" className="text-lg font-medium leading-6 text-gray-900">
                    恭喜你
                  </Dialog.Title>
                  <div className="mt-2">
                    <div className="text-center">
                      <img
                        className="inline-block h-32 w-32 my-2 ml-12 mr-4"
                        src="https://aii-chat-assets.oss-cn-chengdu.aliyuncs.com/images/gift_icon.png"
                      />
                      <div className="mt-2 leading-8 text-lg text-gray-900">
                        <p>通过邀请码注册成功</p>
                        <p>已为你自动升级为基础版</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-4 justify-center mt-4">
                    <button
                      type="button"
                      className="outline-none inline-flex w-full justify-center rounded-md border border-transparent bg-emerald-500 py-2 px-4 text-sm font-medium text-white hover:bg-emerald-600"
                      onClick={closeModal}
                    >
                      开始体验
                    </button>
                  </div>
                </Dialog.Panel>
                )
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  )
}

export default InviteeModal
