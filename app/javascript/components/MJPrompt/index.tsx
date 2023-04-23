import React, { useState } from "react"
import currentUser from "stores/current_user_store"
import { Helmet } from "react-helmet"
import Background from "components/common/Background"
import MessageList from "components/common/MessageList"
import Footer from "components/common/Footer"

interface MJPromptProps {
  setIsShowSignInModal: () => void
  setConversations: () => void
}

const initMessages = [
  {
    role: "assistant",
    content: "你好，我可以帮你生成 Midjourney 画图提示词，你只需要告诉我画面描述，我会返回给你 5 个结果。",
  },
]

const MJPrompt: React.FC<MJPromptProps> = ({ setIsShowSignInModal, setConversations }) => {
  const [isLoading, setIsLoading] = useState(false)
  const [messages, setMessages] = useState(initMessages)

  return (
    <>
      <Helmet>
        <title>Midjourney 提示词生成器</title>
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
                            <MessageList gptName="Midjourney 提示词生成器" messages={messages} isLoading={isLoading} />
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
            signInPrompt="登录即可开始使用 Midjourney 提示词生成器"
            loadingMessage="AI 正在思考中，请耐心等待"
            conversationType="mj_prompt"
            placeholder="请输入画面描述"
            conversationTitle={`Midjourney 提示词 - ${new Date().toLocaleString("zh-CN", {
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

export default MJPrompt
