import Image from 'next/image'
import Link from 'next/link'
import s from './Header.module.scss'
import UserStatus from './UserStatus'

export default function Header() {
  return (
    <header className={s.header}>
      <nav>
        <Link href='/' aria-label='Inicio'>
          <a>
            <Image src='/svg/logo.svg' width={48} height={48} alt='Logo' />
          </a>
        </Link>
        <UserStatus />
      </nav>
    </header>
  )
}
