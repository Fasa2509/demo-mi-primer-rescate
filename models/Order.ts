import mongoose from 'mongoose';
const { model, Model, Schema } = mongoose;
import { IOrder } from '../interfaces';

const orderSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    orderItems: [{
        _id: { type: String, required: true },
        name: { type: String, required: true },
        image: {
            url: { type: String, required: true },
            alt: { type: String, required: true },
            width: { type: Number, default: 250, required: true },
            height: { type: Number, default: 250, required: true },
        },
        price: { type: Number, required: true },
        discount: { type: Number, default: 0 },
        quantity: { type: Number, required: true },
        size: {
            type: String,
            required: true,
            enum: {
                values: [ 'unique', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL' ],
                message: '{VALUE} no es una talla permitida',
            }
        },
        tags: [{
            type: String,
            required: true,
            enum: {
                values: [ 'accesorios', 'consumibles', 'ropa', 'útil' ],
                message: '{VALUE} no es una etiqueta permitida',
            }
        }],
        slug: { type: String, required: true },
    }],
    total: { type: Number, required: true },
    isPaid: {
        type: String,
        enum: {
            values: [ 'paid', 'notpaid', 'pending' ],
            message: '{VALUE} no es un valor permitido',
        },
        default: 'pending',
    },
    shippingAddress: {
        type: {
            address: { type: String, required: true },
            maps: {
                type: {
                    longitude: { type: Number, required: true },
                    latitude: { type: Number, required: true },
                },
                required: true,
            },
        },
        required: true,
    },
    contact: {
        type: {
            facebook: { type: String, default: '' },
            instagram: { type: String, default: '' },
            whatsapp: { type: String, default: '' },
        },
    },
    createdAt: { type: Number, default: () => Date.now(), inmutable: true },
})

// @ts-ignore
mongoose.models = {};

// @ts-ignore
const Order: Model<IOrder> = mongoose.models.Order || model('Order', orderSchema);

// const Order = {}

export default Order;