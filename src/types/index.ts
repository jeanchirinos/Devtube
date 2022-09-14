export type IYoutubeVideo = {
  id: string
  snippet: {
    title: string
  }
  contentDetails: {
    duration: string
  }
}

export interface Lesson {
  id: string
  identifier: string
  order: string
}

export interface TCurrentVideo extends Lesson {
  embeddedLink: string
  title: string
  duration: string
}

export interface TCourse {
  id: string
  name: string
  title: string
  banner: string
  profiles: {
    name: string
    avatar: string
  }
}

export interface TUserWithCourse {
  id: string
  courseId: string
  checkedLessons: string[]
  state: boolean
}
