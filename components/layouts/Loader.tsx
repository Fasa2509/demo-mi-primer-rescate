import styles from './Loader.module.css';

export const Loader = () => {
  return (
    <div className={ styles.loader }>
        <div className={ `${ styles.print } ${styles.print__3}` }></div>
        <div className={ `${ styles.print } ${styles.print__2}` }></div>
        <div className={ `${ styles.print } ${styles.print__1}` }></div>
    </div>
  )
}
