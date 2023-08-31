import React, { SyntheticEvent } from 'react';
import { pollSocket } from '../utilities/TripSocket';
import { PollChartDataPoint, PollVoteSendModel } from '../utilities/Interfaces';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Cell,
} from 'recharts';
import Constants from '../utilities/Constants';

const COLORS = Constants.COLORS;

interface BarChartComponentProps {
  userVoted: boolean;
  dataPoints: Array<PollChartDataPoint>;
  constructVoteCallback: (chosenOption: string) => PollVoteSendModel | null;
}

function BarChartComponent(props: BarChartComponentProps) {
  // The styling and interaction on this component will depend
  // on whether or not this user has voted.
  const userInteractions = {
    barChartInteractions: {},
    barInteractions: {},
  };
  if (!props.userVoted) {
    userInteractions.barChartInteractions['onClick'] = handleBarClick;
    userInteractions.barInteractions['cursor'] = 'pointer';
    userInteractions.barInteractions['background'] = {
      fill: 'transparent',
      cursor: 'pointer',
    };
  }

  return (
    <ResponsiveContainer width={'100%'} height={'100%'}>
      <BarChart
        data={props.dataPoints}
        {...userInteractions.barChartInteractions}
      >
        <XAxis dataKey={'option'} />
        <YAxis />
        <Bar dataKey={'count'} {...userInteractions.barInteractions}>
          {props.dataPoints.map((datum, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );

  function handleBarClick(data: object) {
    // We are putting the handle click on the BarChart so that
    // users can click on bars for which there are currently
    // no votes. However, that means that there are areas of
    // the graph where it is on the component, but not on a
    // bar option. Add a try/catch for this.
    try {
      const chosenOption: string = data['activeLabel'];

      // console.log('Sending vote', chosenOption);
      const poll_vote: PollVoteSendModel | null =
        props.constructVoteCallback(chosenOption);

      if (poll_vote) {
        pollSocket.socket.emit('frontend_vote', poll_vote);
      }
    } catch (e: TypeError) {
      // Do nothing
    }
  }
}

export default BarChartComponent;
