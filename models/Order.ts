import mongoose from 'mongoose';
const { model, Schema } = mongoose;
import { IOrder, validMethods } from '../interfaces';

const orderSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    orderItems: [{
        _id: { type: String, required: true },
        name: { type: String, required: true },
        price: { type: Number, required: true },
        discount: { type: Number, default: 0 },
        quantity: { type: Number, required: true },
        size: {
            type: String,
            required: true,
            enum: {
                values: ['unique', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL'],
                message: '{VALUE} no es una talla permitida',
            }
        },
        slug: { type: String, required: true },
    }],
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
    transaction: {
        type: {
            status: {
                type: String,
                enum: {
                    values: ['send', 'paid', 'notpaid', 'pending'],
                    message: '{VALUE} no es un valor permitido',
                },
                default: 'pending',
            },
            transactionId: { type: String },
            method: {
                type: String,
                enum: {
                    values: validMethods,
                    message: '{VALUE} no es un valor permitido'
                },
                required: true,
            },
            phone: { type: String, default: '' },
            totalUSD: { type: Number, required: true },
            paidUSD: { type: Number },
            totalBs: { type: Number, required: true },
        }
    },
    contact: {
        type: {
            name: { type: String, default: '', required: true },
            facebook: { type: String, default: '' },
            instagram: { type: String, default: '' },
            whatsapp: { type: String, default: '' },
        },
    },
    createdAt: { type: Number, default: () => Date.now(), inmutable: true },
}, {
    versionKey: false,
})

// @ts-ignore
mongoose.models = {};

const Order = model<IOrder>('Order', orderSchema);

// const Order = {}

export default Order;