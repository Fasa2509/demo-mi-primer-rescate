import { FC } from "react";
import Image from "next/image";
import { Fade } from "react-slideshow-image";
import { ImageObj } from "../../interfaces";
import { Button, Paper } from "@mui/material";
import Carousel from "react-material-ui-carousel";

interface Props {
    fadeImages: ImageObj[];
}

export const SliderImages: FC<Props> = ({ fadeImages }) => {
  return (
    <div className="slide-container">
      <Carousel>
        {
          fadeImages.map((fadeImage, index) => (
            <div style={{ height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }} className="each-fade" key={index}>
              <div className="image-container">
                <Image src={ fadeImage.url } alt={ fadeImage.alt } width={ fadeImage.width } height={ fadeImage.height } />
              </div>
            </div>
        ))}
      </Carousel>
    </div>
  )
}

























// export const SliderImages: FC<Props> = ({ fadeImages }) => {
//   return (
//     <div className="slide-container">
//     <Fade>
//       {fadeImages.map((fadeImage, index) => (
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