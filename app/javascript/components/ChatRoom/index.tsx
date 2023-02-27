import React, { useState, useEffect, useRef } from "react"
import Sidebar from "./Sidebar"
import Sample from "./Sample"
import currentUser from "stores/current_user_store"

interface ChatRoomProps {
  cable: any
}

const ChatRoom: React.FC<ChatRoomProps> = ({ cable }) => {
  const messagesEndRef = useRef(null)
  const messagesRef = useRef()
  const [messages, setMessages] = useState([])
  const [content, setContent] = useState("")
  const [isToAI, setIsToAI] = useState(false)

  messagesRef.current = messages

  useEffect(() => {
    console.log("yyy")

    cable.subscriptions.create("MessagesChannel", {
      received: (data) => {
        console.log("==2received==", data)
        console.log("count:", messagesRef.current)

        // setMessages([...messages, data])
        setMessages([...messagesRef.current, data])
        scrollToBottom()
      },
      //   connected: () => {
      //     console.log("Subscription connected!")
      //     // if (cable.subscriptions.subscriptions.length > 0) {
      //     //   cable.subscriptions.subscriptions[0].send({ content: "content" })
      //     // }
      //   },
    })

    // return () => {
    //   channel.unsubscribe()
    // }
  }, [])

  const handleContentChange = (event) => {
    setContent(event.target.value)
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    if (!content) {
      return
    }
    console.log("www", cable.subscriptions)

    cable.subscriptions.subscriptions[0].send({
      content: content,
      mentions: isToAI || content.startsWith(gon.global_config.robot_name) ? [gon.global_config.robot_name] : [],
    })

    setContent("")
    setIsToAI(false)
  }

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  const toggleIsToAI = (e) => {
    setIsToAI(!isToAI)
  }

  const getGPTResult = async (_promptToRetry?: string | null, _uniqueIdToRetry?: string | null) => {
    if (isLoading) {
      return
    }

    setIsLoading(true)

    try {
      const csrf = document.querySelector("meta[name='csrf-token']").getAttribute("content")
      const response = await axios.post(
        "/v1/completions",
        {
          prompt: content,
          model: modelValue,
        },
        {
          headers: {
            "X-CSRF-Token": csrf,
          },
        }
      )
      console.log(response)
      if (modelValue === "image") {
        updateResponse(uniqueId, {
          image: response.data,
        })
      } else {
        updateResponse(uniqueId, {
          response: response.data.message.trim(),
        })
      }

      // updateResponse(uniqueId, { response: "\n\nMy name is Jessie and I am an artificial intelligence." })
    } catch (err) {
      updateResponse(uniqueId, {
        // @ts-ignore
        response: `Error: ${err.message}`,
        error: true,
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="relative h-full w-full transition-width flex flex-col overflow-hidden items-stretch flex-1 pb-14">
      <div className="flex-1 overflow-hidden relative">
        <div className="h-full overflow-hidden">
          <div className="flex h-full antialiased text-gray-800">
            <div className="flex flex-row h-full w-full overflow-x-hidden">
              <div className="flex flex-col flex-auto h-full items-center">
                <div className="flex flex-col flex-auto flex-shrink-0 rounded-2xl h-full w-full md:max-w-3xl lg:max-w-4xl">
                  <div className="flex flex-col h-full overflow-x-auto mb-4 pb-14">
                    <div className="flex flex-col h-full">
                      <div className="grid grid-cols-12 gap-y-2">
                        {/*<Sample />*/}
                        {messages.map((message, i) => {
                          return message.user_id === currentUser.id() ? (
                            <div key={i} className="col-start-6 col-end-13 p-3 rounded-lg">
                              <div className="flex items-center justify-start flex-row-reverse">
                                <img
                                  className="inline-block h-10 w-10 rounded-full ring-2 ring-white"
                                  src={currentUser.avatarUrl()}
                                />
                                <div className="relative mr-3 text-sm bg-indigo-100 py-2 px-4 shadow rounded-xl">
                                  <div>
                                    {message.mentioned_users_nickname.map((name) => `@${name}`)} {message.content}
                                  </div>
                                </div>
                              </div>
                            </div>
                          ) : (
                            <div key={i} className="col-start-1 col-end-8 p-3 rounded-lg">
                              <div className="flex flex-row items-center">
                                <img
                                  className="inline-block h-10 w-10 rounded-full ring-2 ring-white"
                                  src={message.user_avatar_url}
                                />
                                <div className="relative ml-3 text-sm bg-white py-2 px-4 shadow rounded-xl">
                                  <div>
                                    {message.mentioned_users_nickname.map((name) => `@${name}`)} {message.content}
                                  </div>
                                </div>
                              </div>
                            </div>
                          )
                        })}
                      </div>
                      <div ref={messagesEndRef}></div>
                      <div className="w-full h-20 flex-shrink-0"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/*<div className="absolute bottom-0 left-0 w-full dark:border-transparent bg-vert-light-gradient dark:bg-vert-dark-gradient input-area">
        <div className="flex flex-row items-center h-16 rounded-xl bg-white w-full px-4 md:max-w-3xl lg:max-w-4xl mx-auto">
          <div>
            <button className="flex items-center justify-center text-gray-400 hover:text-gray-600">
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"
                ></path>
              </svg>
            </button>
          </div>
          <form className="flex flex-row items-center rounded-xl bg-white w-full" onSubmit={handleSubmit}>
            <div className="flex-grow ml-4">
              <div className="relative w-full">
                <input
                  type="text"
                  className="flex w-full border rounded-xl focus:outline-none focus:border-indigo-300 pl-4 h-10"
                  value={content}
                  onChange={handleContentChange}
                />
                <button className="absolute flex items-center justify-center h-full w-12 right-0 top-0 text-gray-400 hover:text-gray-600">
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    ></path>
                  </svg>
                </button>
              </div>
            </div>
            <div className="ml-4">
              <button
                type="submit"
                className="flex items-center justify-center bg-emerald-500 hover:bg-emerald-600 rounded-xl text-white px-4 py-1 flex-shrink-0"
              >
                <span>发送</span>
                <span className="ml-2">
                  <svg
                    className="w-4 h-4 transform rotate-45 -mt-px"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                    ></path>
                  </svg>
                </span>
              </button>
            </div>
          </form>
        </div>
      </div>*/}
      <div className="absolute bottom-0 left-0 w-full dark:border-transparent bg-vert-light-gradient dark:bg-vert-dark-gradient input-area">
        <form
          className="stretch mx-2 flex flex-row gap-3 last:mb-2 md:last:mb-6 lg:mx-auto lg:max-w-3xl"
          onSubmit={handleSubmit}
        >
          <div className="relative flex h-full flex-1 flex-col">
            <div className="flex flex-col w-full py-2 flex-grow md:py-3 md:pl-2 relative border border-black/10 bg-white dark:border-gray-900/50 dark:text-white dark:bg-gray-700 rounded-md shadow-[0_0_10px_rgba(0,0,0,0.10)] dark:shadow-[0_0_15px_rgba(0,0,0,0.10)]">
              <button
                className="absolute text-gray-500 hover:bg-gray-100 dark:hover:text-gray-400 dark:hover:bg-gray-900"
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
              <input
                type="text"
                className="m-0 w-full resize-none border-0 bg-transparent p-0 pl-8 pr-7 focus:ring-0 focus-visible:ring-0 dark:bg-transparent"
                value={content}
                onChange={handleContentChange}
              />
              <button
                type="submit"
                className="absolute p-1 rounded-md text-gray-500 bottom-1.5 right-1 md:bottom-2.5 md:right-2 hover:bg-gray-100 dark:hover:text-gray-400 dark:hover:bg-gray-900 disabled:hover:bg-transparent dark:disabled:hover:bg-transparent"
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
          </div>
        </form>
      </div>
    </div>
  )
}

export default ChatRoom
