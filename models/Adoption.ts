import mongoose from 'mongoose';
const { Schema, model } = mongoose;

const adoptionSchema = new Schema({
    user: { type: String },
    particular1: { type: String },
    particular2: { type: String },
    input1: { type: String },
    input2: { type: String },
    input3: { type: Boolean },
    input4: { type: String },
    input5: { type: String },
    input6: { type: Boolean },
    input7: { type: Boolean },
    input8: { type: String },
    input9: { type: String },
    input10: { type: Boolean },
    input11: { type: String },
    input12: { type: Boolean },
    input13: { type: String },
    input14: { type: Boolean },
    input15: { type: String },
    input16: { type: String },
    input17: { type: String },
    input18: { type: String },
    input19: { type: Number },
    input20: { type: Number },
    input21: { type: Boolean },
    input22: { type: String },
    input23: { type: String },
    cachorro: { type: Boolean },
    input24: { type: String },
    input25: { type: String },
    input26: { type: Boolean },
    input27: { type: Boolean },
    input28: { type: String },
    createdAt: { type: Number, default: () => Date.now() },
})

// @ts-ignore
mongoose.models = {};

// @ts-ignore
const Adoption = model.adoption || model('Adoption', adoptionSchema);

export default Adoption;