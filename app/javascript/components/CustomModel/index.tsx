import React, { useState, useEffect } from "react"
import { useParams } from "react-router-dom"
import { Helmet } from "react-helmet"
import Background from "components/common/Background"
import MessageList from "components/common/MessageList"
import Footer from "components/common/Footer"
import * as CommonApi from "shared/api/common"
import { Empty } from "antd"
import ModelActions from "./ModelActions"

interface CustomModelProps {
  setIsShowSignInModal: () => void
  setConversations: () => void
}

const CustomModel: React.FC<CustomModelProps> = ({ setIsShowSignInModal, setConversations }) => {
  const [model, setModel] = useState({})
  const initMessages = [
    {
      role: "assistant",
      content: model.introduction || model.description,
    },
  ]
  const [isLoading, setIsLoading] = useState(false)
  const [isPrivate, setIsPrivate] = useState(false)
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
    if (resp.ok) {
      const body = await resp.json
      setModel(body.model)
    } else {
      const data = await resp.json
      if (data.error_code === 1001) {
        window.location.href = "/"
      }
      if (data.error_code === 1002) {
        setIsPrivate(true)
      }
    }
  }

  return (
    <>
      <Helmet>
        <title>{`${model.title} - aii.chat`}</title>
      </Helmet>
      <div className="h-full relative pt-12 md:pt-14">
        {isPrivate && (
          <div className="flex items-center justify-center h-full">
            <Empty description="该模型为私有模型，仅作者可访问" />
          </div>
        )}
        {!!Object.keys(model).length && (
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
                              <div className="py-3 border-b border-gray-300 border-dashed">
                                <div className="px-4 sm:px-0">
                                  <p className="mt-1 max-w-2xl text-sm leading-6 text-gray-600">{model.description}</p>
                                  <div className="flex justify-between items-end">
                                    <div className="mt-1 max-w-2xl text-xs text-gray-600 flex items-center">
                                      <span>创建者：</span>
                                      <img className="inline-block rounded-full mx-1 h-5 w-5" src={model.user_avatar_url} />
                                      <span>{model.user_nickname}</span>
                                    </div>
                                    <ModelActions
                                      model={model}
                                      setModel={setModel}
                                      setIsShowSignInModal={setIsShowSignInModal}
                                    />
                                  </div>
                                </div>
                              </div>
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
              placeholder={model.placeholder}
            />
          </main>
        )}
      </div>
    </>
  )
}

export default CustomModel
