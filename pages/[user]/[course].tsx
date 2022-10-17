import CoursePresentation from '@/components/CoursePresentation'
import VideoPlayer from '@/components/VideoPlayer'
import CourseContext from '@/src/context/CourseContext'
import { GetServerSideProps, NextPage } from 'next'
import { ParsedUrlQuery } from 'querystring'
import { TYoutubeVideo, TCourse, TLesson, TTeacher } from '@/src/types'
import { supabase } from '@/src/utils/supabaseClient'

export interface ICourseProps {
  course: TCourse
  teacher: TTeacher
  lessons: TLesson[]
  reviews: {
    id: number
    stars: number
    comment: string
    user: {
      username: string
      avatar: string
    }
  }[]
}

const Course: NextPage<ICourseProps> = props => {
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

export const getServerSideProps: GetServerSideProps<ICourseProps, Params> = async ({ params }) => {
  const { user: userParam, course: courseParam } = params!

  const { data: supabaseData, error } = await supabase
    .from('courses')
    .select(
      'id, name, title, banner, description, teacher:profiles!inner(username, avatar), lessons!inner(id, identifier, order), reviews:courses_profiles!inner(id, stars, comment, user:profiles!inner(username, avatar)) '
    )
    .eq('profiles.username', userParam)
    .eq('name', courseParam)
    .single()

  if (error) {
    console.error(error)
    return { notFound: true }
  }

  // const picked = (({ id, name, title, banner }) => ({ id, name, title, banner }))(supabaseData);
  const { id, name, title, banner, description } = supabaseData

  const courseData = supabaseData as ICourseProps
  courseData.course = { id, name, title, banner, description }
  // courseData.reviews = { ...reviews }

  const videosIds = courseData.lessons.map(v => v.identifier).join('&id=')

  //? YOUTUBE API
  const youtubeData = await fetch(
    `https://youtube.googleapis.com/youtube/v3/videos?part=snippet&part=contentDetails&id=${videosIds}&key=AIzaSyBHARXZIpGTuKEb2Yqw58aRm51lV1IggiI`
  )
    .then(res => res.json())
    .catch(err => console.error(err))

  if (!youtubeData) return { notFound: true }

  courseData.lessons = youtubeData.items.map((ytVideo: TYoutubeVideo) => {
    const { id, snippet, contentDetails } = ytVideo
    const { title } = snippet
    let { duration } = contentDetails
    duration = duration.replace(/PT|S/g, '').replace('M', ':')
    const embeddedLink = `https://www.youtube.com/embed/${id}?autoplay=1&start=0`

    const lesson = courseData.lessons.find(c => c.identifier === id)

    return { ...lesson, embeddedLink, title, duration }
  })

  //? PAGE PROPS
  return { props: { ...courseData } }
}
