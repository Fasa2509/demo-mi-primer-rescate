import { Dispatch, FC, SetStateAction, useContext, useEffect, useState } from 'react'
import { Autocomplete, Box, Button, Checkbox, FormControl, InputLabel, Link, MenuItem, Select, TextField, Typography } from '@mui/material';
import { InStockSizes, IProduct, Sizes, SizesArray, Tags, TagsArray } from '../../interfaces'
import { ConfirmNotificationButtons, format, PromiseConfirmHelper } from '../../utils';
import { useSnackbar } from 'notistack';
import { dbProducts } from '../../database';
import { ScrollContext } from '../../context';
// import { FormProductState } from '../../pages/admin/productos';

interface Props {
    product: IProduct;
    method: 'create' | 'update';
    setMethod: Dispatch<SetStateAction<'create' | 'update'>>
    // setProduct: (p: IProduct) => void;
    // formUpdate: FormProductState;
    // setFormUpdate: Dispatch<SetStateAction<FormProductState>>;
}

interface FormProductState {
    _id: string;
    name: string;
    description: string;
    price: number;
    discount: number;
    inStock: InStockSizes;
    tags: Tags[];
}

const formUpdateInitialState: FormProductState = {
    _id: '',
    name: '',
    description: '',
    price: 0,
    discount: 0,
    inStock: {
      unique: 0,
      S: 0,
      M: 0,
      L: 0,
      XL: 0,
      XXL: 0,
      XXXL: 0,
    },
    tags: [],
}

const newProductInitialState: IProduct = {
    _id: '',
    name: '',
    description: '',
    images: [
      {
        url: '',
        alt: '',
        width: 500,
        height: 500,
      }
    ],
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
    slug: '/',
}

