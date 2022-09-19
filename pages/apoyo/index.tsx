import { NextPage } from 'next'
import { AddAlert } from '@mui/icons-material'

import { ContentSlider, MainLayout } from '../../components'
import styles from '../../styles/Apoyo.module.css'

const ApoyoPage: NextPage = () => {
  
  return (
    <MainLayout title={ 'Cómo ayudar' } pageDescription={ '¿Te preguntas cómo ayudarnos a cumplir con nuestra labor? Pues es muy fácil. Conoce los detalles aquí.' } titleIcon={ <AddAlert color='info' sx={{ fontSize: '1.5rem' }} /> } nextPage='/adoptar'>

        <ContentSlider title={ 'Ayuda aquí' } initiallyDisplayed>
          <p>Elit enim ex occaecat sint occaecat.</p>
          <p>Aliqua culpa pariatur magna ullamco. Excepteur laborum magna dolore. Eiusmod sit non reprehenderit. Elit aliqua magna quis duis reprehenderit ea in mollit aute non exercitation ipsum. Aute Lorem aliquip do aute adipisicing dolor dolore dolore incididunt dolor do labore. Duis est velit ad laboris culpa. Pariatur aliquip velit laboris aliqua culpa sint eu amet do excepteur proident elit non nostrud.</p>
        </ContentSlider>

        <ContentSlider title={ 'Cómo donar' }>
          <p>Elit enim ex occaecat sint occaecat. Non ut velit consequat veniam duis. Occaecat sunt duis officia aliquip consequat cillum id esse ullamco. Fugiat irure duis mollit aliqua elit ullamco officia quis incididunt irure mollit minim in anim. Irure duis magna ipsum Lorem ad nostrud est voluptate nulla aliquip Lorem magna dolore. Nostrud eu magna commodo ut aliquip eu occaecat ex minim.. Elit enim ex occaecat sint occaecat.</p>
          <p>Aliqua culpa pariatur magna ullamco. Excepteur laborum exercitation ipsum. Aute Lorem aliquip do aute adipisicing dolor dolore dolore incididunt dolor do labore. Duis est velit ad laboris culpa. Pariatur aliquip velit laboris aliqua culpa sint eu amet do excepteur proident elit non nostrud.</p>
          <p>Labore qui ut nostrud  sint veniam in anim ex mollit. Aliquip in dolor. Consequat et sint incididunt id exercitation. Id consectetur excepteur consequat veniam ipsum magna irure in magna nisi. Minim veniam consequat culpa ipsum elit.</p>
        </ContentSlider>

        <ContentSlider title={ 'Información' }>
          <p>Nim enim ex occaecat sint occaecat. Pesym num ex osemac sint dist. Tuca som occaecat desto occaecat.</p>
          <p>Ipse culpa pariatur magna ullamco. Excepteur laborum exercitation ipsum. Aute Lorem aliquip do aute adipisicing dolor dolore dolore incididunt dolor do labore. Duis est velit ad laboris culpa. Pariatur aliquip velit laboris aliqua culpa sint eu amet do excepteur proident elit non nostrud.</p>
          <p>Labore qui ut nostrud  sint veniam in anim ex mollit. Aliquip in dolor. Consequat et sint incididunt id exercitation. Id consectetur excepteur consequat veniam ipsum magna irure in magna nisi. Minim veniam consequat culpa ipsum elit.</p>
          <p>Id excepteur enim do magna eiusmod proident voluptate sunt incididunt labore eiusmod. Enim mollit officia fugiat anim labore irure eiusmod excepteur id. Aliquip incididunt dolor minim aute dolor. Aute labore aliqua duis ea aute esse adipisicing deserunt. Laborum ex voluptate Lorem non cupidatat deserunt non minim aliqua. Exercitation minim fugiat deserunt sunt.. Elit enim ex occaecat sint occaecat. Elit enim ex occaecat sint occaecat.</p>
          <p>Aliqua culpa pariatur magna ullamco. Excepteur laborum exercitation ipsum. Aute Lorem aliquip do aute adipisicing dolor dolore dolore incididunt dolor do labore. Duis est velit ad laboris culpa. Pariatur aliquip velit laboris aliqua culpa sint eu amet do excepteur proident elit non nostrud.</p>
          <p>Labore qui ut nostrud  sint veniam in anim ex mollit. Aliquip in dolor. Consequat et sint incididunt id exercitation. Id consectetur excepteur consequat veniam ipsum magna irure in magna nisi. Minim veniam consequat culpa ipsum elit.</p>
        </ContentSlider>

    </MainLayout>
  )
}

export default ApoyoPage;