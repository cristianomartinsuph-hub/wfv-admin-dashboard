import React, { useState, useMemo } from 'react'
import type { Concentrador } from '../../types/dashboard'

interface ConcentradoresTableProps {
  concentradores: Concentrador[]
  onAddConcentrador?: (c: Concentrador) => void
  onDeleteConcentrador?: (id: string) => void
}

type SortCol = 'online' | 'apelido' | 'identidade' | 'cidade' | 'ip' | 'uptime' | 'vpn_updateonline'
type SortDir = 'asc' | 'desc'

export const ConcentradoresTable: React.FC<ConcentradoresTableProps> = ({
  concentradores,
  onAddConcentrador,
  onDeleteConcentrador,
}) => {
  const [searchTerm, setSearchTerm] = useState('')
  const [sortCol, setSortCol] = useState<SortCol>('online')
  const [sortDir, setSortDir] = useState<SortDir>('desc')
  const [showAddModal, setShowAddModal] = useState(false)

  // New Concentrador Form State
  const [newApelido, setNewApelido] = useState('')
  const [newIdentidade, setNewIdentidade] = useState('')
  const [newModelo, setNewModelo] = useState('MikroTik hEX RB750Gr3')
  const [newCidade, setNewCidade] = useState('')
  const [newIp, setNewIp] = useState('')
  const [newStatus, setNewStatus] = useState<number>(1)

  const handleSort = (col: SortCol) => {
    if (sortCol === col) {
      setSortDir(sortDir === 'asc' ? 'desc' : 'asc')
    } else {
      setSortCol(col)
      setSortDir('asc')
    }
  }

  const handleCreateConcentrador = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newApelido || !newIp) return

    const now = new Date()
    const formattedDate = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`

    const newDevice: Concentrador = {
      id: String(Date.now()),
      online: newStatus,
      apelido: newApelido.trim(),
      identidade: newIdentidade.trim() || newApelido.trim(),
      modelo: newModelo.trim(),
      cidade: newCidade.trim() || 'Principal',
      ip: newIp.trim(),
      uptime: newStatus === 1 ? '1d 02h 15m' : '—',
      vpn_updateonline: formattedDate,
    }

    if (onAddConcentrador) {
      onAddConcentrador(newDevice)
    }

    // Reset form and close modal
    setNewApelido('')
    setNewIdentidade('')
    setNewCidade('')
    setNewIp('')
    setShowAddModal(false)
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

        {/* Actions & Search */}
        <div className="flex items-center gap-2">
          {/* Add Concentrador Button */}
          {onAddConcentrador && (
            <button
              type="button"
              onClick={() => setShowAddModal(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl transition-all shadow-sm shadow-indigo-600/20 whitespace-nowrap cursor-pointer"
            >
              <i className="bi bi-plus-lg text-sm" />
              <span>Adicionar Concentrador</span>
            </button>
          )}

          {/* Search input */}
          <div className="relative min-w-[200px]">
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
              <i className="bi bi-search text-xs" />
            </span>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar por IP, nome..."
              className="w-full pl-8 pr-3 py-1.5 text-xs rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-colors"
            />
          </div>
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
              {onDeleteConcentrador && (
                <th className="px-3 py-3 text-right">Ação</th>
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
            {filteredAndSorted.length === 0 ? (
              <tr>
                <td
                  colSpan={onDeleteConcentrador ? 8 : 7}
                  className="text-center py-12 text-slate-400 text-xs"
                >
                  <div className="flex flex-col items-center justify-center gap-2">
                    <i className="bi bi-router text-3xl text-slate-400/60" />
                    <p className="font-medium text-slate-300">Nenhum concentrador cadastrado</p>
                    <p className="text-[11px] text-slate-500 max-w-sm">
                      Cadastre seu primeiro roteador MikroTik, TP-Link Omada ou Grandstream para iniciar o monitoramento em tempo real.
                    </p>
                    {onAddConcentrador && (
                      <button
                        type="button"
                        onClick={() => setShowAddModal(true)}
                        className="mt-2 px-3 py-1.5 text-xs font-semibold bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors flex items-center gap-1.5"
                      >
                        <i className="bi bi-plus-lg" />
                        Cadastrar Concentrador
                      </button>
                    )}
                  </div>
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
                  {onDeleteConcentrador && (
                    <td className="px-3 py-3 text-right">
                      <button
                        type="button"
                        onClick={() => onDeleteConcentrador(item.id)}
                        className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors"
                        title="Excluir concentrador"
                      >
                        <i className="bi bi-trash3 text-xs" />
                      </button>
                    </td>
                  )}
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
          Conexões VPN Seguras WireGuard / OpenVPN
        </span>
      </div>

      {/* Add Concentrador Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in">
          <div className="relative w-full max-w-lg rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 shadow-2xl">
            <button
              type="button"
              onClick={() => setShowAddModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-200"
            >
              <i className="bi bi-x-lg text-lg" />
            </button>

            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
                <i className="bi bi-router-fill text-lg" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  Cadastrar Concentrador Real
                </h3>
                <p className="text-xs text-slate-400">
                  Adicione as informações do seu roteador MikroTik, TP-Link ou Grandstream
                </p>
              </div>
            </div>

            <form onSubmit={handleCreateConcentrador} className="space-y-3.5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Apelido do Roteador *
                  </label>
                  <input
                    type="text"
                    required
                    value={newApelido}
                    onChange={(e) => setNewApelido(e.target.value)}
                    placeholder="Ex: MikroTik-Matriz"
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    IP / Hostname *
                  </label>
                  <input
                    type="text"
                    required
                    value={newIp}
                    onChange={(e) => setNewIp(e.target.value)}
                    placeholder="Ex: 192.168.88.1"
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-indigo-500 font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Modelo do Equipamento
                  </label>
                  <select
                    value={newModelo}
                    onChange={(e) => setNewModelo(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  >
                    <option value="MikroTik hEX RB750Gr3">MikroTik hEX RB750Gr3</option>
                    <option value="MikroTik hAP ax²">MikroTik hAP ax²</option>
                    <option value="MikroTik RB4011iGS+">MikroTik RB4011iGS+</option>
                    <option value="MikroTik CCR2004-16G-2S+">MikroTik CCR2004-16G-2S+</option>
                    <option value="TP-Link Omada EAP610">TP-Link Omada EAP610</option>
                    <option value="TP-Link Omada EAP650-Outdoor">TP-Link Omada EAP650-Outdoor</option>
                    <option value="Grandstream GWN7660">Grandstream GWN7660</option>
                    <option value="Outro Concentrador / Roteador">Outro Concentrador / Roteador</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Identidade (Host)
                  </label>
                  <input
                    type="text"
                    value={newIdentidade}
                    onChange={(e) => setNewIdentidade(e.target.value)}
                    placeholder="Ex: Core-Router-01"
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-indigo-500 font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Cidade / Localização
                  </label>
                  <input
                    type="text"
                    value={newCidade}
                    onChange={(e) => setNewCidade(e.target.value)}
                    placeholder="Ex: São Paulo - SP"
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Status Inicial
                  </label>
                  <select
                    value={newStatus}
                    onChange={(e) => setNewStatus(Number(e.target.value))}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  >
                    <option value={1}>Online (ON)</option>
                    <option value={0}>Offline (OFF)</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-2.5 pt-3 border-t border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-xl text-xs font-semibold hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold shadow-lg shadow-indigo-600/20 transition-all flex items-center gap-1.5"
                >
                  <i className="bi bi-check-lg" />
                  Salvar Concentrador
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
