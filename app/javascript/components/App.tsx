import React, { useState, useEffect } from "react"
import Routes from "../routes"
import SignInModal from "./user/SignInModal"
import Header from "./Header"
import axios from "axios"
import currentUser from "stores/current_user_store"

const App = (props) => {
  const [isShowModal, setIsShowModal] = useState(false)
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
    <>
      <div className="h-full lg:ml-64 xl:ml-72">
        <Header setIsShowModal={setIsShowModal} customContent={customContent} conversations={conversations} />
        <Routes setIsShowModal={setIsShowModal} setCustomContent={setCustomContent} setConversations={setConversations} />
        <SignInModal isShow={isShowModal} setOpen={setIsShowModal} />
      </div>
    </>
  )
}
export default App
