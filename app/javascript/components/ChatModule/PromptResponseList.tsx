import React, { FC, useEffect, useRef } from "react"
import ReactMarkdown from "react-markdown"
import { ResponseInterface } from "./response-interface"
import hljs from "highlight.js"

interface PromptResponseListProps {
  responseList: ResponseInterface[]
  messagesEndRef: any
}

const PromptResponseList: FC<PromptResponseListProps> = ({ responseList, messagesEndRef }) => {
  const responseListRef = useRef<HTMLDivElement>(null)

  // useEffect(() => {
  //   hljs.highlightAll()
  // })

  // useEffect(() => {
  //   hljs.highlightAll()
  // }, [responseList])

  return (
    <div className="flex flex-col items-center text-sm h-full dark:bg-gray-800 overflow-y-auto">
      {responseList.map((responseData, i) => (
        <div
          className={
            "w-full border-b border-black/10 dark:border-gray-900/50 text-gray-800 dark:text-gray-100 group  " +
            (responseData.selfFlag ? "dark:bg-gray-800" : "bg-gray-50/75 dark:bg-[#444654]")
          }
          key={responseData.id}
        >
          <div className="text-base gap-4 md:gap-6 m-auto md:max-w-2xl lg:max-w-2xl xl:max-w-3xl p-4 md:py-6 flex lg:px-0">
            <div className="w-[30px] h-[30px] flex flex-col relative items-end">
              <img
                className="avatar-image rounded-sm"
                src={responseData.selfFlag ? "/assets/person.png" : "/assets/chatgpt_logo.png"}
              />
            </div>
            <div className="relative flex w-[calc(100%-50px)] flex-col gap-1 md:gap-3 lg:w-[calc(100%-115px)]">
              <div className="min-h-[20px] flex flex-col items-start gap-4 whitespace-pre-wrap">
                <div className={(responseData.error ? "error-response " : "") + "prompt-content"} id={responseData.id}>
                  {responseData.image && <img src={responseData.image} className="ai-image" alt="generated ai" />}
                  {responseData.response && (
                    <ReactMarkdown
                      children={responseData.response ?? ""}
                      components={{
                        code({ className, children }) {
                          return <code className={className}>{children}</code>
                        },
                      }}
                    />
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
      <div ref={messagesEndRef}></div>
      <div className="w-full h-24 flex-shrink-0"></div>
    </div>
  )
}

export default PromptResponseList
