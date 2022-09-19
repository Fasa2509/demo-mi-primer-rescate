import { useMemo } from 'react'
import { NextPage } from 'next'

import { CardText, ContentSlider, MainLayout } from '../../components'
import styles from '../../styles/ProyectoMPR.module.css'
import { Pets } from '@mui/icons-material'

const MiPrimerRescatePage: NextPage = () => {

  const text_1 = `Asignar buenos hogares que se comprometan a darles la calidad de vida que ameritan
  Ofrecer asesoramiento a nuestros seguidores para garantizar felicidad también a los peludos que ya gozan de un hogar
  Asistir a los animales que necesiten de atención veterinaria para sacarlos del dolor que puedan sentir y lograr que se sanen
  Organizar charlas y campañas que permitan llevar a cada rincón de nuestro país nuestra visión y así invitar a que más personas se unan a esta labor
  Luchar contra el maltrato y el abandono de las mascotas debido a la diáspora de personas en nuestro país y al poco conocimiento del respeto que ellos merecen
  Concientizar sobre la importancia de Castrar y esterilizar a las mascotas para evitar la sobrepoblación de animales en las calles además de garantizar larga vida y salud para la mascota
  Utilizar las redes sociales a beneficio de los animales, así también como instrumento para ayudar a personas que lo necesiten, como a los abuelos en los asilos, niños huérfanos, personas en situación de calle o en hospitales
  Llevar a cabo el Proyecto Helenden, nuestro más ambicioso proyecto hasta la fecha`

  const array_1 = useMemo(() => text_1.split('\n'), [text_1])

  return (
    <MainLayout title={ 'Nosotros' } H1={ 'Proyecto MPR' } pageDescription={ 'Te contamos quiénes somos, qué hacemos, cuáles son nuestros objetivos y lo que hacemos para conseguirlos. ¡Conócenos!' } titleIcon={ <Pets color='info' sx={{ fontSize: '1.5rem' }} /> } nextPage='/apoyo'>

        <ContentSlider title='Misión' initiallyDisplayed>
          <p>La Misión de la fundación es cumplir el ciclo MPR, el cual garantiza calidad de vida para el peludo rescatado.</p>
        </ContentSlider>

        <ContentSlider title='Objetivos' style={{ backgroundImage: 'url(/background-blob-scatter.svg), url(/wave-haikei-1.svg)', backgroundSize: 'contain', backgroundPosition: 'top left, bottom left', backgroundRepeat: 'repeat, no-repeat' }}>
          <section className={ styles.section__objectives }>
            {
              array_1.map( (txt, index) => (
                <CardText key={ index } text={ txt } index={ index + 1 } />
              ))
            }
          </section>
        </ContentSlider>

        <ContentSlider title='¿Cómo llevamos a cabo la labor?'>
          <p>En primer lugar está la identificación del caso directamente en la calle o indirectamente mediante nuestras redes sociales o terceras personas que se comunican con nosotros.</p>
          <p>En segundo lugar buscamos documentar el estado del animal para poder subir a nuestras redes sociales el caso y así buscar las herramientas inmediatas para brindarle la atención médica veterinaria que necesite.</p>
          <p>En tercer lugar buscamos la manera de hospedar la mascota en algún hogar temporal que nos permita descartar cualquier enfermedad transmisible que pueda traer y así  asegurarnos de proteger a la manada.</p>
          <p>Y por cuarto lugar asignamos a la mascota en un hogar donde se comprometan mediante un contrato validado legalmente a darle calidad de vida.</p>
          <p>Existen muchas variantes del cómo abordamos cada caso debido a las condiciones que cada uno presenta, en muchas ocasiones sólo prestamos el apoyo de manera virtual o de manera física. Lo importante es comunicarse con el equipo y en cuanto podamos responderle.</p>
        </ContentSlider>

    </MainLayout>
  )
}

export default MiPrimerRescatePage;