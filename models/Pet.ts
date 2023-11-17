import mongoose from 'mongoose';
const { Schema, model } = mongoose;
import { IPet } from '../interfaces/pet';

const petSchema = new Schema({
    type: {
        type: String,
        enum: {
            values: ['perro', 'gato', 'otro', 'cambios'],
            message: '{VALUE} no es un valor permitido'
        },
        required: true,
    },
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    name: { type: String, required: true },
    description: { type: String, required: true },
    images: [{ type: String, required: true }],
    isAble: { type: Boolean, default: true },
    isAdminPet: { type: Boolean, default: false },
    createdAt: { type: Number, default: () => Date.now() },
}, {
    versionKey: false,
});

// @ts-ignore
mongoose.models = {};

const Pet = model<IPet>('Pet', petSchema);
export default Pet;