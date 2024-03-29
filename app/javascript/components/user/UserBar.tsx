import React, { Fragment, useState, createElement, useEffect } from "react"
import { Menu, Transition } from "@headlessui/react"
import { ChevronDownIcon } from "@heroicons/react/20/solid"
import currentUser from "stores/current_user_store"
import { message } from "antd"
import axios from "axios"
import { Link, useLocation } from "react-router-dom"

interface UserBarProps {}

function classNames(...classes) {
  return classes.filter(Boolean).join(" ")
}

const handleLogOut = async (e) => {
  e.preventDefault()
  try {
    await axios.delete("/users/sign_out")
    window.location.href = "/"
    message.success("登出成功")
  } catch (error) {
    message.error(error.response.data.message)
  }
}

const UserBar: React.FC<UserBarProps> = ({}) => {
  return (
    <Menu as="div" className="relative inline-block text-left">
      <div>
        <Menu.Button className="outline-none">
          <img className="inline-block h-8 w-8 rounded-full" src={currentUser.avatarUrl()} />
        </Menu.Button>
      </div>

      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <Menu.Items className="absolute right-0 z-10 mt-2 w-32 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
          <div className="py-1">
            <Menu.Item>
              {({ active }) => (
                <a
                  href="/settings"
                  className={classNames(active ? "bg-gray-100 text-gray-900" : "text-gray-700", "block px-4 py-2 text-sm")}
                >
                  账户设置
                </a>
              )}
            </Menu.Item>
            <Menu.Item>
              {({ active }) => (
                <Link
                  className={classNames(active ? "bg-gray-100 text-gray-900" : "text-gray-700", "block px-4 py-2 text-sm")}
                  to="/invitation"
                >
                  <span className="truncate">邀请返利</span>
                </Link>
              )}
            </Menu.Item>
            <form onSubmit={handleLogOut}>
              <Menu.Item>
                {({ active }) => (
                  <button
                    type="submit"
                    className={classNames(
                      active ? "bg-gray-100 text-gray-900" : "text-gray-700",
                      "block w-full px-4 py-2 text-left text-sm"
                    )}
                  >
                    登出
                  </button>
                )}
              </Menu.Item>
            </form>
          </div>
        </Menu.Items>
      </Transition>
    </Menu>
  )
}
export default UserBar
