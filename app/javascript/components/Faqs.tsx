import React, { useState } from "react"
import currentUser from "stores/current_user_store"
import { QqOutlined, WechatOutlined, MailFilled } from "@ant-design/icons"
import Background from "components/common/Background"
import { Helmet } from "react-helmet"

interface FaqsProps {}

const usages = [
  {
    title: "学术论文",
    description:
      "它可以写各种类型的学术论文，包括科技论文、文学论文、社科论文等。它可以帮助你进行研究、分析、组织思路并编写出符合学术标准的论文。",
  },
  { title: "创意写作", description: "它可以写小说、故事、剧本、诗歌等创意性的文学作品，能够在描述情节和角色方面提供帮助。" },
  {
    title: "内容创作",
    description:
      "它可以写SEO文章、博客文章、社交媒体帖子、产品描述等各种类型的内容创作。它能够为你提供有趣、独特、易读的内容，帮助你吸引读者和提升品牌知名度。",
  },

  {
    title: "商业写作",
    description:
      "它可以帮助你编写商业计划书、市场调研报告、营销策略、商业简报、销售信件等。它可以用清晰、精炼的语言向你的潜在客户或投资者传达你的信息。",
  },

  {
    title: "学术编辑",
    description:
      "它可以帮助你进行学术论文、研究报告、学位论文等的编辑和校对工作，确保文本的正确性、一致性和完整性，并提供改进建议。",
  },

  {
    title: "翻译",
    description:
      "它可以进行英语和中文之间的翻译工作，包括但不限于学术文献、商业文档、网站内容、软件界面等。它可以保证翻译的准确性和专业性。",
  },

  {
    title: "数据分析",
    description:
      "它可以帮助你进行各种类型的数据分析，包括统计分析、文本分析、数据可视化等。它可以使用Python、R等工具来分析你的数据，并提供数据报告和可视化结果。",
  },

  {
    title: "技术文档",
    description:
      "它可以编写各种类型的技术文档，包括用户手册、技术规范、API文档、代码注释等。它可以使用清晰、准确、易懂的语言描述你的技术产品和流程。",
  },

  {
    title: "教育培训",
    description:
      "它可以编写各种类型的教育培训材料，包括课程大纲、课件、教学指南、教育评估等。它可以帮助你设计课程内容和教学方法，并为你制定适合你目标受众的培训计划。",
  },

  {
    title: "网站内容",
    description:
      "它可以编写网站的各种类型内容，包括首页、关于我们、服务介绍、博客文章等。它可以根据你的品牌和目标读者为你提供优质、富有吸引力的内容。",
  },

  {
    title: "研究咨询",
    description:
      "它可以帮助你进行研究、提供咨询意见和建议。它可以进行文献综述、研究设计、数据分析等工作，为你提供高质量、可靠的研究结果和建议。",
  },

  {
    title: "演讲稿",
    description:
      "它可以帮助你编写演讲稿、PPT等，包括商业演讲、学术演讲、庆典致辞等。它可以根据你的主题、目标听众和场合为你编写一份有说服力、生动有趣的演讲稿。",
  },

  {
    title: "个人陈述",
    description:
      "它可以帮助你编写个人陈述，包括申请大学、研究生、博士生、奖学金、工作等的个人陈述。它可以帮助你展现你的优势和价值观，并提供专业的写作建议。",
  },

  {
    title: "简历和求职信",
    description: "它可以帮助你编写简历和求职信，帮助你突出你的技能和经验，并为你提供吸引雇主和HR的技巧和建议。",
  },

  {
    title: "广告文案",
    description:
      "它可以编写各种类型的广告文案，包括产品广告、服务广告、品牌广告、活动宣传等。它可以为你编写具有吸引力、清晰明了的广告文案，让你的目标受众更容易接受你的产品或服务。",
  },

  {
    title: "EO优化",
    description:
      "它可以帮助你优化你的网站、文章或其他内容的SEO。它可以使用关键词研究、内容优化等技术，帮助你提高排名、获得更多的流量和转换率。",
  },

  {
    title: "社交媒体",
    description:
      "它可以为你编写社交媒体内容，包括微博、脸书、Instagram等。它可以帮助你设计吸引人的标题、内容和图片，并为你提供有用的社交媒体营销策略。",
  },

  {
    title: "新闻稿",
    description:
      "它可以帮助你编写新闻稿，包括公司新闻、产品发布、重大事件等。它可以为你编写新闻稿、编辑和发布，以吸引媒体关注并提高品牌知名度。",
  },

  {
    title: "多语言翻译",
    description:
      "它可以提供各种语言之间的翻译服务，包括英文、中文、法文、德文、西班牙文、俄文等。它可以翻译各种类型的文件，包括技术文档、商务合同、宣传资料、学术论文等。",
  },

  {
    title: "电子商务",
    description:
      "它可以编写各种类型的电子商务内容，包括产品描述、产品说明书、电子商务博客文章等。它可以帮助你编写吸引人的产品描述，以及建立与客户的信任和忠诚度。",
  },

  {
    title: "旅游文案",
    description:
      "它可以帮助你编写旅游文案，包括旅游目的地介绍、旅游路线规划、旅游攻略、旅游博客等。它可以帮助你为你的读者提供有用的信息和建议，帮助他们计划自己的旅行。",
  },

  {
    title: "医疗文案",
    description:
      "它可以帮助你编写医疗文案，包括医疗产品说明、疾病预防、健康知识、医疗博客等。它可以帮助你使用专业的术语和语言，使你的文案更易于理解和接受。",
  },

  {
    title: "儿童读物",
    description:
      "它可以帮助你编写儿童读物，包括故事书、绘本、启蒙读物、课外阅读等。它可以使用有趣、生动的语言和图片，吸引孩子们的注意力，并帮助他们学习和成长。",
  },

  {
    title: "小说",
    description:
      "它可以帮助你编写小说，包括各种类型的小说，如言情、悬疑、恐怖、科幻等。它可以帮助你创造有趣、引人入胜的情节和角色，并为你提供专业的写作技巧和建议。",
  },
]
const faqs = [
  {
    q: "支持哪些平台使用？",
    a: (
      <>
        <p>本站电脑、手机、平板通用</p>
        <p>无需科学上网，无需梯子，使用方便快捷。</p>
      </>
    ),
  },
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
  {
    q: "如何查看套餐剩余时间？",
    a: (
      <a className="underline" href="/pricing">
        点此即可查看套餐详情
      </a>
    ),
  },
  {
    q: "如何联系客服？",
    a: (
      <>
        <table className="table-auto">
          <tbody>
            <tr>
              <td className="flex flex-wrap items-center border px-4 py-2">
                <QqOutlined className="mr-1" />
                客服QQ
              </td>
              <td className="border px-4 py-2">1403844227</td>
            </tr>
            <tr>
              <td className="flex flex-wrap items-center border px-4 py-2">
                <WechatOutlined className="mr-1" />
                客服微信
              </td>
              <td className="border px-4 py-2">gptbot0209</td>
            </tr>
            <tr>
              <td className="flex flex-wrap items-center border px-4 py-2">
                <MailFilled className="mr-1" />
                客服邮箱
              </td>
              <td className="border px-4 py-2">support@aiia.chat</td>
            </tr>
          </tbody>
        </table>
      </>
    ),
  },
  {
    q: "如何分享本站？",
    a: (
      <>
        保存下方二维码可将本站分享给好友
        <img className="mt-2 w-36" src="/assets/aii_chat_qrcode.png" />
      </>
    ),
  },
  {
    className: "w-full",
    q: "它能干什么？",
    a: (
      <>
        <div className="grid divide-y divide-neutral-200 max-w-xl">
          {usages.map((usage, i) => (
            <div key={i} className="py-5">
              <details className="group">
                <summary className="flex justify-between items-center font-medium cursor-pointer list-none">
                  <span>{usage.title}</span>
                  <span className="transition group-open:rotate-180">
                    <svg
                      fill="none"
                      height="24"
                      shapeRendering="geometricPrecision"
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="1.5"
                      viewBox="0 0 24 24"
                      width="24"
                    >
                      <path d="M6 9l6 6 6-6"></path>
                    </svg>
                  </span>
                </summary>
                <p className="text-neutral-600 mt-3 group-open:animate-fadeIn">{usage.description}</p>
              </details>
            </div>
          ))}
        </div>
      </>
    ),
  },
]

