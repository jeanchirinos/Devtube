import { BsCheck } from 'react-icons/bs'
import { useContext } from 'react'
import { CtxCourse } from 'context/CourseContext'
import { supabase } from 'utils/supabaseClient'

export default function Playlist() {
  const { currentVideo, selectVideo, playlist, userWithCourse, setUserWithCourse } =
    useContext(CtxCourse)
  const { checkedLessons } = userWithCourse

  const isSelected = (number: string) => (currentVideo.order === number ? 'selected' : '')

  async function toggleVisibility(id: string) {
    if (!supabase.auth.user() || !userWithCourse?.state) return

    if (checkedLessons.includes(id)) {
      const index = checkedLessons.indexOf(id)
      checkedLessons.splice(index, 1)
    } else {
      checkedLessons.push(id)
    }

    setUserWithCourse({ ...userWithCourse, checkedLessons })

    await supabase
      .from('courses_profiles')
      .update({
        checkedLessons
      })
      .eq('id', userWithCourse.id)
  }

  return (
    <div className='videos'>
      {playlist.map(({ order, title, duration, id }) => {
        const className = checkedLessons?.includes(id) ? 'btn-done' : 'btn-undone'

        return (
          <picture key={order} className={isSelected(order)}>
            <button id='btn-video' onClick={() => selectVideo(order)}>
              <span>{order}</span>
              <p>{title}</p>
              <span>{duration}</span>
            </button>
            <button className={className} onClick={() => toggleVisibility(id)}>
              <BsCheck />
            </button>
          </picture>
        )
      })}
    </div>
  )
}
