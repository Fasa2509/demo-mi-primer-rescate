import { NextPage } from 'next'
import { Typography } from '@mui/material'
import { VolunteerActivism } from '@mui/icons-material'

import { MainLayout } from '../../components'
import styles from '../../styles/Adoptar.module.css'

const AdoptarPage: NextPage = () => {

  return (
    <MainLayout title={ 'Adopción' } H1={ 'Adopta' } pageDescription={ 'Proceso de adopción de nuestros amigos.' } titleIcon={ <VolunteerActivism color='info' sx={{ fontSize: '1.5rem' }} /> } nextPage='/cambios'>
      
        <Typography>Página de adopción</Typography>

    </MainLayout>
  )
}

export default AdoptarPage;