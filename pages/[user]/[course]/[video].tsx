import type { GetServerSideProps, NextPage } from 'next'
import Image from 'next/image'
import s from '../../../styles/Course.module.scss'
import Link from 'next/link'
import { MdCloseFullscreen } from 'react-icons/md'
import { IYoutubeVideo, TCurrentVideo } from 'types'
import { supabase } from 'utils/supabaseClient'

interface Props {
  user: {
    name: string
    avatar: string
  }
  currentVideo: TCurrentVideo
  playlist: TCurrentVideo[]
}

const Course: NextPage<Props> = ({ user, currentVideo, playlist }) => {
  function hidePlaylist() {
    const main = document.querySelector('main')
    main?.classList.toggle(s.withoutPlaylist)
  }

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
              {currentVideo.number} - {currentVideo.title}
            </h2>
            <article>
              <Image
                width={32}
                height={32}
                src={user.avatar}
                alt='Avatar de profesor'
                className='avatar'
              />
              <span>{user.name}</span>
            </article>
          </div>
          <div className={s.videos}>
            {playlist.map(({ number, link, title, duration }) => (
              <Link key={number} href={link}>
                <a className={currentVideo.number === number ? s.selected : ''}>
                  <span>{number}</span>
                  <p>{title} </p>
                  <span>{duration}</span>
                </a>
              </Link>
            ))}
          </div>
        </section>
      </main>
    </>
  )
}

export default Course

type TParams = {
  user: string
  course: string
  video: string
}

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  const { user: userRoute, course: courseRoute, video: videoRoute } = params as TParams

  type Video = {
    id: string
    number: string
  }

  type Course = {
    videos: Video[]
    profiles: {
      name: string
      avatar: string
    }
  }

  let videos: Video[]
  let videosIds
  let user

  try {
    const supabaseData = await supabase
      .from('courses')
      .select('videos, profiles(name, avatar)')
      .eq('name', courseRoute)
      .eq('profiles.username', userRoute)

    const course = supabaseData.data?.[0] as unknown as Course

    videos = course.videos

    videosIds = videos.map(v => v.id).join('&id=')
    user = course.profiles
  } catch (error) {
    console.error(error)
    return { notFound: true }
  }

  // Fetch data from external API
  const result = await fetch(
    `https://youtube.googleapis.com/youtube/v3/videos?part=snippet&part=contentDetails&id=${videosIds}&key=AIzaSyBHARXZIpGTuKEb2Yqw58aRm51lV1IggiI`
  )

  const data = await result.json()
  if (!data) return { notFound: true }

  const playlist = data.items.map((ytVideo: IYoutubeVideo) => {
    const { id, snippet, contentDetails } = ytVideo

    const { title } = snippet
    let { duration } = contentDetails

    duration = duration.replace(/PT|S/g, '').replace('M', ':')

    const embeddedLink = `https://www.youtube.com/embed/${id}?autoplay=1`
    const number = videos.find(v => v.id === id)?.number

    const link = `/${userRoute}/${courseRoute}/${number}`

    return { embeddedLink, title, duration, number, link }
  })

  const currentVideo = playlist.find((v: TCurrentVideo) => String(v.number) === videoRoute)

  // Pass data to the page via props
  return { props: { user, currentVideo, playlist } }
}
