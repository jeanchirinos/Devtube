import Playlist from './Playlist'
import s from './CoursePresentation.module.scss'
import Image from 'next/image'
import { useContext } from 'react'
import { CtxCourse } from 'context/CourseContext'

export default function CoursePresentation() {
  const { teacher, course, userWithCourse, toggleSubscription, currentVideo } =
    useContext(CtxCourse)
  const { avatar, name } = teacher
  const { banner, title } = course

  const subscriptionState = userWithCourse?.state
    ? {
        className: `secondary-btn`,
        text: 'Inscrito'
      }
    : {
        className: 'main-btn',
        text: 'Inscribirse'
      }

  return !currentVideo?.id ? (
    <main className={s.main}>
      <section>
        <Image src={banner} alt='Banner de curso' width={400} height={225} />
        <div>
          <h1>{title}</h1>
          <aside>
            <Image src={avatar} className='avatar' alt='' width={32} height={32} />
            <p>{name}</p>
          </aside>
          <p className={s.description}>
            Lorem, ipsum dolor sit amet consectetur adipisicing elit. Ullam molestiae omnis culpa,
          </p>
          <button className={subscriptionState.className} onClick={toggleSubscription}>
            {subscriptionState.text}
          </button>
        </div>
      </section>
      <Playlist />
    </main>
  ) : (
    <></>
  )
}
