import { FC, forwardRef, useRef } from 'react';
import { Button } from '@mui/material';

import { FieldType } from '../../interfaces';
import styles from './Form.module.css';

interface Props {
    type: FieldType;
}

export const CustomInput = forwardRef<HTMLElement, Props>((props, ref) => {

    const imgRef = useRef<HTMLInputElement>( null );

    if ( props.type === 'link' ) {
        return (
            <div className={ styles.field }>                
                <input type='url' name='link' placeholder='Link aquí' required />
                <input type='text' name='textLink' placeholder='Texto aquí' required />
            </div>
          )
    }

    if ( props.type === 'contador' ) {
        return (
            <div className={ styles.field }>
                <input type='datetime-local' name='contador' placeholder='Fecha' />
            </div>
          )
    }

    if ( props.type === 'imagen' ) {
        return (
            <div className={ styles.field }>
                <input ref={ imgRef } className={ styles.no__display } accept='image/*' type='file' name='image' required />
                <Button color='primary' fullWidth>Subir Imagen</Button>
                {/* <p> El texto hace referencia a un texto que aparecerá únicamente cuando la imagen por alguna razón NO pueda ser cargada, es OBLIGATORIO y debe ser conciso y con pocas palabras (menos de 8). Las propiedades de ancho y alto definen <b>el mayor valor de esa propiedad respectivamente</b>. Las imágenes se adaptarán de forma automática a tamaños de pantalla más pequeños.</p> */}
                {/* <div className={ styles.input__dimensions }>
                    <label htmlFor="imageWitdh">Ancho:</label>
                    <input id={ 'imageWidth' } value={ dimension.width } type={ 'number' } name={ 'ancho' } placeholder={ 'Ancho' } required onChange={ ( e: any ) => setDimension({ ...dimension, width: Math.abs(e.target.value) }) } />
                </div>
                <div style={{ gap: '21px' }} className={ styles.input__dimensions }>
                    <label htmlFor="imageHeight">Alto:</label>
                    <input id={ 'imageHeight' } value={ dimension.height } type={ 'number' } name={ 'alto' } placeholder={ 'Alto' } required onChange={ ( e: any ) => setDimension({ ...dimension, height: Math.abs(e.target.value) }) } />
                </div> */}
            </div>
        )
    }

    if ( props.type === 'texto' ) {
        return (
            <div className={ styles.field }>
                <textarea name='texto' placeholder='Escribe el contenido' rows={ 6 } required />
            </div>
        )
    }

  return (
    <div className={ styles.field }>
        <input type='text' name='subtitulo' placeholder='Subtítulo aquí' required />
    </div>
  )
});

CustomInput.displayName = 'CustomInput';
// import { Dispatch, FC, SetStateAction, useRef } from 'react';
// import { Button } from '@mui/material';

// import { Field } from '../../interfaces';
// import styles from './Form.module.css'

// interface Props {
//     field: Field;
//     setField: ( a: any ) => void;
//     dimension: { width: number; height: number; };
//     setDimension: ( a: any ) => void;
//     setFile: Dispatch<SetStateAction<any>>;
// }

// export const CustomInput: FC<Props> = ({ field, setField, dimension, setDimension, setFile }) => {

//     const imgRef = useRef<HTMLInputElement>( null );

//     if ( field.type === 'link' ) {
//         return (
//             <div className={ styles.field }>                
//                 <input value={ field.content } type={ 'url' } name={ 'link' } placeholder={ 'Link aquí' } required onChange={ ( e: any ) => setField({ ...field, content: e.target.value }) } />
//                 <input value={ field.content_ } type={ 'text' } name={ 'textLink' } placeholder={ 'Texto aquí' } required onChange={ ( e: any ) => setField({ ...field, content_: e.target.value }) } />
//             </div>
//           )
//     }

//     if ( field.type === 'contador' ) {
//         return (
//             <div className={ styles.field }>
//                 <input value={ field.content } type={ 'datetime-local' } name={ 'contador' } placeholder={ 'Fecha aquí' } required onChange={ ( e: any ) => setField({ ...field, content: e.target.value }) } />
//             </div>
//           )
//     }

//     if ( field.type === 'imagen' ) {
//         return (
//             <div className={ styles.field }>
//                 <input ref={ imgRef } className={ styles.no__display } accept='image/*' type='file' name='image' required onChange={ (e) => setFile( e.target.files ? e.target.files[0] : '' ) } />
//                 <Button color='primary' fullWidth onClick={ () => imgRef.current && imgRef.current!.click() }>Subir Imagen</Button>
//                 <p> El texto hace referencia a un texto que aparecerá únicamente cuando la imagen por alguna razón NO pueda ser cargada, es OBLIGATORIO y debe ser conciso y con pocas palabras (menos de 8). Las propiedades de ancho y alto definen <b>el mayor valor de esa propiedad respectivamente</b>. Las imágenes se adaptarán de forma automática a tamaños de pantalla más pequeños.</p>
//                 <div className={ styles.input__dimensions }>
//                     <label htmlFor="imageWitdh">Ancho:</label>
//                     <input id={ 'imageWidth' } value={ dimension.width } type={ 'number' } name={ 'ancho' } placeholder={ 'Ancho' } required onChange={ ( e: any ) => setDimension({ ...dimension, width: Math.abs(e.target.value) }) } />
//                 </div>
//                 <div style={{ gap: '21px' }} className={ styles.input__dimensions }>
//                     <label htmlFor="imageHeight">Alto:</label>
//                     <input id={ 'imageHeight' } value={ dimension.height } type={ 'number' } name={ 'alto' } placeholder={ 'Alto' } required onChange={ ( e: any ) => setDimension({ ...dimension, height: Math.abs(e.target.value) }) } />
//                 </div>
//             </div>
//         )
//     }

//     if ( field.type === 'texto' ) {
//         return (
//         <div className={ styles.field }>
//             <textarea value={ field.content } name={ 'texto' } placeholder={ 'Escribe el contenido aquí' } rows={ 6 } required onChange={ ( e: any ) => setField({ ...field, content: e.target.value }) } />
//         </div>
//         )
//     }

//   return (
// <div className={ styles.field }>
//         <input value={ field.content } type={ 'text' } name={ 'subtitulo' } placeholder={ 'Subtítulo aquí' } required onChange={ ( e: any ) => setField({ ...field, content: e.target.value }) } />
//     </div>
//   )
// }
