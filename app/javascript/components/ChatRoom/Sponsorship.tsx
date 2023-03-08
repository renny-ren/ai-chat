import React, { Fragment, useState, useEffect } from "react"
import currentUser from "stores/current_user_store"
import { Dialog, Transition } from "@headlessui/react"
import axios from "axios"

interface SponsorshipProps {}

const Sponsorship: React.FC<SponsorshipProps> = ({ src, isRobot }) => {
  let [isOpen, setIsOpen] = useState(false)
  let [step, setStep] = useState("initial")
  let [sponsorships, setSponsorships] = useState([])

  useEffect(() => {
    fetchSponsorships()
  }, [])

  const fetchSponsorships = async () => {
    const csrf = document.querySelector("meta[name='csrf-token']").getAttribute("content")
    const response = await axios.get("/v1/sponsorships", {
      headers: {
        "X-CSRF-Token": csrf,
      },
    })
    setSponsorships(response.data)
  }

  function closeModal() {
    setIsOpen(false)
  }

  function openModal() {
    setIsOpen(true)
  }

  const dialogContent = () => {
    if (step == "initial") {
      return (
        <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-center align-middle shadow-xl transition-all">
          <Dialog.Title as="h3" className="text-lg font-medium leading-6 text-gray-900">
            谢君赏赐
          </Dialog.Title>
          <div className="mt-2">
            <div className="leading-8 text-sm text-gray-500">
              {/*<span>
                        我们的网站是免费使用的，但是它的开发、维护和运行都需要不少成本。我们希望提供最好的服务，让用户能够享受更好的体验。
                        如果您喜欢我们的网站，并希望支持我们的工作，您可以通过扫描下面的二维码来打赏我们。您的支持将帮助我们更好地发展和提高我们的服务质量。
                      </span>*/}
              <p>细波微漾，秋水澄清，吾辈匠心，献礼于君。</p>

              <p>本站素来免费，但有开发维护之成本。</p>
              <p>运营不易，费用不少。</p>
              <p>祈愿君子留步，手持赏赐。</p>
              <p>且看二维码，玉手轻扫， 投资前程，点燃梦火。 </p>
            </div>
            <div className="text-center">
              <img className="inline-block h-60 w-60" src="/assets/reward_qrcode.png" />
            </div>
          </div>

          <div className="flex gap-4 justify-center mt-4">
            <button
              type="button"
              className="inline-flex justify-center rounded-md border border-transparent bg-indigo-100 px-4 py-2 text-sm font-medium text-indigo-900 hover:bg-indigo-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2"
              onClick={() => setStep("list")}
            >
              查看赞助者名单
            </button>
            <button
              type="button"
              className="inline-flex justify-center rounded-md border border-transparent bg-gray-100 px-4 py-2 text-sm font-medium text-gray-900 hover:bg-gray-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-500 focus-visible:ring-offset-2"
              onClick={closeModal}
            >
              继续白嫖薅羊毛
            </button>
          </div>
        </Dialog.Panel>
      )
    } else {
      return (
        <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-center align-middle shadow-xl transition-all">
          <Dialog.Title as="h3" className="text-lg font-medium leading-6 text-gray-900">
            谢君赏赐
          </Dialog.Title>
          <div className="mt-2">
            <div className="leading-8 text-sm text-gray-500">
              <p>众慷慨之士，莅临赏赐</p>
              <p>殷殷感激，谢恩不尽， 愿君归来，再相逢。</p>
              <p>（此名单每日更新）</p>
            </div>
            <div className="flow-root max-h-60 overflow-y-scroll">
              <ul role="list" className="divide-y divide-gray-200 dark:divide-gray-700">
                {sponsorships.map((s, i) => {
                  return (
                    <li className={`${i + 1 === sponsorships.length ? "pt-3 pb-0 sm:pt-4" : "py-3 sm:py-4"}`}>
                      <div className="flex items-center space-x-4">
                        <div className="flex-shrink-0">
                          <img className="w-8 h-8 rounded-full" src={s.user?.avatar_url || "/assets/person.png"} />
                        </div>
                        <div className="flex-1 min-w-0 text-left">
                          <p className="text-sm font-medium text-gray-900 truncate dark:text-white">
                            {s.user?.nickname || "匿名"}
                          </p>
                          <p className="text-sm text-gray-500 truncate dark:text-gray-400">{s.sponsor_at}</p>
                        </div>
                        <div className="inline-flex items-center text-base font-semibold text-gray-900 dark:text-white">
                          ¥{s.amount}
                        </div>
                      </div>
                    </li>
                  )
                })}
              </ul>
            </div>
          </div>

          <div className="mt-4">
            <button
              type="button"
              className="inline-flex justify-center rounded-md border border-transparent bg-indigo-100 px-4 py-2 text-sm font-medium text-indigo-900 hover:bg-indigo-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2"
              onClick={() => setStep("initial")}
            >
              返回
            </button>
          </div>
        </Dialog.Panel>
      )
    }
  }
  return (
    <>
      <button
        onClick={openModal}
        type="button"
        className="flex h-6 w-6 outline-none sm:hover:bg-zinc-900/5 dark:hover:bg-white/5"
      >
        <svg className="h-5 w-5 icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M664.48 234.432c-12.256-12.704-32.512-13.056-45.248-0.8l-76.256 73.6-73.344-73.216c-12.512-12.512-32.768-12.48-45.28 0.032-12.48 12.512-12.448 32.768 0.032 45.28l72.384 72.256-49.28 0c-17.664 0-32 14.336-32 32s14.336 32 32 32l63.776 0 0 32-63.776 0c-17.664 0-32 14.336-32 32s14.336 32 32 32l63.776 0 0 65.664c0 17.696 14.336 32 32 32 17.696 0 32-14.304 32-32l0-65.664 64.288 0c17.696 0 32-14.336 32-32s-14.304-32-32-32l-64.288 0 0-32 64.288 0c17.696 0 32-14.336 32-32s-14.304-32-32-32l-50.368 0 74.464-71.872C676.384 267.392 676.736 247.168 664.48 234.432z"
            fill="#707070"
          ></path>
          <path
            d="M939.68 737.984c-20.448-8.416-80.256-32.8-141.664-56.736 62.112-67.52 97.568-156.544 97.568-248.608 0-202.912-165.12-368-368.064-368-202.912 0-368 165.088-368 368 0 16.224 1.024 32.352 3.072 47.968 2.304 17.504 18.496 29.664 35.904 27.584 17.536-2.304 29.888-18.368 27.584-35.904-1.696-12.864-2.56-26.208-2.56-39.648 0-167.616 136.384-304 304-304 167.648 0 304.064 136.384 304.064 304 0 84.736-34.112 163.36-96.128 221.472-0.768 0.736-1.088 1.76-1.824 2.528-42.848-15.936-79.328-28.48-93.76-30.656-24.896-3.904-48.672 7.616-63.104 28.896-12.032 17.792-15.072 38.816-8.096 56.256 4.288 10.656 20.512 32.896 39.776 57.28-46.432-0.064-117.312-6.336-192.832-35.488-31.264-12.064-69.44-52.64-103.136-88.416-47.968-50.976-93.28-99.104-142.56-99.104-18.336 0-35.744 6.848-50.336 19.776-18.24 16.224-35.136 48.32-12 109.248 42.624 112.16 208.544 285.12 341.728 285.12l478.144 0c17.696 0 32-14.304 32-32l0-160C959.52 754.624 951.68 742.912 939.68 737.984zM895.52 895.584l-445.12 0-1.024 32 0-32c-97.6 0-247.072-152.128-281.92-243.872-10.112-26.656-6.72-37.408-5.344-38.624 4.128-3.648 6.528-3.648 7.84-3.648 21.632 0 64.608 45.632 95.968 78.944 40.224 42.752 81.856 86.944 126.656 104.256 85.216 32.896 164.896 39.808 216.736 39.808 41.376 0 67.584-4.352 68.672-4.544 11.328-1.952 20.736-9.76 24.672-20.544 3.968-10.784 1.856-22.848-5.536-31.616-27.008-32.096-58.592-71.808-67.296-85.344 0.288-0.576 0.512-1.024 0.352-1.152 22.848 3.488 162.432 57.952 265.28 99.84L895.456 895.584z"
            fill="#707070"
          ></path>
        </svg>
      </button>

      <Transition appear show={isOpen} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={closeModal}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-25" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                {dialogContent()}
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  )
}

export default Sponsorship
