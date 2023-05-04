import React, { useState, useEffect, useCallback } from "react"
import { useParams } from "react-router-dom"
import { Helmet } from "react-helmet"
import Background from "components/common/Background"
import MessageList from "components/common/MessageList"
import Footer from "components/common/Footer"
import * as CommonApi from "shared/api/common"
import * as UserApi from "shared/api/user"
import { Empty } from "antd"
import Header from "./Header"

interface CustomModelProps {
  modelPermalink?: string
}

const CustomModel: React.FC<CustomModelProps> = ({ modelPermalink }) => {
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
  const [permalink, setPermalink] = useState(useParams().modelPermalink)
  const conversationId = useParams().conversationId

  useEffect(() => {
    if (conversationId) {
      fetchMessages()
    }
  }, [conversationId])

  useEffect(() => {
    setPermalink(modelPermalink)
  }, [modelPermalink])

  useEffect(() => {
    if (permalink) {
      fetchModel()
    }
  }, [permalink])

  useEffect(() => {
    setMessages([...initMessages, ...messages].filter((m) => !!m.content))
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

  const fetchMessages = useCallback(async () => {
    const res = await UserApi.fetchMessages(conversationId)
    const data = await res.json
    setMessages([...initMessages, ...data.messages])
  }, [conversationId])

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
                              {!modelPermalink && <Header model={model} setModel={setModel} />}
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
              messages={messages}
              setMessages={setMessages}
              conversationType="custom"
              modelId={model.id}
              placeholder={model.input_placeholder}
            />
          </main>
        )}
      </div>
    </>
  )
}

export default CustomModel
