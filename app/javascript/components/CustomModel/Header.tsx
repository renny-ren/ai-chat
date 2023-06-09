import React, { useState } from "react"
import ModelActions from "./ModelActions"
import { UpOutlined, DownOutlined } from "@ant-design/icons"

interface HeaderProps {
  model: any
  setModel: () => void
  isAddContext: boolean
  handleContextChange: () => void
}

const Header: React.FC<HeaderProps> = ({ model, setModel, isAddContext, handleContextChange }) => {
  const [isOpen, setIsOpen] = useState(true)

  const toggleMenu = () => {
    setIsOpen(!isOpen)
  }

  return (
    <>
      <div className="group">
        <div
          className={`border-gray-300 overflow-hidden transition-all duration-300 ${
            isOpen ? "max-h-36 shadow-sm pb-2" : "max-h-0"
          }`}
        >
          <div className="px-4 sm:px-0">
            <p className="mt-1 max-w-2xl text-sm leading-6 font-medium text-gray-600">{model.description}</p>

            <div className="flex justify-between items-end">
              <div className="mt-1 max-w-2xl text-xs text-gray-600 flex items-center">
                <span>创建者：</span>
                <img className="inline-block rounded-full mx-1 h-5 w-5" src={model.user_avatar_url} />
                <span>{model.user_nickname}</span>
              </div>

              <ModelActions
                model={model}
                setModel={setModel}
                isAddContext={isAddContext}
                handleContextChange={handleContextChange}
              />
            </div>
          </div>
        </div>

        <div className="flex justify-center">
          {isOpen ? (
            <button className="outline-none fixed -mt-6 opacity-0 group-hover:opacity-100 z-50" onClick={toggleMenu}>
              <UpOutlined className="text-gray-400" />
            </button>
          ) : (
            <button className="outline-none fixed -mt-3 z-20 group-hover:-mt-2 w-[50%]" onClick={toggleMenu}>
              <DownOutlined className="text-gray-300" />
            </button>
          )}
        </div>
      </div>
    </>
  )
}

export default Header
