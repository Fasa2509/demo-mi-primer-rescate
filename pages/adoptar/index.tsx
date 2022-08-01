import { Button } from '@mui/material';
import { NextPage } from 'next'
import { useState } from 'react';
import { MainLayout } from '../../components'

type Route = '' | 'Proceso' | 'Formulario'

const AdoptarPage: NextPage = () => {

  const [route, setRoute] = useState<Route>('');

  return (
    <MainLayout title={ 'Adopción' } H1={ 'Cómo Adoptar' } pageDescription={ 'Proceso de adopción de nuestros amigos.' }>
      
        <p>¿Quieres adoptar una mascota? ¡Pues estás en el sitio indicado!</p>

        <div style={{ display: 'flex', justifyContent: 'space-evenly' }}>
          <button className='button' onClick={ () => setRoute('Proceso') }>Proceso</button>
          <button className='button' onClick={ () => setRoute('Formulario') }>Formulario</button>
        </div>
        
        {
          ( route === 'Proceso' )
            ? ( <h2>Proceso de Adopción</h2> )
            : <></>
        }

        {
          ( route === 'Formulario' )
            ? ( <h2>Formulario de Postulación</h2> )
            : <></>
        }

    </MainLayout>
  )
}

export default AdoptarPage;