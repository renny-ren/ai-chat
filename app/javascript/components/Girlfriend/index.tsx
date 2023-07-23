import React, { useState, useEffect } from "react"
import { useLocation } from "react-router-dom"
import { Helmet } from "react-helmet"
import Background from "components/common/Background"
import MessageList from "components/common/MessageList"
import Header from "./Header"
import Footer from "components/common/Footer"
import * as UserApi from "shared/api/user"

interface GirlfriendProps {
  conversationId?: number
}

const initMessages = [
  {
    role: "assistant",
    content:
      "你好，我是你的智能女友，可以和你聊天、陪伴你，还能够进行简单的日常任务辅助。我喜欢学习和探索新的领域，希望可以和你一起成长，共同开展新的冒险。",
  },
]

const Girlfriend: React.FC<GirlfriendProps> = ({ conversationId }) => {
  const [isLoading, setIsLoading] = useState(false)
  const [messages, setMessages] = useState([])
  const [isAddContext, setIsAddContext] = useState(true)
  const [isFetchingMessages, setIsFetchingMessages] = useState(false)
  const [pagination, setPagination] = useState({})

  let { state } = useLocation()

  useEffect(() => {
    if (conversationId) {
      fetchMessages()
    }
  }, [conversationId])

  const fetchMessages = async (page = 1) => {
    setIsFetchingMessages(true)
    const res = await UserApi.fetchMessages(conversationId, page)
    const data = await res.json
    setMessages(page === 1 ? data.messages.reverse() : [...data.messages.reverse(), ...messages])
    setPagination(data.pagination_meta)
    setIsFetchingMessages(false)
  }
  const handleContextChange = (checked) => {
    setIsAddContext(checked)
  }

  return (
    <>
      <Helmet>
        <title>{state?.conversationTitle || "AI 女友"}</title>
      </Helmet>
      <div className="h-full relative pt-12 md:pt-14">
        <main className="h-full">
          <Background />

          <div className="relative h-full w-full transition-width flex flex-col overflow-y-auto items-stretch flex-1 pb-20">
            <div className="flex-1 overflow-hidden relative">
              <div className="h-full overflow-hidden">
                <div className="flex h-full antialiased text-gray-800">
                  <div className="flex flex-row h-full w-full overflow-x-hidden">
                    <div className="flex flex-col flex-auto h-full items-center">
                      <div className="flex flex-col flex-auto flex-shrink-0 rounded-2xl h-full w-full md:max-w-3xl lg:max-w-4xl">
                        <div className="flex flex-col h-full md:pb-4">
                          <div className="flex flex-col h-full overflow-x-auto">
                            <Header isAddContext={isAddContext} handleContextChange={handleContextChange} />
                            <MessageList
                              avatarUrl="https://aii-chat-assets.oss-cn-chengdu.aliyuncs.com/images/girlfriend.png"
                              gptName="AI 女友"
                              messages={[...initMessages, ...messages]}
                              fetchMessages={fetchMessages}
                              isFetchingMessages={isFetchingMessages}
                              pagination={pagination}
                              isLoading={isLoading}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <Footer
            isLoading={isLoading}
            setIsLoading={setIsLoading}
            messages={[...initMessages, ...messages]}
            setMessages={setMessages}
            conversationId={conversationId}
            isAddContext={isAddContext}
            signInPrompt="登录即可开始与女友聊天"
            loadingMessage="女友正在思考中，请耐心等待"
            conversationType="girlfriend"
            placeholder=" "
            conversationTitle={`女友 - ${new Date().toLocaleString("zh-CN", {
              month: "numeric",
              day: "numeric",
              hour: "numeric",
              minute: "numeric",
            })}`}
          />
        </main>
      </div>
    </>
  )
}

export default Girlfriend
