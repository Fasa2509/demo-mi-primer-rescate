import { FC, useContext, useRef, useState } from 'react';
import { Box, Button, TextField, Typography } from '@mui/material';
import { useSnackbar } from 'notistack';

import { dbPets } from '../../database';
import { ScrollContext } from '../../context';
import { MyImage } from '../../components';
import { ConfirmNotificationButtons, PromiseConfirmHelper, getParagraphs, getImageNameFromUrl } from '../../utils';
import { IPet } from '../../interfaces';
import { SliderImages } from '../layouts/SliderImages';

interface Props {
    pet: IPet;
    updatePetInfo: ( pet: IPet ) => void;
}

export const UserPetInfo: FC<Props> = ({ pet, updatePetInfo }) => {
    
    const { setIsLoading } = useContext( ScrollContext );
    const { enqueueSnackbar } = useSnackbar();
    const [isEditing, setIsEditing] = useState( false );
    const [disableInput, setDisableInput] = useState( false );

    const descriptionRef = useRef<HTMLInputElement>( null );

    const handleUpdatePet = async () => {
        let description = descriptionRef.current!.value.trim();

        if ( description.length < 10 ) {
            descriptionRef.current!.focus();    
            return enqueueSnackbar('Cuenta la historia de tu mascota', { variant: 'info' });
        }

        setDisableInput( true );

        let key = enqueueSnackbar(`¿Quieres editar esta mascota?`, {
            variant: 'info',
            autoHideDuration: 10000,
            action: ConfirmNotificationButtons,
        });
      
        const accepted = await PromiseConfirmHelper( key, 10000 );
      
        if ( !accepted ) {
            setDisableInput( false );
            return;
        }

        setIsLoading( true );
        const res = await dbPets.udpatePet(pet._id, description);
        setIsLoading( false );

        setDisableInput( false );

        enqueueSnackbar(res.message, { variant: !res.error ? 'success' : 'error' });
        !res.error && setIsEditing( false );
        !res.error && updatePetInfo({ ...pet, description });
    }

    const handleSwitchAbilitatePet = async ( id: string, isAble: boolean ) => {

        let key = enqueueSnackbar(`¿Quieres ${ isAble ? 'eliminar' : 'publicar' } esta mascota?`, {
          variant: isAble ? 'warning' : 'info',
          autoHideDuration: 10000,
          action: ConfirmNotificationButtons,
        });
    
        const accepted = await PromiseConfirmHelper( key, 10000 );
    
        if ( !accepted ) return;
    
        setIsLoading( true );
        const res = await dbPets.deletePet( id );
        setIsLoading( false );
    
        enqueueSnackbar(res.message, { variant: !res.error ? 'success' : 'error' });
        !res.error && updatePetInfo({ ...pet, isAble: !pet.isAble });
    }

    const startEditing = () => {
        setIsEditing( true );
        descriptionRef.current!.value = pet.description;
        setTimeout(() => descriptionRef.current!.focus(), 100);
    }

    return (
        <Box key={ pet._id } display='flex' flexDirection='column' gap='.8rem' sx={{ backgroundColor: '#fafafa', padding: '.8rem', boxShadow: '0 0 .8rem -.5rem #666', borderRadius: '1rem' }}>
            <Box display='flex' justifyContent='space-between'>
                <Typography sx={{ fontSize: '1.2rem', fontWeight: 'bold' }}>{ pet.name }</Typography>

                <Box className='fadeIn' display={ isEditing ? 'none' : 'flex' } gap='.5rem'>
                    <Button className='button button--purple low--padding' onClick={ startEditing }>Editar</Button>
                    <Button className={ `button ${ pet.isAble ? 'button--error' : 'button--success' } low--padding` } onClick={ () => handleSwitchAbilitatePet( pet._id, pet.isAble ) }>{ pet.isAble ? 'Eliminar' : 'Publicar' }</Button>
                </Box>
            </Box>

            <>
            { !pet.isAble && !isEditing && <Typography textAlign='end' className='fadeIn'>{'('}esta mascota no es pública{')'}</Typography> }
            </>

            <Box display='flex' justifyContent='center' sx={{ gap: { xs: '0', md: '1rem' } }}>
                <Box sx={{
                    width: '100%',
                    display: ( pet.images.length === 1 ) ? 'flex' : 'block',
                    justifyContent: 'center',
                }}>
                    {
                        ( pet.images.length > 1 )
                            ? (
                                <SliderImages images={ pet.images.map(( img ) => ({ url: img, alt: getImageNameFromUrl( img ), width: 350, height: 350 })) } options={{ indicators: false, cycleNavigation: false, animation: 'slide', interval: 12000 }} objectFit='cover' />
                            )
                            : (
                            <Box sx={{ position: 'relative', flexBasis: '350px' }}>
                                <MyImage className='img' src={ pet.images[0] } alt={ pet.name } width={ 350 } height={ 350 } objectFit='cover' />
                            </Box>
                            )
                    }
                </Box>
            </Box>

            <Box>
                <Box className='fadeIn' display={ !isEditing ? 'block' : 'none' }>
                    { getParagraphs( pet.description ).map(( paragraph, index ) => <Typography key={ index }>{ paragraph }</Typography>) }
                </Box>
                <Box className='fadeIn' display={ isEditing ? 'flex' : 'none' } flexDirection='column' gap='1rem' alignItems='center'>
                    <TextField
                        inputRef={ descriptionRef }
                        name='pet-description'
                        label='Historia de tu mascota'
                        type='text'
                        color='secondary'
                        variant='filled'
                        fullWidth
                        multiline
                        disabled={ disableInput }
                    />
                    <Button className='button button--purple low--padding' onClick={ handleUpdatePet }>Actualizar historia</Button>
                </Box>
            </Box>
        </Box>
    )
}