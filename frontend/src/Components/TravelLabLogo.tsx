import Logo from '../assets/travel_lab_logo.png';
import { Image, ImageProps } from '@chakra-ui/react';

interface TravelLabLogoProps extends ImageProps {}

function TravelLabLogo(props: TravelLabLogoProps) {
  return (
  <Image src={Logo} {...props}/>
  );
}

export default TravelLabLogo;
