export interface IArticle {
    title: string;
    fields: Field[];
    createdAt: number;
}

export type Field = {
    type: FieldType;
    content: string;
    content_?: string;
    images?: ImageObj[];
    width?: number;
    height?: number;
};

export interface ImageObj {
    url: string;
    alt: string;
    width: number;
    height: number;
};

type FieldType = 'texto' | 'link' | 'subtitulo' | 'imagen' | 'contador';