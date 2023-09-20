import { NextPage } from 'next';
import { Typography } from '@mui/material';
import AddAlert from '@mui/icons-material/AddAlert';

import { MainLayout } from '../../components';

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
        <Typography>Página de Apoyo</Typography>
        <Typography>Esta página está en construcción.</Typography>
      </section>

    </MainLayout>
  )
}

export default ApoyoPage;