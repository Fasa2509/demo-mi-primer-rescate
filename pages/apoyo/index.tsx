import { NextPage } from 'next';
import AddAlert from '@mui/icons-material/AddAlert';

import { MainLayout, MyImage } from '../../components';
import styles from '../../styles/ProyectoMPR.module.css';

const ApoyoPage: NextPage = () => {

  return (
    <MainLayout
      title={'Cómo ayudar'}
      pageDescription={'¿Te preguntas cómo ayudarnos a cumplir con nuestra labor? Pues es muy fácil. Conoce los detalles aquí y apoya a @miprimerrescate con cualquier tipo de donativo, toda ayuda es bienvenida.'}
      titleIcon={<AddAlert color='info' sx={{ fontSize: '1.5rem' }} />}
      nextPage='/adoptar/perros'
      url='/apoyo'
    >

      <section className='content-island'>
        <h2>¿De qué forma puedo ayudar?</h2>
        <p>
          Existen varias formas de ayudar y formar parte de esta hermosa labor, todas las ayudas son bien recibidas y utilizadas
          para abastecer a nuestra manada de insumos, alimento y atención médica, sigue leyendo y ¡entérate de cómo puedes formar parte de esta labor!
        </p>
      </section>

      <section className='content-island'>
        <h3>1{')'} Donando insumos</h3>
        <p>
          Cada rescate realizado requiere a menudo de atenciones médicas, intervenciones quirúrgicas y curas constantes que nos ayudan a garantizar la salud del rescatado,
          además, Mi Primer Rescate se hace cargo de más de 60 animales refugiados quienes pueden requerir atención médica. Los insumos donados nos ayudan a abaratar
          los costos de las atenciones médicas y nos permiten seguir cumpliendo con nuestra misión. Puedes donar: centros de cama, gasas, guantes, medicinas, entre otros.
        </p>
        <div className={styles.img__container}>
          <MyImage src='/Dona insumos.jpg' alt='Dona Insumos' layout='fill' />
        </div>
      </section>

      <section className='content-island'>
        <h3>2{')'} Donando alimento</h3>
        <p>
          Abastecer de alimento a toda la manada a veces puede ser un gran reto, se requieren de varios sacos de alimento al mes para asegurar la comida de nuestros queridos animales, por eso Mi Primer Rescate recibe
          cualquer donación de proteínas, sacos de alimento, comida en lata y snacks que serán utizados para llenar la barriga y el corazón de todos nuestros peludos refugiados y que aún se encuentran en situación de calle.
        </p>
        <div className={styles.img__container}>
          <MyImage src='/Dona Alimento.jpg' alt='Dona Alimento' layout='fill' />
        </div>
      </section>

      <section className='content-island'>
        <h3>3{')'} Adopta o apadrina</h3>
        <p>
          El amor puede manifestarse de distintas maneras, y un animal de compañía puede cambiar tu vida para siempre. Adoptar es una de las mejores formas en las que puedes contribuir a esta labor brindándole hogar y familia a un ser hermoso y agradecido,
          ayudas a más perritos en situación de calle y nos ayudas a nosotros, ¡todos ganan! Si no puedes adoptar, puedes tomar la decisión de apadrinar a un peludo cubriendo todos sus gastos médicos o donando castraciones y esterilizaciones
          que ayudan a prolongar la vida de nuestros peludos y su calidad.
        </p>
        <div className={styles.img__container}>
          <MyImage src='/Adopta o apadrina.jpg' alt='Adopta o Apadrina' layout='fill' />
        </div>
      </section>

      <section className='content-island'>
        <h3>4{')'} Difunde y comparte</h3>
        <p>
          Sigue y comparte nuestra actividad en todas las redes sociales para llegar a más voluntarios y personas de buen corazón como tú.
          Agradecemos con el corazón a todos nuestros seguidores por hacer crecer este hermoso proyecto mediante la difusión, ¡síguenos!.
        </p>
        <div className={styles.img__container}>
          <MyImage src='/Difunde y Comparte.png' alt='Difunde y Comparte' layout='fill' />
        </div>
      </section>

      <section className='content-island'>
        <h3>5{')'} Aporte económico</h3>
        <p>
          Serán bien recibidos todos aquellos aportes económicos que tengan como objetivo aportar a la adquisición de alimento, insumos, pago de cirugías y atenciones médicas veterinarias.
          Haz click <span className='url'>aquí</span> para descargar una imagen con los métodos disponibles para realizar tu aporte.
        </p>
      </section>

    </MainLayout>
  )
}

export default ApoyoPage;