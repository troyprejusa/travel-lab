import React, { SyntheticEvent } from "react";
import { pollSocket } from "../utilities/TripSocket";
import { PollChartDataPoint, PollVoteSendModel } from "../utilities/Interfaces";
import { 
    ResponsiveContainer, 
    BarChart, 
    Bar, 
    XAxis, 
    YAxis, 
    Tooltip,
    Cell
} from 'recharts'
import Constants from "../utilities/Constants";

const COLORS = Constants.COLORS;

interface BarChartComponentProps {
    data: Array<PollChartDataPoint>
    constructVoteCallback: (chosenOption: string) => PollVoteSendModel | null
}

function BarChartComponent(props: BarChartComponentProps) {
    return (
        <ResponsiveContainer width={'100%'} height={'100%'}>
            <BarChart data={props.data} onClick={handleBarClick}>
                <XAxis dataKey={'option'}/>
                <YAxis />
                <Bar dataKey={'count'} >
                    { props.data.map((datum, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />) }
                </Bar>
                <Tooltip />
            </BarChart>
        </ResponsiveContainer>
    )

    function handleBarClick(data) {
        // We are putting the handle click on the BarChart so that
        // users can click on bars for which there are currently
        // no votes. However, that means that there are areas of
        // the graph where it is on the component, but not on a 
        // bar option. Add a try/catch for this.
        try {
            const chosenOption: string = data['activeLabel'];
            
            console.log('Sending vote', chosenOption);
            const poll_vote: PollVoteSendModel | null = props.constructVoteCallback(chosenOption);

            if (poll_vote) {
                pollSocket.socket.emit('frontend_vote', poll_vote);
            }

        } catch (e: TypeError) {
            // Do nothing
        }
    }
}

export default BarChartComponent;
