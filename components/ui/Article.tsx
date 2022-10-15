import { FC } from "react";
import { useSession } from "next-auth/react";
import { Box, Button, Typography } from "@mui/material";
import { useSnackbar } from "notistack";

import { dbArticles } from "../../database";
import { mprRevalidatePage } from '../../api';
import { ArticleField } from "./ArticleField";
import { ConfirmNotificationButtons, getDistanceToNow } from "../../utils";
import { IArticle } from "../../interfaces";
import styles from './Article.module.css'

export const Article: FC<{ article: IArticle; removable?: boolean; }> = ({ article, removable }) => {

  const { data } = useSession();
  const session: any = data;
  const { title, fields, createdAt } = article;
  const { enqueueSnackbar } = useSnackbar();

  const deleteArticle = async () => {
    if ( !article._id ) return enqueueSnackbar('No hay id del artículo', { variant: 'warning' });

    new Promise(( resolve, reject ) => {
      let key = enqueueSnackbar('¿Segur@ que quieres eliminar este artículo?', {
          variant: 'warning',
          autoHideDuration: 15000,
          action: ConfirmNotificationButtons,
      })

      let timer = setTimeout(() => reject(callback), 15000);

      const callback = ( e: any ) => {
          if ( e.target.matches(`.accept.n${ key.toString().replace('.', '') } *`) ) {
              resolve({
                  accepted: true,
                  callback,
                  timer,
              })
          }

          if ( e.target.matches(`.deny.n${ key.toString().replace('.', '') } *`) ) {
              resolve({
                  accepted: false,
                  callback,
                  timer,
              })
          }
      }

      document.addEventListener('click', callback);
    })
    // @ts-ignore
    .then(async ({ accepted, callback, timer }: { accepted: boolean, callback: any, timer: any }) => {
        document.removeEventListener('click', callback);
        clearTimeout( timer );

        if ( !accepted ) return;

        const res = await dbArticles.removeArticle( article._id );
        console.log( res );
        enqueueSnackbar(res.message || 'Error', { variant: !res.error ? 'info' : 'error' });
        
        if ( !res.error ) {
          if ( process.env.NODE_ENV === 'production' ) {
            const revRes = await mprRevalidatePage('/');
            
            enqueueSnackbar(revRes.message || 'Error', { variant: !revRes.error ? 'info' : 'error' });
          };
        }

        return;
    })
    .catch(({ callback }: { callback: any }) => {
        document.removeEventListener('click', callback);
    })
  }

  return (
    <section className={ styles.article } id={ 'article-' + createdAt }>

        <Box display='flex' justifyContent='space-between'>
          <Typography className={ styles.title }>{ title }</Typography>
          { session && (session.user!.role === 'admin' || session.user!.role === 'superuser') && removable && <Button color='error' onClick={ deleteArticle }>Eliminar</Button> }
        </Box>
        
        {
          ( fields && fields.length > 0 ) && fields.map(( field, index ) => <ArticleField key={ index } field={ field } selector={ 'article-' + createdAt } />)
        }

        <span className={ styles.date }>{ getDistanceToNow( createdAt ) }</span>

    </section>
  )
}