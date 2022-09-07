interface Video {
  id: string
  number: string
}

export interface ICourse {
  id: string
  name: string
  user: string
  videos: Video[]
}

export const courses: ICourse[] = [
  {
    id: 'html',
    name: 'Html',
    user: '1',
    videos: [
      {
        id: 'Xsxm8_BI63s',
        number: '1'
      },
      {
        id: 'OpodKCR6P-M',
        number: '2'
      },
      {
        id: 'gSSjhChWYK4',
        number: '3'
      },
      {
        id: 'VTkDuQ9RLVU',
        number: '4'
      }
    ]
  }
]
