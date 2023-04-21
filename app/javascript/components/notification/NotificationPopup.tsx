import React, { Fragment, useState, useEffect } from "react"
import { Dialog, Transition } from "@headlessui/react"
import Markdown from "marked-react"

interface NotificationPopupProps {
  isOpen: boolean
  closeModal: () => void
  notifications: any
}

const NotificationPopup: React.FC<NotificationPopupProps> = ({ notifications, isOpen, closePopup }) => {
  const renderer = {
    list(body, ordered) {
      return ordered ? <ol className="c-ordered-list-small">{body}</ol> : <ul className="c-list-small">{body}</ul>
    },
    image(href, title, text) {
      if (text) var size = text.split("x")
      return <img className="m-auto" key={href} src={href} alt={title} width={size[0]} height={size[1]} />
    },
  }

  return (
    <Transition
      as={Fragment}
      show={isOpen}
      enter="transition-opacity ease-linear duration-300"
      enterFrom="opacity-0"
      enterTo="opacity-100"
      leave="transition-opacity ease-linear duration-300"
      leaveFrom="opacity-100"
      leaveTo="opacity-0"
    >
      <div className="absolute right-2 top-14">
        {notifications.map((notification) => (
          <div className="mt-2 space-y-5">
            <div className="relative mx-auto max-w-[280px] md:max-w-[400px] rounded-md border border-gray-50 bg-white p-4 text-sm shadow-lg">
              <button
                onClick={() => closePopup(notification)}
                className="top-4 absolute right-4 ml-auto text-gray-500 hover:text-gray-900"
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5">
                  <path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" />
                </svg>
              </button>
              <div className="flex space-x-4">
                <div className="flex-1">
                  <h4 className="pr-6 text-gray-900">
                    {notification.title}
                    <span className="mx-4 font-normal text-xs text-gray-400">{notification.created_at_in_words}</span>
                  </h4>
                  <div className="mt-1 text-gray-500 leading-normal">
                    <Markdown value={notification.body} renderer={renderer} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </Transition>
  )
}

export default NotificationPopup
