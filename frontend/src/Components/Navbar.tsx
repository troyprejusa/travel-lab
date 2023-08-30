import React, { ReactNode, SyntheticEvent } from 'react';
import { IconType } from 'react-icons';
import { ReactText } from 'react';
import { Link as RRDLink, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { reduxUserLogout } from '../redux/UserSlice';
import { reduxResetTrip } from '../redux/TripSlice';

import {
  IconButton,
  Box,
  CloseButton,
  Flex,
  HStack,
  VStack,
  Icon,
  useColorModeValue,
  Link,
  Drawer,
  DrawerContent,
  Text,
  useDisclosure,
  BoxProps,
  FlexProps,
  Menu,
  MenuButton,
  MenuDivider,
  MenuItem,
  MenuList,
} from '@chakra-ui/react';

import {
  FiHome,
  FiSettings,
  FiCalendar,
  FiBriefcase,
  FiMessageSquare,
  FiMenu,
  FiBell,
  FiChevronDown,
  FiUsers,
  FiThumbsUp,
} from 'react-icons/fi';
import { useDispatch } from 'react-redux';
import { RootState } from '../redux/Store';
import { UserModel } from '../utilities/Interfaces';
import { msgSocket, pollSocket } from '../utilities/TripSocket';
import { reduxResetMessages } from '../redux/MessageSlice';
import { AvatarWrapper } from './AvatarWrapper';
import { reduxResetPolls } from '../redux/PollSlice';


interface LinkItemProps {
  name: string;
  icon: IconType;
  path: string;
}

const LinkItems: Array<LinkItemProps> = [
  { name: 'Home', icon: FiHome , path: 'home'},
  { name: 'Itinerary', icon: FiCalendar, path: 'itinerary' },
  { name: 'Message Board', icon: FiMessageSquare, path: 'message' },
  { name: 'Poll', icon: FiThumbsUp, path: 'poll' },
  { name: 'Packing', icon: FiBriefcase, path: 'packing' },
  { name: 'Travellers', icon: FiUsers, path: 'travellers' },
  { name: 'Trip Settings', icon: FiSettings, path: 'settings' }
];
// { name: 'Recommendations', icon: FiCompass, path: 'recommendations' },
// { name: 'Transportation', icon: FiNavigation, path: 'transportation' },


export default function Navbar({children}: {children: ReactNode;}) {

  const { isOpen, onOpen, onClose } = useDisclosure();
  
  return (
    <Box minH="100vh" bg={useColorModeValue('gray.100', 'gray.900')}>
      <SidebarContent
        onClose={() => onClose}
        display={{ base: 'none', md: 'block' }}
      />
      <Drawer
        autoFocus={false}
        isOpen={isOpen}
        placement="left"
        onClose={onClose}
        returnFocusOnClose={false}
        onOverlayClick={onClose}
        size="full">
        <DrawerContent>
          <SidebarContent onClose={onClose} />
        </DrawerContent>
      </Drawer>
      {/* mobilenav */}
      <MobileNav onOpen={onOpen} />
      <Box ml={{ base: 0, md: 60 }} p="4">
        {children}
      </Box>
    </Box>
  );
}

interface SidebarProps extends BoxProps {
  onClose: () => void;
}

const SidebarContent = ({ onClose, ...rest }: SidebarProps) => {

  const navigate = useNavigate();
  const user: UserModel = useSelector((state: RootState) => state.user)


  return (
    <Box
      transition="3s ease"
      bg={useColorModeValue('white', 'gray.900')}
      borderRight="1px"
      borderRightColor={useColorModeValue('gray.200', 'gray.700')}
      w={{ base: 'full', md: 60 }}
      pos="fixed"
      h="full"
      {...rest}>
      <Flex h="20" alignItems="center" mx="8" justifyContent="space-between">
        <Text fontSize="2xl" fontFamily="monospace" fontWeight="bold" cursor="pointer" onClick={handleChooseTrip}>
          Travel | Lab
        </Text>
        <CloseButton display={{ base: 'flex', md: 'none' }} onClick={onClose} />
      </Flex>
      {LinkItems.map((link) => (
        <NavItem key={link.name} icon={link.icon} path={link.path}>
          {link.name}
        </NavItem>
      ))}
    </Box>
  );

  function handleChooseTrip(event: SyntheticEvent) {
    const nextURL: string = `/user/${user.email}/trips`;
    navigate(nextURL);
  }
};

interface NavItemProps extends FlexProps {
  icon: IconType;
  path: string;
  children: ReactText;
}
const NavItem = ({ icon, path, children, ...rest }: NavItemProps) => {
  return (
    <Link as={RRDLink} to={path} style={{ textDecoration: 'none' }} _focus={{ boxShadow: 'none' }}>
      <Flex
        align="center"
        p="4"
        mx="4"
        borderRadius="lg"
        role="group"
        cursor="pointer"
        _hover={{
          bg: 'cyan.400',
          color: 'white',
        }}
        {...rest}>
        {icon && (
          <Icon
            mr="4"
            fontSize="16"
            _groupHover={{
              color: 'white',
            }}
            as={icon}
          />
        )}
        {children}
      </Flex>
    </Link>
  );
};

interface MobileProps extends FlexProps {
  onOpen: () => void;
}
const MobileNav = ({ onOpen, ...rest }: MobileProps) => {

  const navigate = useNavigate();
  const user: UserModel = useSelector((state: RootState) => state.user)
  const dispatch = useDispatch();

  return (
    <Flex
      ml={{ base: 0, md: 60 }}
      px={{ base: 4, md: 4 }}
      height="20"
      alignItems="center"
      bg={useColorModeValue('white', 'gray.900')}
      borderBottomWidth="1px"
      borderBottomColor={useColorModeValue('gray.200', 'gray.700')}
      justifyContent={{ base: 'space-between', md: 'flex-end' }}
      {...rest}>
      <IconButton
        display={{ base: 'flex', md: 'none' }}
        onClick={onOpen}
        variant="outline"
        aria-label="open menu"
        icon={<FiMenu />}
      />

      <Text
        display={{ base: 'flex', md: 'none' }}
        fontSize="2xl"
        fontFamily="monospace"
        fontWeight="bold">
        Travel | Lab
      </Text>

      <HStack spacing={{ base: '0', md: '6' }}>
        <IconButton
          size="lg"
          variant="ghost"
          aria-label="open menu"
          icon={<FiBell />}
        />
        <Flex alignItems={'center'}>
          <Menu>
            <MenuButton
              py={2}
              transition="all 0.3s"
              _focus={{ boxShadow: 'none' }}>
              <HStack>
                <AvatarWrapper userData={user} size={'sm'}/>
                <VStack
                  display={{ base: 'none', md: 'flex' }}
                  alignItems="flex-start"
                  spacing="1px"
                  ml="2">
                  <Text fontSize="sm">{`${user.first_name} ${user.last_name}`}</Text>
                  {/* <Text fontSize="xs" color="gray.600">
                    Admin
                  </Text> */}
                </VStack>
                <Box display={{ base: 'none', md: 'flex' }}>
                  <FiChevronDown />
                </Box>
              </HStack>
            </MenuButton>
            <MenuList
              bg={useColorModeValue('white', 'gray.900')}
              borderColor={useColorModeValue('gray.200', 'gray.700')}>
              <MenuItem onClick={(event: SyntheticEvent) => navigate(`/user/${user.email}/settings`)}>Profile</MenuItem>
              {/* <MenuItem>Billing</MenuItem> */}
              <MenuDivider />
              <MenuItem onClick={handleSignOut}>Sign out</MenuItem>
            </MenuList>
          </Menu>
        </Flex>
      </HStack>
    </Flex>
  );

  function handleSignOut(e: SyntheticEvent) {
      localStorage.removeItem('token');
      msgSocket.disconnectSocket();
      pollSocket.disconnectSocket();
      dispatch(reduxResetMessages(null));
      dispatch(reduxResetPolls(null))
      dispatch(reduxResetTrip(null));
      dispatch(reduxUserLogout(null));
      navigate('/');
  }

};
