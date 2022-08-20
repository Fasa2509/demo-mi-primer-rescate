import { FC } from "react";

import { IArticle } from "../../interfaces";
import { ArticleField } from "./ArticleField";
import styles from './Article.module.css'
import { getDistanceToNow } from "../../utils";

let now = Date.now();

export const Article: FC<IArticle> = ({ title, fields, createdAt = now }) => {
  return (
    <section className={ styles.article } id={ 'article-' + title }>
        
        <p className={ styles.title }>{ title }</p>
        
        {
          ( fields && fields.length > 0 )
            ? fields.map((field, index) => <ArticleField key={ index } field={ field } selector={ 'article-' + title } />)
            : <></>
        }

        <span className={ styles.date }>{ getDistanceToNow( createdAt ) }</span>

    </section>
  )
}