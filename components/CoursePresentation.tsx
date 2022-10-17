import Playlist from './Playlist'
import s from './CoursePresentation.module.scss'
import Image from 'next/image'
import { useCourse } from '@/src/context/CourseContext'
// import { useSession } from '@/src/context/SessionContext'
import Link from 'next/link'
import { useState } from 'react'
import Reviews from './Reviews'
import { AiFillStar } from 'react-icons/ai'

export default function CoursePresentation() {
  // const { currentUser } = useSession()
  const { teacher, course, reviews, userWithCourse, toggleSubscription, currentVideo } = useCourse()
  const { avatar, username } = teacher
  const { banner, title, description } = course

  const [lessonsSelected, setLessonsSelected] = useState(true)

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

  //

  const filteredReviews = reviews.filter(review => review.stars > 0)
  let stars =
    filteredReviews.reduce((acc, review) => acc + review.stars, 0) / filteredReviews.length

  stars = isNaN(stars) ? 0 : Number(stars.toFixed(0))

  return (
    <>
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
            <span>
              {Array.from({ length: stars }).map((_, i) => (
                <AiFillStar key={i} fill='yellow' />
              ))}
            </span>
            <p className={s.description}>{description}</p>
            {/* {!(currentUser?.username === teacher.username) && (
              <button className={subscriptionState.className} onClick={toggleSubscription}>
                {subscriptionState.text}
              </button>
            )} */}

            <button className={subscriptionState.className} onClick={toggleSubscription}>
              {subscriptionState.text}
            </button>
          </div>
        </section>

        <div className='tabs'>
          <button onClick={() => setLessonsSelected(true)}>Clases</button>
          <button onClick={() => setLessonsSelected(false)}>Reviews</button>
        </div>

        {lessonsSelected ? <Playlist /> : <Reviews />}
      </main>

      <style jsx>{`
        .tabs {
          display: flex;
          flex-direction: row;
          margin-bottom: 1rem;
        }

        .tabs > * {
          flex-grow: 1;
          border: 1px solid var(--border);
          padding-block: 0.5rem;
        }

        .tabs > *:hover {
          opacity: 0.8;
        }
      `}</style>
    </>
  )
}
