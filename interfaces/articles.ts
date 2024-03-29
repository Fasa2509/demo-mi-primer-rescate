export interface IIndexSection {
    _id: string;
    sections: IIndexImage[];
}

export interface IIndexImage {
    _id: string;
    url: string;
    alt: string;
    content?: string;
    link?: string;
    linkText?: string;
    bgcolor?: string;
}

export interface IArticle {
    _id: string;
    title: string;
    fields: Field[];
    createdAt: number;
}

export type Field = {
    type: FieldType;
    content: string;
    content_: string;
    images: ImageObj[];
};

export interface ImageObj {
    url: string;
    alt: string;
    width: number;
    height: number;
};

export type FieldType = 'texto' | 'link' | 'subtitulo' | 'imagen' | 'contador';