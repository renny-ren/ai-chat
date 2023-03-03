import React, { useState } from "react"
import { LoadingOutlined, PlusOutlined, EditOutlined } from "@ant-design/icons"
import { message, Upload } from "antd"
import type { UploadChangeParam } from "antd/es/upload"
import type { RcFile, UploadFile, UploadProps } from "antd/es/upload/interface"
import currentUser from "stores/current_user_store"

const getBase64 = (img: RcFile, callback: (url: string) => void) => {
  const reader = new FileReader()
  reader.addEventListener("load", () => callback(reader.result as string))
  reader.readAsDataURL(img)
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
  return isJpgOrPng && isLt2M
}

const Avatar: React.FC = () => {
  const [loading, setLoading] = useState(false)
  const [imageUrl, setImageUrl] = useState<string>()

  const handleChange: UploadProps["onChange"] = (info: UploadChangeParam<UploadFile>) => {
    if (info.file.status === "uploading") {
      setLoading(true)
      return
    }
    if (info.file.status === "done") {
      // Get this url from response in real world.
      getBase64(info.file.originFileObj as RcFile, (url) => {
        setLoading(false)
        setImageUrl(url)
      })
    }
  }

  const headers = {
    "X-CSRF-Token": document.querySelector("meta[name='csrf-token']").getAttribute("content"),
  }

  return (
    <>
      <Upload
        name="avatar"
        className="avatar-uploader"
        showUploadList={false}
        action={`/v1/users/${currentUser.id()}`}
        method="PUT"
        headers={headers}
        onChange={handleChange}
      >
        <div className="flex items-center group relative">
          {loading ? (
            <LoadingOutlined />
          ) : (
            <>
              <img
                className="rounded-full w-20 h-20 mt-2 float-left group-hover:brightness-75 shadow-md"
                src={imageUrl || currentUser.avatarUrl()}
              />
              <button
                type="button"
                className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 bg-white rounded-full px-2 py-1"
              >
                <EditOutlined />
              </button>
            </>
          )}
        </div>
      </Upload>
    </>
  )
}

export default Avatar
