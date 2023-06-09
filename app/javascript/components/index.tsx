import React from "react"
import ReactDOM from "react-dom"
import { createRoot } from "react-dom/client"
import App from "./App"

const renderApp = () => {
  const newDiv = document.createElement("div")
  newDiv.classList.add("h-full")
  newDiv.setAttribute("id", "main-container")
  const root = createRoot(document.body.appendChild(newDiv))
  root.render(<App />)
}

const debounce = (func, timeout = 1000) => {
  let timer
  return (...args) => {
    clearTimeout(timer)
    timer = setTimeout(() => {
      func.apply(this, args)
    }, timeout)
  }
}

document.addEventListener("turbo:load", () => {
  const existingDiv = document.getElementById("main-container")
  if (existingDiv) existingDiv.remove()
  renderApp()
})

document.addEventListener(
  "scroll",
  (e) => {
    if (e.target.classList && e.target.classList.contains("on-scrollbar") === false) {
      e.target.classList.add("on-scrollbar")
    }
  },
  true
)
document.addEventListener(
  "scroll",
  debounce((e) => {
    if (e.target.classList) {
      e.target.classList.remove("on-scrollbar")
    }
  }),
  true
)
