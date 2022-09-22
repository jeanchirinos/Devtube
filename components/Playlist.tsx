import { BsCheck } from 'react-icons/bs'
import { useContext } from 'react'
import { CtxCourse } from '@/src/context/CourseContext'
import { supabase } from '@/src/utils/supabaseClient'
import { showToast } from '@/src/functions'

export default function Playlist() {
  const { currentVideo, selectVideo, lessons, userWithCourse, setUserWithCourse } =
    useContext(CtxCourse)
  const { checkedLessons } = userWithCourse

  const isSelected = (number: string) => (currentVideo.order === number ? 'selected' : '')

  async function toggleVisibility(id: string) {
    // if (!supabase.auth.user() || !userWithCourse?.state) return
    if (!supabase.auth.user() || !userWithCourse?.state) {
      showToast('warning', 'Inscríbete al curso para seguir tu progreso')
      return
    }

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
      {lessons.map(({ order, title, duration, id }) => {
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
