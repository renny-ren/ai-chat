import React, { useState } from "react"
import Routes from "../routes"
import SignInModal from "./user/SignInModal"
import Header from "./Header"

const App = (props) => {
  const [isShowModal, setIsShowModal] = useState(false)
  const [customContent, setCustomContent] = useState()

  return (
    <>
      <div className="h-full lg:ml-64 xl:ml-72">
        <Header setIsShowModal={setIsShowModal} customContent={customContent} />
        <Routes setIsShowModal={setIsShowModal} setCustomContent={setCustomContent} />
        <SignInModal isShow={isShowModal} setOpen={setIsShowModal} />
      </div>
    </>
  )
}
export default App
