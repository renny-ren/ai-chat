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
import Developer from "components/Developer"
import MJPrompt from "components/MJPrompt"
import Girlfriend from "components/Girlfriend"
import AppMessageList from "components/app_messages"
import AppMessageForm from "components/app_messages/Form"

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
        <Route
          path="/girlfriend"
          element={<Girlfriend setIsShowSignInModal={setIsShowModal} setConversations={setConversations} />}
        />
        <Route
          path="/developer_assistant"
          element={<Developer setIsShowSignInModal={setIsShowModal} setConversations={setConversations} />}
        />
        <Route
          path="/mj_prompt"
          element={<MJPrompt setIsShowSignInModal={setIsShowModal} setConversations={setConversations} />}
        />
        <Route path="/app_messages" element={<AppMessageList />} />
        <Route exact path="/app_messages/new" element={<AppMessageForm action="new" />} />
        <Route exact path="/app_messages/:id/edit" element={<AppMessageForm action="edit" />} />
      </Routes>
    </Router>
  )
}
