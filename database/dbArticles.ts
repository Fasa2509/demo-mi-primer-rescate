import { db } from ".";
import axios, { AxiosError } from "axios";
import { mprApi } from "../mprApi";
import { IArticle, Field } from "../interfaces";
import { Article } from "../models";

export const getAllArticles = async (): Promise<IArticle[] | null> => {

    try {
        await db.connect();
        
        const allArticles: any[] = await Article.find();

        await db.disconnect();

        return allArticles.sort((a, b) => b.createdAt - a.createdAt);
    } catch( error ) {
        console.log( error );
        return null;
    }

}

export const saveNewArticle = async ( title: string, fields: Field[] ): Promise<{ error: boolean; message: string }> => {

    try {

        let actualFields = fields.map((field) => {
            if ( field.type === 'link' ) return field;
            if ( field.type === 'imagen' ) return { ...field, content: '_', content_: '_' }
            return { ...field, content_: '_' }
        })
        
        let { data } = await mprApi.post('/article', {
            title,
            fields: actualFields,
        });

        return data;
        // @ts-ignore
    } catch( error: Error | AxiosError ) {
        console.log(error);

        if ( axios.isAxiosError( error ) ) {
            return { error: true, message: 'Ocurrió un error guardando el artículo' }
        }

        return {
            error: true,
            message: 'Ocurrió un error guardando el artículo',
        };
    }
    
}

export const removeArticle = async ( id: string ): Promise<{ error: boolean; message: string }> => {

    try {
        const { data } = await mprApi.delete('/article/' + id);
        
        return data;
        // @ts-ignore
    } catch( error: Error | AxiosError ) {
        console.log( error );
        await db.disconnect();
        const { data } = error.response
        return data;
    }

}