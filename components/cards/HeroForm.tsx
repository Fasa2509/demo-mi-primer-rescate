import { FC, useContext, useRef, useState } from 'react';
import { Box, Button } from '@mui/material';
import { useSnackbar } from 'notistack';

import { dbImages } from '../../database';
import { ScrollContext } from '../../context';
import { MyImage } from './MyImage';
import { Slider } from './Slider';
import { IIndexImage } from '../../interfaces';
import { ConfirmNotificationButtons, PromiseConfirmHelper, getImageNameFromUrl, getImageKeyFromUrl } from '../../utils';
import styles from '../ui/Form.module.css';

interface Props {
    images: IIndexImage[];
}

export const HeroForm: FC<Props> = ({ images: allImages }) => {
    
    const [images, setImages] = useState( allImages );
    const { isLoading, setIsLoading } = useContext( ScrollContext );
    const imagenRef = useRef<HTMLInputElement>( null );

    const { enqueueSnackbar } = useSnackbar();

    const requestUpload = async () => {
        if ( !imagenRef.current || !imagenRef.current.files || !imagenRef.current.files[0] )
            return enqueueSnackbar('Aún no has seleccionado ninguna imagen', { variant: 'info' });

        let message = ( imagenRef.current.files[0].size / ( 1024 * 1024 ) > 4 )
            ? 'La imagen pesa más de 4Mb, ¿continuar?'
            : '¿Subir imagen?'

        let key = enqueueSnackbar(message, {
            variant: 'info',
            autoHideDuration: 15000,
            action: ConfirmNotificationButtons,
        });

        const confirm = await PromiseConfirmHelper( key, 15000 );

        if ( !confirm ) return;

        setIsLoading( true );
        const res = await dbImages.uploadImageToS3( imagenRef.current.files[0] );
        
        enqueueSnackbar(res.message, { variant: !res.error ? 'success' : 'error' });
        !res.error && !res.imgUrl && enqueueSnackbar('No hay URL de la imagen', { variant: 'error' });

        !res.error && res.imgUrl &&
            setImages(( prevState ) => [...prevState, { _id: '', url: res.imgUrl!, alt: getImageNameFromUrl( res.imgUrl! ) }]);

        setIsLoading( false );

        return;
    }

    const removeImage = async ({ index, _id, url }: { index: number; _id: string; url: string; }) => {
        if ( images.length < 1 ) return enqueueSnackbar('No hay imágenes', { variant: 'info' });

        let key = enqueueSnackbar(`¿Segur@ que quieres eliminar la imagen ${ index }`, {
            variant: 'warning',
            autoHideDuration: 10000,
            action: ConfirmNotificationButtons,
        });

        const confirm = await PromiseConfirmHelper( key, 10000 );

        if ( !confirm ) return;
        
        setIsLoading( true );
        if ( _id ) {
            const res = await dbImages.deleteIndexImage( _id );
            
            if ( res.error ) {
                enqueueSnackbar(res.message, { variant: 'error' });
                setIsLoading( false );
                return;
            };
        }
        const resS3 = await dbImages.deleteImageFromS3( getImageKeyFromUrl( url ) );

        ( !resS3.error )
            ? setImages(( prevState ) => prevState.filter(( img, idx ) => idx !== index - 1))
            : setImages(( prevState ) => prevState.map(( img, idx ) => ( idx !== index - 1 ) ? img : { ...img, _id: '' }));

        setIsLoading( false );

        return enqueueSnackbar(resS3.message, { variant: !resS3.error ? 'success' : 'error' });
    }

    const saveChanges = async () => {
        if ( isLoading ) return;

        let key = enqueueSnackbar('¿Quieres guardar los cambios?', {
            variant: 'info',
            autoHideDuration: 12000,
            action: ConfirmNotificationButtons
        });

        const accepted = await PromiseConfirmHelper( key, 12000 );

        if ( !accepted ) return;

        setIsLoading( true );
        // filtramos los ids
        let newImages = images.map(({ url, alt }) => ({ imgUrl: url, imgName: alt }));
        
        const res = await dbImages.saveIndexImages( newImages );
        
        enqueueSnackbar(res.message, { variant: !res.error ? 'success' : 'error' });
        
        setIsLoading( false );
    }

    return (
        <section style={{ width: 'clamp(280px, 90%, 850px)', margin: '0 auto .5rem' }} className='fadeIn'>
            
            <form className={ styles.form }>

                <p className={ styles.subtitle }>Agregar Imagen de Inicio</p>

                <p>Las imágenes deben tener una dimensión de al menos 1280 x 720</p>

                <input ref={ imagenRef } className={ styles.no__display } accept='image/png, image/jpg, image/jpeg, image/gif, image/webp' type='file' name='image' onChange={ requestUpload } />
                <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: '.5rem 1rem', width: '100%' }}>
                    <Button className='button low--padding' fullWidth onClick={ () => isLoading || imagenRef.current!.click() }>Subir imagen</Button>
                    <Button className='button button--purple low--padding' color='primary' fullWidth onClick={ saveChanges }>Guardar cambios</Button>
                </Box>

            </form>

            <section className='fadeIn' style={{ margin: '0 auto', backgroundColor: '#fcfcfc', borderRadius: '.5rem', overflow: 'hidden', boxShadow: '0 0 1.2rem -.4rem #666' }}>
                <Slider identifier='hero-form' duration={ 8000 }>
                    {
                        images.map(({ _id, url, alt }, index) =>
                        <Box key={ index } sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%', aspectRatio: '16/9', position: 'relative' }}>
                            <Box sx={{ position: 'relative', display: 'block', width: '100%' }}>
                                <MyImage src={ url } alt={ alt } layout='responsive' width={ 1280 } height={ 720 } />
                            </Box>
                            <Box sx={{ position: 'absolute', zIndex: '99', top: '1rem', left: '1rem',  display: 'flex', alignItems: 'stretch', gap: '.5rem' }}>
                                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', fontWeight: 'bold', color: '#111', backgroundColor: '#fcfcfc', borderRadius: '4px', width: '1.8rem' }}>
                                { index + 1 }
                                </Box>
                                <Button className='button button--error low--padding low--font--size' onClick={ () => removeImage({ index: index + 1, _id, url }) }>Eliminar</Button>
                            </Box>
                        </Box>
                    )
                    }
                </Slider>
            </section>

        </section>
    )
}
