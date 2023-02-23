import React from "react"
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import Home from "components/Home"
import Disclaimer from "components/Disclaimer"
import Chatroom from "components/Chatroom"

export default (
  <Router>
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/disclaimer" element={<Disclaimer />} />
      <Route path="/chat" element={<Chatroom />} />
    </Routes>
  </Router>
)
