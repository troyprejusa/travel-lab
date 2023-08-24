import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { TripModel, UserModel } from '../utilities/Interfaces';
import { FiTrash } from 'react-icons/fi';
import NewItemModal from '../Components/NewItemModal';
import fetchHelpers from '../utilities/fetchHelpers';
import { PackingModel } from '../utilities/Interfaces';
import { RootState } from '../redux/Store';
import {
    Flex,
    Table,
    Thead,
    Tbody,
    Tfoot,
    Tr,
    Th,
    Td,
    TableContainer,
    Button,
    IconButton,
    ButtonGroup,
} from '@chakra-ui/react'
import { FiUserCheck, FiUserX } from 'react-icons/fi';


function Packing(): JSX.Element {

    const initialPackingState: Array<PackingModel> = [];
    const [packingList, setPackingList] = useState(initialPackingState)

    useEffect(getItems, [])

    const user: UserModel = useSelector((state: RootState) => state.user);
    const trip: TripModel = useSelector((state: RootState) => state.trip);

    return (
        <>
        <Flex justifyContent={'center'}>
            <h1>Packing</h1>
        </Flex>
        <NewItemModal getItemsCallback={getItems}/>
        <TableContainer>
            <Table variant='striped' colorScheme='blackAlpha'>
                <Thead>
                    <Tr>
                        <Th>Item</Th>
                        <Th>Quantity</Th>
                        <Th>Description</Th>
                        <Th>Bringing</Th>
                        <Th>Actions</Th>
                    </Tr>
                </Thead>
                <Tbody>
                    {packingList.map((thing: PackingModel, i: number) => {
                        return (
                            <Tr key={i}>
                                <Td>{thing.item}</Td>
                                <Td>{thing.quantity}</Td>
                                <Td>{thing.description}</Td>
                                <Td>{thing.packed_by}</Td>
                                <Td>
                                    <ButtonGroup>
                                        {
                                            // 3 options here:
                                            // packed by no one 
                                            // packed by me 
                                            // packed by someone else
                                            (() => {
                                                if (!thing.packed_by) {
                                                    return (
                                                        <IconButton 
                                                            variant={'outline'} 
                                                            colorScheme='teal' 
                                                            aria-label='claim packing item' 
                                                            fontSize={'20px'} 
                                                            icon={<FiUserCheck />} 
                                                            onClick={(_) => handleClaimButtonClick(thing.id)}
                                                        />
                                                    );

                                                } else if (thing.packed_by === user.email) {
                                                    // THe current user is packing this
                                                    return (
                                                        <IconButton 
                                                            variant={'outline'} 
                                                            colorScheme='yellow' 
                                                            aria-label='unclaim packing item' 
                                                            fontSize={'20px'} 
                                                            icon={<FiUserX />} 
                                                            onClick={(_) => handleUnclaimButtonClick(thing.id)}
                                                        />
                                                    );

                                                } else {
                                                    // Someone else is packing this
                                                    return null;
                                                }
                                            })()
                                        }
                                        <IconButton
                                            variant='outline'
                                            colorScheme='red'
                                            aria-label='delete packing item'
                                            fontSize='20px'
                                            icon={<FiTrash />} 
                                            onClick={(_) => handleDeleteButtonClick(thing.id)}
                                        />
                                    </ButtonGroup>

                                </Td>
                            </Tr>
                        )
                    })}
                </Tbody>
            </Table>
      </TableContainer>
      </>
    )

    function getItems() {
        (async function() {
            try {
                const res: Response = await fetch(`/trip/${trip.id}/packing` , {
                    method: 'GET',
                    headers: fetchHelpers.getTokenHeader()
                })

                if (res.ok) {
                    const data: Array<PackingModel> = await res.json();
                    
                    // console.log(data);
                    setPackingList(data);
                    
                } else {
                    const message: any = await res.json();
                    throw new Error(JSON.stringify(message));
                }

            } catch (e: any) {
                console.error(e)
                alert('Unable to retrieve packing list :(')
            }
        })()
    }

    async function handleClaimButtonClick(item_id: number) {
        try {
            const res: Response = await fetch(`/trip/${trip.id}/packing/claim/${item_id}` , {
                method: 'PATCH',
                headers: fetchHelpers.getTokenHeader()
            })

            if (res.ok) {
                // Refresh table data
                getItems();

            } else {
                const message: any = await res.json();
                throw new Error(JSON.stringify(message));
            }

        } catch (e: any) {
            console.error(e)
            alert('Unable to claim packing item :(')
        }
    }

    async function handleUnclaimButtonClick(item_id: number) {
        try {
            const res: Response = await fetch(`/trip/${trip.id}/packing/unclaim/${item_id}` , {
                    method: 'PATCH',
                    headers: fetchHelpers.getTokenHeader()
            })

            if (res.ok) {
                // Refresh table data
                getItems();

            } else {
                const message: any = await res.json();
                throw new Error(JSON.stringify(message));
            }

        } catch (e: any) {
            console.error(e)
            alert('Unable to unclaim packing item :(')
        }
    }

    async function handleDeleteButtonClick(item_id: number) {
        try {
            const res: Response = await fetch(`/trip/${trip.id}/packing/${item_id}` , {
                method: 'DELETE',
                headers: fetchHelpers.getTokenHeader()
            })

            if (res.ok) {
                // Refresh table data
                getItems();

            } else {
                const message: any = await res.json();
                throw new Error(JSON.stringify(message));
            }

        } catch (e: any) {
            console.error(e)
            alert('Unable to delete packing item :(')
        }
    }

}

export default Packing;
