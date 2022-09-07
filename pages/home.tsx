import { NextPage } from 'next'
import { useEffect, useContext, useState } from 'react'
import { useRouter } from 'next/router'
import { CtxSession } from 'context/SessionContext'
import s from '../styles/Home.module.scss'
import CourseForm from 'components/CourseForm'

const Home: NextPage = () => {
  const router = useRouter()
  const { isLoggedIn } = useContext(CtxSession)

  const [hasLoaded, setHasLoaded] = useState(false)

  useEffect(() => {
    if (!isLoggedIn) {
      router.push('/login')
    } else {
      setHasLoaded(true)
    }
  }, [router, isLoggedIn])

  return <main className={s.main}>{hasLoaded ? <CourseForm /> : <p>Cargando</p>}</main>
}

export default Home
