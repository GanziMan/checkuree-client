import {
  AttendeeStatisticsType,
  AttendeeStatisticType,
  DayOfWeek,
  dayMap,
} from '@/api/type'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Align,
} from 'chart.js'

import { Bar } from 'react-chartjs-2'
import ChartDataLabels from 'chartjs-plugin-datalabels'

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ChartDataLabels,
)

function BarChart({
  labels,
  statisticData,
}: {
  labels: string[]
  statisticData: number[]
}) {
  const maxIndex = statisticData.indexOf(Math.max(...statisticData))

  const backgroundColor = new Array(statisticData.length).fill('#BDDDC3')

  backgroundColor[maxIndex] = '#59996B'

  const data = {
    labels,
    datasets: [
      {
        data: statisticData,
        backgroundColor: backgroundColor,

        datalabels: {
          align: 'end' as Align,
          anchor: 'end' as Align,
        },

        barThickness: 32, // 막대 너비 설정 (px)
        borderRadius: {
          topLeft: 4,
          topRight: 4,
          bottomLeft: 0,
          bottomRight: 0,
        },
      },
    ],
  }
  const options = {
    layout: {
      padding: {
        top: 20,
      },
    },
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: 'white',
        bodyColor: '#424242',
        titleColor: '#424242',
        displayColors: false,
        padding: 10,
      },
      datalabels: {
        display: (ctx: any) => ctx.dataset.data[ctx.dataIndex] !== 0,
      },
    },
    // aspectRatio: 10,
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        beginAtZero: true,
        grid: {
          display: false, // Remove grid lines
        },
        ticks: {},
      },
      y: {
        border: {
          dash: [2, 4],
        },
        beginAtZero: true,
        ticks: {
          count: 6,
        },
      },
    },
  }
  return (
    <div style={{ width: '100%', height: 284 }}>
      <Bar data={data} options={options} />
    </div>
  )
}

export function CategoryChart({
  statisticData,
  tab,
}: {
  statisticData: AttendeeStatisticType
  tab: AttendeeStatisticsType
}) {
  let sortedData: {
    name: string
    count: number
  }[] = []
  let labels: string[] = []
  let data: number[] = []
  const labelsSwitch = (tab: AttendeeStatisticsType) => {
    switch (tab) {
      case 'DAY':
        const order = [
          'MONDAY',
          'TUESDAY',
          'WEDNESDAY',
          'THURSDAY',
          'FRIDAY',
          'SATURDAY',
          'SUNDAY',
        ]
        sortedData = statisticData.contents.sort((a, b) => {
          return order.indexOf(a.name) - order.indexOf(b.name)
        })
        labels = sortedData.map((data) => dayMap[data.name as DayOfWeek])
        data = sortedData.map((data) => data.count)
        return {
          data,
          labels,
        }
      case 'AGE':
        labels = statisticData.contents.map((data) => data.name)
        data = statisticData.contents.map((data) => data.count)
        return {
          data,
          labels,
        }
      case 'CURRICULUM':
        labels = statisticData.contents.map((data) => data.name)
        data = statisticData.contents.map((data) => data.count)
        return {
          labels,
          data,
        }
    }
  }

  return (
    <BarChart
      labels={labelsSwitch(tab).labels}
      statisticData={labelsSwitch(tab).data}
    />
  )
}
