import React, { useState } from "react"
import currentUser from "stores/current_user_store"

interface FaqsProps {}

const faqs = [
  { q: "支持哪些平台使用？", a: "本站电脑、手机、平板通用，无需科学上网，无需梯子，使用方便快捷。" },
  {
    q: "如何在聊天室中和 AI 交流？",
    a: (
      <span>
        在聊天室中，点击聊天框左边
        <svg
          className="h-5 w-5 relative inline-block"
          viewBox="0 0 1024 1024"
          strokeWidth="2"
          version="1.1"
          xmlns="http://www.w3.org/2000/svg"
          style={{ top: "-2px" }}
        >
          <path
            d="M405.333333 149.333333l67.562667 184.234667h91.776L632.234667 149.333333h64l-67.562667 184.234667h110.229333a64 64 0 0 1 64 64v407.274667a64 64 0 0 1-64 64H285.098667a64 64 0 0 1-64-64v-407.253334a64 64 0 0 1 64-64l123.797333-0.021333L341.333333 149.333333h64z m333.568 248.234667H285.098667v407.274667h453.802666v-407.253334zM192 496.490667v213.333333H128v-213.333333h64z m698.176 0v213.333333h-64v-213.333333h64zM405.333333 519.744a42.666667 42.666667 0 1 1 0 85.333333 42.666667 42.666667 0 0 1 0-85.333333z m213.333334 0a42.666667 42.666667 0 1 1 0 85.333333 42.666667 42.666667 0 0 1 0-85.333333z"
            fill="#cdcdcd"
          ></path>
        </svg>
        机器人按钮即可与 AI 交流
      </span>
    ),
  },
  { q: "为何我感觉 AI 的回答不完整？", a: "每次回答有字数限制，回复「继续」即可继续回答" },
  { q: "AI 使用的是什么版本？", a: "本站基于 OpenAI 官方 gpt-3.5-turbo API 搭建" },
  {
    q: "机器人能记忆上下文吗",
    a: (
      <>
        <p>机器人可记忆你和他之间的最近 20 条对话</p>
        <p>在聊天室中，上下文记忆保存时间 1 天，个人会话中永久保存</p>
      </>
    ),
  },
  { q: "如何查看剩余套餐量？", a: "您可以点击头像，在套餐详情中查看当前套餐的剩余量和有效期。" },
  { q: "如何联系客服？", a: "客服QQ" },
  {
    q: "支付方式有哪些？",
    a: "我们提供多种在线支付方式，包括支付宝、微信等。根据您的个人偏好和实际情况，您可以选择合适的支付方式进行支付。",
  },
  {
    q: "如何分享本站？",
    a: (
      <>
        保存下方二维码可将本站分享给好友
        <img class="w-32" src="/assets/aii_chat_qrcode.png" />
      </>
    ),
  },
]

const Faqs: React.FC<FaqsProps> = ({}) => {
  return (
    <>
      <div className="h-full relative pt-12 md:pt-14">
        <main className="h-full pt-8">
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

          <div className="px-8">
            <div className="rounded-lg">
              <h4 className="text-4xl font-bold text-gray-800 tracking-widest uppercase text-center">常见问题</h4>
              <p className="text-center text-gray-600 text-sm mt-2">Here are some of the frequently asked questions</p>
              <div className="space-y-12 px-2 xl:px-16 mt-12">
                {/*<div className="grid grid-cols-1 md:grid-cols-2 gap-4 xl:gap-12 px-2 xl:px-12 mt-4">*/}
                {faqs.map((faq) => (
                  <div className="mt-4 flex">
                    <div>
                      <div className="flex items-center h-16 border-l-4 border-emerald-500">
                        <span className="text-4xl text-emerald-500 px-4">Q.</span>
                      </div>
                      <div className="flex items-center h-16 border-l-4 border-gray-400">
                        <span className="text-4xl text-gray-400 px-4">A.</span>
                      </div>
                    </div>
                    <div>
                      <div className="flex items-center h-16">
                        <span className="text-lg text-emerald-500 font-semibold">{faq.q}</span>
                      </div>
                      <div className="flex items-center py-2">
                        <span className="text-gray-500">{faq.a}</span>
                      </div>
                    </div>
                  </div>
                ))}

                <div className="mt-4 flex">
                  <div>
                    <div className="flex items-center h-16 border-l-4 border-emerald-500">
                      <span className="text-4xl text-emerald-500 px-4">Q.</span>
                    </div>
                    <div className="flex items-center h-16 border-l-4 border-gray-400">
                      <span className="text-4xl text-gray-400 px-4">A.</span>
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center h-16">
                      <span className="text-lg text-emerald-500 font-bold">Impedit iusto vitae dolorum, nostrum fugit?</span>
                    </div>
                    <div className="flex items-center py-2">
                      <span className="text-gray-500">
                        Lorem ipsum dolor sit amet consectetur adipisicing elit. Quae, dignissimos. Neque eos, dignissimos
                        provident reiciendis debitis repudiandae commodi perferendis et itaque, similique fugiat cumque
                        impedit iusto vitae dolorum. Nostrum, fugit!
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </>
  )
}

export default Faqs
