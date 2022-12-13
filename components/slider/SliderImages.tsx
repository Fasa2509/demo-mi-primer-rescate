import { FC } from "react";
import Carousel from "react-material-ui-carousel";

import { ImageObj } from "../../interfaces";
import { MyImage } from "../cards";

interface Props {
    images: ImageObj[];
    options?: {
      indicators?: boolean;
      cycleNavigation?: boolean;
      animation?: 'fade' | 'slide';
      navButtonsAlwaysVisible?: boolean;
      autoPlay?: boolean;
      fullHeightHover?: boolean;
      interval?: number;
      duration?: number;
    };
    layout?: 'intrinsic' | 'responsive';
}
//  display: 'block', width: '100%', height: '100%',
export const SliderImages: FC<Props> = ({ images, options, layout = 'intrinsic' }) => {

  return (
    <div>
      <Carousel indicators={ options ? options.indicators : true } animation={ options ? options.animation || 'fade' : 'fade' } navButtonsAlwaysVisible={ options ? options.navButtonsAlwaysVisible : false } autoPlay={ options ? options.autoPlay : true } fullHeightHover={ options ? options.fullHeightHover : false } interval={ options ? options.interval || 8000 : 8000 } duration={ options ? options.duration || 800 : 250 }>
        {
          images.map((fadeImage, index) => (
            <div style={{ display: layout !== 'responsive' ? 'flex' : 'block', justifyContent: 'center', alignItems: 'center' }} key={index}>
              <MyImage src={ fadeImage.url } alt={ fadeImage.alt } width={ fadeImage.width } height={ fadeImage.height } layout={ layout } />  
            </div>
        ))}
      </Carousel>
    </div>
  )
}

























// export const SliderImages: FC<Props> = ({ images }) => {
//   return (
//     <div className="slide-container">
//     <Fade>
//       {images.map((fadeImage, index) => (
//         <div style={{ height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }} className="each-fade" key={index}>
//           <div className="image-container">
//             <Image src={ fadeImage.url } alt={ fadeImage.alt } width={ fadeImage.width } height={ fadeImage.height } />
//           </div>
//         </div>
//       ))}
//     </Fade>
//   </div>
//   )
// }