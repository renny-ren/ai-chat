import React, { useState, useRef, useEffect } from "react"
import currentUser from "stores/current_user_store"
import { MentionsInput, Mention } from "react-mentions"

interface FooterProps {
  cable: any
  showSignInModal: () => void
  isGenerating: boolean
  setIsGenerating: () => void
  showNotice: () => void
  subscribers: any
  content: string
  setContent: () => void
}

const Footer: React.FC<FooterProps> = ({
  cable,
  showSignInModal,
  isGenerating,
  setIsGenerating,
  showNotice,
  subscribers,
  content,
  setContent,
}) => {
  const [isToAI, setIsToAI] = useState(false)
  const inputRef = useRef(null)
  const gptUserNickname = gon.global_config.robot_name

  useEffect(() => {
    setIsToAI(content.startsWith(`@${gptUserNickname}`))
    if (content) inputRef.current.focus()
  }, [content])

  const handleSubmit = (event) => {
    event.preventDefault()
    // console.log("subs", cable.subscriptions)
    if (!content) {
      return
    }
    if (isToAI) {
      if (isGenerating) {
        return showNotice("机器人回答不过来了，请稍后再问")
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
    if (newPlainTextValue.length > 500) {
      return showNotice("消息已达最大长度限制")
    }
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

  return (
    <>
      <div className="absolute bottom-0 left-0 w-full dark:border-transparent bg-vert-light-gradient dark:bg-vert-dark-gradient input-area">
        <form
          className="stretch mx-2 flex flex-row gap-3 last:mb-2 md:last:mb-6 lg:mx-auto lg:max-w-3xl"
          onSubmit={handleSubmit}
        >
          <div className="relative flex h-full flex-1 flex-col">
            {currentUser.isSignedIn() ? (
              <div className="flex flex-col justify-end w-full py-2 flex-grow md:py-3 md:pl-2 relative border border-black/10 bg-white dark:border-gray-900/50 dark:text-white dark:bg-gray-700 rounded-md shadow-[0_0_10px_rgba(0,0,0,0.10)] dark:shadow-[0_0_15px_rgba(0,0,0,0.10)]">
                <button
                  className="absolute z-10 ml-1 text-gray-500 md:hover:bg-gray-100 dark:hover:text-gray-400 dark:hover:bg-gray-900 outline-none"
                  type="button"
                  onClick={toggleIsToAI}
                >
                  <svg
                    t="1677473483269"
                    className="h-6 w-6"
                    viewBox="0 0 1024 1024"
                    strokeWidth="2"
                    version="1.1"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M405.333333 149.333333l67.562667 184.234667h91.776L632.234667 149.333333h64l-67.562667 184.234667h110.229333a64 64 0 0 1 64 64v407.274667a64 64 0 0 1-64 64H285.098667a64 64 0 0 1-64-64v-407.253334a64 64 0 0 1 64-64l123.797333-0.021333L341.333333 149.333333h64z m333.568 248.234667H285.098667v407.274667h453.802666v-407.253334zM192 496.490667v213.333333H128v-213.333333h64z m698.176 0v213.333333h-64v-213.333333h64zM405.333333 519.744a42.666667 42.666667 0 1 1 0 85.333333 42.666667 42.666667 0 0 1 0-85.333333z m213.333334 0a42.666667 42.666667 0 1 1 0 85.333333 42.666667 42.666667 0 0 1 0-85.333333z"
                      fill={isToAI ? "#31c48d" : "#cdcdcd"}
                    ></path>
                  </svg>
                </button>
                <MentionsInput
                  className="mentions"
                  // className="max-h-52 m-0 w-full resize-none border-0 bg-transparent p-0 pl-8 pr-7 focus:ring-0 focus-visible:ring-0 dark:bg-transparent"
                  inputRef={inputRef}
                  placeholder="← 点击图标可与 AI 交流，你的提问越精确，答案就越合适"
                  style={{
                    input: {
                      maxHeight: "13rem",
                      margin: 0,
                      width: "100%",
                      resize: "none",
                      borderWidth: 0,
                      backgroundColor: "initial",
                      padding: "0 1.75rem 0 2rem",
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
                  className="absolute p-1 rounded-md text-gray-500 bottom-1.5 right-1 md:bottom-2.5 md:right-2 md:hover:bg-gray-100 dark:hover:text-gray-400 dark:hover:bg-gray-900 disabled:hover:bg-transparent dark:disabled:hover:bg-transparent outline-none"
                >
                  <svg
                    stroke={content ? "currentColor" : "#cdcdcd"}
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
            ) : (
              <div
                onClick={showSignInModal}
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
          </div>
        </form>
      </div>
    </>
  )
}

export default Footer
