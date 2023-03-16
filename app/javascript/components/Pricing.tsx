import React, { useState } from "react"

interface PricingProps {}

const Pricing: React.FC<PricingProps> = ({}) => {
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

  return (
    <>
      <div className="h-full relative pt-14">
        <main className="h-full pt-4">
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
            <div className="container">
              <div className="flex flex-wrap -mx-4">
                <div className="w-full px-4">
                  <div className="text-center mx-auto mb-8 max-w-[510px]">
                    <span className="font-semibold text-lg text-emerald-500 mb-2 block">价格表</span>
                    <h2 className="font-bold text-3xl sm:text-4xl md:text-[40px] text-dark mb-4">升级服务</h2>
                    <p className="text-base text-body-color">感谢你的支持。祝你每一天都充满欢笑和幸福，生活愉快！</p>
                  </div>
                </div>
              </div>
              <div className="flex flex-wrap justify-center -mx-4 lg:mx-8">
                <div className="w-full md:w-1/2 lg:w-1/3 px-6">
                  <div className="rounded-xl relative z-10 overflow-hidden border border-emerald-500 border-opacity-20 shadow-pricing py-10 px-8 sm:p-12 lg:py-10 lg:px-6 xl:p-12 mb-10">
                    <span className="text-emerald-500 font-semibold text-lg block mb-4">免费版</span>
                    <h2 className="font-bold text-dark mb-2 text-[42px]">¥0</h2>
                    <p className="text-base text-body-color pb-6 mb-6 border-b border-[#F2F2F2]">免费体验使用</p>
                    <div className="mb-7 min-h-[250px]">
                      {renderItem("每日 3 次 AI 对话次数")}
                      {renderItem("最多保存 2 条个人会话记录")}
                      {renderItem("最大提问长度 200 字")}
                      {renderItem("导出个人会话内容", false)}
                      {renderItem("回答图片内容", false)}
                    </div>
                    <a className="w-full block text-base font-semibold text-emerald-500 bg-transparent border border-emerald-500 rounded-md text-center p-4 transition">
                      免费版
                    </a>
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
                      <span className="absolute right-4 top-4 z-[-1]"></span>
                    </div>
                  </div>
                </div>
                <div className="w-full md:w-1/2 lg:w-1/3 px-6">
                  <div className="rounded-xl relative z-10 overflow-hidden border border-emerald-500 border-opacity-20 shadow-pricing py-10 px-8 sm:p-12 lg:py-10 lg:px-6 xl:p-12 mb-10">
                    <span className="text-emerald-500 font-semibold text-lg block mb-4">基础版（限时特惠）</span>
                    <h2 className="font-bold text-dark mb-2 text-[42px]">
                      ¥9
                      <span className="ml-2 text-base text-gray-400 font-medium line-through">¥18</span>
                    </h2>
                    <p className="text-base text-body-color pb-6 mb-6 border-b border-[#F2F2F2]">个人基础使用</p>
                    <div className="mb-7 min-h-[250px]">
                      {renderItem("无限对话次数")}
                      {renderItem("有效期 30 天")}
                      {renderItem("最多保存 20 条个人会话记录")}
                      {renderItem("最大提问长度 500 字")}
                      {renderItem("导出个人会话内容", false)}
                      {renderItem("回答图片内容", false)}
                    </div>
                    <a
                      href="#"
                      className="w-full block text-base font-semibold text-emerald-500 bg-transparent border border-emerald-500 rounded-md text-center p-4 hover:text-white hover:bg-emerald-500 hover:border-emerald-500 transition"
                    >
                      升级到基础版
                    </a>
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
                <div className="w-full md:w-1/2 lg:w-1/3 px-6">
                  <div className="rounded-xl relative z-10 overflow-hidden border border-emerald-500 border-opacity-20 shadow-pricing py-10 px-8 sm:p-12 lg:py-10 lg:px-6 xl:p-12 mb-10">
                    <span className="text-emerald-500 font-semibold text-lg block mb-4">高级版（限时特惠）</span>
                    <h2 className="font-bold text-dark mb-2 text-[42px]">
                      ¥18
                      <span className="ml-2 text-base text-gray-400 font-medium line-through">¥39</span>
                    </h2>
                    <p className="text-base text-body-color pb-6 mb-6 border-b border-[#F2F2F2]">个人畅享使用</p>
                    <div className="mb-7 min-h-[250px]">
                      {renderItem("无限对话次数")}
                      {renderItem("有效期 60 天")}
                      {renderItem("最多保存 50 条个人会话记录")}
                      {renderItem("最大提问长度 1000 字")}
                      {renderItem("导出个人会话内容")}
                      {renderItem("回答图片内容")}
                    </div>
                    <a
                      href="#"
                      className="w-full block text-base font-semibold text-white bg-emerald-500 border border-emerald-500 rounded-md text-center p-4 hover:bg-opacity-90 transition"
                    >
                      升级到高级版
                    </a>
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
              </div>
            </div>
          </section>
        </main>
      </div>
    </>
  )
}

export default Pricing