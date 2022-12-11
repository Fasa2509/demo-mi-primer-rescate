import { createContext } from "react";
import { ICartProduct, IProduct, Sizes } from "../../interfaces";


interface ContextProps {
    // props
    cart: ICartProduct[];
    numberOfItems: number;

    // methods
    updateProductQuantity: (p: ICartProduct) => void;
    updateProductsInCart: (p: IProduct[]) => void;
    getProductQuantity: ( productId: string, productSize: Sizes ) => number;
    getTotal: () => number;
    clearCart: () => void;
    removeProductFromCart: (p: ICartProduct) => void;
}


export const CartContext = createContext({} as ContextProps)