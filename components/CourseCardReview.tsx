import Image from 'next/image'
import Link from 'next/link'
import { TSubscribedCourse } from '@/pages/[user]'
import s from './CourseCard.module.scss'
import { useRef, useState } from 'react'
import { supabase } from '@/src/utils/supabaseClient'
import { showToast } from '@/src/functions'

export default function CourseCardReview(props: TSubscribedCourse) {
  const { course } = props

  const dialog = useRef<HTMLDialogElement>(null)

  // const [hasRating, setHasRating] = useState(props.stars > 0)
  const hasRating = props.stars > 0

  const STATUS = hasRating
    ? { text: 'Ver calificación' }
    : {
        text: 'Calificar'
      }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()

    dialog.current?.close()

    const formData = new FormData(e.currentTarget)
    const { starsRate, comment } = Object.fromEntries(formData)

    const stars = Number(starsRate)

    const { error } = await supabase
      .from('courses_profiles')
      .update({ stars, comment })
      .eq('id', props.id)

    if (error) {
      console.error(error)
      showToast('error', 'Hubo un error')
      return
    }

    // setHasRating(true)

    showToast('success', 'Calificación enviada')
  }

  return (
    <>
      <div>
        <Link href={`/${course.teacher.username}/${course.name}`}>
          <a>
            <article>
              <picture>
                <Image src={course.banner} alt='Curso' width={250} height={140.625} />
              </picture>
              <div>
                <p>{course.title}</p>
                <span className={s.completed}>Completado</span>
              </div>
            </article>
          </a>
        </Link>
        <button onClick={() => dialog.current?.showModal()}>{STATUS.text}</button>

        <dialog ref={dialog}>
          {hasRating ? (
            <div>
              <div>
                <span>Puntuación : </span>
                <span>{props.stars}</span>
              </div>
              <div>
                <p>Comentario: </p>
                <br />
                <p>{props.comment}</p>
              </div>

              <div className='options'>
                <button type='button' onClick={() => dialog.current?.close()}>
                  Cerrar
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <div>
                <span>Puntuación : </span>
                <input type='number' min={1} max={5} required name='starsRate' />
              </div>
              <div>
                <p>Comentario: </p>
                <br />
                <textarea rows={5} name='comment' required></textarea>
              </div>

              <div className='options'>
                <button type='button' onClick={() => dialog.current?.close()}>
                  Cerrar
                </button>
                <button className='main-btn'>Calificar</button>
              </div>
            </form>
          )}
        </dialog>
      </div>

      <style jsx>
        {`
          dialog {
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
          }

          dialog form {
            display: flex;
            flex-direction: column;
            row-gap: 1rem;
            color: gray;
          }

          dialog :where(input, textarea) {
            color: gray;
          }

          dialog textarea {
            width: 100%;
            resize: none;
          }

          .options {
            display: flex;
            column-gap: 1rem;
          }
        `}
      </style>
    </>
  )
}
