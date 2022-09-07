import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'
import { AiOutlineSearch } from 'react-icons/ai'
import { SearchProps } from '../../pages'
import s from './Search.module.scss'

export default function Search({ courses }: SearchProps) {
  const [search, setSearch] = useState(/./)

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const safeSearch = e.target.value.replace(/\W/g, '')

    setSearch(new RegExp(safeSearch, 'i'))
  }
  const filteredCourses = courses?.filter(course => search.test(course.name))

  return (
    <>
      <section className={s.search}>
        <form>
          <AiOutlineSearch />
          <input aria-label='Bucador de cursos' type='search' onChange={handleChange} />
        </form>
      </section>
      <section className={s.courses}>
        {filteredCourses?.length ? (
          <div>
            {filteredCourses.map(({ name, title, banner, profiles }, i) => {
              const { username } = profiles

              return (
                <Link key={i} href={`/${username}/${name}/1`}>
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
