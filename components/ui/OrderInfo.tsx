import { Dispatch, FC, SetStateAction, useContext, useState } from "react";
import { Box, Button, Chip, Link, Typography } from "@mui/material";
import { useSnackbar } from "notistack";

import { dbOrders } from "../../database";
import { ScrollContext } from "../../context";
import { IOrder, IOrderInfo, Paid } from "../../interfaces";
import { ConfirmNotificationButtons, PromiseConfirmHelper } from "../../utils";

interface Props {
    info: IOrderInfo;
    orders: IOrder[];
    setOrders: Dispatch<SetStateAction<IOrder[]>>;
}

export const OrderInfo: FC<Props> = ({ info, orders, setOrders }) => {

    const { orderId, products, isPaid, total, shippingAddress, contact, createdAt } = info;
    const { setIsLoading } = useContext( ScrollContext );
    const { enqueueSnackbar } = useSnackbar();

    const updatePaidOrder = async ( orderStatus: Paid ) => {
            let key = enqueueSnackbar(`¿Segur@ que quieres marcarla como ${ orderStatus === 'paid' ? 'Pagada' : orderStatus === 'notpaid' ? 'No Pagada' : 'Pendiente' }?`, {
                variant: 'info',
                autoHideDuration: 10000,
                action: ConfirmNotificationButtons,
            });

            const confirm = await PromiseConfirmHelper( key, 10000 );

            if ( !confirm ) return;
            
            setIsLoading( true );
        
            const res = await dbOrders.updatePaidOrder( orderId, orderStatus );
            
            enqueueSnackbar(res.message, { variant: ( !res.error ) ? 'success' : 'error' });

            if ( !res.error ) {
                setOrders( orders.map(order => {
                    if ( order._id === orderId ) return { ...order, isPaid: orderStatus };
                    return order;
                }))
                info.isPaid = orderStatus;
            }

            setIsLoading( false );

    }
  
    return (
        <Box display='flex' flexDirection='column' gap='1rem' sx={{ border: '2px solid #eaeaea', padding: '1.2rem', backgroundColor: '#fff', my: 3, borderRadius: '1rem' }}>
           
            <Box display='flex' flexDirection='column' gap='.4rem'>
                <Typography sx={{ fontSize: '1.4rem', fontWeight: '600', color: '#444' }}>Nombre de contacto:</Typography>
                <Typography sx={{ fontSize: '1.1rem' }}>{ contact.name }</Typography>
            </Box>

            <Typography>Orden creada el { createdAt }</Typography>

            <Box display='flex' flexDirection='column' gap='.4rem'>
                <Typography sx={{ fontSize: '1.4rem', fontWeight: '600', color: '#444' }}>Método de contacto:</Typography>
                <Box display='flex' flexWrap='wrap' gap='1.2rem' sx={{ fontSize: '1.1rem' }}>
                    {
                        Object.entries( contact ).filter(c => c[1] && c[0] !== '_id' && c[0] !== 'name').map(c => <Typography key={ c[0] }>{ c[0] }: { c[1] }</Typography>)
                    }
                </Box>
            </Box>

            <Box display='flex' flexDirection='column' gap='.4rem'>
                <Typography sx={{ fontSize: '1.4rem', fontWeight: '600', color: '#444' }}>Productos de la Orden:</Typography>
                <Box display='flex' flexDirection='column' gap='.3rem' sx={{ fontSize: '1.1rem' }}>
                    {
                        products.map(( product, index: number ) => (
                            <Box key={ index }>
                                <Typography>{ product.name }{ product.size !== 'unique' && ` (${ product.size })` } ={ '>' } { product.quantity } { product.quantity === 1 ? 'unidad' : 'unidades' }</Typography>
                            </Box>
                        ))
                    }
                </Box>
            </Box>

            <Box display='flex' justifyContent='space-between' gap='1rem' sx={{ flexDirection: { xs: 'column', md: 'row' } }}>
                <Box>
                    <Chip
                        color={ ( isPaid ) === 'paid' ? 'success' : ( isPaid === 'notpaid' ) ? 'error' : 'warning' }
                        label={ ( isPaid ) === 'paid' ? 'Pagada' : ( isPaid === 'notpaid' ) ? 'No pagada' : 'Pendiente' }
                        variant='filled'
                        />
                </Box>
                <Box display='flex' gap='.5rem' flexWrap='wrap'>
                    <Typography>Marcar como</Typography>
                    <Box display='flex' gap='.5rem'>
                        <Button color='success' variant='outlined' sx={{ fontWeight: 'bold' }} onClick={ () => updatePaidOrder('paid') }>
                            Pagada
                        </Button>
                        <Button color='warning' variant='outlined' sx={{ fontWeight: 'bold' }} onClick={ () => updatePaidOrder('pending') }>
                            Pendiente
                        </Button>
                        <Button color='error' variant='outlined' sx={{ fontWeight: 'bold' }} onClick={ () => updatePaidOrder('notpaid') }>
                            No Pagada
                        </Button>
                    </Box>
                </Box>
            </Box>

            <Box display='flex' flexDirection='column' gap='.4rem'>
                <Typography sx={{ fontSize: '1.4rem', fontWeight: '600', color: '#444' }}>Total:</Typography>
                <Typography>{ total }</Typography>
            </Box>

            <Box display='flex' flexDirection='column' gap='.4rem'>
                <Typography sx={{ fontSize: '1.4rem', fontWeight: '600', color: '#444' }}>Dirección:</Typography>
                <Box display='flex' flexDirection='column' gap='.3rem'>
                    <Typography>{ shippingAddress.address }</Typography>
                    { shippingAddress.maps.latitude && shippingAddress.maps.longitude &&
                        <Link href={ `https://www.google.com/maps/@${ shippingAddress.maps.latitude },${ shippingAddress.maps.longitude },14z?hl=es` } target='_blank' rel='noreferrer' alignSelf='flex-start' sx={{ color: '#666', fontWeight: '600' }}>Ver en Maps</Link>
                    }
                </Box>
            </Box>

        </Box>
    )
}