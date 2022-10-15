import mongoose from 'mongoose';
const { model, Model, Schema } = mongoose;
import { ImageObj, IProduct } from '../interfaces';

// const imageSchema = new Schema({
//     url: { type: String, required: true },
//     alt: { type: String, required: true },
//     width: { type: Number, default: 250, required: true },
//     height: { type: Number, default: 250, required: true },
// })

const productSchema = new Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    images: {
        type: [{
            url: { type: String, required: true },
            alt: { type: String, required: true },
            width: { type: Number, default: 250, required: true },
            height: { type: Number, default: 250, required: true },
        }],
        required: true,
        validate: {
            validator: function ( elements: ImageObj[] ) {
                return elements.length >= 2 && elements.length <= 4;
            }
        }
    },
    inStock: {
        type: {
            unique: { type: Number, required: true },
            S: { type: Number },
            M: { type: Number },
            L: { type: Number },
            XL: { type: Number },
            XXL: { type: Number },
            XXXL: { type: Number },
        },
        required: true,
    },
    price: { type: Number, required: true },
    discount: { type: Number, default: 0 },
    tags: [{
        type: String,
        enum: {
            values: [ 'accesorios', 'consumibles', 'ropa', 'útil' ],
            message: '{VALUE} no es una etiqueta permitida',
            required: true,
        }
    }],
    sold: { type: Number, default: 0 },
    slug: { type: String, required: true },
})

// @ts-ignore
mongoose.models = {};

// @ts-ignore
const Product: Model<IProduct> = mongoose.models.Product || model('Product', productSchema);

// const Product = {}

export default Product;