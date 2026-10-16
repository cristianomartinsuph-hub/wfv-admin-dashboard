import React, { useState, useMemo } from 'react'
import type { Concentrador } from '../../types/dashboard'

interface ConcentradoresTableProps {
  concentradores: Concentrador[]
}

type SortCol = 'online' | 'apelido' | 'identidade' | 'cidade' | 'ip' | 'uptime' | 'vpn_updateonline'
type SortDir = 'asc' | 'desc'

export const ConcentradoresTable: React.FC<ConcentradoresTableProps> = ({ concentradores }) => {
  const [searchTerm, setSearchTerm] = useState('')
  const [sortCol, setSortCol] = useState<SortCol>('online')
  const [sortDir, setSortDir] = useState<SortDir>('desc')

  const handleSort = (col: SortCol) => {
    if (sortCol === col) {
      setSortDir(sortDir === 'asc' ? 'desc' : 'asc')
    } else {
      setSortCol(col)
      setSortDir('asc')
    }
  }

  const filteredAndSorted = useMemo(() => {
    return concentradores
      .filter((item) => {
        const query = searchTerm.toLowerCase().trim()
        if (!query) return true
        return (
          item.apelido.toLowerCase().includes(query) ||
          item.identidade.toLowerCase().includes(query) ||
          item.cidade.toLowerCase().includes(query) ||
          item.ip.toLowerCase().includes(query) ||
          item.modelo.toLowerCase().includes(query)
        )
      })
      .sort((a, b) => {
        let comparison = 0
        if (sortCol === 'online') {
          comparison = a.online - b.online
        } else if (sortCol === 'ip') {
          const toInt = (ip: string) =>
            ip.split('.').reduce((acc, oct) => acc * 256 + (parseInt(oct, 10) || 0), 0)
          comparison = toInt(a.ip) - toInt(b.ip)
        } else if (sortCol === 'vpn_updateonline') {
          comparison = new Date(a.vpn_updateonline).getTime() - new Date(b.vpn_updateonline).getTime()
        } else {
          comparison = String(a[sortCol]).localeCompare(String(b[sortCol]), 'pt-BR')
        }
        return sortDir === 'asc' ? comparison : -comparison
      })
  }, [concentradores, searchTerm, sortCol, sortDir])

  const renderSortIcon = (col: SortCol) => {
    if (sortCol !== col) {
      return <i className="bi bi-arrow-down-up text-[10px] opacity-40 ml-1.5" />
    }
    return (
      <i
        className={`bi ${
          sortDir === 'asc' ? 'bi-arrow-up' : 'bi-arrow-down'
        } text-[10px] text-indigo-400 ml-1.5 font-bold`}
      />
    )
  }

  return (
    <div
      id="ov-tabela-concentradores"
      className="bg-white dark:bg-slate-900/60 backdrop-blur-xl border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm transition-all duration-300"
    >
      {/* Table Header and Search */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-6 py-4 border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-sky-500/10 text-sky-400">
            <i className="bi bi-router text-base" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-slate-800 dark:text-slate-100">
              Concentradores & Equipamentos
            </h2>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              Status de sincronização dos gateways MikroTik, Omada e Grandstream
            </p>
          </div>
        </div>

        {/* Search input */}
        <div className="relative min-w-[220px]">
          <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
            <i className="bi bi-search text-xs" />
          </span>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar por IP, nome, cidade..."
            className="w-full pl-8 pr-3 py-1.5 text-xs rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-colors"
          />
        </div>
      </div>

      {/* Table Content */}
      <div className="overflow-x-auto">
        <table className="w-full text-xs text-left text-slate-600 dark:text-slate-300">
          <thead>
            <tr className="bg-slate-100 dark:bg-slate-800/90 border-b border-slate-200 dark:border-slate-800 text-[10px] uppercase font-bold text-slate-500 dark:text-slate-400 tracking-wider">
              <th
                onClick={() => handleSort('online')}
                className="px-5 py-3 cursor-pointer hover:text-indigo-400 select-none whitespace-nowrap"
              >
                Status {renderSortIcon('online')}
              </th>
              <th
                onClick={() => handleSort('apelido')}
                className="px-5 py-3 cursor-pointer hover:text-indigo-400 select-none whitespace-nowrap"
              >
                Apelido {renderSortIcon('apelido')}
              </th>
              <th
                onClick={() => handleSort('identidade')}
                className="px-5 py-3 cursor-pointer hover:text-indigo-400 select-none whitespace-nowrap hidden md:table-cell"
              >
                Identidade / Modelo {renderSortIcon('identidade')}
              </th>
              <th
                onClick={() => handleSort('cidade')}
                className="px-5 py-3 cursor-pointer hover:text-indigo-400 select-none whitespace-nowrap hidden lg:table-cell"
              >
                Cidade {renderSortIcon('cidade')}
              </th>
              <th
                onClick={() => handleSort('ip')}
                className="px-5 py-3 cursor-pointer hover:text-indigo-400 select-none whitespace-nowrap hidden sm:table-cell"
              >
                IP {renderSortIcon('ip')}
              </th>
              <th
                onClick={() => handleSort('uptime')}
                className="px-5 py-3 cursor-pointer hover:text-indigo-400 select-none whitespace-nowrap hidden md:table-cell"
              >
                Uptime {renderSortIcon('uptime')}
              </th>
              <th
                onClick={() => handleSort('vpn_updateonline')}
                className="px-5 py-3 cursor-pointer hover:text-indigo-400 select-none whitespace-nowrap"
              >
                Última comunicação {renderSortIcon('vpn_updateonline')}
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
            {filteredAndSorted.length === 0 ? (
              <tr>
                <td colSpan={7} className="text-center py-8 text-slate-400 text-xs">
                  Nenhum concentrador encontrado.
                </td>
              </tr>
            ) : (
              filteredAndSorted.map((item) => (
                <tr
                  key={item.id}
                  className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors"
                >
                  <td className="px-5 py-3 whitespace-nowrap">
                    {item.online === 1 ? (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/15 border border-emerald-500/30 text-emerald-400">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                        ON
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-rose-500/15 border border-rose-500/30 text-rose-400">
                        <span className="w-1.5 h-1.5 rounded-full bg-rose-400" />
                        OFF
                      </span>
                    )}
                  </td>
                  <td className="px-5 py-3 font-semibold text-slate-800 dark:text-slate-100 whitespace-nowrap">
                    {item.apelido}
                  </td>
                  <td className="px-5 py-3 text-slate-500 dark:text-slate-400 hidden md:table-cell whitespace-nowrap">
                    <span className="font-mono text-slate-700 dark:text-slate-300">{item.identidade}</span>
                    <span className="text-[10px] text-slate-400 block">{item.modelo}</span>
                  </td>
                  <td className="px-5 py-3 text-slate-600 dark:text-slate-400 hidden lg:table-cell whitespace-nowrap">
                    {item.cidade}
                  </td>
                  <td className="px-5 py-3 font-mono text-slate-600 dark:text-slate-300 hidden sm:table-cell whitespace-nowrap">
                    {item.ip}
                  </td>
                  <td className="px-5 py-3 font-mono text-slate-600 dark:text-slate-400 hidden md:table-cell whitespace-nowrap">
                    {item.online === 1 ? item.uptime : '—'}
                  </td>
                  <td className="px-5 py-3 font-mono text-slate-500 dark:text-slate-400 whitespace-nowrap">
                    {item.vpn_updateonline}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Table Footer */}
      <div className="px-6 py-3 bg-slate-50 dark:bg-slate-900/90 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
        <span>
          Mostrando <strong>{filteredAndSorted.length}</strong> de{' '}
          <strong>{concentradores.length}</strong> concentradores ativos
        </span>
        <span className="flex items-center gap-1.5">
          <i className="bi bi-shield-check text-emerald-400" />
          Conexões VPN Seguras WireGuard/OpenVPN
        </span>
      </div>
    </div>
  )
}
