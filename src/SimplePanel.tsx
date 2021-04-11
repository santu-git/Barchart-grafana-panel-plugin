import React from 'react';
import { PanelProps, DataFrameView } from '@grafana/data';
import { SimpleOptions } from 'types';
import { css } from 'emotion';
import { stylesFactory, useTheme } from '@grafana/ui';
import moment from 'moment';

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, LabelList, ResponsiveContainer } from 'recharts';


const colors = ["#3F85A5","#F6C85F","#6F4E7C","#9DD866","#CA472F","#EE9D55","#8DDDD0"];

interface DataPoint {
  Time: number;
  Value: number;
}

interface Props extends PanelProps<SimpleOptions> {}





export const SimplePanel: React.FC<Props> = ({ options, data, width, height }) => {
  // const theme = useTheme();
  // const styles = getStyles();

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
    })
    return formattedData;
  }
  // console.log(theme);
  
  return (
    <ResponsiveContainer width={width} height={height}>
      <BarChart
        data={formatData(data.series)}
      >
        <CartesianGrid />
        <XAxis dataKey="name" tick={{fontSize: 10}}  />
        <YAxis tick={{fontSize: 10}}   />
        <Tooltip />
        <Legend align="left" iconType="line"/>
        {data.series.map((srs, index) =>( 
        <Bar dataKey={`${srs.name}`} stackId='stack' fill={colors[index]}>
          <LabelList dataKey={`${srs.name}`} position="middle" />
        </Bar>
      ))}
      </BarChart>
      </ResponsiveContainer>
  );
};

const getStyles = stylesFactory(() => {
  return {
    wrapper: css`
      position: relative;
    `,
    svg: css`
      position: absolute;
      top: 0;
      left: 0;
    `,
    textBox: css`
      position: absolute;
      bottom: 0;
      left: 0;
      padding: 10px;
    `,
  };
});
