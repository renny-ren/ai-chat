import React, { useState, useEffect, useRef } from "react"
import * as CommonApi from "shared/api/common"
import { LikeOutlined, LikeFilled, StarOutlined, StarFilled } from "@ant-design/icons"
import { message } from "antd"
import currentUser from "stores/current_user_store"

interface ModelActionsProps {
  model: any
  setModel: () => void
  setIsShowSignInModal: () => void
}

const ModelActions: React.FC<ModelActionsProps> = ({ model, setModel, setIsShowSignInModal }) => {
  const validateLogin = () => {
    if (!currentUser.isSignedIn()) {
      message.info("请先登录后再操作")
      setIsShowSignInModal(true)
    } else {
      return true
    }
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
    setModel({
      ...model,
      likes_count: (model.likes_count += 1),
      like_by_user_ids: [...model.like_by_user_ids, currentUser.id()],
    })
    CommonApi.likeModel(model.permalink)
  }
  const unlike = (model) => {
    setModel({
      ...model,
      likes_count: (model.likes_count -= 1),
      like_by_user_ids: model.like_by_user_ids.filter((id) => id != currentUser.id()),
    })
    CommonApi.unlikeModel(model.permalink)
  }
  const star = (model) => {
    setModel({
      ...model,
      stars_count: (model.stars_count += 1),
      star_by_user_ids: [...model.star_by_user_ids, currentUser.id()],
    })
    CommonApi.starModel(model.permalink)
    message.success("收藏成功")
  }
  const unstar = (model) => {
    setModel({
      ...model,
      stars_count: (model.stars_count -= 1),
      star_by_user_ids: model.star_by_user_ids.filter((id) => id != currentUser.id()),
    })
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
