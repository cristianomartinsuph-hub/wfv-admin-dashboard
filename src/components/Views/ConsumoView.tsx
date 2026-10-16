import React, { useState } from 'react'

export const ConsumoView: React.FC = () => {
  const [periodo, setPeriodo] = useState('7d')

  const topDevices = [
    { rank: 1, mac: '74:D4:35:88:99:A1', cliente: 'Smart TV Recepção', download: '142.5 GB', upload: '12.8 GB', total: '155.3 GB' },
    { rank: 2, mac: 'FC:E8:29:10:99:BB', cliente: 'iPhone 14 (Hóspede 302)', download: '48.2 GB', upload: '5.1 GB', total: '53.3 GB' },
    { rank: 3, mac: 'BC:D0:74:11:22:33', cliente: 'Notebook Dell Gerência', download: '35.6 GB', upload: '8.4 GB', total: '44.0 GB' },
    { rank: 4, mac: '28:6F:7F:31:AA:CC', cliente: 'Galaxy S23 Ultra', download: '28.9 GB', upload: '4.2 GB', total: '33.1 GB' },
    { rank: 5, mac: '40:88:05:6E:71:32', cliente: 'MacBook Air M2', download: '22.1 GB', upload: '3.7 GB', total: '25.8 GB' },
  ]

  const handleExportCsv = () => {
    let csv = 'Rank,MAC,Dispositivo,Download,Upload,Total\n'
    topDevices.forEach((d) => {
      csv += `${d.rank},"${d.mac}","${d.cliente}","${d.download}","${d.upload}","${d.total}"\n`
    })
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `relatorio-consumo-wfv-${periodo}.csv`
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
            className="px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold shadow-sm transition-all flex items-center gap-1.5 cursor-pointer"
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
          <p className="text-2xl font-bold text-sky-400 mt-1 font-mono">1.24 TB</p>
          <span className="text-[10px] text-slate-400">Download + Upload</span>
        </div>
        <div className="bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-sm">
          <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">Total Download</span>
          <p className="text-2xl font-bold text-emerald-400 mt-1 font-mono">1.08 TB</p>
          <span className="text-[10px] text-emerald-400 font-semibold">87% do tráfego</span>
        </div>
        <div className="bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-sm">
          <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">Total Upload</span>
          <p className="text-2xl font-bold text-indigo-400 mt-1 font-mono">164 GB</p>
          <span className="text-[10px] text-slate-400">13% do tráfego</span>
        </div>
        <div className="bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-sm">
          <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">Pico de Banda</span>
          <p className="text-2xl font-bold text-amber-400 mt-1 font-mono">182 Mbps</p>
          <span className="text-[10px] text-slate-400">Às 21:30 no Shopping Norte</span>
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
      </div>
    </div>
  )
}
