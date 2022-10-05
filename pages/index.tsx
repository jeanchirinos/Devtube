import type { GetServerSideProps, NextPage } from 'next'
import { supabase } from '@/src/utils/supabaseClient'
import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'
import { AiOutlineSearch } from 'react-icons/ai'
import s from '@/styles/Index.module.scss'
import { TTeacher } from '@/src/types'

type IHomeProps = {
  courses: { title: string; name: string; banner: string; teacher: TTeacher }[]
}

const Home: NextPage<IHomeProps> = ({ courses }) => {
  const [search, setSearch] = useState(/./)

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const safeSearch = e.target.value.replace(/\W/g, '')

    setSearch(new RegExp(safeSearch, 'i'))
  }

  const filteredCourses = courses.filter(course => search.test(course.title))

  return (
    <>
      <section className={s.search}>
        <form onSubmit={e => e.preventDefault()}>
          <AiOutlineSearch />
          <input aria-label='Bucador de cursos' type='search' onChange={handleChange} />
        </form>
      </section>
      <section className={s.courses}>
        {filteredCourses?.length ? (
          <div data-testid='courses-section'>
            {filteredCourses.map(({ name, title, banner, teacher }, i) => {
              const { username } = teacher

              return (
                <Link key={i} href={`/${username}/${name}`}>
                  <a>
                    <picture>
                      <Image
                        src={banner}
                        layout='fill'
                        objectFit='cover'
                        objectPosition='center'
                        alt={`Curso de ${title}`}
                      />
                    </picture>
                    <h2>{title}</h2>
                  </a>
                </Link>
              )
            })}
          </div>
        ) : (
          <div className={s.noResults}>
            <h2>No hay resultados</h2>
          </div>
        )}
      </section>
    </>
  )
}

export default Home

export const getServerSideProps: GetServerSideProps = async () => {
  const { data, error } = await supabase
    .from('courses')
    .select('name, title, banner, teacher:profiles(username, avatar)')

  if (error) console.error(error)

  return { props: { courses: data } }
}
