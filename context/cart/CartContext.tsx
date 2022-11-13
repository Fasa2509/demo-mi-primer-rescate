import { createContext } from "react";
import { ICartProduct, Sizes } from "../../interfaces";


interface ContextProps {
    // props
    cart: ICartProduct[];
    numberOfItems: number;

    // methods
    updateProductQuantity: (p: ICartProduct) => void;
    getProductQuantity: ( productId: string, productSize: Sizes ) => number;
    clearCart: () => void;
    removeProductFromCart: (p: ICartProduct) => void;
}


export const CartContext = createContext({} as ContextProps)