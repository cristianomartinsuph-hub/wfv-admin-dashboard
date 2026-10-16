import React from 'react'
import type { DashboardMetrics } from '../../types/dashboard'

interface MetricCardsProps {
  metrics: DashboardMetrics
  onSelectCard?: (cardKey: 'hotspot' | 'pppoe' | 'concentradores') => void
}

export const MetricCards: React.FC<MetricCardsProps> = ({ metrics, onSelectCard }) => {
  const offlineConcentradores = Math.max(
    0,
    metrics.total_concentradores - metrics.concentradores_online
  )

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
      {/* 1. Hotspot Online */}
      <div
        role="button"
        tabIndex={0}
        onClick={() => onSelectCard?.('hotspot')}
        onKeyDown={(e) => e.key === 'Enter' && onSelectCard?.('hotspot')}
        className="group relative cursor-pointer bg-white dark:bg-slate-900/60 backdrop-blur-xl border border-slate-200 dark:border-slate-800 rounded-2xl p-5 hover:border-emerald-500/40 hover:bg-slate-50 dark:hover:bg-slate-850/80 transition-all duration-300 shadow-sm hover:shadow-xl hover:shadow-emerald-500/5 overflow-hidden"
      >
        <div className="absolute -right-8 -top-8 w-28 h-28 bg-emerald-500/10 dark:bg-emerald-500/15 rounded-full blur-2xl pointer-events-none group-hover:bg-emerald-500/25 transition-all duration-500" />
        <div className="flex items-start justify-between relative z-10">
          <div>
            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 flex items-center gap-1.5 uppercase tracking-wide">
              <span className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400">
                <i className="bi bi-wifi text-base" />
              </span>
              Hotspot Online
            </p>
            <p className="text-4xl font-extrabold text-slate-900 dark:text-white mt-3 tracking-tight font-sans">
              {metrics.hotspot_online.toLocaleString('pt-BR')}
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 flex items-center gap-1.5">
              <i className="bi bi-broadcast text-emerald-400 text-sm" />
              <span>Sessões ativas agora</span>
            </p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 dark:bg-emerald-500/15 border border-emerald-500/20 flex items-center justify-center flex-shrink-0 group-hover:scale-110 group-hover:bg-emerald-500/20 transition-all duration-300">
            <i className="bi bi-arrow-right-circle text-emerald-400 text-lg group-hover:translate-x-0.5 transition-transform" />
          </div>
        </div>
      </div>

      {/* 2. PPPoE Online */}
      <div
        role="button"
        tabIndex={0}
        onClick={() => onSelectCard?.('pppoe')}
        onKeyDown={(e) => e.key === 'Enter' && onSelectCard?.('pppoe')}
        className="group relative cursor-pointer bg-white dark:bg-slate-900/60 backdrop-blur-xl border border-slate-200 dark:border-slate-800 rounded-2xl p-5 hover:border-indigo-500/40 hover:bg-slate-50 dark:hover:bg-slate-850/80 transition-all duration-300 shadow-sm hover:shadow-xl hover:shadow-indigo-500/5 overflow-hidden"
      >
        <div className="absolute -right-8 -top-8 w-28 h-28 bg-indigo-500/10 dark:bg-indigo-500/15 rounded-full blur-2xl pointer-events-none group-hover:bg-indigo-500/25 transition-all duration-500" />
        <div className="flex items-start justify-between relative z-10">
          <div>
            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 flex items-center gap-1.5 uppercase tracking-wide">
              <span className="p-1.5 rounded-lg bg-indigo-500/10 text-indigo-400">
                <i className="bi bi-ethernet text-base" />
              </span>
              PPPoE Online
            </p>
            <p className="text-4xl font-extrabold text-slate-900 dark:text-white mt-3 tracking-tight font-sans">
              {metrics.pppoe_online.toLocaleString('pt-BR')}
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 flex items-center gap-1.5">
              <i className="bi bi-person-check text-indigo-400 text-sm" />
              <span>Clientes com sessão ativa</span>
            </p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-indigo-500/10 dark:bg-indigo-500/15 border border-indigo-500/20 flex items-center justify-center flex-shrink-0 group-hover:scale-110 group-hover:bg-indigo-500/20 transition-all duration-300">
            <i className="bi bi-arrow-right-circle text-indigo-400 text-lg group-hover:translate-x-0.5 transition-transform" />
          </div>
        </div>
      </div>

      {/* 3. Concentradores Online */}
      <div
        role="button"
        tabIndex={0}
        onClick={() => onSelectCard?.('concentradores')}
        onKeyDown={(e) => e.key === 'Enter' && onSelectCard?.('concentradores')}
        className="group relative cursor-pointer bg-white dark:bg-slate-900/60 backdrop-blur-xl border border-slate-200 dark:border-slate-800 rounded-2xl p-5 hover:border-sky-500/40 hover:bg-slate-50 dark:hover:bg-slate-850/80 transition-all duration-300 shadow-sm hover:shadow-xl hover:shadow-sky-500/5 overflow-hidden"
      >
        <div className="absolute -right-8 -top-8 w-28 h-28 bg-sky-500/10 dark:bg-sky-500/15 rounded-full blur-2xl pointer-events-none group-hover:bg-sky-500/25 transition-all duration-500" />
        <div className="flex items-start justify-between relative z-10">
          <div>
            <div className="flex items-center gap-1.5">
              <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 flex items-center gap-1.5 uppercase tracking-wide">
                <span className="p-1.5 rounded-lg bg-sky-500/10 text-sky-400">
                  <i className="bi bi-hdd-network text-base" />
                </span>
                Concentradores Online
              </p>
              <span className="text-[11px] font-mono text-slate-400 font-semibold bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded-md">
                {metrics.concentradores_online}/{metrics.total_concentradores}
              </span>
            </div>
            <p className="text-4xl font-extrabold text-slate-900 dark:text-white mt-3 tracking-tight font-sans">
              {metrics.concentradores_online.toLocaleString('pt-BR')}
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 flex items-center gap-1.5">
              <i className="bi bi-router text-sky-400 text-sm" />
              <span>Comunicação nos últimos 15min</span>
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-1.5 flex-shrink-0 items-end">
            <span
              className="inline-flex items-center gap-1 text-[11px] font-bold bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 px-2.5 py-1 rounded-full shadow-sm"
              title="Equipamentos online respondendo"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              {metrics.concentradores_online} ON
            </span>
            <span
              className="inline-flex items-center gap-1 text-[11px] font-bold bg-rose-500/15 border border-rose-500/30 text-rose-400 px-2.5 py-1 rounded-full shadow-sm"
              title="Equipamentos offline sem comunicação"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-rose-400" />
              {offlineConcentradores} OFF
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
