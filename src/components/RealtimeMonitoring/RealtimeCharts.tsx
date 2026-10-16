import React from 'react'
import { AreaChart } from './AreaChart'
import type { ChartDataPoint, TimeInterval } from '../../types/dashboard'

interface RealtimeChartsProps {
  hotspotData: ChartDataPoint[]
  equipData: ChartDataPoint[]
  hotspotInterval: TimeInterval
  equipInterval: TimeInterval
  onChangeHotspotInterval: (interval: TimeInterval) => void
  onChangeEquipInterval: (interval: TimeInterval) => void
  onScrollToTable?: () => void
}

const INTERVAL_OPTIONS: { value: TimeInterval; label: string }[] = [
  { value: '6h', label: '6 horas' },
  { value: '12h', label: '12 horas' },
  { value: '24h', label: '24 horas' },
  { value: '48h', label: '48 horas' },
  { value: '7d', label: '7 dias' },
  { value: '15d', label: '15 dias' },
  { value: '30d', label: '30 dias' },
]

export const RealtimeCharts: React.FC<RealtimeChartsProps> = ({
  hotspotData,
  equipData,
  hotspotInterval,
  equipInterval,
  onChangeHotspotInterval,
  onChangeEquipInterval,
  onScrollToTable,
}) => {
  // Hotspot summary calculations
  const hotspotValues = hotspotData.map((d) => d.value)
  const hotspotCurrent = hotspotValues[hotspotValues.length - 1] || 0
  const hotspotPeak = Math.max(...hotspotValues, 0)
  const hotspotPeakIndex = hotspotValues.indexOf(hotspotPeak)
  const hotspotPeakTime = hotspotData[hotspotPeakIndex]?.date_time || '--:--'
  const hotspotAvg =
    hotspotValues.length > 0
      ? (hotspotValues.reduce((a, b) => a + b, 0) / hotspotValues.length).toLocaleString('pt-BR', {
          maximumFractionDigits: 1,
        })
      : '0'

  // Equipamentos summary calculations
  const equipValues = equipData.map((d) => d.value)
  const equipCurrent = equipValues[equipValues.length - 1] || 0
  const equipTotal = equipData[equipData.length - 1]?.total || 12
  const equipPeak = Math.max(...equipValues, 0)

  return (
    <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
      {/* 1. Bloco Hotspot online */}
      <div className="bg-white dark:bg-slate-900/60 backdrop-blur-xl border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm transition-all duration-300">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-800/80 pb-3">
          <div className="min-w-0">
            <h2 className="text-sm font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
              <span className="p-1 rounded-md bg-emerald-500/10 text-emerald-400">
                <i className="bi bi-wifi text-sm" />
              </span>
              Hotspot online
            </h2>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 font-mono">
              Agora: <strong className="text-emerald-400">{hotspotCurrent}</strong> · Pico:{' '}
              <strong className="text-slate-700 dark:text-slate-200">{hotspotPeak}</strong> ({hotspotPeakTime}) ·
              Média: <strong className="text-slate-700 dark:text-slate-200">{hotspotAvg}</strong>
            </p>
          </div>

          <div className="flex items-center gap-2">
            <select
              value={hotspotInterval}
              onChange={(e) => onChangeHotspotInterval(e.target.value as TimeInterval)}
              className="rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-2.5 py-1 text-xs text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-500 cursor-pointer font-medium"
              aria-label="Período do gráfico de hotspot"
            >
              {INTERVAL_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
            <button
              type="button"
              className="text-xs font-semibold text-indigo-500 hover:text-indigo-400 hover:underline flex items-center gap-1 whitespace-nowrap pl-1"
            >
              Detalhes <i className="bi bi-arrow-right text-[11px]" />
            </button>
          </div>
        </div>

        <AreaChart
          data={hotspotData}
          color="#10b981"
          gradientId="grad-hotspot"
          unitLabel="sessões"
        />
      </div>

      {/* 2. Bloco Equipamentos online */}
      <div className="bg-white dark:bg-slate-900/60 backdrop-blur-xl border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm transition-all duration-300">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-800/80 pb-3">
          <div className="min-w-0">
            <h2 className="text-sm font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
              <span className="p-1 rounded-md bg-sky-500/10 text-sky-400">
                <i className="bi bi-hdd-network text-sm" />
              </span>
              Equipamentos online
            </h2>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 font-mono">
              Agora: <strong className="text-sky-400">{equipCurrent}</strong> de {equipTotal} · Pico:{' '}
              <strong className="text-slate-700 dark:text-slate-200">{equipPeak}</strong> ·{' '}
              <span className="text-emerald-400 font-semibold">100% Uptime</span>
            </p>
          </div>

          <div className="flex items-center gap-2">
            <select
              value={equipInterval}
              onChange={(e) => onChangeEquipInterval(e.target.value as TimeInterval)}
              className="rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-2.5 py-1 text-xs text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-500 cursor-pointer font-medium"
              aria-label="Período do gráfico de equipamentos"
            >
              {INTERVAL_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
            <button
              type="button"
              onClick={onScrollToTable}
              className="text-xs font-semibold text-indigo-500 hover:text-indigo-400 hover:underline flex items-center gap-1 whitespace-nowrap pl-1"
            >
              Ver lista <i className="bi bi-arrow-down text-[11px]" />
            </button>
          </div>
        </div>

        <AreaChart
          data={equipData}
          color="#0ea5e9"
          gradientId="grad-equip"
          showTotalDashed={true}
          unitLabel="equipamentos"
        />
      </div>
    </div>
  )
}
