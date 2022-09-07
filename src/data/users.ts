export interface IUser {
  id: string
  nickname: string
  avatar: string
  name: string
  courses: string[]
}

export const users: IUser[] = [
  {
    id: '1',
    nickname: 'jeanchirinos17',
    avatar: '/img/avatar.jpg',
    name: 'Jean Chirinos',
    courses: ['html']
  }
]
