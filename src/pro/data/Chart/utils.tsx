import { Chart, registerables } from 'chart.js';
import { Line, Bar, Pie, Doughnut, PolarArea, Radar, Bubble, Scatter } from 'react-chartjs-2';
import merge from 'deepmerge';

Chart.register(...registerables);

const getChart = (type: string) => {
  const chartType = type.toLowerCase();

  switch (chartType) {
    case 'bar':
      return Bar;
    case 'line':
      return Line;
    case 'pie':
      return Pie;
    case 'doughnut':
      return Doughnut;
    case 'polararea':
      return PolarArea;
    case 'radar':
      return Radar;
    case 'bubble':
      return Bubble;
    default:
      return Scatter;
  }
};

const setupOptions = (options: any, type: any, defaultOptions: any): any => {
  if (!options) {
    options = {};
  }

  const mergeObjects = (target: any, source: any, options: any) => {
    const destination = target.slice();

    source.forEach((item: any, index: any) => {
      if (typeof destination[index] === 'undefined') {
        destination[index] = options.cloneUnlessOtherwiseSpecified(item, options);
      } else if (options.isMergeableObject(item)) {
        destination[index] = merge(target[index], item, options);
      } else if (target.indexOf(item) === -1) {
        destination.push(item);
      }
    });

    return destination;
  };

  return merge(defaultOptions[type], options, {
    arrayMerge: mergeObjects,
  });
};

const chartsDefaultOptions = {
  line: {
    elements: {
      line: {
        backgroundColor: 'rgba(66, 133, 244, 0.0)',
        borderColor: 'rgb(66, 133, 244)',
        borderWidth: 2,
        tension: 0.0,
      },
      point: {
        borderColor: 'rgb(66, 133, 244)',
        backgroundColor: 'rgb(66, 133, 244)',
      },
    },
    responsive: true,
    plugins: {
      tooltip: {
        intersect: false,
        mode: 'index',
      },
      legend: {
        display: true,
      },
    },
    scales: {
      x: {
        stacked: true,
        grid: {
          display: false,
          drawBorder: false,
        },
        ticks: {
          color: 'rgba(0,0,0, 0.5)',
        },
      },
      y: {
        stacked: true,
        grid: {
          borderDash: [2],
          drawBorder: false,
          tickBorderDash: [2],
          tickBorderDashOffset: [2],
        },
        ticks: {
          color: 'rgba(0,0,0, 0.5)',
        },
      },
    },
  },
  bar: {
    elements: {
      line: {
        backgroundColor: 'rgb(66, 133, 244)',
      },
      bar: {
        backgroundColor: 'rgb(66, 133, 244)',
      },
    },
    responsive: true,
    plugins: {
      tooltip: {
        intersect: false,
        mode: 'index',
      },
      legend: {
        display: true,
      },
    },
    scales: {
      x: {
        stacked: true,
        grid: {
          display: false,
          drawBorder: false,
        },
        ticks: {
          color: 'rgba(0,0,0, 0.5)',
        },
      },
      y: {
        stacked: true,
        grid: {
          borderDash: [2],
          drawBorder: false,
          color: function (context: any): any {
            if (context.tick && context.tick.value === 0) {
              return 'rgba(0,0,0, 0)';
            }
            return Chart.defaults.borderColor;
          },
          tickBorderDash: [2],
          tickBorderDashOffset: [2],
        },
        ticks: {
          color: 'rgba(0,0,0, 0.5)',
        },
      },
    },
  },
  pie: {
    elements: {
      arc: { backgroundColor: 'rgb(66, 133, 244)' },
    },
    responsive: true,
    plugins: {
      legend: {
        display: true,
      },
    },
  },
  doughnut: {
    elements: {
      arc: { backgroundColor: 'rgb(66, 133, 244)' },
    },
    responsive: true,
    plugins: {
      legend: {
        display: true,
      },
    },
  },
  polarArea: {
    elements: {
      arc: { backgroundColor: 'rgba(66, 133, 244, 0.5)' },
    },
    responsive: true,
    plugins: {
      legend: {
        display: true,
      },
    },
  },
  radar: {
    elements: {
      line: {
        backgroundColor: 'rgba(66, 133, 244, 0.5)',
        borderColor: 'rgb(66, 133, 244)',
        borderWidth: 2,
      },
      point: {
        borderColor: 'rgb(66, 133, 244)',
        backgroundColor: 'rgb(66, 133, 244)',
      },
    },
    responsive: true,
    plugins: {
      legend: {
        display: true,
      },
    },
  },
  scatter: {
    elements: {
      line: {
        backgroundColor: 'rgba(66, 133, 244, 0.5)',
        borderColor: 'rgb(66, 133, 244)',
        borderWidth: 2,
        tension: 0.0,
      },
      point: {
        borderColor: 'rgb(66, 133, 244)',
        backgroundColor: 'rgba(66, 133, 244, 0.5)',
      },
    },
    responsive: true,
    plugins: {
      tooltip: {
        intersect: false,
        mode: 'index',
      },
      legend: {
        display: true,
      },
    },
    datasets: {
      borderColor: 'red',
    },
    scales: {
      x: {
        stacked: true,
        grid: {
          display: false,
          drawBorder: false,
        },
        ticks: {
          color: 'rgba(0,0,0, 0.5)',
        },
      },
      y: {
        stacked: false,
        grid: {
          borderDash: [2],
          drawBorder: false,
          tickBorderDash: [2],
          tickBorderDashOffset: [2],
        },
        ticks: {
          color: 'rgba(0,0,0, 0.5)',
        },
      },
    },
  },
  bubble: {
    elements: {
      point: {
        borderColor: 'rgb(66, 133, 244)',
        backgroundColor: 'rgba(66, 133, 244, 0.5)',
      },
    },
    responsive: true,
    plugins: {
      legend: {
        display: true,
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
          drawBorder: false,
        },
        ticks: {
          color: 'rgba(0,0,0, 0.5)',
        },
      },
      y: {
        grid: {
          borderDash: [2],
          drawBorder: false,
          tickBorderDash: [2],
          tickBorderDashOffset: [2],
        },
        ticks: {
          color: 'rgba(0,0,0, 0.5)',
        },
      },
    },
  },
};

export { chartsDefaultOptions, setupOptions, getChart };
