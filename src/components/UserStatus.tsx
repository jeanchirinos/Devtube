import { CtxSession } from 'context/SessionContext'
import Image from 'next/image'
import Link from 'next/link'
import { useContext } from 'react'
import { supabase } from 'utils/supabaseClient'
import ThemeSwitcher from './ThemeSwitcher'
import s from './UserStatus.module.scss'

export default function UserStatus() {
  const { isLoggedIn } = useContext(CtxSession)

  if (isLoggedIn === null) return <></>

  return isLoggedIn ? (
    <>
      <div className={s.user}>
        <ThemeSwitcher />
        <Link href='/home'>
          <a>Inicio</a>
        </Link>
        <button onClick={() => supabase.auth.signOut()}>Salir</button>
        <button>
          <Image
            width={36}
            height={36}
            src='/img/defaultAvatar.png'
            alt='Avatar de usuario'
            className='avatar'
          />
        </button>
      </div>
    </>
  ) : (
    <div className={s.user}>
      <ThemeSwitcher />
      <Link href='/login'>
        <a className='main-btn'>Ingresa</a>
      </Link>
    </div>
  )
}
