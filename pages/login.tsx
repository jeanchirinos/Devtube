import { NextPage } from 'next'
import s from '../styles/Login.module.scss'
import { supabase } from '../src/utils/supabaseClient'
import { BsGithub, BsGoogle } from 'react-icons/bs'
import { MdEmail } from 'react-icons/md'
import { useEffect, useContext, useState } from 'react'
import { useRouter } from 'next/router'
import { CtxSession } from 'context/SessionContext'

const Login: NextPage = () => {
  const router = useRouter()
  const { isLoggedIn } = useContext(CtxSession)

  const [hasLoaded, setHasLoaded] = useState(false)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()

    const form = Object.fromEntries(new FormData(e.currentTarget))

    try {
      await supabase.auth.signIn({
        email: form.email as string
      })
    } catch (err) {
      console.error(err)
    }
  }

  useEffect(() => {
    if (isLoggedIn) {
      router.push('/')
    } else {
      setHasLoaded(true)
    }
  }, [router, isLoggedIn])

  return (
    <main className={s.main}>
      {hasLoaded ? (
        <div className={s.content}>
          <button className={s.github}>
            <BsGithub />
            <span>Continuar con Github</span>
          </button>
          <button className={s.google}>
            <BsGoogle />
            <span>Continuar con Google</span>
          </button>
          <form onSubmit={handleSubmit}>
            <input type='email' name='email' aria-label='email' required />
            <button>
              <MdEmail />
              <span>Continuar con email</span>
            </button>
          </form>
        </div>
      ) : (
        <p>Loading</p>
      )}
    </main>
  )
}

export default Login
