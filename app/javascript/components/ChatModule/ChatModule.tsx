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
      const csrf = document.querySelector("meta[name='csrf-token']").getAttribute("content")
      const response = await axios.post(
        "/v1/completions",
        {
          prompt: _prompt,
          model: modelValue,
        },
        {
          headers: {
            "X-CSRF-Token": csrf,
          },
        }
      )
      console.log(response)
      if (modelValue === "image") {
        // Show image for `Create image` model
        updateResponse(uniqueId, {
          image: response.data,
        })
      } else {
        updateResponse(uniqueId, {
          response: response.data.message.trim(),
        })
      }

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
    <div className="ChatModule">
      <div id="response-list">
        <PromptResponseList responseList={responseList} key="response-list" />
      </div>
      {uniqueIdToRetry && (
        <div id="regenerate-button-container">
          <button
            id="regenerate-response-button"
            className={isLoading ? "loading" : ""}
            onClick={() => regenerateResponse()}
          >
            Regenerate Response
          </button>
        </div>
      )}
      <div id="model-select-container">
        <label htmlFor="model-select">Select model:</label>
        <select
          id="model-select"
          value={modelValue}
          onChange={(event) => setModelValue(event.target.value as ModelValueType)}
        >
          <option value="gpt">GPT-3 (Understand and generate natural language )</option>
          <option value="codex">Codex (Understand and generate code, including translating natural language to code)</option>
          <option value="image">Create Image (Create AI image using DALL·E models)</option>
        </select>
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
  )
}

export default ChatModule
