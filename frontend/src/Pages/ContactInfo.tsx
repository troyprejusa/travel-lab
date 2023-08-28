import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../redux/Store';
import { UserModel } from '../utilities/Interfaces';
import ContactCard from '../Components/ContactCard';
import { Wrap, Flex } from '@chakra-ui/react';


function ContactInfo(): JSX.Element {

    const travellers: Array<UserModel> = useSelector((state: RootState) => state.travellers);

    return (
        <>
            <Flex justifyContent={'center'}>
                <h1>Contact Info</h1>
            </Flex>
            <Wrap spacing={'5%'}>
                {travellers.map((user: UserModel, i: number) => <ContactCard key={i} userData={user}/>)}
            </Wrap>
        </>
    )
}

export default ContactInfo;