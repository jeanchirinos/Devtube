export type TYoutubeVideo = {
  id: string
  snippet: {
    title: string
  }
  contentDetails: {
    duration: string
  }
}

export interface IUserWithCourse {
  id: string
  courseId: string
  checkedLessons: string[]
  state: boolean
}

export interface TCourse {
  id: string
  name: string
  title: string
  banner: string
  description: string
}

export type TTeacher = {
  username: string
  avatar: string
}

export type TLesson = {
  id: string
  identifier: string
  order: string
  embeddedLink: string
  title: string
  duration: string
}
