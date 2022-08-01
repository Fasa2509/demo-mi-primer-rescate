import { FC } from 'react'
import { useRouter } from 'next/router';
import Image from 'next/image'

import styles from './HeroWelcome.module.css'

export const HeroWelcome: FC = () => {
  const router = useRouter();

  return (
    <div id='hero-welcome' className={ styles.hero__image }>
        <Image
          priority
          src={ '/dog-hero-image.webp' }
          alt={ 'Dog Hero Image' }
          layout={ 'responsive' }
          width={ 1280 }
          height={ 720 }
        />
        <div className={ styles.hero__text }>
          <div className={ styles.hero__image__card }>
            <p className={ styles.subtitle }>Nuestra labor</p>
            <p>Ayudar a quien lo necesite</p>
            <button className={ styles.hero__image__button } onClick={ () => router.push('/apoyo') }>Apóyanos!</button>
          </div>
        </div>
    </div>
  )
}
