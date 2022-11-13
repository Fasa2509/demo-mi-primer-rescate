import mongoose from 'mongoose';
const { model, Schema, Types } = mongoose;
import {  } from '../interfaces';

const soldSchema = new Schema({
    productId: { type: Types.ObjectId, ref: 'Product' },
    soldUnits: { type: Number, default: 0 },
});

// @ts-ignore
mongoose.models = {};

const Sold = model('Sold', soldSchema);
export default Sold;