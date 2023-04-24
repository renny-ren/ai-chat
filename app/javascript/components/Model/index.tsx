import React, { useState, useEffect } from "react"
import currentUser from "stores/current_user_store"
import { Badge, message } from "antd"
import { Helmet } from "react-helmet"
import Background from "components/common/Background"

interface ModelProps {
  setIsShowSignInModal: () => void
}

const Model: React.FC<ModelProps> = ({ setIsShowSignInModal }) => {
  const models = [
    {
      title: "一只可爱的橘猫",
      description: "一只可爱的橘猫",
    },
    {
      title: "一副漂亮的风景漫画",
      description: "一副漂亮的风景漫画",
    },
    {
      title: "A beautiful Asian woman stands in the snowfield, clear face",
      description: "A beautiful Asian woman stands in the snowfield, clear face",
    },
  ]
  return (
    <>
      <div className="h-full relative pt-12 md:pt-14">
        <main className="h-full">
          <Background />

          <section className="pb-12 lg:pb-[90px] relative z-20 overflow-hidden">
            <div className="m-4 p-4">
              <div className="grid grid-cols-12 gap-4">
                {models.map((model, i) => (
                  <div
                    key={i}
                    className="w-full col-span-4 rounded shadow-md shadow-gray-200 dark:shadow-gray-900 bg-white dark:bg-gray-800 duration-300 hover:-translate-y-1"
                  >
                    <div className="p-5">
                      <a target="_blank">
                        <h5 className="truncate text-slate-900 font-medium text-lg tracking-tight mb-2 dark:text-white">
                          {model.title}
                        </h5>
                      </a>
                      <p className="truncate text-base text-slate-500 mb-3 dark:text-slate-400">{model.description}</p>
                      <button
                        type="submit"
                        className="float-right group relative flex justify-center rounded-md border border-transparent bg-emerald-500 py-2 px-4 text-sm font-medium text-white hover:bg-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2"
                      >
                        <span className="absolute inset-y-0 left-0 flex items-center pl-3"></span>
                        进入
                        <svg
                          className="-mr-1 ml-2 h-4 w-4"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            fill-rule="evenodd"
                            d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
                            clip-rule="evenodd"
                          ></path>
                        </svg>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </main>
      </div>
    </>
  )
}

export default Model
