import React, { useState, useEffect, useRef } from "react"
import { Button, Space, Card } from "antd"
import axios from "axios"
import PromptInput from "./PromptInput"
import { ResponseInterface } from "./ResponseInterface"
import PromptResponseList from "./PromptResponseList"
import Typed from "typed.js"

type ModelValueType = "gpt" | "codex" | "image"
const ChatModule = () => {
  const [responseList, setResponseList] = useState<ResponseInterface[]>([])
  const [prompt, setPrompt] = useState<string>("")
  const [promptToRetry, setPromptToRetry] = useState<string | null>(null)
  const [uniqueIdToRetry, setUniqueIdToRetry] = useState<string | null>(null)
  const [modelValue, setModelValue] = useState<ModelValueType>("gpt")
  const [isLoading, setIsLoading] = useState(false)
  let loadInterval: number | undefined

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

  const addResponse = (selfFlag: boolean, response?: string) => {
    const uid = generateUniqueId()
    setResponseList((prevResponses) => [
      ...prevResponses,
      {
        id: uid,
        response,
        selfFlag,
      },
    ])
    console.log("list", responseList)
    return uid
  }

  const updateResponse = (uid: string, updatedObject: Record<string, unknown>) => {
    setResponseList((prevResponses) => {
      const updatedList = [...prevResponses]
      const index = prevResponses.findIndex((response) => response.id === uid)
      if (index > -1) {
        updatedList[index] = {
          ...updatedList[index],
          ...updatedObject,
        }
      }
      return updatedList
    })
    scrollToBottom()
  }

  const regenerateResponse = async () => {
    await getGPTResult(promptToRetry, uniqueIdToRetry)
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

    try {
      // const csrf = document.querySelector("meta[name='csrf-token']").getAttribute("content")
      // const response = await axios.post(
      //   "/v1/completions",
      //   {
      //     prompt: _prompt,
      //     model: modelValue,
      //   },
      //   {
      //     headers: {
      //       "X-CSRF-Token": csrf,
      //     },
      //   }
      // )
      // console.log(response)
      // if (modelValue === "image") {
      //   // Show image for `Create image` model
      //   updateResponse(uniqueId, {
      //     image: response.data,
      //   })
      // } else {
      //   updateResponse(uniqueId, {
      //     response: response.data.message.trim(),
      //   })
      // }

      updateResponse(uniqueId, { response: "\n\nMy name is Jessie and I am an artificial intelligence." })

      setPromptToRetry(null)
      setUniqueIdToRetry(null)
    } catch (err) {
      setPromptToRetry(_prompt)
      setUniqueIdToRetry(uniqueId)
      updateResponse(uniqueId, {
        // @ts-ignore
        response: `Error: ${err.message}`,
        error: true,
      })
    } finally {
      clearInterval(loadInterval)
      setIsLoading(false)
    }
  }

  const defaultPrompts = [
    {
      title: "AI 创作",
      img_src: "/assets/e1.png",
      prompts: [
        "我需要一首关于爱情的诗",
        "给10岁的孩子过生日有什么创意吗",
        "写一首赞美祖国的诗",
        "写一篇200字左右的爱情故事，男主角叫小明，女主角叫小红",
        "用Python写一个猜数字的游戏并运行它",
      ],
    },
    {
      title: "有趣的提问",
      img_src: "/assets/e2.png",
      prompts: ["有哪些有趣的科学实验", "如何问一个让 AI 也答不出的问题", "AI 会替代人类工作吗", "帮我制定一个减肥计划"],
    },
    {
      title: "AI 百科",
      img_src: "/assets/e3.png",
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
            {!responseList.length ? (
              <>
                <div className="flex flex-col items-center text-sm dark:bg-gray-800">
                  <div className="text-gray-800 w-full md:max-w-2xl lg:max-w-3xl md:h-full md:flex md:flex-col px-6 dark:text-gray-100">
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
                                  className="w-full bg-gray-50 dark:bg-white/5 p-3 rounded-md hover:bg-gray-200 dark:hover:bg-gray-900 cursor-pointer"
                                >
                                  <div onClick={() => setPrompt(text)}>{text}</div>
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
            ) : (
              <PromptResponseList
                messagesEndRef={messagesEndRef}
                isLoading={isLoading}
                responseList={responseList}
                key="response-list"
              />
            )}
          </div>
        </div>
      </div>
      <div className="absolute bottom-0 left-0 w-full dark:border-transparent bg-vert-light-gradient dark:bg-vert-dark-gradient input-area">
        <form className="stretch mx-2 flex flex-row gap-3 pt-2 last:mb-2 md:last:mb-6 lg:mx-auto lg:max-w-3xl lg:pt-6">
          <div className="relative flex h-full flex-1 flex-col">
            <div className="w-full flex gap-2 justify-center mb-3">
              {uniqueIdToRetry && (
                <button onClick={() => regenerateResponse()} className="btn flex justify-center gap-2 btn-neutral">
                  <span role="img" className="semi-icon semi-icon-default">
                    <svg
                      stroke="currentColor"
                      fill="none"
                      strokeWidth="1.5"
                      viewBox="0 0 24 24"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      className="h-3 w-3"
                      height="1em"
                      width="1em"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <polyline points="1 4 1 10 7 10"></polyline>
                      <polyline points="23 20 23 14 17 14"></polyline>
                      <path d="M20.49 9A9 9 0 0 0 5.64 5.64L1 10m22 4l-4.64 4.36A9 9 0 0 1 3.51 15"></path>
                    </svg>
                  </span>
                  Regenerate response
                </button>
              )}
            </div>
            <div className="flex flex-col w-full py-2 flex-grow md:py-3 md:pl-4 relative border border-black/10 bg-white dark:border-gray-900/50 dark:text-white dark:bg-gray-700 rounded-md shadow-[0_0_10px_rgba(0,0,0,0.10)] dark:shadow-[0_0_15px_rgba(0,0,0,0.10)]">
              <PromptInput
                prompt={prompt}
                onSubmit={() => getGPTResult()}
                key="prompt-input"
                updatePrompt={(prompt) => setPrompt(prompt)}
              />
              <button
                onClick={() => getGPTResult()}
                className="absolute p-1 rounded-md text-gray-500 bottom-1.5 right-1 md:bottom-2.5 md:right-2 hover:bg-gray-100 dark:hover:text-gray-400 dark:hover:bg-gray-900 disabled:hover:bg-transparent dark:disabled:hover:bg-transparent"
              >
                <svg
                  stroke="currentColor"
                  fill="none"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-4 w-4 mr-1"
                  height="1em"
                  width="1em"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <line x1="22" y1="2" x2="11" y2="13"></line>
                  <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                </svg>
              </button>
            </div>
          </div>
        </form>
        <footer className="px-3 pt-2 pb-2 text-center text-xs text-black/50 dark:text-white/50 md:px-4 md:pt-3">
          本站点基于外部 API 开发，仅供学习交流使用，使用前请知晓
          <a className="underline" href="/disclaimer" rel="noreferrer">
            免责申明
          </a>
        </footer>
      </div>
    </main>
  )
}

export default ChatModule
