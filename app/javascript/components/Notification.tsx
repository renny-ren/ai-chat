import React, { Fragment, useState, useEffect } from "react"
import { Popover, Transition } from "@headlessui/react"
import { ChevronDownIcon } from "@heroicons/react/20/solid"

interface NotificationProps {
  className: string
}

const Notification: React.FC<NotificationProps> = ({ className = "" }) => {
  const [notifications, setNotifications] = useState([])

  const onShowList = () => {
    fetchNotifications()
  }

  const fetchNotifications = async () => {
    const csrf = document.querySelector("meta[name='csrf-token']").getAttribute("content")
    const response = await axios.get(`/v1/notifications`, {
      headers: {
        "X-CSRF-Token": csrf,
      },
    })
    setNotifications(response.data.notifications)
  }

  return (
    <>
      <div>
        <Popover className="relative">
          {({ open }) => (
            <>
              <Popover.Button
                onClick={onShowList}
                className="relative hidden md:block flex outline-none sm:hover:bg-zinc-900/5 dark:hover:bg-white/5"
              >
                <svg className="h-5 w-5 icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M882.529 773.81c-29.949-20.083-52.659-49.054-67.498-86.108-11.813-29.496-16.004-58.676-16.004-74.701V479.753h0.912c0-124.882-79.501-231.183-190.646-271.091v-47.107c0-53.215-43.293-96.508-96.508-96.508s-96.508 43.293-96.508 96.508v46.533C304.28 247.539 224 354.262 224 479.753h0.982V613c0 16.025-4.191 45.205-16.003 74.701-14.839 37.055-37.549 66.025-67.498 86.108a31.182 31.182 0 0 0 17.366 57.078h195.5c14.418 73.63 79.425 129.362 157.214 129.362s142.797-55.732 157.215-129.362h196.389a31.18 31.18 0 0 0 17.364-57.077z m-403.89-612.255c0-18.828 15.318-34.146 34.146-34.146s34.146 15.318 34.146 34.146v32.347a290.68 290.68 0 0 0-34.962-2.118c-11.275 0-22.393 0.67-33.331 1.931v-32.16z m32.922 734.633c-42.229 0-78.187-27.369-91.067-65.3H602.63c-12.881 37.93-48.839 65.3-91.069 65.3zM235.176 768.525c12.649-17.364 23.307-36.694 31.695-57.64 18.997-47.437 20.473-86.916 20.473-97.886V471.655c4.265-120.393 103.191-216.688 224.625-216.688 122.061 0 221.394 97.289 224.696 218.552V613c0 10.97 1.476 50.449 20.473 97.886 8.388 20.945 19.046 40.275 31.695 57.64H235.176z"
                    fill="#707070"
                  ></path>
                </svg>
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
                <Popover.Panel className="absolute left-1/2 z-10 mt-3 w-screen max-w-sm -translate-x-1/2 transform px-4 sm:px-0 lg:max-w-3xl">
                  <div className="overflow-hidden rounded-lg shadow-lg ring-1 ring-black ring-opacity-5">
                    <div className="relative grid gap-8 bg-white p-7 lg:grid-cols-2">
                      {notifications.map((item) => (
                        <a
                          key={item.name}
                          href={item.href}
                          className="-m-3 flex items-center rounded-lg p-2 transition duration-150 ease-in-out hover:bg-gray-50 focus:outline-none focus-visible:ring focus-visible:ring-orange-500 focus-visible:ring-opacity-50"
                        >
                          <div className="ml-4">
                            <p className="text-sm font-medium text-gray-900">{item.name}</p>
                            <p className="text-sm text-gray-500">{item.description}</p>
                          </div>
                        </a>
                      ))}
                    </div>
                    <div className="bg-gray-50 p-4">
                      <a
                        href="##"
                        className="flow-root rounded-md px-2 py-2 transition duration-150 ease-in-out hover:bg-gray-100 focus:outline-none focus-visible:ring focus-visible:ring-orange-500 focus-visible:ring-opacity-50"
                      >
                        <span className="flex items-center">
                          <span className="text-sm font-medium text-gray-900">Documentation</span>
                        </span>
                        <span className="block text-sm text-gray-500">Start integrating products and tools</span>
                      </a>
                    </div>
                  </div>
                </Popover.Panel>
              </Transition>
            </>
          )}
        </Popover>
      </div>
    </>
  )
}

export default Notification
