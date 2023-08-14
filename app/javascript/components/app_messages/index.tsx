import React, { useState, useEffect } from "react"
import { Table, Button, Popconfirm, message } from "antd"
import * as CommonApi from "shared/api/common"

const AppMessageList = (props) => {
  const [data, setData] = useState(props.data)
  const [pagination, setPagination] = useState()
  const [loading, setLoading] = useState(false)
  const [pushing, setPushing] = useState(false)

  const fetchMessages = async () => {
    setLoading(true)
    const res = await CommonApi.fetchAppMessages()
    if (res.ok) {
      const body = await res.json
      setData(body.messages)
      setPagination(body.pagination_meta)
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchMessages()
  }, [])

  const handleTableChange = (pagination, filters, sorter) => {
    fetchMessages()
  }

  const onClickPush = async (id) => {
    setPushing(id)
    const res = await CommonApi.pushMessage(id)
    if (res.ok) {
      message.success("pushed successfully!")
      window.location.reload()
      setPushing(false)
    }
  }

  const columns = [
    {
      title: "标题",
      width: 180,
      dataIndex: "title",
      key: "title",
    },
    {
      title: "类型",
      width: 80,
      dataIndex: "msg_type_name",
      key: "msg_type_name",
    },
    {
      title: "是否重要",
      width: 80,
      key: "is_important",

      render: (record) => (record.is_important ? "yes" : "no"),
    },
    {
      title: "status",
      width: 80,
      dataIndex: "status_name",
      key: "status_name",
    },
    {
      title: "creator",
      width: 80,
      dataIndex: "creator_name",
      key: "creator_name",
    },
    {
      title: "created_at",
      width: 100,
      key: "created_at",
      render: (item) => item.created_at,
    },
    {
      title: "updator",
      width: 80,
      dataIndex: "updater_name",
      key: "updater_name",
    },
    {
      title: "updated_at",
      width: 100,
      key: "updated_at",
      render: (item) => item.updated_at !== item.created_at && item.updated_at,
    },
    {
      title: "action",
      width: 80,
      key: "action",
      render: (item) => (
        <div className="btn-group">
          {item.status !== "published" && (
            <div>
              <Popconfirm
                title={"sure to push?"}
                onConfirm={() => onClickPush(item.id)}
                placement="bottom"
                okButtonProps={{ type: "default" }}
              >
                <Button size="small" loading={pushing === item.id}>
                  push
                </Button>
              </Popconfirm>
              <a href={`/app_messages/${item.id}/edit`} className="btn btn-sm ml-2">
                edit
              </a>
            </div>
          )}
        </div>
      ),
    },
  ]

  return (
    <div className="h-full relative pt-20 p-8">
      <Button onClick={() => (window.location.href = "/app_messages/new")}>new message </Button>
      <Table
        loading={loading}
        rowClassName="msg-item"
        columns={columns}
        dataSource={data}
        scroll={{ x: "max-content" }}
        pagination={{ showSizeChanger: false, ...pagination }}
        onChange={handleTableChange}
      />
    </div>
  )
}

export default AppMessageList
