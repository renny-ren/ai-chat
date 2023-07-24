import React, { useState, useEffect } from "react"
import { AppContext } from "./AppContext"
import Routes from "../routes"
import SignInModal from "./user/SignInModal"
import axios from "axios"
import currentUser from "stores/current_user_store"
import { ConfigProvider, theme } from "antd"

const App = (props) => {
  const [showSigninModal, setShowSigninModal] = useState(false)
  const [customContent, setCustomContent] = useState()
  const [conversations, setConversations] = useState([])
  const { darkAlgorithm, defaultAlgorithm } = theme

  useEffect(() => {
    if (currentUser.isSignedIn()) {
      fetchConversations()
    }
  }, [gon.user_meta])

  const fetchConversations = async () => {
    const csrf = document.querySelector("meta[name='csrf-token']").getAttribute("content")
    const response = await axios.get(`/v1/conversations`, {
      headers: {
        "X-CSRF-Token": csrf,
      },
    })
    setConversations(response.data.conversations)
  }

  const isDarkMode = () => {
    return document.documentElement.classList.contains("dark")
  }

  return (
    <AppContext.Provider value={{ showSigninModal, setShowSigninModal, setConversations }}>
      <ConfigProvider
        theme={{
          algorithm: isDarkMode() ? darkAlgorithm : defaultAlgorithm,
          token: {
            colorPrimary: "#10B981",
          },
        }}
      >
        <div className="h-full lg:ml-64 xl:ml-72">
          <Routes customContent={customContent} setCustomContent={setCustomContent} conversations={conversations} />
        </div>
        <SignInModal isShow={showSigninModal} />
      </ConfigProvider>
    </AppContext.Provider>
  )
}
export default App
