import { FC } from 'react';
import { Button } from '@mui/material';
import { useSnackbar } from 'notistack';

import { dbPets } from '../../database';
import { ModalWindow } from '../ui';
import { MyImage } from './MyImage';
import { IPet } from '../../interfaces';
import { ConfirmNotificationButtons, getParagraphs, PromiseConfirmHelper } from '../../utils';
import styles from './Card.module.css';

export interface Props {
    pet: IPet;
    removable: boolean;
    setIsLoading?: (a: boolean) => void;
}

export const PetCard: FC<Props> = ({ pet, removable, setIsLoading }) => {

    const { enqueueSnackbar } = useSnackbar();

    const handleDeletePet = async () => {
        let key = enqueueSnackbar('¿Segur@ que quieres eliminar esta mascota?', {
            variant: 'warning',
            autoHideDuration: 12000,
            action: ConfirmNotificationButtons,    
        });

        let accepted = await PromiseConfirmHelper(key, 12000);

        if ( !accepted ) return;

        setIsLoading && setIsLoading( true );
        const res = await dbPets.deletePet( pet._id );
        setIsLoading && setTimeout(() => setIsLoading( false ), 20000);

        enqueueSnackbar(res.message, { variant: !res.error ? 'info' : 'error' });
    }

  return (
        <div className={ `${ styles.pet__container } fadeIn` }>
            <MyImage src={ pet.images[0] } alt={ pet.name } width={ 500 } height={ 500 } />

            <ModalWindow title={ pet.name } buttonTxt={ pet.name } buttonStyle={{ position: 'absolute', right: '.5rem', bottom: '.7rem', borderRadius: '10rem' }}>
                {
                    getParagraphs( pet.description ).map(( paragraph, index ) => <p key={ index }>{ paragraph }</p>)
                }
            </ModalWindow>

            { removable && <Button className='fadeIn' color='error' sx={{ position: 'absolute', top: '.7rem', right: '.5rem', borderRadius: '3rem' }} onClick={ handleDeletePet }>Eliminar</Button> }
        </div>
  )
}