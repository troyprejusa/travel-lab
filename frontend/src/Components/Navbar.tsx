import { ReactNode } from 'react';
import { IconType } from 'react-icons';
import { Link as RRDLink, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import {
  resetAfterLeavingTrip,
  signOutAfterTripSelect,
} from '../utilities/stateHandlers';
import { useDispatch } from 'react-redux';
import { RootState } from '../redux/Store';
import { TripModel, UserModel } from '../utilities/Interfaces';
import { AvatarWrapper } from './AvatarWrapper';
import { useAuth0 } from '@auth0/auth0-react';
import { RefreshButton } from './Buttons';
import Constants from '../utilities/Constants';
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
  Tooltip,
} from '@chakra-ui/react';

import {
  FiHome,
  FiSettings,
  FiCalendar,
  FiBriefcase,
  FiMessageSquare,
  FiMenu,
  FiChevronDown,
  FiUsers,
  FiThumbsUp,
} from 'react-icons/fi';

interface LinkItemProps {
  name: string;
  icon: IconType;
  path: string;
}

const LinkItems: Array<LinkItemProps> = [
  { name: 'Home', icon: FiHome, path: 'home' },
  { name: 'Itinerary', icon: FiCalendar, path: 'itinerary' },
  { name: 'Poll', icon: FiThumbsUp, path: 'poll' },
  { name: 'Packing', icon: FiBriefcase, path: 'packing' },
  { name: 'Message Board', icon: FiMessageSquare, path: 'message' },
  { name: 'Travellers', icon: FiUsers, path: 'travellers' },
  { name: 'Trip Settings', icon: FiSettings, path: 'settings' },
];

export default function Navbar({ children }: { children: ReactNode }) {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <Box minH="100vh" background={Constants.BACKROUND_GRADIENT}>
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
        size="full"
      >
        <DrawerContent>
          <SidebarContent onClose={onClose} />
        </DrawerContent>
      </Drawer>
      <MobileNav onOpen={onOpen} />
      <Box ml={{ base: 0, md: Constants.NAVBAR_LEFT_PANE_WIDTH }}>
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
  const user: UserModel = useSelector((state: RootState) => state.user);
  const dispatch = useDispatch();

  return (
    <Box
      transition="3s ease"
      bg={useColorModeValue('white', 'gray.900')}
      borderRight="1px"
      borderRightColor={useColorModeValue('gray.200', 'gray.700')}
      w={{ base: 'full', md: Constants.NAVBAR_LEFT_PANE_WIDTH }}
      pos="fixed"
      h="full"
      {...rest}
    >
      <Flex h="20" alignItems="center" mx="8" justifyContent="space-between">
        <Tooltip label="select trip">
          <Text
            fontSize="2xl"
            fontFamily="monospace"
            fontWeight="bold"
            cursor="pointer"
            userSelect={'none'}
            onClick={() => handleReturnToTrips()}
            width={'max-content'}
          >
            Travel | Lab
          </Text>
        </Tooltip>
        <CloseButton display={{ base: 'flex', md: 'none' }} onClick={onClose} />
      </Flex>
      {LinkItems.map((link) => (
        <NavItem
          key={link.name}
          icon={link.icon}
          path={link.path}
          onClick={onClose}
        >
          {link.name}
        </NavItem>
      ))}
    </Box>
  );

  function handleReturnToTrips() {
    resetAfterLeavingTrip(dispatch);
    navigate(`/user/${user.email}/trips`);
  }
};

interface NavItemProps extends FlexProps {
  icon: IconType;
  path: string;
  children: ReactNode;
}
const NavItem = ({ icon, path, children, ...rest }: NavItemProps) => {
  return (
    <Link
      as={RRDLink}
      to={path}
      style={{ textDecoration: 'none' }}
      _focus={{ boxShadow: 'none' }}
    >
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
        {...rest}
      >
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
  const user: UserModel = useSelector((state: RootState) => state.user);
  const trip: TripModel = useSelector((state: RootState) => state.trip);
  const dispatch = useDispatch();
  const { logout } = useAuth0();

  return (
    <Flex
      ml={{ base: 0, md: Constants.NAVBAR_LEFT_PANE_WIDTH }}
      px={{ base: 4, md: 4 }}
      height={Constants.NAVBAR_TOP_PANE_HEIGHT}
      alignItems="center"
      bg={useColorModeValue('white', 'gray.900')}
      borderBottomWidth="1px"
      borderBottomColor={useColorModeValue('gray.200', 'gray.700')}
      justifyContent={{ base: 'space-between', md: 'flex-end' }}
      {...rest}
    >
      <IconButton
        display={{ base: 'flex', md: 'none' }}
        onClick={onOpen}
        variant="outline"
        aria-label="open menu"
        icon={<FiMenu />}
      />
      <Tooltip label="select trip">
        <Text
          display={{ base: 'flex', md: 'none' }}
          fontSize="2xl"
          fontFamily="monospace"
          fontWeight="bold"
          cursor={'pointer'}
          userSelect={'none'}
          onClick={() => handleReturnToTrips()}
          width={'max-content'}
        >
          Travel | Lab
        </Text>
      </Tooltip>

      <HStack spacing={{ base: '4', md: '6' }}>
        <RefreshButton
          trip_id={trip.id}
          dispatch={dispatch}
          aria-label="refresh content"
        />
        <Flex alignItems={'center'}>
          <Menu>
            <MenuButton
              py={2}
              transition="all 0.3s"
              _focus={{ boxShadow: 'none' }}
            >
              <HStack>
                <AvatarWrapper userData={user} size={'sm'} />
                <VStack
                  display={{ base: 'none', md: 'flex' }}
                  alignItems="flex-start"
                  spacing="1px"
                  ml="2"
                >
                  <Text fontSize="sm">{`${user.first_name} ${user.last_name}`}</Text>
                </VStack>
                <Box display={{ base: 'none', md: 'flex' }}>
                  <FiChevronDown />
                </Box>
              </HStack>
            </MenuButton>
            <MenuList
              bg={useColorModeValue('white', 'gray.900')}
              borderColor={useColorModeValue('gray.200', 'gray.700')}
            >
              <MenuItem
                onClick={() => navigate(`/user/${user.email}/settings`)}
              >
                Profile
              </MenuItem>
              {/* <MenuItem>Billing</MenuItem> */}
              <MenuDivider />
              <MenuItem onClick={handleSignOut}>Sign out</MenuItem>
            </MenuList>
          </Menu>
        </Flex>
      </HStack>
    </Flex>
  );

  function handleReturnToTrips() {
    resetAfterLeavingTrip(dispatch);
    navigate(`/user/${user.email}/trips`);
  }

  function handleSignOut() {
    signOutAfterTripSelect(dispatch);
    logout({
      logoutParams: {
        returnTo: window.location.origin,
      },
    });
  }
};
