import CourseCard from '@/components/CourseCard'
import { GetServerSideProps, NextPage } from 'next'
import { supabase } from '@/src/utils/supabaseClient'
import s from '@/styles/User.module.scss'
import { useSession } from '@/src/context/SessionContext'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import Loader from '@/components/Loader'
import CourseCardReview from '@/components/CourseCardReview'

export interface TOwnCourse {
  id: number
  name: string
  title: string
  banner: string
  teacher: {
    username: string
    avatar: string
  }
  lessonsCount: [{ count: number }]
}

export interface TSubscribedCourse {
  id: string
  checkedLessons: string[]
  course: TOwnCourse
  stars: number
  comment: string
}

export interface IUserPageProps {
  subscribedCourses: TSubscribedCourse[]
}

const Home: NextPage<IUserPageProps> = props => {
  const { subscribedCourses } = props
  const { currentUser } = useSession()

  const [isLoading, setIsLoading] = useState(true)

  const router = useRouter()

  useEffect(() => {
    if (currentUser === undefined) return
    if (currentUser === null) router.push('/login')

    if (currentUser?.username !== router.query.user) {
      router.push(`/`)
    } else {
      setIsLoading(false)
    }
  }, [currentUser])

  const completed = (c: TSubscribedCourse) =>
    c.checkedLessons.length === c.course.lessonsCount[0].count

  return isLoading ? (
    <Loader />
  ) : (
    <main className={s.main}>
      <section>
        <h2>En curso</h2>
        {/* <div className={s.courses}>
          {subscribedCourses.map(course => (
            <CourseCard key={course.id} {...course} />
          ))}
        </div> */}
        <div className={s.courses_home}>
          {subscribedCourses
            .filter(c => !completed(c))
            .map(course => (
              <CourseCard key={course.id} {...course} />
            ))}
        </div>
      </section>
      <section>
        <h2>Completado</h2>
        <div className={s.courses_home}>
          {subscribedCourses
            .filter(c => completed(c))
            .map(course => (
              <CourseCardReview key={course.id} {...course} />
            ))}
        </div>
      </section>
    </main>
  )

  // return (
  //   <main className={s.main}>
  //     <section>
  //       <h2>Cursos inscritos</h2>
  //       <div className={s.courses}>
  //         {subscribedCourses.map(course => (
  //           <CourseCard key={course.id} {...course} />
  //         ))}
  //       </div>
  //     </section>
  //   </main>
  // )
}

export default Home

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  const { user } = params!

  const { data: subscribedCourses, error } = await supabase
    .from('courses_profiles')
    .select(
      'id, profiles!inner(username), checkedLessons, stars, comment, course:courses!inner(name, title, banner, teacher:profiles!inner(username, avatar), lessonsCount: lessons!inner(count))'
    )
    .eq('profiles.username', user)
    .eq('state', true)

  if (error) {
    console.error(error)
    return { notFound: true }
  }

  return { props: { subscribedCourses } }
}
