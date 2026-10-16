import React, { useState } from 'react'

export interface AlertaItem {
  id: string
  titulo: string
  mensagem: string
  tipo: 'critico' | 'sucesso' | 'info' | 'aviso'
  data_hora: string
  lido: boolean
}

export const AlertasView: React.FC = () => {
  const [alertas, setAlertas] = useState<AlertaItem[]>(() => {
    try {
      const saved = localStorage.getItem('wfv_alertas_list')
      if (!saved) return []
      const parsed = JSON.parse(saved)
      return Array.isArray(parsed) ? parsed.filter((a: AlertaItem) => !['1', '2', '3', '4'].includes(a.id)) : []
    } catch {
      return []
    }
  })

  const [filtro, setFiltro] = useState<'todos' | 'nao_lidos' | 'critico'>('todos')

  const persist = (data: AlertaItem[]) => {
    setAlertas(data)
    try {
      localStorage.setItem('wfv_alertas_list', JSON.stringify(data))
    } catch {}
  }

  const markAllAsRead = () => {
    const updated = alertas.map((a) => ({ ...a, lido: true }))
    persist(updated)
  }

  const clearAlertas = () => {
    persist([])
  }

  const filtered = alertas.filter((a) => {
    if (filtro === 'nao_lidos') return !a.lido
    if (filtro === 'critico') return a.tipo === 'critico'
    return true
  })

  const getIcon = (tipo: AlertaItem['tipo']) => {
    switch (tipo) {
      case 'critico':
        return <i className="bi bi-exclamation-octagon-fill text-rose-400 text-lg" />
      case 'sucesso':
        return <i className="bi bi-check-circle-fill text-emerald-400 text-lg" />
      case 'aviso':
        return <i className="bi bi-exclamation-triangle-fill text-amber-400 text-lg" />
      case 'info':
        return <i className="bi bi-info-circle-fill text-sky-400 text-lg" />
    }
  }

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-slate-800 dark:text-white flex items-center gap-2">
            <i className="bi bi-bell text-rose-400" />
            Central de Alertas e Notificações
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Eventos em tempo real sobre quedas de roteadores, vendas aprovadas e faturas.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            type="button"
            onClick={markAllAsRead}
            className="px-3 py-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-xl text-xs font-semibold transition-colors cursor-pointer"
          >
            Marcar lidos
          </button>
          <button
            type="button"
            onClick={clearAlertas}
            className="px-3 py-1.5 bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 border border-rose-500/20 rounded-xl text-xs font-semibold transition-colors cursor-pointer"
          >
            Limpar tudo
          </button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 text-xs">
        {[
          { id: 'todos', label: 'Todos os Alertas' },
          { id: 'nao_lidos', label: 'Não Lidos' },
          { id: 'critico', label: 'Críticos / Quedas' },
        ].map((f) => (
          <button
            key={f.id}
            type="button"
            onClick={() => setFiltro(f.id as any)}
            className={`px-3 py-1.5 rounded-xl font-semibold transition-all cursor-pointer ${
              filtro === f.id
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Alerts list */}
      <div className="space-y-3">
        {filtered.length === 0 ? (
          <div className="bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 rounded-2xl p-12 text-center text-slate-400 text-xs">
            <i className="bi bi-bell-slash text-3xl mb-2 block opacity-40" />
            Nenhum alerta encontrado nesta categoria.
          </div>
        ) : (
          filtered.map((a) => (
            <div
              key={a.id}
              className={`p-4 rounded-2xl border transition-all flex items-start gap-3.5 ${
                a.lido
                  ? 'bg-white dark:bg-slate-900/40 border-slate-200 dark:border-slate-800/80'
                  : 'bg-indigo-50/50 dark:bg-slate-850 border-indigo-200 dark:border-indigo-500/40 shadow-sm'
              }`}
            >
              <div className="flex-shrink-0 mt-0.5">{getIcon(a.tipo)}</div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <h4 className="text-xs font-bold text-slate-800 dark:text-white">{a.titulo}</h4>
                  <span className="text-[10px] text-slate-400 font-mono">{a.data_hora}</span>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-300 mt-1">{a.mensagem}</p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
