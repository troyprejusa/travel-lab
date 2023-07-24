import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../redux/Store';
import { UserModel, TripModel } from '../Models/Interfaces';
import { Flex } from '@chakra-ui/react';

interface HomeProps {

};

function Home(): JSX.Element {
    console.log('HOME:')
    const trip: TripModel = useSelector(((state: RootState) => state.trip))

    return (
        <Flex justifyContent={'center'}>
            <h1>Home</h1>
        </Flex>
    )
}

export default Home;