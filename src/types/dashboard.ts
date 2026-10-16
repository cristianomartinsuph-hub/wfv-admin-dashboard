export type TimeInterval = '6h' | '12h' | '24h' | '48h' | '7d' | '15d' | '30d'

export interface ChartDataPoint {
  date_time: string
  value: number
  total?: number
}

export interface Concentrador {
  id: string
  online: number // 1 = on, 0 = off
  apelido: string
  identidade: string
  modelo: string
  cidade: string
  ip: string
  uptime: string
  vpn_updateonline: string
}

export interface DashboardMetrics {
  hotspot_online: number
  pppoe_online: number
  concentradores_online: number
  total_concentradores: number
  last_update: string
}

export interface SystemUser {
  id: string
  name: string
  email: string
  role: 'admin' | 'operador' | 'tecnico' | 'revenda'
  status: 'ativo' | 'inativo' | 'bloqueado'
  empresa?: string
  telefone?: string
  last_sign_in?: string
  created_at: string
}

export type ActiveRoute =
  | 'inicio'
  | 'alertas'
  | 'usuarios'
  | 'hotspot'
  | 'hotspot-dashboard'
  | 'hotspot-planos'
  | 'hotspot-clientes'
  | 'hotspot-trial'
  | 'hotspot-revendas'
  | 'hotspot-lotes'
  | 'hotspot-lotespix'
  | 'vouchers'
  | 'financeiro'
  | 'financeiro-pix'
  | 'devolucao-pix'
  | 'pix-devolvidos'
  | 'contestacoes'
  | 'relatorios'
  | 'consumo'
  | 'mikrotik'
  | 'grandstream'
  | 'omada'
  | 'tutoriais'
  | 'lgpd'
  | 'assinatura'
  | 'integracoes'
  | 'relogio'
