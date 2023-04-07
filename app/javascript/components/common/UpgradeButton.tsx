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
      } text-sm outline-none focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:ring-offset-2`}
      onClick={() => (window.location.href = "/pricing")}
    >
      点击升级
    </button>
  )
}

export default UpgradeButton
