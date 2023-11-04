import TitleBar from '../Components/TitleBar';
import { useEffect, useState } from 'react';
import LicenseTable from '../Components/LicenseTable';
import { Text } from '@chakra-ui/react';

export interface LicenseInfo {
  package: string,
  repository: string, 
  copyright: string,
  licenses: string,
  licenseText: string
}

function Licenses() {
  const [licenses, setLicenses] = useState<Array<LicenseInfo>>([]);
  useEffect(() => {
    getLicenseInfo();
  }, []);

  return (
    <>
      <TitleBar text="Third Party Licenses" />
      <Text>{licenses ? <LicenseTable data={licenses}/> : 'Fetching licenses...'}</Text>
    </>
  );

  async function getLicenseInfo() {
    try {
      const res: Response = await fetch('/third-party-licenses.json');
      if (res.ok) {
        const data: any = await res.json();
        const licenseData: Array<LicenseInfo> = [];
        for (const key in data) {
          licenseData.push({package: key, ...data[key]})
        }
        setLicenses(licenseData);
      }
    } catch (error) {
      console.error(error);
    }
  }
}

export default Licenses;
