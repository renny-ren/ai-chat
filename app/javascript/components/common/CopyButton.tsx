import React, { useState, useEffect } from "react"
import { message } from "antd"
import { copy } from "components/common/utils/CopyText"

interface CopyButtonProps {
  content: string
  className?: string
}

const CopyButton: React.FC<CopyButtonProps> = ({ content, className = "" }) => {
  const [copied, setCopied] = useState(false)

  const onCopy = () => {
    copy(content)
    message.success("内容已复制")
    setCopied(true)
    setTimeout(() => {
      setCopied(false)
    }, 3000)
  }

  return (
    <>
      <button className={className} onClick={onCopy}>
        <>
          {copied ? (
            <svg className="h-4 w-4" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M887.904 298.208c-12.864-12.064-33.152-11.488-45.216 1.408L415.936 753.984l-233.12-229.696C170.208 511.872 149.952 512 137.536 524.608c-12.416 12.576-12.256 32.864 0.352 45.248l256.48 252.672c0.096 0.096 0.224 0.128 0.32 0.224 0.096 0.096 0.128 0.224 0.224 0.32 2.016 1.92 4.448 3.008 6.784 4.288 1.152 0.672 2.144 1.664 3.36 2.144 3.776 1.472 7.776 2.24 11.744 2.24 4.192 0 8.384-0.832 12.288-2.496 1.312-0.544 2.336-1.664 3.552-2.368 2.4-1.408 4.896-2.592 6.944-4.672 0.096-0.096 0.128-0.256 0.224-0.352 0.064-0.096 0.192-0.128 0.288-0.224l449.184-478.208C901.44 330.592 900.768 310.336 887.904 298.208z"
                fill="#9a9a9a"
              ></path>
            </svg>
          ) : (
            <svg className="h-4 w-4" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M672 832 224 832c-52.928 0-96-43.072-96-96L128 160c0-52.928 43.072-96 96-96l448 0c52.928 0 96 43.072 96 96l0 576C768 788.928 724.928 832 672 832zM224 128C206.368 128 192 142.368 192 160l0 576c0 17.664 14.368 32 32 32l448 0c17.664 0 32-14.336 32-32L704 160c0-17.632-14.336-32-32-32L224 128z"
                fill="#9a9a9a"
              ></path>
              <path
                d="M800 960 320 960c-17.664 0-32-14.304-32-32s14.336-32 32-32l480 0c17.664 0 32-14.336 32-32L832 256c0-17.664 14.304-32 32-32s32 14.336 32 32l0 608C896 916.928 852.928 960 800 960z"
                fill="#9a9a9a"
              ></path>
              <path
                d="M544 320 288 320c-17.664 0-32-14.336-32-32s14.336-32 32-32l256 0c17.696 0 32 14.336 32 32S561.696 320 544 320z"
                fill="#9a9a9a"
              ></path>
              <path
                d="M608 480 288.032 480c-17.664 0-32-14.336-32-32s14.336-32 32-32L608 416c17.696 0 32 14.336 32 32S625.696 480 608 480z"
                fill="#9a9a9a"
              ></path>
              <path
                d="M608 640 288 640c-17.664 0-32-14.304-32-32s14.336-32 32-32l320 0c17.696 0 32 14.304 32 32S625.696 640 608 640z"
                fill="#9a9a9a"
              ></path>
            </svg>
          )}
        </>
      </button>
    </>
  )
}

export default CopyButton
