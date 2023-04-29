import React, { useState, useEffect, useRef } from "react"
import * as CommonApi from "shared/api/common"
import { LikeOutlined, LikeFilled, StarOutlined, StarFilled } from "@ant-design/icons"
import { message } from "antd"
import currentUser from "stores/current_user_store"

interface ModelActionsProps {
  model: any
  setModels: () => void
  validateLogin: () => boolean
}

const ModelActions: React.FC<ModelActionsProps> = ({ model, setModels, validateLogin }) => {
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
    <>
      <div className="actions text-xs text-slate-500">
        <button
          type="button"
          onClick={() => onToggleLike(model)}
          className="font-medium inline-flex items-center text-sm mr-3 gap-x-1 rounded-full hover:text-slate-700 outline-none"
        >
          {isLiked(model) ? <LikeFilled className="text-emerald-500" /> : <LikeOutlined />}
          <span>{model.likes_count}</span>
        </button>

        <button
          type="button"
          onClick={() => onToggleStar(model)}
          className="font-medium inline-flex items-center text-sm gap-x-1 rounded-full hover:text-slate-700 outline-none"
        >
          {isStarred(model) ? <StarFilled className="text-emerald-500" /> : <StarOutlined />}
          <span>{model.stars_count}</span>
        </button>
      </div>
    </>
  )
}

export default ModelActions
