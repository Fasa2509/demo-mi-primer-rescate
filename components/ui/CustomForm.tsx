import { useState } from 'react';
import { useSnackbar } from 'notistack';
import { isBefore } from 'date-fns';

import { CustomInput } from './CustomInput';
import { Article } from './Article';
import { IArticle, Field } from '../../interfaces';
import { ConfirmNotificationButtons } from '../../utils';
import styles from './Form.module.css';

export const CustomForm = () => {

    const { enqueueSnackbar } = useSnackbar();

    const [title, setTitle] = useState( '' );
    const [currentField, setCurrentField] = useState<Field>({ type: 'texto', content: '', content_: '' });
    const [fields, setFields] = useState<Array<Field>>([]);

    const addFieldArticle = ( e: any ) => {
        e.preventDefault();

        if ( currentField.type === 'contador' ) {
            if ( isBefore( new Date( currentField.content ), new Date() ) ) {
                return enqueueSnackbar('La fecha final no puede ser anterior a la fecha inicial', { variant: 'error' })
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

        enqueueSnackbar('El campo fue agregado', { variant: 'success', autoHideDuration: 2500 })
    }

    const cleanArticle = () => {
        new Promise((resolve) => {
            let key = enqueueSnackbar('¿Estás segur@ de que quieres vaciar el formulario?', {
                variant: 'info',
                autoHideDuration: 150000,
                action: ConfirmNotificationButtons,
            });

            const callback = ( e: any ) => {
                if ( e.target.matches(`.notification__buttons.accept.n${ key.toString().replace('.', '') } *`) ) {
                    console.log(e.target)
                    resolve({
                        accepted: true,
                        callback
                    });
                }

                if ( e.target.matches(`.notification__buttons.deny.n${ key.toString().replace('.', '') } *`) ) {
                    console.log(e.target)
                    resolve({
                        accepted: false,
                        callback
                    });
                }
            }

            document.addEventListener('click', callback)
            // @ts-ignore
        }).then(({ accepted, callback }: { accepted: boolean, callback: any }) => {
            document.removeEventListener('click', callback);

            if ( !accepted ) return;
            setFields([]);
            setTitle( '' );
            enqueueSnackbar('El artículo fue vaciado', { variant: 'info', autoHideDuration: 5000 });
        });
    }

    const saveArticle = () => {
        if ( fields.length === 0 )
            return enqueueSnackbar('No puedes guardar un artículo sin contenido', { variant: 'error', autoHideDuration: 3000 })
        
        new Promise(( resolve ) => {
            let key = enqueueSnackbar('¿Estás segur@ de que quieres guardar este artículo?', {
                variant: 'info',
                autoHideDuration: 15000,
                action: ConfirmNotificationButtons,
            })

            const callback = ( e: any ) => {
                if ( e.target.matches(`.notification__buttons.accept.n${ key.toString().replace('.', '') } *`) ) {
                    resolve({
                        accepted: true,
                        callback,
                    })
                }

                if ( e.target.matches(`.notification__buttons.deny.n${ key.toString().replace('.', '') } *`) ) {
                    resolve({
                        accepted: false,
                        callback,
                    })
                }
            }

            document.addEventListener('click', callback);
        })
        // @ts-ignore
        .then(({ accepted, callback }: { accepted: boolean, callback: any }) => {
            document.removeEventListener('click', callback);

            if ( !accepted ) return;

            if ( fields.length === 0 )
                return enqueueSnackbar('No puedes guardar un artículo sin contenido', { variant: 'error', autoHideDuration: 3000 })
        
            let lastArticles: IArticle[] = JSON.parse( window.localStorage.getItem('articles_2') || '[]' );
            
            lastArticles.unshift({ title, fields, createdAt: Date.now() });
            
            window.localStorage.setItem('articles_2', JSON.stringify( lastArticles ));
            
            return enqueueSnackbar('El artículo fue guardado con éxito', { variant: 'success' });
        })
    }

  return (
    <section>

        <form className={ styles.form } onSubmit={ addFieldArticle }>

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
            <button style={{ margin: 0 }} className='button' onClick={ cleanArticle }>Limpiar artículo</button>
        </div>

        <div style={{ textAlign: 'center' }}>
            <button style={{ backgroundColor: 'var(--secondary-color-2)' }} className='button' onClick={ saveArticle }>Guardar Artículo</button>
        </div>

    </section>
  )
}
