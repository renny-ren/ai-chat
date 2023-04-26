import React, { useState, useEffect } from "react"
import { useParams } from "react-router-dom"
import { Helmet } from "react-helmet"
import Background from "components/common/Background"
import MessageList from "components/common/MessageList"
import Footer from "components/common/Footer"
import * as CommonApi from "shared/api/common"

interface CustomModelProps {
  setIsShowSignInModal: () => void
  setConversations: () => void
}

const CustomModel: React.FC<CustomModelProps> = ({ setIsShowSignInModal, setConversations }) => {
  const [model, setModel] = useState({})
  const initMessages = [
    {
      role: "assistant",
      content: model.introduction,
    },
  ]
  const [isLoading, setIsLoading] = useState(false)
  const [messages, setMessages] = useState(initMessages)
  const permalink = useParams().modelPermalink

  useEffect(() => {
    fetchModel()
  }, [])

  useEffect(() => {
    setMessages(initMessages)
  }, [model])

  const fetchModel = async () => {
    const resp = await CommonApi.fetchModel(permalink)
    const body = await resp.json
    setModel(body.model)
  }

  return (
    <>
      <Helmet>
        <title>{model.title}</title>
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
                            <MessageList
                              gptName={model.title}
                              messages={messages}
                              isLoading={isLoading}
                              avatarUrl={model.avatar_url}
                              voice={model.voice}
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
            setIsShowSignInModal={setIsShowSignInModal}
            setConversations={setConversations}
            messages={messages}
            setMessages={setMessages}
            conversationType="custom"
            modelId={model.id}
          />
        </main>
      </div>
    </>
  )
}

export default CustomModel