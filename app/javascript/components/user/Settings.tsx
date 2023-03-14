import React, { useState } from "react"
import currentUser from "stores/current_user_store"
import axios from "axios"
import { message } from "antd"
import Avatar from "./Avatar"

axios.interceptors.request.use((config) => {
  config.headers["Content-Type"] = "application/json"
  config.headers["Accept"] = "application/json"
  config.headers["X-CSRF-Token"] = document.querySelector("meta[name='csrf-token']").getAttribute("content")
  return config
})

const Settings: React.FC<SettingsProps> = ({}) => {
  const [nickname, setNickname] = useState(currentUser.nickname() || "")
  const [email, setEmail] = useState(currentUser.email() || "")
  const [avatarFile, setAvatarFile] = useState()

  const onSave = async (e) => {
    e.preventDefault()
    const formData = new FormData()
    formData.append("avatar", avatarFile)
    formData.append("nickname", nickname)
    formData.append("email", email)

    try {
      const response = await axios.put(`/v1/users/${currentUser.id()}`, formData)
      message.success("保存成功！")
    } catch (error) {
      message.error(error.response.data.message)
    }
  }

  return (
    <>
      <div className="relative px-4 pt-14 sm:px-6 lg:px-8">
        <main className="py-12 mx-auto max-w-2xl space-y-10 pb-16 lg:max-w-5xl">
          <div className="min-h-screen pb-24">
            <div className="container mx-auto max-w-3xl mt-8">
              <h1 className="text-2xl font-bold text-gray-700 px-6 md:px-0">账户设置</h1>
              <ul className="flex border-b border-gray-300 text-sm font-medium text-gray-600 mt-3 px-6 md:px-0">
                <li className="mr-8 text-gray-900 border-b-2 border-gray-800">
                  <a href="#_" className="py-4 inline-block">
                    个人信息
                  </a>
                </li>
                <li className="mr-8 hover:text-gray-900">
                  <a href="#_" className="py-4 inline-block">
                    安全设置
                  </a>
                </li>
                <li className="mr-8 hover:text-gray-900">
                  <a href="#_" className="py-4 inline-block">
                    支付信息
                  </a>
                </li>
              </ul>
              <form onSubmit={onSave}>
                <div className="w-full bg-white rounded-lg mx-auto flex overflow-hidden rounded-b-none">
                  <div className="w-1/5 border-r border-gray-100 p-8 hidden md:inline-block">
                    <h2 className="font-medium text-md text-gray-700 mb-4 tracking-wide">个人信息</h2>
                    <p className="text-xs text-gray-500"></p>
                  </div>
                  <div className="md:w-4/5 w-full">
                    <div className="p-8 flex flex-wrap items-center">
                      <div className="w-full lg:w-6/12 px-4">
                        <label className="text-sm text-gray-600 w-full block">头像</label>
                        <Avatar />
                      </div>
                    </div>
                    <hr className="border-gray-200" />

                    <div className="p-8 flex flex-wrap">
                      <div className="w-full lg:w-6/12 px-4">
                        <label className="text-sm text-gray-600">昵称</label>
                        <input
                          className="mt-2 border-1 border-gray-200 px-3 py-2 block w-full rounded-sm text-base text-gray-900 focus:outline-none focus:border-emerald-500 focus:ring-emerald-500"
                          name="nickname"
                          type="text"
                          autoComplete="nickname"
                          required
                          value={nickname}
                          onChange={(e) => setNickname(e.target.value)}
                          onInvalid={(e) => e.target.setCustomValidity("请输入用户名")}
                          onInput={(e) => e.target.setCustomValidity("")}
                        />
                      </div>
                      <div className="w-full lg:w-6/12 px-4">
                        <label className="text-sm text-gray-600">邮箱</label>
                        <input
                          className="mt-2 border-1 border-gray-200 px-3 py-2 block w-full rounded-sm text-base text-gray-900 focus:outline-none focus:border-emerald-500 focus:ring-emerald-500"
                          name="email"
                          type="email"
                          autoComplete="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex justify-end px-4 py-4 clearfix rounded-b-lg border-t border-gray-200">
                  <button
                    type="submit"
                    className="group float-right relative flex justify-center rounded-sm border border-transparent bg-emerald-500 py-2 px-4 text-sm font-medium text-white hover:bg-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2"
                  >
                    保存
                  </button>
                </div>
              </form>
            </div>
          </div>
        </main>
      </div>
    </>
  )
}

export default Settings
