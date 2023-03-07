import React, { Fragment, useState, useEffect, useRef } from "react"
import MessageList from "./MessageList"
import Footer from "./Footer"
import currentUser from "stores/current_user_store"
import axios from "axios"
import consumer from "channels/consumer"
import { Helmet } from "react-helmet"
import Announcement from "./Announcement"
import ClearConversationModal from "./ClearConversationModal"

interface ChatRoomProps {
  showSignInModal: () => void
  setCustomContent: any
}

const ChatRoom: React.FC<ChatRoomProps> = ({ showSignInModal, setCustomContent }) => {
  const messagesEndRef = useRef(null)
  const messagesRef = useRef()
  const [messages, setMessages] = useState([])
  const [isGenerating, setIsGenerating] = useState(false)
  const [channel, setChannel] = useState()
  const [isOpenClearModal, setIsOpenClearModal] = useState(false)

  messagesRef.current = messages

  useEffect(() => {
    fetchMessages()
    setCustomContent(<Announcement />)
    return () => {
      consumer.disconnect()
    }
  }, [])

  useEffect(() => {
    resubscribeChannel()
  }, [gon.user_meta])

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const closeModal = () => {
    setIsOpenClearModal(false)
  }

  const openModal = () => {
    setIsOpenClearModal(true)
  }

  const resubscribeChannel = () => {
    if (channel) {
      channel.unsubscribe()
      consumer.disconnect()
    }
    newChannel = subscribeChannel(consumer)
    setChannel(newChannel)
  }

  const subscribeChannel = (consumer) => {
    // HACK: prevent creating multiple subscriptions for a consumer.
    if (consumer.subscriptions.subscriptions.length != 0) {
      consumer.subscriptions.subscriptions[0].unsubscribe()
    }
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
                          <MessageList messages={messages} openModal={openModal} />
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
      </div>
      <ClearConversationModal isOpen={isOpenClearModal} closeModal={closeModal} />
    </>
  )
}

export default ChatRoom
