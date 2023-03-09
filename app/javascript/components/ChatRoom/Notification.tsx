import React, { Fragment, useState, useEffect } from "react"
import { Transition } from "@headlessui/react"

interface NotificationProps {
  noticeContent: string
  isShowNotice: boolean
  setShowNotification: any
}

const Notification: React.FC<NotificationProps> = ({ noticeContent, isShowNotice, setIsShowNotice }) => {
  return (
    <>
      <Transition
        as={Fragment}
        show={isShowNotice}
        enter="transform transition duration-[200ms]"
        enterFrom="opacity-0 rotate-[-120deg] scale-50"
        enterTo="opacity-100 rotate-0 scale-100"
        leave="transform duration-200 transition ease-in-out"
        leaveFrom="opacity-100 rotate-0 scale-100"
        leaveTo="opacity-0 scale-95"
      >
        <div className="bg-white/60 backdrop-blur-xl z-20 max-w-md absolute right-5 top-5 rounded-lg p-6 shadow">
          <div className="text-md text-slate-700 font-medium">👋 {noticeContent}</div>
        </div>
      </Transition>
    </>
  )
}

export default Notification
