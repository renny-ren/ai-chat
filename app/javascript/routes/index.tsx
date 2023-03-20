import React from "react"
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import Home from "components/Home"
import Disclaimer from "components/Disclaimer"
import Chat from "components/Chat"
import Settings from "components/user/Settings"
import Pricing from "components/Pricing"
import Faqs from "components/Faqs"

export default ({ setIsShowModal, setCustomContent, setConversations }) => {
  return (
    <Router>
      <Routes>
        <Route exact path="/" element={<Home setIsShowModal={setIsShowModal} setCustomContent={setCustomContent} />} />
        <Route path="/disclaimer" element={<Disclaimer />} />
        <Route
          exact
          path="/chats/new"
          element={<Chat setConversations={setConversations} setIsShowModal={setIsShowModal} />}
        />
        <Route path="/chats/:conversationId" element={<Chat setIsShowModal={setIsShowModal} />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/pricing" element={<Pricing />} />
        <Route path="/faqs" element={<Faqs />} />
      </Routes>
    </Router>
  )
}
