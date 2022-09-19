import { useEffect } from "react"
import { FoundationTwoTone, Groups, PetsOutlined, Yard } from "@mui/icons-material"
import styles from './WelcomePath.module.css'

const callback = ( entries: any ) => {
    entries.forEach(( entry: any )  => {
        if ( entry.isIntersecting ) {
            entry.target.classList.add(`${styles.active}`)
        } else {
            entry.target.classList.remove(`${styles.active}`)
        }
    })
}

export const WelcomePath = () => {
    
    useEffect(() => {
        const observer = new IntersectionObserver(callback, {
            threshold: 0,
        });

        document.querySelectorAll('#WelcomePath > div').forEach( element => observer.observe( element ))
    }, [])

  return (
    <section id={ 'WelcomePath' } className={ styles.container }>
        {/* <div className={ styles.custom__shape__divider }>
            <svg data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none">
                <path d="M0,0V7.23C0,65.52,268.63,112.77,600,112.77S1200,65.52,1200,7.23V0Z" className={ styles.shape__fill }></path>
            </svg>
        </div> */}

        <div className={ styles.title }>
            <p>
                Quiénes somos y qué hacemos <PetsOutlined sx={{ fontSize: '3rem', transform: 'translateY(.8rem)' }} />
            </p>
        </div>
        <div className={ styles.background }></div>

        <div className={ styles.content__1 }>
            <div className={ styles.content__wing }><Groups /><div /></div>
            <p>Nuestro equipo de Mi Primer Rescate está formado por un grupo de voluntarios que se dedican a realizar la labor sin ningún fin de lucro</p>
        </div>
        <div className={ styles.content__2 }>
            <div className={ styles.content__wing }><div /><FoundationTwoTone /></div>
            <p>Liderada de la mano de Nieves Peña, quien es la fundadora y pionera de este proyecto; la fundación tiene como propósito...</p>
        </div>
        <div className={ styles.content__3 }>
            <div className={ styles.content__wing }><Yard /><div /></div>
            <p><span className={ styles.underline }>Proteger</span> y ayudar a los animales que así lo necesiten</p>
            <p><span className={ styles.underline }>Disminuir</span> la sobrepoblación de los peludos en la calle</p>
            <p><span className={ styles.underline }>Acobijar</span> a las mascotas abandonadas y en situación de calle</p>
            <p><span className={ styles.underline }>Marcar</span> una pauta de respeto y concientización en todo el país, especialmente donde realizamos la labor (Carabobo/ Venezuela) y a donde podamos llegar al rededor del mundo</p>
        </div>
    </section>
  )
}