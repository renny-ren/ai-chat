import React, { useState } from "react"
import currentUser from "stores/current_user_store"

const Preview: React.FC = ({ className, formData, previewStep, setPreviewStep, avatarUrl }) => {
  return (
    <div className={className}>
      <div className="flex justify-between items-center font-medium cursor-pointer list-none">预览</div>
      {previewStep === "list" && (
        <div className="mt-3 rounded shadow-md shadow-gray-200 dark:shadow-gray-900 bg-white dark:bg-gray-800">
          <div className="p-5">
            <a target="_blank">
              <h5 className="truncate text-slate-900 font-medium text-lg tracking-tight dark:text-white">
                {formData.title || "模型名称"}
              </h5>
            </a>
            <p className="truncate mt-1 text-base text-slate-500 dark:text-slate-400">
              {formData.description || "模型描述"}
            </p>
            <div className="flex mt-2 justify-between items-start">
              <dl className="flex items-center">
                <div className="flex flex-col-reverse">
                  <dd className="text-xs text-slate-500">{currentUser.nickname()}</dd>
                </div>
                <div className="block h-3 w-px mx-2 bg-zinc-900/10 dark:bg-white/15"></div>
                <div className="flex flex-col-reverse">
                  <dd className="text-xs text-slate-500">
                    {new Date().toLocaleString("zh-CN", {
                      month: "numeric",
                      day: "numeric",
                      hour: "numeric",
                      minute: "numeric",
                    })}
                  </dd>
                </div>
              </dl>
              <a
                onClick={() => setPreviewStep("show")}
                className="cursor-pointer items-center group relative flex justify-center rounded-md border border-transparent bg-emerald-500 py-2 px-4 text-sm font-medium text-white hover:bg-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2"
              >
                进入
                <svg
                  className="-mr-1 ml-1 h-4 w-4"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
                  ></path>
                </svg>
              </a>
            </div>
          </div>
        </div>
      )}

      {previewStep === "show" && (
        <>
          <div className="mt-3 fixed flex flex-row items-start">
            <div className="flex mt-1 items-center relative">
              <img className="rounded-full w-10 h-10 float-left shadow-md" src={avatarUrl || gon.gpt_user.avatar_url} />
            </div>
            <div className="relative flex flex-col gap-1 max-w-[98%]">
              <div className="flex items-baseline">
                <div className="text-sm font-medium ml-3 dark:text-white">{formData.title}</div>
              </div>
              <div className="markdown ai-response relative ml-2 mr-4 text-sm bg-white py-2 px-4 shadow rounded-xl break-words whitespace-pre-line max-w-max">
                <div>{formData.introduction || `你好，我是${formData.title}`}</div>
              </div>
            </div>
          </div>
          <a
            onClick={() => setPreviewStep("list")}
            className="cursor-pointer items-center float-right group relative flex justify-center rounded-md border border-transparent bg-emerald-500 py-2 px-4 text-sm font-medium text-white hover:bg-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2"
          >
            <svg
              className="h-4 w-4 mr-1"
              viewBox="0 0 1024 1024"
              version="1.1"
              fill="currentColor"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M671.968 912c-12.288 0-24.576-4.672-33.952-14.048L286.048 545.984c-18.752-18.72-18.752-49.12 0-67.872l351.968-352c18.752-18.752 49.12-18.752 67.872 0 18.752 18.72 18.752 49.12 0 67.872l-318.016 318.048 318.016 318.016c18.752 18.752 18.752 49.12 0 67.872C696.544 907.328 684.256 912 671.968 912z"></path>
            </svg>
            返回
          </a>
        </>
      )}
    </div>
  )
}

export default Preview
