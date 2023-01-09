import { FormEvent, useContext, useRef, useState } from "react";
import { Box, Button, Input, TextField } from "@mui/material";
import { useSnackbar } from "notistack";

import { dbImages, dbPets } from "../../database";
import { AuthContext, ScrollContext } from "../../context";
import { MyImage } from "../cards";
import { ConfirmNotificationButtons, getImageKeyFromUrl, PromiseConfirmHelper } from "../../utils";
import styles from './Form.module.css';

export const PetChangeForm = () => {

    const { user } = useContext( AuthContext );
    const { isLoading, setIsLoading } = useContext( ScrollContext );
    const { enqueueSnackbar } = useSnackbar();

    const name = useRef<HTMLInputElement>( null );
    const imageRef = useRef<HTMLInputElement>( null );
    const description = useRef<HTMLInputElement>( null );

    const [images, setImages] = useState<string[]>(['', '', '', '']);

    const handleSubmit = async ( e: FormEvent ) => {
        e.preventDefault();
        if ( !user || !user._id ) return enqueueSnackbar('Inicia sesión antes de enviar tu mascota', { variant: 'warning' });
        if ( !name.current!.value.trim() || !description.current!.value.trim() ) return enqueueSnackbar('La información de la mascota está incompleta', { variant: 'warning' });
        
        if ( images.filter(( img ) => img).length < 2 )
            return enqueueSnackbar('Agrega más imágenes de tu mascota', { variant: 'warning' });
            
        if ( images.filter(( img ) => img).length > 4 )
            return enqueueSnackbar('Hay muchas imágenes', { variant: 'warning' });

        let key = enqueueSnackbar('¿Quieres publicar esta historia?', {
            variant: 'info',
            autoHideDuration: 12000,
            action: ConfirmNotificationButtons,
        });

        let accepted = await PromiseConfirmHelper(key, 12000);

        if ( !accepted ) return;

        setIsLoading( true );
        const res = await dbPets.createNewPet({
            name: name.current!.value.trim(),
            images: images.filter(( img ) => img),
            description: description.current!.value,
            type: 'cambios',
        });
        setIsLoading( false );

        enqueueSnackbar(res.message, { variant: !res.error ? 'success' : 'error' });
    }

    const handleAddOrRemoveImage = async ( n: 1 | -1, imgIndex: number, imgUrl?: string ) => {
        if ( n === 1 ) {

            if ( !imgUrl ) return;
            let ndx = images.indexOf('') ?? -1;
            setImages( images.map(( img, index ) => index !== ndx ? img : imgUrl ));
            imageRef.current!.value = '';

        } else {

            if ( isLoading ) return;
            if ( !images[imgIndex] ) return;

            let key = enqueueSnackbar('¿Quieres eliminar esta imagen?', {
                variant: 'info',
                autoHideDuration: 12000,
                action: ConfirmNotificationButtons,
            });
    
            let accepted = await PromiseConfirmHelper(key, 12000);
    
            if ( !accepted ) return;

            setIsLoading( true );
            const res = await dbImages.deleteImageFromS3( getImageKeyFromUrl( images[imgIndex] ) );
            setIsLoading( false );

            enqueueSnackbar(res.message, { variant: !res.error ? 'success' : 'error' });
            !res.error && setImages( images.map(( img, index ) => index === imgIndex ? '' : img) );

        }
    }

    const requestUpload = async () => {
        if ( !user ) return enqueueSnackbar('Inicia sesión para subir una imagen', { variant: 'info' });

        if ( !imageRef.current || !imageRef.current.files || !imageRef.current.files[0] )
            return;

        if ( images.filter(img => img).length >= 4 ) return enqueueSnackbar('Ya hay muchas imágenes', { variant: 'info' });

        if ( imageRef.current.files[0].size / ( 1024 * 1024 ) > 4 )
            return enqueueSnackbar('¡Parece que la imagen pesa mucho! Intenta comprimirla', { variant: 'info' });

        setIsLoading( true );
        const res = await dbImages.uploadImageToS3(imageRef.current.files[0]);
        setIsLoading( false );

        enqueueSnackbar(res.message, { variant: !res.error ? 'success' : 'error' });
        !res.error && !res.imgUrl && enqueueSnackbar('No hay URL de la imagen', { variant: 'info' });
        res.imgUrl && handleAddOrRemoveImage(1, 0, res.imgUrl);
    }

    return (
        <form className={ styles.pet__form } onSubmit={ handleSubmit }>

            <TextField
                inputRef={ name }
                name='nombre'
                label='Nombre de tu mascota'
                type='text'
                color='secondary'
                variant='filled'
                fullWidth
            />

            <input ref={ imageRef } className={ styles.no__display } accept='image/png, image/jpg, image/jpeg, image/gif, image/webp' type='file' name='image' onChange={ requestUpload } />

            <p>¡Las imágenes de tu mascota deben ser preferiblemente cuadradas para que se muestren correctamente!</p>

            <Box display='flex' flexWrap='wrap' gap='1rem' sx={{ justifyContent: { xs: 'center', md: 'space-between' } }}>
                {
                    images.map(( img, index ) =>
                        <Box key={ index } display='flex' flexDirection='column' sx={{ border: 'thin solid var(--secondary-color-1)', borderRadius: '.4rem', overflow: 'hidden' }}>
                            <Box
                                className={ styles.pet__box }
                                onClick={ () => isLoading || imageRef.current!.click() }
                            >
                                { images[index] && <MyImage className='fadeIn' src={ img } alt={ img } width={ 200 } height={ 200 } objectFit='cover' /> }
                            </Box>
                            <Button color='secondary' sx={{ borderRadius: 0, height: 30 }} onClick={ () => handleAddOrRemoveImage( -1, index ) }>Remover</Button>
                        </Box>
                    )
                }
            </Box>

            <TextField
                inputRef={ description }
                name='description'
                label='¿Cuál es tu historia?'
                type='text'
                color='secondary'
                variant='filled'
                fullWidth
                minRows={ 3 }
                maxRows={ 10 }
                multiline
            />

            <Input type='submit' color='secondary' value='Publicar mi mascota' />
        </form>
    )
}
