import { useRouter } from 'next/router'
import { createContext, useEffect, useState, useContext, useRef } from 'react'
import { TLesson, IUserWithCourse } from '@/src/types'
import { supabase } from '@/src/utils/supabaseClient'
import { ICourseProps } from '@/pages/[user]/[course]'
import { useSession } from './SessionContext'
import { showToast } from '../functions'

interface IContextComponent extends ICourseProps {
  children: JSX.Element | JSX.Element[]
}

interface ICtxProps extends ICourseProps {
  userWithCourse: IUserWithCourse
  setUserWithCourse: (param: IUserWithCourse) => void
  currentVideo: TLesson
  selectVideo: (number: string) => void
  toggleSubscription: () => void
}

export const CtxCourse = createContext({} as ICtxProps)

export default function CourseContext(props: IContextComponent) {
  const { children, course, teacher, lessons } = props

  const [userWithCourse, setUserWithCourse] = useState({} as IUserWithCourse)
  const [currentVideo, setCurrentVideo] = useState({} as TLesson)

  const currentUser = supabase.auth.user()

  const { currentUser: crtUser } = useSession()

  const router = useRouter()

  function selectVideo(order: string) {
    if (!currentUser || !userWithCourse.state) {
      showToast('warning', 'Inscríbete al curso para ver el video')
      return
    }

    const newVideo = lessons.find(l => l.order === order)
    setCurrentVideo(newVideo || ({} as TLesson))
  }

  async function toggleSubscription() {
    if (!currentUser) {
      router.push('/login')
    }

    await supabase.from('courses_profiles').update({
      id: userWithCourse.id,
      state: !userWithCourse?.state
    })

    setUserWithCourse({ ...userWithCourse, state: !userWithCourse?.state })
  }

  const effectRan = useRef(false)

  useEffect(() => {
    if (effectRan.current) return
    effectRan.current = true

    async function getState() {
      if (!currentUser) return

      let { data } = await supabase
        .from('courses_profiles')
        .select('id, checkedLessons, state')
        .eq('userId', currentUser.id)
        .eq('courseId', course.id)
        .single()

      if (!data) {
        const state = crtUser?.username === teacher.username

        const { data: newData } = await supabase
          .from('courses_profiles')
          .insert({
            userId: currentUser.id,
            courseId: course.id,
            state
          })
          .single()

        data = newData
      }

      setUserWithCourse(data)
    }

    getState()
  }, [course.id, currentUser, crtUser?.username, teacher.username])

  return (
    <CtxCourse.Provider
      value={{
        course,
        teacher,
        lessons,
        userWithCourse,
        setUserWithCourse,
        currentVideo,
        selectVideo,
        toggleSubscription
      }}
    >
      {children}
    </CtxCourse.Provider>
  )
}

export const useCourse = () => useContext(CtxCourse)
