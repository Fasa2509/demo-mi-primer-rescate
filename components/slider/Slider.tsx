import { FC, useEffect, useState } from "react"
import styles from './Slider.module.css'

interface Props {
  children: JSX.Element | JSX.Element[];
  style?: any;
}

export const Slider: FC<Props> = ({ children, style }) => {
  
  const [active, setActive] = useState( 0 );
  const [childs, setChilds] = useState([]);

  useEffect(() => {
    let elements = document.querySelectorAll('.slider__element')
    setChilds(elements as any)
  }, [])

  const handleChangeActive = ( change: number ) => {
    
    if ( change < 0 && active === 0 ) return;
    if ( change > 0 && active === childs.length - 1 ) return;

    // if ( childs[active] ?? true ) return

    childs[active].classList.remove('is-active')
    childs[active+change].classList.add('is-active')

    setActive( active + change )
  }

  return (
    <section style={ style } className={ styles.container }>

        { children }

        <div className={ styles.button__container }>
            <button className={ styles.button } onClick={ () => handleChangeActive(-1) }></button>
            <button className={ styles.button } onClick={ () => handleChangeActive(1) }></button>
        </div>

    </section>
  )
}
