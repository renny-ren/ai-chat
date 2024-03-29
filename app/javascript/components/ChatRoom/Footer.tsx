import React, { useState, useRef, useEffect, useContext } from "react"
import { message } from "antd"
import { AppContext } from "components/AppContext"
import currentUser from "stores/current_user_store"
import { MentionsInput, Mention } from "react-mentions"
import data from "@emoji-mart/data"
import Picker from "@emoji-mart/react"
import GPT3Tokenizer from "gpt3-tokenizer"
import * as CommonApi from "shared/api/common"
import UpgradeModal from "components/common/UpgradeModal"

interface FooterProps {
  cable: any
  isGenerating: boolean
  setIsGenerating: () => void
  showNotice: () => void
  subscribers: any
  content: string
  setContent: () => void
  usedMessageCount: number
}

const Footer: React.FC<FooterProps> = ({
  cable,
  isGenerating,
  setIsGenerating,
  showNotice,
  subscribers,
  content,
  setContent,
  usedMessageCount,
}) => {
  const [isToAI, setIsToAI] = useState(false)
  const [showEmojiPicker, setShowEmojiPicker] = useState(false)
  const [isUpgradeOpen, setIsUpgradeOpen] = useState(false)
  const inputRef = useRef(null)
  const gptUserNickname = gon.global_config.robot_name
  const { setShowSigninModal } = useContext(AppContext)
  const tokenizer = new GPT3Tokenizer({ type: "gpt3" })
  const messageLimitPerDay = currentUser.membership() === "advanced" ? 999 : 100

  useEffect(() => {
    setIsToAI(content.startsWith(`@${gptUserNickname}`))
    if (content) inputRef.current.focus()
  }, [content])

  const handleSubmit = async (event) => {
    event.preventDefault()
    // console.log("subs", cable.subscriptions)
    if (!content || content.trim() === "@ChatGPT") {
      message.info("请输入内容")
      return
    }

    if (usedMessageCount >= messageLimitPerDay) {
      setIsUpgradeOpen(true)
      return
    }

    // Check message length limit
    const encoded: { bpe: number[]; text: string[] } = tokenizer.encode(content)
    if ((encoded.bpe?.length || content.length) > currentUser.plan().max_question_length) {
      return showNotice(`消息超过当前套餐的最大长度限制(${currentUser.plan().max_question_length})，请精简提问或分条发送`)
    }

    // Check sensitive words
    const res = await CommonApi.checkWords(content)
    const data = await res.json
    if (!res.ok && data.error_code === 1001) {
      return message.error("消息包含敏感词，不适合在当前聊天室发送，请检查")
    }

    if (isToAI) {
      if (isGenerating) {
        return showNotice("机器人忙不过来了，请稍等")
      }
      setIsGenerating(true)
    }

    cable.subscriptions.subscriptions[0].send({
      content: content,
      is_to_ai: isToAI,
      mentions: content.match(/@(\S+)/g)?.map((mention) => mention.substring(1)) || [],
    })

    setContent("")
    setIsToAI(false)
    setShowEmojiPicker(false)
    inputRef.current.blur()
  }

  const checkKeyPress = (e) => {
    if (e.key === "Enter") {
      if (e.ctrlKey || e.shiftKey) {
        // document.execCommand("insertHTML", false, "<br/><br/>")
      } else {
        handleSubmit(e)
      }
    }
  }

  const handleContentChange = (e, newValue, newPlainTextValue, mentions) => {
    setContent(newPlainTextValue)
    // inputRef.current.style.height = "24px"
    // inputRef.current.style.height = inputRef.current.scrollHeight + "px"
  }

  const toggleIsToAI = (e) => {
    setContent(isToAI ? content.replace(`@${gptUserNickname} `, "") : `@${gptUserNickname} ${content}`)
    setIsToAI(!isToAI)
  }

  const onMention = (id, display) => {
    if (display === gptUserNickname) {
      setIsToAI(true)
    }
  }

  const onClickOutside = (e) => {
    if (e.target.tagName.toLowerCase() === "div") {
      setShowEmojiPicker(false)
    }
  }

  const onEmojiSelect = (item) => {
    inputRef.current.focus()
    setContent(content.concat(item.native))
  }

  const getIconStrokeColor = () => {
    if (document.documentElement.classList.contains("dark")) {
      return content ? "#cdcdcd" : "#31c48d"
    } else {
      return content ? "#31c48d" : "#cdcdcd"
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
        <form
          className="stretch mx-2 flex flex-row gap-3 last:mb-2 md:last:mb-6 lg:mx-auto lg:max-w-3xl"
          onSubmit={handleSubmit}
        >
          <div className="relative flex h-full flex-1 flex-col">
            {currentUser.isSignedIn() ? (
              <div className="flex flex-col justify-end w-full py-2 flex-grow md:py-3 md:pl-2 relative border border-black/10 bg-white dark:border-gray-900/50 dark:text-white dark:bg-gray-700 rounded-md shadow-[0_0_10px_rgba(0,0,0,0.10)] dark:shadow-[0_0_15px_rgba(0,0,0,0.10)]">
                <div className="flex items-center absolute gap-1.5">
                  <button
                    className="z-10 ml-2 md:ml-1 pt-px text-gray-500 md:hover:bg-gray-100 dark:hover:text-gray-400 dark:hover:bg-gray-900 outline-none"
                    type="button"
                    onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                  >
                    <svg className="h-5 w-5" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg">
                      <path
                        d="M512 981.333333C253.866667 981.333333 42.666667 770.133333 42.666667 512S253.866667 42.666667 512 42.666667s469.333333 211.2 469.333333 469.333333-211.2 469.333333-469.333333 469.333333z m0-853.333333C300.8 128 128 300.8 128 512s172.8 384 384 384 384-172.8 384-384S723.2 128 512 128z"
                        fill={showEmojiPicker ? "#31c48d" : "#6b7280"}
                      ></path>
                      <path
                        d="M640 469.333333c36.266667 0 64-27.733333 64-64s-27.733333-64-64-64-64 27.733333-64 64 29.866667 64 64 64M384 469.333333c36.266667 0 64-27.733333 64-64s-27.733333-64-64-64-64 27.733333-64 64 29.866667 64 64 64M512 725.333333c78.933333 0 151.466667-38.4 194.133333-104.533333 12.8-19.2 8.533333-46.933333-12.8-59.733333-19.2-12.8-46.933333-8.533333-59.733333 12.8-25.6 40.533333-72.533333 66.133333-121.6 66.133333s-96-25.6-123.733333-66.133333c-12.8-19.2-40.533333-25.6-59.733334-12.8-19.2 12.8-25.6 40.533333-12.8 59.733333 44.8 66.133333 117.333333 104.533333 196.266667 104.533333"
                        fill={showEmojiPicker ? "#31c48d" : "#6b7280"}
                      ></path>
                    </svg>
                  </button>
                  <button
                    className="z-10 text-gray-500 md:hover:bg-gray-100 dark:hover:text-gray-400 dark:hover:bg-gray-900 outline-none"
                    type="button"
                    onClick={toggleIsToAI}
                  >
                    <svg
                      className="h-6 w-6"
                      viewBox="0 0 1024 1024"
                      strokeWidth="2"
                      version="1.1"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M405.333333 149.333333l67.562667 184.234667h91.776L632.234667 149.333333h64l-67.562667 184.234667h110.229333a64 64 0 0 1 64 64v407.274667a64 64 0 0 1-64 64H285.098667a64 64 0 0 1-64-64v-407.253334a64 64 0 0 1 64-64l123.797333-0.021333L341.333333 149.333333h64z m333.568 248.234667H285.098667v407.274667h453.802666v-407.253334zM192 496.490667v213.333333H128v-213.333333h64z m698.176 0v213.333333h-64v-213.333333h64zM405.333333 519.744a42.666667 42.666667 0 1 1 0 85.333333 42.666667 42.666667 0 0 1 0-85.333333z m213.333334 0a42.666667 42.666667 0 1 1 0 85.333333 42.666667 42.666667 0 0 1 0-85.333333z"
                        fill={isToAI ? "#31c48d" : "#6b7280"}
                      ></path>
                    </svg>
                  </button>
                </div>
                <MentionsInput
                  className="mentions"
                  // className="max-h-52 m-0 w-full resize-none border-0 bg-transparent p-0 pl-8 pr-7 focus:ring-0 focus-visible:ring-0 dark:bg-transparent"
                  inputRef={inputRef}
                  placeholder="← 点击图标与 AI 交流，提问越精确，答案越合适"
                  style={{
                    input: {
                      maxHeight: "13rem",
                      margin: 0,
                      width: "100%",
                      resize: "none",
                      borderWidth: 0,
                      backgroundColor: "initial",
                      padding: "0 1.75rem 0 3.8rem",
                      boxShadow: "none",
                    },
                    highlighter: {
                      border: 0,
                    },
                  }}
                  value={content}
                  onChange={handleContentChange}
                  onKeyDown={checkKeyPress}
                  forceSuggestionsAboveCursor={true}
                >
                  <Mention
                    trigger="@"
                    displayTransform={(id, display) => `@${display}`}
                    appendSpaceOnAdd={true}
                    data={(search) =>
                      subscribers
                        .filter((user) => user.id != currentUser.id())
                        .filter((user) => !user.nickname.startsWith("游客"))
                        .filter((user) => user.nickname.toLowerCase().indexOf(search.toLowerCase()) != -1)
                        .map((user) => ({ id: user.id, display: user.nickname }))
                    }
                    onAdd={onMention}
                  />
                </MentionsInput>
                <button
                  type="submit"
                  className="absolute p-1 rounded-md text-gray-500 right-1 md:right-2 md:hover:bg-gray-100 dark:hover:text-gray-400 dark:hover:bg-gray-900 disabled:hover:bg-transparent dark:disabled:hover:bg-transparent outline-none"
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
            ) : (
              <div
                onClick={() => setShowSigninModal(true)}
                className="cursor-pointer flex flex-col w-full py-2 flex-grow md:pl-2 relative border border-black/10 bg-white dark:border-gray-900/50 dark:text-white dark:bg-gray-700 rounded-md shadow-sm"
              >
                <div className="flex h-6 w-full items-center pl-2 pr-3 text-sm text-zinc-500 transition dark:text-zinc-400 focus:[&amp;:not(:focus-visible)]:outline-none">
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
                  <span className="pl-1">登录即可免费畅聊</span>
                </div>
              </div>
            )}
          </div>
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
            <span className="hidden md:block">{currentUser.isSignedIn() && <span>此聊天室内免费畅聊</span>}</span>
            <span>当前应用：ChatGPT (GPT-3.5)</span>
            <a className="underline" href="/models" rel="noreferrer">
              查看更多应用
            </a>
          </div>
        </footer>
      </div>
    </>
  )
}

export default Footer
