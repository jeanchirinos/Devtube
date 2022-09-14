import s from './CourseForm.module.scss'
import { supabase } from 'utils/supabaseClient'
// import { showToast } from 'functions'
import Image from 'next/image'
import { useState } from 'react'

export default function CourseForm() {
  const [image, setImage] = useState({
    file: new File([], ''),
    url: ''
  })

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

      const bannersPath =
        'https://mkodcltydsdztnykjkna.supabase.co/storage/v1/object/public/banners'

      const imageName = `${name}-${user?.id}`
      const banner = `${bannersPath}/${imageName}`

      await supabase
        .from('courses')
        .insert({ name, title, videos: urlsArrayWithNumber, userId: user?.id, banner })

      await supabase.storage.from('banners').upload(imageName, image.file)
    } catch (err) {
      console.error(err)
    }
  }

  async function uploadBanner(e: React.ChangeEvent<HTMLInputElement>) {
    if (!e.target.files || e.target.files.length === 0) {
      // showToast('error', 'Ingresa una imagen')
      return
    }

    const file = e.target.files[0]
    if (file) setImage({ file, url: URL.createObjectURL(file) })
  }

  return (
    <>
      <form className={s.form} onSubmit={handleSubmit}>
        <input
          type='file'
          id='banner'
          accept='image/*'
          onChange={uploadBanner}
          required
          aria-label='Banner de curso'
        />
        <label htmlFor='banner'>
          {image.url ? (
            <Image
              id='image'
              src={image.url}
              alt='Previsualización del banner'
              layout='fill'
              objectFit='cover'
              objectPosition='center'
              priority
            />
          ) : (
            <p>Sube una imagen</p>
          )}
        </label>
        <input type='text' name='title' required placeholder='Nombre de curso' />
        <textarea
          name='urls'
          placeholder='url; url; url ...'
          cols={30}
          rows={10}
          required
        ></textarea>
        <button className='main-btn'>Crear</button>
      </form>
    </>
  )
}
