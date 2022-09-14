import CoursePresentation from 'components/CoursePresentation'
import VideoPlayer from 'components/VideoPlayer'
import CourseContext from 'context/CourseContext'
import { GetServerSideProps, NextPage } from 'next'
import { ParsedUrlQuery } from 'querystring'
import { IYoutubeVideo, Lesson, TCourse, TCurrentVideo } from 'types'
import { supabase } from 'utils/supabaseClient'

export interface CourseProps {
  teacher: {
    name: string
    avatar: string
  }
  playlist: TCurrentVideo[]
  course: TCourse
}

const Course: NextPage<CourseProps> = props => {
  return (
    <CourseContext {...props}>
      <VideoPlayer />
      <CoursePresentation />
    </CourseContext>
  )
}

export default Course

interface Params extends ParsedUrlQuery {
  user: string
  course: string
}

export const getServerSideProps: GetServerSideProps<CourseProps, Params> = async ({ params }) => {
  const { user: userRoute, course: courseRoute } = params!

  let teacher
  let course: TCourse
  let lessons: Lesson[]
  let videosIds

  try {
    // COURSE
    const courseData = await supabase
      .from('courses')
      .select('id, name, title, banner, profiles(name, avatar)')
      .eq('name', courseRoute)
      .eq('profiles.username', userRoute)

    course = courseData.data?.[0]
    teacher = course.profiles

    // CLASSES
    const lessonsData = await supabase
      .from('classes')
      .select('id, identifier, order')
      .eq('courseId', course.id)

    lessons = lessonsData.data as Lesson[]

    videosIds = lessons.map(v => v.identifier).join('&id=')
  } catch (err) {
    console.error(err)
    return { notFound: true }
  }

  //? YOUTUBE API
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

    const lesson = lessons.find(c => c.identifier === id)

    return { embeddedLink, title, duration, ...lesson }
  })

  //? PAGE PROPS
  return { props: { teacher, playlist, course } }
}
