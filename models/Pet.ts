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
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    name: { type: String, required: true },
    description: { type: String, required: true },
    images: [{ type: String, required: true }],
    isAble: { type: Boolean, default: true },
    isAdminPet: { type: Boolean, default: false },
});

// @ts-ignore
mongoose.models = {};

// petSchema.pre('save', function( next ) {
//     console.log( this );

//     if ( this.type === 'perro' || this.type === 'gato' || this.type === 'otro' && this.images.length > 1 ) throw new Error('Hay imágenes de más');
//     if ( this.type === 'cambios' || this.type === 'experiencias' && this.images.length === 1 || this.images.length > 4 ) throw new Error('Faltan imágenes');
    
//     next();
// })

const Pet = model<IPet>('Pet', petSchema);
export default Pet;