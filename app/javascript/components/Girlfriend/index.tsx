import React, { useState } from "react"
import currentUser from "stores/current_user_store"
import { Helmet } from "react-helmet"
import Background from "components/common/Background"
import MessageList from "components/common/MessageList"
import Footer from "components/common/Footer"

interface GirlfriendProps {
  setIsShowSignInModal: () => void
  setConversations: () => void
}

const initMessages = [
  {
    role: "assistant",
    content:
      "你好，我是你的智能女友，可以和你聊天、陪伴你，还能够进行简单的日常任务辅助。我喜欢学习和探索新的领域，希望可以和你一起成长，共同开展新的冒险。",
  },
]

const Girlfriend: React.FC<GirlfriendProps> = ({ setIsShowSignInModal, setConversations }) => {
  const [isLoading, setIsLoading] = useState(false)
  const [messages, setMessages] = useState(initMessages)

  return (
    <>
      <Helmet>
        <title>AI 女友</title>
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
                            <MessageList gptName="AI 女友" messages={messages} isLoading={isLoading} />
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
            setIsShowSignInModal={setIsShowSignInModal}
            setConversations={setConversations}
            messages={messages}
            setMessages={setMessages}
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
