import { createContext } from "react";
import { ICartProduct } from "../../interfaces";


interface ContextProps {
    // props
    cart: ICartProduct[];
    numberOfItems: number;
    // subTotal: number;
    // tax: number;
    total: number;
    shippingAddress?: string;

    // methods
    addProductToCart: (p: ICartProduct) => void;
    clearCart: () => void;
    removeProductFromCart: (p: ICartProduct) => void;
}


export const CartContext = createContext({} as ContextProps)