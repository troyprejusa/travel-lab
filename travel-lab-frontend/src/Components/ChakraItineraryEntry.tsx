import React from "react";
import { ItineraryModel } from "../Models/Interfaces";
import { 
    Card,
    CardHeader,
    Heading,
    CardBody,
    Text
} from "@chakra-ui/react";

interface ItineraryEntryProps extends ItineraryModel {

}

function ItineraryEntry(props: ItineraryEntryProps) {

    return (
        <Card variant={'outline'}>
            <CardHeader>
                <Heading size='md'>{props.title}</Heading>
                <Heading size='sm'>{props.created_by}</Heading>
            </CardHeader>
            <CardBody>
                <Text>{props.description}</Text>
            </CardBody>
        </Card>
    )
}

export default ItineraryEntry;