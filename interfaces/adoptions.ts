export interface IAdoption {
    _id: string;
    particular1: string;
    particular2: string;
    user: string;
    contact: IContactAdoption;
    input1: string;
    input2: string;
    input3: boolean;
    input4: string;
    input5: string;
    input6: boolean;
    input7: boolean;
    input8: string;
    input9: string;
    input10: boolean;
    input11: string;
    input12: boolean;
    input13: string;
    input14: boolean;
    input15: string;
    input16: string;
    input17: string;
    input18: string;
    input19: number;
    input20: number;
    input21: boolean;
    input22: string;
    input23: string;
    cachorro: boolean;
    input24: string;
    input25: string;
    input26: boolean;
    input27: boolean;
    input28: string;
    checked: boolean;
    createdAt: number;
}

export interface IContactAdoption {
    facebook?: string;
    instagram?: string;
    whatsapp?: string;
}