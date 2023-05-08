import React, { useState } from "react"
import ModelActions from "./ModelActions"

interface HeaderProps {
  model: any
  setModel: () => void
  isAddContext: boolean
  handleContextChange: () => void
}

const Header: React.FC<HeaderProps> = ({ model, setModel, isAddContext, handleContextChange }) => {
  return (
    <>
      <div className="py-1 md:py-3 border-b border-gray-300 border-dashed">
        <div className="px-4 sm:px-0">
          <p className="mt-1 max-w-2xl text-sm leading-6 text-gray-600">{model.description}</p>
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
    </>
  )
}

export default Header
