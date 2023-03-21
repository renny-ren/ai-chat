import React from "react"
import ChatModule from "./ChatModule"

const Chat = ({ setConversations, setIsShowModal }) => {
  return (
    <>
      <div className="h-full relative pt-12 md:pt-14">
        <main className="h-full">
          <div className="absolute inset-0 -z-10 mx-0 max-w-none overflow-hidden">
            <div className="absolute left-1/2 top-0 ml-[-38rem] h-[25rem] w-[81.25rem] dark:[mask-image:linear-gradient(white,transparent)]">
              <div className="absolute inset-0 bg-gradient-to-r from-[#36b49f] to-[#DBFF75] opacity-40 [mask-image:radial-gradient(farthest-side_at_top,white,transparent)] dark:from-[#36b49f]/30 dark:to-[#DBFF75]/30 dark:opacity-100">
                <svg
                  aria-hidden="true"
                  className="absolute inset-x-0 inset-y-[-50%] h-[200%] w-full skew-y-[-18deg] fill-black/40 stroke-black/50 mix-blend-overlay dark:fill-white/2.5 dark:stroke-white/5"
                >
                  <defs>
                    <pattern id=":R11d6:" width="72" height="56" patternUnits="userSpaceOnUse" x="-12" y="4">
                      <path d="M.5 56V.5H72" fill="none"></path>
                    </pattern>
                  </defs>
                  <rect width="100%" height="100%" strokeWidth="0" fill="url(#:R11d6:)"></rect>
                  <svg x="-12" y="4" className="overflow-visible">
                    <rect strokeWidth="0" width="73" height="57" x="288" y="168"></rect>
                    <rect strokeWidth="0" width="73" height="57" x="144" y="56"></rect>
                    <rect strokeWidth="0" width="73" height="57" x="504" y="168"></rect>
                    <rect strokeWidth="0" width="73" height="57" x="720" y="336"></rect>
                  </svg>
                </svg>
              </div>
            </div>
          </div>
          <ChatModule setConversations={setConversations} setIsShowModal={setIsShowModal} />
        </main>
      </div>
    </>
  )
}

export default Chat
