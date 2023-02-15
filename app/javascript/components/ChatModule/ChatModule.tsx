import React, { useState } from "react"
import axios from "axios"
import PromptInput from "./PromptInput"
import { ResponseInterface } from "./ResponseInterface"
import PromptResponseList from "./PromptResponseList"

type ModelValueType = "gpt" | "codex" | "image"
const ChatModule = () => {
  const [responseList, setResponseList] = useState<ResponseInterface[]>([])
  const [prompt, setPrompt] = useState<string>("")
  const [promptToRetry, setPromptToRetry] = useState<string | null>(null)
  const [uniqueIdToRetry, setUniqueIdToRetry] = useState<string | null>(null)
  const [modelValue, setModelValue] = useState<ModelValueType>("gpt")
  const [isLoading, setIsLoading] = useState(false)
  let loadInterval: number | undefined

  const generateUniqueId = () => {
    const timestamp = Date.now()
    const randomNumber = Math.random()
    const hexadecimalString = randomNumber.toString(16)

    return `id-${timestamp}-${hexadecimalString}`
  }

  const htmlToText = (html: string) => {
    const temp = document.createElement("div")
    temp.innerHTML = html
    return temp.textContent
  }

  const delay = (ms: number) => {
    return new Promise((resolve) => setTimeout(resolve, ms))
  }

  const addLoader = (uid: string) => {
    const element = document.getElementById(uid) as HTMLElement
    element.textContent = ""

    // @ts-ignore
    loadInterval = setInterval(() => {
      // Update the text content of the loading indicator
      element.textContent += "."

      // If the loading indicator has reached three dots, reset it
      if (element.textContent === "....") {
        element.textContent = ""
      }
    }, 300)
  }

  const addResponse = (selfFlag: boolean, response?: string) => {
    const uid = generateUniqueId()
    setResponseList((prevResponses) => [
      ...prevResponses,
      {
        id: uid,
        response,
        selfFlag,
      },
    ])
    console.log("list", responseList)
    return uid
  }

  const updateResponse = (uid: string, updatedObject: Record<string, unknown>) => {
    setResponseList((prevResponses) => {
      const updatedList = [...prevResponses]
      const index = prevResponses.findIndex((response) => response.id === uid)
      if (index > -1) {
        updatedList[index] = {
          ...updatedList[index],
          ...updatedObject,
        }
      }
      return updatedList
    })
  }

  const regenerateResponse = async () => {
    await getGPTResult(promptToRetry, uniqueIdToRetry)
  }

  const getGPTResult = async (_promptToRetry?: string | null, _uniqueIdToRetry?: string | null) => {
    // Get the prompt input
    const _prompt = _promptToRetry ?? htmlToText(prompt)

    // If a response is already being generated or the prompt is empty, return
    if (isLoading || !_prompt) {
      return
    }

    setIsLoading(true)
    setPrompt("")

    let uniqueId: string
    if (_uniqueIdToRetry) {
      uniqueId = _uniqueIdToRetry
    } else {
      // Add the self prompt to the response list
      addResponse(true, _prompt)
      uniqueId = addResponse(false)
      await delay(50)
      addLoader(uniqueId)
    }

    try {
      // const csrf = document.querySelector("meta[name='csrf-token']").getAttribute("content")
      // const response = await axios.post(
      //   "/v1/completions",
      //   {
      //     prompt: _prompt,
      //     model: modelValue,
      //   },
      //   {
      //     headers: {
      //       "X-CSRF-Token": csrf,
      //     },
      //   }
      // )
      // console.log(response)
      // if (modelValue === "image") {
      //   // Show image for `Create image` model
      //   updateResponse(uniqueId, {
      //     image: response.data,
      //   })
      // } else {
      //   updateResponse(uniqueId, {
      //     response: response.data.message.trim(),
      //   })
      // }

      updateResponse(uniqueId, { response: "\n\nMy name is Jessie and I am an artificial intelligence." })

      setPromptToRetry(null)
      setUniqueIdToRetry(null)
    } catch (err) {
      setPromptToRetry(_prompt)
      setUniqueIdToRetry(uniqueId)
      updateResponse(uniqueId, {
        // @ts-ignore
        response: `Error: ${err.message}`,
        error: true,
      })
    } finally {
      clearInterval(loadInterval)
      setIsLoading(false)
    }
  }

  return (
    <main className="relative h-full w-full transition-width flex flex-col overflow-hidden items-stretch flex-1">
      <div className="flex-1 overflow-hidden relative">
        <PromptResponseList responseList={responseList} key="response-list" />
      </div>
      <div className=" bottom-0 left-0 w-full dark:border-transparent bg-vert-light-gradient dark:bg-vert-dark-gradient input-area">
        <form className="stretch mx-2 flex flex-row gap-3 pt-2 last:mb-2 md:last:mb-6 lg:mx-auto lg:max-w-3xl lg:pt-6">
          <div className="relative flex h-full flex-1 flex-col">
            <div className="w-full flex gap-2 justify-center mb-3">
              {uniqueIdToRetry && (
                <button onClick={() => regenerateResponse()} className="btn flex justify-center gap-2 btn-neutral">
                  <span role="img" className="semi-icon semi-icon-default">
                    <svg
                      stroke="currentColor"
                      fill="none"
                      stroke-width="1.5"
                      viewBox="0 0 24 24"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      class="h-3 w-3"
                      height="1em"
                      width="1em"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <polyline points="1 4 1 10 7 10"></polyline>
                      <polyline points="23 20 23 14 17 14"></polyline>
                      <path d="M20.49 9A9 9 0 0 0 5.64 5.64L1 10m22 4l-4.64 4.36A9 9 0 0 1 3.51 15"></path>
                    </svg>
                  </span>
                  Regenerate response
                </button>
              )}
            </div>
            <div className="flex flex-col w-full py-2 flex-grow md:py-3 md:pl-4 relative border border-black/10 bg-white dark:border-gray-900/50 dark:text-white dark:bg-gray-700 rounded-md shadow-[0_0_10px_rgba(0,0,0,0.10)] dark:shadow-[0_0_15px_rgba(0,0,0,0.10)]">
              <PromptInput
                prompt={prompt}
                onSubmit={() => getGPTResult()}
                key="prompt-input"
                updatePrompt={(prompt) => setPrompt(prompt)}
              />
              <button
                onClick={() => getGPTResult()}
                className="absolute p-1 rounded-md text-gray-500 bottom-1.5 right-1 md:bottom-2.5 md:right-2 hover:bg-gray-100 dark:hover:text-gray-400 dark:hover:bg-gray-900 disabled:hover:bg-transparent dark:disabled:hover:bg-transparent"
              >
                <svg
                  stroke="currentColor"
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
              </button>
            </div>
          </div>
        </form>
      </div>
    </main>
  )
}

export default ChatModule
