import { FC } from "react";
import { getParagraphs } from '../../utils';
import styles from './Form.module.css'

interface Props {
    article: {
        title: string;
        content: string;
        createdAt: number;
    }
}

export const Article: FC<Props> = ({ article }) => {
  return (
    <section className={ styles.article }>
        <p className={ styles.subtitle }>{ article.title }</p>
        {
            getParagraphs( article.content ).map(( content, i ) => <p key={ i }>{ content }</p>)
        }
        <span>{ new Date( article.createdAt ).toLocaleDateString() }</span>
    </section>
  )
}
