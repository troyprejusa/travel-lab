import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../redux/Store';
import { UserModel } from '../utilities/Interfaces';
import ContactCard from '../Components/ContactCard';
import { Wrap, Flex, Text } from '@chakra-ui/react';
import NewTravellerModal from '../Components/NewTravellerModal';
import TitleBar from '../Components/TitleBar';


function Travellers(): JSX.Element {
  const travellers: Array<UserModel> = useSelector(
    (state: RootState) => state.travellers
  );

  return (
    <>
      <TitleBar text='Contact Info' />
      <NewTravellerModal />
      <Wrap spacing={'6'}>
        {travellers.map((user: UserModel, i: number) => (
          <ContactCard key={i} userData={user} />
        ))}
      </Wrap>
    </>
  );
}

export default Travellers;
