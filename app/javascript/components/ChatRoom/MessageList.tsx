import React, { useEffect } from "react"
import currentUser from "stores/current_user_store"
import hljs from "highlight.js"
// import ReactMarkdown from "react-markdown"
// import { marked } from "marked"
import Markdown from "marked-react"
import SyntaxHighlighter from "react-syntax-highlighter"
import { github, arduinoLight, atelierSeasideLight } from "react-syntax-highlighter/dist/esm/styles/hljs"

const MessageList = ({ messages }) => {
  const includeCode = (text: string | null | undefined) => {
    const regexp = /^(?:\s{4}|\t).+/gm
    return !!(text?.includes(" = ") || text?.match(regexp))
  }

  const renderer = {
    code(snippet, language) {
      return (
        <SyntaxHighlighter
          children={snippet}
          key={this.elementId}
          language={language}
          style={github}
          className="my-2"
          codeTagProps={{ className: "my-2" }}
        />
      )
    },
    list(body, ordered) {
      console.log("list", body)
      if (ordered) {
        return <ol className="list-decimal">{body}</ol>
      } else {
        return <ul className="c-list">{body}</ul>
      }
    },
  }

  return (
    <>
      {messages.map((message, i) => {
        return message.user_id === currentUser.id() ? (
          <div key={i} className="col-start-6 col-end-13 p-3 rounded-lg">
            <div className="flex items-center justify-start flex-row-reverse">
              <img className="inline-block h-10 w-10 rounded-full ring-2 ring-white" src={currentUser.avatarUrl()} />
              <div className="relative mr-3 text-sm bg-indigo-100 py-2 px-4 shadow rounded-xl">
                <div className="flex items-center">
                  {message.mentioned_users_nickname.map((name) => `@${name}`)} {message.content}
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div key={i} className="col-start-1 col-end-10 md:col-end-8 p-3 rounded-lg">
            <div className="flex flex-row">
              <img className="inline-block h-10 w-10 rounded-full ring-2 ring-white" src={message.user_avatar_url} />
              <div
                className={`relative ml-3 text-sm bg-white py-2 px-4 shadow rounded-xl break-words whitespace-pre-line ${
                  message.loading && "ai-response-loading"
                }`}
              >
                <Markdown
                  value={`${message.mentioned_users_nickname.map((name) => `@${name}`)} ${message.content}`}
                  renderer={renderer}
                />
              </div>
            </div>
          </div>
        )
      })}
    </>
  )
}

export default MessageList
