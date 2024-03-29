import { LicenseInfo } from '../Pages/Licenses';
import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
} from '@chakra-ui/react';


interface LicenseTableProps {
  data: Array<LicenseInfo>
}
function LicenseTable(props: LicenseTableProps) {
  return (
    <TableContainer>
      <Table variant="simple">
        <Thead>
          <Tr>
            <Th>Type</Th>
            <Th>Package</Th>
            <Th>Repository</Th>
            <Th>Copyright</Th>
            <Th>License(s)</Th>
            <Th>License Content</Th>
          </Tr>
        </Thead>
        <Tbody>
          {props.data.map((datum: LicenseInfo) => (
            <Tr key={datum.package}>
              <Td>{datum.type}</Td>
              <Td>{datum.package}</Td>
              <Td>{datum.repository}</Td>
              <Td>{datum.copyright}</Td>
              <Td>{datum.licenses}</Td>
              <Td>{datum.licenseText}</Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </TableContainer>
  );
}

export default LicenseTable;
