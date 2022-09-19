import { FC } from "react";
import Image from "next/image";
import { ImageObj } from "../../interfaces";
import Carousel from "react-material-ui-carousel";

interface Props {
    images: ImageObj[];
    options?: {
      indicators?: boolean;
      cycleNavigation?: boolean;
      animation?: 'fade' | 'slide';
      navButtonsAlwaysVisible?: boolean;
      autoPlay?: boolean;
    };
    layout?: 'intrinsic' | 'responsive';
}
//  display: 'block', width: '100%', height: '100%',
export const SliderImages: FC<Props> = ({ images, options, layout = 'intrinsic' }) => {

  return (
    <div>
      <Carousel indicators={ options ? options.indicators : true } animation={ options ? options.animation || 'fade' : 'fade' } navButtonsAlwaysVisible={ options ? options.navButtonsAlwaysVisible : false } autoPlay={ options ? options.autoPlay : true }>
        {
          images.map((fadeImage, index) => (
            <div style={{ justifyContent: 'center', alignItems: 'center' }} key={index}>
              <Image src={ fadeImage.url } alt={ fadeImage.alt } width={ fadeImage.width } height={ fadeImage.height } layout={ layout } />
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