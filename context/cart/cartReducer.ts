import { CartState } from '.';
import { ICartProduct } from '../../interfaces';

type CartActionType =
| { type: 'Cart - Load Cart From Cookies', payload: ICartProduct[] }
| { type: 'Cart - Update Product in Cart', payload: ICartProduct }
| { type: 'Cart - Clear Cart' }
| { type: 'Cart - Remove Product From Cart', payload: ICartProduct }
| { type: 'NumberOfItems - Update' }

export const cartReducer = ( state: CartState, action: CartActionType ): CartState => {

    switch( action.type ) {
        case 'Cart - Load Cart From Cookies':
            return {
                ...state,
                cart: action.payload,
            }

        case 'Cart - Update Product in Cart':
            
            let productInCart = state.cart.find(product => product._id === action.payload._id);

            return productInCart
                ? {
                    ...state,
                    cart: state.cart.map(p => {
                        if ( p._id !== action.payload._id ) return p;
                        return {
                            ...p,
                            quantity: action.payload.quantity,
                        }
                    })
                }
                : {
                    ...state,
                    cart: [...state.cart, action.payload]
                }

        case 'Cart - Clear Cart':
            return {
                ...state,
                cart: [],
            }

        case 'Cart - Remove Product From Cart':
            return {
                ...state,
                cart: state.cart.filter(p => p._id !== action.payload._id)
            }

        case 'NumberOfItems - Update':
            return {
                ...state,
                numberOfItems: state.cart.reduce(( prev, { quantity }) => prev + quantity, 0),
            }

        default:
            return state;
    }

}