import React, { useRef } from 'react';
import type { ChartProps } from './types';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { chartsDefaultOptions, setupOptions, getChart } from './utils';

const MDBChart: React.FC<ChartProps> = ({ data, datalabels, options, type, chartRef, ...props }) => {
  const chartEl = useRef(null);

  const chartReference = chartRef ? chartRef : chartEl;
  const Chart = getChart(type);

  return (
    <Chart
      data={data}
      options={setupOptions(options, type, chartsDefaultOptions)}
      ref={chartReference}
      plugins={datalabels ? [ChartDataLabels as any] : undefined}
      {...props}
    />
  );
};

export default MDBChart;
