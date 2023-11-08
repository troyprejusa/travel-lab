import TitleBar from '../Components/TitleBar';
import { useEffect, useState } from 'react';
import LicenseTable from '../Components/LicenseTable';
import { Box, Text } from '@chakra-ui/react';

export interface LicenseInfo {
  type: string;
  package: string;
  repository: string;
  copyright: string;
  licenses: string;
  licenseText: string;
}

function Licenses() {
  const [licenses, setLicenses] = useState<Array<LicenseInfo>>([]);
  useEffect(() => {
    getLicenseInfo();
  }, []);

  return (
    <Box>
      <TitleBar text="Third Party Licenses" />
      {licenses ? (
        <LicenseTable data={licenses} />
      ) : (
        <Text>{'Fetching licenses...'}</Text>
      )}
    </Box>
  );

  async function getLicenseInfo() {
    const licenseData: Array<LicenseInfo> = [];
    try {
      const res: Response = await fetch('/third-party-licenses.json');
      if (res.ok) {
        const data = await res.json();
        for (const key in data) {
          licenseData.push({ type: 'software', package: key, ...data[key] });
        }
      }

      const photoRes: Response = await fetch('/unsplash-photos-licenses.json')
      if (photoRes.ok) {
        const data  = await photoRes.json();
        for (const key in data) {
          licenseData.push({ type: 'photo', package: key, ...data[key] });
        }
      }

      // Save all retrieved license data
      setLicenses(licenseData);

    } catch (error) {
      console.error(error);
    }
  }
}

export default Licenses;
