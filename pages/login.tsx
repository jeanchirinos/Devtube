import { NextPage } from 'next'
import s from '@/styles/Login.module.scss'
import { supabase } from '@/src/utils/supabaseClient'
import { BsGithub, BsGoogle } from 'react-icons/bs'
import { MdEmail } from 'react-icons/md'
import { useContext, useState } from 'react'
import { useRouter } from 'next/router'
import { CtxSession } from '@/src/context/SessionContext'
import Loader from '@/components/Loader'
import { showToast } from '@/src/functions'

const Login: NextPage = () => {
  const [loginMode, setLoginMode] = useState(true)

  const MODE = loginMode
    ? {
        text: 'Continuar',
        sentence: '¿No tienes una cuenta?, Regístrate'
      }
    : {
        text: 'Registrarse',
        sentence: '¿Ya tienes una cuenta?, Logueate'
      }

  const router = useRouter()
  const { currentUser } = useContext(CtxSession)

  if (currentUser) router.push('/')

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()

    const form = Object.fromEntries(new FormData(e.currentTarget))

    const action = loginMode ? 'signIn' : 'signUp'

    const { error } = await supabase.auth[action]({
      email: form.email as string,
      password: form.password as string
    })

    if (error) showToast('error', 'Usuario o contraseña incorrecto')
  }

  return currentUser === null ? (
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

        <form role={'form'} onSubmit={handleSubmit}>
          <input type='email' name='email' aria-label='email' required placeholder='Correo' />
          <input
            type='password'
            name='password'
            aria-label='password'
            required
            placeholder='Contraseña'
          />

          <button className={s.email}>
            <MdEmail />
            <span>{MODE.text} con email</span>
          </button>
        </form>
      </div>

      <footer>
        <button onClick={() => setLoginMode(!loginMode)}>{MODE.sentence}</button>
      </footer>
    </main>
  ) : (
    <Loader />
  )

  // return <form role={'form'} action=''></form>
}

export default Login
