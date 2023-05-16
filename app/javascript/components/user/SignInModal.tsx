import React, { Fragment, useRef, useState, useContext } from "react"
import { AppContext } from "components/AppContext"
import { Dialog, Transition } from "@headlessui/react"
import { LockClosedIcon } from "@heroicons/react/20/solid"
import { message, Tooltip } from "antd"
import axios from "axios"
import { CDN_HOST } from "shared/constants"
import { EyeOutlined, EyeInvisibleOutlined, ReloadOutlined } from "@ant-design/icons"
import * as UserApi from "shared/api/user"

axios.interceptors.request.use((config) => {
  config.headers["Content-Type"] = "application/json"
  config.headers["Accept"] = "application/json"
  config.headers["X-CSRF-Token"] = document.querySelector("meta[name='csrf-token']").getAttribute("content")
  return config
})

interface SignInModalProps {
  isShow: boolean
}

const SignInModal: React.FC<SignInModalProps> = ({ isShow }) => {
  const nameRef = useRef(null)
  const [mode, setMode] = useState("sign_in")
  const [formErrors, setFormErrors] = useState([])
  const [rememberMe, setRememberMe] = useState(true)
  const [readAggrement, setReadAggrement] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const { setShowSigninModal } = useContext(AppContext)
  const [nickname, setNickname] = useState("")

  const onSignIn = async (e) => {
    e.preventDefault()
    try {
      const response = await axios.post("/users/sign_in", {
        username: e.target.elements.username.value,
        password: e.target.elements.password.value,
      })
      message.success("登录成功！")
      setShowSigninModal(false)
      gon.user_meta = response.data.user_meta
      if (rememberMe) {
        localStorage.setItem("username", e.target.elements.username.value)
      } else {
        localStorage.removeItem("username")
      }
    } catch (error) {
      setFormErrors([error.response.data.message])
    }
  }

  const onSignUp = async (e) => {
    e.preventDefault()
    try {
      const response = await axios.post("/users", {
        nickname: nickname,
        username: e.target.elements.username.value,
        password: e.target.elements.password.value,
        password_confirmation: e.target.elements.password_confirmation.value,
      })
      message.success("注册成功！正在自动登录")
      setShowSigninModal(false)
      gon.user_meta = response.data.user_meta
      localStorage.setItem("username", e.target.elements.username.value)
    } catch (error) {
      if (error.response.status === 400) {
        setFormErrors(error.response.data.message)
      }
    }
  }

  const toggleMode = () => {
    setMode(mode === "sign_in" ? "sign_up" : "sign_in")
    setFormErrors([])
  }

  const onFetchFakeName = async () => {
    const res = await UserApi.fetchFakeName()
    const data = await res.json
    setNickname(data.name)
  }

  return (
    <Transition.Root show={isShow} as={Fragment}>
      <Dialog as="div" className="relative z-50" initialFocus={nameRef} onClose={() => setShowSigninModal(false)}>
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
          <div className="flex min-h-full items-center justify-center text-center">
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
                <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 mx-8 w-full sm:max-w-lg">
                  <div className="flex min-h-full items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
                    <div className="w-full max-w-md space-y-8">
                      <div>
                        <img className="mx-auto h-8 w-auto" src={`${CDN_HOST}/assets/logo2.png`} alt="aiia.chat" />
                        <h2 className="mt-4 text-center text-3xl font-bold tracking-tight text-gray-900">登录账号</h2>
                        <p className="mt-2 text-center text-sm text-gray-600">
                          或
                          <span
                            onClick={toggleMode}
                            className="cursor-pointer font-medium text-emerald-500 hover:text-emerald-400"
                          >
                            注册新账号
                          </span>
                        </p>
                      </div>
                      <form className="mt-8 space-y-6" onSubmit={onSignIn}>
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
                              defaultValue={localStorage.getItem("username")}
                              ref={nameRef}
                              required
                              onInvalid={(e) => e.target.setCustomValidity("请输入用户名")}
                              onInput={(e) => e.target.setCustomValidity("")}
                              className="relative block w-full appearance-none rounded-none rounded-t-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-emerald-500 focus:outline-none focus:ring-emerald-500 sm:text-sm"
                              placeholder="用户名"
                            />
                          </div>
                          <div className="relative flex flex-row items-center justify-between">
                            <label htmlFor="password" className="sr-only">
                              密码
                            </label>
                            <input
                              id="password"
                              name="password"
                              type={showPassword ? "text" : "password"}
                              autoComplete="current-password"
                              required
                              onInvalid={(e) => e.target.setCustomValidity("请输入密码")}
                              onInput={(e) => e.target.setCustomValidity("")}
                              className="relative block w-full appearance-none rounded-none rounded-b-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-emerald-500 focus:outline-none focus:ring-emerald-500 sm:text-sm"
                              placeholder="密码"
                            />
                            <button
                              type="button"
                              onClick={() => setShowPassword(!showPassword)}
                              className="inline-flex items-center"
                            >
                              <EyeOutlined
                                className={`${
                                  showPassword ? "hidden" : "block"
                                } h-5 w-5 absolute right-2 top-3 z-10 text-gray-500`}
                              />
                              <EyeInvisibleOutlined
                                className={`${
                                  showPassword ? "block" : "hidden"
                                } h-5 w-5 absolute right-2 top-3 z-10 text-gray-500`}
                              />
                            </button>
                          </div>
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <input
                              id="rememberMe"
                              name="rememberMe"
                              type="checkbox"
                              checked={rememberMe}
                              onChange={(e) => setRememberMe(e.target.checked)}
                              className="h-4 w-4 rounded border-gray-300 text-emerald-500 focus:ring-emerald-500"
                            />
                            <label htmlFor="rememberMe" className="ml-2 block text-sm text-gray-900">
                              记住我
                            </label>
                          </div>

                          <div className="text-sm">
                            <a
                              onClick={() => message.info("请重新注册一个账号即可")}
                              className="cursor-pointer font-medium text-emerald-500 hover:text-emerald-400"
                            >
                              忘记密码?
                            </a>
                          </div>
                        </div>

                        {!!formErrors.length && (
                          <div className="text-orange-600 rounded relative" role="alert">
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
                            className="group relative flex w-full justify-center rounded-md border border-transparent bg-emerald-500 py-2 px-4 text-sm font-medium text-white hover:bg-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2"
                          >
                            <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                              <LockClosedIcon
                                className="h-5 w-5 text-emerald-400 group-hover:text-emerald-300"
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
                <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 mx-8 w-full sm:max-w-lg">
                  <div className="flex min-h-full items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
                    <div className="w-full max-w-md space-y-8">
                      <div>
                        <img className="mx-auto h-8 w-auto" src={`${CDN_HOST}/assets/logo2.png`} alt="aiia.chat" />
                        <h2 className="mt-4 text-center text-3xl font-bold tracking-tight text-gray-900">注册账号</h2>
                        <p className="mt-2 text-center text-sm text-gray-600">
                          或{" "}
                          <span
                            onClick={toggleMode}
                            className="cursor-pointer font-medium text-emerald-500 hover:text-emerald-400"
                          >
                            登录已有账号
                          </span>
                        </p>
                      </div>
                      <form className="mt-8 space-y-6" onSubmit={onSignUp}>
                        <div className="-space-y-px rounded-md shadow-sm">
                          <div className="relative flex flex-row items-center justify-between">
                            <label htmlFor="nickname" className="sr-only">
                              昵称
                            </label>
                            <input
                              type="text"
                              autoComplete="nickname"
                              ref={nameRef}
                              required
                              value={nickname}
                              onChange={(e) => setNickname(e.target.value)}
                              onInvalid={(e) => e.target.setCustomValidity("请输入昵称")}
                              onInput={(e) => e.target.setCustomValidity("")}
                              className="relative block w-full appearance-none rounded-none rounded-t-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-emerald-500 focus:outline-none focus:ring-emerald-500 sm:text-sm"
                              placeholder="昵称（用于展示）"
                            />
                            <Tooltip placement="topRight" title="随机一个昵称">
                              <button type="button" onClick={onFetchFakeName} className="inline-flex items-center">
                                <ReloadOutlined className="h-5 w-5 absolute right-2 top-3 z-10 text-gray-500" />
                              </button>
                            </Tooltip>
                          </div>
                          <div>
                            <label htmlFor="username" className="sr-only">
                              用户名
                            </label>
                            <input
                              id="username"
                              name="username"
                              type="username"
                              required
                              onInvalid={(e) => e.target.setCustomValidity("请输入用户名")}
                              onInput={(e) => e.target.setCustomValidity("")}
                              className="relative block w-full appearance-none rounded-none border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-emerald-500 focus:outline-none focus:ring-emerald-500 sm:text-sm"
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
                              required
                              onInvalid={(e) => e.target.setCustomValidity("请输入密码")}
                              onInput={(e) => e.target.setCustomValidity("")}
                              className="relative block w-full appearance-none rounded-none border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-emerald-500 focus:outline-none focus:ring-emerald-500 sm:text-sm"
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
                              onInvalid={(e) => e.target.setCustomValidity("请输入确认密码")}
                              onInput={(e) => e.target.setCustomValidity("")}
                              className="relative block w-full appearance-none rounded-none rounded-b-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-emerald-500 focus:outline-none focus:ring-emerald-500 sm:text-sm"
                              placeholder="确认密码"
                            />
                          </div>
                        </div>

                        <div className="flex items-center">
                          <input
                            id="readAggrement"
                            name="readAggrement"
                            type="checkbox"
                            required
                            checked={readAggrement}
                            onChange={(e) => setReadAggrement(e.target.checked)}
                            onInvalid={(e) => e.target.setCustomValidity("请阅读并勾选同意协议")}
                            onInput={(e) => e.target.setCustomValidity("")}
                            className="h-4 w-4 rounded border-gray-300 text-emerald-500 focus:ring-emerald-500"
                          />
                          <label htmlFor="readAggrement" className="ml-2 block text-sm text-gray-900">
                            已仔细阅读并同意
                            <a className="text-emerald-500 hover:text-emerald-600" target="_blank" href="/disclaimer">
                              《用户协议及免责声明》
                            </a>
                          </label>
                        </div>

                        {!!formErrors.length && (
                          <div className="text-orange-600 rounded relative" role="alert">
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
                            className="group relative flex w-full justify-center rounded-md border border-transparent bg-emerald-500 py-2 px-4 text-sm font-medium text-white hover:bg-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2"
                          >
                            <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                              <LockClosedIcon
                                className="h-5 w-5 text-emerald-500 group-hover:text-emerald-400"
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
