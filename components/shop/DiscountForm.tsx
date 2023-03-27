import { useContext, useState } from 'react';
import { Box, Button, Checkbox, FormControl, InputLabel, MenuItem, Select, TextField, Typography } from "@mui/material";
import { useSnackbar } from 'notistack';

import { dbProducts } from '../../database';
import { ScrollContext } from '../../context';
import { mprRevalidatePage } from '../../mprApi';
import { ConfirmNotificationButtons, PromiseConfirmHelper } from '../../utils';

export const DiscountForm = () => {
    const [dolarPrice, setDolarPrice] = useState( '' );
    
    const [formTags, setFormTags] = useState({
      tags: 'todos',
      discount: '',
    });
  
    const [formSlug, setFormSlug] = useState({
      slug: '',
      discount: '',
    });

    const [revalidatePage, setRevalidatePage] = useState( false );
    const { setIsLoading } = useContext( ScrollContext );
    const { enqueueSnackbar } = useSnackbar();

    const handleDiscount = async ( form: 'tags' | 'slug' ) => {
        if ( form === 'tags' && (isNaN( Number( formTags.discount )) || formTags.discount === '') ) return enqueueSnackbar('El valor de descuento no es válido', { variant: 'warning' });
        
        if ( form === 'slug' && !formSlug.slug ) return enqueueSnackbar('Agrega un url', { variant: 'warning' });
        if ( form === 'slug' && (isNaN( Number( formSlug.discount ) ) || formSlug.discount === '') ) return enqueueSnackbar('El valor de descuento no es válido', { variant: 'warning' });

        let key = enqueueSnackbar('¿Quieres aplicar el descuento?', {
            variant: 'info',
            action: ConfirmNotificationButtons,
            autoHideDuration: 15000,
        });

        const accepted = await PromiseConfirmHelper(key, 15000);

        if ( !accepted ) return;

        setIsLoading( true );

        if ( form === 'tags' ) {
            const res = await dbProducts.discountProducts( Number( formTags.discount ), formTags.tags );
            enqueueSnackbar(res.message, { variant: !res.error ? 'success' : 'error' });
        }
        
        if ( form === 'slug' ) {
            const res = await dbProducts.discountProducts( Number( formSlug.discount ), formSlug.slug );
            enqueueSnackbar(res.message, { variant: !res.error ? 'success' : 'error' });
        }

        if ( process.env.NODE_ENV === 'production' && revalidatePage ) {
            const revalidationResponses = await Promise.all([
                mprRevalidatePage('/tienda'),
                mprRevalidatePage('/tienda/categoria'),
            ]);

            revalidationResponses.forEach(res => enqueueSnackbar(res.message || 'Error revalidando', { variant: !res.error ? 'info' : 'error' }));
        }

        setIsLoading( false );
        return;
    }

    const handleUpdateDolar = async () => {
        if ( isNaN( Number( dolarPrice ) ) || Number( dolarPrice ) === 0 ) return enqueueSnackbar('El valor no es válido', { variant: 'warning' });

        let key = enqueueSnackbar('¿Quieres actualizar el valor del dólar?', {
            variant: 'info',
            action: ConfirmNotificationButtons,
            autoHideDuration: 15000,
        });

        const accepted = await PromiseConfirmHelper(key, 15000);

        if ( !accepted ) return;

        setIsLoading( true );
        const res = await dbProducts.updateDolarPrice( Number( dolarPrice ) );
        setIsLoading( false );

        enqueueSnackbar(res.message, { variant: !res.error ? 'success' : 'error' });
    }

    const revalidate = async () => {
        if ( process.env.NODE_ENV !== 'production' ) return;

        setIsLoading( true );
        const resRev = await mprRevalidatePage('/tienda');
        setIsLoading( false );

        enqueueSnackbar(resRev.message, { variant: !resRev.error ? 'success' : 'error' });
    }
    
    return(
        <div>
            <Box display='flex' flexDirection='column' gap='1rem' sx={{ padding: '1.5rem', backgroundColor: '#fff', borderRadius: '1.2rem', boxShadow: '0 0 1rem -.6rem #444' }}>
                
                <Box>
                <Typography sx={{ fontSize: '1.3rem', fontWeight: 'bold' }}>Cambiar cotización del dólar</Typography>
                <Box display='flex' gap='.5rem'>
                    <TextField
                    name='dolar'
                    value={ dolarPrice }
                    label='Valor del dólar'
                    type='number'
                    color='secondary'
                    variant='filled'
                    onChange={ ( e ) => {
                        if ( isNaN(Number( e.target.value )) ) return;
                        setDolarPrice( e.target.value );
                    }}
                    />
                    <Button className='button' onClick={ handleUpdateDolar }>Aplicar</Button>
                </Box>
                </Box>

                <Typography sx={{ fontSize: '1.3rem', fontWeight: 'bold' }}>Aplicar descuento a varios productos</Typography>

                <Box display='flex' gap='.5rem' sx={{ flexDirection: { xs: 'column', sm: 'row' } }}>
                    <FormControl fullWidth>
                        <InputLabel id="form-tags" color='secondary'>Etiquetas</InputLabel>
                        <Select
                            labelId="form-tags"
                            value={ formTags.tags }
                            label="Etiquetas"
                            color='secondary'
                            onChange={ ( e: any ) => setFormTags({ ...formTags, tags: e.target.value }) }
                        >
                            <MenuItem value={ 'todos' }>todos</MenuItem>
                            <MenuItem value={ 'accesorios' }>accesorios</MenuItem>
                            <MenuItem value={ 'consumibles' }>consumibles</MenuItem>
                            <MenuItem value={ 'ropa' }>ropa</MenuItem>
                            <MenuItem value={ 'útil' }>útil</MenuItem>
                        </Select>
                    </FormControl>

                    <TextField
                        name='discount'
                        value={ formTags.discount }
                        label='Descuento a aplicar (%)'
                        type='number'
                        color='secondary'
                        variant='filled'
                        fullWidth
                        onChange={ ( e ) => {
                            if ( isNaN(Number( e.target.value )) ) return;
                            if ( Number( e.target.value ) > 50 || Number( e.target.value ) < 0 ) return;
                            setFormTags({ ...formTags, discount: e.target.value });
                        }}
                    />

                    <Button className='button' sx={{ minWidth: '88px' }} onClick={ () => handleDiscount('tags') }>Aplicar</Button>
                </Box>

                <Typography sx={{ fontSize: '1.3rem', fontWeight: 'bold' }}>Aplicar descuento a un producto (por url)</Typography>

                <Box display='flex' gap='.5rem' sx={{ flexDirection: { xs: 'column', sm: 'row' } }}>
                    <TextField
                        name='url'
                        value={ formSlug.slug }
                        label='Url del producto'
                        type='string'
                        color='secondary'
                        variant='filled'
                        sx={{ flexGrow: 1 }}
                        onChange={ ( e ) => setFormSlug({ ...formSlug, slug: e.target.value.trim() }) }
                    />

                    <TextField
                        name='discount'
                        value={ formSlug.discount }
                        label='Descuento a aplicar (%)'
                        type='number'
                        color='secondary'
                        variant='filled'
                        sx={{ flexGrow: 1 }}
                        onChange={ ( e ) => {
                            if ( isNaN(Number( e.target.value )) ) return;
                            if ( Number( e.target.value ) > 50 || Number( e.target.value ) < 0 ) return;
                            setFormSlug({ ...formSlug, discount: e.target.value });
                        }}
                    />

                    <Button className='button' onClick={ () => handleDiscount('slug') }>Aplicar</Button>
                </Box>
                
                <Box display='flex' alignItems='center'>
                    <Checkbox
                        color='secondary'
                        checked={ revalidatePage }
                        onChange={ ({ target }) => setRevalidatePage( target.checked ) }
                        />
                    <Typography sx={{ cursor: 'pointer' }} onClick={ () => setRevalidatePage( !revalidatePage ) }>Revalidar página</Typography>
                </Box>
            </Box>
            <Button className='fadeIn' variant='contained' color='secondary' sx={{ mt: 2 }} onClick={ revalidate }>Revalidar esta página</Button>
        </div>
    )
}