import React, { useState } from "react"
import currentUser from "stores/current_user_store"
import { Skeleton } from "antd"
import Footer from "./Footer"
import Background from "components/common/Background"
import { Helmet } from "react-helmet"

interface ImagesProps {
  setIsShowSignInModal: () => void
}

const Images: React.FC<ImagesProps> = ({ setIsShowSignInModal }) => {
  const [images, setImages] = useState([])
  const [isLoading, setIsLoading] = useState(false)

  const defaultImages = [
    {
      src: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1170&q=80",
      prompt: "一只橘猫",
    },
    {
      src: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1171&q=80",
      prompt: "一张海贼王的海报",
    },
    {
      src: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1170&q=80",
      prompt: "一只橘猫",
    },
  ]

  return (
    <>
      <Helmet>
        <title>AI 绘画</title>
      </Helmet>
      <div className="h-full relative pt-12 md:pt-14">
        <main className="h-full">
          <Background />

          <div className="relative h-full w-full transition-width flex flex-col overflow-y-auto items-stretch justify-center flex-1 py-20">
            <div className="flex-1 overflow-y-auto relative">
              {!images.length && (
                <div className="text-center text-gray-600">AI 可以根据你提供的描述生成图片，快来试试吧！</div>
              )}
              <div className="flex flex-wrap items-center justify-center">
                {images.length ? (
                  <>
                    {images.map((image, i) => (
                      <div
                        key={i}
                        className="flex-shrink-0 m-6 relative overflow-hidden max-w-xs my-8 rounded shadow-lg shadow-gray-200 dark:shadow-gray-900 bg-white dark:bg-gray-800 duration-300 hover:-translate-y-1"
                      >
                        {isLoading ? (
                          <Skeleton.Image key={i} active={true} style={{ width: "256px", height: "256px" }} />
                        ) : (
                          <img src={image.url} alt="" style={{ width: "256px", height: "256px" }} />
                        )}
                      </div>
                    ))}
                  </>
                ) : (
                  <>
                    {defaultImages.map((image, i) => (
                      <div
                        key={i}
                        className="flex-shrink-0 m-6 relative overflow-hidden max-w-xs my-8 rounded shadow-lg shadow-gray-200 dark:shadow-gray-900 bg-white dark:bg-gray-800 duration-300 hover:-translate-y-1"
                      >
                        <div>
                          <img src={image.src} />
                        </div>
                        <div className="text-center py-4">
                          <p className="text-base text-gray-400 font-normal">{image.prompt}</p>
                        </div>
                      </div>
                    ))}
                  </>
                )}
              </div>
            </div>
          </div>

          <Footer
            setImages={setImages}
            isLoading={isLoading}
            setIsLoading={setIsLoading}
            setIsShowSignInModal={setIsShowSignInModal}
          />
        </main>
      </div>
    </>
  )
}

export default Images
