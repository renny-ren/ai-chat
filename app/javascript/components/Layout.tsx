import React, { useState, Fragment } from "react"
import Header from "./Header"

function Layout(props) {
  const { setIsShowModal, customContent, conversations } = props

  return (
    <Fragment>
      <Header setIsShowModal={setIsShowModal} customContent={customContent} conversations={conversations} />
      {props.children}
    </Fragment>
  )
}

export default Layout
