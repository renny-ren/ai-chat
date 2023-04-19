import React, { useEffect, useState } from "react"
import { Skeleton } from "antd"

interface GenerationProps {
  images: any
}

const Generation: React.FC<GenerationProps> = ({ images }) => {
  const defaultImages = [
    {
      className: "py-4 px-2",
      src: "https://aii-chat-assets.oss-cn-chengdu.aliyuncs.com/images/jumao1.png",
      prompt: "一只可爱的橘猫",
    },
    {
      className: "py-4 px-2",
      src: "https://aii-chat-assets.oss-cn-chengdu.aliyuncs.com/images/%E4%B8%80%E5%89%AF%E6%BC%82%E4%BA%AE%E7%9A%84%E9%A3%8E%E6%99%AF%E6%BC%AB%E7%94%BB.png",
      prompt: "一副漂亮的风景漫画",
    },
    {
      className: "py-2 px-2",
      src: "https://aii-chat-assets.oss-cn-chengdu.aliyuncs.com/images/a%20beauty%20Asian%20stand%20in%20the%20snowfield%2C%20clear%20face.png",
      prompt: "A beautiful Asian woman stands in the snowfield, clear face",
    },
  ]

  return (
    <>
      <div className="mt-6 md:mt-10 mb-2 md:mb-4">
        {!images.length && (
          <div className="flex flex-col items-center">
            <ul className="text-gray-600 dark:text-gray-400 text-sm">
              <li>图片基于 DALL·E 模型生成</li>
              <li>精心调整输入文本可以帮助生成更准确和特定的图像</li>
            </ul>
          </div>
        )}
      </div>
      <div className="flex flex-wrap items-center justify-center">
        {images.length ? (
          <>
            {images.map((image, i) => (
              <div
                key={i}
                className="flex-shrink-0 m-6 relative overflow-hidden max-w-[256px] my-8 rounded shadow-lg shadow-gray-200 dark:shadow-gray-900 bg-white dark:bg-gray-800 duration-300 hover:-translate-y-1"
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
                className="flex-shrink-0 m-6 relative overflow-hidden max-w-[256px] my-8 rounded shadow-lg shadow-gray-200 dark:shadow-gray-900 bg-white dark:bg-gray-800 duration-300 hover:-translate-y-1"
              >
                <div>
                  <img src={image.src} />
                </div>
                <div className={`text-center ${image.className}`}>
                  <p className="text-xs text-gray-400 font-normal">{image.prompt}</p>
                </div>
              </div>
            ))}
          </>
        )}
      </div>
    </>
  )
}

export default Generation
