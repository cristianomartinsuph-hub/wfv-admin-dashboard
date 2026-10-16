import React from 'react'

interface OverviewHeaderProps {
  lastUpdateTime: string
  onManualRefresh?: () => void
  isRefreshing?: boolean
}

export const OverviewHeader: React.FC<OverviewHeaderProps> = ({
  lastUpdateTime,
  onManualRefresh,
  isRefreshing = false,
}) => {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-1">
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl bg-indigo-500/10 dark:bg-indigo-500/20 border border-indigo-500/20 flex items-center justify-center text-indigo-500 dark:text-indigo-400 shadow-sm shadow-indigo-500/10">
          <i className="bi bi-speedometer2 text-xl" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-slate-800 dark:text-white tracking-tight flex items-center gap-2">
            Visão Geral
            <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              Ao Vivo
            </span>
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Acompanhamento em tempo real de hotspots, PPPoE e concentradores de rede.
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3 self-end sm:self-auto">
        <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-850 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800">
          <i className="bi bi-clock text-slate-400" />
          <span>
            Última atualização: <strong className="text-slate-700 dark:text-slate-200 font-mono">{lastUpdateTime}</strong>
          </span>
        </div>

        {onManualRefresh && (
          <button
            type="button"
            onClick={onManualRefresh}
            disabled={isRefreshing}
            className="p-1.5 text-slate-500 hover:text-indigo-500 dark:text-slate-400 dark:hover:text-indigo-400 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors border border-slate-200 dark:border-slate-800"
            title="Atualizar dados agora"
          >
            <i className={`bi bi-arrow-clockwise text-base ${isRefreshing ? 'animate-spin text-indigo-500' : ''}`} />
          </button>
        )}
      </div>
    </div>
  )
}
