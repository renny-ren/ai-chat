import React, { useState, useEffect } from "react"
import currentUser from "stores/current_user_store"
import { Helmet } from "react-helmet"
import Background from "components/common/Background"
import Form from "./Form"

interface EditModelProps {}

const EditModel: React.FC<EditModelProps> = ({}) => {
  return (
    <>
      <Helmet>
        <title>修改模型 - 智言智语</title>
      </Helmet>
      <div className="h-full relative pt-12 md:pt-14">
        <main className="h-full">
          <Background />

          <div className="relative h-full w-full transition-width flex flex-col overflow-y-auto items-stretch justify-center flex-1">
            <div className="flex-1 overflow-y-auto relative c-scrollbar">
              <div className="px-4 md:px-8 container mx-auto max-w-7xl mt-2">
                <div className="flex pb-2 border-b border-gray-300 text-lg font-medium text-gray-900 dark:text-white">
                  修改模型
                </div>
                <Form action="edit" />
              </div>
            </div>
          </div>
        </main>
      </div>
    </>
  )
}

export default EditModel
