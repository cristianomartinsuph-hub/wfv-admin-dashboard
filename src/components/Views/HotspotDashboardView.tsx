import React, { useState } from 'react'

export interface HotspotSession {
  id: string
  ip: string
  mac: string
  usuario_voucher: string
  tempo_conectado: string
  tempo_restante: string
  download: string
  upload: string
  concentrador: string
}

const DEFAULT_SESSIONS: HotspotSession[] = [
  {
    id: 's1',
    ip: '192.168.88.241',
    mac: 'FC:E8:29:10:99:BB',
    usuario_voucher: 'CMS-9842-AX',
    tempo_conectado: '34 min',
    tempo_restante: '1h 26m',
    download: '124 MB',
    upload: '18 MB',
    concentrador: 'Central-Mikrotik-01',
  },
  {
    id: 's2',
    ip: '192.168.88.192',
    mac: '28:6F:7F:31:AA:CC',
    usuario_voucher: 'CMS-7712-BT',
    tempo_conectado: '4h 12m',
    tempo_restante: '7h 48m',
    download: '1.4 GB',
    upload: '120 MB',
    concentrador: 'Hotspot-Shopping-Norte',
  },
  {
    id: 's3',
    ip: '192.168.88.105',
    mac: '40:88:05:6E:71:32',
    usuario_voucher: 'CMS-3310-QR',
    tempo_conectado: '18h 40m',
    tempo_restante: '5h 20m',
    download: '4.8 GB',
    upload: '380 MB',
    concentrador: 'Grandstream-Hotel-Orla',
  },
]

export const HotspotDashboardView: React.FC = () => {
  const [sessions, setSessions] = useState<HotspotSession[]>(DEFAULT_SESSIONS)
  const [feedback, setFeedback] = useState<string | null>(null)

  const handleDisconnect = (id: string, mac: string) => {
    setSessions(sessions.filter((s) => s.id !== id))
    setFeedback(`Sessão do cliente (${mac}) desconectada do captive portal com sucesso!`)
    setTimeout(() => setFeedback(null), 3500)
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-slate-800 dark:text-white flex items-center gap-2">
            <i className="bi bi-speedometer2 text-indigo-400" />
            Dashboard Operacional do Hotspot
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Monitoramento de sessões ativas no captive portal, consumo em tempo real e controle de conexões.
          </p>
        </div>

        <button
          type="button"
          onClick={() => {
            setFeedback('Sessões atualizadas com os concentradores!')
            setTimeout(() => setFeedback(null), 2500)
          }}
          className="px-3 py-1.5 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 rounded-xl text-xs font-semibold hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors flex items-center gap-1.5 cursor-pointer self-start sm:self-auto"
        >
          <i className="bi bi-arrow-clockwise" />
          <span>Atualizar Sessões</span>
        </button>
      </div>

      {feedback && (
        <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs flex items-center gap-2 animate-in fade-in">
          <i className="bi bi-check-circle-fill text-base flex-shrink-0" />
          <span>{feedback}</span>
        </div>
      )}

      {/* Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-sm">
          <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">Sessões Ativas</span>
          <p className="text-2xl font-bold text-indigo-400 mt-1">{sessions.length}</p>
          <span className="text-[10px] text-slate-400">Navegando agora</span>
        </div>
        <div className="bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-sm">
          <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">Tempo Médio de Conexão</span>
          <p className="text-2xl font-bold text-emerald-400 mt-1">2h 45m</p>
          <span className="text-[10px] text-slate-400">Por usuário</span>
        </div>
        <div className="bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-sm">
          <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">Pico Hoje</span>
          <p className="text-2xl font-bold text-sky-400 mt-1">142</p>
          <span className="text-[10px] text-slate-400">Simultâneos às 14h</span>
        </div>
        <div className="bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-sm">
          <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">Taxa de Conversão</span>
          <p className="text-2xl font-bold text-amber-400 mt-1">78.4%</p>
          <span className="text-[10px] text-slate-400">Trial &rarr; Compra PIX</span>
        </div>
      </div>

      {/* Active Sessions Table */}
      <div className="bg-white dark:bg-slate-900/60 backdrop-blur-xl border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm">
        <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-800 dark:text-white">
            Usuários Conectados no Hotspot em Tempo Real
          </h3>
          <span className="text-xs text-slate-400">{sessions.length} clientes autenticados</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left text-slate-600 dark:text-slate-300">
            <thead>
              <tr className="bg-slate-100 dark:bg-slate-800/90 border-b border-slate-200 dark:border-slate-800 text-[10px] uppercase font-bold text-slate-500">
                <th className="px-5 py-3">Voucher / Usuário</th>
                <th className="px-5 py-3">IP / MAC</th>
                <th className="px-5 py-3 hidden md:table-cell">Concentrador</th>
                <th className="px-5 py-3">Tempo Restante</th>
                <th className="px-5 py-3 hidden sm:table-cell">Tráfego Down/Up</th>
                <th className="px-5 py-3 text-right">Ação</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
              {sessions.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-8 text-slate-400">
                    Nenhum cliente conectado no momento.
                  </td>
                </tr>
              ) : (
                sessions.map((s) => (
                  <tr key={s.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                    <td className="px-5 py-3 font-mono font-bold text-indigo-400 whitespace-nowrap">
                      {s.usuario_voucher}
                    </td>
                    <td className="px-5 py-3 whitespace-nowrap">
                      <p className="font-mono text-slate-800 dark:text-white">{s.ip}</p>
                      <p className="text-[10px] font-mono text-slate-400">{s.mac}</p>
                    </td>
                    <td className="px-5 py-3 text-slate-500 dark:text-slate-400 hidden md:table-cell whitespace-nowrap">
                      {s.concentrador}
                    </td>
                    <td className="px-5 py-3 whitespace-nowrap">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/15 text-emerald-400">
                        {s.tempo_restante}
                      </span>
                    </td>
                    <td className="px-5 py-3 font-mono text-slate-400 hidden sm:table-cell whitespace-nowrap">
                      {s.download} &darr; / {s.upload} &uarr;
                    </td>
                    <td className="px-5 py-3 text-right whitespace-nowrap">
                      <button
                        type="button"
                        onClick={() => handleDisconnect(s.id, s.mac)}
                        className="px-2.5 py-1 text-xs font-semibold bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 border border-rose-500/20 rounded-lg transition-colors cursor-pointer"
                        title="Derrubar Conexão"
                      >
                        Desconectar
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
