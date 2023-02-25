import React, { useState, useEffect, useRef } from "react"

const Chatroom = ({ cable }) => {
  const messagesRef = useRef()
  const [messages, setMessages] = useState([])
  const [content, setContent] = useState("")
  const [userName, setUserName] = useState("")

  messagesRef.current = messages

  useEffect(() => {
    console.log("yyy")

    cable.subscriptions.create("MessagesChannel", {
      received: (data) => {
        console.log("==2received==", data)
        console.log("count:", messagesRef.current)

        // setMessages([...messages, data])
        setMessages([...messagesRef.current, data])
      },
      //   connected: () => {
      //     console.log("Subscription connected!")
      //     // if (cable.subscriptions.subscriptions.length > 0) {
      //     //   cable.subscriptions.subscriptions[0].send({ content: "content" })
      //     // }
      //   },
    })

    // return () => {
    //   channel.unsubscribe()
    // }
  }, [])

  const handleContentChange = (event) => {
    setContent(event.target.value)
  }

  const handleUserNameChange = (event) => {
    setUserName(event.target.value)
  }

  const handleSubmit = (event) => {
    event.preventDefault()

    const message = { content: content, user_name: userName }

    console.log("www", cable.subscriptions)

    cable.subscriptions.subscriptions[0].send({ content: content, user_name: userName })

    setContent("")
    setUserName("")
  }

  return (
    <div>
      <ul>
        {messages.map((message, i) => (
          <li key={i}>
            {message.user_nickname}: {message.content}
          </li>
        ))}
      </ul>
      <form onSubmit={handleSubmit}>
        <input type="text" value={content} onChange={handleContentChange} />
        <input type="text" value={userName} onChange={handleUserNameChange} />
        <button type="submit">Send</button>
      </form>
    </div>
  )
}

export default Chatroom
