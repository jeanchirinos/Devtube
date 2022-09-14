import { createContext, useEffect, useState } from 'react'
import { TCourse, TCurrentVideo, TUserWithCourse } from 'types'
import { supabase } from 'utils/supabaseClient'
import { CourseProps } from '../../pages/[user]/[course]'

interface TContextComponent extends CourseProps {
  children: JSX.Element | JSX.Element[]
}

interface CtxProps {
  userWithCourse: TUserWithCourse
  setUserWithCourse: (param: TUserWithCourse) => void
  currentVideo: TCurrentVideo
  selectVideo: (number: string) => void
  playlist: TCurrentVideo[]
  teacher: {
    name: string
    avatar: string
  }
  course: TCourse
  toggleSubscription: () => void
}

export const CtxCourse = createContext<CtxProps>({} as CtxProps)

export default function CourseContext(props: TContextComponent) {
  const { children, course, playlist, teacher } = props

  const initialState = {} as TCurrentVideo

  const [userWithCourse, setUserWithCourse] = useState({} as TUserWithCourse)
  const [currentVideo, setCurrentVideo] = useState(initialState)

  function selectVideo(number: string) {
    if (!supabase.auth.user() || !userWithCourse?.state) return

    const newVideo = playlist.find(v => v.order === number)
    setCurrentVideo(newVideo || initialState)
  }

  async function toggleSubscription() {
    if (!supabase.auth.user()) return

    await supabase.from('courses_profiles').upsert({
      id: userWithCourse?.id,
      userId: supabase.auth.user()?.id,
      courseId: course.id,
      checkedLessons: [],
      state: !userWithCourse?.state
    })

    setUserWithCourse({ ...userWithCourse, state: !userWithCourse?.state })
  }

  useEffect(() => {
    async function getState() {
      const currentUser = supabase.auth.user()
      if (!currentUser) return

      const userWithCourseData = await supabase
        .from('courses_profiles')
        .select('id, courseId, checkedLessons, state')
        .eq('courseId', course.id)
        .eq('userId', currentUser?.id)

      const userWithCourse = userWithCourseData.data?.[0]

      setUserWithCourse(userWithCourse)
    }

    getState()
  }, [course.id])

  return (
    <CtxCourse.Provider
      value={{
        userWithCourse,
        setUserWithCourse,
        currentVideo,
        selectVideo,
        playlist,
        teacher,
        course,
        toggleSubscription
      }}
    >
      {children}
    </CtxCourse.Provider>
  )
}
