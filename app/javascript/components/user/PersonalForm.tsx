import React, { useState, useEffect } from "react"
import currentUser from "stores/current_user_store"
import * as UserApi from "shared/api/user"
import { message } from "antd"
import Avatar from "./Avatar"

interface PersonalFormProps {}

const PersonalForm: React.FC<PersonalFormProps> = ({}) => {
  const [nickname, setNickname] = useState(currentUser.nickname() || "")
  const [email, setEmail] = useState(currentUser.email() || "")
  const [user, setUser] = useState({})

  useEffect(() => {
    fetchUser()
  }, [])

  const fetchUser = async () => {
    const res = await UserApi.fetchUser(currentUser.id())
    if (res.ok) {
      const data = await res.json
      setUser(data.user)
    }
  }

  const onSave = async (e) => {
    e.preventDefault()
    const formData = new FormData()
    formData.append("nickname", nickname)
    formData.append("email", email)

    const res = await UserApi.updateUser(currentUser.id(), formData)
    if (res.ok) {
      message.success("保存成功！")
    } else {
      const data = await res.json
      message.error(data.message)
    }
  }

  return (
    <>
      <form onSubmit={onSave}>
        <div className="w-full bg-white rounded-lg mx-auto flex overflow-hidden rounded-b-none">
          <div className="w-1/5 border-r border-gray-100 p-8 hidden md:inline-block">
            <h2 className="font-medium text-md text-gray-700 mb-4 tracking-wide">个人信息</h2>
            <p className="text-xs text-gray-500"></p>
          </div>
          <div className="md:w-4/5 w-full">
            <div className="p-8 flex flex-wrap items-start">
              <div className="w-full lg:w-6/12 px-4">
                <label className="text-sm text-gray-600 w-full block">头像</label>
                <Avatar />
              </div>
              <div className="w-full lg:w-6/12 px-4">
                <label className="text-sm text-gray-600 w-full block">用户名</label>
                <label className="text-sm text-gray-600 w-full block mt-4">{user.username}</label>
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
                  onInvalid={(e) => e.target.setCustomValidity("请输入昵称")}
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
                  placeholder="可用于找回密码"
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
    </>
  )
}

export default PersonalForm
