import mongoose from 'mongoose';
const { model, Schema } = mongoose;
import { ISold } from '../interfaces';

const soldSchema = new Schema({
    productId: { type: Schema.Types.ObjectId, ref: 'Product', inmutable: true },
    soldUnits: { type: Number, default: 0 },
    updatedAt: { type: Number, default: () => Date.now() },
}, {
    versionKey: false,
});

// @ts-ignore
mongoose.models = {};

const Sold = model<ISold>('Sold', soldSchema);
export default Sold;