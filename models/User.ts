import mongoose from 'mongoose';
const { model, Schema } = mongoose;
import { IUser } from '../interfaces';

const userSchema = new Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true },
    role: {
        type: String,
        enum: {
            values: ['user', 'superuser', 'admin'],
            message: '{VALUE} no es un role válido',
        },
        default: 'user',
        required: true,
    },
    isSubscribed: { type: Boolean, default: false },
    isAble: { type: Boolean, default: true },
    orders: [{ type: Schema.Types.ObjectId, ref: 'Order', required: true }],
    pets: [{ type: Schema.Types.ObjectId, ref: 'Pet', required: true }],
    createdAt: { type: Number, default: () => Date.now() },
}, {
    versionKey: false,
})

// @ts-ignore
mongoose.models = {};

// @ts-ignore
const User = model<IUser>('User', userSchema);

export default User;