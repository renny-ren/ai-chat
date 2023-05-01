import React, { useState, useEffect } from "react"
import currentUser from "stores/current_user_store"
import { Badge, message } from "antd"
import { Helmet } from "react-helmet"
import Background from "components/common/Background"
import List from "./List"
import Form from "./Form"

interface ModelProps {
  setIsShowSignInModal: () => void
}

const Model: React.FC<ModelProps> = ({ setIsShowSignInModal, tab }) => {
  const [currentTab, setCurrentTab] = useState(tab || "list")

  const changeTab = (tab) => {
    if (tab !== "list" && !validateLogin()) return
    window.history.pushState({ tab: tab }, tab, tab === "list" ? "/models" : `/models/${tab}`)
    setCurrentTab(tab)
  }

  const validateLogin = () => {
    if (!currentUser.isSignedIn()) {
      message.info("请先登录后再操作")
      setIsShowSignInModal(true)
    } else {
      return true
    }
  }

  return (
    <>
      <div className="h-full relative pt-12 md:pt-14">
        <main className="h-full">
          <Background />

          <Helmet>
            <title>自定义模型 - aii.chat</title>
          </Helmet>

          <div className="relative h-full w-full transition-width flex flex-col overflow-y-auto items-stretch justify-center flex-1">
            <div className="flex-1 overflow-y-auto relative">
              <div className="px-4 md:px-8 container mx-auto max-w-7xl mt-2">
                <ul className="flex border-b border-gray-300 text-sm font-medium text-gray-600 dark:text-gray-500">
                  <li
                    className={`cursor-pointer mr-4 md:mr-8 hover:text-gray-900 ${
                      currentTab === "list" ? "text-gray-900 dark:text-gray-300 border-b-2" : ""
                    } border-gray-800`}
                  >
                    <a onClick={() => changeTab("list")} className="py-4 inline-block">
                      全部模型
                    </a>
                  </li>
                  <li
                    className={`cursor-pointer mr-4 md:mr-8 hover:text-gray-900 ${
                      currentTab === "starred" ? "text-gray-900 dark:text-gray-300 border-b-2" : ""
                    } border-gray-800`}
                  >
                    <a onClick={() => changeTab("starred")} className="py-4 inline-block">
                      我收藏的
                    </a>
                  </li>
                  <li
                    className={`cursor-pointer mr-4 md:mr-8 hover:text-gray-900 ${
                      currentTab === "self" ? "text-gray-900 dark:text-gray-300 border-b-2" : ""
                    } border-gray-800`}
                  >
                    <a onClick={() => changeTab("self")} className="py-4 inline-block">
                      我的模型
                    </a>
                  </li>
                  <li
                    className={`cursor-pointer mr-4 md:mr-8 hover:text-gray-900 ${
                      currentTab === "new" ? "text-gray-900 dark:text-gray-300 border-b-2" : ""
                    } border-gray-800`}
                  >
                    <a onClick={() => changeTab("new")} className="py-4 inline-block">
                      创建模型
                    </a>
                  </li>
                </ul>
                {currentTab === "list" && <List validateLogin={validateLogin} />}
                {currentTab === "self" && <List scope="self" validateLogin={validateLogin} />}
                {currentTab === "starred" && <List scope="starred" validateLogin={validateLogin} />}
                {currentTab === "new" && <Form setIsShowSignInModal={setIsShowSignInModal} />}
              </div>
            </div>
          </div>
        </main>
      </div>
    </>
  )
}

export default Model
