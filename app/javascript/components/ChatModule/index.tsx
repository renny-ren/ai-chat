import React, { useState, useEffect, useRef } from "react"
import { useParams } from "react-router-dom"
import { Button, Space, Card, Spin, message } from "antd"
import axios from "axios"
import type { MessageInterface } from "./types"
import MessageList from "./MessageList"
import Footer from "./Footer"
import Typed from "typed.js"
import { CDN_HOST } from "shared/constants"
import currentUser from "stores/current_user_store"

interface ChatModuleProps {
  setIsShowModal: () => void
  setConversations?: () => void
}

const ChatModule: FC<ChatModuleProps> = ({ setIsShowModal, setConversations }) => {
  const [messages, setMessages] = useState<MessageInterface[]>([])
  const [prompt, setPrompt] = useState<string>("")
  const [promptToRetry, setPromptToRetry] = useState<string | null>(null)
  const [uniqueIdToRetry, setUniqueIdToRetry] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [conversationId, setConversationId] = useState(useParams().conversationId || "")
  const [isFetchingMsgs, setIsFetchingMsgs] = useState(false)
  const [usedMessageCount, setUsedMessageCount] = useState(0)
  const messageLimitPerDay = currentUser.plan().message_limit_per_day

  const generateUniqueId = () => {
    const timestamp = Date.now()
    const randomNumber = Math.random()
    const hexadecimalString = randomNumber.toString(16)

    return `id-${timestamp}-${hexadecimalString}`
  }

  const htmlToText = (html: string) => {
    const temp = document.createElement("div")
    temp.innerHTML = html
    return temp.textContent
  }

  const delay = (ms: number) => {
    return new Promise((resolve) => setTimeout(resolve, ms))
  }

  const regenerateResponse = async () => {
    await getGPTResult(promptToRetry, uniqueIdToRetry)
  }

  useEffect(() => {
    if (currentUser.isSignedIn()) {
      fetchUser()
      if (conversationId) {
        fetchMessages()
      }
    }
  }, [])

  useEffect(() => {
    if (isLoading) {
      fetchResponse()
      setPrompt("")
    }
  }, [isLoading])

  const fetchUser = async () => {
    const csrf = document.querySelector("meta[name='csrf-token']").getAttribute("content")
    const response = await axios.get(`/v1/users/${currentUser.id()}`, {
      headers: {
        "X-CSRF-Token": csrf,
      },
    })
    setUsedMessageCount(response.data.user.used_message_count)
  }

  const fetchMessages = async () => {
    setIsFetchingMsgs(true)
    const csrf = document.querySelector("meta[name='csrf-token']").getAttribute("content")
    try {
      const response = await axios.get(`/v1/messages?conversation_id=${conversationId}`, {
        headers: {
          "X-CSRF-Token": csrf,
        },
      })
      setMessages(response.data.messages)
      // setPagination(response.data.pagination_meta)
    } catch (error) {
      message.error(error.response.data.message)
    } finally {
      setIsFetchingMsgs(false)
    }
  }

  const fetchResponse = () => {
    const evtSource = new EventSource(`/v1/completions/live_stream?prompt=${prompt}&conversation_id=${conversationId}`)
    evtSource.onmessage = (event) => {
      if (event) {
        const response = JSON.parse(event.data)
        // updateResponse(uniqueId, {
        //   response: response.data.message.trim(),
        // })
        updateMessage(response)
      } else {
        evtSource.close()
      }
    }
    evtSource.onerror = () => {
      setIsLoading(false)
      evtSource.close()
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!prompt) {
      return
    }
    if (isLoading) {
      return message.error("机器人回答不过来了，请稍后再问")
    }
    if (usedMessageCount >= messageLimitPerDay) {
      return message.error("今日与 AI 聊天次数已到上限，请明日再来，或前往聊天室聊天")
    }
    addMessage({ role: "user", content: prompt })
    addMessage({ role: "assistant", content: "", isLoading: true })
    setIsLoading(true)
  }

  const addMessage = (msg) => {
    // setMessages([...messages, msg])
    setMessages((prevMessages) => [...prevMessages, msg])
  }

  const updateMessage = (response) => {
    messages.map((message) => {
      if (message.isLoading) {
        if (response.done) {
          message.isLoading = false
          if (response.status === 200) {
            setUsedMessageCount(usedMessageCount + 1)
            setConversationId(response.conversation_id)
            if (setConversations) {
              // Add new conversation to sidebar
              setConversations((prevConversations) => {
                return [
                  { current: true, id: response.conversation_id, title: response.conversation_title },
                  ...prevConversations,
                ]
              })
            }
          } else {
            message.content = "哎呀呀，出了点小意外，我现在脑子有点短路，您可以给我喝点咖啡或者让我稍微休息一下再试试看！"
          }
        } else {
          message.content = response.content
        }
      }
      return message
    })
    setMessages([...messages])
  }

  const getGPTResult = async (_promptToRetry?: string | null, _uniqueIdToRetry?: string | null) => {
    // Get the prompt input
    const _prompt = _promptToRetry ?? htmlToText(prompt)

    // If a response is already being generated or the prompt is empty, return
    if (isLoading || !_prompt) {
      return
    }

    setIsLoading(true)
    setPrompt("")

    let uniqueId: string
    if (_uniqueIdToRetry) {
      uniqueId = _uniqueIdToRetry
    } else {
      // Add the self prompt to the response list
      addResponse(true, _prompt)
      uniqueId = addResponse(false)
      await delay(50)
    }

    const evtSource = new EventSource(`/v1/completions/live_stream?prompt=${_prompt}`)
    evtSource.onmessage = (event) => {
      if (!event) {
        console.log("closed")
        evtSource.close()
      } else {
        const parsedData = JSON.parse(event.data)
        console.log(event)
        console.log("=data", parsedData)
        updateResponse(uniqueId, {
          response: response.data.message.trim(),
        })
        setPromptToRetry(null)
        setUniqueIdToRetry(null)
      }
    }
    evtSource.onerror = () => {
      // setIsLoading(false)
      evtSource.close()
    }

    // try {
    //   // updateResponse(uniqueId, { response: "\n\n我正在升级中，暂不支持个人会话，请进入聊天室与我交流。" })
    // } catch (err) {
    //   setPromptToRetry(_prompt)
    //   setUniqueIdToRetry(uniqueId)
    //   updateResponse(uniqueId, {
    //     // @ts-ignore
    //     response: `Error: ${err.message}`,
    //     error: true,
    //   })
    // } finally {
    //   setIsLoading(false)
    // }
  }

  const defaultPrompts = [
    {
      title: "AI 创作",
      img_src: `${CDN_HOST}/assets/e1.png`,
      prompts: [
        "写一首赞美祖国的诗",
        "给10岁的孩子过生日有什么创意吗",
        "写一篇200字左右的爱情故事，男主角叫小明，女主角叫小红",
        "用Python写一个猜数字的游戏并运行它",
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
  const inputRef = useRef(null)

  useEffect(() => {
    scrollToBottom()
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
    <main className="relative h-full w-full transition-width flex flex-col overflow-hidden items-stretch flex-1 pb-14">
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
              <MessageList messagesEndRef={messagesEndRef} isLoading={true} messages={messages} />
            )}
          </div>
        </div>
      </div>
      <Footer
        setIsShowModal={setIsShowModal}
        prompt={prompt}
        setPrompt={setPrompt}
        handleSubmit={handleSubmit}
        inputRef={inputRef}
        remainingMessageCount={messageLimitPerDay - usedMessageCount}
      />
    </main>
  )
}

export default ChatModule
