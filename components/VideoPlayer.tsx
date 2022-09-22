import Image from 'next/image'
import s from '@/styles/Course.module.scss'
import { MdCloseFullscreen } from 'react-icons/md'
import Playlist from './Playlist'
import { useCourse } from '@/src/context/CourseContext'

export default function VideoPlayer() {
  const { teacher, course, currentVideo, selectVideo } = useCourse()

  function hidePlaylist() {
    const main = document.querySelector('main')
    main?.classList.toggle(s.withoutPlaylist)
  }

  if (!currentVideo?.id) return <></>

  return (
    <>
      <button className={s.toggle} onClick={hidePlaylist}>
        <MdCloseFullscreen size={18} />
      </button>
      <main className={s.main}>
        <iframe
          className={s.iframe}
          src={currentVideo.embeddedLink}
          frameBorder='0'
          allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture'
          allowFullScreen
          title={currentVideo.title}
        ></iframe>
        <section className={s.playlist}>
          <div className={s.currentVideo}>
            <h2>
              {currentVideo.order} - {currentVideo.title}
            </h2>
            <article>
              <Image
                width={32}
                height={32}
                src={teacher.avatar}
                alt='Avatar de profesor'
                className='avatar'
              />
              <span>{teacher.username}</span>
              <button onClick={() => selectVideo('0')}>{course.title}</button>
            </article>
          </div>
          <Playlist />
        </section>
      </main>
    </>
  )
}
