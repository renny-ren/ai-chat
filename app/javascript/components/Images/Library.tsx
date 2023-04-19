import React, { useEffect, useState } from "react"
import * as UserApi from "shared/api/user"
import currentUser from "stores/current_user_store"

interface LibraryProps {}

const Library: React.FC<LibraryProps> = ({}) => {
  const [images, setImages] = useState([])

  useEffect(() => {
    fetchImages()
  }, [])

  const fetchImages = async () => {
    const res = await UserApi.fetchImages(currentUser.id())
    if (res.ok) {
      const data = await res.json
      setImages(data)
    }
  }

  return (
    <>
      <div className="mt-6 md:mt-10 mb-2 md:mb-4">
        <div className="flex flex-col items-center">
          <ul className="text-gray-600 dark:text-gray-400 text-sm">
            {images.length ? <li>图片将于生成后 24 小时自动删除，如有需要请及时保存到本地</li> : <li>这里空空如也...</li>}
          </ul>
        </div>
      </div>
      <div className="flex flex-wrap items-center justify-center">
        {images.map((image, i) => (
          <div
            key={i}
            className="flex-shrink-0 m-6 relative overflow-hidden max-w-[256px] my-8 rounded shadow-lg shadow-gray-200 dark:shadow-gray-900 bg-white dark:bg-gray-800 duration-300 hover:-translate-y-1"
          >
            <div>
              <img src={image.url} />
            </div>
            <div className="text-center py-4 px-2">
              <p className="text-xs text-gray-400 font-normal">{image.name}</p>
            </div>
          </div>
        ))}
      </div>
    </>
  )
}

export default Library
