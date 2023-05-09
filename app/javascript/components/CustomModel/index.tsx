import React, { useState, useEffect, useCallback } from "react"
import { useParams, useLocation } from "react-router-dom"
import { Helmet } from "react-helmet"
import Background from "components/common/Background"
import MessageList from "components/common/MessageList"
import Footer from "components/common/Footer"
import * as CommonApi from "shared/api/common"
import * as UserApi from "shared/api/user"
import { Empty } from "antd"
import { MinusCircleOutlined } from "@ant-design/icons"
import Header from "./Header"
import Spinner from "components/common/Spinner"
import { CDN_HOST } from "shared/constants"

interface CustomModelProps {
  conversation?: Object
}

const CustomModel: React.FC<CustomModelProps> = ({ conversation }) => {
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
  const [isAddContext, setIsAddContext] = useState(true)
  const conversationId = useParams().conversationId
  let { state } = useLocation()

  useEffect(() => {
    if (conversationId) {
      fetchMessages()
    }
  }, [conversationId])

  useEffect(() => {
    if (conversation) setPermalink(conversation.model_permalink)
  }, [conversation])

  useEffect(() => {
    if (permalink) {
      fetchModel()
    } else {
      setModel({})
    }
  }, [permalink])

  useEffect(() => {
    setMessages([...initMessages, ...messages].filter((m) => !!m.content))
  }, [model])

  const fetchModel = async () => {
    setIsLoading(true)
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
    setIsLoading(false)
  }

  const fetchMessages = useCallback(async () => {
    const res = await UserApi.fetchMessages(conversationId)
    const data = await res.json
    setMessages(data.messages)
  }, [conversationId])

  const handleContextChange = (checked) => {
    setIsAddContext(checked)
  }

  return (
    <>
      <Helmet>
        <title>{conversation?.title || state?.conversationTitle || `${model.title} - aii.chat`}</title>
      </Helmet>
      <div className="h-full relative pt-12 md:pt-14">
        {isPrivate && (
          <div className="flex items-center justify-center h-full">
            <Empty description="该模型为私有模型，仅作者可访问" />
          </div>
        )}

        <main className="h-full">
          <Background />
          {isLoading ? (
            <div className="col-span-12 h-full flex items-center justify-center">
              <Spinner className="w-10 h-10 text-gray-200 animate-spin dark:text-gray-600 fill-green-500" />
            </div>
          ) : (
            <>
              <div className="relative h-full w-full transition-width flex flex-col overflow-y-auto items-stretch flex-1 pb-20">
                <div className="flex-1 overflow-hidden relative">
                  <div className="h-full overflow-hidden">
                    <div className="flex h-full antialiased text-gray-800">
                      <div className="flex flex-row h-full w-full overflow-x-hidden">
                        <div className="flex flex-col flex-auto h-full items-center">
                          <div className="flex flex-col flex-auto flex-shrink-0 rounded-2xl h-full w-full md:max-w-3xl lg:max-w-4xl">
                            <div className="flex flex-col h-full md:pb-4">
                              <div className="flex flex-col h-full overflow-x-auto">
                                {!!Object.keys(model).length ? (
                                  <>
                                    <Header
                                      model={model}
                                      setModel={setModel}
                                      isAddContext={isAddContext}
                                      handleContextChange={handleContextChange}
                                    />
                                    <MessageList
                                      gptName={model.title}
                                      messages={messages}
                                      isLoading={isLoading}
                                      avatarUrl={model.avatar_url}
                                      voice={model.voice}
                                    />
                                  </>
                                ) : (
                                  <MessageList
                                    gptName="AI"
                                    messages={messages}
                                    isLoading={isLoading}
                                    avatarUrl={`${CDN_HOST}/assets/person.png`}
                                  />
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {!!Object.keys(model).length ? (
                <Footer
                  isLoading={isLoading}
                  setIsLoading={setIsLoading}
                  messages={messages}
                  setMessages={setMessages}
                  conversationType="custom"
                  modelId={model.id}
                  placeholder={model.input_placeholder}
                  isAddContext={isAddContext}
                />
              ) : (
                <div className="absolute bottom-0 left-0 w-full dark:border-transparent bg-vert-light-gradient dark:bg-vert-dark-gradient input-area">
                  <form className="stretch mx-2 flex flex-row items-center gap-1 md:gap-2 last:mb-2 md:last:mb-6 lg:mx-auto lg:max-w-3xl">
                    <div className="cursor-pointer flex flex-col w-full py-2 flex-grow md:pl-2 relative border border-black/10 bg-white dark:border-gray-900/50 dark:text-white dark:bg-gray-700 rounded-md shadow-sm">
                      <div className="flex h-6 w-full items-center pl-2 pr-3 text-sm text-zinc-500 transition dark:text-zinc-400 focus:[&amp;:not(:focus-visible)]:outline-none">
                        <MinusCircleOutlined />
                        <span className="pl-1">由于该对话模型已被作者删除，无法继续对话</span>
                      </div>
                    </div>
                  </form>
                </div>
              )}
            </>
          )}
        </main>
      </div>
    </>
  )
}

export default CustomModel
