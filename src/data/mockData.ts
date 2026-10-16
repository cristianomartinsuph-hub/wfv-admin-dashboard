import type { ChartDataPoint, Concentrador, DashboardMetrics, TimeInterval } from '../types/dashboard'

export const initialMetrics: DashboardMetrics = {
  hotspot_online: 0,
  pppoe_online: 0,
  concentradores_online: 0,
  total_concentradores: 0,
  last_update: '--:--:--',
}

export const mockConcentradores: Concentrador[] = []

export function generateChartSeries(interval: TimeInterval): {
  hotspot: ChartDataPoint[]
  equip: ChartDataPoint[]
} {
  const pointsCount = interval === '6h' ? 12 : interval === '12h' ? 16 : interval === '24h' ? 24 : interval === '48h' ? 24 : 14
  const now = new Date()

  const hotspot: ChartDataPoint[] = []
  const equip: ChartDataPoint[] = []

  const stepMinutes = interval === '6h' ? 30 : interval === '12h' ? 45 : interval === '24h' ? 60 : interval === '48h' ? 120 : 1440

  for (let i = pointsCount - 1; i >= 0; i--) {
    const time = new Date(now.getTime() - i * stepMinutes * 60 * 1000)
    const hours = String(time.getHours()).padStart(2, '0')
    const mins = String(time.getMinutes()).padStart(2, '0')
    const day = String(time.getDate()).padStart(2, '0')
    const month = String(time.getMonth() + 1).padStart(2, '0')

    const date_time = interval.includes('d') ? `${day}/${month} ${hours}:${mins}` : `${hours}:${mins}`

    hotspot.push({
      date_time,
      value: 0,
    })

    equip.push({
      date_time,
      value: 0,
      total: 0,
    })
  }

  return { hotspot, equip }
}
