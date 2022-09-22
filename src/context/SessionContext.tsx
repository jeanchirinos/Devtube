import { createContext, useState, useEffect, useContext, useRef } from 'react'
import { supabase } from '@/src/utils/supabaseClient'

type TContextComponent = {
  children: JSX.Element | JSX.Element[]
}

type TCurrentUser = undefined | null | { username: string }

interface CtxProps {
  currentUser: TCurrentUser
}

export const CtxSession = createContext({} as CtxProps)

export default function SessionContext({ children }: TContextComponent) {
  const [currentUser, setCurrentUser] = useState<TCurrentUser>(undefined)

  const effectRan = useRef(false)

  useEffect(() => {
    if (effectRan.current) return
    effectRan.current = true

    async function getUser() {
      const currentUser = supabase.auth.user()

      if (!currentUser) {
        setCurrentUser(null)
        return
      }

      const { data } = await supabase
        .from('profiles')
        .select('username')
        .eq('id', currentUser.id)
        .single()

      setCurrentUser(data)
    }

    getUser()

    supabase.auth.onAuthStateChange(() => {
      getUser()
    })
  }, [])

  return <CtxSession.Provider value={{ currentUser }}>{children}</CtxSession.Provider>
}

export const useSession = () => useContext(CtxSession)
