import React, { Fragment, useState, useEffect, useContext } from "react"
import ChatModule from "./ChatModule"
import ChatRoom from "./ChatRoom"
import Background from "components/common/Background"
import { AppContext } from "components/AppContext"
import queryString from "query-string"
import currentUser from "stores/current_user_store"

const Home = ({ setCustomContent }) => {
  const inviteCode = queryString.parse(location.search).code
  const { setShowSigninModal } = useContext(AppContext)

  useEffect(() => {
    if (inviteCode && !currentUser.isSignedIn()) setShowSigninModal(true)
  }, [])

  return (
    <>
      {/*  <div style={{ height: "100%" }}>
        <div className="overflow-hidden w-full h-full relative">
          <div className="flex h-full flex-1 flex-col md:pl-[260px]">
            <ChatModule />
          </div>
        </div>
      </div>*/}
      <div className="h-full relative pt-12 md:pt-14">
        <main className="h-full">
          <Background />
          <ChatRoom setCustomContent={setCustomContent} />
          {/*<ChatModule />*/}
        </main>
      </div>
    </>
  )
}

export default Home
