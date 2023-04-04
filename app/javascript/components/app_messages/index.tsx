import React, { useState, useEffect } from "react"
import { Table, Form, Row, Col, Select, Input, Button, Popconfirm, message } from "antd"
import * as CommonApi from "shared/api/common"

const AppMessageList = (props) => {
  const [data, setData] = useState(props.data)
  const [pagination, setPagination] = useState()
  const [loading, setLoading] = useState(false)
  const [pushing, setPushing] = useState(false)

  const fetchMessages = (params) => {
    setLoading(true)
    CommonApi.fetchAppMessages(params).then((res) => {
      setData(res.messages)
      setPagination(res.pagination_meta)
      setLoading(false)
    })
  }

  useEffect(() => {
    fetchMessages()
  }, [])

  const handleTableChange = (pagination, filters, sorter) => {
    fetchMessages({ page: pagination.current })
  }

  const onClickPush = (id) => {
    setPushing(id)
    CommonApi.pushMessage(id).then((res) => {
      message.success("pushed successfully!")
      window.location.reload()
      setPushing(false)
    })
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
      render: (item) => item.updated_at !== item.created_at && item.updated_at,
    },
    {
      title: "action",
      width: 80,
      render: (item) => (
        <div className="btn-group">
          {item.status !== "published" && (
            <div>
              <Popconfirm title={"sure to push?"} onConfirm={() => onClickPush(item.id)} placement="bottom">
                <Button size="small" loading={pushing === item.id}>
                  push
                </Button>
              </Popconfirm>
              <a href={`/internal_messages/${item.id}/edit`} className="btn btn-sm ml-2">
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