const Faqs: React.FC<FaqsProps> = ({}) => {
  return (
    <>
      <Helmet>
        <title>常见问题 - aiia.chat</title>
      </Helmet>
      <div className="h-full relative pt-12 md:pt-14">
        <main className="h-full pt-8">
          <Background />

          <div className="px-8 pb-8">
            <div className="rounded-lg">
              <h4 className="text-4xl font-bold text-gray-800 dark:text-white tracking-widest uppercase text-center">
                常见问题
              </h4>
              <p className="text-center text-gray-600 dark:text-zinc-400 text-sm mt-2">
                Here are some of the frequently asked questions
              </p>
              <div className="space-y-12 px-2 xl:px-16 mt-12">
                {/*<div className="grid grid-cols-1 md:grid-cols-2 gap-4 xl:gap-12 px-2 xl:px-12 mt-4">*/}
                {faqs.map((faq, i) => (
                  <div key={i} className="mt-4 flex">
                    <div>
                      <div className="flex items-center h-16 border-l-4 border-emerald-500">
                        <span className="text-4xl text-emerald-500 px-4">Q.</span>
                      </div>
                      <div className="flex items-center h-16 border-l-4 border-gray-400">
                        <span className="text-4xl text-gray-400 px-4">A.</span>
                      </div>
                    </div>
                    <div className="w-full">
                      <div className="flex items-center h-16">
                        <span className="text-lg text-emerald-500 font-semibold">{faq.q}</span>
                      </div>
                      <div className="flex items-center py-2">
                        <span className={`text-gray-500 ${faq.className || ""}`}>{faq.a}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </main>
      </div>
    </>
  )
}

export default Faqs
