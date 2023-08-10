import React from "react";
import { ItineraryModel } from "../Models/Interfaces";
import { 
    Card,
    CardHeader,
    Heading,
    CardBody,
    Text
} from "@chakra-ui/react";

interface ItineraryCardProps extends ItineraryModel {

}

function ItineraryCard(props: ItineraryCardProps) {

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

export default ItineraryCard;