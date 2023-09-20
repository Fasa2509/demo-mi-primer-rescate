import { NextPage } from 'next';
import Pets from '@mui/icons-material/Pets';

import { MainLayout, MyImage } from '../../components';
import styles from '../../styles/ProyectoMPR.module.css';

const MiPrimerRescatePage: NextPage = () => {

  return (
    <MainLayout title={'¿Qué es Mi Primer Rescate?'} H1={'Proyecto MPR'} pageDescription={'Te contamos quiénes somos, qué hacemos, cuáles son nuestros objetivos y lo que hacemos para conseguirlos. ¡Conócenos!, la fundación tiene mucha historia y trabajo detrás.'} titleIcon={<Pets color='info' sx={{ fontSize: '1.5rem' }} />} nextPage='/apoyo' url='/miprimerrescate'>

      <section className={`${styles.content} content-island`}>
        <h2 className={styles.title}>¿Quiénes Somos?</h2>

        <p>
          Mi Primer Rescate es una organización sin fines de lucro dirigida de la mano de un grupo de jóvenes voluntarios y comprometidos con luchar en contra del abandono, sobrepoblación y maltrato
          que viven diariamente miles de animales en toda Venezuela (Carabobo).
        </p>

        <p>
          Entendemos a los animales como fieles compañeros y seres vivos cuya vida es igual de importante que la nuestra,
          por lo tanto nos mostramos en contra de cualquier manifestación de estas conductas en contra de los animales domésticos y no domésticos.
        </p>

        <div className={styles.img__container}>
          <MyImage src="/mpr nosotros.png" alt='Nosotros' width={1368} height={769} />
        </div>
      </section>

      <section className="content-island">
        <h2>Objetivos MPR</h2>
        <ul>
          <li>
            Concientizar a toda la comunidad acerca del respeto hacia los animales
          </li>
          <li>
            Luchar empedernidamente en contra de todo tipo de maltrato, abuso, abandono y explotación animal
          </li>
          <li>
            Rescatar a animales en cualquier situación de peligro, riesgo de muerte y abandono
          </li>
          <li>
            Brindar la atención médica necesaria para la recuperación de cualquier animal que haya sufrido y estado en condiciones vulnerables
          </li>
          <li>
            Reubicar a todos los animales que sea posible con una nueva familia que pueda brindar amor, seguridad y sustento
          </li>
        </ul>
      </section>

      <section className="content-island">
        <h2>Ciclo MPR</h2>
        <p>Mi Primer Rescate realiza su labor poniendo en práctica la ejecución del "Ciclo MPR", el cual cumple con 4 objetivos para garantizar la salud, felicidad y plenitud del animal rescatado.</p>
        <ol>
          <li>
            Rescatar al animal en condiciones vulnerables
          </li>
          <li>
            Brindarle la atención médica necesaria
          </li>
          <li>
            Sanar sus heridas corporales y sentimentales
          </li>
          <li>
            Asignarle una familia
          </li>
        </ol>
      </section>

    </MainLayout>
  )
}

export default MiPrimerRescatePage;