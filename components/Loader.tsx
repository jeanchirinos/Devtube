import s from './Loader.module.scss'

export default function Loader() {
  return (
    <div className={s.loader} data-testid='loader'>
      <span></span>
    </div>
  )
}
