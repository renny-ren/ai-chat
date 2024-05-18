import React, { useState, useEffect, useContext, useRef } from "react"
import { AppContext } from "components/AppContext"
import currentUser from "stores/current_user_store"
import { message, Popover } from "antd"
import { PlusCircleOutlined, CloseOutlined, SearchOutlined } from "@ant-design/icons"
import { Helmet } from "react-helmet"
import Background from "components/common/Background"
import List from "./List"
import Form from "./Form"
import * as _ from "lodash"
import Fuse from "fuse.js"
import pinyin from "tiny-pinyin"
import * as CommonApi from "shared/api/common"

interface ModelProps {}

const Model: React.FC<ModelProps> = ({ tab }) => {
  const [currentTab, setCurrentTab] = useState(tab || "list")
  const { setShowSigninModal } = useContext(AppContext)
  const [models, setModels] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [filteredModels, setFilteredModels] = useState(models)
  const modelsWithPinyin = models.map((model) => ({
    ...model,
    title_pinyin: pinyin.convertToPinyin(model.title, "", true),
  }))
  const inputRef = useRef(null)
  const mobileInputRef = useRef(null)

  useEffect(() => {
    fetchModels()
  }, [currentTab])

  const fetchModels = async () => {
    setIsLoading(true)
    const res = await CommonApi.fetchModels({ scope: currentTab, per: 99 })
    if (res.ok) {
      const data = await res.json
      setModels(data.models)
      setFilteredModels(data.models)
    }
    setIsLoading(false)
  }

  const changeTab = (tab) => {
    if (tab !== "list" && !validateLogin()) return
    window.history.pushState({ tab: tab }, tab, tab === "list" ? "/models" : `/models/${tab}`)
    setCurrentTab(tab)
  }

  const validateLogin = () => {
    if (!currentUser.isSignedIn()) {
      message.info("请先登录后再操作")
      setShowSigninModal(true)
    } else {
      return true
    }
  }

  const onSearch = (value) => {
    if (!value) return setFilteredModels(modelsWithPinyin)
    const fuse = new Fuse(modelsWithPinyin, {
      keys: ["title", "title_pinyin"],
      threshold: 0.4,
    })
    const result = fuse.search(value).map((r) => r.item)
    setFilteredModels(result)
  }

  const debouncedSearch = _.debounce(onSearch, 600)

  const closeSearch = () => {
    inputRef.current.value = ""
    mobileInputRef.current.value = ""
    setFilteredModels(modelsWithPinyin)
  }

  return (
    <>
      <div className="h-full relative pt-12 md:pt-14">
        <main className="h-full">
          <Background />

          <Helmet>
            <title>自定义应用 - 智言智语</title>
          </Helmet>

          <div className="relative h-full w-full transition-width flex flex-col overflow-y-auto items-stretch justify-center flex-1">
            <div className="flex-1 overflow-y-auto relative c-scrollbar">
              <div className="px-4 md:px-8 container mx-auto max-w-7xl mt-2">
                <ul className="flex border-b border-gray-300 text-sm font-medium text-gray-600 dark:text-gray-500">
                  <li
                    className={`cursor-pointer mr-4 md:mr-6 hover:text-gray-900 dark:hover:text-gray-300 ${
                      currentTab === "list" ? "text-gray-900 dark:text-gray-300 border-b-2" : ""
                    } border-gray-800`}
                  >
                    <a onClick={() => changeTab("list")} className="py-4 inline-block">
                      全部模型
                    </a>
                  </li>
                  <li
                    className={`cursor-pointer mr-4 md:mr-6 hover:text-gray-900 dark:hover:text-gray-300 ${
                      currentTab === "self" ? "text-gray-900 dark:text-gray-300 border-b-2" : ""
                    } border-gray-800`}
                  >
                    <a onClick={() => changeTab("self")} className="py-4 inline-block">
                      我的模型
                    </a>
                  </li>
                  <li
                    className={`cursor-pointer mr-4 md:mr-6 hover:text-gray-900 dark:hover:text-gray-300 ${
                      currentTab === "starred" ? "text-gray-900 dark:text-gray-300 border-b-2" : ""
                    } border-gray-800`}
                  >
                    <a onClick={() => changeTab("starred")} className="py-4 inline-block">
                      我收藏的
                    </a>
                  </li>
                  <li
                    className={`cursor-pointer mr-4 md:mr-6 hover:text-gray-900 dark:hover:text-gray-300 ${
                      currentTab === "new" ? "text-gray-900 dark:text-gray-300 border-b-2" : ""
                    } border-gray-800`}
                  >
                    <a onClick={() => changeTab("new")} className="py-4 inline-block">
                      <Popover className="hidden md:inline-flex" placement="right" content="点击创建你的专属应用">
                        <div className="flex items-center">
                          <PlusCircleOutlined className="mr-1" />
                          <span>创建模型</span>
                        </div>
                      </Popover>
                      <div className="block md:hidden flex items-center">
                        <PlusCircleOutlined className="mr-1" />
                        创建模型
                      </div>
                    </a>
                  </li>
                  <li className="hidden md:block relative py-2 ml-auto">
                    <div className="relative">
                      <input
                        ref={inputRef}
                        placeholder="搜索模型"
                        className="peer w-full px-8 py-2 leading-tight font-normal placeholder-gray-400 bg-transparent border border-slate-300 focus:border-emerald-500 focus:outline-none rounded-md"
                        onChange={(e) => debouncedSearch(e.target.value)}
                      />
                      <div className="absolute w-6 text-gray-400 peer-focus:text-gray-500 inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                        <SearchOutlined />
                      </div>
                      <button
                        type="button"
                        onClick={closeSearch}
                        className="absolute w-6 text-gray-500 hover:text-gray-600 inset-y-0 z-10 right-1 opacity-0 peer-focus:opacity-100"
                      >
                        <CloseOutlined />
                      </button>
                    </div>
                  </li>
                </ul>

                <div className="block md:hidden relative pt-2">
                  <div className="relative">
                    <input
                      ref={mobileInputRef}
                      placeholder="搜索模型"
                      className="peer w-full px-8 py-2 leading-tight text-sm placeholder-gray-400 bg-transparent border border-slate-300 focus:border-emerald-500 focus:outline-none rounded-md"
                      onChange={(e) => debouncedSearch(e.target.value)}
                    />
                    <div className="absolute w-6 text-gray-400 peer-focus:text-gray-500 inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                      <SearchOutlined />
                    </div>
                    <button
                      type="button"
                      onClick={closeSearch}
                      className="absolute w-6 text-gray-500 hover:text-gray-600 inset-y-0 z-10 right-1 opacity-0 peer-focus:opacity-100 pointer-events-none peer-focus:pointer-events-auto"
                    >
                      <CloseOutlined />
                    </button>
                  </div>
                </div>

                {currentTab === "new" ? (
                  <Form />
                ) : (
                  <List
                    models={filteredModels}
                    setModels={setFilteredModels}
                    isLoading={isLoading}
                    validateLogin={validateLogin}
                  />
                )}
              </div>
            </div>
          </div>
        </main>
      </div>
    </>
  )
}

export default Model
