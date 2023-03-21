import React, { Fragment, useState, useEffect } from "react"
import currentUser from "stores/current_user_store"
import { Dialog, Transition } from "@headlessui/react"
import axios from "axios"
import { message } from "antd"
import QRCode from "react-qr-code"
import { Spin } from "antd"

interface PricingModalProps {
  isOpen: boolean
  setIsOpenModal: () => void
  planName: string
}

const PricingModal: React.FC<PricingModalProps> = ({ isOpen, setIsOpenModal, planName }) => {
  const [isLoading, setIsLoading] = useState(false)
  const [isPaid, setIsPaid] = useState(false)
  const [qrCodeUrl, setQrCodeUrl] = useState("")
  let [poll, setPoll] = useState()

  const headers = {
    "X-CSRF-Token": document.querySelector("meta[name='csrf-token']").getAttribute("content"),
  }

  useEffect(() => {
    if (isOpen) {
      getQrCode()
    }
  }, [isOpen])

  const closeModal = () => {
    setIsOpenModal(false)
    clearInterval(poll)
  }

  const pollStatus = async (orderId) => {
    const response = await axios.get(`/v1/orders/${orderId}`)
    if (response.data.status === "paid") {
      setIsPaid(true)
      setTimeout(() => {
        message.success("升级成功！")
        closeModal()
        setIsPaid(false)
        window.location.reload()
      }, 2000)
    }
    if (response.data.status === "closed") {
      message.error("当前二维码已失效")
      closeModal()
    }
  }

  const getQrCode = async () => {
    try {
      setIsLoading(true)
      const response = await axios.post("/v1/orders", { name: planName }, { headers: headers })
      setQrCodeUrl(response.data.qr_code_url)
      poll = setInterval(pollStatus, 1500, response.data.id)
      setPoll(poll)
    } catch (error) {
      console.log(error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      <Transition appear show={isOpen} as={Fragment}>
        <Dialog as="div" className="relative z-50" onClose={closeModal}>
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
            {/*<div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />*/}
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
                <Dialog.Panel className="w-full max-w-sm transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all opacity-100 scale-100">
                  <div className="flex min-h-full items-center justify-center">
                    <div className="w-full">
                      <div className="py-4 text-sm text-gray-500 text-center">
                        {isLoading ? (
                          <Spin size="large" />
                        ) : (
                          <>
                            <img className="m-auto h-16 p-2" src="assets/alipay-logo-1e.png" />
                            <div className="py-2">
                              <QRCode
                                className="m-auto"
                                size={256}
                                value={qrCodeUrl || ""}
                                viewBox={`0 0 256 256`}
                                level="M"
                              />
                            </div>
                            <div className="pt-2">
                              <p>请使用支付宝扫描二维码支付</p>
                              <p>支付完成后页面会自动刷新</p>
                            </div>
                            <div className="text-xs pt-1 text-gray-400">（如需其他方式支付请点击右上角联系客服）</div>
                          </>
                        )}
                      </div>
                      {isPaid && (
                        <div className="text-md font-semibold text-emerald-500 text-center">
                          支付成功，正在升级
                          <Spin className="ml-2" />
                        </div>
                      )}
                    </div>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  )
}

export default PricingModal
