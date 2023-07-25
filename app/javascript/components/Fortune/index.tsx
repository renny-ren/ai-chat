import React, { useState, useEffect } from "react"
import { useLocation } from "react-router-dom"
import { Helmet } from "react-helmet"
import Background from "components/common/Background"
import MessageList from "components/common/MessageList"
import Header from "./Header"
import Footer from "components/common/Footer"
import * as UserApi from "shared/api/user"

interface FortuneProps {
  conversationId?: number
}

const initMessages = [
  {
    role: "assistant",
    content:
      "您好，我是一位精通易经、八字算命的大师，我可以为您提供专业的命理分析和预测排盘服务。我自幼对易学、命理学感兴趣，师承于传统名家，具有多年的实战经验，精通八字、风水、姓名学、紫微斗数等命理学术。\n\
\\\n\
通过精湛的技能和经验，我能够分析和解读个人的八字信息，深入剖析个人的财运、事业、婚姻、健康以及未来走势。同时，我还能根据您的需求提供相关的风水布局、起名改名、择良辰吉日等实用建议。\n\
\\\n\
需要注意的是，命理学术中存在不确定性，未来的命运会受到多种因素影响，并不局限于一个准确的命盘解读。因此，请您以谨慎和客观的态度对待命理占卜，不要将它作为唯一参考。",
  },
]

const Fortune: React.FC<FortuneProps> = ({ conversationId }) => {
  const [isLoading, setIsLoading] = useState(false)
  const [messages, setMessages] = useState([])
  const [isAddContext, setIsAddContext] = useState(true)
  const [isFetchingMessages, setIsFetchingMessages] = useState(false)
  const [pagination, setPagination] = useState({})
  let { state } = useLocation()
  const title = state?.conversationTitle || "命理大师"

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
                              avatarUrl="https://aii-chat-assets.oss-cn-chengdu.aliyuncs.com/images/fortune.png"
                              gptName="命理大师"
                              messages={[...initMessages, ...messages]}
                              fetchMessages={fetchMessages}
                              isFetchingMessages={isFetchingMessages}
                              pagination={pagination}
                              isLoading={isLoading}
                              voice="stanley"
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
            signInPrompt="登录即可开始使用 AI 算命"
            loadingMessage="算命先生正在思考中，请耐心等待"
            conversationType="fortune"
            conversationTitle={`命理大师 - ${new Date().toLocaleString("zh-CN", {
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

export default Fortune
