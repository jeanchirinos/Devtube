import Playlist from './Playlist'
import s from './CoursePresentation.module.scss'
import Image from 'next/image'
import { useCourse } from '@/src/context/CourseContext'
import { useSession } from '@/src/context/SessionContext'
import Link from 'next/link'

export default function CoursePresentation() {
  const { currentUser } = useSession()
  const { teacher, course, userWithCourse, toggleSubscription, currentVideo } = useCourse()
  const { avatar, username } = teacher
  const { banner, title, description } = course

  const subscriptionState = userWithCourse?.state
    ? {
        className: `secondary-btn`,
        text: 'Inscrito'
      }
    : {
        className: 'main-btn',
        text: 'Inscribirse'
      }

  if (currentVideo?.id) return <></>

  return (
    <main className={s.main}>
      <section>
        <Image src={banner} alt='Banner de curso' width={400} height={225} />
        <div>
          <h1>{title}</h1>
          <aside>
            <Image
              src={avatar}
              className='avatar'
              alt='Avatar de profesor'
              width={32}
              height={32}
            />
            <Link href={`/${username}`}>
              <a>{username}</a>
            </Link>
          </aside>
          <p className={s.description}>{description}</p>
          {!(currentUser?.username === teacher.username) && (
            <button className={subscriptionState.className} onClick={toggleSubscription}>
              {subscriptionState.text}
            </button>
          )}
        </div>
      </section>
      <Playlist />
    </main>
  )
}
