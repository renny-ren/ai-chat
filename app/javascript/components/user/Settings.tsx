import React, { useState, useEffect } from "react"
import Avatar from "./Avatar"
import PersonalForm from "./PersonalForm"
import SecurityForm from "./SecurityForm"
import PaymentForm from "./PaymentForm"
import currentUser from "stores/current_user_store"

interface SettingsProps {}

const Settings: React.FC<SettingsProps> = ({}) => {
  const [currentTab, setCurrentTab] = useState("personal")

  useEffect(() => {
    if (!currentUser.isSignedIn()) {
      window.location.href = "/"
    }
  }, [])

  return (
    <>
      <div className="relative px-4 pt-14 sm:px-6 lg:px-8">
        <main className="py-12 mx-auto max-w-2xl space-y-10 pb-16 lg:max-w-5xl">
          <div className="min-h-screen pb-24">
            <div className="container mx-auto max-w-3xl mt-8">
              <h1 className="text-2xl font-bold text-gray-700 px-6 md:px-0">账户设置</h1>
              <ul className="flex border-b border-gray-300 text-sm font-medium text-gray-600 mt-3 px-6 md:px-0">
                <li
                  className={`cursor-pointer mr-8 hover:text-gray-900 ${
                    currentTab === "personal" ? "text-gray-900 border-b-2" : ""
                  } border-gray-800`}
                >
                  <a onClick={() => setCurrentTab("personal")} className="py-4 inline-block">
                    个人信息
                  </a>
                </li>
                <li
                  className={`cursor-pointer mr-8 hover:text-gray-900 ${
                    currentTab === "security" ? "text-gray-900 border-b-2" : ""
                  } border-gray-800`}
                >
                  <a onClick={() => setCurrentTab("security")} className="py-4 inline-block">
                    安全设置
                  </a>
                </li>
                <li
                  className={`cursor-pointer mr-8 hover:text-gray-900 ${
                    currentTab === "payment" ? "text-gray-900 border-b-2" : ""
                  } border-gray-800`}
                >
                  <a onClick={() => setCurrentTab("payment")} className="py-4 inline-block">
                    支付信息
                  </a>
                </li>
              </ul>
              {currentTab === "personal" && <PersonalForm />}
              {currentTab === "security" && <SecurityForm />}
              {currentTab === "payment" && <PaymentForm />}
            </div>
          </div>
        </main>
      </div>
    </>
  )
}

export default Settings
