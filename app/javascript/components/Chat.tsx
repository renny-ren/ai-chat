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
    fetchConversation()
  }, [])

  const fetchConversation = async () => {
    const res = await UserApi.fetchConversation(conversationId)
    const data = await res.json
    setConversation(data.conversation || {})
  }

  return (
    <>
      {conversation.type === "girlfriend" && (
        <Girlfriend
          conversationId={conversationId}
          setConversations={setConversations}
          setIsShowSignInModal={setIsShowModal}
        />
      )}
      {conversation.type === "fortune" && (
        <Fortune conversationId={conversationId} setConversations={setConversations} setIsShowSignInModal={setIsShowModal} />
      )}
      {conversation.type === "developer" && (
        <Developer
          conversationId={conversationId}
          setConversations={setConversations}
          setIsShowSignInModal={setIsShowModal}
        />
      )}
      {conversation.type === "chatgpt" && (
        <div className="h-full relative pt-12 md:pt-14">
          <main className="h-full">
            <Background />
            <ChatModule setConversations={setConversations} setIsShowModal={setIsShowModal} />
          </main>
        </div>
      )}
      {conversation.type === "custom" && (
        <CustomModel
          modelPermalink={conversation.model_permalink}
          setConversations={setConversations}
          setIsShowSignInModal={setIsShowModal}
        />
      )}
    </>
  )
}

export default Chat
