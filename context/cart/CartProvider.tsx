import { FC, useEffect, useReducer } from 'react';
import Cookies from 'js-cookie';
import { CartContext, cartReducer } from './';
import { ICartProduct, Sizes } from '../../interfaces';


export interface CartState {
    cart: ICartProduct[];
    numberOfItems: number;
    shippingAddress: {
        address: string;
        maps: string;
    };
}


interface Props {
    children: JSX.Element | JSX.Element[];
}


export const CART_INITIAL_STATE: CartState = {
    cart: [],
    numberOfItems: 0,
    shippingAddress: {
        address: '',
        maps: '',
    }
}


export const CartProvider: FC<Props> = ({ children }) => {

    const [state, dispatch] = useReducer( cartReducer, CART_INITIAL_STATE );

    useEffect(() => {
        const cookieProducts = Cookies.get('mpr__cart') ? JSON.parse( Cookies.get('mpr__cart')! ) : [];
        
        dispatch({ type: 'Cart - Load Cart From Cookies', payload: cookieProducts });
    }, [])

    useEffect(() => {
        if ( state.cart.length > 0 ) Cookies.set('mpr__cart', JSON.stringify( state.cart ));

        dispatch({ type: 'NumberOfItems - Update' });
    }, [state.cart]);

    const updateProductQuantity = ( product: ICartProduct ) =>
        dispatch({ type: 'Cart - Update Product in Cart', payload: product });

    const getProductQuantity = ( productId: string, productSize: Sizes ): number => {
        const productInCart = state.cart.find(p => p._id === productId && p.size === productSize)

        return productInCart
            ? productInCart.quantity
            : 0;
    }

    const clearCart = () => {
        Cookies.set('mpr__cart', JSON.stringify( [] ));
        dispatch({ type: 'Cart - Clear Cart' })
    }

    const removeProductFromCart = ( product: ICartProduct ) =>
        dispatch({ type: 'Cart - Remove Product From Cart', payload: product })

    return (
        <CartContext.Provider value={{
            // props
            ...state,

            // methods
            updateProductQuantity,
            getProductQuantity,
            clearCart,
            removeProductFromCart
        }}>
            { children }
        </CartContext.Provider>
    )
}