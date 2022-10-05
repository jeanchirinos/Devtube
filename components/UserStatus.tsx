import { CtxSession } from '@/src/context/SessionContext'
import Image from 'next/image'
import Link from 'next/link'
import { useContext } from 'react'
import { supabase } from '@/src/utils/supabaseClient'
import ThemeSwitcher from './ThemeSwitcher'
import s from './UserStatus.module.scss'

export default function UserStatus() {
  const { currentUser } = useContext(CtxSession)

  if (currentUser === undefined) return <></>

  return currentUser ? (
    <>
      <div className={s.user}>
        <ThemeSwitcher />
        <Link href={`/${currentUser.username}/home`}>
          <a>Inicio</a>
        </Link>
        <Link href='/crear'>
          <a>Crear</a>
        </Link>
        <button onClick={() => supabase.auth.signOut()}>Salir</button>
        <Link href={`/${currentUser.username}`}>
          <a>
            <Image
              width={36}
              height={36}
              src='/img/defaultAvatar.png'
              alt='Avatar de usuario'
              className='avatar'
            />
          </a>
        </Link>
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
