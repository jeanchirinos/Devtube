import { CtxSession } from 'context/SessionContext'
import Image from 'next/image'
import Link from 'next/link'
import { useContext } from 'react'
import { supabase } from 'utils/supabaseClient'
import s from './UserStatus.module.scss'

export default function UserStatus() {
  const { isLoggedIn } = useContext(CtxSession)

  return isLoggedIn ? (
    <>
      <div className={s.user}>
        <Link href='/home'>
          <a>Inicio</a>
        </Link>
        <button onClick={() => supabase.auth.signOut()}>Salir</button>
        <button>
          <Image
            width={36}
            height={36}
            src='/img/avatar.jpg'
            alt='Avatar de usuario'
            className='avatar'
          />
        </button>
      </div>
    </>
  ) : (
    <Link href='/login'>
      <a className='main-btn'>Ingresa</a>
    </Link>
  )
}
