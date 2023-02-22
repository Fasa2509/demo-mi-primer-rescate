import mongoose from 'mongoose';
const { Schema, model } = mongoose;
import { IIndexImage } from '../interfaces';

const indexImageSchema = new Schema({
    url: { type: String, required: true },
    alt: { type: String, required: true },
});

const IndexImage = model<IIndexImage>('Image', indexImageSchema);
export default IndexImage;