export const AdminProductInfo: FC<Props> = ({ product: thisProduct, method, setMethod/*, setProduct, formUpdate, setFormUpdate */}) => {

    const { enqueueSnackbar } = useSnackbar();
    const { setIsLoading } = useContext( ScrollContext );
    const [product, setProduct] = useState( newProductInitialState );
    const [formUpdate, setFormUpdate] = useState<FormProductState>( formUpdateInitialState );
    const [formCreate, setFormCreate] = useState<IProduct>( newProductInitialState );
    const [image, setImage] = useState({ url: '', alt: '' });
    const [unica, setUnica] = useState( true );
    const [tag, setTag] = useState('');
    const { _id, name, price, discount, inStock, tags, sold, slug } = product;

    useEffect(() => {
        setProduct( thisProduct );
        setFormUpdate({
            _id: thisProduct._id,
            name: thisProduct.name,
            description: thisProduct.description,
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
        })
        // setProductTags( thisProduct.tags );
        setUnica( thisProduct.inStock.unique > -1 );
        
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [thisProduct]);

    const handleSubmitProduct = async () => {
        if ( formUpdate.tags.length === 0 ) return enqueueSnackbar('El producto debe tener etiquetas', { variant: 'warning' })

        setIsLoading( true );
        
        if ( formUpdate._id ) {
            const res = await dbProducts.updateProductById( formUpdate._id, formUpdate, unica );

            enqueueSnackbar(res.message, { variant: !res.error ? 'success' : 'error' });
        } else {
            const res = await dbProducts.createNewProduct(newProductInitialState);

            enqueueSnackbar(res.message, { variant: !res.error ? 'success' : 'error' });
        }

        setIsLoading( false );
    }

    const handleClearProduct = async () => {
        let key = enqueueSnackbar('¿Quieres vaciar la info del producto?', {
            variant: 'info',
            autoHideDuration: 15000,
            action: ConfirmNotificationButtons,
        })

        const confirm = await PromiseConfirmHelper( key, 15000 );

        if ( !confirm ) return;

        // setProductTags([]);
        setFormUpdate( formUpdateInitialState );
        setMethod( 'create' );
        setProduct( newProductInitialState );
    }

    const handleAddTag = () => {
        if ( formUpdate.tags.includes( tag as Tags ) ) return setTag('');
        if ( tag === 'util' ) {
            setTag('');
            if ( formUpdate.tags.includes( 'útil' ) ) return setTag('');
            setFormUpdate({...formUpdate, tags: [...formUpdate.tags, 'útil' ]});
            return;
        }
        if ( !TagsArray.includes( tag as Tags ) ) return enqueueSnackbar('Esa etiqueta no es válida', { variant: 'error' });
        setFormUpdate({...formUpdate, tags: [...formUpdate.tags, tag as Tags]});
        setTag('');
        return;
    }

    const removeTag = ({ target }: { target: HTMLSpanElement }) => {
        setFormUpdate({ ...formUpdate, tags: formUpdate.tags.filter(t => t !== target.textContent?.replace('#', '')) })
    }

  return (
    <Box display='flex' flexDirection='column' gap='1rem' className='fadeIn' sx={{ border: '2px solid #eaeaea', padding: '1.2rem', backgroundColor: '#fff', my: 3, borderRadius: '1rem' }}>

        <Typography sx={{ fontSize: '1.5rem', fontWeight: '600', color: '#333' }}>{ method === 'create' ? 'Crear Producto' : 'Actualizar Producto' }</Typography>

            <Box display='flex' flexDirection='column'>
                <Typography sx={{ fontSize: '1.4rem', fontWeight: '600', color: '#444' }}>Nombre del Producto:</Typography>
                <TextField
                    name='name'
                    value={ formUpdate.name }
                    label='Nombre del producto'
                    type='text'
                    color='secondary'
                    variant='filled'
                    fullWidth
                    multiline
                    onChange={ ( e ) => setFormUpdate({ ...formUpdate, name: e.target.value }) }
                />
            </Box>

            <Box display='flex' flexDirection='column'>
                <Typography sx={{ fontSize: '1.4rem', fontWeight: '600', color: '#444' }}>Descripción del Producto:</Typography>
                <TextField
                    name='description'
                    value={ formUpdate.description }
                    label='Descripción del producto'
                    type='text'
                    color='secondary'
                    variant='filled'
                    fullWidth
                    multiline
                    onChange={ ( e ) => setFormUpdate({ ...formUpdate, description: e.target.value }) }
                />
            </Box>

            { method === 'create' &&
                <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: '.5rem' }}>
                    <TextField
                        name='url'
                        value={ image.url }
                        label='Url de la imagen'
                        type='string'
                        color='secondary'
                        variant='filled'
                        sx={{ flexGrow: 1 }}
                        onChange={ ({ target }) => {
                            setImage({ ...image, url: target.value })
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
                </Box>
            }

            <Box display='flex' flexDirection='column' gap='.5rem'>
                <Typography sx={{ fontSize: '1.4rem', fontWeight: '600', color: '#444' }}>Precio {'('}${')'}:</Typography>
                <Box>
                    <TextField
                        name='price'
                        value={ formUpdate.price }
                        label='Precio del producto'
                        type='number'
                        color='secondary'
                        variant='outlined'
                        onChange={ ({ target }) => {
                            if ( isNaN( Number(target.value) ) ) return;
                            setFormUpdate({ ...formUpdate, price: Number( target.value ) });
                        }}
                    />
                </Box>

                <Typography>Descuento: { discount * 100 }%{ discount > 0 && discount <= 0.5 && `. ${ format( price ) } - ${ discount * 100 }% = ${ format( price - price * discount ) }` }</Typography>

                <Box display='flex' alignItems='center'>
                    <TextField
                        name='discount'
                        value={ formUpdate.discount }
                        label='Descuento del producto'
                        type='number'
                        color='secondary'
                        variant='outlined'
                        onChange={ ({ target }) => {
                            if ( isNaN( Number(target.value) ) || Number(target.value) < 0 || Number(target.value) > 50 ) return;
                            setFormUpdate({ ...formUpdate, discount: Number( target.value ) });
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
                        if ( stock[1] === -1 ) return <div key={ 'unique' } style={{ display: 'none' }}></div>
                        if ( inStock.unique !== -1 && stock[0] !== 'unique' ) return <div key={ stock[0] } style={{ display: 'none' }}></div>
                        return <Box key={ index }>
                                    <Typography>{ ( stock[0] === 'unique' ) ? 'Única' : stock[0] }: { stock[1] }</Typography>
                                </Box>
                    })
                }

                {
                    ( formUpdate._id ) &&
                           <>
                                <Typography sx={{ fontWeight: '300', mt: 1.5 }}>Si deseas cambiar la cantidad de unidades, debes escribir el número de unidades <b>a sumar</b>. Si escribes un número positivo se añadirá esa cantidad de unidades a las ya existentes de la respectiva talla en la base de datos. Si escribes un número negativo, se reducirá esa cantidad de unidades.</Typography>
                                <Typography sx={{ fontWeight: '300', mt: 1.5 }}>Si un producto tiene distintas tallas <b>es necesario marcar única como -1</b> y las demás tallas con su respectivo valor, si un producto no tiene tallas se marca única con el valor respectivo y se dejan los demás en 0.</Typography>
                           </>
                }
                
                <Box display='flex' alignItems='center'>
                    <Checkbox
                        color='secondary'
                        checked={ unica }
                        onChange={ ({ target }) => setUnica( target.checked ) }
                    />
                    <Typography sx={{ cursor: 'pointer' }} onClick={ () => setUnica( !unica ) }>Talla única</Typography>
                </Box>

                <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr 1fr', md: '1fr 1fr 1fr' }, gap: '1rem', mt: 1 }}>

                {
                    ( unica )
                        ? (
                            <TextField
                                name='unique'
                                value={ Number(formUpdate.inStock.unique) }
                                label='Única'
                                type='number'
                                color='secondary'
                                variant='outlined'
                                onChange={ ({ target }) => setFormUpdate({ ...formUpdate, inStock: { ...formUpdate.inStock, unique: Number( target.value ) } }) }
                            />
                        )
                        : (
                            <>
                                <TextField
                                    name='S'
                                    value={ Number(formUpdate.inStock.S) }
                                    label='S'
                                    type='number'
                                    color='secondary'
                                    variant='outlined'
                                    onChange={ ({ target }) => setFormUpdate({ ...formUpdate, inStock: { ...formUpdate.inStock, S: Number( target.value ) } }) }
                                />

                                <TextField
                                    name='M'
                                    value={ Number(formUpdate.inStock.M) }
                                    label='M'
                                    type='number'
                                    color='secondary'
                                    variant='outlined'
                                    onChange={ ({ target }) => setFormUpdate({ ...formUpdate, inStock: { ...formUpdate.inStock, M: Number( target.value ) } }) }
                                />

                                <TextField
                                    name='L'
                                    value={ Number(formUpdate.inStock.L) }
                                    label='L'
                                    type='number'
                                    color='secondary'
                                    variant='outlined'
                                    onChange={ ({ target }) => setFormUpdate({ ...formUpdate, inStock: { ...formUpdate.inStock, L: Number( target.value ) } }) }
                                />

                                <TextField
                                    name='XL'
                                    value={ Number(formUpdate.inStock.XL) }
                                    label='XL'
                                    type='number'
                                    color='secondary'
                                    variant='outlined'
                                    onChange={ ({ target }) => setFormUpdate({ ...formUpdate, inStock: { ...formUpdate.inStock, XL: Number( target.value ) } }) }
                                />

                                <TextField
                                    name='XXL'
                                    value={ Number(formUpdate.inStock.XXL) }
                                    label='XXL'
                                    type='number'
                                    color='secondary'
                                    variant='outlined'
                                    onChange={ ({ target }) => setFormUpdate({ ...formUpdate, inStock: { ...formUpdate.inStock, XXL: Number( target.value ) } }) }
                                />

                                <TextField
                                    name='XXXL'
                                    value={ formUpdate.inStock.XXXL }
                                    label='XXXL'
                                    type='number'
                                    color='secondary'
                                    variant='outlined'
                                    onChange={ ({ target }) => setFormUpdate({ ...formUpdate, inStock: { ...formUpdate.inStock, XXXL: Number( target.value ) } }) }
                                />
                            </>
                        )
                }

                </Box>

                </Box>
            </Box>

            <Box display='flex' flexDirection='column'>
                <Typography sx={{ fontSize: '1.4rem', fontWeight: '600', color: '#444' }}>Etiquetas:</Typography>
                <Box display='flex' flexWrap='wrap' gap='.5rem' sx={{ fontSize: '1rem', color: '#666' }}>
                    {
                        formUpdate.tags.map(( tag ) => <span key={ tag } style={{ cursor: 'pointer' }} onClick={ removeTag as any }>#{ tag }</span>)
                    }
                </Box>

                {/* { formUpdate._id && <Typography sx={{ fontWeight: '300', mt: 1.5 }}>Si se omiten las etiquetas, se mantendrán las existentes, <b>si se agrega al menos una etiqueta, las etiquetas del producto serán sustituidas por las seleccionadas</b>.</Typography> } */}
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
                {/* <Box display='flex' flexWrap='wrap' gap='.5rem' sx={{ fontSize: '1rem', color: '#666' }}>
                    {
                        tags.map(( tag ) => <span key={ tag }>#{ tag }</span>)
                    }
                </Box> */}
            </Box>

            <Button variant='outlined' color='secondary' onClick={ handleClearProduct }>Vaciar info del producto</Button>

            <Button color='secondary' sx={{ mt: 2 }} onClick={ handleSubmitProduct }>
                { formUpdate._id ? 'Actualizar del producto' : 'Crear producto' }
            </Button>

        </Box>
  )
}
