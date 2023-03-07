import React, { useEffect } from "react"
import currentUser from "stores/current_user_store"
import hljs from "highlight.js"
// import ReactMarkdown from "react-markdown"
// import { marked } from "marked"
import Markdown from "marked-react"
import SyntaxHighlighter from "react-syntax-highlighter"
import { github, arduinoLight, atelierSeasideLight } from "react-syntax-highlighter/dist/esm/styles/hljs"
import Avatar from "./Avatar"

const MessageList = ({ messages, openModal }) => {
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
      return ordered ? <ol className="c-ordered-list">{body}</ol> : <ul className="c-list">{body}</ul>
    },
  }

  const isSelf = (message) => {
    if (currentUser.isSignedIn()) {
      return currentUser.id() === message.user_id
    } else {
      return false
    }
  }

  const renderContent = (message) => {
    return isRobot(message) ? (
      <Markdown
        value={`${message.mentioned_users_nickname.map((name) => `@${name}`)} ${message.content}`}
        renderer={renderer}
      />
    ) : (
      <div className="flex items-center">
        {message.mentioned_users_nickname.map((name) => `@${name}`)} {message.content}
      </div>
    )
  }

  const isRobot = (message) => {
    return message.role === "assistant"
  }

  return (
    <>
      {messages.map((message, i) => {
        return isSelf(message) ? (
          <div key={i} className="col-start-3 col-end-13 p-3 rounded-lg">
            <div className="flex items-center justify-start flex-row-reverse">
              <Avatar src={currentUser.avatarUrl()} />
              <div className="relative mr-3 text-sm bg-indigo-100 py-2 px-4 shadow rounded-xl">{renderContent(message)}</div>
            </div>
          </div>
        ) : (
          <div key={i} className="col-start-1 col-end-11 md:col-end-8 p-3 rounded-lg">
            <div className="flex flex-row items-start">
              <Avatar src={message.user_avatar_url} isRobot={isRobot(message)} openModal={openModal} />
              <div
                className={`relative ml-3 text-sm bg-white py-2 px-4 shadow rounded-xl break-words whitespace-pre-line overflow-x-scroll ${
                  message.loading ? "ai-response-loading" : ""
                }`}
              >
                {renderContent(message)}
              </div>
            </div>
          </div>
        )
      })}
    </>
  )
}

export default MessageList
