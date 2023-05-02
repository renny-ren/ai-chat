import React, { useState, useEffect } from "react"
import { useParams } from "react-router-dom"
import ChatModule from "./ChatModule"
import CustomModel from "./CustomModel"
import Background from "components/common/Background"
import * as UserApi from "shared/api/user"
import Girlfriend from "components/Girlfriend"
import Fortune from "components/Fortune"
import Developer from "components/Developer"

const Chat = ({ setConversations, setIsShowModal }) => {
  const [conversation, setConversation] = useState({})
  const conversationId = useParams().conversationId

  useEffect(() => {
    if (conversationId) fetchConversation()
  }, [])

  const fetchConversation = async () => {
    const res = await UserApi.fetchConversation(conversationId)
    const data = await res.json
    setConversation(data.conversation || {})
  }

  const renderContent = () => {
    switch (conversation.type) {
      case "girlfriend":
        return (
          <Girlfriend
            conversationId={conversationId}
            setConversations={setConversations}
            setIsShowSignInModal={setIsShowModal}
          />
        )
      case "fortune":
        return (
          <Fortune
            conversationId={conversationId}
            setConversations={setConversations}
            setIsShowSignInModal={setIsShowModal}
          />
        )
      case "developer":
        return (
          <Developer
            conversationId={conversationId}
            setConversations={setConversations}
            setIsShowSignInModal={setIsShowModal}
          />
        )
      case "custom":
        return (
          <CustomModel
            modelPermalink={conversation.model_permalink}
            setConversations={setConversations}
            setIsShowSignInModal={setIsShowModal}
          />
        )
      default:
        return (
          <div className="h-full relative pt-12 md:pt-14">
            <main className="h-full">
              <Background />
              <ChatModule setConversations={setConversations} setIsShowModal={setIsShowModal} />
            </main>
          </div>
        )
    }
  }

  return <>{renderContent()}</>
}

export default Chat
