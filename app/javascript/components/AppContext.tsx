import { createContext } from "react"

export const AppContext = createContext({
  showSigninModal: false,
  setShowSigninModal: () => {},
  setConversations: () => {},
})
