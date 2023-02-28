import React, { useState } from "react"
import Menu from "./Menu"

interface SidebarProps {}

const Sidebar: React.FC<SidebarProps> = ({}) => {
  return (
    <nav className="hidden lg:mt-10 lg:block">
      <Menu />
    </nav>
  )
}

export default Sidebar
