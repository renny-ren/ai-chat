import React, { useEffect, useState, useRef, useContext } from "react"
import { useParams } from "react-router-dom"
import { AppContext } from "components/AppContext"
import currentUser from "stores/current_user_store"
import { message } from "antd"
import data from "@emoji-mart/data"
import Picker from "@emoji-mart/react"
import DownloadButton from "./DownloadButton"
import UpgradeModal from "components/common/UpgradeModal"
import queryString from "query-string"
import GPT3Tokenizer from "gpt3-tokenizer"

message.config({
  maxCount: 2,
})

interface FooterProps {
  prompt: string
  setPrompt: () => void
  isLoading: boolean
  setIsLoading: () => void
  messages: any
  setMessages: () => void
  setUsedMessageCount: () => void
  usedMessageCount: number
}

const Footer: React.FC<FooterProps> = ({
  uniqueIdToRetry,
  regenerateResponse,
  prompt,
  setPrompt,
  isLoading,
  setIsLoading,
  usedMessageCount,
  messages,
  setMessages,
  setUsedMessageCount,
}) => {
  const inputRef = useRef(null)
  const [showEmojiPicker, setShowEmojiPicker] = useState(false)
  const messageLimitPerDay = currentUser.plan()?.message_limit_per_day
  const [isUpgradeOpen, setIsUpgradeOpen] = useState(false)
  const { setShowSigninModal, setConversations } = useContext(AppContext)
  const [conversationId, setConversationId] = useState(useParams().conversationId || "")
  const tokenizer = new GPT3Tokenizer({ type: "gpt3" })

  useEffect(() => {
    if (isLoading) {
      fetchResponse()
      setPrompt("")
    }
  }, [isLoading])

  const checkKeyPress = (e) => {
    if (e.key === "Enter") {
      if (e.ctrlKey || e.shiftKey) {
      } else {
        handleSubmit(e)
      }
    }
  }

  const handlePromptChange = (e) => {
    setPrompt(e.target.value)
    e.target.style.height = "24px"
    e.target.style.height = e.target.scrollHeight + "px"
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
      setIsUpgradeOpen(true)
      return
    }
    const encoded: { bpe: number[]; text: string[] } = tokenizer.encode(prompt)
    if ((encoded.bpe?.length || prompt.length) > currentUser.plan().max_question_length) {
      return message.error(`消息超过最大长度限制(${currentUser.plan().max_question_length})，请精简提问或分条发送`)
    }
    addMessage({ role: "user", content: prompt })
    addMessage({ role: "assistant", content: "", isLoading: true })
    setIsLoading(true)
    setShowEmojiPicker(false)
    inputRef.current.blur()
    inputRef.current.style.height = "24px"
  }

  const queryParams = {
    prompt: prompt,
    conversation_id: conversationId,
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

  const handleMessageDone = (response) => {
    setUsedMessageCount(usedMessageCount + 1)
    // Add new conversation to sidebar
    if (messages.length <= 2) {
      setConversationId(response.conversation_id)
      setConversations((prevConversations) => {
        return [{ current: true, id: response.conversation_id, title: response.conversation_title }, ...prevConversations]
      })
    }
  }

  const addMessage = (msg) => {
    // setMessages([...messages, msg])
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

  const onClickOutside = (e) => {
    if (e.target.tagName.toLowerCase() === "div") {
      setShowEmojiPicker(false)
    }
  }

  const onEmojiSelect = (item) => {
    inputRef.current.focus()
    setPrompt(prompt.concat(item.native))
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
        {showEmojiPicker && (
          <div className="pl-2 pb-px lg:mx-auto lg:max-w-3xl">
            <Picker
              data={data}
              onEmojiSelect={onEmojiSelect}
              onClickOutside={onClickOutside}
              locale="zh"
              previewPosition="none"
            />
          </div>
        )}
        <form className="stretch mx-2 flex flex-row gap-3 last:mb-2 md:last:mb-6 lg:mx-auto lg:max-w-3xl">
          {currentUser.isSignedIn() ? (
            <div className="relative flex h-full flex-1 flex-col">
              <div className="w-full flex gap-2 justify-center mb-3">
                {uniqueIdToRetry && (
                  <button onClick={regenerateResponse} className="btn flex justify-center gap-2 btn-neutral">
                    <span role="img" className="semi-icon semi-icon-default">
                      <svg
                        stroke="currentColor"
                        fill="none"
                        strokeWidth="1.5"
                        viewBox="0 0 24 24"
                        strokeLinecap="round"
                        strokeLinejoin="round"
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
              <div className="flex items-center">
                {!!messages.length && <DownloadButton messages={messages} conversationId={conversationId} />}
                <div className="flex flex-col w-full py-2 flex-grow md:py-3 md:pl-4 relative border border-black/10 bg-white dark:border-gray-900/50 dark:text-white dark:bg-gray-700 rounded-md shadow-[0_0_10px_rgba(0,0,0,0.10)] dark:shadow-[0_0_15px_rgba(0,0,0,0.10)]">
                  <div className="flex items-center absolute gap-1.5 md:gap-2.5">
                    <button
                      className="z-10 ml-2 md:ml-0 pt-px text-gray-500 md:hover:bg-gray-100 dark:hover:text-gray-400 dark:hover:bg-gray-900 outline-none"
                      type="button"
                      onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                    >
                      <svg className="h-5 w-5" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg">
                        <path
                          d="M512 981.333333C253.866667 981.333333 42.666667 770.133333 42.666667 512S253.866667 42.666667 512 42.666667s469.333333 211.2 469.333333 469.333333-211.2 469.333333-469.333333 469.333333z m0-853.333333C300.8 128 128 300.8 128 512s172.8 384 384 384 384-172.8 384-384S723.2 128 512 128z"
                          fill={showEmojiPicker ? "#31c48d" : "#808080"}
                        ></path>
                        <path
                          d="M640 469.333333c36.266667 0 64-27.733333 64-64s-27.733333-64-64-64-64 27.733333-64 64 29.866667 64 64 64M384 469.333333c36.266667 0 64-27.733333 64-64s-27.733333-64-64-64-64 27.733333-64 64 29.866667 64 64 64M512 725.333333c78.933333 0 151.466667-38.4 194.133333-104.533333 12.8-19.2 8.533333-46.933333-12.8-59.733333-19.2-12.8-46.933333-8.533333-59.733333 12.8-25.6 40.533333-72.533333 66.133333-121.6 66.133333s-96-25.6-123.733333-66.133333c-12.8-19.2-40.533333-25.6-59.733334-12.8-19.2 12.8-25.6 40.533333-12.8 59.733333 44.8 66.133333 117.333333 104.533333 196.266667 104.533333"
                          fill={showEmojiPicker ? "#31c48d" : "#808080"}
                        ></path>
                      </svg>
                    </button>
                  </div>
                  <textarea
                    ref={inputRef}
                    className="user-input max-h-52 m-0 w-full resize-none border-0 bg-transparent p-0 pl-8 pr-7 focus:ring-0 focus-visible:ring-0 dark:bg-transparent"
                    value={prompt}
                    onChange={handlePromptChange}
                    style={{ height: "24px" }}
                    onKeyPress={checkKeyPress}
                    placeholder="你的提问越精确，答案就越合适"
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
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <line x1="22" y1="2" x2="11" y2="13"></line>
                      <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                    </svg>
                  </button>
                </div>
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
                <span className="pl-1">登录以开始聊天</span>
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
              <p>卿今日之 AI 聊天次数也已耗尽</p>
              <p>愿君升级套餐，或明朝再来</p>
            </>
          }
        />
        <footer className="px-3 pt-2 pb-2 text-center text-xs text-black/50 dark:text-white/50 md:px-4 md:pt-3">
          <div className="flex flex-wrap items-center justify-center space-x-4">
            <span>
              {currentUser.isSignedIn() && <span>今日剩余次数：{Math.max(0, messageLimitPerDay - usedMessageCount)}</span>}
            </span>
            <span>当前应用：ChatGPT (GPT-3.5)</span>
            <a className="underline hidden md:block" href="/models" rel="noreferrer">
              查看更多应用
            </a>
          </div>
        </footer>
      </div>
    </>
  )
}

export default Footer
