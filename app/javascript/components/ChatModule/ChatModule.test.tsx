import React from "react"
import { render, screen } from "@testing-library/react"
import ChatModule from "./ChatModule"

test("renders learn react link", () => {
  render(<ChatModule />)
  const linkElement = screen.getByText(/learn react/i)
  expect(linkElement).toBeInTheDocument()
})
