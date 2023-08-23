import React from 'react';
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
    IconButton
} from '@chakra-ui/react'
import { FiTrash } from 'react-icons/fi';

const dummyItem = {
    a: 'ayye',
    b: 'you',
    c: 'guys',
    d: 'pls',
    e: 'work'
}
const dummyData = [{...dummyItem}, {...dummyItem}, {...dummyItem}]
function Packing(): JSX.Element {
    return (
        <>
        <Flex justifyContent={'center'}>
            <h1>Packing</h1>
        </Flex>
        <Button>Add item</Button>
        <TableContainer>
            <Table variant='striped' colorScheme='blackAlpha'>
                <Thead>
                    <Tr>
                        <Th>Item</Th>
                        <Th>Quantity</Th>
                        <Th>Description</Th>
                        <Th>Designee</Th>
                        <Th>Actions</Th>
                    </Tr>
                </Thead>
                <Tbody>
                    {dummyData.map((datum, i) => {
                        return (
                            <Tr key={i}>
                                <Td>{datum.a}</Td>
                                <Td>{datum.b}</Td>
                                <Td>{datum.c}</Td>
                                <Td><Button>Claim</Button></Td>
                                <Td>
                                    <IconButton
                                        variant='outline'
                                        colorScheme='red'
                                        aria-label='Delete packing item'
                                        fontSize='20px'
                                        icon={<FiTrash />}
                                    />
                                </Td>
                            </Tr>
                        )
                    })}
                </Tbody>
            </Table>
      </TableContainer>
      </>
    )
}

export default Packing;