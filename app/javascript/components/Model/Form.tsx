import React, { useState, useEffect } from "react"
import currentUser from "stores/current_user_store"
import * as CommonApi from "shared/api/common"
import { message } from "antd"
import Avatar from "./Avatar"
import VoiceSelection from "./VoiceSelection"
import AudioButton from "./AudioButton"

interface ModelFormProps {}

const ModelForm: React.FC<ModelFormProps> = ({}) => {
  const [formData, setFormData] = useState({
    title: "",
    is_public: true,
  })

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value,
    })
  }

  const handleSwitchChange = (e) => {
    const { name, checked } = e.target
    setFormData({
      ...formData,
      [name]: checked,
    })
  }

  const handleAvatarChange = (avatarFile) => {
    const blob = new Blob([avatarFile])
    setFormData({
      ...formData,
      avatar: blob,
    })
  }

  const handleVoiceChange = (voice) => {
    setFormData({
      ...formData,
      voice: voice,
    })
  }

  const onSubmit = async (e) => {
    e.preventDefault()

    const fd = new FormData()
    for (const key in formData) {
      if (formData.hasOwnProperty(key) && key !== "avatar") {
        const value = formData[key]
        fd.append(key, value)
      }
    }
    if (formData.avatar) {
      fd.append("avatar", formData.avatar)
    }

    const res = await CommonApi.createModel(fd)
    if (res.ok) {
      message.success("保存成功！")
    } else {
      const data = await res.json
      message.error(data.message)
    }
  }

  return (
    <>
      <section className="dark:bg-gray-900">
        <div className="py-8 px-4 mx-auto max-w-2xl lg:py-4">
          <h2 className="mb-4 text-xl font-bold text-gray-900 dark:text-white">Add a new product</h2>
          <form onSubmit={onSubmit}>
            <details className="group" open>
              <summary className="flex justify-between items-center font-medium cursor-pointer list-none">
                <span>基础设置</span>
                <span className="transition group-open:rotate-180">
                  <svg
                    fill="none"
                    height="24"
                    shapeRendering="geometricPrecision"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="1.5"
                    viewBox="0 0 24 24"
                    width="24"
                  >
                    <path d="M6 9l6 6 6-6"></path>
                  </svg>
                </span>
              </summary>
              <div className="text-neutral-600 mt-3 group-open:animate-fadeIn">
                <div>
                  <div className="grid gap-4 sm:grid-cols-4 sm:gap-6">
                    <div className="sm:col-span-2">
                      <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">模型名称</label>
                      <input
                        type="text"
                        name="title"
                        className="border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-emerald-500 focus:border-emerald-500 focus:outline-none block w-full dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-emerald-500 dark:focus:border-emerald-500"
                        required=""
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">模型地址</label>
                      <div className="flex">
                        <span className="inline-flex items-center px-3 text-sm text-gray-500 bg-gray-50 border border-r-0 border-gray-300 rounded-l-md dark:bg-gray-600 dark:text-gray-400 dark:border-gray-600">
                          aii.chat/
                        </span>
                        <input
                          type="text"
                          name="permalink"
                          className="rounded-none rounded-r-lg border border-gray-300 text-gray-900 focus:ring-emerald-500 focus:border-emerald-500 block flex-1 min-w-0 w-full text-sm dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-emerald-500 dark:focus:border-emerald-500"
                          onChange={handleInputChange}
                        />
                      </div>
                    </div>

                    <div className="sm:col-span-4">
                      <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">模型描述</label>
                      <input
                        type="text"
                        name="description"
                        className="border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-emerald-500 focus:border-emerald-500 block w-full dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-emerald-500 dark:focus:border-emerald-500"
                        required=""
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="sm:col-span-4">
                      <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">系统设定</label>
                      <textarea
                        rows="4"
                        name="system_instruction"
                        className="block w-full text-sm text-gray-900 rounded-lg border border-gray-300 focus:ring-emerald-500 focus:border-emerald-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-emerald-500 dark:focus:border-emerald-500"
                        onChange={handleInputChange}
                      ></textarea>
                    </div>
                    <div className="sm:col-span-4">
                      <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">自我介绍</label>
                      <textarea
                        rows="2"
                        name="introduction"
                        className="block w-full text-sm text-gray-900 rounded-lg border border-gray-300 focus:ring-emerald-500 focus:border-emerald-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-emerald-500 dark:focus:border-emerald-500"
                        onChange={handleInputChange}
                      ></textarea>
                    </div>
                    <div className="sm:col-span-2">
                      <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">模型头像</label>
                      <Avatar handleAvatarChange={handleAvatarChange} />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="flex items-center block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                        模型声音
                        <AudioButton content={formData.introduction} voice={formData.voice} />
                      </label>

                      <VoiceSelection handleVoiceChange={handleVoiceChange} />
                    </div>
                    <div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          name="is_public"
                          checked={formData.is_public}
                          className="sr-only peer"
                          onChange={handleSwitchChange}
                        />
                        <div className="w-11 h-6 bg-gray-200 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-emerald-500"></div>
                        <span className="ml-3 text-sm font-medium text-gray-900 dark:text-gray-300">是否公开</span>
                      </label>
                      <div className="text-gray-400 text-xs">
                        {formData.is_public ? "任何人都可以使用该模型" : "该模型仅自己可见"}
                      </div>
                    </div>
                  </div>
                  <button
                    type="submit"
                    className="inline-flex items-center px-5 py-2.5 mt-4 sm:mt-6 text-sm font-medium text-center text-white bg-primary-700 rounded-lg focus:ring-4 focus:ring-primary-200 dark:focus:ring-primary-900 hover:bg-primary-800"
                  >
                    Add product
                  </button>
                </div>
              </div>
            </details>
            <details className="group">
              <summary className="flex justify-between items-center font-medium cursor-pointer list-none">
                <span>高级设置</span>
                <span className="transition group-open:rotate-180">
                  <svg
                    fill="none"
                    height="24"
                    shapeRendering="geometricPrecision"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="1.5"
                    viewBox="0 0 24 24"
                    width="24"
                  >
                    <path d="M6 9l6 6 6-6"></path>
                  </svg>
                </span>
              </summary>
              <p className="text-neutral-600 mt-3 group-open:animate-fadeIn"></p>
            </details>

            <button
              type="submit"
              className="float-right group relative flex justify-center rounded-md border border-transparent bg-emerald-500 py-2 px-4 text-sm font-medium text-white hover:bg-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2"
            >
              提交
            </button>
          </form>
        </div>
      </section>
    </>
  )
}

export default ModelForm
