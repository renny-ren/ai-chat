import React, { useState, useEffect, useContext } from "react"
import { AppContext } from "./AppContext"
import PricingModal from "./PricingModal"
import currentUser from "stores/current_user_store"
import axios from "axios"
import { Badge, message } from "antd"
import { Helmet } from "react-helmet"

interface PricingProps {}

const Pricing: React.FC<PricingProps> = ({}) => {
  const [isOpenModal, setIsOpenModal] = useState(false)
  const [planName, setPlanName] = useState("")
  const [subscriptions, setSubscriptions] = useState([])
  const { setShowSigninModal } = useContext(AppContext)

  useEffect(() => {
    if (currentUser.isSignedIn()) {
      fetchSubscriptions()
    }
  }, [])

  const onClickUpgrade = (plan) => {
    if (currentUser.isSignedIn()) {
      openModal(plan)
    } else {
      message.error("请先登录或注册账号")
      setShowSigninModal(true)
    }
  }

  const openModal = (plan) => {
    setIsOpenModal(true)
    setPlanName(plan)
  }

  const fetchSubscriptions = async (page = 1) => {
    const csrf = document.querySelector("meta[name='csrf-token']").getAttribute("content")
    const response = await axios.get(`/v1/membership_subscriptions`, {
      headers: {
        "X-CSRF-Token": csrf,
      },
    })
    setSubscriptions(response.data.subscriptions)
  }

  const renderItem = (content, can = true) => (
    <p className="flex items-center space-x-2 text-base text-body-color leading-loose mb-1">
      {can ? (
        <span className="bg-emerald-500 rounded-full p-1">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="white"
            className="w-2 h-2"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
          </svg>
        </span>
      ) : (
        <span className="bg-gray-300 rounded-full p-1">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
            className="w-2 h-2"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </span>
      )}

      <span>{content}</span>
    </p>
  )

  const renderFreeItem = () => {
    return (
      <>
        <Helmet>
          <title>aii.chat - 升级套餐</title>
        </Helmet>
        <div className="rounded-xl relative z-10 overflow-hidden border border-emerald-500 border-opacity-20 shadow-pricing py-10 px-8 sm:p-12 lg:py-10 lg:px-6 xl:p-12 mb-10">
          <span className="text-emerald-500 font-semibold text-lg block mb-4">免费版</span>
          <h2 className="font-bold text-dark mb-2 text-[42px] dark:text-white">¥0</h2>
          <p className="text-base text-body-color pb-6 mb-6 border-b border-[#F2F2F2]">免费体验使用</p>
          <div className="mb-7 min-h-[220px]">
            {renderItem("每日 2 次 AI 对话")}
            {renderItem("最大提问长度 100 字")}
            {renderItem("导出个人会话", false)}
            {renderItem("AI 绘画", false)}
          </div>
          <a className="w-full block text-base font-semibold text-emerald-500 bg-transparent border border-emerald-500 rounded-md text-center p-3 transition">
            {currentUser.membership() === "free" ? "当前版本" : "免费版"}
          </a>
          <div>
            <span className="absolute right-0 top-7 z-[-1]">
              <svg width="77" height="172" viewBox="0 0 77 172" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="86" cy="86" r="86" fill="url(#paint0_linear)" />
                <defs>
                  <linearGradient id="paint0_linear" x1="86" y1="0" x2="86" y2="172" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#3056D3" stopOpacity="0.09" />
                    <stop offset="1" stopColor="#C4C4C4" stopOpacity="0" />
                  </linearGradient>
                </defs>
              </svg>
            </span>
            <span className="absolute right-4 top-4 z-[-1]"></span>
          </div>
        </div>
      </>
    )
  }

  return (
    <>
      <div className="h-full relative pt-12 md:pt-14">
        <main className="h-full">
          <div className="absolute inset-0 -z-10 mx-0 max-w-none overflow-hidden">
            <div className="absolute left-1/2 top-0 ml-[-38rem] h-[25rem] w-[81.25rem] dark:[mask-image:linear-gradient(white,transparent)]">
              <div className="absolute inset-0 bg-gradient-to-r from-[#36b49f] to-[#DBFF75] opacity-40 [mask-image:radial-gradient(farthest-side_at_top,white,transparent)] dark:from-[#36b49f]/30 dark:to-[#DBFF75]/30 dark:opacity-100">
                <svg
                  aria-hidden="true"
                  className="absolute inset-x-0 inset-y-[-50%] h-[200%] w-full skew-y-[-18deg] fill-black/40 stroke-black/50 mix-blend-overlay dark:fill-white/2.5 dark:stroke-white/5"
                >
                  <defs>
                    <pattern id=":R11d6:" width="72" height="56" patternUnits="userSpaceOnUse" x="-12" y="4">
                      <path d="M.5 56V.5H72" fill="none"></path>
                    </pattern>
                  </defs>
                  <rect width="100%" height="100%" strokeWidth="0" fill="url(#:R11d6:)"></rect>
                  <svg x="-12" y="4" className="overflow-visible">
                    <rect strokeWidth="0" width="73" height="57" x="288" y="168"></rect>
                    <rect strokeWidth="0" width="73" height="57" x="144" y="56"></rect>
                    <rect strokeWidth="0" width="73" height="57" x="504" y="168"></rect>
                    <rect strokeWidth="0" width="73" height="57" x="720" y="336"></rect>
                  </svg>
                </svg>
              </div>
            </div>
          </div>

          <section className="pb-12 lg:pb-[90px] relative z-20 overflow-hidden">
            <div className="px-4">
              {!!subscriptions.length && (
                <div className="md:mx-14 border border-emerald-500 border-opacity-20 bg-white dark:bg-transparent shadow-sm rounded-sm border border-gray-200">
                  <header className="px-5 py-4 border-b border-gray-100">
                    <h2 className="font-semibold text-gray-700 dark:text-white">当前套餐</h2>
                  </header>
                  <div className="p-3">
                    <div className="overflow-x-auto">
                      <table className="table-auto w-full">
                        <thead className="text-xs font-semibold uppercase text-gray-400 bg-gray-50 dark:bg-transparent">
                          <tr>
                            <th className="p-2 whitespace-nowrap">
                              <div className="font-semibold text-left">版本</div>
                            </th>
                            <th className="p-2 whitespace-nowrap">
                              <div className="font-semibold text-left">状态</div>
                            </th>
                            <th className="p-2 whitespace-nowrap">
                              <div className="font-semibold text-left">剩余时间</div>
                            </th>
                            <th className="p-2 whitespace-nowrap">
                              <div className="font-semibold text-left">开始日期</div>
                            </th>
                            <th className="p-2 whitespace-nowrap">
                              <div className="font-semibold text-left">结束日期</div>
                            </th>
                          </tr>
                        </thead>
                        <tbody className="text-sm text-zinc-600 dark:text-zinc-400 divide-y divide-gray-100">
                          {subscriptions.map((subscription, i) => (
                            <tr key={i}>
                              <td className="p-2 whitespace-nowrap">
                                <div className="flex items-center">
                                  <div>{subscription.plan_name}</div>
                                </div>
                              </td>
                              <td className="p-2 whitespace-nowrap">
                                <div>
                                  <Badge
                                    className="mr-1"
                                    status={subscription.status === "active" ? "success" : "default"}
                                  />
                                  {subscription.status_name}
                                </div>
                              </td>
                              <td className="p-2 whitespace-nowrap">
                                <div>{`${subscription.left_days < 0 ? "-" : `${subscription.left_days} 天`}`}</div>
                              </td>
                              <td className="p-2 whitespace-nowrap">
                                <div>{subscription.start_at}</div>
                              </td>
                              <td className="p-2 whitespace-nowrap">
                                <div>{subscription.end_at}</div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}
              <div className="flex flex-wrap mt-4 -mx-4">
                <div className="w-full px-4">
                  <div className="text-center mx-auto mb-8 max-w-[510px]">
                    <span className="font-semibold text-lg text-emerald-500 mb-2 block">价格表</span>
                    <h2 className="font-bold text-3xl sm:text-4xl md:text-[40px] text-dark dark:text-white mb-4">
                      升级套餐
                    </h2>
                    <p className="text-base text-body-color">感谢你的支持</p>
                    <p className="text-base text-body-color">祝你每一天都充满欢笑和幸福，生活愉快！</p>
                  </div>
                </div>
              </div>
              <div className="flex flex-wrap justify-center -mx-4 lg:mx-8">
                <div className="w-full sm:w-1/2 md:hidden 2xl:block 2xl:w-1/4 px-6">{renderFreeItem()}</div>
                <div className="w-full sm:w-1/2 md:w-1/3 2xl:w-1/4 px-6">
                  <div className="rounded-xl relative z-10 overflow-hidden border border-emerald-500 border-opacity-20 shadow-pricing py-10 px-8 sm:p-12 lg:py-10 lg:px-6 xl:p-12 mb-10">
                    <span className="text-emerald-500 font-semibold text-lg block mb-4">基础版</span>
                    <h2 className="font-bold text-dark mb-2 text-[42px] dark:text-white">
                      ¥9
                      <span className="ml-2 text-base text-gray-400 font-medium line-through">¥18</span>
                    </h2>
                    <p className="text-base text-body-color pb-6 mb-6 border-b border-[#F2F2F2]">个人基础使用</p>
                    <div className="mb-7 min-h-[220px]">
                      {renderItem("每日 10 次 AI 对话")}
                      {renderItem("有效期 15 天")}
                      {renderItem("最大提问长度 300 字")}
                      {renderItem("导出个人会话", false)}
                      {renderItem("AI 绘画", false)}
                    </div>
                    <button
                      onClick={() => onClickUpgrade("basic")}
                      // className="w-full block text-base font-semibold text-emerald-500 bg-transparent border border-emerald-500 rounded-md text-center p-3 hover:text-white hover:bg-emerald-500 hover:border-emerald-500 transition"
                      className="w-full block text-base font-semibold text-white bg-emerald-500 border border-emerald-500 rounded-md text-center p-3 hover:bg-opacity-90 transition"
                    >
                      升级到基础版
                    </button>
                    <div>
                      <span className="absolute right-0 top-7 z-[-1]">
                        <svg width="77" height="172" viewBox="0 0 77 172" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <circle cx="86" cy="86" r="86" fill="url(#paint0_linear)" />
                          <defs>
                            <linearGradient
                              id="paint0_linear"
                              x1="86"
                              y1="0"
                              x2="86"
                              y2="172"
                              gradientUnits="userSpaceOnUse"
                            >
                              <stop stopColor="#3056D3" stopOpacity="0.09" />
                              <stop offset="1" stopColor="#C4C4C4" stopOpacity="0" />
                            </linearGradient>
                          </defs>
                        </svg>
                      </span>
                      <span className="absolute right-4 top-4 z-[-1]">{/*svg*/}</span>
                    </div>
                  </div>
                </div>
                <div className="w-full sm:w-1/2 md:w-1/3 2xl:w-1/4 px-6">
                  <div className="rounded-xl relative z-10 overflow-hidden border border-emerald-500 border-opacity-20 shadow-pricing py-10 px-8 sm:p-12 lg:py-10 lg:px-6 xl:p-12 mb-10">
                    <span className="text-emerald-500 font-semibold text-lg block mb-4">标准版</span>
                    <h2 className="font-bold text-dark mb-2 text-[42px] dark:text-white">
                      ¥19
                      <span className="ml-2 text-base text-gray-400 font-medium line-through">¥36</span>
                    </h2>
                    <p className="text-base text-body-color pb-6 mb-6 border-b border-[#F2F2F2]">个人日常使用</p>
                    <div className="mb-7 min-h-[220px]">
                      {renderItem("每日 15 次 AI 对话")}
                      {renderItem("有效期 30 天")}
                      {renderItem("最大提问长度 300 字")}
                      {renderItem("导出个人会话", true)}
                      {renderItem("AI 绘画 10 张", true)}
                    </div>
                    <button
                      onClick={() => onClickUpgrade("standard")}
                      // className="w-full block text-base font-semibold text-emerald-500 bg-transparent border border-emerald-500 rounded-md text-center p-3 hover:text-white hover:bg-emerald-500 hover:border-emerald-500 transition"
                      className="w-full block text-base font-semibold text-white bg-emerald-500 border border-emerald-500 rounded-md text-center p-3 hover:bg-opacity-90 transition"
                    >
                      升级到标准版
                    </button>
                    <div>
                      <span className="absolute right-0 top-7 z-[-1]">
                        <svg width="77" height="172" viewBox="0 0 77 172" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <circle cx="86" cy="86" r="86" fill="url(#paint0_linear)" />
                          <defs>
                            <linearGradient
                              id="paint0_linear"
                              x1="86"
                              y1="0"
                              x2="86"
                              y2="172"
                              gradientUnits="userSpaceOnUse"
                            >
                              <stop stopColor="#3056D3" stopOpacity="0.09" />
                              <stop offset="1" stopColor="#C4C4C4" stopOpacity="0" />
                            </linearGradient>
                          </defs>
                        </svg>
                      </span>
                      <span className="absolute right-4 top-4 z-[-1]">{/*svg*/}</span>
                    </div>
                  </div>
                </div>

                <div className="w-full sm:w-1/2 md:w-1/3 2xl:w-1/4 px-6">
                  <div className="rounded-xl relative z-10 overflow-hidden border border-emerald-500 border-opacity-20 shadow-pricing py-10 px-8 sm:p-12 lg:py-10 lg:px-6 xl:p-12 mb-10">
                    <span className="text-emerald-500 font-semibold text-lg block mb-4">高级版（限时特惠）</span>
                    <h2 className="font-bold text-dark mb-2 text-[42px] dark:text-white">
                      ¥28
                      <span className="ml-2 text-base text-gray-400 font-medium line-through">¥69</span>
                    </h2>
                    <p className="text-base text-body-color pb-6 mb-6 border-b border-[#F2F2F2]">个人畅享使用</p>
                    <div className="mb-7 min-h-[220px]">
                      {renderItem("无限对话次数")}
                      {renderItem("有效期 45 天")}
                      {renderItem("最大提问长度 4000 字")}
                      {renderItem("导出个人会话")}
                      {renderItem("AI 绘画 60 张")}
                      {renderItem("新功能免费体验")}
                    </div>
                    <button
                      onClick={() => onClickUpgrade("advanced")}
                      // className="w-full block text-base font-semibold text-emerald-500 bg-transparent border border-emerald-500 rounded-md text-center p-3 hover:text-white hover:bg-emerald-500 hover:border-emerald-500 transition"
                      className="w-full block text-base font-semibold text-white bg-emerald-500 border border-emerald-500 rounded-md text-center p-3 hover:bg-opacity-90 transition"
                    >
                      升级到高级版
                    </button>
                    <div>
                      <span className="absolute right-0 top-7 z-[-1]">
                        <svg width="77" height="172" viewBox="0 0 77 172" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <circle cx="86" cy="86" r="86" fill="url(#paint0_linear)" />
                          <defs>
                            <linearGradient
                              id="paint0_linear"
                              x1="86"
                              y1="0"
                              x2="86"
                              y2="172"
                              gradientUnits="userSpaceOnUse"
                            >
                              <stop stopColor="#3056D3" stopOpacity="0.09" />
                              <stop offset="1" stopColor="#C4C4C4" stopOpacity="0" />
                            </linearGradient>
                          </defs>
                        </svg>
                      </span>
                      <span className="absolute right-4 top-4 z-[-1]">{/*svg*/}</span>
                    </div>
                  </div>
                </div>
                <div className="w-full hidden sm:w-1/2 md:block md:w-1/3 2xl:hidden px-6">{renderFreeItem()}</div>
              </div>
            </div>
          </section>
        </main>
        <PricingModal isOpen={isOpenModal} setIsOpenModal={setIsOpenModal} planName={planName} />
      </div>
    </>
  )
}

export default Pricing
