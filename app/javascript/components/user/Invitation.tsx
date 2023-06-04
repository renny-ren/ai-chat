import React, { useState, useEffect, useRef } from "react"
import currentUser from "stores/current_user_store"
import { Descriptions, Badge, Table, message } from "antd"
import Background from "components/common/Background"
import { copy } from "shared/utils/copy_text"
import { CDN_HOST } from "shared/constants"
import { QRCode } from "react-qrcode-logo"
import * as UserApi from "shared/api/user"

interface InvitationProps {}

const Invitation: React.FC<InvitationProps> = ({}) => {
  const qrCodeRef = useRef(null)
  const [referrals, setReferrals] = useState([])

  useEffect(() => {
    if (currentUser.isSignedIn()) {
      fetchReferrals()
    } else {
      window.location.href = "/"
    }
  }, [])

  const fetchReferrals = async () => {
    const res = await UserApi.fetchReferrals(currentUser.id())
    const data = await res.json
    setReferrals(data.referrals)
  }

  const generateInvitationLink = () => {
    return window.location.origin + `/i/${getInViteCode()}`
  }

  const getInViteCode = () => {
    const userId = currentUser.id()
    return userId < 100000 ? userId + 606060 : userId
  }

  const onCopy = (content) => {
    copy(content)
    message.success("复制成功")
  }

  const downloadQRCode = () => {
    const canvas: any = qrCodeRef.current.querySelector("canvas")
    if (canvas) {
      const pngUrl = canvas.toDataURL("image/png")
      let a = document.createElement("a")
      a.href = pngUrl
      a.download = `邀请二维码 - ${currentUser.nickname()}.png`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
    }
  }

  const columns = [
    {
      title: "昵称",
      dataIndex: "nickname",
      key: "nickname",
      render: (text) => <a>{text}</a>,
    },
    {
      title: "注册时间",
      dataIndex: "created_at",
      key: "created_at",
    },
    {
      title: "状态",
      key: "status",
      render: (item) => (
        <div>
          <Badge className="mr-1" status={item.status === "paid" ? "success" : "processing"} />
          {item.status_name}
        </div>
      ),
    },
  ]

  return (
    <>
      <div className="relative px-4 pt-14 sm:px-6 lg:px-8">
        <main className="py-12 mx-auto max-w-2xl pb-16 lg:max-w-5xl">
          <Background />
          <div>
            <article className="prose dark:prose-invert">
              <Descriptions bordered layout="vertical" title={<h2>邀请返利</h2>}>
                <Descriptions.Item label="我的邀请码">
                  {getInViteCode()}
                  <button
                    onClick={() => onCopy(getInViteCode())}
                    className="outline-none inline-flex ml-2 px-2 py-1 text-xs text-white bg-emerald-500 transition-colors duration-300 transform border border-transparent rounded-md dark:text-gray-200 dark:border-gray-200 hover:bg-emerald-600"
                  >
                    <span>复制</span>
                  </button>
                </Descriptions.Item>
                <Descriptions.Item label="邀请链接">
                  {generateInvitationLink()}
                  <button
                    onClick={() => onCopy(generateInvitationLink())}
                    className="outline-none inline-flex ml-2 px-2 py-1 text-xs text-white bg-emerald-500 transition-colors duration-300 transform border border-transparent rounded-md dark:text-gray-200 dark:border-gray-200 hover:bg-emerald-600"
                  >
                    <span>复制</span>
                  </button>
                </Descriptions.Item>
                <Descriptions.Item label="邀请二维码">
                  <div className="flex items-center" ref={qrCodeRef}>
                    <QRCode
                      ecLevel="Q"
                      enableCORS={true}
                      value={generateInvitationLink()}
                      logoImage={currentUser.avatarUrl()}
                      logoWidth={40}
                      logoHeight={40}
                    />

                    <button
                      onClick={downloadQRCode}
                      className="outline-none inline-flex ml-2 px-2 py-1 text-xs text-white bg-emerald-500 transition-colors duration-300 transform border border-transparent rounded-md dark:text-gray-200 dark:border-gray-200 hover:bg-emerald-600"
                      // className="outline-none inline-flex ml-2 px-2 py-1 text-xs text-emerald-400 transition-colors duration-300 transform border rounded-md dark:text-gray-200 dark:border-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      <span>下载二维码</span>
                    </button>
                  </div>
                </Descriptions.Item>
              </Descriptions>
              <div className="my-16 xl:max-w-none">
                <div className="not-prose grid grid-cols-1 gap-x-6 gap-y-10 mt-4 dark:border-white/5 sm:grid-cols-2 xl:max-w-none xl:grid-cols-3">
                  <div className="flex flex-row-reverse gap-6">
                    <div className="flex-auto">
                      <h3 className="text-sm font-semibold text-zinc-900 dark:text-white">发送邀请</h3>
                      <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
                        分享邀请链接或让新用户注册时填写自己的邀请码
                      </p>
                      <p className="mt-4">
                        <img className="h-12 w-12" />
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-row-reverse gap-6">
                    <div className="flex-auto">
                      <h3 className="text-sm font-semibold text-zinc-900 dark:text-white">注册成功</h3>
                      <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
                        通过你的邀请码注册的用户将自动升级为基础版
                      </p>
                      <p className="mt-4">
                        <img className="h-12 w-12" />
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-row-reverse gap-6">
                    <div className="flex-auto">
                      <h3 className="text-sm font-semibold text-zinc-900 dark:text-white">升级成功</h3>
                      <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
                        受邀用户付费后，你当前套餐时间将会自动延长 5 天
                      </p>
                      <p className="mt-4">
                        <img className="h-12 w-12" />
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <h2>我的邀请列表</h2>
              <Table columns={columns} dataSource={referrals} />
            </article>
          </div>
        </main>
      </div>
    </>
  )
}

export default Invitation
