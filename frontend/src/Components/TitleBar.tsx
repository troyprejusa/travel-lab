import { ReactNode } from "react";
import { Flex, Heading } from "@chakra-ui/react";

interface TitleBarProps {
    text: string;
    children?: ReactNode;
}

function TitleBar(props: TitleBarProps) {
    return (
    <Flex justifyContent={'center'} marginTop={6} marginBottom={6}>
        <Heading size={'md'}>
          {props.text}
        </Heading>
        {props.children}
      </Flex>
    )
}

export default TitleBar;
