import React, {useState, useEffect} from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../redux/Store';
import { UserModel } from '../Models/Interfaces';
import { Root } from 'react-dom/client';
interface ContactInfoProps {

};

function ContactInfo(): JSX.Element {

    const [] = useState([]);
    

    const user: UserModel = useSelector((state: RootState) => state.user);

    return (
        <h1>ContactInfo</h1>
    )
}

export default ContactInfo;