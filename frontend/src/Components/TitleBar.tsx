import React from "react";
import { Flex, Heading } from "@chakra-ui/react";

interface TitleBarProps {
    text: string
}

function TitleBar(props: TitleBarProps) {
    return (
    <Flex justifyContent={'center'} margin={6}>
        <Heading size={'md'}>
          {props.text}
        </Heading>
      </Flex>
    )
}

export default TitleBar;
