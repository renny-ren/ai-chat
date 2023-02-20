import React from "react"
import { createRoot } from "react-dom/client"
import App from "./App"

document.addEventListener("turbo:load", () => {
  const newDiv = document.createElement("div")
  newDiv.classList.add("h-full")
  const root = createRoot(document.body.appendChild(newDiv))
  root.render(<App />)
})
