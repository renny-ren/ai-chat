import React, { useState } from "react"
import Menu from "./Menu"

interface SidebarProps {
  conversations: any
}

const Sidebar: React.FC<SidebarProps> = ({ conversations }) => {
  return (
    <nav className="hidden lg:mt-10 lg:block">
      <Menu conversations={conversations} />
    </nav>
  )
}

export default Sidebar
