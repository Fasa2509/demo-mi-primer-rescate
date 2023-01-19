import { FC, useContext } from 'react';
import { Box, Button } from '@mui/material';
import { useSnackbar } from 'notistack';

import { SliderImages } from '../layouts';
import { dbPets } from '../../database';
import { ScrollContext } from '../../context';
import { ConfirmNotificationButtons, getParagraphs, PromiseConfirmHelper } from '../../utils';
import { IPet } from '../../interfaces';
import styles from './ChangeCard.module.css';

interface Props {
    pet: IPet;
    observe?: boolean;
    removable?: boolean;
}

export const ChangeCard: FC<Props> = ({ pet, observe = false, removable = false }) => {

  const { setIsLoading } = useContext( ScrollContext );
  const { enqueueSnackbar } = useSnackbar();

  const handleDeletePet = async () => {
    let key = enqueueSnackbar(`¿Quieres eliminar a ${ pet.name }`, {
      variant: 'info',
      autoHideDuration: 12000,
      action: ConfirmNotificationButtons,
    });

    const accepted = await PromiseConfirmHelper(key, 12000);

    if ( !accepted ) return;

    setIsLoading( true );
    const res = await dbPets.deletePet( pet._id );
    setIsLoading( false );

    enqueueSnackbar(res.message, { variant: !res.error ? 'success' : 'error' });
  }

  return (
    <article className={ `${ styles.card__container }${ observe ? ` observe ${ styles.card__appear }` : '' }` }>
      <Box sx={{ borderRadius: '.5rem', overflow: 'hidden', alignSelf: 'flex-start' }}>
        <SliderImages images={ pet.images.map(( img ) => ({ url: img, alt: pet.name, width: 500, height: 500 })) } options={{ indicators: false, cycleNavigation: false, animation: 'slide', interval: 12000, autoPlay: false }} objectFit='cover' />
      </Box>
      <Box>
        <Box display='flex' justifyContent='space-between' alignItems='center' sx={{ mb: { xs: 1, md: 0 } }}>
          <p className={ styles.pet__name }>{ pet.name }</p>
          { removable && <Button className='fadeIn button button--error button--round low--padding low--font--size' onClick={ handleDeletePet }>Eliminar</Button> }
        </Box>
        {
          getParagraphs( pet.description ).map(( paragraph, index ) => <p key={ index }>{ paragraph }</p>)
        }
      </Box>
    </article>
  )
}
