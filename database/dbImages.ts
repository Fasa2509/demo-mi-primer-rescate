import { db } from ".";
import axios from "axios";
import { IndexSection } from "../models";
import { ApiResponse, mprApi } from "../mprApi";
import { IIndexImage, IIndexSection } from "../interfaces";

export const getIndexSections = async (): Promise<IIndexSection | null> => {
    try {
        await db.connect();

        const images = await IndexSection.findOne().lean();

        await db.disconnect();

        return images
            ? JSON.parse(JSON.stringify(images))
            : null;
    } catch (error) {
        return null;
    }
}

export const saveIndexSections = async (sections: IIndexImage[]): Promise<ApiResponse> => {

    try {
        const { data } = await mprApi.post('/images', { sections });

        return data;
    } catch (error) {
        if (axios.isAxiosError(error))
            // @ts-ignore
            return error.response ? error.response.data : { error: true, message: 'Ocurrió un error subiendo la imagen' };

        return { error: true, message: 'Ocurrió un error subiendo la imagen' };
    }

}

export const deleteIndexImage = async (imgId: string): Promise<{ error: boolean; message: string; }> => {

    try {
        const { data } = await mprApi.delete('/images?id=' + imgId);

        return data;
    } catch (error) {
        if (axios.isAxiosError(error))
            // @ts-ignore
            return error.response ? error.response.data : { error: true, message: 'Ocurrió un error subiendo la imagen' };

        return { error: true, message: 'Ocurrió un error subiendo la imagen' };
    }

}

export const uploadImageToS3 = async (file: File | Blob): Promise<{ error: boolean; message: string; imgUrl?: string; }> => {

    try {
        const { data } = await mprApi.post('/s3', {
            // @ts-ignore
            rscname: file.name,
        });

        if (!data.Key) throw {};

        const res = await axios.put(data.url || '', file, {
            headers: {
                'Content-Type': 'multipart/form-data'
            },
        });

        if (!((res.status >= 200 || res.status < 300))) throw {};

        // TODO: ARREGLAR ESTOOOOOOO
        return { error: false, message: 'La imagen fue subida', imgUrl: `https://fasa-bucket.s3.sa-east-1.amazonaws.com/${data.Key}` }
    } catch (error) {
        return { error: true, message: 'Ocurrió un error subiendo la imagen' }
    }

}

export const deleteImageFromS3 = async (Key: string): Promise<{ error: boolean; message: string; }> => {

    try {
        const { data } = await mprApi.put('/s3', {
            Key
        });

        return data;
    } catch (error) {

        // @ts-ignore
        if (axios.isAxiosError(error)) return error.response ? error.response.data : { error: true, message: 'No se pudo eliminar la imagen' };

        return { error: true, message: 'No se pudo eliminar la imagen' };
    }

}