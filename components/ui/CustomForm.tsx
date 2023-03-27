import { FC, FormEvent, useContext, useRef, useState } from 'react';
import { Box, Button, FormControl, InputLabel, MenuItem, Select, TextField } from '@mui/material';
import { useSnackbar } from 'notistack';
import { isBefore } from 'date-fns';
import Compressor from 'compressorjs';

import { dbArticles, dbImages } from '../../database';
import { ScrollContext } from '../../context';
import { mprRevalidatePage } from '../../mprApi';
import { ConfirmNotificationButtons, PromiseConfirmHelper, getImageNameFromUrl, getImageKeyFromUrl } from '../../utils';
import { Article } from './Article';
import { Field, FieldType } from '../../interfaces';
import styles from './Form.module.css';

export const CustomForm: FC = () => {

    const textoRef = useRef<HTMLInputElement>( null );
    const linkRef = useRef<HTMLInputElement>( null );
    const linkTextRef = useRef<HTMLInputElement>( null );
    const subtituloRef = useRef<HTMLInputElement>( null );
    const imagenRef = useRef<HTMLInputElement>( null );
    const contadorRef = useRef<HTMLInputElement>( null );
    const widthRef = useRef<HTMLInputElement>( null );
    const heightRef = useRef<HTMLInputElement>( null );
    
    const { enqueueSnackbar } = useSnackbar();
    const { isLoading, setIsLoading } = useContext( ScrollContext );

    const [title, setTitle] = useState( '' );
    const [fields, setFields] = useState<Array<Field>>([]);
    const [currentType, setCurrentType] = useState<FieldType>( 'texto' );


    const addFieldArticle = ( e: FormEvent ) => {
        e.preventDefault();

        if ( currentType === 'imagen' ) return;

        let content = '';
        let content_ = '';

        if ( currentType === 'texto' ) {
            if ( !textoRef.current!.value.trim() ) return enqueueSnackbar('Por favor introduce un valor', { variant: 'info' });
            content = textoRef.current!.value.trim();
            textoRef.current!.value = '';
        }

        if ( currentType === 'link' ) {
            if ( !linkRef.current!.value.trim() || !linkTextRef.current!.value.trim() ) return enqueueSnackbar('Por favor introduce un valor', { variant: 'info' });
            content = linkRef.current!.value.trim();
            linkRef.current!.value = '';
            content_ = linkTextRef.current!.value.trim();
            linkTextRef.current!.value = '';
        }

        if ( currentType === 'contador' ) {
            if ( !contadorRef.current!.value ) return enqueueSnackbar('Por favor introduce una fecha', { variant: 'info' });
            if ( isBefore(new Date(contadorRef.current!.value), (() => new Date())()) ) return enqueueSnackbar('La fecha final no puede ser anterior a la fecha inicial', { variant: 'warning' });
            content = contadorRef.current!.value;
            contadorRef.current!.value = '';
        }

        if ( currentType === 'subtitulo' ) {
            if ( !subtituloRef.current!.value.trim() ) return enqueueSnackbar('Por favor introduce un valor', { variant: 'info' });
            content = subtituloRef.current!.value.trim();
            subtituloRef.current!.value = '';
        }
        
        setFields([...fields, { type: currentType, content, content_, images: [] }]);
    }


    const removeLastField = async () => {
        if ( fields.length === 0 || isLoading ) return;

        if ( fields.at(-1)?.type !== 'imagen' )
            return setFields(( prevState ) => prevState.slice(0, prevState.length - 1) );

        if ( isLoading ) return;

        let key = enqueueSnackbar('¿Quieres eliminar la última imagen?', {
            variant: 'info',
            autoHideDuration: 15000,
            action: ConfirmNotificationButtons,
        });

        const confirm: any = await PromiseConfirmHelper( key, 15000 );

        if ( !confirm ) return;

        const imgKey = getImageKeyFromUrl( fields.at(-1)!.images.at(-1)!.url );

        setIsLoading( true );
        const res = await dbImages.deleteImageFromS3( imgKey );
        setIsLoading( false );

        enqueueSnackbar(res.message, { variant: !res.error ? 'success' : 'error' });

        !res.error && fields.at(-1)!.images.length > 1 && setFields(( prevState ) => prevState.map(( field, index ) => {
            if ( index !== fields.length - 1 ) return field;
            return {
                ...field,
                images: field.images.slice(0, field.images.length - 1)
            }
        }));

        !res.error && fields.at(-1)!.images.length === 1 && setFields(( prevState ) => prevState.slice(0, prevState.length - 1));
    }


    const cleanArticle = async () => {
        if ( fields.length === 0 ) return;

        if ( fields.some(( field ) => field.type === 'imagen') )
            return enqueueSnackbar('Elimina las imágenes antes de limpiar el artículo', { variant: 'info' });

        let key = enqueueSnackbar('¿Segur@ que quieres vaciar el formulario?', {
            variant: 'info',
            autoHideDuration: 15000,
            action: ConfirmNotificationButtons,
        });

        const confirm = await PromiseConfirmHelper( key, 15000 );

        if ( !confirm ) return;

        setTitle('');

        if ( currentType === 'texto' ) textoRef.current!.value = '';

        if ( currentType === 'link' ) {
            linkRef.current!.value = '';
            linkTextRef.current!.value = '';
        }

        if ( currentType === 'contador' ) contadorRef.current!.value = '';

        if ( currentType === 'subtitulo' ) subtituloRef.current!.value = '';

        enqueueSnackbar('El artículo fue limpiado', { variant: 'info' });
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

        setIsLoading( true );

        const res = await dbArticles.saveNewArticle( title, fields );
        enqueueSnackbar(res.message || 'Error', { variant: !res.error ? 'info' : 'error' });
            
        if ( !res.error ) {
            if ( process.env.NODE_ENV === 'production' ) {
                const revRes = await mprRevalidatePage( '/' );
                enqueueSnackbar(revRes.message || 'Error', { variant: !revRes.error ? 'info' : 'error' });                    
            }

            setTitle('');
            setCurrentType( 'texto' );
            setFields([]);
        }

        setIsLoading( false );
        return;
    }


    const requestUpload = async () => {
        if ( isLoading ) return;

        if ( !imagenRef.current || !imagenRef.current.files || !imagenRef.current.files[0] )
            return enqueueSnackbar('Aún no has seleccionado ninguna imagen', { variant: 'info' });

        if ( !widthRef.current || !heightRef.current ) return enqueueSnackbar('No hay referencias asignadas', { variant: 'warning' });

        let width = Number(widthRef.current.value);
        let height = Number(heightRef.current.value);

        if ( isNaN(width) || isNaN(height)
            || width < 1 || height < 1 )
            return enqueueSnackbar('La dimensión establecida no es válida', { variant: 'info' });

        if ( imagenRef.current.files[0].size / ( 1024 * 1024 ) > 5 ) {
            let key = enqueueSnackbar('La imagen pesa más de 5Mb así que será comprimida, ¿continuar?', {
                variant: 'info',
                autoHideDuration: 15000,
                action: ConfirmNotificationButtons,
            });
    
            const confirm = await PromiseConfirmHelper( key, 15000 );
    
            if ( !confirm ) return;

            new Compressor(imagenRef.current.files[0], {
                quality: 0.8,
                success: async ( compressedImage ) => {
                    setIsLoading( true );
                    const res = await dbImages.uploadImageToS3( compressedImage );
                    setIsLoading( false );

                    enqueueSnackbar(res.message, { variant: !res.error ? 'success' : 'error' });
                    !res.error && !res.imgUrl && enqueueSnackbar('No hay URL de la imagen', { variant: 'info' });
            
                    if ( !res.error && res.imgUrl ) {
                        if ( fields.length === 0 || fields.at(-1)?.type !== 'imagen' ) {
                            setFields([...fields, { type: 'imagen', content: '', content_: '', images: [{ url: res.imgUrl, alt: getImageNameFromUrl( imagenRef.current!.files![0].name ), width, height }] }]);
                        } else {
                            setFields(fields.map(( field, index ) => {
                                if ( index < fields.length - 1 ) return field;
            
                                return {
                                    ...field,
                                    images: [
                                        ...field.images,
                                        { url: res.imgUrl || '', alt: getImageNameFromUrl( imagenRef.current!.files![0].name ), width, height }
                                    ]
                                }
                            }))
                        }
                    }
                },
                error: () => {
                    setIsLoading( false );
                    enqueueSnackbar('Ocurrió un error procesando la imagen', { variant: 'error' });
                }
            });

            return;
        }

        setIsLoading( true );
        const res = await dbImages.uploadImageToS3( imagenRef.current!.files[0] );
        setIsLoading( false );

        enqueueSnackbar(res.message, { variant: !res.error ? 'success' : 'error' });
        !res.error && !res.imgUrl && enqueueSnackbar('No hay URL de la imagen', { variant: 'info' });
            
        if ( !res.error && res.imgUrl ) {
            if ( fields.length === 0 || fields.at(-1)?.type !== 'imagen' ) {
                setFields([...fields, { type: 'imagen', content: '', content_: '', images: [{ url: res.imgUrl, alt: getImageNameFromUrl( imagenRef.current!.files![0].name ), width, height }] }]);
            } else {
                setFields(fields.map(( field, index ) => {
                    if ( index < fields.length - 1 ) return field;

                    return {
                        ...field,
                        images: [
                            ...field.images,
                            { url: res.imgUrl || '', alt: getImageNameFromUrl( imagenRef.current!.files![0].name ), width, height }
                        ]
                    }
                }))
            }
        }
    }


  return (
    <section>

        <form className={ styles.form }>

            <p className={ styles.subtitle }>Crea un artículo para la página</p>
            
            <TextField
                name='title'
                label='Título del artículo'
                type='text'
                color='secondary'
                variant='filled'
                fullWidth
                value={ title }
                onChange={ ({ target }) => setTitle( target.value ) }
            />

            <div className={ styles.header }>
                <p>Agrega un campo</p>

                <FormControl>
                    <InputLabel id="form-type" color='secondary'>Campo</InputLabel>
                    <Select
                        labelId='form-type'
                        value={ currentType }
                        label='Campo'
                        color='secondary'
                        size='small'
                        sx={{ width: '6.5rem', color: '#333', fontSize: '.9rem' }}
                        onChange={ ({ target }) => setCurrentType( target.value as FieldType ) }
                    >
                        <MenuItem value='texto'>Texto</MenuItem>
                        <MenuItem value='link'>Link</MenuItem>
                        <MenuItem value='subtitulo'>Subtítulo</MenuItem>
                        <MenuItem value='imagen'>Imagen</MenuItem>
                        <MenuItem value='contador'>Contador</MenuItem>
                    </Select>
                </FormControl>
            </div>

            { ( currentType === 'texto' ) && (
                    <div className={ styles.field }>
                        <TextField inputRef={ textoRef } name='texto' label='Texto' size='small' color='secondary' variant='filled' multiline rows={ 4 } />
                    </div>
                )
            }

            {
                ( currentType === 'link' ) && (
                    <div className={ styles.field }>
                        <TextField inputRef={ linkRef } name='link' type='url' label='URL' size='small' color='secondary' variant='filled' />
                        <TextField inputRef={ linkTextRef } name='textLink' type='text' label='Texto' size='small' color='secondary' variant='filled' />
                    </div>
                )
            }
            
            { ( currentType === 'subtitulo' ) && (
                <div className={ styles.field }>
                    <TextField inputRef={ subtituloRef } name='subtitulo' type='text' label='Subtítulo' size='small' color='secondary' variant='filled' />
                </div>
              )
            }
            
            { ( currentType === 'imagen' ) && (
                    <div className={ `${ styles.field } ${ styles.image }` }>
                        <input ref={ imagenRef } className={ styles.no__display } accept='image/png, image/jpg, image/jpeg, image/gif, image/webp' type='file' name='image' />
                        <Box display='flex' gap='1rem' width='100%'>
                            <div style={{ flexGrow: 1 }}>
                                <TextField
                                    inputRef={ widthRef }
                                    name='width'
                                    type='number'
                                    label='Ancho'
                                    size='small'
                                    color='secondary'
                                    variant='filled'
                                    inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }}
                                />
                            </div>
                            <div style={{ flexGrow: 1 }}>
                                <TextField
                                    inputRef={ heightRef }
                                    name='height'
                                    type='number'
                                    label='Alto'
                                    size='small'
                                    color='secondary'
                                    variant='filled'
                                    inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }}
                                />
                            </div>
                        </Box>

                        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: '.5rem 1rem', width: '100%' }}>
                            <Button className='button low--padding' color='primary' fullWidth onClick={ () => isLoading || imagenRef.current!.click() }>Seleccionar imagen</Button>
                            <Button className='button button--purple low--padding' fullWidth onClick={ requestUpload }>Subir imagen</Button>
                        </Box>
                    </div>
                )
            }
            
            { ( currentType === 'contador' ) && (
                    <div className={ `${ styles.field } ${ styles.counter }` }>
                        <TextField inputRef={ contadorRef } name='contador' type='datetime-local' size='small' color='secondary' />
                    </div>
                )
            }

            { currentType !== 'imagen' &&
                <Button className='button low--padding fadeIn' onClick={ addFieldArticle }>Añadir campo</Button>
            }
        </form>

        <p className={ styles.subtitle }>Esto es un preview del artículo a publicar</p>

        <Article article={{ _id: 'article_example', title, fields, createdAt: Date.now() }} />

        <Box sx={{ display: 'flex', justifyContent: 'space-around', marginBottom: '1rem' }}>
            <Button className='button low--padding' onClick={ removeLastField }>Quitar último</Button>
            <Button className='button low--padding' onClick={ cleanArticle }>Limpiar artículo</Button>
        </Box>

        <Box sx={{ textAlign: 'center' }}>
            <Button className='button button--purple low--padding' onClick={ saveArticle }>Guardar Artículo</Button>
        </Box>

    </section>
  )
}
