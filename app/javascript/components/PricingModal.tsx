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
}

const PricingModal: React.FC<PricingModalProps> = ({ isOpen, setIsOpenModal }) => {
  const [isLoading, setIsLoading] = useState(false)
  const [pendingPayment, setPendingPayment] = useState(false)
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
    try {
      setPendingPayment(true)
      const response = await axios.get(`/v1/orders/${orderId}`)
      if (response.data.status === "paid") {
        setPendingPayment(false)
        message.success("支付成功！")
        closeModal()
      }
    } catch (error) {
      message.error(error.response.data.message)
    } finally {
      setPendingPayment(false)
    }
  }

  const getQrCode = async () => {
    try {
      setIsLoading(true)
      const response = await axios.post("/v1/orders", { name: "basic" }, { headers: headers })
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
                    <div className="w-full space-y-8">
                      <div className="py-4 text-sm text-gray-500">
                        {isLoading ? (
                          <Spin size="large" />
                        ) : (
                          <div className="text-center">
                            <img className="m-auto h-16 p-2" src="assets/alipay-logo-1e.png" />
                            <div className="py-2">
                              <QRCode className="m-auto" size={256} value={qrCodeUrl} viewBox={`0 0 256 256`} level="M" />
                            </div>
                            <div className="pt-2">
                              <p>请使用支付宝扫描二维码支付</p>
                              <p>支付完成后页面会自动刷新</p>
                            </div>
                          </div>
                        )}
                      </div>
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
