import React from "react"
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import Home from "components/Home"
import Disclaimer from "components/Disclaimer"
import Chat from "components/Chat"
import Settings from "components/user/Settings"

export default ({ setIsShowModal, setCustomContent, setConversations }) => {
  return (
    <Router>
      <Routes>
        <Route exact path="/" element={<Home setIsShowModal={setIsShowModal} setCustomContent={setCustomContent} />} />
        <Route path="/disclaimer" element={<Disclaimer />} />
        <Route exact path="/chats/new" element={<Chat setConversations={setConversations} />} />
        <Route path="/chats/:conversationId" element={<Chat />} />
        <Route path="/settings" element={<Settings />} />
      </Routes>
    </Router>
  )
}
