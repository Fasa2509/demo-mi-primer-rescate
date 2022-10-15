import mongoose from 'mongoose';
const { model, Schema } = mongoose;
import { IUser } from '../interfaces';

const userSchema = new Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: {
        type: String,
        enum: {
            values: [ 'user', 'superuser', 'admin' ],
            message: '{VALUE} no es un role válido',
            default: 'user',
            required: true,
        }
    },
    isSubscribed: { type: Boolean, default: false },
    createdAt: { type: Number, default: () => Date.now() }
})

// @ts-ignore
mongoose.models = {};

// @ts-ignore
const User: Model<IUser> = mongoose.model.User || model('User', userSchema)

export default User;