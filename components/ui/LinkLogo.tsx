import Image from 'next/image'
import Link from 'next/link'

export const LinkLogo = () => {
  return (
    <Link href={ '/' } passHref>
      <a>
        <Image priority src={ '/dog.png' } alt={ 'doggie' } width={ 32 } height={ 32 } />
          Mi Primer Rescate
      </a>
    </Link>
  )
}
