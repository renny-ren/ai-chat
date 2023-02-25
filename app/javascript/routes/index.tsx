import React from "react"
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import Home from "components/Home"
import Disclaimer from "components/Disclaimer"
import Chatroom from "components/Chatroom"
import ActionCable from "actioncable"

cable = ActionCable.createConsumer("ws://localhost:3000/cable")

export default (
  <Router>
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/disclaimer" element={<Disclaimer />} />
      <Route path="/chat" element={<Chatroom cable={cable} />} />
    </Routes>
  </Router>
)
