import React, { useState, useEffect, useContext } from "react"
import { AppContext } from "components/AppContext"
import { useParams } from "react-router-dom"
import BaseSelection from "components/common/BaseSelection"
import currentUser from "stores/current_user_store"
import * as CommonApi from "shared/api/common"
import { message, Tooltip } from "antd"
import { InfoCircleOutlined } from "@ant-design/icons"
import Avatar from "./Avatar"
import VoiceSelection from "./VoiceSelection"
import AudioButton from "./AudioButton"
import Preview from "./Preview"
import pinyin from "tiny-pinyin"
import { modelOptions } from "./constants"

interface ModelFormProps {
  action: string
}

const ModelForm: React.FC<ModelFormProps> = ({ action }) => {
  const [previewStep, setPreviewStep] = useState<string>("list")
  const [avatarUrl, setAvatarUrl] = useState<string>()
  const [permalinkChanged, setPermalinkChanged] = useState<boolean>(false)
  const [formData, setFormData] = useState({
    title: "",
    permalink: "",
    description: "",
    introducton: "",
    system_instruction: "",
    input_placeholder: "",
    voice: "siqi",
    is_public: true,
  })
  const [openaiParams, setOpenaiParams] = useState({
    model: "gpt-4.1",
    max_tokens: 500,
    temperature: 1,
    top_p: 1,
    presence_penalty: 0,
    frequency_penalty: 0,
    stream: true,
  })
  const modelPermalink = useParams().modelPermalink
  const [formErrors, setFormErrors] = useState([])
  const { showSignInModal, setShowSigninModal } = useContext(AppContext)

  useEffect(() => {
    if (!validateLogin()) return
    if (action === "edit") {
      fetchModel()
    }
  }, [])

  const validateLogin = () => {
    if (!currentUser.isSignedIn()) {
      message.info("请先登录后再操作")
      setShowSigninModal(true)
    } else {
      return true
    }
  }

  const fetchModel = async () => {
    const resp = await CommonApi.fetchModel(modelPermalink)
    if (resp.ok) {
      const body = await resp.json
      if (body.model.user_id !== currentUser.id()) {
        window.location.href = "/"
      } else {
        setFormData(body.model)
        setAvatarUrl(body.model.avatar_url)
        setOpenaiParams(JSON.parse(body.model.openai_params))
      }
    }
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value,
    })
    setPreviewStep(name === "introduction" || name === "input_placeholder" ? "show" : "list")
    if (name === "permalink") setPermalinkChanged(true)
  }

  const handleOpenaiParamsChange = (e, type) => {
    const { name, value } = e.target
    setOpenaiParams({
      ...openaiParams,
      [name]: type === "number" && !isNaN(parseFloat(value)) ? parseFloat(value) : value,
    })
  }

  const handleTitleChange = (e) => {
    const { value } = e.target
    permalink = permalinkChanged ? formData.permalink : pinyin.convertToPinyin(value, "", true).replaceAll(" ", "_")
    setFormData({
      ...formData,
      title: value,
      permalink: permalink,
    })
  }

  const handleSwitchChange = (e) => {
    const { name, checked } = e.target
    setFormData({
      ...formData,
      [name]: checked,
    })
  }

  const handleAvatarChange = (avatarFile) => {
    const blob = new Blob([avatarFile])
    setFormData({
      ...formData,
      avatar: blob,
    })
  }

  const handleVoiceChange = (voice) => {
    setFormData({
      ...formData,
      voice: voice,
    })
  }

  const onSubmit = (e) => {
    e.preventDefault()
    if (!validateLogin()) return

    const fd = new FormData()
    for (const key in formData) {
      if (formData.hasOwnProperty(key) && key !== "avatar") {
        const value = formData[key]
        fd.append(key, value)
      }
    }
    if (formData.avatar) {
      fd.append("avatar", formData.avatar)
    }
    fd.append("openai_params", JSON.stringify(openaiParams))
    if (action === "edit") {
      updateModel(fd)
    } else {
      createModel(fd)
    }
  }

  const createModel = async (fd) => {
    const res = await CommonApi.createModel(fd)
    if (res.ok) {
      message.success("模型创建成功！")
      setTimeout(() => {
        window.location.href = `/${formData.permalink}`
      }, 500)
    } else {
      const data = await res.json
      setFormErrors(data.message)
    }
  }

  const updateModel = async (fd) => {
    const res = await CommonApi.updateModel(modelPermalink, fd)
    if (res.ok) {
      message.success("模型更新成功！")
      setTimeout(() => {
        window.location.href = `/${modelPermalink}`
      }, 500)
    } else {
      const data = await res.json
      setFormErrors(data.message)
    }
  }

  return (
    <>
      <section className="dark:bg-gray-900">
        <div className="py-8 lg:py-4 grid grid-cols-12 gap-6">
          <form
            className="col-span-full md:col-span-8 md:border-r border-dashed md:pr-6 divide-y divide-dashed"
            onSubmit={onSubmit}
          >
            <details className="group pb-4" open>
              <summary className="flex justify-between items-center font-medium cursor-pointer list-none text-gray-900 dark:text-white">
                <span>基础设置</span>
                <span className="transition group-open:rotate-180">
                  <svg
                    fill="none"
                    height="24"
                    shapeRendering="geometricPrecision"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="1.5"
                    viewBox="0 0 24 24"
                    width="24"
                  >
                    <path d="M6 9l6 6 6-6"></path>
                  </svg>
                </span>
              </summary>
              <div className="text-neutral-600 mt-3 group-open:animate-fadeIn">
                <div className="grid gap-4 sm:grid-cols-4 sm:gap-6">
                  <div className="sm:col-span-2">
                    <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                      模型名称<span className="ml-px text-red text-red-400">*</span>
                    </label>
                    <input
                      required
                      type="text"
                      name="title"
                      className="border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-emerald-500 focus:border-emerald-500 focus:outline-none block w-full dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-emerald-500 dark:focus:border-emerald-500"
                      value={formData.title}
                      onChange={handleTitleChange}
                      onInvalid={(e) => e.target.setCustomValidity("请填写模型名称")}
                      onInput={(e) => e.target.setCustomValidity("")}
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <div className="flex mb-2 text-sm font-medium text-gray-900 dark:text-white">
                      <Tooltip className="flex items-center" title="创建成功后地址不可修改">
                        <label>
                          模型地址<span className="ml-px text-red text-red-400">*</span>
                        </label>
                        <InfoCircleOutlined className="ml-1 text-gray-500" />
                      </Tooltip>
                    </div>
                    <div className="flex">
                      <span className="inline-flex items-center px-3 text-sm text-gray-500 bg-gray-50 border border-r-0 border-gray-300 rounded-l-md dark:bg-gray-600 dark:text-gray-400 dark:border-gray-600">
                        zyzyai.cn/
                      </span>
                      <input
                        required
                        disabled={action === "edit"}
                        type="text"
                        name="permalink"
                        className="rounded-none rounded-r-lg border border-gray-300 text-gray-900 focus:ring-emerald-500 focus:border-emerald-500 block flex-1 min-w-0 w-full text-sm dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-emerald-500 dark:focus:border-emerald-500 disabled:bg-gray-50"
                        value={formData.permalink}
                        onChange={handleInputChange}
                        onInvalid={(e) => e.target.setCustomValidity("请填写模型地址")}
                        onInput={(e) => e.target.setCustomValidity("")}
                      />
                    </div>
                  </div>

                  <div className="sm:col-span-4">
                    <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                      模型描述<span className="ml-px text-red text-red-400">*</span>
                    </label>
                    <input
                      required
                      type="text"
                      name="description"
                      className="border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-emerald-500 focus:border-emerald-500 block w-full dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-emerald-500 dark:focus:border-emerald-500"
                      value={formData.description}
                      onChange={handleInputChange}
                      onInvalid={(e) => e.target.setCustomValidity("请填写模型描述")}
                      onInput={(e) => e.target.setCustomValidity("")}
                    />
                  </div>
                  <div className="sm:col-span-4">
                    <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                      系统设定<span className="ml-px text-red text-red-400">*</span>
                    </label>
                    <textarea
                      required
                      rows="4"
                      name="system_instruction"
                      className="block w-full text-sm text-gray-900 rounded-lg border border-gray-300 focus:ring-emerald-500 focus:border-emerald-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-emerald-500 dark:focus:border-emerald-500"
                      value={formData.system_instruction}
                      onChange={handleInputChange}
                      onInvalid={(e) => e.target.setCustomValidity("请填写模型设定")}
                      onInput={(e) => e.target.setCustomValidity("")}
                      placeholder="输入你对模型的设定，包括模型的角色、期望回复的格式等等。&#10;如：请你充当一个花哨的标题生成器。我会用逗号输入关键字，你会用花哨的标题回复。"
                    ></textarea>
                  </div>
                  <div className="sm:col-span-4">
                    <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">自我介绍</label>
                    <textarea
                      rows="2"
                      name="introduction"
                      className="block w-full text-sm text-gray-900 rounded-lg border border-gray-300 focus:ring-emerald-500 focus:border-emerald-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-emerald-500 dark:focus:border-emerald-500"
                      value={formData.introduction}
                      onChange={handleInputChange}
                      placeholder="(选填) 将会在聊天中作为第一条消息展示给用户"
                    ></textarea>
                  </div>
                  <div className="sm:col-span-4">
                    <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">输入占位符</label>
                    <input
                      type="text"
                      name="input_placeholder"
                      className="border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-emerald-500 focus:border-emerald-500 block w-full dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-emerald-500 dark:focus:border-emerald-500"
                      value={formData.input_placeholder}
                      onChange={handleInputChange}
                      placeholder="(选填) 用于提示用户应该输入什么内容"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <div className="flex items-center block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                      <label>模型声音</label>
                      <AudioButton content={formData.introduction} voice={formData.voice} />
                    </div>
                    <VoiceSelection voice={formData.voice} handleVoiceChange={handleVoiceChange} />
                  </div>

                  <div className="sm:col-span-1">
                    <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">模型头像</label>
                    <Avatar avatarUrl={avatarUrl} setAvatarUrl={setAvatarUrl} handleAvatarChange={handleAvatarChange} />
                  </div>

                  <div className="sm:col-span-1">
                    <label className="flex items-center block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                      是否公开
                    </label>
                    <div className="block w-full text-sm text-gray-900 dark:text-white">
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          name="is_public"
                          checked={formData.is_public}
                          className="sr-only peer"
                          onChange={handleSwitchChange}
                        />
                        <div className="w-11 h-6 bg-gray-200 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-emerald-500"></div>
                      </label>
                      <div className="text-gray-400 text-xs">
                        {formData.is_public ? "任何人都可以使用该模型" : "该模型仅自己可见"}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </details>
            <details className="group py-4">
              <summary className="flex justify-between items-center font-medium cursor-pointer list-none text-gray-900 dark:text-white">
                <span>高级设置</span>
                <span className="transition group-open:rotate-180">
                  <svg
                    fill="none"
                    height="24"
                    shapeRendering="geometricPrecision"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="1.5"
                    viewBox="0 0 24 24"
                    width="24"
                  >
                    <path d="M6 9l6 6 6-6"></path>
                  </svg>
                </span>
              </summary>
              <div className="text-neutral-600 mt-3 group-open:animate-fadeIn">
                <div className="grid gap-4 sm:grid-cols-4 sm:gap-6">
                  <div className="sm:col-span-2">
                    <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">model</label>
                    <BaseSelection options={modelOptions} />
                  </div>
                  <div className="sm:col-span-2">
                    <div className="mb-2 text-sm font-medium text-gray-900 dark:text-white">
                      <Tooltip
                        placement="topLeft"
                        className="flex items-center"
                        title={
                          <div>
                            <div>生成回复的最大 token 数</div>
                            <div>可设置范围为 1 - 2000 的整数</div>
                          </div>
                        }
                      >
                        <label>max_tokens</label>
                        <InfoCircleOutlined className="ml-1 text-gray-500" />
                      </Tooltip>
                    </div>
                    <input
                      type="number"
                      name="max_tokens"
                      min="1"
                      max="2000"
                      value={openaiParams.max_tokens}
                      onChange={(e) => handleOpenaiParamsChange(e, "number")}
                      onInvalid={(e) => e.target.setCustomValidity("max_tokens 范围为 1-2000 的整数")}
                      onInput={(e) => e.target.setCustomValidity("")}
                      className="border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-emerald-500 focus:border-emerald-500 focus:outline-none block w-full dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-emerald-500 dark:focus:border-emerald-500"
                      placeholder="范围为 1 - 2000"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <div className="mb-2 text-sm font-medium text-gray-900 dark:text-white">
                      <Tooltip
                        placement="topLeft"
                        className="flex items-center"
                        overlayStyle={{ minWidth: "320px" }}
                        title={
                          <div>
                            <div>较高的值（如0.8）将使输出更加随机</div>
                            <div>而较低的值（例如0.2）将使结果更加具有确定性</div>
                            <div>过高可能会导致结果不够准确甚至乱码</div>
                            <div>过低可能会导致结果死板或缺乏创新</div>
                            <div>可设置范围为 0 - 2</div>
                            <div>一般建议只修改 temperature 与 top_p 其中之一</div>
                          </div>
                        }
                      >
                        <label>temperature</label>
                        <InfoCircleOutlined className="ml-1 text-gray-500" />
                      </Tooltip>
                    </div>
                    <input
                      type="number"
                      name="temperature"
                      min="0"
                      max="2"
                      step="0.1"
                      value={openaiParams.temperature}
                      onChange={(e) => handleOpenaiParamsChange(e, "number")}
                      onInvalid={(e) => e.target.setCustomValidity("temperature 范围为 0 - 2")}
                      onInput={(e) => e.target.setCustomValidity("")}
                      className="border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-emerald-500 focus:border-emerald-500 focus:outline-none block w-full dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-emerald-500 dark:focus:border-emerald-500"
                      placeholder="范围为 0 - 2"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <div className="mb-2 text-sm font-medium text-gray-900 dark:text-white">
                      <Tooltip
                        className="flex items-center"
                        placement="topLeft"
                        overlayStyle={{ minWidth: "320px" }}
                        title={
                          <div>
                            <div>一个可用于代替 temperature 的参数，对应机器学习中的 nucleus sampling（核采样）</div>
                            <div>如果设置 0.1 意味着只考虑构成前 10% 概率质量的 tokens</div>
                            <div>可设置范围为 0 - 2</div>
                            <div>一般建议只修改 temperature 与 top_p 其中之一</div>
                          </div>
                        }
                      >
                        <label>top_p</label>
                        <InfoCircleOutlined className="ml-1 text-gray-500" />
                      </Tooltip>
                    </div>
                    <input
                      type="number"
                      name="top_p"
                      min="0"
                      max="1"
                      step="0.1"
                      value={openaiParams.top_p}
                      onChange={(e) => handleOpenaiParamsChange(e, "number")}
                      onInvalid={(e) => e.target.setCustomValidity("top_p 范围为 0 - 1")}
                      onInput={(e) => e.target.setCustomValidity("")}
                      className="border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-emerald-500 focus:border-emerald-500 focus:outline-none block w-full dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-emerald-500 dark:focus:border-emerald-500"
                      placeholder="范围为 0 - 1"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <div className="mb-2 text-sm font-medium text-gray-900 dark:text-white">
                      <Tooltip
                        placement="topLeft"
                        className="flex items-center"
                        overlayStyle={{ minWidth: "320px" }}
                        title={
                          <div>
                            <div>控制模型生成的文本中包含特定词语的概率</div>
                            <div>
                              当 presence_penalty
                              值越大时，模型生成的文本中包含特定词语的概率就会越小，谈论新主题的概率就会越大
                            </div>
                            <div>可设置范围为 -2.0 ~ 2.0</div>
                          </div>
                        }
                      >
                        <label>presence_penalty</label>
                        <InfoCircleOutlined className="ml-1 text-gray-500" />
                      </Tooltip>
                    </div>
                    <input
                      type="number"
                      name="presence_penalty"
                      max="2"
                      step="0.1"
                      value={openaiParams.presence_penalty}
                      onChange={(e) => handleOpenaiParamsChange(e, "number")}
                      onInvalid={(e) => e.target.setCustomValidity("presence_penalty 范围为 -2.0 ~ 2.0")}
                      onInput={(e) => e.target.setCustomValidity("")}
                      className="border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-emerald-500 focus:border-emerald-500 focus:outline-none block w-full dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-emerald-500 dark:focus:border-emerald-500"
                      placeholder="范围为 -2.0 ~ 2.0"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <div className="mb-2 text-sm font-medium text-gray-900 dark:text-white">
                      <Tooltip
                        placement="topLeft"
                        className="flex items-center"
                        overlayStyle={{ minWidth: "320px" }}
                        title={
                          <div>
                            <div>控制模型出现重复词语的可能性</div>
                            <div>当 frequency_penalty 值越大时，模型生成的文本中出现重复词语的概率就会越小</div>
                            <div>可设置范围为 -2.0 ~ 2.0</div>
                          </div>
                        }
                      >
                        <label>frequency_penalty</label>
                        <InfoCircleOutlined className="ml-1 text-gray-500" />
                      </Tooltip>
                    </div>
                    <input
                      type="number"
                      name="frequency_penalty"
                      min="-2"
                      max="2"
                      step="0.1"
                      value={openaiParams.frequency_penalty}
                      onChange={(e) => handleOpenaiParamsChange(e, "number")}
                      onInvalid={(e) => e.target.setCustomValidity("frequency_penalty 范围为 -2.0 ~ 2.0")}
                      onInput={(e) => e.target.setCustomValidity("")}
                      className="border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-emerald-500 focus:border-emerald-500 focus:outline-none block w-full dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-emerald-500 dark:focus:border-emerald-500"
                      placeholder="范围为 -2.0 ~ 2.0"
                    />
                  </div>
                </div>
              </div>
            </details>

            <button
              type="submit"
              className="float-right group relative flex justify-center rounded-md border border-transparent bg-emerald-500 py-2 px-4 text-sm font-medium text-white hover:bg-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2"
            >
              提交
            </button>
            {!!formErrors.length && (
              <span className="float-right mr-4 border-transparent text-red-500 rounded relative" role="alert">
                {formErrors.join(" & ")}
              </span>
            )}
          </form>

          <Preview
            className="col-span-4 self-start hidden md:block"
            formData={formData}
            previewStep={previewStep}
            setPreviewStep={setPreviewStep}
            avatarUrl={avatarUrl}
          />
        </div>
      </section>
    </>
  )
}

export default ModelForm
