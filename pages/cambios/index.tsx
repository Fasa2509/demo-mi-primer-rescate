import { NextPage } from 'next'
import { ChangeCard, MainLayout } from '../../components'

import styles from '../../styles/Cambios.module.css'

type Case = {
  name: string;
  text: string;
}

const initialChanges: Case[] = [
  {
    name: 'Cusco',
    text: `Cusco fue encontrado en un terrible estado en la zona de... durante una fuerte lluvia.
    Ullamco et tempor ipsum mollit.
    Non do commodo mollit dolore proident cupidatat culpa pariatur.
    Id mollit ea magna commodo consequat. Ullamco consequat cupidatat consectetur adipisicing veniam laborum excepteur id est voluptate fugiat Lorem.
    Culpa nostrud eu fugiat esse fugiat quis do in. Commodo laboris dolor minim nulla velit eu. Adipisicing fugiat sunt excepteur Lorem commodo occaecat amet consectetur nulla esse.`
  },
  {
    name: 'Canela',
    text: `Canela fue encontrada en la Urb...
    Ullamco et tempor ipsum mollit.
    Non do commodo mollit dolore proident cupidatat culpa pariatur.
    Velit reprehenderit aute est eiusmod. Fugiat non id ad officia culpa ex. Sunt ut eiusmod tempor veniam nulla. Nulla aute ex nisi nostrud esse cupidatat officia magna et aute reprehenderit. Consequat voluptate duis sit consectetur eiusmod fugiat excepteur duis veniam reprehenderit irure proident.
    Dolore reprehenderit et id consectetur proident magna duis. Esse incididunt adipisicing Lorem fugiat nostrud sunt nulla.`
  },
  {
    name: 'Ale',
    text: `Ale fue atropella en la zona de...
    Non do commodo mollit dolore proident cupidatat culpa pariatur.
    Irure qui duis fugiat in sit voluptate incididunt ex ea ad.
    Ex duis amet sit occaecat veniam. Aliqua incididunt in consectetur excepteur.
    Ex commodo pariatur magna labore adipisicing do aliqua irure.
    Ullamco deserunt non fugiat proident deserunt minim dolore aliqua dolor veniam. Mollit duis fugiat et proident eu reprehenderit tempor.`
   
  },
  {
    name: 'Vic',
    text: `Vic era un perro callejero que sufrió de un ataque al corazón... durante una fuerte lluvia.
    Non anim consequat voluptate enim non ullamco consectetur laborum aliquip cupidatat ex proident veniam. Nulla ex consectetur adipisicing incididunt non in labore cillum. Mollit pariatur veniam est sit nulla officia duis labore elit fugiat non.
    Nulla excepteur laborum aliqua dolor non nulla non. Sint nisi qui et quis eu duis ex laboris aute. Minim ad eiusmod sunt esse ullamco incididunt in.
    Non do commodo mollit dolore proident cupidatat culpa pariatur.`
  },
]

const CambiosPage: NextPage = () => {
  return (
    <MainLayout title={ 'Cambios de nuestros amigos' } H1={ 'Antes y después' } pageDescription={ 'Aquí podras ver el antes y después de nuestros perritos.' }>
        
        <p>¡La evolución y mejora de nuestros amigos!</p>
        <p>Sint veniam aliquip incididunt labore pariatur. Lorem ipsum culpa sit consectetur. Eiusmod ad magnaunt esse adipisicing quis incididunt adipisicing voluptate commodo minim exercitation. Velit nulla cupidatat culpa irure Lorem non ut nulla ex nulla et in occaecat.</p>

        <section className={ styles.change__section }>
          {
            initialChanges.map(( caso ) => <ChangeCard key={ caso.name } name={ caso.name } text={ caso.text } />)
          }
        </section>

    </MainLayout>
  )
}

export default CambiosPage;