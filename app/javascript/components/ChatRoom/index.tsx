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

    cable.subscriptions.subscriptions[0].send({ content: content })
    setContent("")
  }

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
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
                        <Sample />
                        {messages.map((message, i) => {
                          return message.user_id === currentUser.id() ? (
                            <div key={i} className="col-start-6 col-end-13 p-3 rounded-lg">
                              <div className="flex items-center justify-start flex-row-reverse">
                                <img
                                  className="inline-block h-10 w-10 rounded-full ring-2 ring-white"
                                  src={currentUser.avatarUrl()}
                                />
                                <div className="relative mr-3 text-sm bg-indigo-100 py-2 px-4 shadow rounded-xl">
                                  <div>{message.content}</div>
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
                                  <div>{message.content}</div>
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
      <div className="absolute bottom-0 left-0 w-full dark:border-transparent bg-vert-light-gradient dark:bg-vert-dark-gradient input-area">
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
      </div>
    </div>
  )
}

export default ChatRoom
