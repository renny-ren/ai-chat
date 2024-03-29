import React, { useState } from "react"
import Footer from "./Footer"
import Generation from "./Generation"
import Library from "./Library"
import Background from "components/common/Background"
import { Helmet } from "react-helmet"

interface ImagesProps {}

const Images: React.FC<ImagesProps> = ({}) => {
  const [images, setImages] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [currentTab, setCurrentTab] = useState("generation")
  const [size, setSize] = useState("256")

  return (
    <>
      <Helmet>
        <title>AI 绘画</title>
      </Helmet>
      <div className="h-full relative pt-12 md:pt-14">
        <main className="h-full">
          <Background />

          <div className="relative h-full w-full transition-width flex flex-col overflow-y-auto items-stretch justify-center flex-1 pb-[5.5rem]">
            <div className="flex-1 overflow-y-auto relative c-scrollbar">
              <div className="container mx-auto max-w-4xl mt-8">
                <ul className="flex border-b border-gray-300 text-sm font-medium text-gray-600 dark:text-gray-400 mt-3 px-6 md:px-0">
                  <li
                    className={`cursor-pointer mr-8 hover:text-gray-900 dark:hover:text-white ${
                      currentTab === "generation" ? "text-gray-900 dark:text-white border-b-2 dark:border-white" : ""
                    } border-gray-800`}
                  >
                    <a onClick={() => setCurrentTab("generation")} className="py-4 inline-block">
                      生成图片
                    </a>
                  </li>
                  <li
                    className={`cursor-pointer mr-8 hover:text-gray-900 dark:hover:text-white ${
                      currentTab === "library" ? "text-gray-900 dark:text-white border-b-2 dark:border-white" : ""
                    } border-gray-800`}
                  >
                    <a onClick={() => setCurrentTab("library")} className="py-4 inline-block">
                      我的图片
                    </a>
                  </li>
                </ul>
              </div>
              {currentTab === "generation" && <Generation images={images} isLoading={isLoading} size={size} />}
              {currentTab === "library" && <Library />}
            </div>
          </div>

          <Footer
            setImages={setImages}
            isLoading={isLoading}
            setIsLoading={setIsLoading}
            size={size}
            setSize={setSize}
            setCurrentTab={setCurrentTab}
          />
        </main>
      </div>
    </>
  )
}

export default Images
