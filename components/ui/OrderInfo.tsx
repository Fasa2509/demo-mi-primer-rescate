import { Dispatch, FC, SetStateAction, useContext, useState } from "react";
import { Box, Button, Chip, Link, Typography } from "@mui/material";
import { useSnackbar } from "notistack";
import { format as formatDate } from 'date-fns';

import { dbOrders } from "../../database";
import { ScrollContext } from "../../context";
import { IOrder, Paid, SpanishOrderStatus, StatusColors } from "../../interfaces";
import { format, ConfirmNotificationButtons, PromiseConfirmHelper, formatText } from "../../utils";

interface Props {
    info: IOrder;
    orders: IOrder[];
    setOrders: Dispatch<SetStateAction<IOrder[]>>;
}

export const OrderInfo: FC<Props> = ({ info, orders, setOrders }) => {

    const { _id: orderId, orderItems, transaction, user, shippingAddress, contact, createdAt } = info;
    const { setIsLoading } = useContext( ScrollContext );
    const { enqueueSnackbar } = useSnackbar();

    const updatePaidOrder = async ( orderStatus: Paid ) => {
            let key = enqueueSnackbar(`¿Segur@ que quieres marcarla como ${ SpanishOrderStatus[orderStatus] }?`, {
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
                    if ( order._id === orderId ) return { ...order, transaction: { ...order.transaction, status: orderStatus } };
                    return order;
                }));
                info.transaction.status = orderStatus;
            }

            setIsLoading( false );

    }
  
    return (
        <Box className='fadeIn' display='flex' flexDirection='column' gap='1rem' sx={{ boxShadow: '0 0 1rem -.7rem #333', padding: '1.2rem', backgroundColor: '#fff', my: 3, borderRadius: '1rem' }}>
           
            <Typography>Órden creada el { !orderId ? '00/00/00 00:00:00am' : formatDate( createdAt, 'dd/MM/yyyy hh:mm:ssaa' ).toLowerCase() }</Typography>

            <Box display='flex' flexDirection='column'>
                <Typography sx={{ fontSize: '1.2rem', fontWeight: '600', color: '#333' }}>ID del Usuario:</Typography>
                <Typography sx={{ fontSize: '1.1rem' }}>{ user }</Typography>
            </Box>

            <Box display='flex' flexDirection='column'>
                <Typography sx={{ fontSize: '1.2rem', fontWeight: '600', color: '#333' }}>ID de la transacción:</Typography>
                <Typography sx={{ fontSize: '1.1rem' }}>{ transaction.transactionId }</Typography>
            </Box>

            <Box display='flex' flexDirection='column'>
                <Typography sx={{ fontSize: '1.2rem', fontWeight: '600', color: '#333' }}>Nombre de contacto:</Typography>
                <Typography sx={{ fontSize: '1.1rem' }}>{ contact.name }</Typography>
            </Box>

            <Box display='flex' flexDirection='column'>
                <Typography sx={{ fontSize: '1.2rem', fontWeight: '600', color: '#333' }}>Método de contacto:</Typography>
                <Box display='flex' flexWrap='wrap' gap='1.2rem' sx={{ fontSize: '1.1rem' }}>
                    {
                        Object.entries( contact ).filter(c => c[1] && c[0] !== '_id' && c[0] !== 'name').map(c => <Typography key={ c[0] }>{ formatText( c[0] ) }: { c[1] }</Typography>)
                    }
                </Box>
            </Box>

            <Box display='flex' flexDirection='column'>
                <Typography sx={{ fontSize: '1.2rem', fontWeight: '600', color: '#333' }}>Productos de la Orden:</Typography>
                <Box display='flex' flexDirection='column' gap='.3rem' sx={{ fontSize: '1.1rem' }}>
                    {
                        orderItems.map(( product, index: number ) => (
                            <Box key={ index }>
                                <Typography>
                                    { product.name }{ product.size !== 'unique' && ` (${ product.size })` } ={ '>' } { product.quantity } { product.quantity === 1 ? 'unidad' : 'unidades' } x { format( product.price * ( 1 - product.discount ) ) } = { format( product.price * (1 - product.discount) * product.quantity ) }
                                </Typography>
                            </Box>
                        ))
                    }
                </Box>
            </Box>

            <Box display='flex' justifyContent='space-between' gap='1rem' sx={{ flexDirection: { xs: 'column', md: 'row' } }}>
                <Box>
                    <Chip
                        // @ts-ignore
                        color={ StatusColors[transaction.status] }
                        label={ SpanishOrderStatus[transaction.status] }
                        variant='filled'
                        sx={{ color: '#fafafa' }}
                    />
                </Box>
                <Box display='flex' gap='.5rem' flexWrap='wrap'>
                    <Typography>Marcar como</Typography>
                    <Box display='flex' gap='.5rem' flexWrap='wrap'>
                        <Button color='secondary' sx={{ fontWeight: 'bold', color: '#fafafa' }} onClick={ () => updatePaidOrder('send') }>
                            Enviada
                        </Button>
                        <Button color='success' sx={{ fontWeight: 'bold' }} onClick={ () => updatePaidOrder('paid') }>
                            Pagada
                        </Button>
                        <Button color='warning' sx={{ fontWeight: 'bold' }} onClick={ () => updatePaidOrder('pending') }>
                            Pendiente
                        </Button>
                        <Button color='error' sx={{ fontWeight: 'bold' }} onClick={ () => updatePaidOrder('notpaid') }>
                            No Pagada
                        </Button>
                    </Box>
                </Box>
            </Box>

            <Box display='flex' flexDirection='column'>
                <Typography sx={{ fontSize: '1.2rem', fontWeight: '600', color: '#333' }}>Total:</Typography>
                <Typography>{ format( transaction.totalUSD ) }</Typography>
                <Typography>Bs. { ( transaction.totalBs ) }</Typography>
            </Box>

            <Box display='flex' flexDirection='column'>
                <Typography sx={{ fontSize: '1.2rem', fontWeight: '600', color: '#333' }}>Dirección:</Typography>
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