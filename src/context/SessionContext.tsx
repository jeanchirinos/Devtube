import { createContext, useState, useEffect } from 'react'
import { supabase } from 'utils/supabaseClient'

type TContextComponent = {
  children: JSX.Element | JSX.Element[]
}

interface CtxProps {
  isLoggedIn: boolean
}

export const CtxSession = createContext<CtxProps>({} as CtxProps)

export default function SessionContext({ children }: TContextComponent) {
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  useEffect(() => {
    setIsLoggedIn(Boolean(supabase.auth.session()))

    supabase.auth.onAuthStateChange((event, session) => setIsLoggedIn(Boolean(session)))
  }, [])

  return <CtxSession.Provider value={{ isLoggedIn }}>{children}</CtxSession.Provider>
}
