import type { NextApiResponse, NextApiRequest } from "next";
import crypto from 'crypto';
import axios from 'axios';
import { ApiResponsePayload } from "../../../mprApi";

type Data =
    | ApiResponsePayload<any>

export default async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {

    switch (req.method) {
        case 'GET':
            return payment(req, res);

        case 'POST':
            return getauth(req, res);

        case 'PUT':
            return c2p(req, res);

        default:
            return res.status(400).json({ error: true, message: 'BAD REQUEST!' });
    }

}

const CVV = "859"
const OTP = "11111111"

const secretkey = process.env.CYPHER_KEY!;

const payment = async (req: NextApiRequest, res: NextApiResponse<Data>) => {

    try {
        const myCrypto = new Crypto();

        const encryptedCVV = myCrypto.encrypt(CVV);
        const encryptedTFA = myCrypto.encrypt(OTP)

        const body = {
            "merchant_identify": {
                "integratorId": "1",
                "merchantId": process.env.MERCHANT_ID!,
                "terminalId": "1"
            },
            "client_identify": {
                "ipaddress": "10.0.0.1",
                // "browser_agent": "Chrome 18.1.3",
                "mobile": {
                    // "manufacturer": "Samsung",
                    // "model": "S9",
                    // "os_version": "Oreo 9.1",
                    "location": {
                        // "lat": 37.422476,
                        // "lng": 122.08425
                    }
                }
            },
            "transaction": {
                "trx_type": "compra",
                "payment_method": "tdd",
                "card_number": "501878200066287386",
                "customer_id": "V18366876",
                "invoice_number": "112345678911",
                "account_type": "ca",
                "twofactor_auth": encryptedTFA,
                "expiration_date": "2021/11",
                "cvv": encryptedCVV,
                "currency": "ves",
                "amount": 15.25,
            }
        }

        const response = await fetch(process.env.ENDPOINT_PAY!, {
            method: 'POST',
            headers: {
                'accept': 'application/json',
                'Content-Type': 'application/json',
                "X-IBM-Client-Id": process.env.CLIENT_ID!,
            },
            body: JSON.stringify(body)
        })
            .then((r) => r.json())
            .catch((e) => e)

        return res.status(200).json({ error: false, message: 'Respuesta obtenida', payload: response })
    } catch (error: unknown) {

        axios.isAxiosError(error)
            ? console.log(error.response?.data)
            : console.log(error)

        return res.status(200).json({ error: true, message: 'BAD REQUEST!' });
    }

}

interface Crypto {
    key: string | Buffer;
    iv: string;
}

const setKey = (myKey: string): Buffer => {
    try {
        const sha = crypto.createHash('sha256');
        return sha.update(myKey, 'utf8').digest().subarray(0, 16);
    } catch (error) {
        console.error(error);
        return Buffer.from('')
    }
}

class Crypto implements Crypto {
    constructor(iv = '') {
        this.key = setKey(secretkey);
        this.iv = iv;
    }

    encrypt(message: string, messageEncoding = 'utf8', cipherEncoding = 'base64') {
        const cipher = crypto.createCipheriv('aes-128-ecb', this.key, this.iv);
        cipher.setAutoPadding(true);

        // @ts-ignore
        let encrypted = cipher.update(message, messageEncoding, cipherEncoding);
        // @ts-ignore
        encrypted += cipher.final(cipherEncoding);

        return encrypted;
    }

    decrypt(encrypted: string, cipherEncoding = 'base64', messageEncoding = 'utf8') {
        const decipher = crypto.createDecipheriv('aes-128-ecb', this.key, this.iv);
        // decipher.setAutoPadding(true);

        // @ts-ignore
        let decrypted = decipher.update(encrypted, cipherEncoding, messageEncoding);
        // @ts-ignore
        decrypted += decipher.final(messageEncoding);

        return decrypted;
    }
};


const getauth = async (req: NextApiRequest, res: NextApiResponse<Data>) => {

    try {
        const myCrypto = new Crypto();

        const headers = {
            "accept": "application/json",
            "Content-Type": "application/json",
            "X-IBM-Client-Id": process.env.CLIENT_ID!,
        }

        const body = {
            "merchant_identify": {
                "integratorId": "1",
                "merchantId": process.env.MERCHANT_ID!,
                "terminalId": "1"
            },
            "client_identify": {
                "ipaddress": "10.0.0.1",
                //"browser_agent": "Chrome 18.1.3",
                "mobile": {
                    //"manufacturer": "Samsung",
                    //"model": "S9",
                    //"os_version": "Oreo 9.1",
                    "location": {
                        //"lat": 37.422476,
                        //"lng": 122.08425
                    }
                }
            },
            "transaction_authInfo": {
                "trx_type": "solaut",
                "payment_method": "tdd",
                "card_number": "501878200066287386",
                "customer_id": "V18366876"
            }
        }

        let response = await fetch(process.env.ENDPOINT_AUTH!, {
            method: 'POST',
            headers,
            body: JSON.stringify(body)
        })
            .then((r) => r.json())
            .catch((e) => e)

        let twofactor_field_type = myCrypto.decrypt(response.authentication_info.twofactor_field_type)
        let twofactor_label = myCrypto.decrypt(response.authentication_info.twofactor_label)
        let twofactor_lenght = myCrypto.decrypt(response.authentication_info.twofactor_lenght)
        let twofactor_type = myCrypto.decrypt(response.authentication_info.twofactor_type)


        response = {
            ...response,
            twofactor_field_type,
            twofactor_label,
            twofactor_lenght,
            twofactor_type,
        }

        return res.status(200).json({ error: false, message: 'Respuesta obtenida', payload: response })
    } catch (error: unknown) {

        axios.isAxiosError(error)
            ? console.log(error.response?.data)
            : console.log(error)

        return res.status(200).json({ error: true, message: 'BAD REQUEST!' });
    }

}

