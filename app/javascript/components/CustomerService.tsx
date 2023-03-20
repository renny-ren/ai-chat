import React, { Fragment, useState, useEffect } from "react"
import currentUser from "stores/current_user_store"
import { Dialog, Transition } from "@headlessui/react"
import axios from "axios"
import { CDN_HOST } from "shared/constants"

interface CustomerServiceProps {}

const CustomerService: React.FC<CustomerServiceProps> = ({}) => {
  let [isOpen, setIsOpen] = useState(currentUser.isSignedIn() && !currentUser.config().done_notice)

  const closeModal = () => {
    setIsOpen(false)
    updateUserConfig()
  }

  function openModal() {
    setIsOpen(true)
  }

  const updateUserConfig = async () => {
    await axios.put(`/v1/users/${currentUser.id()}`, { config: { done_notice: true } })
  }

  return (
    <>
      <button
        onClick={openModal}
        type="button"
        className={`relative flex h-6 w-6 outline-none sm:hover:bg-zinc-900/5 dark:hover:bg-white/5 md:block ${
          window.location.pathname === `/` ? "hidden" : ""
        }`}
      >
        <svg
          t="1679320459415"
          className="h-5 w-5 icon"
          viewBox="0 0 1024 1024"
          version="1.1"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M892.954 399.418C869.075 210.277 707.621 64 512 64S154.925 210.277 131.046 399.418C91.113 421.084 64 463.375 64 512v128c0 70.692 57.308 128 128 128s128-57.308 128-128V512c0-68.554-53.894-124.518-121.623-127.841C227.966 238.018 357.132 128 512 128c154.869 0 284.034 110.018 313.623 256.159C757.894 387.482 704 443.446 704 512v128c0 42.237 20.462 79.691 52.01 103.005-32.662 38.465-74.258 69.098-121.579 88.714C621.173 794.581 585.693 768 544 768h-64c-53.02 0-96 42.98-96 96s42.98 96 96 96h64c40.053 0 74.371-24.531 88.764-59.387 74.73-24.74 139.279-71.818 185.757-133.319 4.429 0.464 8.926 0.706 13.479 0.706 70.692 0 128-57.308 128-128V512c0-48.625-27.113-90.916-67.046-112.582zM256 512v128c0 35.347-28.654 64-64 64s-64-28.653-64-64V512c0-35.346 28.654-64 64-64s64 28.654 64 64z m288 384h-64c-17.673 0-32-14.327-32-32s14.327-32 32-32h64c17.673 0 32 14.327 32 32s-14.327 32-32 32z m352-256c0 35.347-28.654 64-64 64s-64-28.653-64-64V512c0-35.346 28.654-64 64-64s64 28.654 64 64v128z"
            fill="#707070"
          ></path>
        </svg>
      </button>

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
                    联系客服
                  </Dialog.Title>
                  <div className="py-4 flex justify-around">
                    <div>
                      <img
                        className="w-40"
                        src="https://aii-chat-assets.oss-cn-chengdu.aliyuncs.com/images/customer_service_wechat.png"
                      />
                      <div className="text-sm text-gray-500 text-center pt-1">微信</div>
                    </div>
                    <div>
                      <img
                        className="w-40"
                        src="https://aii-chat-assets.oss-cn-chengdu.aliyuncs.com/images/customer_service_qq.png"
                      />
                      <div className="text-sm text-gray-500 text-center pt-1">QQ</div>
                    </div>
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

export default CustomerService
