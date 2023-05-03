import React, { useState, Fragment } from "react"
import Header from "./Header"

function Layout(props) {
  const { customContent, conversations } = props

  return (
    <Fragment>
      <Header customContent={customContent} conversations={conversations} />
      {props.children}
    </Fragment>
  )
}

export default Layout
