import { NextPage } from 'next'
import { useContext } from 'react'
import { useRouter } from 'next/router'
import { CtxSession } from 'context/SessionContext'
import s from '../styles/Home.module.scss'
import CourseForm from 'components/CourseForm'
import Loader from 'components/Loader'

const Home: NextPage = () => {
  const router = useRouter()
  const { isLoggedIn } = useContext(CtxSession)

  if (isLoggedIn === false) router.push('/login')

  return isLoggedIn ? (
    <main className={s.main}>
      <CourseForm />
    </main>
  ) : (
    <Loader />
  )
}

export default Home
