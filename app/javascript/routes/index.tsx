import React from "react"
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import Home from "components/Home"
import Disclaimer from "components/Disclaimer"
import Chatroom from "components/Chatroom"
import Settings from "components/user/Settings"
import ActionCable from "actioncable"

cable = ActionCable.createConsumer("ws://localhost:3000/cable")

export default (props) => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home setIsShowModal={props.setIsShowModal} />} />
        <Route path="/disclaimer" element={<Disclaimer />} />
        <Route path="/chat" element={<Chatroom cable={cable} />} />
        <Route path="/settings" element={<Settings />} />
      </Routes>
    </Router>
  )
}
