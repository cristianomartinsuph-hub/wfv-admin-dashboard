import React, { useState } from 'react'
import type { ChartDataPoint } from '../../types/dashboard'

interface AreaChartProps {
  data: ChartDataPoint[]
  color: string // e.g. '#10b981' or '#0ea5e9'
  gradientId: string
  showTotalDashed?: boolean
  unitLabel?: string
}

export const AreaChart: React.FC<AreaChartProps> = ({
  data,
  color,
  gradientId,
  showTotalDashed = false,
  unitLabel = 'sessões',
}) => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)

  if (!data || data.length === 0) {
    return (
      <div className="h-56 flex flex-col items-center justify-center text-slate-500 text-xs gap-1.5 select-none">
        <i className="bi bi-bar-chart-line text-2xl text-slate-600" />
        <span>Sem registros neste período.</span>
      </div>
    )
  }

  const values = data.map((d) => d.value)
  const totals = data.map((d) => d.total || d.value)
  const maxVal = Math.max(...values, ...(showTotalDashed ? totals : [])) || 10
  const minVal = 0

  // Dimensions for SVG viewBox
  const width = 600
  const height = 220
  const paddingX = 20
  const paddingTop = 25
  const paddingBottom = 30
  const chartWidth = width - paddingX * 2
  const chartHeight = height - paddingTop - paddingBottom

  // Coordinate helper
  const getX = (index: number) => {
    return paddingX + (index / (data.length - 1)) * chartWidth
  }

  const getY = (val: number) => {
    const ratio = (val - minVal) / (maxVal - minVal || 1)
    return height - paddingBottom - ratio * chartHeight
  }

  // Smooth bezier curve path calculation
  const points = data.map((d, i) => ({ x: getX(i), y: getY(d.value) }))

  let pathD = `M ${points[0].x} ${points[0].y}`
  for (let i = 0; i < points.length - 1; i++) {
    const current = points[i]
    const next = points[i + 1]
    const controlX = (current.x + next.x) / 2
    pathD += ` C ${controlX} ${current.y}, ${controlX} ${next.y}, ${next.x} ${next.y}`
  }

  const areaD = `${pathD} L ${points[points.length - 1].x} ${height - paddingBottom} L ${points[0].x} ${height - paddingBottom} Z`

  // Optional dashed line for total equipment
  let dashedD = ''
  if (showTotalDashed) {
    const totalPoints = data.map((d, i) => ({ x: getX(i), y: getY(d.total || d.value) }))
    dashedD = `M ${totalPoints[0].x} ${totalPoints[0].y}`
    for (let i = 0; i < totalPoints.length - 1; i++) {
      dashedD += ` L ${totalPoints[i + 1].x} ${totalPoints[i + 1].y}`
    }
  }

  // Peak point
  const peakIndex = values.indexOf(Math.max(...values))
  const peakPoint = points[peakIndex]

  const hoveredPoint = hoveredIndex !== null ? points[hoveredIndex] : null
  const hoveredData = hoveredIndex !== null ? data[hoveredIndex] : null

  return (
    <div className="relative w-full h-56 select-none">
      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="w-full h-full overflow-visible"
        onMouseLeave={() => setHoveredIndex(null)}
      >
        <defs>
          <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity="0.35" />
            <stop offset="60%" stopColor={color} stopOpacity="0.08" />
            <stop offset="100%" stopColor={color} stopOpacity="0.00" />
          </linearGradient>

          <filter id={`glow-${gradientId}`} x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="2" stdDeviation="3" floodColor={color} floodOpacity="0.4" />
          </filter>
        </defs>

        {/* Horizontal grid lines */}
        {[0, 0.25, 0.5, 0.75, 1].map((ratio) => {
          const y = height - paddingBottom - ratio * chartHeight
          const gridVal = Math.round(minVal + ratio * (maxVal - minVal))
          return (
            <g key={ratio}>
              <line
                x1={paddingX}
                y1={y}
                x2={width - paddingX}
                y2={y}
                className="stroke-slate-200 dark:stroke-slate-800"
                strokeDasharray="3 3"
                strokeWidth="1"
              />
              <text
                x={paddingX}
                y={y - 4}
                className="text-[9px] fill-slate-400 font-mono"
              >
                {gridVal}
              </text>
            </g>
          )
        })}

        {/* Total dashed line if applicable */}
        {showTotalDashed && (
          <path
            d={dashedD}
            fill="none"
            stroke="currentColor"
            className="text-slate-400 dark:text-slate-500"
            strokeWidth="1.5"
            strokeDasharray="4 4"
            opacity="0.7"
          />
        )}

        {/* Area Fill */}
        <path d={areaD} fill={`url(#${gradientId})`} />

        {/* Stroke Line */}
        <path
          d={pathD}
          fill="none"
          stroke={color}
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          filter={`url(#glow-${gradientId})`}
        />

        {/* Peak Marker Tag */}
        {peakPoint && (
          <g transform={`translate(${peakPoint.x}, ${peakPoint.y - 12})`}>
            <rect
              x="-20"
              y="-16"
              width="40"
              height="16"
              rx="4"
              fill={color}
              className="drop-shadow-md"
            />
            <text
              x="0"
              y="-5"
              textAnchor="middle"
              className="fill-white font-bold text-[9px]"
            >
              Pico {values[peakIndex]}
            </text>
            <circle cx="0" cy="12" r="3" fill="#ffffff" stroke={color} strokeWidth="2" />
          </g>
        )}

        {/* X Axis Time Labels */}
        {data.map((d, i) => {
          // Display ~6 labels evenly spaced
          const step = Math.max(1, Math.floor(data.length / 6))
          if (i % step !== 0 && i !== data.length - 1) return null

          return (
            <text
              key={i}
              x={getX(i)}
              y={height - 8}
              textAnchor="middle"
              className="text-[10px] fill-slate-400 font-mono select-none"
            >
              {d.date_time}
            </text>
          )
        })}

        {/* Interactive Hover Crosshair and Dot */}
        {hoveredPoint && (
          <g>
            <line
              x1={hoveredPoint.x}
              y1={paddingTop}
              x2={hoveredPoint.x}
              y2={height - paddingBottom}
              stroke={color}
              strokeWidth="1.5"
              strokeDasharray="2 2"
              opacity="0.8"
            />
            <circle
              cx={hoveredPoint.x}
              cy={hoveredPoint.y}
              r="5"
              fill="#ffffff"
              stroke={color}
              strokeWidth="2.5"
              className="drop-shadow-md"
            />
          </g>
        )}

        {/* Invisible columns for mouse events */}
        {data.map((_, i) => {
          const colWidth = chartWidth / (data.length - 1)
          return (
            <rect
              key={i}
              x={getX(i) - colWidth / 2}
              y={paddingTop}
              width={colWidth}
              height={chartHeight}
              fill="transparent"
              className="cursor-pointer"
              onMouseEnter={() => setHoveredIndex(i)}
            />
          )
        })}
      </svg>

      {/* Floating HTML Tooltip */}
      {hoveredData && hoveredPoint && (
        <div
          className="absolute z-20 pointer-events-none transform -translate-x-1/2 -translate-y-full bg-slate-900/90 dark:bg-slate-950/95 text-white text-xs px-3 py-2 rounded-xl shadow-2xl border border-slate-700/80 backdrop-blur-md transition-all duration-150"
          style={{
            left: `${(hoveredPoint.x / width) * 100}%`,
            top: `${(hoveredPoint.y / height) * 100}%`,
            marginTop: '-10px',
          }}
        >
          <div className="font-semibold text-slate-200 border-b border-slate-800 pb-1 mb-1 text-[11px] flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: color }} />
            {hoveredData.date_time}
          </div>
          <div className="text-white font-bold font-mono">
            {hoveredData.value} <span className="text-[10px] font-normal text-slate-400">{unitLabel}</span>
          </div>
          {hoveredData.total !== undefined && (
            <div className="text-[10px] text-slate-400">
              Total cadastrados: <strong className="text-slate-200">{hoveredData.total}</strong>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
