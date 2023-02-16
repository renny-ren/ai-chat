import React, { Fragment, useRef, useState, useEffect } from "react"
import { Dialog, Transition } from "@headlessui/react"
import { ExclamationTriangleIcon } from "@heroicons/react/24/outline"
import { LockClosedIcon } from "@heroicons/react/20/solid"
import { message } from "antd"
import axios from "axios"

interface SignInModalProps {
  isShow: boolean
  setOpen: () => void
}

const SignInModal: React.FC<SignInModalProps> = ({ isShow, setOpen }) => {
  const nameRef = useRef(null)
  const [mode, setMode] = useState("sign_in")
  const [formErrors, setFormErrors] = useState([])

  const onSignIn = () => {
    console.log("===")
  }

  const onSignUp = async (e) => {
    e.preventDefault()
    const csrf = document.querySelector("meta[name='csrf-token']").getAttribute("content")
    try {
      // const response = await axios.post(
      //   "/users",
      //   {
      //     nickname: e.target.elements.nickname.value,
      //     username: e.target.elements.username.value,
      //     password: e.target.elements.password.value,
      //   },
      //   {
      //     headers: {
      //       "X-CSRF-Token": csrf,
      //     },
      //   }
      // )
      message.success("注册成功！")
      setOpen(false)
      // console.log("response", response)
    } catch (error) {
      if (error.response.status === 400) {
        setFormErrors(error.response.data.message)
      }
    }
  }

  const toggleMode = () => {
    setMode(mode === "sign_in" ? "sign_up" : "sign_in")
  }

  return (
    <Transition.Root show={isShow} as={Fragment}>
      <Dialog as="div" className="relative z-10" initialFocus={nameRef} onClose={() => setOpen(false)}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-0 z-10 overflow-y-auto">
          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            {mode === "sign_in" && (
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                enterTo="opacity-100 translate-y-0 sm:scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              >
                <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
                  <div className="flex min-h-full items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
                    <div className="w-full max-w-md space-y-8">
                      <div>
                        <img
                          className="mx-auto h-12 w-auto"
                          src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=600"
                          alt="Your Company"
                        />
                        <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">登录账号</h2>
                        <p className="mt-2 text-center text-sm text-gray-600">
                          或{" "}
                          <span
                            onClick={toggleMode}
                            className="cursor-pointer font-medium text-indigo-600 hover:text-indigo-500"
                          >
                            注册新账号
                          </span>
                        </p>
                      </div>
                      <form className="mt-8 space-y-6" action="/users/sign_in" method="POST">
                        <input type="hidden" name="remember" defaultValue="true" />
                        <div className="-space-y-px rounded-md shadow-sm">
                          <div>
                            <label htmlFor="username" className="sr-only">
                              用户名
                            </label>
                            <input
                              id="username"
                              name="username"
                              type="username"
                              autoComplete="username"
                              ref={nameRef}
                              required
                              className="relative block w-full appearance-none rounded-none rounded-t-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                              placeholder="用户名"
                            />
                          </div>
                          <div>
                            <label htmlFor="password" className="sr-only">
                              密码
                            </label>
                            <input
                              id="password"
                              name="password"
                              type="password"
                              autoComplete="current-password"
                              required
                              className="relative block w-full appearance-none rounded-none rounded-b-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                              placeholder="密码"
                            />
                          </div>
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <input
                              id="remember-me"
                              name="remember-me"
                              type="checkbox"
                              className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                            />
                            <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
                              记住我
                            </label>
                          </div>

                          <div className="text-sm">
                            <a href="#" className="font-medium text-indigo-600 hover:text-indigo-500">
                              忘记密码?
                            </a>
                          </div>
                        </div>

                        <div>
                          <button
                            type="submit"
                            onClick={onSignIn}
                            className="group relative flex w-full justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                          >
                            <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                              <LockClosedIcon
                                className="h-5 w-5 text-indigo-500 group-hover:text-indigo-400"
                                aria-hidden="true"
                              />
                            </span>
                            登录
                          </button>
                        </div>
                      </form>
                    </div>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            )}

            {mode === "sign_up" && (
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                enterTo="opacity-100 translate-y-0 sm:scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              >
                <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
                  <div className="flex min-h-full items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
                    <div className="w-full max-w-md space-y-8">
                      <div>
                        <img
                          className="mx-auto h-12 w-auto"
                          src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=600"
                          alt="Your Company"
                        />
                        <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">注册新账号</h2>
                        <p className="mt-2 text-center text-sm text-gray-600">
                          或{" "}
                          <span
                            onClick={toggleMode}
                            className="cursor-pointer font-medium text-indigo-600 hover:text-indigo-500"
                          >
                            登录已有账号
                          </span>
                        </p>
                      </div>
                      <form className="mt-8 space-y-6" onSubmit={onSignUp}>
                        <div className="-space-y-px rounded-md shadow-sm">
                          <div>
                            <label htmlFor="nickname" className="sr-only">
                              昵称
                            </label>
                            <input
                              id="nickname"
                              name="nickname"
                              type="nickname"
                              autoComplete="nickname"
                              ref={nameRef}
                              required
                              className="relative block w-full appearance-none rounded-none rounded-t-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                              placeholder="昵称（用于展示）"
                            />
                          </div>
                          <div>
                            <label htmlFor="username" className="sr-only">
                              用户名
                            </label>
                            <input
                              id="username"
                              name="username"
                              type="username"
                              autoComplete="username"
                              required
                              className="relative block w-full appearance-none rounded-none border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                              placeholder="用户名（用于登录）"
                            />
                          </div>
                          <div>
                            <label htmlFor="password" className="sr-only">
                              密码
                            </label>
                            <input
                              id="password"
                              name="password"
                              type="password"
                              autoComplete="current-password"
                              required
                              className="relative block w-full appearance-none rounded-none border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                              placeholder="密码"
                            />
                          </div>
                          <div>
                            <label htmlFor="password_confirmation" className="sr-only">
                              确认密码
                            </label>
                            <input
                              id="password_confirmation"
                              name="password_confirmation"
                              type="password"
                              required
                              className="relative block w-full appearance-none rounded-none rounded-b-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                              placeholder="确认密码"
                            />
                          </div>
                        </div>

                        {!!formErrors.length && (
                          <div className="text-indigo-600 rounded relative" role="alert">
                            <ul>
                              {formErrors.map((error, i) => (
                                <li key={i}>{error}</li>
                              ))}
                            </ul>
                          </div>
                        )}

                        <div>
                          <button
                            type="submit"
                            className="group relative flex w-full justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                          >
                            <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                              <LockClosedIcon
                                className="h-5 w-5 text-indigo-500 group-hover:text-indigo-400"
                                aria-hidden="true"
                              />
                            </span>
                            提交
                          </button>
                        </div>
                      </form>
                    </div>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            )}
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  )
}

export default SignInModal
