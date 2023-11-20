import { Box } from "@chakra-ui/react";
import { FiAlertCircle } from "react-icons/fi";

function RedAlertIcon() {
    return (
    <Box textAlign={'center'} marginY={'auto'} marginLeft="4px">
        <FiAlertCircle fontSize="24px" color="red" />
      </Box>
    )
}

export default RedAlertIcon;
