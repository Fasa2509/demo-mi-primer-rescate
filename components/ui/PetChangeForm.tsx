import { FormEvent, useContext, useState } from "react";
import { Box, Button, Input, TextField } from "@mui/material";
import { useSnackbar } from "notistack";

import { dbPets } from "../../database";
import { AuthContext, ScrollContext } from "../../context";
import { MyImage } from "../cards";
import styles from './Form.module.css';
import { ConfirmNotificationButtons, PromiseConfirmHelper } from "../../utils";

export const PetChangeForm = () => {

    const { user } = useContext( AuthContext );
    const { setIsLoading } = useContext( ScrollContext );
    const { enqueueSnackbar } = useSnackbar();

    const [form, setForm] = useState({
        name: '',
        images: ['', '' , '', ''],
        description: '',
    });

    const [addImage, setAddImage] = useState('');

    const handleSubmit = async ( e: FormEvent ) => {
        e.preventDefault();
        if ( !user || !user._id ) return enqueueSnackbar('Inicia sesión antes de enviar tu mascota', { variant: 'warning' });
        if ( !form.name.trim() || !form.description.trim() ) return enqueueSnackbar('La información de la mascota está incompleta', { variant: 'warning' });
        
        if ( form.images.filter(( img ) => img).length < 2 )
            return enqueueSnackbar('Agrega más imágenes de tu mascota', { variant: 'warning' });
            
        if ( form.images.filter(( img ) => img).length > 4 )
            return enqueueSnackbar('Hay muchas imágenes', { variant: 'warning' });

        let key = enqueueSnackbar('¿Quieres publicar esta historia?', {
            variant: 'info',
            autoHideDuration: 12000,
            action: ConfirmNotificationButtons,
        });

        let accepted = await PromiseConfirmHelper(key, 12000);

        if ( !accepted ) return;

        setIsLoading( true );
        const res = await dbPets.createNewPet({ ...form, images: form.images.filter(( img ) => img), type: 'cambios' });
        setIsLoading( false );

        enqueueSnackbar(res.message, { variant: !res.error ? 'success' : 'error' });
    }

    const handleAddOrRemoveImage = ( n: 1 | -1, imgIndex: number ) => {
        if ( n === 1 ) {

            if ( form.images.filter(img => img).length >= 4 ) return enqueueSnackbar('Ya hay muchas imágenes', { variant: 'info' });
            if ( addImage.length <= 3 ) return enqueueSnackbar('La imagen no es válida', { variant: 'warning' });
            setAddImage('');
            let ndx = form.images.indexOf('') ?? -1;
            setForm({ ...form, images: form.images.map(( img, index ) => index !== ndx ? img : addImage.startsWith('/') ? addImage : `/${ addImage }` ) });

        } else {

            setForm({ ...form, images: form.images.map(( img, index ) => index === imgIndex ? '' : img) });

        }
    }

    return (
        <form className={ styles.pet__form } onSubmit={ handleSubmit }>

            <TextField
                name='nombre'
                value={ form.name }
                label='Nombre de tu mascota'
                type='text'
                color='secondary'
                variant='filled'
                fullWidth
                onChange={ ({ target }) => setForm({ ...form, name: target.value  }) }
            />

            <Box display='flex' gap='.5rem'>
                <TextField
                    name='imagenes'
                    value={ addImage }
                    label='Muestra el cambio de tu mascota'
                    type='text'
                    color='secondary'
                    variant='filled'
                    fullWidth
                    id="img-input"
                    onChange={ ({ target }) => setAddImage( target.value ) }
                />
                <Button color='secondary' onClick={ () => handleAddOrRemoveImage( 1, 0 ) }>Agregar</Button>
            </Box>

            <Box display='flex' flexWrap='wrap' gap='1rem' sx={{ justifyContent: { xs: 'center', md: 'space-between' } }}>
                {
                    form.images.map(( img, index ) =>
                        <Box key={ index } display='flex' flexDirection='column' sx={{ border: 'thin solid var(--secondary-color-1)', borderRadius: '.4rem', overflow: 'hidden' }}>
                            <Box
                                className={ styles.pet__box }
                                sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 180, height: 180, fontSize: '4rem', color: 'var(--secondary-color-1)', cursor: 'pointer' }}
                                onClick={ () => document.getElementById( 'img-input' )?.focus() }
                            >
                                { form.images[index] && <MyImage className='fadeIn' src={ img } alt={ img } width={ 200 } height={ 200 } /> }
                            </Box>
                            <Button color='secondary' sx={{ borderRadius: 0, height: 30 }} onClick={ () => handleAddOrRemoveImage( -1, index ) }>Remover</Button>
                        </Box>
                    )
                }
            </Box>

            <TextField
                name='description'
                value={ form.description }
                label='¿Cuál es tu historia?'
                type='text'
                color='secondary'
                variant='filled'
                fullWidth
                minRows={ 3 }
                maxRows={ 10 }
                multiline
                onChange={ ({ target }) => setForm({ ...form, description: target.value  }) }
            />

            <Input type='submit' color='secondary' value='Guardar Mascota' />
        </form>
    )
}
