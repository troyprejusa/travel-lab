import { PollResponseModel, PollVoteModel } from '../utilities/Interfaces'
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip as RechartsTooltip } from 'recharts'
import {
  Flex,
  Box,
  useColorModeValue,
  Icon,
  chakra,
  Tooltip,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalHeader,
  ModalCloseButton,
  ModalContent,
  ModalBody,
  ModalFooter,
  Button,
  VStack
} from '@chakra-ui/react'
import { FiEye } from 'react-icons/fi'

interface PollChartData {
  option: string
  count: number
}

interface PollCardProps extends PollResponseModel {

}

function PollCard(props: PollCardProps) {

  const pollChartData = makeDataArray(props.options);

  const { isOpen, onOpen, onClose } = useDisclosure()

  return (
    <>
      <Flex p={'40px'} w="full" alignItems="center" justifyContent="center">
        <Box
          bg={useColorModeValue('white', 'gray.800')}
          maxW="sm"
          borderWidth="1px"
          rounded="lg"
          shadow="lg"
          position="relative">

          <Box p="6">
            <Flex mt="1" justifyContent="space-between" alignContent="center">
              <Box
                fontSize="2xl"
                fontWeight="semibold"
                as="h4"
                lineHeight="tight"
                isTruncated>
                {props.title}
              </Box>
              <Tooltip
                label="View"
                bg="white"
                placement={'top'}
                color={'gray.800'}
                fontSize={'1.2em'}>
                <chakra.a display={'flex'} cursor={'pointer'} onClick={onOpen}>
                  <Icon as={FiEye} h={7} w={7} alignSelf={'center'} />
                </chakra.a>
              </Tooltip>
            </Flex>
            <h2>{`${props.created_by}`}</h2>
            <h3>{`${props.created_at}`}</h3>
          </Box>
        </Box>
      </Flex>

      <Modal isOpen={isOpen} onClose={onClose}>
          <ModalOverlay />
          <ModalContent width={'80vw'} height={'80vh'} maxW={'80vw'} maxH={'80vh'}>
            <ModalHeader>{props.title}</ModalHeader>
            <ModalCloseButton />

            {/* TODO: Add a click to vote feature if this user hasn't voted! */}
            <ModalBody>
              <VStack>
                <Box width={'40vw'} height={'40vh'}>
                  <ResponsiveContainer width={'100%'} height={'100%'}>
                    <BarChart data={pollChartData}>
                        <XAxis dataKey={'option'}/>
                        <YAxis />
                        <Bar dataKey={'count'}/>
                        <RechartsTooltip />
                      </BarChart>
                  </ResponsiveContainer>
                </Box>
              </VStack>
            </ModalBody>
  
            <ModalFooter>
              {/* <Button colorScheme='blue' mr={3} onClick={handleClick}>Create</Button> */}
              <Button variant='ghost' onClick={onClose}>Close</Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
    </>
  )

  function makeDataArray(data: Array<PollVoteModel>): Array<PollChartData> {
    return data.map((optionData: PollVoteModel) => ({option: optionData.option, count: optionData.votes.length}));
  }

}

export default PollCard