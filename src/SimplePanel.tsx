import React from 'react';
import { PanelProps, DataFrameView } from '@grafana/data';
import { SimpleOptions } from 'types';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, LabelList, ResponsiveContainer } from 'recharts';
import moment from 'moment/moment';

const colors = ['#3F85A5', '#F6C85F', '#6F4E7C', '#9DD866', '#CA472F', '#EE9D55', '#8DDDD0'];

interface DataPoint {
  Time: number;
  Value: number;
}

interface Props extends PanelProps<SimpleOptions> {}

export const SimplePanel: React.FC<Props> = ({ options, data, width, height }) => {
  const formatData = (input: any[]) => {
    let formattedData: any[] = [];
    input.map((srs) => {
      return new DataFrameView<DataPoint>(srs).toArray().map((dd, index) => {
        if (formattedData[index]) {
          formattedData[index] = { ...formattedData[index], [`${srs.name}`]: dd.Value };
        } else {
          formattedData[index] = { [`${srs.name}`]: dd.Value, name: moment(dd.Time).format('L') };
        }
      });
    });
    return formattedData;
  };

  return (
    <ResponsiveContainer width={width} height={height}>
      <BarChart data={formatData(data.series)}>
        <CartesianGrid />
        <XAxis dataKey="name" tick={{ fontSize: 10 }} />
        <YAxis tick={{ fontSize: 10 }} />
        <Tooltip />
        <Legend align="left" iconType="line" />
        {data.series.map((srs, index) => (
          <Bar key={`${srs.name}-${index}`} dataKey={`${srs.name}`} stackId="stack" fill={colors[index]}>
            <LabelList dataKey={`${srs.name}`} position="middle" />
          </Bar>
        ))}
      </BarChart>
    </ResponsiveContainer>
  );
};
