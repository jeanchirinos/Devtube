import { NextPage } from 'next'
import s from '../styles/Login.module.scss'
import { supabase } from '../src/utils/supabaseClient'
import { BsGithub, BsGoogle } from 'react-icons/bs'
import { MdEmail } from 'react-icons/md'
import { useContext } from 'react'
import { useRouter } from 'next/router'
import { CtxSession } from 'context/SessionContext'
import Loader from 'components/Loader'

const Login: NextPage = () => {
  const router = useRouter()
  const { isLoggedIn } = useContext(CtxSession)

  if (isLoggedIn) router.push('/')

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()

    const form = Object.fromEntries(new FormData(e.currentTarget))

    await supabase.auth
      .signIn({
        email: form.email as string
      })
      .catch(err => console.log(err))
  }

  return isLoggedIn === false ? (
    <main className={s.main}>
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
    </main>
  ) : (
    <Loader />
  )
}

export default Login
