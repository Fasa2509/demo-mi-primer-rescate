import { FC, useContext } from "react";
import { Box, Button } from "@mui/material";
import { useSnackbar } from "notistack";

import { ScrollContext } from "../../context";
import { dbArticles, dbImages } from "../../database";
import { mprRevalidatePage } from '../../mprApi';
import { ArticleField } from "./ArticleField";
import { ConfirmNotificationButtons, getDistanceToNow, getImageKeyFromUrl, PromiseConfirmHelper } from "../../utils";
import { IArticle } from "../../interfaces";
import styles from './Article.module.css'

export const Article: FC<{ article: IArticle; removable?: boolean; }> = ({ article, removable }) => {

  const { setIsLoading } = useContext( ScrollContext );
  const { title, fields, createdAt } = article;
  const { enqueueSnackbar } = useSnackbar();

  const deleteArticle = async () => {
    if ( !article._id ) return enqueueSnackbar('No hay id del artículo', { variant: 'warning' });

    let key = enqueueSnackbar('¿Segur@ que quieres eliminar este artículo?', {
        variant: 'warning',
        autoHideDuration: 15000,
        action: ConfirmNotificationButtons,
    });

    const confirm = await PromiseConfirmHelper( key, 15000 );

    if ( !confirm ) return;
    
    setIsLoading( true );

    const imgKeys = article.fields
      .filter(( f ) => f.type === 'imagen')
      .map(( field ) => field.images.filter(( img ) => /amazonaws/.test( img.url )).map(( f ) => getImageKeyFromUrl( f.url )))
      .flat();

    await Promise.all(imgKeys.map(( key ) => dbImages.deleteImageFromS3( key )));

    const res = await dbArticles.removeArticle( article._id );
    
    enqueueSnackbar(res.message || 'Error', { variant: !res.error ? 'info' : 'error' });
    
    if ( !res.error ) {
      if ( process.env.NODE_ENV === 'production' ) {
        const revRes = await mprRevalidatePage('/');
        
        enqueueSnackbar(revRes.message || 'Error', { variant: !revRes.error ? 'info' : 'error' });
      };
    }

    setIsLoading( false );
    return;
  }

  return (
    <section className={ styles.article } id={ 'article-' + createdAt }>

        <Box display='flex' justifyContent='space-between'>
          <p className={ styles.title }>{ title }</p>
          { removable && <Button className='button button--error low--padding button--round low--font--size' sx={{ alignSelf: 'center' }} onClick={ deleteArticle }>Eliminar</Button> }
        </Box>
        
        {
          ( fields && fields.length > 0 ) && fields.map(( field, index ) => <ArticleField key={ index } field={ field } selector={ 'article-' + createdAt } />)
        }

        <span className={ styles.date }>{ getDistanceToNow( createdAt ) }</span>

    </section>
  )
}