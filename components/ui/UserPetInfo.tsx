import { FC, useContext, useRef, useState } from 'react';
import { Box, Button, TextField, Typography } from '@mui/material';
import { useSnackbar } from 'notistack';

import { dbPets } from '../../database';
import { ScrollContext } from '../../context';
import { MyImage } from '../../components';
import { ConfirmNotificationButtons, PromiseConfirmHelper, getParagraphs } from '../../utils';
import { IPet } from '../../interfaces';

interface Props {
    pet: IPet;
}

export const UserPetInfo: FC<Props> = ({ pet }) => {
    
    const { setIsLoading } = useContext( ScrollContext );
    const { enqueueSnackbar } = useSnackbar();
    const [isEditing, setIsEditing] = useState( false );

    const description = useRef<HTMLInputElement>( null );

    const handleUpdatePet = async () => {
        if ( description.current!.value.trim().length < 10 ) {
            description.current!.focus();    
            return enqueueSnackbar('Cuenta la historia de tu mascota', { variant: 'info' });
        }

        let key = enqueueSnackbar(`¿Quieres editar esta mascota?`, {
            variant: 'info',
            autoHideDuration: 10000,
            action: ConfirmNotificationButtons,
          });
      
        const accepted = await PromiseConfirmHelper( key, 10000 );
      
        if ( !accepted ) return;

        setIsLoading( true );
        const res = await dbPets.udpatePet(pet._id, description.current!.value);
        setIsLoading( false );

        enqueueSnackbar(res.message, { variant: !res.error ? 'success' : 'error' });
    }

    const handleSwitchAbilitatePet = async ( id: string, isAble: boolean ) => {

        let key = enqueueSnackbar(`¿Quieres ${ isAble ? 'eliminar' : 'publicar' } esta mascota?`, {
          variant: isAble ? 'warning' : 'info',
          autoHideDuration: 10000,
          action: ConfirmNotificationButtons,
        });
    
        const accepted = await PromiseConfirmHelper( key, 10000 );
    
        if ( !accepted ) return;
    
        const res = await dbPets.deletePet( id );
    
        enqueueSnackbar(res.message, { variant: !res.error ? 'success' : 'error' });
    
    }

    const startEditing = () => {
        setIsEditing( true );
        description.current!.value = pet.description;
    }

    return (
        <Box key={ pet._id } display='flex' flexDirection='column' gap='.8rem' sx={{ backgroundColor: '#fafafa', padding: '.8rem', boxShadow: '0 0 1.2rem -.8rem #555', borderRadius: '1rem' }}>
            <Box display='flex' justifyContent='space-between'>
                <Typography sx={{ fontSize: '1.2rem', fontWeight: 'bold' }}>{ pet.name }</Typography>

                <Box className='fadeIn' display={ isEditing ? 'none' : 'flex' } gap='.5rem'>
                    <Button color='primary' onClick={ startEditing }>Editar</Button>
                    <Button color={ pet.isAble ? 'error' : 'success' } onClick={ () => handleSwitchAbilitatePet( pet._id, pet.isAble ) }>{ pet.isAble ? 'Eliminar' : 'Publicar' }</Button>
                </Box>
            </Box>

            <>
            { !pet.isAble && <Typography className='fadeIn'>{'('}esta mascota no es pública{')'}</Typography> }
            </>
                  
            <Box display='flex' justifyContent='center' sx={{ gap: { xs: '0', md: '1rem' } }}>
            {
              pet.images.map(( img, index ) => 
                <Box key={ index } sx={{ position: 'relative', flexBasis: '250px' }}>
                  <MyImage className='img' src={ img } alt={ pet.name } width={ 350 } height={ 350 } />
                </Box>
            )}
            </Box>

            <Box>
                <Box className='fadeIn' display={ !isEditing ? 'block' : 'none' }>
                    { getParagraphs( pet.description ).map(( paragraph, index ) => <Typography key={ index }>{ paragraph }</Typography>) }
                </Box>
                <Box className='fadeIn' display={ isEditing ? 'flex' : 'none' } flexDirection='column' gap='1rem' alignItems='center'>
                    <TextField
                        inputRef={ description }
                        name='pet-description'
                        label='Historia de tu mascota'
                        type='text'
                        color='secondary'
                        variant='filled'
                        fullWidth
                        multiline
                    />
                    <Button color='secondary' onClick={ handleUpdatePet }>Actualizar historia</Button>
                </Box>
            </Box>
        </Box>
    )
}