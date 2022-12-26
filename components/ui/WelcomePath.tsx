import { useEffect } from 'react';
import FoundationTwoTone from '@mui/icons-material/FoundationTwoTone';
import Groups from '@mui/icons-material/Groups';
import PetsOutlined from '@mui/icons-material/PetsOutlined';
import Yard from '@mui/icons-material/Yard';
import styles from './WelcomePath.module.css';

const callback = ( entries: any ) => entries.forEach(( entry: any ) => ( entry.isIntersecting )
    ? entry.target.classList.add( styles.active )
    : entry.target.classList.remove( styles.active )
)

export const WelcomePath = () => {
    
    useEffect(() => {
        const observer = new IntersectionObserver(callback, {
            threshold: 0,
        });

        document.querySelectorAll('#WelcomePath .observe').forEach( element => observer.observe( element ));
        return () => observer.disconnect();
    }, []);

  return (
    <section id={ 'WelcomePath' } className={ styles.container }>

        <div className={ styles.title + ' observe' }>
            <p>
                Quiénes somos y qué hacemos <PetsOutlined sx={{ fontSize: '3rem', transform: 'translateY(.8rem)' }} />
            </p>
        </div>

        <div className={ styles.content__container }>
            <div className={ styles.content__1 + ' observe' }>
                <div className={ styles.content__wing }><Groups /><div /></div>
                <p>Nuestro equipo de Mi Primer Rescate está formado por un grupo de voluntarios que se dedican a realizar la labor sin ningún tipo de fin de lucro.</p>
            </div>
            <div className={ styles.content__2 + ' observe' }>
                <div className={ styles.content__wing }><div /><FoundationTwoTone /></div>
                <p>Liderada de la mano de Nieves Peña, quien es la fundadora y pionera de este proyecto; la fundación tiene como propósito...</p>
            </div>
            <div className={ styles.content__3 + ' observe' }>
                <div className={ styles.content__wing }><Yard /><div /></div>
                <p><span className={ styles.underline }>Proteger</span> y ayudar a los animales que así lo necesiten</p>
                <p><span className={ styles.underline }>Disminuir</span> la sobrepoblación de los peludos en la calle</p>
                <p><span className={ styles.underline }>Acobijar</span> a las mascotas abandonadas y en situación de calle</p>
                <p><span className={ styles.underline }>Marcar</span> una pauta de respeto y concientización en todo el país, especialmente donde realizamos la labor (Carabobo/Venezuela) y a donde podamos llegar al rededor del mundo</p>
            </div>
        </div>
    </section>
  )
}