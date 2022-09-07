export type IYoutubeVideo = {
  id: string
  snippet: {
    title: string
  }
  contentDetails: {
    duration: string
  }
}

export type TCurrentVideo = {
  embeddedLink: string
  title: string
  duration: string
  number: string
  link: string
}
