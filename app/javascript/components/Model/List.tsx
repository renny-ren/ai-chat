import React, { useEffect, useState } from "react"
import * as CommonApi from "shared/api/common"
import { message, Empty } from "antd"
import Spinner from "components/common/Spinner"
import ModelActions from "./ModelActions"

interface ListProps {
  validateLogin: () => boolean
  scope?: string
}

const List: React.FC<ListProps> = ({ validateLogin, scope }) => {
  const [models, setModels] = useState([])
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    fetchModels()
  }, [])

  const fetchModels = async () => {
    setIsLoading(true)
    const res = await CommonApi.fetchModels({ scope })
    if (res.ok) {
      const data = await res.json
      setModels(data.models)
    }
    setIsLoading(false)
  }

  return (
    <section className="mt-6 pb-12 lg:pb-[90px] relative z-20">
      <div className="grid grid-cols-12 gap-4">
        {isLoading ? (
          <div className="col-span-12 flex items-center justify-center">
            <Spinner className="w-10 h-10 text-gray-200 animate-spin dark:text-gray-600 fill-green-500" />
          </div>
        ) : (
          <>
            {!models.length ? (
              <div className="col-span-12">
                <Empty description={<div className="text-slate-500">这里空空如也...</div>} />
              </div>
            ) : (
              <>
                {models.map((model, i) => (
                  <div
                    key={i}
                    className="w-full col-span-12 md:col-span-6 lg:col-span-4 rounded shadow-md shadow-gray-200 dark:shadow-gray-900 bg-white dark:bg-gray-800"
                  >
                    <div className="p-5">
                      <div className="flex items-center">
                        <div className="flex items-center truncate">
                          <img
                            className="rounded-full w-6 h-6 mr-2 shadow-md"
                            src={model.avatar_url || gon.gpt_user.avatar_url}
                          />
                          <h5 className="truncate text-slate-900 font-medium text-lg tracking-tight dark:text-white">
                            <a target="_blank">{model.title}</a>
                          </h5>
                        </div>
                        <ModelActions model={model} models={models} setModels={setModels} validateLogin={validateLogin} />
                      </div>
                      <p className="truncate mt-1 text-base text-slate-500 dark:text-slate-400">{model.description}</p>
                      <div className="flex mt-2 justify-between items-start">
                        <dl className="flex items-center">
                          <div className="flex flex-col-reverse">
                            <dd className="text-xs text-slate-500">{model.user_nickname}</dd>
                          </div>
                          <div className="block h-3 w-px mx-2 bg-slate-900/10 dark:bg-slate-600"></div>
                          <div className="flex flex-col-reverse">
                            <dd className="text-xs text-slate-500">创建于 {model.created_at_in_words}</dd>
                          </div>
                        </dl>
                        <a
                          href={`/${model.permalink}`}
                          className="float-right items-center group relative flex justify-center rounded-md border border-transparent bg-emerald-500 py-1 md:py-2 px-2 md:px-4 text-sm font-medium text-white hover:bg-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2"
                        >
                          <span className="absolute inset-y-0 left-0 flex items-center pl-3"></span>
                          进入
                          <svg
                            className="-mr-1 ml-1 h-3 md:h-4 w-3 md:w-4"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              fillRule="evenodd"
                              clipRule="evenodd"
                              d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
                            ></path>
                          </svg>
                        </a>
                      </div>
                    </div>
                  </div>
                ))}
              </>
            )}
          </>
        )}
      </div>
    </section>
  )
}

export default List
