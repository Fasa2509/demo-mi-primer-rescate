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
}

export const PetCard: FC<Props> = ({ pet, removable }) => {

    const { enqueueSnackbar } = useSnackbar();

    const handleDeletePet = async () => {
        let key = enqueueSnackbar('¿Segur@ que quieres eliminar esta mascota?', {
            variant: 'warning',
            autoHideDuration: 12000,
            action: ConfirmNotificationButtons,
        });

        let accepted = await PromiseConfirmHelper(key, 12000);

        if (!accepted) return;

        const res = await dbPets.deletePet(pet._id);

        enqueueSnackbar(res.message, { variant: !res.error ? 'info' : 'error' });
    }

    return (
        <article className={`${styles.pet__container} fadeIn`}>
            <MyImage src={pet.images[0]} alt={pet.name} width={500} height={500} objectFit='cover' />

            <ModalWindow title={pet.name} buttonTxt={pet.name} buttonClassName='font--size' buttonStyle={{ position: 'absolute', right: '.5rem', bottom: '.7rem', borderRadius: '.3rem', padding: '.4rem .6rem' }}>
                {
                    getParagraphs(pet.description).map((paragraph, index) => <p key={index}>{paragraph}</p>)
                }
            </ModalWindow>

            {removable && <Button className='fadeIn button button--error low--padding low--font--size' sx={{ position: 'absolute', top: '.7rem', right: '.5rem', borderRadius: '3rem' }} onClick={handleDeletePet}>Eliminar</Button>}
        </article>
    )
}