import React, { Fragment } from "react"
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import Layout from "components/Layout"
import Home from "components/Home"
import Disclaimer from "components/Disclaimer"
import Chat from "components/Chat"
import Settings from "components/user/Settings"
import Distribution from "components/user/Distribution"
import Pricing from "components/Pricing"
import Faqs from "components/Faqs"
import Images from "components/Images"
import Fortune from "components/Fortune"
import Developer from "components/Developer"
import Girlfriend from "components/Girlfriend"
import AppMessageList from "components/app_messages"
import AppMessageForm from "components/app_messages/Form"
import Model from "components/Model"
import EditModel from "components/Model/Edit"
import CustomModel from "components/CustomModel"

export default ({ customContent, setCustomContent, conversations }) => {
  return (
    <Router>
      <Layout customContent={customContent} conversations={conversations}>
        <Routes>
          <Route exact path="/" element={<Home setCustomContent={setCustomContent} />} />
          <Route path="/disclaimer" element={<Disclaimer />} />
          <Route exact path="/chats/new" element={<Chat />} />
          <Route path="/chats/:conversationId" element={<Chat />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/distribution" element={<Distribution />} />
          <Route path="/pricing" element={<Pricing />} />
          <Route path="/faqs" element={<Faqs />} />
          <Route path="/images" element={<Images />} />
          <Route path="/fortune" element={<Fortune />} />
          <Route path="/girlfriend" element={<Girlfriend />} />
          <Route path="/developer_assistant" element={<Developer />} />
          <Route path="/app_messages" element={<AppMessageList />} />
          <Route exact path="/app_messages/new" element={<AppMessageForm action="new" />} />
          <Route exact path="/app_messages/:id/edit" element={<AppMessageForm action="edit" />} />
          <Route path="/models" element={<Model />} />
          <Route path="/models/new" element={<Model tab="new" />} />
          <Route path="/models/self" element={<Model tab="self" />} />
          <Route path="/models/starred" element={<Model tab="starred" />} />
          <Route path="/:modelPermalink/edit" element={<EditModel />} />
          <Route path="/:modelPermalink" element={<CustomModel />} />
        </Routes>
      </Layout>
    </Router>
  )
}
