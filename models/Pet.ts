import mongoose from 'mongoose';
const { Schema, model } = mongoose;
import { IPet } from '../interfaces/pet';

const petSchema = new Schema({
    type: {
        type: String,
        enum: {
            values: ['perro', 'gato', 'otro', 'cambios', 'experiencias'],
            message: '{VALUE} no es un valor permitido'
        },
        required: true,
    },
    name: { type: String, required: true },
    description: { type: String, required: true },
    images: [{ type: String, required: true }],
    isAble: { type: Boolean, default: true },
});

// @ts-ignore
mongoose.models = {};

const Pet = model<IPet>('Pet', petSchema);
export default Pet;