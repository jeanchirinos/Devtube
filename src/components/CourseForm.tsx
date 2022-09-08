import s from './CourseForm.module.scss'
import { supabase } from 'utils/supabaseClient'

export default function CourseForm() {
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

      await supabase
        .from('courses')
        .insert({ name, title, videos: urlsArrayWithNumber, userId: user?.id })
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <form className={s.form} onSubmit={handleSubmit}>
      <input type='text' name='title' required placeholder='Nombre de curso' />
      <textarea name='urls' placeholder='url; url; url ...' cols={30} rows={10} required></textarea>
      <button className='main-btn'>Crear</button>
    </form>
  )
}
