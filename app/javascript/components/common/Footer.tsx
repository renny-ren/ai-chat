import React, { useEffect, useState, useRef, useContext } from "react"
import { AppContext } from "components/AppContext"
import { useParams } from "react-router-dom"
import currentUser from "stores/current_user_store"
import { message, Select } from "antd"
import axios from "axios"
import UpgradeModal from "components/common/UpgradeModal"
import queryString from "query-string"

interface FooterProps {
  isLoading: boolean
  setIsLoading: () => void

  messages: any
  setMessages: () => void
  signInPrompt?: string
  placeholder?: string
  loadingMessage?: string
  conversationType?: string
  conversationTitle?: string
  modelId?: number
}

const Footer: React.FC<FooterProps> = ({
  isLoading,
  setIsLoading,
  setMessages,
  messages,
  signInPrompt,
  placeholder,
  loadingMessage,
  conversationType,
  conversationTitle,
  modelId,
}) => {
  const inputRef = useRef(null)
  const [prompt, setPrompt] = useState("")
  const [usedMessageCount, setUsedMessageCount] = useState(0)
  const messageLimitPerDay = currentUser.plan()?.message_limit_per_day
  const [conversationId, setConversationId] = useState(useParams().conversationId)
  const [isUpgradeOpen, setIsUpgradeOpen] = useState(false)
  const { setConversations, setShowSigninModal } = useContext(AppContext)

  useEffect(() => {
    if (currentUser.isSignedIn()) {
      fetchUser()
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

  const checkKeyPress = (e) => {
    if (e.key === "Enter") {
      if (e.ctrlKey || e.shiftKey) {
      } else {
        handleSubmit(e)
      }
    }
  }

  const handlePromptChange = (e) => {
    value = e.target.value
    setPrompt(value)
    e.target.style.height = "24px"
    e.target.style.height = e.target.scrollHeight + "px"
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!prompt) return
    if (prompt.length > currentUser.plan().max_question_length) {
      return message.error("消息超过最大长度限制，请精简提问或分条发送")
    }
    if (isLoading) {
      return message.info(loadingMessage || "加载中，请稍等")
    }
    if (usedMessageCount >= messageLimitPerDay) {
      setIsUpgradeOpen(true)
      return
    }
    addMessage({ role: "user", content: prompt })
    addMessage({ role: "assistant", content: "" })
    setIsLoading(true)
    inputRef.current.blur()
    inputRef.current.style.height = "24px"
  }

  const queryParams = {
    conversation_type: conversationType,
    prompt: prompt,
    conversation_id: conversationId,
    conversation_title: conversationTitle,
    model_id: modelId,
  }

  const fetchResponse = () => {
    const evtSource = new EventSource(`/v1/completions/live_stream?${queryString.stringify(queryParams)}`)
    evtSource.onmessage = (event) => {
      if (event) {
        const response = JSON.parse(event.data)
        if (response.done) return handleMessageDone(response)
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

  const addMessage = (msg) => {
    setMessages((prevMessages) => [...prevMessages, msg])
  }

  const updateMessage = (response) => {
    if (response.status !== 200) {
      response.content = "哎呀呀，出了点小意外，我现在脑子有点短路，您可以等我喝点咖啡或者让我稍微休息一下再试试看！"
    }
    const updatedMessages = [...messages]
    updatedMessages[messages.length - 1] = response
    setMessages(updatedMessages)
  }

  const handleMessageDone = (response) => {
    setUsedMessageCount(usedMessageCount + 1)
    // Add new conversation to sidebar
    if (messages.length <= 3) {
      setConversationId(response.conversation_id)
      setConversations((prevConversations) => {
        return [{ id: response.conversation_id, title: response.conversation_title }, ...prevConversations]
      })
    }
  }

  const getIconStrokeColor = () => {
    if (document.documentElement.classList.contains("dark")) {
      return prompt ? "#cdcdcd" : "currentColor"
    } else {
      return prompt ? "currentColor" : "#cdcdcd"
    }
  }

  return (
    <>
      <div className="absolute bottom-0 left-0 w-full dark:border-transparent bg-vert-light-gradient dark:bg-vert-dark-gradient input-area">
        <form className="stretch mx-2 flex flex-row items-center gap-1 md:gap-2 last:mb-2 md:last:mb-6 lg:mx-auto lg:max-w-3xl">
          {currentUser.isSignedIn() ? (
            <div className="relative flex h-full flex-1 flex-col">
              <div className="flex flex-col w-full py-2 flex-grow md:py-3 pl-2 md:pl-4 relative border border-black/10 bg-white dark:border-gray-900/50 dark:text-white dark:bg-gray-700 rounded-md shadow-[0_0_10px_rgba(0,0,0,0.10)] dark:shadow-[0_0_15px_rgba(0,0,0,0.10)]">
                <textarea
                  ref={inputRef}
                  className="user-input overflow-hidden max-h-52 m-0 w-full resize-none border-0 bg-transparent p-0 pr-7 focus:ring-0 focus-visible:ring-0 dark:bg-transparent"
                  value={prompt}
                  onChange={handlePromptChange}
                  style={{ height: "24px" }}
                  onKeyPress={checkKeyPress}
                  placeholder={placeholder || "请输入您想问的问题"}
                ></textarea>
                <button
                  onClick={handleSubmit}
                  type="button"
                  className="absolute p-1 rounded-md text-gray-500 right-1 md:right-2 hover:bg-gray-100 dark:hover:text-gray-400 dark:hover:bg-gray-900 disabled:hover:bg-transparent dark:disabled:hover:bg-transparent"
                >
                  <svg
                    stroke={getIconStrokeColor()}
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
          ) : (
            <div
              onClick={() => setShowSigninModal(true)}
              className="cursor-pointer flex flex-col w-full py-2 flex-grow md:py-3 md:pl-2 relative border border-black/10 bg-white dark:border-gray-900/50 dark:text-white dark:bg-gray-700 rounded-md shadow-[0_0_10px_rgba(0,0,0,0.10)] dark:shadow-[0_0_15px_rgba(0,0,0,0.10)]"
            >
              <div className="flex h-6 w-full items-center pl-2 pr-3 text-sm text-zinc-500 transition dark:bg-white/5 dark:text-zinc-400 focus:[&amp;:not(:focus-visible)]:outline-none">
                <svg
                  viewBox="0 0 20 20"
                  aria-hidden="true"
                  className="h-5 w-5 fill-zinc-500/10 stroke-zinc-500 transition-colors duration-300 group-hover:stroke-zinc-900 dark:fill-white/10 dark:stroke-zinc-400 dark:group-hover:fill-emerald-300/10 dark:group-hover:stroke-emerald-400"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M10 16.5c4.142 0 7.5-3.134 7.5-7s-3.358-7-7.5-7c-4.142 0-7.5 3.134-7.5 7 0 1.941.846 3.698 2.214 4.966L3.5 17.5c2.231 0 3.633-.553 4.513-1.248A8.014 8.014 0 0 0 10 16.5Z"
                  ></path>
                  <path fill="none" strokeLinecap="round" strokeLinejoin="round" d="M7.5 8.5h5M8.5 11.5h3"></path>
                </svg>
                <span className="pl-1">{signInPrompt || "登录即可开始使用"}</span>
              </div>
            </div>
          )}
        </form>
        <UpgradeModal
          isOpen={isUpgradeOpen}
          closeModal={() => setIsUpgradeOpen(false)}
          title="提示"
          body={
            <>
              <p>本站素来免费，但有开发维护之成本</p>
              <p>运营不易，费用不少</p>
              <p>卿今日之 AI 次数也已耗尽</p>
              <p>愿君升级套餐，或明朝再来</p>
            </>
          }
        />
        <footer className="px-3 pt-2 pb-2 text-center text-xs text-black/50 dark:text-white/50 md:px-4 md:pt-3">
          <span className="mr-4">
            {currentUser.isSignedIn() && <span>今日剩余次数：{Math.max(0, messageLimitPerDay - usedMessageCount)}</span>}
          </span>
        </footer>
      </div>
    </>
  )
}

export default Footer
