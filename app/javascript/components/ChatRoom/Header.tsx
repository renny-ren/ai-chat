import React, { useState } from "react"
import { UpOutlined, DownOutlined } from "@ant-design/icons"
import { Avatar, Badge, ConfigProvider } from "antd"

interface HeaderProps {
  subscribers: []
}

const Header: React.FC<HeaderProps> = ({ subscribers }) => {
  const [isOpen, setIsOpen] = useState(true)

  const toggleMenu = () => {
    setIsOpen(!isOpen)
  }

  const subscribersForDispaly = subscribers.filter((user) => user.nickname != gon.global_config.robot_name)

  return (
    <div className="group hidden md:block">
      <div
        className={`border-gray-300 overflow-hidden transition-all duration-300 ${
          isOpen ? "max-h-36 shadow-sm px-2 pb-2" : "max-h-0"
        }`}
      >
        <div className="px-4 sm:px-0">
          <p className="mt-1 max-w-2xl text-sm leading-6 text-gray-600 font-medium">AI 在线聊天室</p>

          <div className="flex justify-between">
            <div className="max-w-2xl text-xs text-gray-500 flex items-center space-x-2">
              <span>这里是公开的在线聊天室，请勿泄露个人隐私信息</span>
              <div className="h-3 md:w-px bg-zinc-900/10 dark:bg-white/[.075]"></div>
              <span>AI 在聊天室里，@ChatGPT 他会回复你</span>
            </div>

            {subscribersForDispaly.length > 1 && (
              <div className="flex items-center">
                <ConfigProvider
                  theme={{
                    token: {
                      colorPrimary: "#10B981",
                    },
                  }}
                >
                  <Badge className="mr-1 !leading-none" status="processing" />
                  <span className="text-xs text-emerald-500 mr-2">{subscribersForDispaly.length}人在线</span>
                </ConfigProvider>
                <Avatar.Group
                  className="text-xs text-gray-500"
                  size="small"
                  maxCount={3}
                  maxStyle={{ color: "#fff", backgroundColor: "rgba(0, 0, 0, 0.5)", fontSize: "12px", borderRadius: "4px" }}
                >
                  {subscribersForDispaly.map((user, i) => {
                    if (i > 2) {
                      return (
                        <div key={i}>
                          <Avatar shape="square" src={user.avatar_url} />
                          <span className="text-zinc-600 ml-1">{user.nickname}</span>
                          {i === subscribersForDispaly.length - 1 && (
                            <div className="border-t border-gray-200 mt-2 pt-1 text-xs text-gray-400">
                              当前共{subscribersForDispaly.length}人在线
                            </div>
                          )}
                        </div>
                      )
                    } else {
                      return <Avatar key={i} shape="square" src={user.avatar_url} />
                    }
                  })}
                </Avatar.Group>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="flex justify-center">
        {isOpen ? (
          <button className="outline-none fixed -mt-5 opacity-0 group-hover:opacity-100 z-50" onClick={toggleMenu}>
            <UpOutlined className="text-gray-400" />
          </button>
        ) : (
          <button className="outline-none fixed -mt-3 z-20 group-hover:-mt-2 w-[50%]" onClick={toggleMenu}>
            <DownOutlined className="text-gray-300" />
          </button>
        )}
      </div>
    </div>
  )
}

export default Header
