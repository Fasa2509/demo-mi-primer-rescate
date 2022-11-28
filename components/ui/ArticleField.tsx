import { FC } from "react";
import { Box } from "@mui/material";

import { MyImage } from "../cards";
import { SliderImages } from "../slider";
import { Countdown } from "./Countdown";
import { getParagraphs } from "../../utils";
import { ImageObj, Field } from "../../interfaces";
import styles from "./Article.module.css";

interface Props {
    field: Field;
    selector: string;
}

export const ArticleField: FC<Props> = ({ field, selector }) => {

    if ( field.type === 'link' ) {
        return (
            <a href={ field.content } className={ styles.link } target='_blank' rel='noreferrer'>{ field.content_ }</a>
        )
    }

    if ( field.type === 'contador' ) {
        return (
            <Countdown end={ field.content } selector={ selector } />
        )
    }

    if ( field.type === 'imagen' ) {
            return (
                <div className={ styles.image__container }>
                    {
                        ( field.images?.length === 1 )
                            ? (
                                <Box sx={{ position: 'relative' }}>
                                    <MyImage src={ field.images[0].url } alt={ field.images[0].alt } width={ field.images[0].width } height={ field.images[0].height } />
                                </Box>
                            ) : (
                                <SliderImages images={ field.images as ImageObj[] } options={{ autoPlay: false }} />
                            )
                    }
                </div>
            )
    }

    if ( field.type === 'texto' ) {
        return (
            <>
                { getParagraphs(field.content).map(( p, index ) => <p key={ index }>{ p }</p>) }
            </>
        )
    }

    return (
        <p className={ styles.subtitle }>{ field.content }</p>
    )
}