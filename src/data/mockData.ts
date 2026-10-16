import type { ChartDataPoint, Concentrador, DashboardMetrics, TimeInterval } from '../types/dashboard'

export const initialMetrics: DashboardMetrics = {
  hotspot_online: 142,
  pppoe_online: 89,
  concentradores_online: 12,
  total_concentradores: 12,
  last_update: '06:41:19',
}

export const mockConcentradores: Concentrador[] = [
  {
    id: '1',
    online: 1,
    apelido: 'Central-Mikrotik-01',
    identidade: 'RB750Gr3-Core',
    modelo: 'MikroTik hEX RB750Gr3',
    cidade: 'São Paulo - SP',
    ip: '192.168.88.1',
    uptime: '42d 18h 22m',
    vpn_updateonline: '2026-10-15 06:41:05',
  },
  {
    id: '2',
    online: 1,
    apelido: 'Hotspot-Shopping-Norte',
    identidade: 'hAP-ax2-Shop',
    modelo: 'MikroTik hAP ax²',
    cidade: 'Campinas - SP',
    ip: '10.10.20.1',
    uptime: '19d 04h 11m',
    vpn_updateonline: '2026-10-15 06:40:48',
  },
  {
    id: '3',
    online: 1,
    apelido: 'AP-Praca-Alimentacao',
    identidade: 'Omada-EAP610-01',
    modelo: 'TP-Link Omada EAP610',
    cidade: 'Rio de Janeiro - RJ',
    ip: '172.16.5.14',
    uptime: '68d 12h 05m',
    vpn_updateonline: '2026-10-15 06:41:12',
  },
  {
    id: '4',
    online: 1,
    apelido: 'Grandstream-Hotel-Orla',
    identidade: 'GWN7660-Lobby',
    modelo: 'Grandstream GWN7660',
    cidade: 'Florianópolis - SC',
    ip: '10.0.100.2',
    uptime: '15d 21h 33m',
    vpn_updateonline: '2026-10-15 06:40:59',
  },
  {
    id: '5',
    online: 1,
    apelido: 'Concentrador-Bairro-Sul',
    identidade: 'RB4011-PPPoE',
    modelo: 'MikroTik RB4011iGS+',
    cidade: 'Curitiba - PR',
    ip: '10.50.0.1',
    uptime: '124d 09h 40m',
    vpn_updateonline: '2026-10-15 06:41:15',
  },
  {
    id: '6',
    online: 1,
    apelido: 'AP-Externo-Praia',
    identidade: 'NetMetal-ax-01',
    modelo: 'MikroTik NetMetal ax',
    cidade: 'Santos - SP',
    ip: '10.12.30.5',
    uptime: '33d 02h 19m',
    vpn_updateonline: '2026-10-15 06:40:30',
  },
  {
    id: '7',
    online: 1,
    apelido: 'Hotspot-Academia-Fit',
    identidade: 'EAP245-Gym',
    modelo: 'TP-Link Omada EAP245',
    cidade: 'Belo Horizonte - MG',
    ip: '192.168.15.2',
    uptime: '08d 14h 50m',
    vpn_updateonline: '2026-10-15 06:41:00',
  },
  {
    id: '8',
    online: 1,
    apelido: 'Concentrador-Torre-03',
    identidade: 'CCR2004-Fiber',
    modelo: 'MikroTik CCR2004-16G-2S+',
    cidade: 'Salvador - BA',
    ip: '10.200.1.1',
    uptime: '91d 16h 04m',
    vpn_updateonline: '2026-10-15 06:41:18',
  },
  {
    id: '9',
    online: 1,
    apelido: 'AP-Outdoor-Parque',
    identidade: 'EAP650-Outdoor',
    modelo: 'TP-Link Omada EAP650-Outdoor',
    cidade: 'Porto Alegre - RS',
    ip: '172.20.10.8',
    uptime: '27d 08h 12m',
    vpn_updateonline: '2026-10-15 06:40:42',
  },
  {
    id: '10',
    online: 1,
    apelido: 'Hotspot-Coworking',
    identidade: 'GWN7630-Hub',
    modelo: 'Grandstream GWN7630',
    cidade: 'Brasília - DF',
    ip: '10.80.4.1',
    uptime: '54d 11h 29m',
    vpn_updateonline: '2026-10-15 06:41:10',
  },
  {
    id: '11',
    online: 1,
    apelido: 'Concentrador-Vila-Mariana',
    identidade: 'hEX-S-Vila',
    modelo: 'MikroTik hEX S',
    cidade: 'São Paulo - SP',
    ip: '192.168.99.1',
    uptime: '11d 06h 45m',
    vpn_updateonline: '2026-10-15 06:41:08',
  },
  {
    id: '12',
    online: 1,
    apelido: 'AP-Restaurante-Marina',
    identidade: 'hAP-ac3-Marina',
    modelo: 'MikroTik hAP ac³',
    cidade: 'Angra dos Reis - RJ',
    ip: '10.15.50.2',
    uptime: '40d 19h 55m',
    vpn_updateonline: '2026-10-15 06:41:14',
  },
]

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

    // Hotspot sessions curve with realistic daily peaks around 12h-15h and 19h-22h
    const hourNum = time.getHours()
    const isPeak = (hourNum >= 12 && hourNum <= 15) || (hourNum >= 18 && hourNum <= 22)
    const baseHotspot = isPeak ? 150 : 80
    const variance = Math.floor(Math.sin(i * 0.7) * 25 + Math.cos(i * 0.3) * 15)
    const val = Math.max(35, baseHotspot + variance + (i === 0 ? 12 : 0))

    hotspot.push({
      date_time,
      value: val,
    })

    // Equipamentos are usually 11-12 online out of 12
    const onlineEquip = 12
    equip.push({
      date_time,
      value: onlineEquip,
      total: 12,
    })
  }

  return { hotspot, equip }
}
