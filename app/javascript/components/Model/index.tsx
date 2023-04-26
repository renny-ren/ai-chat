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
    window.history.pushState({ tab: tab }, tab, tab === "list" ? "/models" : `/models/${tab}`)
    setCurrentTab(tab)
  }

  return (
    <>
      <div className="h-full relative pt-12 md:pt-14">
        <main className="h-full">
          <Background />

          <div className="relative h-full w-full transition-width flex flex-col overflow-y-auto items-stretch justify-center flex-1">
            <div className="flex-1 overflow-y-auto relative">
              <div className="container mx-auto max-w-4xl mt-8">
                <ul className="flex border-b border-gray-300 text-sm font-medium text-gray-600 mt-3 px-6 md:px-0">
                  <li
                    className={`cursor-pointer mr-8 hover:text-gray-900 ${
                      currentTab === "list" ? "text-gray-900 border-b-2" : ""
                    } border-gray-800`}
                  >
                    <a onClick={() => changeTab("list")} className="py-4 inline-block">
                      全部模型
                    </a>
                  </li>
                  <li
                    className={`cursor-pointer mr-8 hover:text-gray-900 ${
                      currentTab === "new" ? "text-gray-900 border-b-2" : ""
                    } border-gray-800`}
                  >
                    <a onClick={() => changeTab("new")} className="py-4 inline-block">
                      创建模型
                    </a>
                  </li>
                </ul>
              </div>
              {currentTab === "list" && <List />}
              {currentTab === "new" && <Form />}
            </div>
          </div>
        </main>
      </div>
    </>
  )
}

export default Model
