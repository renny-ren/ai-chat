import React, { useState } from "react"
import { message, Upload, Popover, Modal } from "antd"
import currentUser from "stores/current_user_store"
import axios from "axios"

interface AvatarProps {
  src: string
  isRobot: boolean
}

const Avatar: React.FC<AvatarProps> = ({ src, isRobot }) => {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isPopoverOpen, setIsPopoverOpen] = useState(false)
  const [loading, setLoading] = useState(false)

  const headers = {
    "X-CSRF-Token": document.querySelector("meta[name='csrf-token']").getAttribute("content"),
  }

  const openModal = () => {
    setIsModalOpen(true)
    setIsPopoverOpen(false)
  }

  const clearConversations = async () => {
    try {
      setLoading(true)
      const response = await axios.post("/v1/users/clear_conversations", { headers: headers })
      message.success("清除记忆成功！")
      setIsModalOpen(false)
    } catch (error) {
      message.error(error.response.data.message)
    } finally {
      setLoading(false)
    }
  }

  const renderContent = () => {
    return <a onClick={openModal}>清除记忆</a>
  }

  return (
    <>
      {isRobot ? (
        <>
          <Popover
            placement="bottomLeft"
            open={isPopoverOpen}
            onOpenChange={(open) => setIsPopoverOpen(open)}
            content={renderContent()}
            trigger="click"
            color="#e0e7ff"
          >
            <img className="cursor-pointer inline-block h-10 w-10 rounded-full ring-2 ring-white" src={src} />
          </Popover>
          <Modal
            title="确认要清除记忆吗"
            cancelText="取消"
            okText="确认"
            open={isModalOpen}
            onOk={clearConversations}
            okButtonProps={{ htmlType: "antd" }}
            confirmLoading={loading}
            onCancel={() => setIsModalOpen(false)}
          >
            <p>确认后将清除 AI 机器人最近和你的会话记忆</p>
            <p>你可以和他开始一轮全新的对话</p>
          </Modal>
        </>
      ) : (
        <img className="cursor-pointer inline-block h-10 w-10 rounded-full ring-2 ring-white" src={src} />
      )}
    </>
  )
}

export default Avatar
