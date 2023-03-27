import React, { Fragment, useState, useEffect, useRef } from "react"
import MessageList from "./MessageList"
import Footer from "./Footer"
import Notification from "./Notification"
import axios from "axios"
import consumer from "channels/consumer"
import { Helmet } from "react-helmet"
import Announcement from "./Announcement"
import Sponsorship from "./Sponsorship"
import ClearConversationModal from "./ClearConversationModal"
import type { ChatMessage } from "./types"
import { Avatar as AntdAvatar, Tooltip } from "antd"

interface ChatRoomProps {
  showSignInModal: () => void
  setCustomContent: any
}

const ChatRoom: React.FC<ChatRoomProps> = ({ showSignInModal, setCustomContent }) => {
  const messagesRef = useRef()
  const [messages, setMessages] = useState([])
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatingMsgId, setGeneratingMsgId] = useState(0)
  const [isFetching, setIsFetching] = useState(false)
  const [channel, setChannel] = useState()
  const [isOpenClearModal, setIsOpenClearModal] = useState(false)
  const [pagination, setPagination] = useState({})
  const [isShowNotice, setIsShowNotice] = useState(false)
  const [noticeContent, setNoticeContent] = useState("")
  const [subscribers, setSubscribers] = useState([{ id: 0, nickname: gon.global_config.robot_name }])
  const [prompt, setPrompt] = useState("")

  const showNotice = (content) => {
    setNoticeContent(content)
    setIsShowNotice(true)
    setTimeout(() => {
      setIsShowNotice(false)
      setNoticeContent("")
    }, 3000)
  }

  messagesRef.current = messages

  useEffect(() => {
    fetchMessages()
    return () => {
      consumer.disconnect()
    }
  }, [])

  useEffect(() => {
    const subscribersForDispaly = subscribers.filter((user) => user.nickname != gon.global_config.robot_name)
    setCustomContent(
      <>
        <Sponsorship />
        <Announcement />
        {subscribersForDispaly.length > 1 && (
          <AntdAvatar.Group
            size="small"
            maxCount={2}
            maxStyle={{ color: "#fff", backgroundColor: "rgba(0, 0, 0, 0.5)", fontSize: "12px", borderRadius: "4px" }}
          >
            {subscribersForDispaly.map((user, i) => {
              if (i > 1) {
                return (
                  <div key={i}>
                    <AntdAvatar shape="square" src={user.avatar_url} />
                    <span className="text-zinc-600 ml-1">{user.nickname}</span>
                    {i === subscribersForDispaly.length - 1 && (
                      <div className="border-t border-gray-200 mt-2 pt-1 text-xs text-gray-400">
                        当前共{subscribersForDispaly.length}人在线
                      </div>
                    )}
                  </div>
                )
              } else {
                return <AntdAvatar key={i} shape="square" src={user.avatar_url} />
              }
            })}
          </AntdAvatar.Group>
        )}
      </>
    )
  }, [subscribers])

  useEffect(() => {
    resubscribeChannel()
  }, [gon.user_meta])

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
        if (data.type === "appearance") {
          setSubscribers(data.subscribers)
        } else {
          if (data.done) {
            setIsGenerating(false)
            if (data.status !== 200) {
              return notifyFailure(data)
            }
          }
          setGeneratingMsgId(data.done ? 0 : data.id)
          newMessageIndex = messagesRef.current.findIndex((msg) => msg.id === data.id)
          newMessageIndex === -1 ? addMessage(data) : updateMessage(data, newMessageIndex)
        }
      },
      connected() {
        // Called when the subscription is ready for use on the server
        console.log("==connected==")
        consumer.subscriptions.subscriptions[0].send({ type: "appearance" })
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

  const updateMessage = (data, index) => {
    if (data.done) return
    const updatedMessages = [...messagesRef.current]
    updatedMessages[index] = data
    setMessages(updatedMessages)
  }

  const notifyFailure = (data) => {
    setMessages([
      ...messagesRef.current,
      {
        ...data,
        content: "哎呀呀，出了点小意外，我现在脑子有点短路，您可以等我喝点咖啡或者让我稍微休息一下再试试看！",
      },
    ])
  }

  const fetchMessages = async (page = 1) => {
    setIsFetching(true)
    const csrf = document.querySelector("meta[name='csrf-token']").getAttribute("content")
    const response = await axios.get(`/v1/messages?source=chatroom&page=${page}`, {
      headers: {
        "X-CSRF-Token": csrf,
      },
    })
    setMessages([...response.data.messages.reverse(), ...messagesRef.current])
    setPagination(response.data.pagination_meta)
    setIsFetching(false)
  }

  return (
    <>
      <Helmet>
        <title>ChatGPT 在线聊天室</title>
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
                        <MessageList
                          messages={messages}
                          fetchMessages={fetchMessages}
                          isFetching={isFetching}
                          openModal={openModal}
                          pagination={pagination}
                          setPrompt={setPrompt}
                          generatingMsgId={generatingMsgId}
                        />
                        {/*<div className="w-full h-2 sm:h-6 flex-shrink-0"></div>*/}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <Notification noticeContent={noticeContent} isShowNotice={isShowNotice} setIsShowNotice={setIsShowNotice} />
        <Footer
          cable={consumer}
          showSignInModal={showSignInModal}
          isGenerating={isGenerating}
          setIsGenerating={setIsGenerating}
          showNotice={showNotice}
          subscribers={subscribers}
          content={prompt}
          setContent={setPrompt}
        />
      </div>
      <ClearConversationModal isOpen={isOpenClearModal} closeModal={closeModal} />
    </>
  )
}

export default ChatRoom
