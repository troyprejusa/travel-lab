import { PieChart, Pie, Cell, ResponsiveContainer, Legend } from 'recharts';
import { PollChartDataPoint } from '../utilities/Interfaces';
import Constants from '../utilities/Constants';

const COLORS = Constants.COLORS;

const RADIAN = Math.PI / 180;
const renderCustomizedLabel = ({
  cx,
  cy,
  midAngle,
  innerRadius,
  outerRadius,
  percent,
}: // index,
{
  cx: number;
  cy: number;
  midAngle: number;
  innerRadius: number;
  outerRadius: number;
  percent: number;
}) => {
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  return (
    <text
      x={x}
      y={y}
      fill="white"
      textAnchor={x > cx ? 'start' : 'end'}
      dominantBaseline="central"
    >
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
};

interface PieChartComponentProps {
  data: Array<PollChartDataPoint>;
}

function PieChartComponent(props: PieChartComponentProps) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <PieChart>
        <Pie
          data={props.data}
          cx="50%"
          cy="50%"
          labelLine={false}
          label={renderCustomizedLabel}
          outerRadius={80}
          fill="#8884d8"
          nameKey="option"
          dataKey="count"
        >
          {props.data.map((_datum, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Legend
          payload={props.data.map((datum, index) => ({
            type: 'circle',
            id: datum.option,
            value: datum.option,
            color: COLORS[index % COLORS.length],
          }))}
          align="right"
          verticalAlign="top"
          layout="vertical"
        />
      </PieChart>
    </ResponsiveContainer>
  );
}

export default PieChartComponent;
