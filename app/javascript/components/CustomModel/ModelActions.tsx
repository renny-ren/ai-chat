import React, { useState, useEffect, useRef, useContext } from "react"
import { AppContext } from "components/AppContext"
import * as CommonApi from "shared/api/common"
import { LikeOutlined, LikeFilled, StarOutlined, StarFilled, EditOutlined, DeleteOutlined } from "@ant-design/icons"
import { message, Popconfirm } from "antd"
import currentUser from "stores/current_user_store"

interface ModelActionsProps {
  model: any
  setModel: () => void
}

const ModelActions: React.FC<ModelActionsProps> = ({ model, setModel }) => {
  const { setShowSigninModal } = useContext(AppContext)

  const validateLogin = () => {
    if (!currentUser.isSignedIn()) {
      message.info("请先登录后再操作")
      setShowSigninModal(true)
    } else {
      return true
    }
  }

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
    setModel({
      ...model,
      likes_count: (model.likes_count += 1),
      like_by_user_ids: [...model.like_by_user_ids, currentUser.id()],
    })
    CommonApi.likeModel(model.permalink)
  }
  const unlike = () => {
    setModel({
      ...model,
      likes_count: (model.likes_count -= 1),
      like_by_user_ids: model.like_by_user_ids.filter((id) => id != currentUser.id()),
    })
    CommonApi.unlikeModel(model.permalink)
  }
  const star = () => {
    setModel({
      ...model,
      stars_count: (model.stars_count += 1),
      star_by_user_ids: [...model.star_by_user_ids, currentUser.id()],
    })
    CommonApi.starModel(model.permalink)
    message.success("收藏成功")
  }
  const unstar = () => {
    setModel({
      ...model,
      stars_count: (model.stars_count -= 1),
      star_by_user_ids: model.star_by_user_ids.filter((id) => id != currentUser.id()),
    })
    CommonApi.unstarModel(model.permalink)
    message.success("取消收藏成功")
  }

  const canEdit = () => {
    return model.user_id === currentUser.id()
  }

  const onEdit = () => {
    window.location.href = window.location.href + "/edit"
  }

  const onDelete = async () => {
    const resp = await CommonApi.deleteModel(model.permalink)
    if (resp.ok) {
      message.success("删除成功")
      setTimeout(() => {
        window.location.href = "/models/self"
      }, 300)
    }
  }

  return (
    <>
      <div className="actions text-xs text-slate-500">
        {canEdit() && (
          <button
            type="button"
            onClick={() => onEdit()}
            className="font-medium inline-flex items-center text-sm mr-3 gap-x-1 rounded-full hover:text-slate-700 outline-none"
          >
            <EditOutlined />
          </button>
        )}
        {canEdit() && (
          <Popconfirm
            title={`确认要删除 ${model.title} 吗`}
            onConfirm={onDelete}
            placement="bottom"
            okButtonProps={{ type: "default" }}
          >
            <button
              type="button"
              className="font-medium inline-flex items-center text-sm mr-3 gap-x-1 rounded-full hover:text-slate-700 outline-none"
            >
              <DeleteOutlined />
            </button>
          </Popconfirm>
        )}

        <button
          type="button"
          onClick={() => onToggleLike()}
          className="font-medium inline-flex items-center text-sm mr-3 gap-x-1 rounded-full hover:text-slate-700 outline-none"
        >
          {isLiked() ? <LikeFilled className="text-emerald-500" /> : <LikeOutlined />}
          <span>{model.likes_count}</span>
        </button>

        <button
          type="button"
          onClick={() => onToggleStar()}
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
