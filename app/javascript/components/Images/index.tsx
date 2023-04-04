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

  return (
    <>
      <Helmet>
        <title>AI 绘画</title>
      </Helmet>
      <div className="h-full relative pt-12 md:pt-14">
        <main className="h-full">
          <Background />

          <div className="relative h-full w-full transition-width flex flex-col overflow-y-auto items-stretch flex-1 pb-20">
            <div className="flex-1 overflow-y-auto relative">
              <div className="flex flex-wrap items-center justify-center">
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
