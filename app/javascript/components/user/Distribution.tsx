import React, { useState, useEffect } from "react"
import currentUser from "stores/current_user_store"

interface DistributionProps {}

const Distribution: React.FC<DistributionProps> = ({}) => {
  useEffect(() => {
    if (!currentUser.isSignedIn()) {
      window.location.href = "/"
    }
  }, [])

  return (
    <>
      <div className="relative px-4 pt-14 sm:px-6 lg:px-8">
        <main className="py-12 mx-auto max-w-2xl space-y-10 pb-16 lg:max-w-5xl">
          <div className="min-h-screen pb-24"></div>
        </main>
      </div>
    </>
  )
}

export default Distribution
