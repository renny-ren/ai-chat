# AI Chat

基于 ChatGPT 的 AI 问答系统

<img width="1503" alt="image" src="https://github.com/renny-ren/ai-chat/assets/19547819/734dd751-c3fa-40f1-ab98-b7329775fc42">

Live demo: [https://zyzy.chat](https://zyzy.chat/)

## Features

- 多人在线聊天室，接入 OpenAI API 支持与 ChatGPT 对话
- 个人会话，会话列表增删改查
- 接入语音合成 TTS，可不同人声朗读消息
- 支持 AI 绘画，基于 DALL·E API
- 支持自定义模型，自行扩展更多可能
- 支持邀请返利功能
- 支持夜间模式切换
- 用户管理系统，支持注册登录
- 消息通知系统，支持发送站内信

## Tech Stack

项目采用前后端分离，emerald 作为主色调，界面简洁。

主要技术栈：

- React
- TailwindCSS
- Rails
- PostgreSQL

## Setup

1. run `bundle install`
2. run `bin/dev`

Open your web browser and navigate to http://localhost:3000

## Contribution

Pull requests are welcome.

1. Fork it
2. Create your branch (`git checkout -b some-branch`)
3. Commit your changes (`git commit -am 'Add some features'`)
4. Push to the branch (`git push origin some-branch`)
5. Create a new Pull Request

## License

AiChat is [MIT licensed](./LICENSE)
