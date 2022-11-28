import { FC } from "react";
import Carousel from "react-material-ui-carousel"

interface Props {
    children: JSX.Element[];
}

export const SliderHero: FC<Props> = ({ children }) => {
  return (
    <section id='hero-welcome' style={{ width: '100%' }}>
        <Carousel indicators={ false } autoPlay duration={ 650 } interval={ 10000 }>
            { children }
        </Carousel>
    </section>
  )
}
