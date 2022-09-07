import s from './CourseForm.module.scss'
// import { useState } from 'react'
import { supabase } from 'utils/supabaseClient'
// import { MdAdd } from 'react-icons/md'

export default function CourseForm() {
  // const [videoInputs, setVideoInputs] = useState([''])

  // function addVideoInput() {
  //   setVideoInputs([...videoInputs, ''])
  // }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()

    const form = Object.fromEntries(new FormData(e.currentTarget))
    const title = form.title as string
    const name = title.toLowerCase().replace(/\s/g, '_')

    let urls = form.urls as string
    urls = urls.replace(/\s/g, '')
    const urlsArray = urls.split(';')
    const urlsArrayWithNumber = urlsArray.map((url, index) => ({ id: url, number: index + 1 }))

    try {
      const user = supabase.auth.user()

      const result = await supabase
        .from('courses')
        .insert({ name, title, videos: urlsArrayWithNumber, userId: user?.id })

      console.log(result)
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <form className={s.form} onSubmit={handleSubmit}>
      <input type='text' name='title' required placeholder='Nombre de curso' />

      <textarea name='urls' placeholder='url; url; url ...' cols={30} rows={10} required></textarea>

      {/* {videoInputs.map((v, index) => (
        <div key={index}>
          <input type='url' name='url' required placeholder={`Url ${index + 1}`} />
          <button type='button' onClick={addVideoInput}>
            <MdAdd />
          </button>
        </div>
      ))} */}

      <button className='main-btn'>Crear</button>
    </form>
  )
}
