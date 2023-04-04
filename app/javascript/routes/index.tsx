import React from "react"
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import Home from "components/Home"
import Disclaimer from "components/Disclaimer"
import Chat from "components/Chat"
import Settings from "components/user/Settings"
import Pricing from "components/Pricing"
import Faqs from "components/Faqs"
import Images from "components/Images"
import Fortune from "components/Fortune"

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
        <Route path="/pricing" element={<Pricing setIsShowSignInModal={setIsShowModal} />} />
        <Route path="/faqs" element={<Faqs />} />
        <Route path="/images" element={<Images setIsShowSignInModal={setIsShowModal} />} />
        <Route
          path="/fortune"
          element={<Fortune setIsShowSignInModal={setIsShowModal} setConversations={setConversations} />}
        />
      </Routes>
    </Router>
  )
}
