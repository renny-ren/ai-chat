import React from "react"
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import Home from "components/Home"
import Disclaimer from "components/Disclaimer"
import Chat from "components/Chat"
import Settings from "components/user/Settings"

export default (props) => {
  return (
    <Router>
      <Routes>
        <Route exact path="/" element={<Home setIsShowModal={props.setIsShowModal} />} />
        <Route path="/disclaimer" element={<Disclaimer />} />
        <Route path="/chat" element={<Chat />} />
        <Route path="/settings" element={<Settings />} />
      </Routes>
    </Router>
  )
}
