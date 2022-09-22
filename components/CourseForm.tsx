import s from './CourseForm.module.scss'
import { supabase } from '@/src/utils/supabaseClient'
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
    const description = form.description === '' ? 'Sin descripción' : form.description

    let urls = form.urls as string
    urls = urls.replace(/\s/g, '')
    const urlsArray = urls.split(';')

    try {
      const user = supabase.auth.user()

      if (!user) return

      const bannersPath =
        'https://mkodcltydsdztnykjkna.supabase.co/storage/v1/object/public/banners'

      let imageName = `${name}-${user?.id}`
      imageName = imageName
        .replace(/ñ/g, 'n')
        .replace(/á/g, 'a')
        .replace(/é/g, 'e')
        .replace(/í/g, 'i')
        .replace(/ó/g, 'o')
        .replace(/ú/g, 'u')
      const banner = `${bannersPath}/${imageName}`

      const { data, error } = await supabase
        .from('courses')
        .insert({ name, title, userId: user.id, banner, description })
        .single()

      if (error) {
        console.error(error)
        return
      }

      const urlsArrayWithNumber = urlsArray.map((url, index) => ({
        identifier: url,
        order: index + 1,
        courseId: data.id
      }))

      await supabase.from('lessons').insert(urlsArrayWithNumber)

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
          cols={10}
          rows={3}
          required
        ></textarea>
        <textarea name='description' placeholder='Descripción' cols={10} rows={2}></textarea>
        <button className='main-btn'>Crear</button>
      </form>
    </>
  )
}
