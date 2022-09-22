import Image from 'next/image'
import Link from 'next/link'
import { TSubscribedCourse, TOwnCourse } from '@/pages/[user]'
import s from './CourseCard.module.scss'

export default function CourseCard(props: TSubscribedCourse | TOwnCourse) {
  let course: TOwnCourse

  const isInstanceOfTSubscribedCourse = 'course' in props

  if (isInstanceOfTSubscribedCourse) {
    course = props.course
  } else {
    course = props
  }

  function getStatus() {
    if (!isInstanceOfTSubscribedCourse) return <></>

    const number = course.lessonsCount[0].count

    const STATUS =
      props.checkedLessons.length === number
        ? {
            text: 'Completado',
            classname: s.completed
          }
        : {
            text: 'En curso',
            classname: s.incomplete
          }

    return <span className={STATUS.classname}>{STATUS.text}</span>
  }

  return (
    <Link href={`/${course.teacher.username}/${course.name}`}>
      <a>
        <article>
          <picture>
            <Image src={course.banner} alt='Curso' width={250} height={140.625} />
          </picture>
          <div>
            <p>{course.title}</p>
            {getStatus()}
          </div>
        </article>
      </a>
    </Link>
  )
}
