import mongoose from 'mongoose';
const { Schema, model } = mongoose;

const dolarSchema = new Schema({
    price: { type: Number, required: true, min: 0.1 },
});

// @ts-ignore
mongoose.models = {};

const Dolar = model<{ price: Number }>('Dolar', dolarSchema);
export default Dolar;