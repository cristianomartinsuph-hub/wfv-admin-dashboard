import React from 'react'
import type { ActiveRoute } from '../../types/dashboard'

interface SectionViewsProps {
  activeRoute: ActiveRoute
  onBackToOverview: () => void
}

export const SectionViews: React.FC<SectionViewsProps> = ({ activeRoute, onBackToOverview }) => {
  if (activeRoute === 'inicio') return null

  const getSectionInfo = () => {
    switch (activeRoute) {
      case 'vouchers':
        return {
          title: 'Gestão de Vouchers',
          subtitle: 'Criação, controle de lotes, impressão e status de ativação de códigos de acesso Wi-Fi.',
          icon: 'bi-ticket-detailed',
          color: 'text-indigo-400',
        }
      case 'financeiro':
      case 'financeiro-pix':
      case 'devolucao-pix':
      case 'pix-devolvidos':
      case 'contestacoes':
        return {
          title: 'Financeiro & Integração PIX',
          subtitle: 'Faturamento automatizado 24h via PIX com conciliação imediata e emissão automática.',
          icon: 'bi-cash-coin',
          color: 'text-emerald-400',
        }
      case 'relatorios':
      case 'consumo':
        return {
          title: 'Relatórios & Estatísticas',
          subtitle: 'Métricas detalhadas de tráfego de dados, pico de conexões e volume de vendas.',
          icon: 'bi-bar-chart-line',
          color: 'text-sky-400',
        }
      case 'alertas':
        return {
          title: 'Alertas do Sistema e Equipamentos',
          subtitle: 'Notificações de quedas de links, reconexões de concentradores e tentativas não autorizadas.',
          icon: 'bi-bell',
          color: 'text-rose-400',
        }
      default:
        return {
          title: 'Gestão de Hotspots & Infraestrutura',
          subtitle: 'Configuração de captive portal, planos tarifários e concentradores de rede.',
          icon: 'bi-wifi',
          color: 'text-indigo-400',
        }
    }
  }

  const info = getSectionInfo()

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-500/10 dark:bg-indigo-500/20 border border-indigo-500/20 flex items-center justify-center">
            <i className={`bi ${info.icon} ${info.color} text-xl`} />
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-800 dark:text-white tracking-tight">
              {info.title}
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400">{info.subtitle}</p>
          </div>
        </div>

        <button
          type="button"
          onClick={onBackToOverview}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-500/30 hover:bg-indigo-100 dark:hover:bg-indigo-500/20 transition-colors"
        >
          <i className="bi bi-arrow-left" />
          Voltar para Início
        </button>
      </div>

      {/* Dynamic Content based on section */}
      {activeRoute === 'vouchers' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 rounded-2xl p-4">
              <span className="text-xs text-slate-500 dark:text-slate-400">Total Emitidos Hoje</span>
              <p className="text-2xl font-bold text-slate-800 dark:text-white mt-1">328</p>
              <span className="text-[10px] text-emerald-400 font-semibold">+14% em relação a ontem</span>
            </div>
            <div className="bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 rounded-2xl p-4">
              <span className="text-xs text-slate-500 dark:text-slate-400">Vouchers Ativos Agora</span>
              <p className="text-2xl font-bold text-emerald-400 mt-1">142</p>
              <span className="text-[10px] text-slate-400">Tempo restante médio: 3h 45m</span>
            </div>
            <div className="bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 rounded-2xl p-4">
              <span className="text-xs text-slate-500 dark:text-slate-400">Lotes Gerados</span>
              <p className="text-2xl font-bold text-indigo-400 mt-1">18</p>
              <span className="text-[10px] text-slate-400">Prontos para impressão / revenda</span>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 rounded-2xl p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-slate-800 dark:text-white">
                Vouchers Recentes Emitidos via PIX
              </h3>
              <button
                type="button"
                className="px-3 py-1.5 text-xs font-semibold bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors flex items-center gap-1.5 shadow-sm"
              >
                <i className="bi bi-plus-circle" /> Gerar Novo Lote
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left text-slate-600 dark:text-slate-300">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-800 text-[10px] uppercase font-bold text-slate-500">
                    <th className="py-2.5 px-3">Código Voucher</th>
                    <th className="py-2.5 px-3">Plano</th>
                    <th className="py-2.5 px-3">Valor</th>
                    <th className="py-2.5 px-3">Hotspot Destino</th>
                    <th className="py-2.5 px-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                  {[
                    { code: 'WFV-9842-AX', plan: '2 Horas Ilimitado', val: 'R$ 5,00', spot: 'Central-Mikrotik-01', status: 'Ativo' },
                    { code: 'WFV-7712-BT', plan: '12 Horas VIP', val: 'R$ 15,00', spot: 'Hotspot-Shopping-Norte', status: 'Ativo' },
                    { code: 'WFV-3310-QR', plan: '24 Horas Turbo', val: 'R$ 25,00', spot: 'Grandstream-Hotel-Orla', status: 'Ativo' },
                    { code: 'WFV-5509-ZP', plan: '1 Hora Básico', val: 'R$ 3,00', spot: 'AP-Praca-Alimentacao', status: 'Concluído' },
                  ].map((row, i) => (
                    <tr key={i} className="hover:bg-slate-50 dark:hover:bg-slate-850">
                      <td className="py-2.5 px-3 font-mono font-bold text-indigo-400">{row.code}</td>
                      <td className="py-2.5 px-3 font-medium">{row.plan}</td>
                      <td className="py-2.5 px-3 font-bold text-emerald-400">{row.val}</td>
                      <td className="py-2.5 px-3 text-slate-400">{row.spot}</td>
                      <td className="py-2.5 px-3">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${row.status === 'Ativo' ? 'bg-emerald-500/15 text-emerald-400' : 'bg-slate-500/15 text-slate-400'}`}>
                          {row.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {(activeRoute.startsWith('financeiro') || activeRoute === 'relatorios') && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 rounded-2xl p-5">
              <span className="text-xs text-slate-500 dark:text-slate-400">Faturamento Hoje (PIX)</span>
              <p className="text-3xl font-extrabold text-emerald-400 mt-2 font-mono">R$ 1.845,00</p>
              <span className="text-[10px] text-emerald-400 flex items-center gap-1 mt-1">
                <i className="bi bi-arrow-up-right" /> 18.2% acima da média
              </span>
            </div>
            <div className="bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 rounded-2xl p-5">
              <span className="text-xs text-slate-500 dark:text-slate-400">Total Transações PIX</span>
              <p className="text-3xl font-extrabold text-slate-800 dark:text-white mt-2 font-mono">148</p>
              <span className="text-[10px] text-slate-400">100% liquidadas instantaneamente</span>
            </div>
            <div className="bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 rounded-2xl p-5">
              <span className="text-xs text-slate-500 dark:text-slate-400">Ticket Médio</span>
              <p className="text-3xl font-extrabold text-indigo-400 mt-2 font-mono">R$ 12,46</p>
              <span className="text-[10px] text-slate-400">Plano mais vendido: 12 Horas</span>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
