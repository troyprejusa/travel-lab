import { useState } from 'react';
import {
  Box,
  IconButton,
  useBreakpointValue,
//   Stack,
//   Heading,
//   Text,
//   Container,
  Image
} from '@chakra-ui/react';
import { FiArrowLeft, FiArrowRight } from 'react-icons/fi';
import Slider from 'react-slick';
import DashboardDemo from '../assets/dashboard_demo.png';
import ItineraryDemo from '../assets/itinerary_demo.png';
import MessageDemo from '../assets/message_demo.png';
import PackingDemo from '../assets/packing_demo.png';
import PollDemo from '../assets/poll_demo.png';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

// Settings for the slider
const settings = {
  dots: true,
  arrows: false,
  fade: true,
  infinite: true,
  autoplay: true,
  speed: 500,
  autoplaySpeed: 5000,
  slidesToShow: 1,
  slidesToScroll: 1,
};

export default function FeatureGallery() {
  // As we have used custom buttons, we need a reference variable to
  // change the state
  const [slider, setSlider] = useState<Slider | null>(null);

  // These are the breakpoints which changes the position of the
  // buttons as the screen size changes
  const top = useBreakpointValue({ base: '90%', md: '50%' });
  const side = useBreakpointValue({ base: '30%', md: '40px' });

  // This list contains all the data for carousels
  const cards = [
    {
      title: 'Dashboard',
      text: "The project board is an exclusive resource for contract work. It's perfect for freelancers, agencies, and moonlighters.",
      image: DashboardDemo
    },
    {
      title: 'Itinerary',
      text: "The project board is an exclusive resource for contract work. It's perfect for freelancers, agencies, and moonlighters.",
      image: ItineraryDemo
    },
    {
      title: 'Polls',
      text: "The project board is an exclusive resource for contract work. It's perfect for freelancers, agencies, and moonlighters.",
      image: PollDemo
    },
    {
      title: 'Packing',
      text: "The project board is an exclusive resource for contract work. It's perfect for freelancers, agencies, and moonlighters.",
      image: PackingDemo
    },
    {
      title: 'Message Board',
      text: "The project board is an exclusive resource for contract work. It's perfect for freelancers, agencies, and moonlighters.",
      image: MessageDemo
    },
  ];

  return (
    <Box
      marginX={'auto'}
      marginY="4rem"
      position={'relative'}
    //   height={'600px'}
    //   width={'1000px'}
      maxHeight={'600px'}
      maxWidth={'1000px'}
      overflow={'hidden'}
      paddingX={'5rem'}
    >
      {/* Left Icon */}
      <IconButton
        aria-label="left-arrow"
        variant="ghost"
        position="absolute"
        left={side}
        top={top}
        transform={'translate(0%, -50%)'}
        zIndex={2}
        onClick={() => slider?.slickPrev()}
      >
        <FiArrowLeft size="40px" />
      </IconButton>
      {/* Right Icon */}
      <IconButton
        aria-label="right-arrow"
        variant="ghost"
        position="absolute"
        right={side}
        top={top}
        transform={'translate(0%, -50%)'}
        zIndex={2}
        onClick={() => slider?.slickNext()}
      >
        <FiArrowRight size="40px" />
      </IconButton>
      {/* Slider */}
      <Slider {...settings} ref={(slider) => setSlider(slider)}>
        {cards.map((card, index) => (
            <Image key={`image_${index}`} src={card.image}/>
        //   <Box
        //     key={`card_${index}`}
        //     width='900px'
        //     height={'600px'}
        //     position="relative"
        //     // backgroundPosition="center"
        //     // backgroundRepeat="no-repeat"
        //     // backgroundSize="cover"
        //     backgroundImage={card.image}
        //   >
        //     <Container size="container.lg" height="600px" position="relative">
        //       <Stack
        //         spacing={6}
        //         w={'full'}
        //         maxW={'lg'}
        //         position="absolute"
        //         top="50%"
        //         transform="translate(0, -50%)"
        //       >
        //         <Heading fontSize={{ base: '3xl', md: '4xl', lg: '5xl' }}>
        //           {card.title}
        //         </Heading>
        //         <Text fontSize={{ base: 'md', lg: 'lg' }} color="GrayText">
        //           {card.text}
        //         </Text>
        //       </Stack>
        //     </Container>
        //   </Box>
        ))}
      </Slider>
    </Box>
  );
}
