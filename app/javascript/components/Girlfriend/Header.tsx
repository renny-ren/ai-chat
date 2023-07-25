import React, { useState } from "react"
import { UpOutlined, DownOutlined, ShareAltOutlined } from "@ant-design/icons"
import { message, Popconfirm, ConfigProvider, Switch, Tooltip } from "antd"
import { copy } from "shared/utils/copy_text"

interface HeaderProps {}

const Header: React.FC<HeaderProps> = ({ isAddContext, handleContextChange, title }) => {
  const [isOpen, setIsOpen] = useState(true)

  const toggleMenu = () => {
    setIsOpen(!isOpen)
  }

  const onShare = async () => {
    copy(`${window.location.origin}/girlfriend`)
    message.success("应用链接已复制成功")
  }

  return (
    <>
      <div className="group z-10">
        <div
          className={`border-gray-300 overflow-hidden transition-all duration-300 ${
            isOpen ? "max-h-36 shadow-sm pb-2" : "max-h-0"
          }`}
        >
          <div className="px-4 sm:px-0">
            <p className="mt-1 max-w-2xl text-sm leading-6 font-medium text-gray-600">{title}</p>

            <div className="flex justify-between items-end">
              <div className="mt-1 max-w-2xl text-xs text-gray-600 flex items-center">
                <span>单次回答有字数限制，不完整时回复「继续」即可</span>
              </div>
              <div className="actions text-xs text-gray-600 flex items-center">
                <ConfigProvider
                  theme={{
                    token: {
                      colorPrimary: "#10B981",
                    },
                  }}
                >
                  <div className="hidden md:block mr-4">
                    <Tooltip
                      title={isAddContext ? "已开启 - 生成的内容会结合会话语境" : "已关闭 - 获得更精确的一问一答效果"}
                    >
                      <label className="mr-1">关联上下文</label>
                      <Switch size="small" className="bg-gray-400" checked={isAddContext} onChange={handleContextChange} />
                    </Tooltip>
                  </div>
                </ConfigProvider>
                <Tooltip title="分享应用">
                  <button
                    type="button"
                    onClick={onShare}
                    className="font-medium inline-flex items-center text-sm mr-3 gap-x-1 rounded-full hover:text-gray-700 outline-none"
                  >
                    <ShareAltOutlined />
                  </button>
                </Tooltip>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-center">
          {isOpen ? (
            <button className="outline-none fixed -mt-6 opacity-0 group-hover:opacity-100 z-50" onClick={toggleMenu}>
              <UpOutlined className="text-gray-400" />
            </button>
          ) : (
            <button className="outline-none fixed -mt-3 z-20 group-hover:-mt-2 w-[50%]" onClick={toggleMenu}>
              <DownOutlined className="text-gray-300" />
            </button>
          )}
        </div>
      </div>
    </>
  )
}

export default Header
