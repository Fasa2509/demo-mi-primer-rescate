import { FC, useContext, useState } from "react";
import { Button, TextField } from "@mui/material";
import { useSnackbar } from "notistack";

import { dbPets } from "../../database";
import { PetType } from "../../interfaces";
import { AuthContext, ScrollContext } from "../../context";
import styles from './Form.module.css';

interface Props {
    pet: PetType;
}

export const PetForm: FC<Props> = ({ pet }) => {

    const { user } = useContext( AuthContext );
    const { setIsLoading } = useContext( ScrollContext );
    const { enqueueSnackbar } = useSnackbar();

    const [form, setForm] = useState({
        name: '',
        images: '',
        description: '',
    });

    const handleSubmit = async () => {
        if ( !user ) return enqueueSnackbar('Inicia sesión primero', { variant: 'warning' });

        setIsLoading( true );
        const res = await dbPets.createNewPet({ ...form, images: [form.images.startsWith('/') ? form.images : `/${ form.images }`], type: pet });
        setIsLoading( false );

        enqueueSnackbar(res.message, { variant: !res.error ? 'success' : 'error' });
    }

  return (
    <form className={ styles.form }>
        <p className={ styles.title }>Agregar una nueva mascota</p>

        <TextField
            name='name'
            value={ form.name }
            label='¿Cuál es su nombre?'
            type='text'
            color='secondary'
            variant='filled'
            fullWidth
            onChange={ ({ target }) => setForm({ ...form, name: target.value }) }
            required
        />

        <TextField
            name='images'
            value={ form.images }
            label='Imagen de la mascota'
            type='text'
            color='secondary'
            variant='filled'
            fullWidth
            onChange={ ({ target }) => setForm({ ...form, images: target.value }) }
            required
        />

        <TextField
            name='description'
            value={ form.description }
            label='¿Cuál es su historia?'
            type='text'
            color='secondary'
            variant='filled'
            fullWidth
            multiline
            onChange={ ({ target }) => setForm({ ...form, description: target.value }) }
            required
        />

        <Button color='secondary' sx={{ fontSize: '.9rem', padding: '.3rem 1rem' }} onClick={ handleSubmit }>Agregar</Button>
    </form>
  )
}
