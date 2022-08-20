export interface IProduct {
    image: string;
    name: string;
    description?: string;
    price: number;
    discount?: number;
    stock: number;
    tags: Tags[];
    slug: string;
}

type Tags = 'juguetes' | 'comida' | 'ropa' | 'medicamentos' | 'servicios'