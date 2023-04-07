import React, { useEffect, useState, useRef } from "react"
import currentUser from "stores/current_user_store"
import { message, Select, Spin } from "antd"
import axios from "axios"
import UpgradeModal from "components/common/UpgradeModal"

interface FooterProps {
  setImages: () => void
  isLoading: boolean
  setIsLoading: () => void
  setIsShowSignInModal: () => void
}

const Footer: React.FC<FooterProps> = ({ setImages, isLoading, setIsLoading, setIsShowSignInModal }) => {
  const inputRef = useRef(null)
  const [prompt, setPrompt] = useState("")
  const [imageCount, setImageCount] = useState(1)
  const [userImageCredit, setUserImageCredit] = useState(0)
  const [isUpgradeOpen, setIsUpgradeOpen] = useState(false)

  useEffect(() => {
    if (currentUser.isSignedIn()) {
      fetchUser()
    }
  }, [])

  const fetchUser = async () => {
    const csrf = document.querySelector("meta[name='csrf-token']").getAttribute("content")
    const response = await axios.get(`/v1/users/${currentUser.id()}`, {
      headers: {
        "X-CSRF-Token": csrf,
      },
    })
    setUserImageCredit(response.data.user.image_count)
  }

  const checkKeyPress = (e) => {
    if (e.key === "Enter") {
      if (e.ctrlKey || e.shiftKey) {
      } else {
        handleSubmit(e)
      }
    }
  }

  const handlePromptChange = (e) => {
    value = e.target.value
    if (value.length > currentUser.plan().max_question_length) {
      return message.error("描述已达最大长度限制")
    }
    setPrompt(value)
    e.target.style.height = "24px"
    e.target.style.height = e.target.scrollHeight + "px"
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!prompt) {
      return
    }
    if (isLoading) {
      return message.info("图片正在生成中，请耐心等待")
    }
    if (userImageCredit - imageCount < 0) {
      setIsUpgradeOpen(true)
      return
    }
    setIsLoading(true)
    // setPrompt("")
    setImages([...Array(imageCount)].map((el, i) => (el = { url: i })))
    inputRef.current.blur()
    generateImage()
  }

  const generateImage = async () => {
    try {
      const response = await axios.post("/v1/images/generations", { prompt: prompt, n: imageCount })
      setImages(response.data.images)
      setUserImageCredit(userImageCredit - imageCount)
    } catch (error) {
      message.error(error.response.data.message)
    } finally {
      setIsLoading(false)
    }
  }

  const getIconStrokeColor = () => {
    if (document.documentElement.classList.contains("dark")) {
      return prompt ? "#cdcdcd" : "currentColor"
    } else {
      return prompt ? "currentColor" : "#cdcdcd"
    }
  }

  return (
    <>
      <div className="absolute bottom-0 left-0 w-full dark:border-transparent bg-vert-light-gradient dark:bg-vert-dark-gradient input-area">
        <form className="stretch mx-2 flex flex-row items-center gap-1 md:gap-2 last:mb-2 md:last:mb-6 lg:mx-auto lg:max-w-3xl">
          {currentUser.isSignedIn() ? (
            <>
              <div className="flex flex-col">
                <Select
                  defaultValue="1"
                  bordered={false}
                  onChange={(value) => setImageCount(value)}
                  options={[
                    { value: 1, label: "1" },
                    { value: 2, label: "2" },
                    { value: 3, label: "3" },
                    { value: 4, label: "4" },
                  ]}
                />
                <div className="text-xs text-gray-400 text-center">图片数</div>
              </div>
              <div className="relative flex h-full flex-1 flex-col">
                <div className="flex flex-col w-full py-2 flex-grow md:py-3 pl-2 md:pl-4 relative border border-black/10 bg-white dark:border-gray-900/50 dark:text-white dark:bg-gray-700 rounded-md shadow-[0_0_10px_rgba(0,0,0,0.10)] dark:shadow-[0_0_15px_rgba(0,0,0,0.10)]">
                  <textarea
                    ref={inputRef}
                    className="user-input overflow-hidden max-h-52 m-0 w-full resize-none border-0 bg-transparent p-0 pr-7 focus:ring-0 focus-visible:ring-0 dark:bg-transparent"
                    value={prompt}
                    onChange={handlePromptChange}
                    style={{ height: "24px" }}
                    onKeyPress={checkKeyPress}
                    placeholder="请输入图片描述"
                  ></textarea>
                  <button
                    onClick={handleSubmit}
                    type="button"
                    className="absolute p-1 rounded-md text-gray-500 right-1 md:right-2 hover:bg-gray-100 dark:hover:text-gray-400 dark:hover:bg-gray-900 disabled:hover:bg-transparent dark:disabled:hover:bg-transparent"
                  >
                    {isLoading ? (
                      <Spin />
                    ) : (
                      <svg
                        stroke={getIconStrokeColor()}
                        fill="none"
                        strokeWidth="2"
                        viewBox="0 0 24 24"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="h-4 w-4 mr-1"
                        height="1em"
                        width="1em"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <line x1="22" y1="2" x2="11" y2="13"></line>
                        <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                      </svg>
                    )}
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div
              onClick={() => setIsShowSignInModal(true)}
              className="cursor-pointer flex flex-col w-full py-2 flex-grow md:py-3 md:pl-2 relative border border-black/10 bg-white dark:border-gray-900/50 dark:text-white dark:bg-gray-700 rounded-md shadow-[0_0_10px_rgba(0,0,0,0.10)] dark:shadow-[0_0_15px_rgba(0,0,0,0.10)]"
            >
              <div className="flex h-6 w-full items-center pl-2 pr-3 text-sm text-zinc-500 transition dark:bg-white/5 dark:text-zinc-400 focus:[&amp;:not(:focus-visible)]:outline-none">
                <svg
                  viewBox="0 0 20 20"
                  aria-hidden="true"
                  className="h-5 w-5 fill-zinc-500/10 stroke-zinc-500 transition-colors duration-300 group-hover:stroke-zinc-900 dark:fill-white/10 dark:stroke-zinc-400 dark:group-hover:fill-emerald-300/10 dark:group-hover:stroke-emerald-400"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M10 16.5c4.142 0 7.5-3.134 7.5-7s-3.358-7-7.5-7c-4.142 0-7.5 3.134-7.5 7 0 1.941.846 3.698 2.214 4.966L3.5 17.5c2.231 0 3.633-.553 4.513-1.248A8.014 8.014 0 0 0 10 16.5Z"
                  ></path>
                  <path fill="none" strokeLinecap="round" strokeLinejoin="round" d="M7.5 8.5h5M8.5 11.5h3"></path>
                </svg>
                <span className="pl-1">登录即可开始使用 AI 绘画</span>
              </div>
            </div>
          )}
        </form>
        <UpgradeModal
          isOpen={isUpgradeOpen}
          closeModal={() => setIsUpgradeOpen(false)}
          title="提示"
          body={"图片生成所需余额不足，请升级套餐"}
        />
        <footer className="px-3 pt-2 pb-2 text-center text-xs text-black/50 dark:text-white/50 md:px-4 md:pt-3">
          <span className="mr-4">{currentUser.isSignedIn() && <span>剩余图片生成数：{userImageCredit}</span>}</span>
        </footer>
      </div>
    </>
  )
}

export default Footer
