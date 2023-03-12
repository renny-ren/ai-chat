import React, { useEffect, useRef, useCallback } from "react"
import ContentEditable from "react-contenteditable"

interface PromptInputProps {
  prompt: string
  setPrompt: (prompt: string) => void
  onSubmit: () => void
}

const PromptInput: React.FC<PromptInputProps> = ({ prompt, setPrompt, onSubmit }) => {
  const checkKeyPress = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Enter") {
        e.preventDefault()
        if (e.ctrlKey || e.shiftKey) {
          document.execCommand("insertHTML", false, "<br/><br/>")
        } else {
          onSubmit()
        }
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    },
    [prompt]
  )

  const contentEditableRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    window.addEventListener("keydown", checkKeyPress)
    return () => {
      window.removeEventListener("keydown", checkKeyPress)
    }
  }, [checkKeyPress])

  return (
    <>
      {/* <ContentEditable
        innerRef={contentEditableRef}
        html={prompt}
        disabled={false}
        id="prompt-input"
        className="prompt-input"
        onChange={(e) => setPrompt(e.target.value)}
      />*/}
      <textarea
        className="m-0 w-full resize-none border-0 bg-transparent p-0 pl-2 pr-7 focus:ring-0 focus-visible:ring-0 dark:bg-transparent md:pl-0"
        tabIndex="0"
        style={{ maxHeight: "200px", height: "24px", overflowY: "hidden" }}
        rows="1"
        placeholder=""
        onChange={(e) => setPrompt(e.target.value)}
        value={prompt}
      ></textarea>
    </>
  )
}

export default PromptInput
