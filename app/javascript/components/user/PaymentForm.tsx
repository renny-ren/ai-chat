import React, { useState } from "react"
import currentUser from "stores/current_user_store"
import * as UserApi from "shared/api/user"
import { message } from "antd"

interface PaymentFormProps {}

const PaymentForm: React.FC<PaymentFormProps> = ({}) => {
  return (
    <>
      <form>
        <div className="w-full bg-white rounded-lg mx-auto flex overflow-hidden rounded-b-none">
          <div className="w-1/5 border-r border-gray-100 p-8 hidden md:inline-block">
            <h2 className="font-medium text-md text-gray-700 mb-4 tracking-wide">支付信息</h2>
            <p className="text-xs text-gray-500"></p>
          </div>
          <div className="ml-4 flex justify-center items-center text-sm text-gray-500">这里什么也没有...</div>
        </div>
      </form>
    </>
  )
}

export default PaymentForm
