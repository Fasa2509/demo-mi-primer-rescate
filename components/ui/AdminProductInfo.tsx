import { Dispatch, FC, SetStateAction, useContext, useEffect, useState } from 'react'
import { Box, Button, Checkbox, Chip, Link, MenuItem, TextField, Typography } from '@mui/material';
import { IProduct, Tags, TagsArray } from '../../interfaces'
import { ConfirmNotificationButtons, format, PromiseConfirmHelper } from '../../utils';
import { useSnackbar } from 'notistack';
import { dbProducts } from '../../database';
import { ScrollContext } from '../../context';
import { SliderImages } from '../slider';
import { mprRevalidatePage } from '../../mprApi';

interface Props {
    product: IProduct;
    products: IProduct[];
    method: 'create' | 'update';
    setMethod: Dispatch<SetStateAction<'create' | 'update'>>;
}

const newProductInitialState: IProduct = {
    _id: '',
    name: '',
    description: '',
    images: [],
    inStock: {
      unique: 0,
      S: 0,
      M: 0,
      L: 0,
      XL: 0,
      XXL: 0,
      XXXL: 0,
    },
    price: 0,
    discount: 0,
    tags: [],
    sold: 0,
    slug: '',
    isAble: true,
}

export const AdminProductInfo: FC<Props> = ({ product: thisProduct, products, method, setMethod }) => {

    const { enqueueSnackbar } = useSnackbar();
    const { isLoading, setIsLoading } = useContext( ScrollContext );
    const [form, setForm] = useState( newProductInitialState );
    const [image, setImage] = useState({ url: '', alt: '', width: 450, height: 450, });
    const [unica, setUnica] = useState( true );
    const [tag, setTag] = useState('');
    const [revalidatePage, setRevalidatePage] = useState( false );
    const { price, discount, inStock, sold } = thisProduct;

    useEffect(() => {
        setForm({
            _id: thisProduct._id,
            name: thisProduct.name,
            description: thisProduct.description,
            images: thisProduct.images,
            price: thisProduct.price,
            discount: thisProduct.discount * 100,
            inStock: {
                unique: 0,
                S: 0,
                M: 0,
                L: 0,
                XL: 0,
                XXL: 0,
                XXXL: 0,
            },
            tags: thisProduct.tags,
            slug: thisProduct.slug,
            sold: thisProduct.sold,
            isAble: true,
        })
        setUnica( thisProduct.inStock.unique > -1 );
        
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [thisProduct]);

    const handleSubmitProduct = async () => {
        if ( !form.name || !form.description || form.images.length < 2 || form.images.length > 4 || form.price === 0 )
            return enqueueSnackbar('La información del producto está incompleta', { variant: 'warning' });
            
        if ( form.tags.length === 0 )
            return enqueueSnackbar('El producto debe tener etiquetas', { variant: 'warning' });
            
        let key = enqueueSnackbar(`¿Quieres ${ method === 'update' ? 'actualizar' : 'crear' } este producto?`, {
            variant: 'info',
            action: ConfirmNotificationButtons,
            autoHideDuration: 15000,
        });

        const accepted = await PromiseConfirmHelper(key, 15000);

        if ( !accepted ) return;
        
        setIsLoading( true );

        if ( method === 'create' ) {
            const res = await dbProducts.createNewProduct( form, unica );
    
            enqueueSnackbar(res.message, { variant: !res.error ? 'success' : 'error' });

            if ( !res.error ) {
                if ( process.env.NODE_ENV === 'production' && revalidatePage ) {
                    const revalidations = await Promise.all([
                        mprRevalidatePage( '/tienda' ),
                        mprRevalidatePage( '/tienda/categoria' )
                    ]);
                    
                    revalidations.forEach(res => enqueueSnackbar(res.message || 'Error', { variant: !res.error ? 'info' : 'error' }));
                }
            }
        } else {
            const res = await dbProducts.updateProductById( form._id, form, unica );

            enqueueSnackbar(res.message, { variant: !res.error ? 'success' : 'error' });

            if ( !res.error ) {
                if ( process.env.NODE_ENV === 'production' && revalidatePage ) {
                    const revalidationResponses = await Promise.all([
                        mprRevalidatePage( '/tienda' ),
                        // mprRevalidatePage( '/tienda/carrito' ),
                        mprRevalidatePage( '/tienda/categoria' ),
                        mprRevalidatePage( '/tienda' + form.slug.startsWith('/') ? form.slug : `/${ form.slug }` ),
                    ]);

                    revalidationResponses.forEach(res => enqueueSnackbar(res.message || 'Error', { variant: !res.error ? 'info' : 'error' }))
                }
            }
        }

        setIsLoading( false );

        return;
    }

    const handleClearProduct = async () => {
        let key = enqueueSnackbar('¿Quieres vaciar la info del producto?', {
            variant: 'info',
            autoHideDuration: 15000,
            action: ConfirmNotificationButtons,
        })

        const confirm = await PromiseConfirmHelper( key, 15000 );

        if ( !confirm ) return;

        setMethod( 'create' );
        setForm( newProductInitialState );
    }

    const handleAddTag = () => {
        if ( form.tags.includes( tag.toLocaleLowerCase().trim() as Tags ) ) return setTag('');

        if ( tag.toLocaleLowerCase().trim() === 'util' ) {
            setTag('');
            if ( form.tags.includes( 'útil' ) ) return setTag('');
            setForm({...form, tags: [...form.tags, 'útil' ]});
            return;
        }

        if ( !TagsArray.includes( tag.toLocaleLowerCase().trim() as Tags ) ) return enqueueSnackbar('Esa etiqueta no es válida', { variant: 'warning' });
        setForm({...form, tags: [...form.tags, tag.toLocaleLowerCase().trim() as Tags]});
        setTag('');
        return;
    }

    const removeTag = ( tag: string ) => {
        setForm({ ...form, tags: form.tags.filter(t => t !== tag )});
    }

    const handleAddOrRemoveImage = ( action: 'add' | 'remove' ) => {
        
        if ( action === 'add' ) {
            if ( !image.url || !image.alt ) return enqueueSnackbar('Falta información de la imagen', { variant: 'warning' });
            if ( image.width < 50 || image.height < 50 ) return enqueueSnackbar('Las dimensiones de la imagen no son válidas', { variant: 'warning' });
            
            if ( form.images.length >= 4 ) return enqueueSnackbar('Ya hay muchas imágenes', { variant: 'warning' });
            
            setForm({...form, images: [...form.images, { ...image, url: image.url.startsWith('/') ? image.url : `/${ image.url }` }]});
            setImage({ ...image, url: '', alt: '', });
        }

        if ( action === 'remove' ) {
            if ( form.images.length === 0 ) return;
            const actualImages = JSON.parse( JSON.stringify( form.images ) );
            actualImages.pop();
            setForm({...form, images: actualImages });
        }
    }

  return (
    <Box display='flex' flexDirection='column' gap='.8rem' className='fadeIn' sx={{ padding: '1.2rem', backgroundColor: '#fff', my: 3, borderRadius: '1rem', boxShadow: '0 0 1.1rem -.8rem #555' }}>

        <Typography sx={{ fontSize: '1.5rem', fontWeight: '600', color: '#333' }}>{ method === 'create' ? 'Crear Producto' : 'Actualizar Producto' }</Typography>

            <Box display='flex' flexDirection='column'>
                <Typography sx={{ fontSize: '1.4rem', fontWeight: '600', color: '#444' }}>Nombre del Producto:</Typography>

                <TextField
                    name='name'
                    value={ form.name }
                    label='Nombre del producto'
                    type='text'
                    color='secondary'
                    variant='filled'
                    fullWidth
                    onChange={ ( e ) => setForm({ ...form, name: e.target.value, slug: method === 'create' ? e.target.value.toLowerCase().replace(/[&\/\\#,+()$~%.'":*?<>{}]/g,'_').replace(/ /g,'_').replace(/á/g,'a').replace(/é/g,'e').replace(/í/g,'i').replace(/ó/g,'o').replace(/ú/g,'u') : thisProduct.slug }) }
                />
                
                { form.slug.length > 1 &&
                    <Link className='fadeIn' href={ '/tienda' + form.slug } target='_blank' rel='noreferrer' underline='hover' color='secondary' alignSelf='flex-start'>Ver página del producto</Link>
                }
            </Box>

            <TextField
                name='url'
                value={ form.slug }
                label='Url del producto'
                type='text'
                color='secondary'
                variant='filled'
                fullWidth
                disabled
            />

            <Box display='flex' flexDirection='column'>
                <Typography sx={{ fontSize: '1.4rem', fontWeight: '600', color: '#444' }}>Descripción del Producto:</Typography>

                <TextField
                    name='description'
                    value={ form.description }
                    label='Descripción del producto'
                    type='text'
                    color='secondary'
                    variant='filled'
                    fullWidth
                    multiline
                    onChange={ ( e ) => setForm({ ...form, description: e.target.value }) }
                />
                
            </Box>

            <Box>
                <Typography sx={{ fontSize: '1.4rem', fontWeight: '600', color: '#444' }}>Imágenes del Producto:</Typography>
                <Box display='flex' flexWrap='wrap' gap='1rem'>
                    <Typography>/Logo-MPR.png</Typography>
                    <Typography>/Logo-Redes.png</Typography>
                    <Typography>/square-dog.jpg</Typography>
                    <Typography>/perro-1.webp</Typography>
                    <Typography>/perro-2.webp</Typography>
                    <Typography>/gato-1.webp</Typography>
                    <Typography>/gato-2.jpg</Typography>
                </Box>
                <Typography>¡Copia la dirrección y agrégala!</Typography>
            </Box>

            { form.images.length > 0 &&
                <SliderImages images={ form.images } options={{ indicators: false, animation: 'slide', navButtonsAlwaysVisible: true, interval: 6500, autoPlay: false }} />
            }

            <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: '.5rem' }}>
                <TextField
                    name='url'
                    value={ image.url }
                    label='Url de la imagen'
                    type='string'
                    color='secondary'
                    variant='filled'
                    sx={{ flexGrow: 1 }}
                    onChange={ ({ target }) => {
                        setImage({ ...image, url: target.value.trim() })
                    }}
                />
                
                <TextField
                    name='alt'
                    value={ image.alt }
                    label='Descripción de la imagen'
                    type='string'
                    color='secondary'
                    variant='filled'
                    sx={{ flexGrow: 1 }}
                    onChange={ ({ target }) => {
                        setImage({ ...image, alt: target.value });
                    }}
                />

                <Button color='secondary' variant='outlined' onClick={ () => handleAddOrRemoveImage('add') }>Agregar Imagen</Button>
                <Button color='secondary' variant='outlined' onClick={ () => handleAddOrRemoveImage('remove') }>Remover Última</Button>
            </Box>

            <Box display='flex' flexDirection='column' gap='.5rem'>
                <Typography sx={{ fontSize: '1.4rem', fontWeight: '600', color: '#444' }}>Precio {'('}${')'}:</Typography>
                <Box>
                    <TextField
                        name='price'
                        value={ form.price }
                        label='Precio del producto'
                        type='number'
                        color='secondary'
                        variant='outlined'
                        onChange={ ({ target }) => {
                            if ( isNaN( Number(target.value) ) || Number( target.value ) <= 0 ) return;
                            setForm({ ...form, price: Number( target.value ) });
                        }}
                    />
                </Box>

                <Typography>Descuento: { discount * 100 }%{ discount > 0 && discount <= 50 && `. ${ format( price ) } - ${ discount * 100 }% = ${ format( price - price * discount ) }` }</Typography>

                <Box display='flex' alignItems='center'>
                    <TextField
                        name='discount'
                        value={ form.discount }
                        label='Descuento del producto'
                        type='number'
                        color='secondary'
                        variant='outlined'
                        onChange={ ({ target }) => {
                            if ( isNaN( Number(target.value) ) || Number(target.value) < 0 || Number(target.value) > 50 ) return;
                            setForm({ ...form, discount: Number( target.value ) });
                        }}
                    />
                    <p>%</p>
                </Box>

                <Typography>Vendidos: { sold }</Typography>
            </Box>

            <Box display='flex' flexDirection='column'>
                <Typography sx={{ fontSize: '1.4rem', fontWeight: '600', color: '#444' }}>Existencias:</Typography>
                <Box display='flex' flexDirection='column' sx={{ fontSize: '1.1rem' }}>
                {
                    Object.entries( inStock ).filter(e => e[0] !== '_id' && e[1] !== -1).map(( stock, index: number ) =>{
                        if ( !unica && stock[0] === 'unique' ) return <div key={ 'unique' } style={{ display: 'none' }}></div>
                        if ( unica && inStock.unique !== -1 && stock[0] !== 'unique' ) return <div key={ stock[0] } style={{ display: 'none' }}></div>
                        
                        return <Box key={ index }>
                                    <Typography>{ ( stock[0] === 'unique' ) ? 'Única' : stock[0] }: { stock[1] }</Typography>
                                </Box>
                    })
                }

                <Box className='fadeIn'>

                    {/* <Typography sx={{ fontWeight: '300', mt: 1.5 }}>Para productos con distintas tallas, es <b>obligatorio</b> marcar única como -1.</Typography> */}
                    <Typography sx={{ fontWeight: '300', mt: 1.5 }}>Si deseas cambiar la cantidad de unidades, debes escribir el número de unidades <b>a sumar</b>. Si escribes un número positivo se añadirá esa cantidad de unidades a las ya existentes de la respectiva talla en la base de datos. Si escribes un número negativo, se reducirá esa cantidad de unidades.</Typography>
                    {/* <Typography sx={{ fontWeight: '300', mt: 1.5 }}>Si un producto tiene distintas tallas <b>es necesario marcar única como -1</b> y las demás tallas con su respectivo valor, si un producto no tiene tallas se marca única con el valor respectivo y se dejan los demás en 0.</Typography> */}
                </Box>
                
                <Box display='flex' alignItems='center'>
                    <Checkbox
                        color='secondary'
                        checked={ unica }
                        onChange={ ({ target }) => {
                            unica || setForm({ ...form, inStock: { unique: 0, S: 0, M: 0, L: 0, XL: 0, XXL: 0, XXXL: 0, } });
                            unica && setForm({ ...form, inStock: { unique: -1, S: 0, M: 0, L: 0, XL: 0, XXL: 0, XXXL: 0, } });
                            setUnica( !unica )}}
                    />
                    <Typography sx={{ cursor: 'pointer' }} onClick={ () => {
                        unica || setForm({ ...form, inStock: { unique: 0, S: 0, M: 0, L: 0, XL: 0, XXL: 0, XXXL: 0, } });
                        unica && setForm({ ...form, inStock: { unique: -1, S: 0, M: 0, L: 0, XL: 0, XXL: 0, XXXL: 0, } });
                        setUnica( !unica )}
                    }>Talla única</Typography>
                </Box>

                <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr 1fr', md: '1fr 1fr 1fr' }, gap: '1rem', mt: 1 }}>

                {
                    ( unica )
                            ? (
                                <TextField
                                    name='unique'
                                    value={ Number(form.inStock.unique) }
                                    label='Única'
                                    type='number'
                                    color='secondary'
                                    variant='outlined'
                                    onChange={ ({ target }) => setForm({ ...form, inStock: { ...form.inStock, unique: Number( target.value ) } }) }
                                />
                            )
                        : (
                            <>
                                <TextField
                                    name='S'
                                    value={ Number(form.inStock.S) }
                                    label='S'
                                    type='number'
                                    color='secondary'
                                    variant='outlined'
                                    onChange={ ({ target }) => setForm({ ...form, inStock: { ...form.inStock, S: Number( target.value ) } }) }
                                />

                                <TextField
                                    name='M'
                                    value={ Number(form.inStock.M) }
                                    label='M'
                                    type='number'
                                    color='secondary'
                                    variant='outlined'
                                    onChange={ ({ target }) => setForm({ ...form, inStock: { ...form.inStock, M: Number( target.value ) } }) }
                                />

                                <TextField
                                    name='L'
                                    value={ Number(form.inStock.L) }
                                    label='L'
                                    type='number'
                                    color='secondary'
                                    variant='outlined'
                                    onChange={ ({ target }) => setForm({ ...form, inStock: { ...form.inStock, L: Number( target.value ) } }) }
                                />

                                <TextField
                                    name='XL'
                                    value={ Number(form.inStock.XL) }
                                    label='XL'
                                    type='number'
                                    color='secondary'
                                    variant='outlined'
                                    onChange={ ({ target }) => setForm({ ...form, inStock: { ...form.inStock, XL: Number( target.value ) } }) }
                                />

                                <TextField
                                    name='XXL'
                                    value={ Number(form.inStock.XXL) }
                                    label='XXL'
                                    type='number'
                                    color='secondary'
                                    variant='outlined'
                                    onChange={ ({ target }) => setForm({ ...form, inStock: { ...form.inStock, XXL: Number( target.value ) } }) }
                                />

                                <TextField
                                    name='XXXL'
                                    value={ form.inStock.XXXL }
                                    label='XXXL'
                                    type='number'
                                    color='secondary'
                                    variant='outlined'
                                    onChange={ ({ target }) => setForm({ ...form, inStock: { ...form.inStock, XXXL: Number( target.value ) } }) }
                                />
                            </>
                        )
                }

                </Box>

                </Box>
            </Box>

            <Box display='flex' flexDirection='column'>
                <Typography sx={{ fontSize: '1.4rem', fontWeight: '600', color: '#444' }}>Etiquetas:</Typography>

                <Box sx={{
                            display: 'flex',
                            flexWrap: 'wrap',
                            gap: '.5rem',
                            listStyle: 'none',
                            p: 0,
                            m: 0,
                        }}
                        component="ul">
                            {
                                form.tags.map(( tag, index ) => (
                                    <Chip
                                        key={ tag }
                                        label={ tag }
                                        onDelete={ () => removeTag( tag ) }
                                        color='secondary'
                                        size='medium'
                                        sx={{ fontSize: '.9rem' }}
                                    />
                                )
                            )}
                        </Box>

                <Box display='flex' gap='.5rem' sx={{ mt: 1.5 }}>
                    <TextField
                        name='etiqueta'
                        value={ tag }
                        label='etiqueta'
                        type='string'
                        color='secondary'
                        variant='filled'
                        onChange={ ({ target }) => setTag( target.value ) }
                    />
                    <Button variant='outlined' color='secondary' onClick={ handleAddTag }>Agregar</Button>
                </Box>
            </Box>

            <Button variant='outlined' color='secondary' sx={{ mt: 1.5, fontSize: '1rem' }} onClick={ handleClearProduct }>Vaciar info del producto</Button>

            <Box display='flex' alignItems='center' sx={{ mb: -2 }}>
                <Checkbox
                    color='secondary'
                    checked={ revalidatePage }
                    onChange={ ({ target }) => setRevalidatePage( target.checked ) }
                />
              <Typography sx={{ cursor: 'pointer' }} onClick={ () => setRevalidatePage( !revalidatePage ) }>Revalidar páginas</Typography>
            </Box>

            <Button color='secondary' sx={{ fontSize: '1rem' }} disabled={ isLoading } onClick={ handleSubmitProduct }>
                { ( method === 'create' ) ? 'Crear producto' : 'Actualizar producto' }
            </Button>

        </Box>
  )
}
