import React, { useState, useEffect } from "react"
import currentUser from "stores/current_user_store"
import * as CommonApi from "shared/api/common"
import { message } from "antd"
import Avatar from "./Avatar"

interface ModelFormProps {}

const ModelForm: React.FC<ModelFormProps> = ({}) => {
  const [formData, setFormData] = useState({
    title: "",
    is_public: true,
  })

  useEffect(() => {
    // fetchUser()
  }, [])

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

  const onSubmit = async (e) => {
    e.preventDefault()
    console.log("==form data===", formData)

    const res = await CommonApi.createModel(formData)
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
                        className="border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
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
                          className="rounded-none rounded-r-lg border border-gray-300 text-gray-900 focus:ring-blue-500 focus:border-blue-500 block flex-1 min-w-0 w-full text-sm dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                          onChange={handleInputChange}
                        />
                      </div>
                    </div>

                    <div className="sm:col-span-4">
                      <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">模型描述</label>
                      <input
                        type="text"
                        name="description"
                        className="border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                        required=""
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="sm:col-span-4">
                      <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">系统设定</label>
                      <textarea
                        rows="4"
                        name="system_instruction"
                        className="block w-full text-sm text-gray-900 rounded-lg border border-gray-300 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                        onChange={handleInputChange}
                      ></textarea>
                    </div>
                    <div className="sm:col-span-4">
                      <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">自我介绍</label>
                      <textarea
                        rows="2"
                        name="introduction"
                        className="block w-full text-sm text-gray-900 rounded-lg border border-gray-300 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                        onChange={handleInputChange}
                      ></textarea>
                    </div>
                    <div>
                      <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">模型头像</label>
                      <Avatar />
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
                        <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
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
              className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
            >
              Submit
            </button>
          </form>
        </div>
      </section>
    </>
  )
}

export default ModelForm
