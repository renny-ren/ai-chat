import React, { useState, useEffect } from "react"
import Routes from "../routes"
import SignInModal from "./user/SignInModal"
import Header from "./Header"
import axios from "axios"
import currentUser from "stores/current_user_store"
import { AppContext } from "./AppContext"

const App = (props) => {
  const [showSigninModal, setShowSigninModal] = useState(false)
  const [customContent, setCustomContent] = useState()
  const [conversations, setConversations] = useState([])

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

  return (
    <AppContext.Provider value={{ showSigninModal, setShowSigninModal, setConversations }}>
      <div className="h-full lg:ml-64 xl:ml-72">
        <Routes customContent={customContent} setCustomContent={setCustomContent} conversations={conversations} />
      </div>
      <SignInModal />
    </AppContext.Provider>
  )
}
export default App
