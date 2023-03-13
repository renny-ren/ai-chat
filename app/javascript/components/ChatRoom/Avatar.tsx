import React, { useState, Fragment } from "react"
import currentUser from "stores/current_user_store"
import { Popover, Transition } from "@headlessui/react"

interface AvatarProps {
  src: string
  isRobot: boolean
  openModal?: any
}

const Avatar: React.FC<AvatarProps> = ({ src, isRobot, openModal }) => {
  return (
    <>
      {isRobot ? (
        <>
          <Popover className="relative mt-1">
            {({ open }) => (
              <>
                <Popover.Button className={`${open ? "" : "text-opacity-90"} outline-none inline-block h-10 w-10`}>
                  <img className="cursor-pointer rounded-full ring-2 ring-white" src={src} />
                </Popover.Button>
                <Transition
                  as={Fragment}
                  enter="transition ease-out duration-200"
                  enterFrom="opacity-0 translate-y-1"
                  enterTo="opacity-100 translate-y-0"
                  leave="transition ease-in duration-150"
                  leaveFrom="opacity-100 translate-y-0"
                  leaveTo="opacity-0 translate-y-1"
                >
                  <Popover.Panel className="absolute left-1/2 top-1/3 z-10 mt-2 px-4 pb-4 transform sm:px-0 w-max max-w-sm lg:max-w-3xl">
                    <div className="overflow-hidden rounded-lg shadow-lg ring-1 ring-black ring-opacity-5">
                      <div className="bg-gray-50 p-2">
                        <button
                          type="button"
                          onClick={openModal}
                          className="flow-root rounded-md px-2 py-2 transition duration-150 ease-in-out hover:bg-gray-100 focus:outline-none focus-visible:ring focus-visible:ring-orange-500 focus-visible:ring-opacity-50"
                        >
                          <span className="block text-sm text-gray-600">清除记忆</span>
                        </button>
                      </div>
                    </div>
                  </Popover.Panel>
                </Transition>
              </>
            )}
          </Popover>
        </>
      ) : (
        <img className="mt-1 inline-block h-10 w-10 rounded-full ring-2 ring-white aspect-square" src={src} />
      )}
    </>
  )
}

export default Avatar
