'use client'

// React Imports
import { useState } from 'react'

// Next Imports
import dynamic from 'next/dynamic'

// MUI Imports
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import { useTheme } from '@mui/material/styles'

// Third Party Imports
import type { ApexOptions } from 'apexcharts'
import { Skeleton } from '@mui/material'

// Styled Component Imports
const AppReactApexCharts = dynamic(() => import('@/libs/styles/AppReactApexCharts'))

type ApexChartSeries = NonNullable<ApexOptions['series']>
type ApexChartSeriesData = Exclude<ApexChartSeries[0], number>

const tableSeries = [{ data: [28, 10, 46, 38, 15, 30, 35, 28, 8, 12, 16, 30] }]

const SkeletonLeadYearlyOverview = () => {
  // States
  // Hooks
  const theme = useTheme()

  // Vars
  const disabledText = 'var(--mui-palette-text-disabled)'

  const colors = Array(12).fill('var(--mui-palette-primary-lightOpacity)')

  const options: ApexOptions = {
    chart: {
      parentHeightOffset: 0,
      toolbar: { show: false }
    },
    plotOptions: {
      bar: {
        borderRadius: 6,
        distributed: true,
        columnWidth: '33%',
        borderRadiusApplication: 'end',
        dataLabels: { position: 'top' }
      }
    },
    legend: { show: false },
    tooltip: { enabled: false },
    dataLabels: {
      offsetY: -11,
      formatter: val => `${val}k`,
      style: {
        fontWeight: 500,
        colors: ['var(--mui-palette-text-primary)'],
        fontSize: theme.typography.body1.fontSize as string
      }
    },
    colors,
    states: {
      hover: {
        filter: { type: 'none' }
      },
      active: {
        filter: { type: 'none' }
      }
    },
    grid: {
      show: false,
      padding: {
        top: -19,
        left: -4,
        right: 0,
        bottom: -11
      }
    },
    xaxis: {
      axisTicks: { show: true },
      axisBorder: { color: 'var(--mui-palette-divider)' },
      categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
      labels: {
        style: {
          colors: disabledText,
          fontFamily: theme.typography.fontFamily,
          fontSize: theme.typography.body2.fontSize as string
        }
      }
    },
    yaxis: {
      labels: {
        offsetX: -18,
        formatter: val => `${val}k`,
        style: {
          colors: disabledText,
          fontFamily: theme.typography.fontFamily,
          fontSize: theme.typography.body2.fontSize as string
        }
      }
    },
    responsive: [
      {
        breakpoint: 1450,
        options: {
          plotOptions: {
            bar: { columnWidth: '45%' }
          }
        }
      },
      {
        breakpoint: 600,
        options: {
          dataLabels: {
            style: {
              fontSize: theme.typography.body2.fontSize as string
            }
          },
          plotOptions: {
            bar: { columnWidth: '58%' }
          }
        }
      },
      {
        breakpoint: 500,
        options: {
          plotOptions: {
            bar: { columnWidth: '70%' }
          }
        }
      }
    ]
  }

  const max = Math.max(...((tableSeries[0] as ApexChartSeriesData).data as number[]))
  const seriesIndex = ((tableSeries[0] as ApexChartSeriesData).data as number[]).indexOf(max)

  const finalColors = colors.map((color, i) => (seriesIndex === i ? 'var(--mui-palette-primary-main)' : color))

  return (
    <Card>
      <CardHeader
        title='Generated Lead'
        subheader='Yearly Overview'
        // action={<OptionMenu options={['Last Week', 'Last Month', 'Last Year']} />}
      />
      <CardContent>
        <div className='flex flex-row justify-between'>
          {Array.from({ length: 12 }).map((_, i) => (
            <Skeleton key={i} variant='rectangular' width={40} height={300} />
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

export default SkeletonLeadYearlyOverview
