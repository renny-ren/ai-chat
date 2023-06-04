import React, { useState, useEffect, useRef } from "react"
import currentUser from "stores/current_user_store"
import { Descriptions, message } from "antd"
import Background from "components/common/Background"
import { copy } from "shared/utils/copy_text"
import { CDN_HOST } from "shared/constants"
import { QRCode } from "react-qrcode-logo"

interface InvitationProps {}

const Invitation: React.FC<InvitationProps> = ({}) => {
  const qrCodeRef = useRef(null)

  useEffect(() => {
    if (!currentUser.isSignedIn()) {
      window.location.href = "/"
    }
  }, [])

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

  return (
    <>
      <div className="relative px-4 pt-14 sm:px-6 lg:px-8">
        <main className="py-12 mx-auto max-w-2xl space-y-10 pb-16 lg:max-w-5xl">
          <Background />
          <div className="min-h-screen pb-24">
            <article className="prose dark:prose-invert">
              <Descriptions bordered layout="vertical" title="邀请返利">
                <Descriptions.Item label="我的邀请码">
                  {getInViteCode()}
                  <button
                    onClick={() => onCopy(getInViteCode())}
                    className="outline-none inline-flex ml-2 px-2 py-1 text-xs text-gray-600 transition-colors duration-300 transform border rounded-md dark:text-gray-200 dark:border-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    <span>复制</span>
                  </button>
                </Descriptions.Item>
                <Descriptions.Item label="邀请链接">
                  {generateInvitationLink()}
                  <button
                    onClick={() => onCopy(generateInvitationLink())}
                    className="outline-none inline-flex ml-2 px-2 py-1 text-xs text-gray-600 transition-colors duration-300 transform border rounded-md dark:text-gray-200 dark:border-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    <span>复制</span>
                  </button>
                </Descriptions.Item>
                <Descriptions.Item label="邀请二维码">
                  <div ref={qrCodeRef}>
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
                      className="outline-none inline-flex ml-2 px-2 py-1 text-xs text-gray-600 transition-colors duration-300 transform border rounded-md dark:text-gray-200 dark:border-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      <span>下载二维码</span>
                    </button>
                  </div>
                </Descriptions.Item>
              </Descriptions>
              <div className="my-16 xl:max-w-none">
                <h2 className="scroll-mt-24">
                  <a className="group text-inherit no-underline hover:text-inherit" href="/sdks#official-libraries">
                    <div className="absolute ml-[calc(-1*var(--width))] mt-1 hidden w-[var(--width)] opacity-0 transition [--width:calc(2.625rem+0.5px+50%-min(50%,calc(theme(maxWidth.lg)+theme(spacing.8))))] group-hover:opacity-100 group-focus:opacity-100 md:block lg:z-50 2xl:[--width:theme(spacing.10)]">
                      <div className="group/anchor block h-5 w-5 rounded-lg bg-zinc-50 ring-1 ring-inset ring-zinc-300 transition hover:ring-zinc-500 dark:bg-zinc-800 dark:ring-zinc-700 dark:hover:bg-zinc-700 dark:hover:ring-zinc-600">
                        <svg
                          viewBox="0 0 20 20"
                          fill="none"
                          strokeLinecap="round"
                          aria-hidden="true"
                          className="h-5 w-5 stroke-zinc-500 transition dark:stroke-zinc-400 dark:group-hover/anchor:stroke-white"
                        >
                          <path d="m6.5 11.5-.964-.964a3.535 3.535 0 1 1 5-5l.964.964m2 2 .964.964a3.536 3.536 0 0 1-5 5L8.5 13.5m0-5 3 3"></path>
                        </svg>
                      </div>
                    </div>
                    邀请返利
                  </a>
                </h2>
                <div className="not-prose mt-4 grid grid-cols-1 gap-x-6 gap-y-10 border-t border-zinc-900/5 pt-10 dark:border-white/5 sm:grid-cols-2 xl:max-w-none xl:grid-cols-3">
                  <div className="flex flex-row-reverse gap-6">
                    <div className="flex-auto">
                      <h3 className="text-sm font-semibold text-zinc-900 dark:text-white">
                        分享邀请链接或让新用户填写自己的邀请码
                      </h3>
                      <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">这里是介绍</p>
                      <p className="mt-4">
                        <a
                          className="inline-flex gap-0.5 justify-center overflow-hidden text-sm font-medium transition text-emerald-500 hover:text-emerald-600 dark:text-emerald-400 dark:hover:text-emerald-500"
                          href="/sdks#"
                        >
                          Read more
                          <svg
                            viewBox="0 0 20 20"
                            fill="none"
                            aria-hidden="true"
                            className="mt-0.5 h-5 w-5 relative top-px -mr-1"
                          >
                            <path
                              stroke="currentColor"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="m11.5 6.5 3 3.5m0 0-3 3.5m3-3.5h-9"
                            ></path>
                          </svg>
                        </a>
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-row-reverse gap-6">
                    <div className="flex-auto">
                      <h3 className="text-sm font-semibold text-zinc-900 dark:text-white">注册成功</h3>
                      <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">通过邀请码注册的用户将自动升级为基础版</p>
                      <p className="mt-4">
                        <a
                          className="inline-flex gap-0.5 justify-center overflow-hidden text-sm font-medium transition text-emerald-500 hover:text-emerald-600 dark:text-emerald-400 dark:hover:text-emerald-500"
                          href="/sdks#"
                        >
                          Read more
                          <svg
                            viewBox="0 0 20 20"
                            fill="none"
                            aria-hidden="true"
                            className="mt-0.5 h-5 w-5 relative top-px -mr-1"
                          >
                            <path
                              stroke="currentColor"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="m11.5 6.5 3 3.5m0 0-3 3.5m3-3.5h-9"
                            ></path>
                          </svg>
                        </a>
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-row-reverse gap-6">
                    <div className="flex-auto">
                      <h3 className="text-sm font-semibold text-zinc-900 dark:text-white">升级成功</h3>
                      <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
                        受邀用户付费后，你当前套餐时间将会自动延长5天
                      </p>
                      <p className="mt-4">
                        <a
                          className="inline-flex gap-0.5 justify-center overflow-hidden text-sm font-medium transition text-emerald-500 hover:text-emerald-600 dark:text-emerald-400 dark:hover:text-emerald-500"
                          href="/sdks#"
                        >
                          Read more
                          <svg
                            viewBox="0 0 20 20"
                            fill="none"
                            aria-hidden="true"
                            className="mt-0.5 h-5 w-5 relative top-px -mr-1"
                          >
                            <path
                              stroke="currentColor"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="m11.5 6.5 3 3.5m0 0-3 3.5m3-3.5h-9"
                            ></path>
                          </svg>
                        </a>
                      </p>
                    </div>
                    <img alt="" loading="lazy" width="48" height="48" decoding="async" data-nimg="1" className="h-12 w-12" />
                  </div>
                </div>
              </div>
            </article>
          </div>
        </main>
      </div>
    </>
  )
}

export default Invitation
