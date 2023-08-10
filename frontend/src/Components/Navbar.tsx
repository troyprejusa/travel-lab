import React, { ReactNode, SyntheticEvent } from 'react';
import { IconType } from 'react-icons';
import { ReactText } from 'react';
import { Link as RRDLink, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { reduxUserLogout } from '../redux/UserSlice';
import { reduxResetTrip } from '../redux/TripSlice';

import {
  IconButton,
  Avatar,
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
  FiNavigation,
  FiUsers,
  FiThumbsUp,
  FiCompass
} from 'react-icons/fi';
import { useDispatch } from 'react-redux';
import { RootState } from '../redux/Store';
import { UserModel } from '../Models/Interfaces';
import { msgSocket, pollSocket } from '../utilities/TripSocket';
import { reduxResetMessages } from '../redux/MessageSlice';


interface LinkItemProps {
  name: string;
  icon: IconType;
  path: string;
}

const LinkItems: Array<LinkItemProps> = [
  { name: 'Home', icon: FiHome , path: 'home'},
  { name: 'Itinerary', icon: FiCalendar, path: 'itinerary' },
  { name: 'Transportation', icon: FiNavigation, path: 'transportation' },
  { name: 'Message Board', icon: FiMessageSquare, path: 'message' },
  { name: 'Poll', icon: FiThumbsUp, path: 'poll' },
  { name: 'Packing', icon: FiBriefcase, path: 'packing' },
  { name: 'Contact Info', icon: FiUsers, path: 'contactinfo' },
  { name: 'Recommendations', icon: FiCompass, path: 'recommendations' },
  { name: 'Trip Settings', icon: FiSettings, path: 'settings' }
];

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
                <Avatar
                  size={'sm'}
                  src={
                    'https://images.unsplash.com/photo-1619946794135-5bc917a27793?ixlib=rb-0.3.5&q=80&fm=jpg&crop=faces&fit=crop&h=200&w=200&s=b616b2c5b373a80ffc9636ba24f7a4a9'
                  }
                />
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
              <MenuItem>Profile</MenuItem>
              {/* <MenuItem>Settings</MenuItem> */}
              <MenuItem>Billing</MenuItem>
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
      dispatch(reduxResetTrip(null));
      dispatch(reduxUserLogout(null));
      navigate('/');
  }

};
