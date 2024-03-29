import React, { FC, useState, useEffect, useRef } from "react"
import { useParams, useLocation } from "react-router-dom"
import { Spin, message } from "antd"
import * as UserApi from "shared/api/user"
import type { MessageInterface } from "./types"
import MessageList from "./MessageList"
import Footer from "./Footer"
import Typed from "typed.js"
import { CDN_HOST } from "shared/constants"
import { Helmet } from "react-helmet"

interface ChatModuleProps {}

const ChatModule: FC<ChatModuleProps> = ({}) => {
  const [messages, setMessages] = useState<MessageInterface[]>([])
  const [prompt, setPrompt] = useState<string>("")
  const [promptToRetry, setPromptToRetry] = useState<string | null>(null)
  const [uniqueIdToRetry, setUniqueIdToRetry] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isFetchingMsgs, setIsFetchingMsgs] = useState(false)
  const [pagination, setPagination] = useState({})
  const [model, setModel] = useState({})
  let conversationId = useParams().conversationId
  let { state } = useLocation()

  const htmlToText = (html: string) => {
    const temp = document.createElement("div")
    temp.innerHTML = html
    return temp.textContent
  }

  const delay = (ms: number) => {
    return new Promise((resolve) => setTimeout(resolve, ms))
  }

  useEffect(() => {
    if (conversationId) {
      fetchMessages()
    }
  }, [conversationId])

  const fetchMessages = async (page = 1) => {
    setIsFetchingMsgs(true)
    const res = await UserApi.fetchMessages(conversationId, page)
    const data = await res.json
    if (res.ok) {
      setMessages(page === 1 ? data.messages.reverse() : [...data.messages.reverse(), ...messages])
      setPagination(data.pagination_meta)

      if (data.model) {
        setModel(data.model)
      }
      // setPagination(data.pagination_meta)
    } else {
      message.error(data.message)
    }
    setIsFetchingMsgs(false)
  }

  const defaultPrompts = [
    {
      title: "AI 创作",
      img_src: `${CDN_HOST}/assets/e1.png`,
      prompts: [
        "写一首赞美祖国的诗",
        "给10岁的孩子过生日有什么创意吗",
        "写一篇 200 字左右的爱情故事，男主角叫小明，女主角叫小红",
        "用 Python 写一个猜数字的游戏并运行它",
      ],
    },
    {
      title: "有趣的提问",
      img_src: `${CDN_HOST}/assets/e2.png`,
      prompts: ["有哪些有趣的科学实验", "AI 会替代人类工作吗", "如何问一个让 AI 也答不出的问题", "帮我制定一个减肥计划"],
    },
    {
      title: "AI 百科",
      img_src: `${CDN_HOST}/assets/e3.png`,
      prompts: [
        "用简单的术语来解释人工智能",
        "莲藕排骨汤的做法",
        "请解释下概率是如何工作的",
        "用简单的语言解释量子计算",
        "How do I make an HTTP request in Javascript?",
      ],
    },
  ]

  const el = useRef(null)
  const typed = useRef(null)
  const messagesEndRef = useRef(null)

  useEffect(() => {
    // scrollToBottom()
  }, [messages])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    const options = {
      strings: [
        "智能交互引未来，语言生成开新局\n\n机器问答解难题，人工智能无极限",
        "与我聊天\n\n尽显人工智能智慧之美",
        "随时陪伴\n\n为你解答疑惑\n\n开启无限可能",
        "我是一个大型语言模型\n\n能够通过自然语言与用户进行交互\n\n并提供各种知识和服务",
        "你可以问我任何问题",
      ],
      typeSpeed: 60,
      backSpeed: 50,
      backDelay: 2500,
      loop: true,
    }

    // elRef refers to the <span> rendered below
    typed.current = new Typed(el.current, options)

    return () => {
      // Make sure to destroy Typed instance during cleanup
      // to prevent memory leaks
      typed.current.destroy()
    }
  }, [])

  return (
    <>
      <Helmet>
        <title>{state?.conversationTitle || "智言智语 AI"}</title>
      </Helmet>
      <main className="relative h-full w-full transition-width flex flex-col overflow-hidden items-stretch flex-1 pb-20">
        <div className="flex-1 overflow-hidden relative">
          <div className="prompt-response-list h-full dark:bg-gray-800">
            <div className="h-full w-full overflow-y-auto">
              {!messages.length ? (
                <>
                  {isFetchingMsgs ? (
                    <div className="flex h-full justify-center items-center">
                      <Spin size="large" />
                    </div>
                  ) : (
                    <>
                      <div className="flex flex-col items-center text-sm dark:bg-gray-800">
                        <div className="pt-4 sm:pt-2 text-gray-800 w-full md:max-w-2xl lg:max-w-3xl md:h-full md:flex md:flex-col px-4 md:px-6 dark:text-gray-100">
                          <div className="hidden md:block type-wrap text-lg md:text-xl lg:text-2xl leading-6 lg:leading-8 h-56 py-6 px-6 w-full md:max-w-2xl lg:max-w-3xl">
                            <span style={{ whiteSpace: "pre" }} ref={el} />
                          </div>
                          <div>
                            <div className="flex items-start text-center gap-3.5">
                              {defaultPrompts.map((item, idx) => (
                                <div key={idx} className="flex flex-col gap-3.5 flex-1">
                                  <div className="m:auto">
                                    <div className="inline-block w-6 h-6">
                                      <img src={item.img_src} width="24" height="24" />
                                    </div>
                                  </div>
                                  <h2 className="text-lg font-sans font-normal">{item.title}</h2>
                                  <ul className="flex flex-col gap-3.5">
                                    {item.prompts.map((text, i) => (
                                      <li
                                        key={i}
                                        onClick={() => setPrompt(text)}
                                        className="w-full bg-gray-50 dark:bg-white/5 p-3 rounded-md hover:bg-gray-200 dark:hover:bg-gray-900 cursor-pointer"
                                      >
                                        <div>{text}</div>
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                        <div className="w-full h-24 flex-shrink-0"></div>
                      </div>
                    </>
                  )}
                </>
              ) : (
                <MessageList
                  messagesEndRef={messagesEndRef}
                  messages={messages}
                  fetchMessages={fetchMessages}
                  isFetchingMessages={isFetchingMsgs}
                  pagination={pagination}
                  isLoading={isLoading}
                  model={model}
                />
              )}
            </div>
          </div>
        </div>
        <Footer
          prompt={prompt}
          setPrompt={setPrompt}
          isLoading={isLoading}
          setIsLoading={setIsLoading}
          messages={messages}
          setMessages={setMessages}
        />
      </main>
    </>
  )
}

export default ChatModule
