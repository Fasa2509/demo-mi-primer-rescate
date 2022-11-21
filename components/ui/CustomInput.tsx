import { FC } from 'react';

import { Field } from '../../interfaces';
import styles from './Form.module.css'

interface Props {
    field: Field;
    setField: ( a: any ) => void;
    dimension: { width: number; height: number; };
    setDimension: ( a: any ) => void;
}

export const CustomInput: FC<Props> = ({ field, setField, dimension, setDimension }) => {

    if ( field.type === 'link' ) {
        return (
            <div className={ styles.field }>                
                <input value={ field.content } type={ 'url' } name={ 'link' } placeholder={ 'Link aquí' } required onChange={ ( e: any ) => setField({ ...field, content: e.target.value }) } />
                <input value={ field.content_ } type={ 'text' } name={ 'textLink' } placeholder={ 'Texto aquí' } required onChange={ ( e: any ) => setField({ ...field, content_: e.target.value }) } />
            </div>
          )
    }

    if ( field.type === 'contador' ) {
        return (
            <div className={ styles.field }>
                <input value={ field.content } type={ 'datetime-local' } name={ 'contador' } placeholder={ 'Fecha aquí' } required onChange={ ( e: any ) => setField({ ...field, content: e.target.value }) } />
            </div>
          )
    }

    if ( field.type === 'imagen' ) {
        return (
            <div className={ styles.field }>
                <div className={ styles.field }>
                    {/* <p>Más adelante cuando dispongamos de Amazon CloudFront, aquí agregaremos los links de referencia a imágenes guardadas en el bucket, pero por ahora, usaremos de ejemplo cualquiera de las imágenes ya existentes dentro del servidor web. Estas son las siguientes:</p> */}
                    <p>/dog-hero-image.webp <b>1280x720px</b></p>
                    <p>/perro-1.webp <b>450x450px</b></p>
                    <p>/perro-2.webp <b>450x450px</b></p>
                    <p>/Logo-MPR.png <b>500x500px</b></p>
                    <p>/Logo-Redes.png <b>500x500px</b></p>
                    <p>/square-dog.jpg <b>500x500px</b></p>
                    <p>/gato-1.webp <b>500x500px</b></p>
                    <p>/gato-2.jpg <b>500x500px</b></p>
                    
                    <p>¡Copia la dirrección (sin las dimensiones) y agrégala!</p>
                </div>
                <input value={ field.content.trim() } type={ 'text' } name={ 'imagen' } placeholder={ 'Dirección de la imagen aquí' } required onChange={ ( e: any ) => setField({ ...field, content: e.target.value }) } />
                <input value={ field.content_ } type={ 'text' } name={ 'imageAlt' } placeholder={ 'Texto aquí' } required onChange={ ( e: any ) => setField({ ...field, content_: e.target.value }) } />
                <p> El texto hace referencia a un texto que aparecerá únicamente cuando la imagen por alguna razón NO pueda ser cargada, es OBLIGATORIO y debe ser conciso y con pocas palabras (menos de 8). Las propiedades de ancho y alto definen <b>el mayor valor de esa propiedad respectivamente</b>. Las imágenes se adaptarán de forma automática a tamaños de pantalla más pequeños.</p>
                <div className={ styles.input__dimensions }>
                    <label htmlFor="imageWitdh">Ancho:</label>
                    <input id={ 'imageWidth' } value={ dimension.width } type={ 'number' } name={ 'ancho' } placeholder={ 'Ancho' } required onChange={ ( e: any ) => setDimension({ ...dimension, width: Math.abs(e.target.value) }) } />
                </div>
                <div style={{ gap: '21px' }} className={ styles.input__dimensions }>
                    <label htmlFor="imageHeight">Alto:</label>
                    <input id={ 'imageHeight' } value={ dimension.height } type={ 'number' } name={ 'alto' } placeholder={ 'Alto' } required onChange={ ( e: any ) => setDimension({ ...dimension, height: Math.abs(e.target.value) }) } />
                </div>
            </div>
        )
    }

    if ( field.type === 'texto' ) {
        return (
        <div className={ styles.field }>
            <textarea value={ field.content } name={ 'texto' } placeholder={ 'Escribe el contenido aquí' } rows={ 6 } required onChange={ ( e: any ) => setField({ ...field, content: e.target.value }) } />
        </div>
        )
    }

  return (
<div className={ styles.field }>
        <input value={ field.content } type={ 'text' } name={ 'subtitulo' } placeholder={ 'Subtítulo aquí' } required onChange={ ( e: any ) => setField({ ...field, content: e.target.value }) } />
    </div>
  )
}
