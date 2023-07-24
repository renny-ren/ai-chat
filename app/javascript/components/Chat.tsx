import React, { useState, useEffect, useMemo } from "react"
import { useParams, useLocation } from "react-router-dom"
import ChatModule from "./ChatModule"
import CustomModel from "./CustomModel"
import Background from "components/common/Background"
import * as UserApi from "shared/api/user"
import Girlfriend from "components/Girlfriend"
import Fortune from "components/Fortune"
import Developer from "components/Developer"
import { Spin } from "antd"

const Chat = ({}) => {
  let { state } = useLocation()
  const [conversation, setConversation] = useState({})
  const [isLoading, setIsLoading] = useState(false)
  const conversationId = useParams().conversationId

  useEffect(() => {
    if (conversationId) fetchConversation()
  }, [state])

  const fetchConversation = async () => {
    setIsLoading(true)
    const res = await UserApi.fetchConversation(conversationId)
    const data = await res.json
    setConversation(data.conversation || {})
    setIsLoading(false)
  }

  const renderContent = () => {
    // if (!conversation.type) return <div></div>

    switch (conversation.type) {
      case "girlfriend":
        return <Girlfriend conversationId={conversationId} />
      case "fortune":
        return <Fortune conversationId={conversationId} />
      case "developer":
        return <Developer conversationId={conversationId} />
      case "custom":
        return <CustomModel conversation={conversation} />
      default:
        return (
          <div className="h-full relative pt-12 md:pt-14">
            <main className="h-full">
              <Background />
              <ChatModule />
            </main>
          </div>
        )
    }
  }

  const content = useMemo(() => renderContent(), [conversation])

  return (
    <>
      {isLoading ? (
        <div className="flex h-full justify-center items-center">
          <Spin size="large" />
        </div>
      ) : (
        content
      )}
    </>
  )
}

export default Chat
