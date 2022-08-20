import { useState } from 'react';
import { isBefore } from 'date-fns';

import { CustomInput } from './CustomInput';
import { Article } from './Article';
import { callNotification } from '../../utils/notification';
import { IArticle, Field } from '../../interfaces';
import styles from './Form.module.css';

export const CustomForm = () => {

    const [title, setTitle] = useState( '' );
    const [currentField, setCurrentField] = useState<Field>({ type: 'texto', content: '', content_: '' });
    const [fields, setFields] = useState<Array<Field>>([]);

    const handleSubmit = ( e: any ) => {
        e.preventDefault();

        if ( currentField.type === 'contador' ) {
            if ( isBefore( new Date( currentField.content ), new Date() ) ) {
                return callNotification({
                    title: 'Error de Fecha',
                    message: 'La fecha final no puede ser anterior a la fecha inicial',
                    notType: 'danger',
                    duration: 3000,
                })
            }
        }

        if ( currentField.type !== 'imagen' ) {
            setFields([...fields, currentField]);
        } else {
            if ( fields.length > 0 && fields.at(-1)?.type === 'imagen' ) {
                let lastState: Field[] = JSON.parse( JSON.stringify(fields) );

                lastState.at(-1)?.images?.push({ url: currentField.content, alt: currentField.content_ || '', width: currentField.width || 0, height: currentField.height || 0 });

                setFields( lastState )
            } else {
                setFields([...fields, { type: 'imagen', content: '', images: [{ url: currentField.content, alt: currentField.content_ || '', width: currentField.width || 0, height: currentField.height || 0 }] }])
            }
        }

        setCurrentField({ ...currentField, content: '', content_: '', width: 0, height: 0 })

        callNotification({
            title: 'Campo agregado',
            message: 'El campo ha sido agregado exitosamente',
            notType: 'success',
            duration: 2000,
        })
    }

    const saveArticle = () => {
        if ( fields.length === 0 )
            return callNotification({
                title: 'Error',
                message: 'No puedes guardar un artículo sin contenido',
                notType: 'danger',
                duration: 4000,
            })
        
        let confirm = window.confirm('¿Estás segur@ de que quieres guardar este artículo?');

        if ( !confirm )
            return callNotification({
                title: 'Aviso',
                message: 'El artículo no fue guardado',
                notType: 'warning',
                duration: 4000,
            })

        let lastArticles: IArticle[] = JSON.parse( window.localStorage.getItem('articles') || '[]' );

        lastArticles.unshift({ title, fields, createdAt: Date.now() });

        window.localStorage.setItem('articles', JSON.stringify( lastArticles ));

        return callNotification({
            title: '¡Listo!',
            message: 'El artículo fue guardado con éxito',
            onScreen: false,
            duration: 5000,
        })
    }

  return (
    <section>

        <form className={ styles.form } onSubmit={ handleSubmit }>

            <p className={ styles.subtitle }>Crea un artículo para la página</p>
            
            <input style={{ border: '2px solid var(--secondary-color-1)' }} className='input' value={ title } type={ 'text' } name={ 'title' } placeholder={ 'Título' } required onChange={ ( e: any ) => setTitle( e.target.value ) } />
            
            <div className={ styles.header }>
                <p>Agrega un campo</p>

                <select value={ currentField.type } onChange={ ( e: any ) => setCurrentField({ type: e.target.value, content: '', content_: '', width: 1, height: 1 }) }>
                    <option value="texto">Texto</option>
                    <option value="link">Link</option>
                    <option value="subtitulo">Subtítulo</option>
                    <option value="imagen">Imagen</option>
                    <option value="contador">Contador</option>
                </select>
            </div>

            <CustomInput field={ currentField } setField={ setCurrentField } />

            <button className='button'>Añadir campo</button>
        </form>

        <p style={{ marginBottom: '.5em' }} className={ styles.subtitle }>Esto es un preview del artículo a publicar</p>

        <Article title={ title } fields={ fields } createdAt={ Date.now() } />

        <div style={{ display: 'flex', justifyContent: 'space-around', marginBottom: '1em' }}>
            <button style={{ margin: 0 }} className='button' onClick={ () => setFields(fields.slice(0, fields.length - 1)) }>Quitar último</button>
            <button style={{ margin: 0 }} className='button' onClick={ () => {
                setFields([])
                setTitle( '' )
            } }>Limpiar artículo</button>
        </div>

        <div style={{ textAlign: 'center' }}>
            <button style={{ backgroundColor: 'var(--secondary-color-2)' }} className='button' onClick={ saveArticle }>Guardar Artículo</button>
        </div>

    </section>
  )
}
