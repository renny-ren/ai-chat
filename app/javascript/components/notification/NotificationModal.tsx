import React, { Fragment, useState, useEffect } from "react"
import { Dialog, Transition } from "@headlessui/react"
import Markdown from "marked-react"

interface NotificationModalProps {
  isOpen: boolean
  closeModal: () => void
  notification: {}
}

const NotificationModal: React.FC<NotificationModalProps> = ({ notification, isOpen, closeModal }) => {
  const renderer = {
    list(body, ordered) {
      return ordered ? (
        <ol key="key" className="c-ordered-list">
          {body}
        </ol>
      ) : (
        <ul key="key" className="c-list">
          {body}
        </ul>
      )
    },
  }

  return (
    <Transition show={isOpen} as={Fragment}>
      <Dialog className="relative z-50" onClose={closeModal}>
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
                  {notification.title}
                </Dialog.Title>
                <div className="mt-2 text-sm text-gray-600 leading-normal">
                  <Markdown value={notification.body} renderer={renderer} />
                </div>
                <button className="absolute" type="button"></button>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  )
}

export default NotificationModal
