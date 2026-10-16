import React, { useState } from 'react'

export interface DeviceTraffic {
  rank: number
  mac: string
  cliente: string
  download: string
  upload: string
  total: string
}

export const ConsumoView: React.FC = () => {
  const [periodo, setPeriodo] = useState('7d')
  const [topDevices] = useState<DeviceTraffic[]>(() => {
    try {
      const saved = localStorage.getItem('wfv_consumo_devices')
      return saved ? JSON.parse(saved) : []
    } catch {
      return []
    }
  })

  const handleExportCsv = () => {
    if (topDevices.length === 0) {
      alert('Nenhum dado de consumo para exportar.')
      return
    }
    let csv = 'Rank,MAC,Dispositivo,Download,Upload,Total\n'
    topDevices.forEach((d) => {
      csv += `${d.rank},"${d.mac}","${d.cliente}","${d.download}","${d.upload}","${d.total}"\n`
    })
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `relatorio-consumo-cmshotspot-${periodo}.csv`
    a.click()
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-slate-800 dark:text-white flex items-center gap-2">
            <i className="bi bi-database text-sky-400" />
            Relatório de Consumo de Banda & Tráfego de Dados
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Monitoramento de volume de dados trafegados por roteador e consumo individual por MAC.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <select
            value={periodo}
            onChange={(e) => setPeriodo(e.target.value)}
            className="bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-1.5 text-xs text-slate-800 dark:text-slate-100 outline-none"
          >
            <option value="24h">Últimas 24 Horas</option>
            <option value="7d">Últimos 7 Dias</option>
            <option value="30d">Últimos 30 Dias</option>
          </select>
          <button
            type="button"
            onClick={handleExportCsv}
            disabled={topDevices.length === 0}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold shadow-sm transition-all flex items-center gap-1.5 ${
              topDevices.length === 0
                ? 'bg-slate-200 dark:bg-slate-800 text-slate-400 cursor-not-allowed'
                : 'bg-indigo-600 hover:bg-indigo-700 text-white cursor-pointer'
            }`}
          >
            <i className="bi bi-download" />
            <span>Exportar CSV</span>
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-sm">
          <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">Tráfego Total</span>
          <p className="text-2xl font-bold text-sky-400 mt-1 font-mono">{topDevices.length > 0 ? '1.24 TB' : '0.00 GB'}</p>
          <span className="text-[10px] text-slate-400">Download + Upload</span>
        </div>
        <div className="bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-sm">
          <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">Total Download</span>
          <p className="text-2xl font-bold text-emerald-400 mt-1 font-mono">{topDevices.length > 0 ? '1.08 TB' : '0.00 GB'}</p>
          <span className="text-[10px] text-slate-400 font-semibold">{topDevices.length > 0 ? '87% do tráfego' : '0%'}</span>
        </div>
        <div className="bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-sm">
          <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">Total Upload</span>
          <p className="text-2xl font-bold text-indigo-400 mt-1 font-mono">{topDevices.length > 0 ? '164 GB' : '0.00 GB'}</p>
          <span className="text-[10px] text-slate-400">{topDevices.length > 0 ? '13% do tráfego' : '0%'}</span>
        </div>
        <div className="bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-sm">
          <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">Pico de Banda</span>
          <p className="text-2xl font-bold text-amber-400 mt-1 font-mono">{topDevices.length > 0 ? '182 Mbps' : '0 Mbps'}</p>
          <span className="text-[10px] text-slate-400">{topDevices.length > 0 ? 'Horário de pico' : 'Nenhum pico registrado'}</span>
        </div>
      </div>

      {/* Top Consuming Devices Table */}
      <div className="bg-white dark:bg-slate-900/60 backdrop-blur-xl border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm">
        <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-800 dark:text-white">
            Top Dispositivos com Maior Consumo de Internet
          </h3>
          <span className="text-xs text-slate-400">Ranking por volume de dados</span>
        </div>

        {topDevices.length === 0 ? (
          <div className="p-12 text-center text-slate-400 space-y-2">
            <i className="bi bi-reception-0 text-3xl text-slate-500" />
            <p className="text-sm font-medium text-slate-300">Nenhum tráfego registrado no período</p>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Conecte seu concentrador MikroTik para começar a monitorar o consumo individual de dados por cliente.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left text-slate-600 dark:text-slate-300">
              <thead>
                <tr className="bg-slate-100 dark:bg-slate-800/90 border-b border-slate-200 dark:border-slate-800 text-[10px] uppercase font-bold text-slate-500">
                  <th className="px-5 py-3">Posição</th>
                  <th className="px-5 py-3">Dispositivo / Cliente</th>
                  <th className="px-5 py-3">MAC Address</th>
                  <th className="px-5 py-3">Download</th>
                  <th className="px-5 py-3">Upload</th>
                  <th className="px-5 py-3 text-right">Total Trafegado</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                {topDevices.map((d) => (
                  <tr key={d.rank} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                    <td className="px-5 py-3 whitespace-nowrap">
                      <span className="w-5 h-5 rounded-full bg-slate-200 dark:bg-slate-800 flex items-center justify-center font-bold text-[10px]">
                        {d.rank}
                      </span>
                    </td>
                    <td className="px-5 py-3 font-semibold text-slate-800 dark:text-white whitespace-nowrap">
                      {d.cliente}
                    </td>
                    <td className="px-5 py-3 font-mono text-indigo-400 whitespace-nowrap">{d.mac}</td>
                    <td className="px-5 py-3 font-mono text-emerald-400 whitespace-nowrap">{d.download}</td>
                    <td className="px-5 py-3 font-mono text-slate-400 whitespace-nowrap">{d.upload}</td>
                    <td className="px-5 py-3 font-mono font-bold text-sky-400 text-right whitespace-nowrap">
                      {d.total}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
