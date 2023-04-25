import React, { useState } from "react"
import { EditOutlined } from "@ant-design/icons"
import { message, Upload } from "antd"
import type { UploadChangeParam } from "antd/es/upload"
import type { RcFile, UploadFile, UploadProps } from "antd/es/upload/interface"
import currentUser from "stores/current_user_store"

const getBase64 = (img: RcFile, callback: (url: string) => void) => {
  const reader = new FileReader()
  reader.addEventListener("load", () => callback(reader.result as string))
  reader.readAsDataURL(img)
}

const Avatar: React.FC = ({ handleAvatarChange }) => {
  const [imageUrl, setImageUrl] = useState<string>()

  const handleChange: UploadProps["onChange"] = (info: UploadChangeParam<UploadFile>) => {
    getBase64(info.file as RcFile, (url) => {
      setImageUrl(url)
    })
  }

  const beforeUpload = (file: RcFile) => {
    const isJpgOrPng = file.type === "image/jpeg" || file.type === "image/png"
    if (!isJpgOrPng) {
      message.error("You can only upload JPG/PNG file!")
    }
    const isLt2M = file.size / 1024 / 1024 < 2
    if (!isLt2M) {
      message.error("Image must smaller than 2MB!")
    }
    if (isJpgOrPng && isLt2M) {
      handleAvatarChange(file)
    }

    return false
  }

  return (
    <>
      <Upload name="avatar" showUploadList={false} beforeUpload={beforeUpload} onChange={handleChange}>
        <div className="flex items-center group/avatar relative">
          <img
            className="rounded-full w-12 h-12 float-left group-hover/avatar:brightness-75 shadow-md"
            src={imageUrl || gon.gpt_user.avatar_url}
          />
          <button
            type="button"
            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 opacity-0 group-hover/avatar:opacity-100 bg-white rounded-full px-2 py-1"
          >
            <EditOutlined />
          </button>
        </div>
      </Upload>
    </>
  )
}

export default Avatar
