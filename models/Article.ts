import mongoose from 'mongoose';
const { Model, Schema, model } = mongoose;
import { IArticle } from '../interfaces';

// const imageSchema = new Schema({
//     url: { type: String, required: true },
//     alt: { type: String, required: true },
//     width: { type: Number, default: 450, required: true },
//     height: { type: Number, default: 450, required: true},
// })

// const fieldSchema = new Schema({
//     type: {
//         type: String,
//         enum: {
//             values: ['texto', 'link', 'subtitulo', 'imagen', 'contador'],
//             message: '{VALUE} no es un campo permitido',
//             required: true,
//         },
//         required: true,
//     },
//     content: { type: String, required: true },
//     content_: { type: String, required: true },
//     images: [{
//         url: { type: String, required: true },
//         alt: { type: String, required: true },
//         width: { type: Number, default: 450, required: true },
//         height: { type: Number, default: 450, required: true},
//     }],
// })

const articleSchema = new Schema({
    title: { type: String, required: true },
    fields: [{
        type: {
            type: String,
            enum: {
                values: ['texto', 'link', 'subtitulo', 'imagen', 'contador'],
                message: '{VALUE} no es un campo permitido',
                required: true,
            },
            required: true,
        },
        content: { type: String, required: true },
        content_: { type: String, required: true },
        images: [{
            url: { type: String, required: true },
            alt: { type: String, required: true },
            width: { type: Number, default: 450, required: true },
            height: { type: Number, default: 450, required: true},
        }],
    }],
    createdAt: { type: Number, default: () => Date.now() },
})

// @ts-ignore
mongoose.models = {};

// @ts-ignore
const Article: Model<IArticle> = model.Article || model('Article', articleSchema);

export default Article;