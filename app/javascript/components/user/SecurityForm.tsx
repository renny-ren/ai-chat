import React, { useState } from "react"
import currentUser from "stores/current_user_store"
import * as UserApi from "shared/api/user"
import { message } from "antd"

interface SecurityFormProps {}

const SecurityForm: React.FC<SecurityFormProps> = ({}) => {
  const [formData, setFormData] = useState({
    original_password: "",
    password: "",
    password_confirmation: "",
  })

  const handleChange = (event) => {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value,
    })
  }

  const onSave = async (e) => {
    e.preventDefault()
    const res = await UserApi.updateUser(currentUser.id(), formData)
    if (res.ok) {
      message.success("保存成功！请重新登录")
      setTimeout(() => {
        window.location.reload()
      }, 1000)
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
            <h2 className="font-medium text-md text-gray-700 mb-4 tracking-wide">修改密码</h2>
            <p className="text-xs text-gray-500"></p>
          </div>
          <div className="md:w-4/5 w-full">
            <div className="p-8 flex flex-wrap items-center">
              <div className="w-full lg:w-6/12 px-4">
                <label className="text-sm text-gray-600">原密码</label>
                <input
                  className="mt-2 border-1 border-gray-200 px-3 py-2 block w-full rounded-sm text-base text-gray-900 focus:outline-none focus:border-emerald-500 focus:ring-emerald-500"
                  name="original_password"
                  type="password"
                  required
                  onChange={handleChange}
                  onInvalid={(e) => e.target.setCustomValidity("请输入原密码")}
                  onInput={(e) => e.target.setCustomValidity("")}
                />
              </div>
            </div>
            <div className="px-8 pb-8 flex flex-wrap">
              <div className="w-full lg:w-6/12 px-4">
                <label className="text-sm text-gray-600">新密码</label>
                <input
                  className="mt-2 border-1 border-gray-200 px-3 py-2 block w-full rounded-sm text-base text-gray-900 focus:outline-none focus:border-emerald-500 focus:ring-emerald-500"
                  name="password"
                  type="password"
                  required
                  onChange={handleChange}
                  onInvalid={(e) => e.target.setCustomValidity("请输入新密码")}
                  onInput={(e) => e.target.setCustomValidity("")}
                />
              </div>
              <div className="w-full lg:w-6/12 px-4">
                <label className="text-sm text-gray-600">确认新密码</label>
                <input
                  className="mt-2 border-[1px] border-gray-200 px-3 py-2 block w-full rounded-sm text-base text-gray-900 focus:outline-none focus:border-emerald-500 focus:ring-emerald-500"
                  name="password_confirmation"
                  type="password"
                  required
                  onChange={handleChange}
                  onInvalid={(e) => e.target.setCustomValidity("请再输入新密码")}
                  onInput={(e) => e.target.setCustomValidity("")}
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

export default SecurityForm
