import axios from "axios";
import { db } from ".";
import { ApiResponsePayload, mprApi } from "../mprApi";
import { IAdoption } from "../interfaces";
import { Adoption } from "../models";

export const createAdoption = async (form: IAdoption): Promise<{ error: boolean; message: string; }> => {

    if (!form.user) return { error: true, message: 'Es necesario iniciar sesión' };

    if (!form.contact.facebook && !form.contact.instagram && !form.contact.whatsapp)
        return { error: true, message: 'Es necesario al menos un método de contacto' };

    const { _id, ...actualForm } = form;

    try {
        const { data } = await mprApi.post('/adoption', actualForm);

        return data;
    } catch (error: any) {

        if (axios.isAxiosError(error)) {
            return {
                error: true,
                // @ts-ignore
                message: error.response ? error.response.data.message : 'Ocurrió un error guardando la adopción',
            }
        }

        return {
            error: true,
            message: 'Error',
        };
    }

}

export const checkAdoption = async (_id: string): Promise<{ error: boolean; message: string; }> => {

    try {
        const { data } = await mprApi.put('/adoption', {
            _id
        });

        return data;
    } catch (error) {

        if (axios.isAxiosError(error)) {
            return {
                error: true,
                // @ts-ignore
                message: error.response ? error.response.data.message : 'Ocurrió un error actualizando la adopción',
            }
        }

        return {
            error: true,
            message: 'Error',
        };
    }

}

export const getAllAdoptions = async () => {

    try {
        await db.connect();

        const adoptions = await Adoption.find().skip(0).limit(20).sort({ createdAt: -1 }).lean();

        await db.disconnect();

        return JSON.parse(JSON.stringify(adoptions));
    } catch (error: any) {
        await db.disconnect();
        return null;
    }

}

export const getPaginatedAdoptions = async (page: number): Promise<ApiResponsePayload<{ adoptions: IAdoption[] }>> => {

    try {
        const { data } = await mprApi.get<ApiResponsePayload<{ adoptions: IAdoption[] }>>('/adoption?p=' + page);

        return data;
    } catch (error) {
        // @ts-ignore
        if (axios.isAxiosError(error)) return error.response ? error.response.data : { error: true, message: 'Ocurrió un error' };

        return {
            error: true,
            message: 'Ocurrió un error obteniendo las adopciones'
        }
    }

}
