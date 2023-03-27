import { CartState } from '.';
import { ICartProduct, IProduct } from '../../interfaces';

type CartActionType =
| { type: 'Cart - Load Cart From Cookies', payload: ICartProduct[] }
| { type: 'Cart - Update Product in Cart', payload: ICartProduct }
| { type: 'Cart - Update Cart Products', payload: IProduct[] }
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
            let productInCart = state.cart.find(product => product._id === action.payload._id && product.size === action.payload.size);

            if ( action.payload.quantity < 1 ) {
                return  {
                        ...state,
                        cart: state.cart.filter(p => p._id !== action.payload._id || p.size !== action.payload.size)
                    }
            }

            return productInCart
                ? {
                    ...state,
                    cart: state.cart.map(p => {
                        if ( p._id !== action.payload._id || p.size !== action.payload.size ) return p;
                        return action.payload
                    })
                }
                : {
                    ...state,
                    cart: [...state.cart, action.payload]
                }

        case 'Cart - Update Cart Products':
            return {
                ...state,
                // @ts-ignore
                cart: state.cart.map(( product ) => {
                    const productInData = action.payload.find(( p ) => p._id === product._id);

                    return productInData
                        ? { ...product, quantity: product.quantity > productInData.inStock[product.size]! ? productInData.inStock[product.size] : product.quantity, price: productInData.price, discount: productInData.discount, maxQuantity: productInData.inStock[product.size] || 9 }
                        : product
                // @ts-ignore 
                }).filter(( product ) => product.quantity > 0)
            }

        case 'Cart - Clear Cart':
            return {
                ...state,
                cart: [],
            }

        case 'Cart - Remove Product From Cart':
            return {
                ...state,
                cart: !action.payload.size
                    ? state.cart.filter(p => p._id !== action.payload._id)
                    : state.cart.filter(p => p._id !== action.payload._id || p.size !== action.payload.size)        
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