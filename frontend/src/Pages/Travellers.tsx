import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../redux/Store';
import { UserModel } from '../utilities/Interfaces';
import ContactCard from '../Components/ContactCard';
import { Wrap } from '@chakra-ui/react';
import NewTravellerModal from '../Components/NewTravellerModal';
import TitleBar from '../Components/TitleBar';
import TitleBarOverlay from '../Components/TitleBarOverlay';

function Travellers(): JSX.Element {
  const travellers: Array<UserModel> = useSelector(
    (state: RootState) => state.travellers
  );

  return (
    <>
      <TitleBarOverlay>
        <NewTravellerModal />
      </TitleBarOverlay>
      <TitleBar text="Contact Info" />
      <Wrap spacing={'6'}>
        {travellers
          .filter((traveller: UserModel) => traveller.confirmed)
          .map((traveller: UserModel, i: number) => (
            <ContactCard key={i} userData={traveller} />
          ))}
      </Wrap>
    </>
  );
}

export default Travellers;
