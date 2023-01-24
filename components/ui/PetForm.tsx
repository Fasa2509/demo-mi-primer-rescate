import { FC, useContext, useRef, useState } from "react";
import { Box, Button, TextField } from "@mui/material";
import { useSnackbar } from "notistack";
import Compressor from 'compressorjs';

import { dbImages, dbPets } from "../../database";
import { PetType } from "../../interfaces";
import { AuthContext, ScrollContext } from "../../context";
import { MyImage } from "../cards";
import { ConfirmNotificationButtons, getImageKeyFromUrl, getImageNameFromUrl, PromiseConfirmHelper } from "../../utils";
import styles from './Form.module.css';
import { mprRevalidatePage } from "../../mprApi";

interface Props {
    pet: PetType;
}

export const PetForm: FC<Props> = ({ pet }) => {

    const { user } = useContext( AuthContext );
    const { isLoading, setIsLoading } = useContext( ScrollContext );
    const { enqueueSnackbar } = useSnackbar();
    const [imgUrl, setImgUrl] = useState('');

    const nameRef = useRef<HTMLInputElement>( null );
    const imageRef = useRef<HTMLInputElement>( null );
    const descriptionRef = useRef<HTMLInputElement>( null );

    const handleSubmit = async () => {
        if ( !user ) return enqueueSnackbar('Inicia sesión primero', { variant: 'warning' });

        if ( !nameRef.current || !imageRef.current || !descriptionRef.current ) return;
        
        let name = nameRef.current.value.trim();
        let description = descriptionRef.current.value.trim();

        if ( name.length < 2 ) return enqueueSnackbar('El nombre es muy corto', { variant: 'info' });
        if ( !imgUrl ) return enqueueSnackbar('Sube una imagen de la mascota', { variant: 'info' });
        if ( description.length < 10 ) return enqueueSnackbar('La descripción es muy corta', { variant: 'info' });

        let key = enqueueSnackbar('¿Quieres publicar esta mascota?', {
            variant: 'info',
            autoHideDuration: 15000,
            action: ConfirmNotificationButtons,
        });

        const confirm = await PromiseConfirmHelper( key, 15000 );

        if ( !confirm ) return;

        setIsLoading( true );
        const res = await dbPets.createNewPet({ name, description, images: [imgUrl], type: pet });

        if ( !res.error ) {
            const resRev = await mprRevalidatePage(`/adoptar/${ pet }`);
            enqueueSnackbar(resRev.message, { variant: !resRev.error ? 'success' : 'error' });
        }
        setIsLoading( false );

        enqueueSnackbar(res.message, { variant: !res.error ? 'success' : 'error' });
        
        if ( !res.error ) {
            nameRef.current!.value = '';
            descriptionRef.current!.value = '';
            imageRef.current!.files = null;
            setImgUrl('');
        }
    }

    const requestUploadObject = async () => {
        if ( !imageRef.current || !imageRef.current.files || !imageRef.current.files[0] )
            return enqueueSnackbar('Aún no has seleccionado ninguna imagen', { variant: 'info' });

        if ( imageRef.current.files[0].size / ( 1024 * 1024 ) > 4 ) {
            let key = enqueueSnackbar('La imagen pesa más de 4Mb así que será comprimida, ¿continuar?', {
                variant: 'info',
                autoHideDuration: 15000,
                action: ConfirmNotificationButtons,
            });
    
            const confirm = await PromiseConfirmHelper( key, 15000 );
    
            if ( !confirm ) return;

            new Compressor(imageRef.current.files[0], {
                quality: 0.9,
                maxWidth: 650,
                success: async ( compressedImage ) => {
                    setIsLoading( true );
                    const res = await dbImages.uploadImageToS3( compressedImage );
                    setIsLoading( false );
            
                    enqueueSnackbar(res.message, { variant: !res.error ? 'success' : 'error' });
                    !res.error && !res.imgUrl && enqueueSnackbar('No hay URL de la imagen', { variant: 'info' });
                    res.imgUrl && setImgUrl( res.imgUrl );
                },
                error: () => {
                    setIsLoading( false );
                    enqueueSnackbar('Ocurrió un error procesando la imagen', { variant: 'error' });
                }
            });

            return;
        }

        setIsLoading( true );
        const res = await dbImages.uploadImageToS3(imageRef.current.files[0]);
        setIsLoading( false );

        enqueueSnackbar(res.message, { variant: !res.error ? 'success' : 'error' });
        !res.error && !res.imgUrl && enqueueSnackbar('No hay URL de la imagen', { variant: 'info' });
        res.imgUrl && setImgUrl( res.imgUrl );
    }

    const requestDeleteObject = async () => {
        if ( !imgUrl ) return enqueueSnackbar('No hay imagen', { variant: 'info' });

        let key = enqueueSnackbar('¿Quieres eliminar la imagen?', {
            variant: 'info',
            autoHideDuration: 15000,
            action: ConfirmNotificationButtons,
        });
    
        const confirm = await PromiseConfirmHelper( key, 15000 );
    
        if ( !confirm ) return;

        setIsLoading( true );
        const res = await dbImages.deleteImageFromS3( getImageKeyFromUrl( imgUrl ) );
        setIsLoading( false );

        enqueueSnackbar(res.message, { variant: !res.error ? 'success' : 'error' });

        if ( !res.error ) setImgUrl('');
    }

  return (
    <form className={ styles.form }>
        <p className={ styles.title }>Agregar una nueva mascota</p>

        <TextField
            inputRef={ nameRef }
            name='name'
            label='¿Cuál es su nombre?'
            type='text'
            color='secondary'
            variant='filled'
            fullWidth
        />

        <Box display='flex' flexDirection='column' gap='1rem'>
            <input ref={ imageRef } className={ styles.no__display } accept='image/png, image/jpg, image/jpeg, image/gif, image/webp' type='file' name='image' onChange={ requestUploadObject } />

            { imgUrl &&
                <Box className='fadeIn img-container' sx={{ position: 'relative', alignSelf: 'center' }}>
                    <MyImage src={ imgUrl } alt={ getImageNameFromUrl( imgUrl ) } width={ 350 } height={ 350 } layout='intrinsic' objectFit="cover" />
                </Box>
            }

            <div>
                <>
                { imgUrl
                    ? <Button className='button button--purple fadeIn' fullWidth onClick={ requestDeleteObject }>Eliminar imagen</Button>
                    : ( <>
                            <p className='fadeIn' style={{ margin: 0, fontSize: '.9rem' }}>¡Recuerda que la imagen debe ser cuadrada!</p>
                            <Button className='button fadeIn' color='primary' fullWidth onClick={ () => isLoading || imageRef.current!.click() }>Subir imagen</Button>
                        </>
                    )
                }
                </>
            </div>
        </Box>

        <TextField
            inputRef={ descriptionRef }
            name='description'
            label='¿Cuál es su historia?'
            type='text'
            color='secondary'
            variant='filled'
            fullWidth
            multiline
            minRows={ 4 }
        />

        <Button className='button button--purple low--padding' onClick={ handleSubmit }>Guardar mascota</Button>
    </form>
  )
}
