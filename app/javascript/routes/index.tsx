import React from "react"
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import Home from "components/Home"
import Disclaimer from "components/Disclaimer"

export default (
  <Router>
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/disclaimer" element={<Disclaimer />} />
    </Routes>
  </Router>
)
