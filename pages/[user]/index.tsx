import CourseCard from '@/components/CourseCard'
import { GetServerSideProps, NextPage } from 'next'
import Image from 'next/image'
import { supabase } from '@/src/utils/supabaseClient'
import s from '@/styles/User.module.scss'

export interface TOwnCourse {
  id: string
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
}

export interface IUserPageProps {
  subscribedCourses: TSubscribedCourse[]
  ownCourses: TOwnCourse[]
}

const User: NextPage<IUserPageProps> = props => {
  const { subscribedCourses, ownCourses } = props

  return (
    <main className={s.main}>
      {ownCourses?.length > 0 && (
        <section>
          <article className={s.user}>
            <Image
              src={ownCourses[0]?.teacher.avatar}
              alt='Avatar de usuario'
              width={32}
              height={32}
            />

            <p>{ownCourses[0].teacher.username}</p>
          </article>
        </section>
      )}

      <section>
        <h2>Mis cursos</h2>
        <div className={s.courses}>
          {ownCourses.map(course => (
            <CourseCard key={course.id} {...course} />
          ))}
        </div>
      </section>
      <section>
        <h2>Cursos inscritos</h2>
        <div className={s.courses}>
          {subscribedCourses.map(course => (
            <CourseCard key={course.id} {...course} />
          ))}
        </div>
      </section>
    </main>
  )
}

export default User

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  const { user } = params!

  const { data: subscribedCourses, error } = await supabase
    .from('courses_profiles')
    .select(
      'id, profiles!inner(username), checkedLessons, course:courses!inner(name, title, banner, teacher:profiles!inner(username, avatar), lessonsCount: lessons!inner(count))'
    )
    .eq('profiles.username', user)
    .eq('state', true)
    .neq('course.teacher.username', user)

  if (error) {
    console.error(error)
    return { notFound: true }
  }

  const { data: ownCourses, error: error2 } = await supabase
    .from('courses')
    .select('id,  name, title, banner, teacher:profiles!inner(username, avatar)')
    .eq('teacher.username', user)

  if (error2) {
    console.error(error2)
    return { notFound: true }
  }

  return { props: { subscribedCourses, ownCourses } }
}
