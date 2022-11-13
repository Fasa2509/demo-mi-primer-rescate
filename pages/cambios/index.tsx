import { NextPage } from 'next'
import { TrendingUp } from '@mui/icons-material';
import { Box, Button, Typography } from '@mui/material';
import { useSnackbar } from 'notistack';

import { ChangeCard, MainLayout, ModalWindow } from '../../components'
import { ImageObj } from '../../interfaces';
import styles from '../../styles/Cambios.module.css'
import { mprRevalidatePage } from '../../mprApi';

type Case = {
  name: string;
  text: string;
  images: ImageObj[];
}

const initialChanges: Case[] = [
  {
    name: 'Cusco',
    text: `Cusco fue encontrado en un terrible estado en la zona de... durante una fuerte lluvia.
    Ullamco et tempor ipsum mollit.
    Non do commodo mollit dolore proident cupidatat culpa pariatur.
    Id mollit ea magna commodo consequat. Ullamco consequat cupidatat consectetur adipisicing veniam laborum excepteur id est voluptate fugiat Lorem.
    Culpa nostrud eu fugiat esse fugiat quis do in. Commodo laboris dolor minim nulla velit eu. Adipisicing fugiat sunt excepteur Lorem commodo occaecat amet consectetur nulla esse.`,
    images: [
      {
        url: '/perro-1.webp',
        alt: 'perro1',
        width: 500,
        height: 500
      },
      {
        url: '/perro-2.webp',
        alt: 'perro2',
        width: 500,
        height: 500
      },
    ]
  },
  {
    name: 'Canela',
    text: `Canela fue encontrada en la Urb...
    Ullamco et tempor ipsum mollit.
    Non do commodo mollit dolore proident cupidatat culpa pariatur.
    Velit reprehenderit aute est eiusmod. Fugiat non id ad officia culpa ex. Sunt ut eiusmod tempor veniam nulla. Nulla aute ex nisi nostrud esse cupidatat officia magna et aute reprehenderit. Consequat voluptate duis sit consectetur eiusmod fugiat excepteur duis veniam reprehenderit irure proident.
    Dolore reprehenderit et id consectetur proident magna duis. Esse incididunt adipisicing Lorem fugiat nostrud sunt nulla.`,
    images: [
      {
        url: '/perro-1.webp',
        alt: 'perro1',
        width: 500,
        height: 500
      },
      {
        url: '/perro-2.webp',
        alt: 'perro2',
        width: 500,
        height: 500
      },
    ]
  },
  {
    name: 'Ale',
    text: `Ale fue atropella en la zona de...
    Non do commodo mollit dolore proident cupidatat culpa pariatur.
    Irure qui duis fugiat in sit voluptate incididunt ex ea ad.
    Ex duis amet sit occaecat veniam. Aliqua incididunt in consectetur excepteur.
    Ex commodo pariatur magna labore adipisicing do aliqua irure.
    Ullamco deserunt non fugiat proident deserunt minim dolore aliqua dolor veniam. Mollit duis fugiat et proident eu reprehenderit tempor.`,
    images: [
      {
        url: '/perro-1.webp',
        alt: 'perro1',
        width: 500,
        height: 500
      },
      {
        url: '/perro-2.webp',
        alt: 'perro2',
        width: 500,
        height: 500
      },
    ]
  },
  {
    name: 'Vic',
    text: `Vic era un perro callejero que sufrió de un ataque al corazón... durante una fuerte lluvia.
    Non anim consequat voluptate enim non ullamco consectetur laborum aliquip cupidatat ex proident veniam. Nulla ex consectetur adipisicing incididunt non in labore cillum. Mollit pariatur veniam est sit nulla officia duis labore elit fugiat non.
    Nulla excepteur laborum aliqua dolor non nulla non. Sint nisi qui et quis eu duis ex laboris aute. Minim ad eiusmod sunt esse ullamco incididunt in.
    Non do commodo mollit dolore proident cupidatat culpa pariatur.`,
    images: [
      {
        url: '/perro-1.webp',
        alt: 'perro1',
        width: 500,
        height: 500
      },
      {
        url: '/perro-2.webp',
        alt: 'perro2',
        width: 500,
        height: 500
      },
    ]
  },
]

const CambiosPage: NextPage = () => {

  const { enqueueSnackbar } = useSnackbar();
  
  const revalidate = async () => {
    if ( process.env.NODE_ENV !== 'production' ) return;

    const resRev = await mprRevalidatePage('/cambios');

    enqueueSnackbar(resRev.message, { variant: !resRev.error ? 'success' : 'error' });
  }
  
  return (
    <MainLayout title={ 'Cambios de nuestros amigos' } H1={ 'Antes y después' } pageDescription={ 'Aquí podrás ver el antes y después de nuestros amigos peludos. Algunos han pasado por mucho, pero con amor, esfuerzo y trabajo, han recuperado una vida digna.' } titleIcon={ <TrendingUp color='info' sx={{ fontSize: '1.5rem' }} /> } nextPage='/tienda'>
        
        <p>¡La evolución y mejora de nuestros amigos!</p>
        
        <p>Sint veniam aliquip incididunt labore pariatur. Lorem ipsum culpa sit consectetur. Eiusmod ad magnaunt esse adipisicing quis incididunt adipisicing voluptate commodo minim exercitation. Velit nulla cupidatat culpa irure Lorem non ut nulla ex nulla et in occaecat.</p>

        <section className={ styles.changes__section }>
          {
            initialChanges.map(( caso ) => <ChangeCard key={ caso.name } name={ caso.name } text={ caso.text } images={ caso.images } />)
          }
        </section>        

      <Box display='flex'>
        <Typography sx={{ alignSelf: 'center' }}>¿Has adoptado una mascota recientemente? Cuéntanos tu experiencia</Typography>
        <ModalWindow buttonTxt='aquí' title='¿Cómo fue tu experiencia?' buttonStyle={{ fontWeight: '400', backgroundColor: 'transparent', color: 'var(--secondary-color-1)', margin: '0 0 0 .25rem', padding: '.3rem .5rem', border: 'thin solid var(--secondary-color-1)', alignSelf: 'center' }}>
          <Typography>Dolore pariatur eu fugiat id exercitation id dolore duis anim ex labore laborum sit. Voluptate reprehenderit laborum tempor reprehenderit elit laborum esse deserunt ad fugiat ut dolore aliquip sit. Culpa commodo cupidatat eiusmod reprehenderit laborum adipisicing adipisicing incididunt adipisicing dolore sint. Magna aliquip labore sint sunt aute dolor in duis reprehenderit occaecat duis mollit dolore.</Typography>
          <Typography>Elit qui exercitation amet ut sunt. Cupidatat consequat labore qui quis excepteur consequat. Minim cillum adipisicing ut ut consequat ex sunt magna ipsum sunt do minim. Proident veniam duis minim velit ea. Cupidatat deserunt in duis nostrud id mollit.</Typography>
          <Typography>Laborum laborum labore tempor eu voluptate dolore elit. Cupidatat labore quis enim magna minim nostrud. Mollit commodo ad do anim reprehenderit Lorem ex.</Typography>
        </ModalWindow>
      </Box>

      <Button variant='contained' color='secondary' onClick={ revalidate }>Revalidar esta página</Button>

    </MainLayout>
  )
}

export default CambiosPage;