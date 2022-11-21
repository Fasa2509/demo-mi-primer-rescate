import { NextPage } from 'next'
import { Typography } from '@mui/material'
import { VolunteerActivism } from '@mui/icons-material'

import { MainLayout } from '../../components'
import styles from '../../styles/Adoptar.module.css'

// const pets: Pet[] = [
//   {
//     name: 'Susy',
//     story: 'Excepteur sint velit exercitation in sit esse consequat reprehenderit sint exercitation adipisicing laboris dolore tempor. Ex amet amet nulla consequat. Quis deserunt et nulla culpa qui cupidatat ex ad. Sit ad pariatur reprehenderit cupidatat fugiat consectetur. Labore dolor consequat laboris exercitation do duis. Labore duis irure magna in reprehenderit cillum. Enim amet elit velit aute irure enim reprehenderit laborum nisi ullamco occaecat Lorem excepteur minim.',
//     image: '/square-dog.jpg',
//   },
//   {
//     name: 'Pirata',
//     story: 'Laboris aute aliqua aliqua laborum magna consectetur sunt. Qui eiusmod amet sunt occaecat culpa qui fugiat anim. Mollit anim sint reprehenderit laboris non enim dolor. Aute quis quis elit irure elit laborum eu ipsum consectetur. Nulla ea anim dolor labore officia.',
//     image: '/square-dog.jpg',
//   },
//   {
//     name: 'Paco',
//     story: 'Ullamco ut Lorem non exercitation reprehenderit nisi adipisicing velit eiusmod reprehenderit nulla cillum eu aliquip. Pariatur quis sint voluptate voluptate veniam laborum cupidatat velit amet sunt nulla eiusmod. Enim veniam Lorem irure do duis proident aliquip ad reprehenderit amet cupidatat consectetur. Aute deserunt anim excepteur fugiat ut elit. Occaecat culpa et cillum excepteur incididunt. Culpa magna consectetur ea dolor. Elit excepteur et excepteur duis.',
//     image: '/square-dog.jpg',
//   },
//   {
//     name: 'Lizz',
//     story: 'Exercitation amet velit cillum dolor ex esse mollit. Ex qui ad laboris adipisicing dolor minim. Non ullamco in velit exercitation aute aute deserunt proident. Eu aute commodo do laboris commodo consequat aliqua non dolore laborum cupidatat reprehenderit et id.',
//     image: '/square-dog.jpg',
//   },
//   {
//     name: 'Benny',
//     story: 'Laboris nulla pariatur enim culpa irure consequat deserunt occaecat adipisicing do laboris dolor enim. Do consectetur sit voluptate ex amet anim sunt reprehenderit anim id fugiat. Dolore ex ad quis sunt quis culpa cillum. Velit consectetur sint irure id. Excepteur quis pariatur irure duis excepteur labore.',
//     image: '/square-dog.jpg',
//   },
//   {
//     name: 'Zico',
//     story: 'Incididunt esse et ea reprehenderit commodo in elit sint. Amet magna sit anim cupidatat eu. Voluptate excepteur id culpa excepteur labore voluptate minim dolor occaecat nulla. Dolor labore enim incididunt non est velit reprehenderit commodo magna laborum.',
//     image: '/square-dog.jpg',
//   },
// ]


const AdoptarPage: NextPage = () => {

  return (
    <MainLayout title={ 'Adopción' } H1={ 'Adopta' } pageDescription={ 'Proceso de adopción de nuestros amigos.' } titleIcon={ <VolunteerActivism color='info' sx={{ fontSize: '1.5rem' }} /> } nextPage='/cambios'>
      
        <Typography>Página de adopción</Typography>

        {/* <p>¿Quieres adoptar una mascota? ¡Pues estás en el sitio indicado!</p>

        <p>¡En <b>Mi Primer Rescate</b> contamos con una gran cantidad de peludos donde seguramente encontrarás al indicado para ti!</p>
        
        <ContentSlider title='Nuestros perritos' style={{ backgroundImage: 'url(/background-blob-scatter.svg), url(/wave-haikei-1.svg)', backgroundSize: 'contain', backgroundPosition: 'top left, bottom left', backgroundRepeat: 'repeat, no-repeat' }}>
          <div className={ styles.grid__container }>
            {
              pets.map( pet => (
                <PetCard key={ pet.name } pet={ pet } />
              ))
            }
          </div>
        </ContentSlider>

        <ContentSlider title='Nuestros gatitos' style={{ backgroundImage: 'url(/background-blob-scatter.svg), url(/wave-haikei-1.svg)', backgroundSize: 'contain', backgroundPosition: 'top left, bottom left', backgroundRepeat: 'repeat, no-repeat' }}>
          <div className={ styles.grid__container }>
            {
              pets.map( pet => (
                <PetCard key={ pet.name } pet={ pet } />
              ))
            }
          </div>
        </ContentSlider>
        
        <ContentSlider title='Otros animalitos 🐾' style={{ backgroundImage: 'url(/background-blob-scatter.svg), url(/wave-haikei-1.svg)', backgroundSize: 'contain', backgroundPosition: 'top left, bottom left', backgroundRepeat: 'repeat, no-repeat' }}>
          <div className={ styles.grid__container }>
            {
              pets.map( pet => (
                <PetCard key={ pet.name } pet={ pet } />
              ))
            }
          </div>
        </ContentSlider>
        
        <ContentSlider title='Proceso de Adopción' style={{ backgroundImage: 'none', paddingBottom: '1rem' }}>
          <AdoptionForm />
        </ContentSlider> */}

    </MainLayout>
  )
}

export default AdoptarPage;