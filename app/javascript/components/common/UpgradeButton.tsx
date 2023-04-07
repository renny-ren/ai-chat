import React from "react"

interface UpgradeButtonProps {
  size: string
}

const UpgradeButton: React.FC<UpgradeButtonProps> = ({ size }) => {
  return (
    <button
      type="button"
      className={`inline-flex justify-center rounded-md border border-transparent bg-amber-300 ${
        size === "small" ? "px-2 py-1" : "px-4 py-2"
      } text-sm outline-none`}
      onClick={() => (window.location.href = "/pricing")}
    >
      点击升级
    </button>
  )
}

export default UpgradeButton
