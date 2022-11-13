import mongoose from 'mongoose';
const { model, Schema } = mongoose;
import {  } from '../interfaces';

const soldSchema = new Schema({
    productId: { type: Schema.Types.ObjectId, ref: 'Product' },
    soldUnits: { type: Number, default: 0 },
    updatedAt: { type: Number, default: () => Date.now() },
});

// soldSchema.pre('save', function( next ) {
//     const sold = this;

//     sold.updatedAt = (() => Date.now())();
// })

// @ts-ignore
mongoose.models = {};

const Sold = model('Sold', soldSchema);
export default Sold;