const movil_origen = '584148508980'
const movil_destino = '584241513063'
const ID_destino = 'V18367443'
const clave_compra = '00001111'

const c2p = async (req: NextApiRequest, res: NextApiResponse<Data>) => {

    try {
        const myCrypto = new Crypto();

        const cypher_destination_id = myCrypto.encrypt(ID_destino);
        const cypher_destination_mobile_number = myCrypto.encrypt(movil_destino);
        const cypher_origin_mobile_number = myCrypto.encrypt(movil_origen);
        const cypher_twofactor_auth = myCrypto.encrypt(clave_compra);

        // body para anular compra
        // const body = {
        //     "merchant_identify": {
        //         "integratorId": "1",
        //         "merchantId": process.env.MERCHANT_ID!,
        //         "terminalId": "1"
        //     },
        //     "client_identify": {
        //         "ipaddress": "10.0.0.1",
        //         // "browser_agent": "Chrome 18.1.3",
        //         "mobile": {
        //             // "manufacturer": "Samsung",
        //             // "model": "S9",
        //             // "os_version": "Oreo 9.1",
        //             "location": {
        //                 // "lat": 37.422476,
        //                 // "lng": 122.08425
        //             }
        //         }
        //     },
        //     "transaction_c2p": {
        //         amount: 57.22,
        //         currency: "ves",
        //         destination_bank_id: "105",
        //         // cedula de la persona que paga cifrada
        //         destination_id: cypher_destination_id,
        //         // numero movil de la persona pagadora cifrado
        //         destination_mobile_number: cypher_destination_mobile_number,
        //         payment_reference: "87661321", // solo es requerido cuando cuando trx_type es anulacion
        //         // numero movil de la empresa que realiza el cobro
        //         origin_mobile_number: cypher_origin_mobile_number,
        //         trx_type: "anulacion",
        //         payment_method: "c2p",
        //         invoice_number: "87661321",
        //         // clave temporal del cliente (OTP) cifrada
        //         twofactor_auth: cypher_twofactor_auth,
        //     }
        // }

        // body para realizar cobro
        const body = {
            "merchant_identify": {
                "integratorId": "1",
                "merchantId": process.env.MERCHANT_ID!,
                "terminalId": "1"
            },
            "client_identify": {
                "ipaddress": "10.0.0.1",
                // "browser_agent": "Chrome 18.1.3",
                "mobile": {
                    // "manufacturer": "Samsung",
                    // "model": "S9",
                    // "os_version": "Oreo 9.1",
                    "location": {
                        // "lat": 37.422476,
                        // "lng": 122.08425
                    }
                }
            },
            "transaction_c2p": {
                amount: 57.22,
                currency: "ves",
                destination_bank_id: "105",
                // cedula de la persona que paga cifrada
                destination_id: cypher_destination_id,
                // numero movil de la persona pagadora cifrado
                destination_mobile_number: cypher_destination_mobile_number,
                // payment_reference: "", // solo es requerido cuando cuando trx_type es anulacion
                // numero movil de la empresa que realiza el cobro
                origin_mobile_number: cypher_origin_mobile_number,
                trx_type: "compra",
                payment_method: "c2p",
                invoice_number: "87661521",
                // invoice_number: "3564544",
                // clave temporal del cliente (OTP) cifrada
                twofactor_auth: cypher_twofactor_auth,
            }
        }

        let response = await fetch(process.env.ENDPOINT_C2P!, {
            method: 'POST',
            headers: {
                'accept': 'application/json',
                'Content-Type': 'application/json',
                "X-IBM-Client-Id": process.env.CLIENT_ID!,
            },
            body: JSON.stringify(body)
        })
            .then((r) => r.json())
            .catch((e) => e)

        return res.status(200).json({ error: false, message: 'Respuesta obtenida', payload: response })
    } catch (error: unknown) {

        axios.isAxiosError(error)
            ? console.log(error.response?.data)
            : console.log(error)

        return res.status(200).json({ error: true, message: 'BAD REQUEST!' });
    }

}
