import React from 'react';
import { useSelector } from 'react-redux';
import { TripModel, UserModel } from '../utilities/Interfaces';
import NewItemModal from '../Components/NewPackingItemModal';
import { PackingModel } from '../utilities/Interfaces';
import { RootState } from '../redux/Store';
import { TrashButton, ClaimButton, UnclaimButton } from '../Components/Buttons';
import TitleBar from '../Components/TitleBar';
import PulseDot from '../Components/PulseDot';
import {
  Table,
  Thead,
  Tbody,
  Tfoot,
  Tr,
  Th,
  Td,
  TableContainer,
  ButtonGroup,
} from '@chakra-ui/react';
import { packingSocket } from '../utilities/TripSocket';
import TitleBarOverlay from '../Components/TitleBarOverlay';
import RedAlertIcon from '../Components/RedAlertIcon';

function Packing(): JSX.Element {
  const user: UserModel = useSelector((state: RootState) => state.user);
  const trip: TripModel = useSelector((state: RootState) => state.trip);
  const packingList: Array<PackingModel> = useSelector(
    (state: RootState) => state.packing
  );
  const packingSocketStatus = useSelector((state: RootState) => state.websocket.packing);

  return (
    <>
      <TitleBarOverlay>
        <NewItemModal />
      </TitleBarOverlay>
      <TitleBar text="Packing">
        {packingSocketStatus ? <PulseDot /> : <RedAlertIcon />}
      </TitleBar>
      <TableContainer marginTop={6} borderRadius={'6px'}>
        <Table variant="striped" colorScheme="blackAlpha">
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
                        // packed by current user
                        // packed by someone else
                        (() => {
                          if (!thing.packed_by) {
                            return (
                              <ClaimButton
                                aria-label="claim packing item"
                                tooltipMsg='claim item'
                                onClick={() =>
                                  packingSocket.claimItem({
                                    trip_id: trip.id,
                                    item_id: thing.id,
                                    email: user.email,
                                  })
                                }
                              />
                            );
                          } else if (thing.packed_by === user.email) {
                            // THe current user is packing this
                            return (
                              <UnclaimButton
                                aria-label="unclaim packing item"
                                tooltipMsg='unclaim item'
                                onClick={() =>
                                  packingSocket.unclaimItem({
                                    trip_id: trip.id,
                                    item_id: thing.id,
                                  })
                                }
                              />
                            );
                          } else {
                            // Someone else is packing this already, no action available
                            return null;
                          }
                        })()
                      }
                      <TrashButton
                        aria-label="delete packing item"
                        onClick={() =>
                          packingSocket.deleteItem({
                            trip_id: trip.id,
                            item_id: thing.id,
                          })
                        }
                        tooltipMsg={
                          user.admin
                            ? 'delete item'
                            : 'only trip admins can delete packing items'
                        }
                        disabled={!user.admin}
                      />
                    </ButtonGroup>
                  </Td>
                </Tr>
              );
            })}
          </Tbody>
        </Table>
      </TableContainer>
    </>
  );
}

export default Packing;
