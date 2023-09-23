import mongoose from 'mongoose';
const { Schema, model } = mongoose;
import { IIndexSection } from '../interfaces';

const indexImageSchema = new Schema({
    sections: [{
        url: { type: String, required: true },
        alt: { type: String, required: true },
        content: { type: String, required: false },
        link: { type: String, required: false },
        linkText: { type: String, required: false },
        bgcolor: { type: String, required: false },
    }]
});

// @ts-ignore
mongoose.models = {};

const IndexSection = model<IIndexSection>('Section', indexImageSchema);

export default IndexSection;