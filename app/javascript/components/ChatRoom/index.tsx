import React, { useState, useEffect, useRef } from "react"
import Sidebar from "./Sidebar"
import MessageList from "./MessageList"
import Footer from "./Footer"
import currentUser from "stores/current_user_store"
import axios from "axios"
import ActionCable from "actioncable"
import consumer from "channels/consumer"
import { Helmet } from "react-helmet"

interface ChatRoomProps {
  showSignInModal: () => void
}

const ChatRoom: React.FC<ChatRoomProps> = ({ showSignInModal }) => {
  const messagesEndRef = useRef(null)
  const messagesRef = useRef()
  const [messages, setMessages] = useState([])
  const [isGenerating, setIsGenerating] = useState(false)
  const [channel, setChannel] = useState()

  messagesRef.current = messages

  useEffect(() => {
    fetchMessages()
  }, [])

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  useEffect(() => {
    resubscribeChannel()
  }, [gon.user_meta])

  const resubscribeChannel = () => {
    if (channel) {
      channel.unsubscribe()
      consumer.disconnect()
    }
    newChannel = subscribeChannel(consumer)
    setChannel(newChannel)
  }

  const subscribeChannel = (consumer) => {
    const channel = consumer.subscriptions.create("MessagesChannel", {
      received: (data) => {
        // console.log("==received==", data)
        !data.id || data.is_first_chunk ? addMessage(data) : updateMessage(data)
      },
      connected() {
        // Called when the subscription is ready for use on the server
        console.log("==connected==")
      },
      disconnected() {
        // Called when the subscription has been terminated by the server
        console.log("==disconnected==")
      },
    })
    return channel
  }

  const addMessage = (data) => {
    setMessages([...messagesRef.current, data])
  }

  const updateMessage = (data) => {
    messagesRef.current.map((message) => {
      if (message.id === data.id) {
        if (data.done) {
          setIsGenerating(false)
          message.loading = false
        } else {
          message.loading = true
          message.content = data.content
        }
        message
      } else {
        message
      }
    })
    setMessages([...messagesRef.current])
  }

  const fetchMessages = async () => {
    const csrf = document.querySelector("meta[name='csrf-token']").getAttribute("content")
    const response = await axios.get("/v1/messages", {
      headers: {
        "X-CSRF-Token": csrf,
      },
    })
    setMessages(response.data.messages)
  }

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  return (
    <>
      <Helmet>
        <title>ChatGPT 交流群</title>
      </Helmet>
      <div className="relative h-full w-full transition-width flex flex-col overflow-hidden items-stretch flex-1 pb-14">
        <div className="flex-1 overflow-hidden relative">
          <div className="h-full overflow-hidden">
            <div className="flex h-full antialiased text-gray-800">
              <div className="flex flex-row h-full w-full overflow-x-hidden">
                <div className="flex flex-col flex-auto h-full items-center">
                  <div className="flex flex-col flex-auto flex-shrink-0 rounded-2xl h-full w-full md:max-w-3xl lg:max-w-4xl">
                    <div className="flex flex-col h-full md:pb-4">
                      <div className="flex flex-col h-full overflow-x-auto">
                        <div className="grid grid-cols-12 gap-y-2">
                          <MessageList messages={messages} />
                        </div>
                        <div ref={messagesEndRef}></div>
                        <div className="w-full h-2 sm:h-6 flex-shrink-0"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <Footer
          cable={consumer}
          showSignInModal={showSignInModal}
          isGenerating={isGenerating}
          setIsGenerating={setIsGenerating}
        />

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
      </div>
    </>
  )
}

export default ChatRoom
