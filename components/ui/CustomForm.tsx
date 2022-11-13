import { FC, useState } from 'react';
import { useSnackbar } from 'notistack';
import { isBefore } from 'date-fns';

import { CustomInput } from './CustomInput';
import { Article } from './Article';
import { Field, IArticle } from '../../interfaces';
import { ConfirmNotificationButtons, PromiseConfirmHelper } from '../../utils';
import styles from './Form.module.css';
import { mprApi, mprRevalidatePage } from '../../mprApi';
import axios from 'axios';
import { dbArticles } from '../../database';

export const CustomForm: FC = () => {

    const { enqueueSnackbar } = useSnackbar();

    const [title, setTitle] = useState( '' );
    const [currentField, setCurrentField] = useState<Field>({ type: 'texto', content: '', content_: '', images: [] });
    const [fields, setFields] = useState<Array<Field>>([]);
    const [dimension, setDimension] = useState<{ width: number; height: number; }>({ width: 1, height: 1 });

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
                let lastState: Field[] = JSON.parse( JSON.stringify( fields || '[]' ) );

                lastState.at(-1)?.images.push({ url: currentField.content.trim(), alt: currentField.content_.trim(), width: dimension.width, height: dimension.height });

                setFields( lastState );
            } else {
                setFields([...fields, { type: 'imagen', content: '', content_: '', images: [{ url: currentField.content.startsWith('/') ? currentField.content : '/' + currentField.content, alt: currentField.content_, width: dimension.width, height: dimension.height }] }])
            }
        }

        setCurrentField({ ...currentField, content: '', content_: '', images: [] });
        setDimension({ width: 1, height: 1 });

        enqueueSnackbar('El campo fue agregado', { variant: 'success', autoHideDuration: 2500 });
    }

    const cleanArticle = async () => {
            let key = enqueueSnackbar('¿Segur@ que quieres vaciar el formulario?', {
                variant: 'info',
                autoHideDuration: 15000,
                action: ConfirmNotificationButtons,
            });

            const confirm = await PromiseConfirmHelper( key, 15000 );

            if ( !confirm ) return;

            setFields([]);
            setTitle( '' );

            enqueueSnackbar('El artículo fue vaciado', { variant: 'info', autoHideDuration: 5000 });
    }

    const saveArticle = async () => {
        if ( !title )
            return enqueueSnackbar('No puedes guardar un artículo sin título', { variant: 'error', autoHideDuration: 3000 });

        if ( fields.length === 0 )
            return enqueueSnackbar('No puedes guardar un artículo sin contenido', { variant: 'error', autoHideDuration: 3000 });

            let key = enqueueSnackbar('¿Segur@ que quieres guardar este artículo?', {
                variant: 'info',
                autoHideDuration: 15000,
                action: ConfirmNotificationButtons,
            })

            const confirm = await PromiseConfirmHelper( key, 15000 );

            if ( !confirm ) return;

            const res = await dbArticles.saveNewArticle( title, fields );
            enqueueSnackbar(res.message || 'Error', { variant: !res.error ? 'info' : 'error' });
            
            if ( !res.error ) {
                if ( process.env.NODE_ENV === 'production' ) {
                    const revRes = await mprRevalidatePage( '/' );
                    enqueueSnackbar(revRes.message || 'Error', { variant: !revRes.error ? 'info' : 'error' });                    
                }
            }

            return;
    }

    const resetForms = ( e: any ) => {
        setCurrentField({ type: e.target.value, content: '', content_: '', images: [] });
        setDimension({ width: 1, height: 1 });
    }

  return (
    <section>

        <form className={ styles.form } onSubmit={ addFieldArticle }>

            <p className={ styles.subtitle }>Crea un artículo para la página</p>
            
            <input style={{ border: '2px solid var(--secondary-color-1)' }} className='input' value={ title } type={ 'text' } name={ 'title' } placeholder={ 'Título' } onChange={ ( e: any ) => setTitle( e.target.value ) } />
            
            <div className={ styles.header }>
                <p>Agrega un campo</p>

                <select value={ currentField.type } onChange={ resetForms }>
                    <option value="texto">Texto</option>
                    <option value="link">Link</option>
                    <option value="subtitulo">Subtítulo</option>
                    <option value="imagen">Imagen</option>
                    <option value="contador">Contador</option>
                </select>
            </div>

            <CustomInput field={ currentField } setField={ setCurrentField } dimension={ dimension } setDimension={ setDimension } />

            <button className='button'>Añadir campo</button>
        </form>

        <p style={{ marginBottom: '.5em' }} className={ styles.subtitle }>Esto es un preview del artículo a publicar</p>

        <Article article={{ _id: 'article_example',title, fields, createdAt: Date.now() }} />

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
