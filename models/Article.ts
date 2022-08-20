import { Schema, Model, models, model } from 'mongoose';
import { IArticle } from '../interfaces';

const imageSchema = new Schema({
    url: { type: String, required: true },
    alt: { type: String, required: true },
    width: { type: Number, default: 250, required: true },
    height: { type: Number, default: 250, required: true },
})

const fieldSchema = new Schema({
    type: {
        type: String,
        enum: {
            values: ['texto', 'link', 'subtitulo', 'imagen', 'contador'],
            message: '{VALUE} no es un campo permitido'
        },
    },
    content: { type: String, required: true },
    content_: { type: String },
    images: [imageSchema],
})

const articleSchema = new Schema({
    title: { type: String, required: true },
    fields: [{
        type: [fieldSchema],
    }],
    createdAt: { type: Number, default: Date.now() },
})

const Article: Model<IArticle> = models.Article || model('Article', articleSchema);

export default Article;