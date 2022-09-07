import type { GetServerSideProps, NextPage } from 'next'
import Search from 'components/Search'
import { supabase } from 'utils/supabaseClient'

export type SearchProps = {
  courses: [
    {
      title: string
      name: string
      banner: string
      profiles: {
        username: string
      }
    }
  ]
}
const Home: NextPage<SearchProps> = ({ courses }) => {
  return <Search courses={courses} />
}

export default Home

export const getServerSideProps: GetServerSideProps = async () => {
  let courses

  try {
    const supabaseData = await supabase
      .from('courses')
      .select('name, title, banner, profiles(username)')
    courses = supabaseData.data

    console.log(supabaseData.data)
  } catch (err) {
    console.error(err)
  }

  return { props: { courses } }
}
