import React, { useState, useEffect, useRef } from "react"
import * as CommonApi from "shared/api/common"
import { LikeOutlined, LikeFilled, StarOutlined, StarFilled } from "@ant-design/icons"
import { message } from "antd"
import currentUser from "stores/current_user_store"

interface ModelActionsProps {
  model: any
  models: any
  setModels: () => void
  validateLogin: () => boolean
}

const ModelActions: React.FC<ModelActionsProps> = ({ model, models, setModels, validateLogin }) => {
  const onToggleLike = () => {
    if (validateLogin()) {
      isLiked() ? unlike() : like()
    }
  }
  const onToggleStar = () => {
    if (validateLogin()) {
      isStarred() ? unstar() : star()
    }
  }
  const isLiked = () => {
    return model.like_by_user_ids.includes(currentUser.id())
  }
  const isStarred = () => {
    return model.star_by_user_ids.includes(currentUser.id())
  }
  const like = () => {
    models.map((m) => {
      if (m.permalink === model.permalink) {
        m.likes_count += 1
        m.like_by_user_ids = [...m.like_by_user_ids, currentUser.id()]
      }
    })
    setModels([...models])
    CommonApi.likeModel(model.permalink)
  }
  const unlike = () => {
    models.map((m) => {
      if (m.permalink === model.permalink) {
        m.likes_count -= 1
        m.like_by_user_ids = m.like_by_user_ids.filter((id) => id != currentUser.id())
      }
    })
    setModels([...models])
    CommonApi.unlikeModel(model.permalink)
  }
  const star = () => {
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
  const unstar = () => {
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
      <div className="actions text-xs text-slate-500 flex items-center justify-end space-x-3 flex-1">
        <button
          type="button"
          onClick={onToggleLike}
          className="font-medium inline-flex items-center text-sm gap-x-1 rounded-full hover:text-slate-700 outline-none"
        >
          {isLiked() ? <LikeFilled className="text-emerald-500" /> : <LikeOutlined />}
          <span>{model.likes_count}</span>
        </button>

        <button
          type="button"
          onClick={onToggleStar}
          className="font-medium inline-flex items-center text-sm gap-x-1 rounded-full hover:text-slate-700 outline-none"
        >
          {isStarred() ? <StarFilled className="text-emerald-500" /> : <StarOutlined />}
          <span>{model.stars_count}</span>
        </button>
      </div>
    </>
  )
}

export default ModelActions
