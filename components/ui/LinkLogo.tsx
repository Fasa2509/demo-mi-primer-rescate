import { FC } from 'react'
import Link from 'next/link'
import Image from 'next/image'

export const LinkLogo: FC = () => {
  return (
    <Link href={ '/' } passHref>
      <a style={{ display: 'flex', gap: '.3rem' }}>
        <Image priority src={ '/favicon.ico' } alt={ 'doggie' } width={ 32 } height={ 32 } />
          Mi Primer Rescate
      </a>
    </Link>
  )
}
