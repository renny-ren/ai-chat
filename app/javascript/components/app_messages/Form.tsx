import React, { useState, useEffect } from "react"
import { Form, Input, Select, Checkbox, Button, message } from "antd"
import { useParams } from "react-router-dom"
import * as CommonApi from "shared/api/common"

const AppMessageForm = ({ action }) => {
  const messageId = useParams().id
  const [form] = Form.useForm()

  useEffect(() => {
    if (action === "edit") {
      fetchAppMessage()
    }
  }, [])

  const onFinish = async (values) => {
    if (action === "new") {
      createAppMessage(values)
    } else {
      updateAppMessage(values)
    }
  }

  const createAppMessage = async (values) => {
    const resp = await CommonApi.createAppMessage(values)
    if (resp.ok) {
      window.location.href = "/app_messages"
      message.success("success!")
    } else {
      message.error("error")
    }
  }

  const updateAppMessage = async (values) => {
    const resp = await CommonApi.updateAppMessage(messageId, values)
    if (resp.ok) {
      window.location.href = "/app_messages"
      message.success("success!")
    } else {
      message.error("error")
    }
  }

  const fetchAppMessage = async () => {
    const resp = await CommonApi.fetchAppMessage(messageId)
    const body = await resp.json
    form.setFieldsValue(body.message)
  }

  return (
    <div className="h-full relative pt-20 p-8">
      <Form
        form={form}
        onFinish={onFinish}
        className="max-w-md mx-auto my-8 bg-white rounded-lg shadow-lg px-8 pt-6 pb-8 mb-4"
      >
        <div className="mb-4">
          <Form.Item label="Title" name="title" rules={[{ required: true, message: "Please enter a title" }]}>
            <Input />
          </Form.Item>
        </div>
        <div className="mb-4">
          <Form.Item
            label="Message Type"
            name="msg_type"
            rules={[{ required: true, message: "Please select a message type" }]}
          >
            <Select>
              <Select.Option value={0}>Product</Select.Option>
              <Select.Option value={1}>Operation</Select.Option>
              <Select.Option value={2}>Other</Select.Option>
            </Select>
          </Form.Item>
        </div>
        <div className="mb-4">
          <Form.Item label="Is Important" name="is_important" valuePropName="checked">
            <Checkbox />
          </Form.Item>
        </div>
        <div className="mb-4">
          <Form.Item label="Body" name="body" rules={[{ required: true, message: "Please enter a message body" }]}>
            <Input.TextArea />
          </Form.Item>
        </div>
        <div className="flex items-center justify-center">
          <Button htmlType="submit" className="bg-emerald-500 mt-4">
            Submit
          </Button>
        </div>
      </Form>
    </div>
  )
}

export default AppMessageForm
