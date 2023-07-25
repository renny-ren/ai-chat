import React, { useState, useEffect } from "react"
import { useLocation } from "react-router-dom"
import { Helmet } from "react-helmet"
import Background from "components/common/Background"
import MessageList from "components/common/MessageList"
import Header from "./Header"
import Footer from "components/common/Footer"
import * as UserApi from "shared/api/user"

interface DeveloperProps {
  conversationId?: number
}

const initMessages = [
  {
    role: "assistant",
    content:
      "您好，我是一名全栈工程师，通晓多种编程语言和技术，具备全面的软件工程能力和项目经验。\n\
      我擅长需求分析、架构设计、编码和测试等各个阶段的工作，能够帮助用户实现功能需求，并提供性能、安全、可扩展性等方面的优化建议。\n\
      您有任何软件开发方面的需求都可以向我提问，我将非常乐意为您提供帮助。",
  },
]

const Developer: React.FC<DeveloperProps> = ({ conversationId }) => {
  const [isLoading, setIsLoading] = useState(false)
  const [messages, setMessages] = useState([])
  const [isAddContext, setIsAddContext] = useState(true)
  const [isFetchingMessages, setIsFetchingMessages] = useState(false)
  const [pagination, setPagination] = useState({})
  let { state } = useLocation()
  const title = state?.conversationTitle || "程序员助手"

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
        <title>{title}</title>
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
                            <Header isAddContext={isAddContext} handleContextChange={handleContextChange} title={title} />
                            <MessageList
                              avatarUrl="https://aii-chat-assets.oss-cn-chengdu.aliyuncs.com/images/developer_assistant.jpeg"
                              gptName="程序员助手"
                              messages={[...initMessages, ...messages]}
                              fetchMessages={fetchMessages}
                              isFetchingMessages={isFetchingMessages}
                              pagination={pagination}
                              isLoading={isLoading}
                              voice="kenny"
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
            signInPrompt="登录即可开始使用程序员助手"
            loadingMessage="程序员助手正在思考中，请耐心等待"
            conversationType="developer"
            conversationTitle={`程序员助手 - ${new Date().toLocaleString("zh-CN", {
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

export default Developer
