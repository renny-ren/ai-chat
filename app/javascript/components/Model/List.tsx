import React, { useEffect, useState } from "react"
import * as CommonApi from "shared/api/common"
import currentUser from "stores/current_user_store"
import { LikeOutlined, LikeFilled, StarOutlined, StarFilled } from "@ant-design/icons"
import { message, Empty } from "antd"
import Spinner from "components/common/Spinner"

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

  const onToggleLike = (model) => {
    if (validateLogin()) {
      isLiked(model) ? unlike(model) : like(model)
    }
  }
  const onToggleStar = (model) => {
    if (validateLogin()) {
      isStarred(model) ? unstar(model) : star(model)
    }
  }
  const isLiked = (model) => {
    return model.like_by_user_ids.includes(currentUser.id())
  }
  const isStarred = (model) => {
    return model.star_by_user_ids.includes(currentUser.id())
  }
  const like = (model) => {
    models.map((m) => {
      if (m.permalink === model.permalink) {
        m.likes_count += 1
        m.like_by_user_ids = [...m.like_by_user_ids, currentUser.id()]
      }
    })
    setModels([...models])
    CommonApi.likeModel(model.permalink)
  }
  const unlike = (model) => {
    models.map((m) => {
      if (m.permalink === model.permalink) {
        m.likes_count -= 1
        m.like_by_user_ids = m.like_by_user_ids.filter((id) => id != currentUser.id())
      }
    })
    setModels([...models])
    CommonApi.unlikeModel(model.permalink)
  }
  const star = (model) => {
    models.map((m) => {
      if (m.permalink === model.permalink) {
        m.stars_count += 1
        m.star_by_user_ids = [...m.star_by_user_ids, currentUser.id()]
      }
    })
    setModels([...models])
    CommonApi.starModel(model.permalink)
    message.success("收藏成功")
  }
  const unstar = (model) => {
    models.map((m) => {
      if (m.permalink === model.permalink) {
        m.stars_count -= 1
        m.star_by_user_ids = m.star_by_user_ids.filter((id) => id != currentUser.id())
      }
    })
    setModels([...models])
    CommonApi.unstarModel(model.permalink)
    message.success("取消收藏成功")
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
                    className="w-full col-span-6 lg:col-span-4 rounded shadow-md shadow-gray-200 dark:shadow-gray-900 bg-white dark:bg-gray-800"
                  >
                    <div className="p-5">
                      <div className="flex justify-between items-center">
                        <a target="_blank">
                          <h5 className="truncate text-slate-900 font-medium text-lg tracking-tight dark:text-white">
                            {model.title}
                          </h5>
                        </a>
                        <div className="actions text-xs text-slate-500">
                          <button
                            type="button"
                            onClick={() => onToggleLike(model)}
                            className="font-medium inline-flex items-center text-sm mr-3 gap-x-1 rounded-full hover:text-slate-600 outline-none"
                          >
                            {isLiked(model) ? <LikeFilled className="text-emerald-500" /> : <LikeOutlined />}
                            <span>{model.likes_count}</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => onToggleStar(model)}
                            className="font-medium inline-flex items-center text-sm gap-x-1 rounded-full hover:text-slate-600 outline-none"
                          >
                            {isStarred(model) ? <StarFilled className="text-emerald-500" /> : <StarOutlined />}
                            <span>{model.stars_count}</span>
                          </button>
                        </div>
                      </div>
                      <p className="truncate mt-1 text-base text-slate-500 dark:text-slate-400">{model.description}</p>
                      <div className="flex mt-2 justify-between items-start">
                        <dl className="flex items-center">
                          <div className="flex flex-col-reverse">
                            <dd className="text-xs text-slate-500">{model.user_nickname}</dd>
                          </div>
                          <div className="block h-3 w-px mx-2 bg-zinc-900/10 dark:bg-white/15"></div>
                          <div className="flex flex-col-reverse">
                            <dd className="text-xs text-slate-500">创建于 {model.created_at_in_words}</dd>
                          </div>
                        </dl>
                        <a
                          href={`/${model.permalink}`}
                          className="float-right items-center group relative flex justify-center rounded-md border border-transparent bg-emerald-500 py-2 px-4 text-sm font-medium text-white hover:bg-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2"
                        >
                          <span className="absolute inset-y-0 left-0 flex items-center pl-3"></span>
                          进入
                          <svg
                            className="-mr-1 ml-1 h-4 w-4"
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
