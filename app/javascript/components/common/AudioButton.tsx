import React, { useState, useEffect } from "react"
import * as AliyunAPI from "shared/api/aliyun"
import * as _ from "lodash"
import Spinner from "components/common/Spinner"

interface AudioButtonProps {
  message: any
  playAudio: () => void
  pauseAudio: () => void
  playingMessageId: number
  setPlayingMessageId: () => void
  voice?: string
  className?: string
}

const AudioButton: React.FC<AudioButtonProps> = ({
  message,
  playAudio,
  pauseAudio,
  playingMessageId,
  setPlayingMessageId,
  voice = "",
  className = "",
}) => {
  const [loading, setLoading] = useState(false)

  const fetchToken = async () => {
    const res = await AliyunAPI.fetchToken()
    return res.data.Token.Id
  }

  const onClickAudio = (message) => {
    if (message.id === playingMessageId) {
      pauseAudio()
      setPlayingMessageId(0)
    } else {
      handlePlayThrottled(message)
      setPlayingMessageId(message.id)
    }
  }

  const handlePlay = async (message) => {
    setLoading(true)
    const token = await fetchToken()
    const src = AliyunAPI.fetchTtsStream(token, message.content, voice)
    playAudio(src)
    setLoading(false)
  }

  const handlePlayThrottled = _.throttle(handlePlay, 5000, { trailing: false })

  return (
    <>
      <button className={className} onClick={() => onClickAudio(message)}>
        {loading ? (
          <Spinner />
        ) : (
          <>
            {playingMessageId === message.id ? (
              <svg className="h-4 w-4 icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg">
                <path d="M526.432 924.064c-20.96 0-44.16-12.576-68.96-37.344L274.752 704 192 704c-52.928 0-96-43.072-96-96l0-192c0-52.928 43.072-96 96-96l82.752 0 182.624-182.624c24.576-24.576 47.744-37.024 68.864-37.024C549.184 100.352 576 116 576 160l0 704C576 908.352 549.28 924.064 526.432 924.064z"></path>
                <path d="M687.584 730.368c-6.464 0-12.992-1.952-18.656-6.016-14.336-10.304-17.632-30.304-7.328-44.672l12.672-17.344C707.392 617.44 736 578.624 736 512c0-69.024-25.344-102.528-57.44-144.928-5.664-7.456-11.328-15.008-16.928-22.784-10.304-14.336-7.04-34.336 7.328-44.672 14.368-10.368 34.336-7.04 44.672 7.328 5.248 7.328 10.656 14.464 15.968 21.504C764.224 374.208 800 421.504 800 512c0 87.648-39.392 141.12-74.144 188.32l-12.224 16.736C707.36 725.76 697.568 730.368 687.584 730.368z"></path>
                <path d="M796.448 839.008c-7.488 0-15.04-2.624-21.088-7.936-13.28-11.648-14.624-31.872-2.976-45.152C836.608 712.672 896 628.864 896 512c0-116.864-59.392-200.704-123.616-273.888-11.648-13.312-10.304-33.504 2.976-45.184 13.216-11.648 33.44-10.336 45.152 2.944C889.472 274.56 960 373.6 960 512s-70.528 237.472-139.488 316.096C814.144 835.328 805.312 839.008 796.448 839.008z"></path>
              </svg>
            ) : (
              <svg className="h-4 w-4 icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M526.432 924.064c-20.96 0-44.16-12.576-68.96-37.344L274.752 704 192 704c-52.928 0-96-43.072-96-96l0-192c0-52.928 43.072-96 96-96l82.752 0 182.624-182.624c24.576-24.576 47.744-37.024 68.864-37.024C549.184 100.352 576 116 576 160l0 704C576 908.352 549.28 924.064 526.432 924.064zM192 384c-17.632 0-32 14.368-32 32l0 192c0 17.664 14.368 32 32 32l96 0c8.48 0 16.64 3.36 22.624 9.376l192.064 192.096c3.392 3.36 6.496 6.208 9.312 8.576L512 174.016c-2.784 2.336-5.952 5.184-9.376 8.608l-192 192C304.64 380.64 296.48 384 288 384L192 384z"
                  fill="#707070"
                ></path>
                <path
                  d="M687.584 730.368c-6.464 0-12.992-1.952-18.656-6.016-14.336-10.304-17.632-30.304-7.328-44.672l12.672-17.344C707.392 617.44 736 578.624 736 512c0-69.024-25.344-102.528-57.44-144.928-5.664-7.456-11.328-15.008-16.928-22.784-10.304-14.336-7.04-34.336 7.328-44.672 14.368-10.368 34.336-7.04 44.672 7.328 5.248 7.328 10.656 14.464 15.968 21.504C764.224 374.208 800 421.504 800 512c0 87.648-39.392 141.12-74.144 188.32l-12.224 16.736C707.36 725.76 697.568 730.368 687.584 730.368z"
                  fill="#707070"
                ></path>
                <path
                  d="M796.448 839.008c-7.488 0-15.04-2.624-21.088-7.936-13.28-11.648-14.624-31.872-2.976-45.152C836.608 712.672 896 628.864 896 512c0-116.864-59.392-200.704-123.616-273.888-11.648-13.312-10.304-33.504 2.976-45.184 13.216-11.648 33.44-10.336 45.152 2.944C889.472 274.56 960 373.6 960 512s-70.528 237.472-139.488 316.096C814.144 835.328 805.312 839.008 796.448 839.008z"
                  fill="#707070"
                ></path>
              </svg>
            )}
          </>
        )}
      </button>
    </>
  )
}

export default AudioButton
