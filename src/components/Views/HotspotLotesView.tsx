import React, { useState, useMemo } from 'react'

export interface VoucherItem {
  id: string
  codigo: string
  plano: string
  valor: number
  lote_id: string
  status: 'disponivel' | 'ativo' | 'expirado'
  usado_por?: string
  criado_em: string
  expira_em?: string
}

export interface LoteItem {
  id: string
  codigo_lote: string
  plano: string
  quantidade: number
  usados: number
  criado_em: string
  tipo: 'impresso' | 'pix'
}

interface HotspotLotesViewProps {
  mode?: 'lotes' | 'lotespix' | 'vouchers'
}

export const HotspotLotesView: React.FC<HotspotLotesViewProps> = ({ mode = 'vouchers' }) => {
  const [lotes, setLotes] = useState<LoteItem[]>(() => {
    try {
      const saved = localStorage.getItem('wfv_lotes')
      if (!saved) return []
      const parsed = JSON.parse(saved)
      return Array.isArray(parsed) ? parsed.filter((l: LoteItem) => !l.id?.startsWith('lote-')) : []
    } catch {
      return []
    }
  })

  const [vouchers, setVouchers] = useState<VoucherItem[]>(() => {
    try {
      const saved = localStorage.getItem('wfv_vouchers_list')
      if (!saved) return []
      const parsed = JSON.parse(saved)
      return Array.isArray(parsed) ? parsed.filter((v: VoucherItem) => !['v1', 'v2', 'v3', 'v4', 'v5'].includes(v.id)) : []
    } catch {
      return []
    }
  })

  const [activeTab, setActiveTab] = useState<'vouchers' | 'lotes'>(
    mode === 'lotes' || mode === 'lotespix' ? 'lotes' : 'vouchers'
  )
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('todos')
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showPrintModal, setShowPrintModal] = useState(false)
  const [showExportModal, setShowExportModal] = useState(false)
  const [exportLoteFilter, setExportLoteFilter] = useState('todos')
  const [copiedExport, setCopiedExport] = useState(false)
  const [selectedLote, setSelectedLote] = useState<LoteItem | null>(null)

  // Form states
  const [formPlano, setFormPlano] = useState('2 Horas Padrão')
  const [formValor, setFormValor] = useState('5.00')
  const [formQtd, setFormQtd] = useState('25')
  const [formPrefixo, setFormPrefixo] = useState('CMS')
  const [feedback, setFeedback] = useState<string | null>(null)

  const getMikrotikExportScript = () => {
    const list = exportLoteFilter === 'todos'
      ? vouchers
      : vouchers.filter((v) => v.lote_id === exportLoteFilter)

    const lines = [
      '# ============================================================== ',
      '# CMS_HOTSPOT - SCRIPT DE IMPORTAÇÃO DE VOUCHERS PARA MIKROTIK',
      `# Total de Vouchers: ${list.length}`,
      '# Cole este código no New Terminal do WinBox',
      '# ============================================================== ',
      '/ip hotspot user',
    ]

    list.forEach((v) => {
      let profile = 'Plano-2H'
      let limitUptime = '2h'
      if (v.plano.includes('1 Hora')) { profile = 'Plano-1H'; limitUptime = '1h' }
      else if (v.plano.includes('12 Horas')) { profile = 'Plano-12H'; limitUptime = '12h' }
      else if (v.plano.includes('24 Horas')) { profile = 'Plano-24H'; limitUptime = '24h' }
      else if (v.plano.includes('7 Dias')) { profile = 'Plano-7D'; limitUptime = '7d' }

      lines.push(`add name="${v.codigo}" password="${v.codigo}" profile="${profile}" limit-uptime=${limitUptime} comment="Lote ${v.lote_id}"`)
    })

    return lines.join('\n')
  }

  const handleCopyMikrotikScript = () => {
    navigator.clipboard.writeText(getMikrotikExportScript())
    setCopiedExport(true)
    setTimeout(() => setCopiedExport(false), 2500)
  }

  const handleDownloadVouchersRsc = () => {
    const script = getMikrotikExportScript()
    const blob = new Blob([script], { type: 'text/plain;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `vouchers_mikrotik_${exportLoteFilter.toLowerCase()}.rsc`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const persistLotes = (data: LoteItem[]) => {
    setLotes(data)
    try {
      localStorage.setItem('wfv_lotes', JSON.stringify(data))
    } catch {}
  }

  const persistVouchers = (data: VoucherItem[]) => {
    setVouchers(data)
    try {
      localStorage.setItem('wfv_vouchers_list', JSON.stringify(data))
    } catch {}
  }

  const filteredVouchers = useMemo(() => {
    const q = searchTerm.toLowerCase().trim()
    return vouchers.filter((v) => {
      const matchesSearch =
        !q ||
        v.codigo.toLowerCase().includes(q) ||
        v.plano.toLowerCase().includes(q) ||
        (v.usado_por && v.usado_por.toLowerCase().includes(q))
      const matchesStatus = statusFilter === 'todos' || v.status === statusFilter
      return matchesSearch && matchesStatus
    })
  }, [vouchers, searchTerm, statusFilter])

  const filteredLotes = useMemo(() => {
    if (mode === 'lotespix') return lotes.filter((l) => l.tipo === 'pix')
    if (mode === 'lotes') return lotes.filter((l) => l.tipo === 'impresso')
    return lotes
  }, [lotes, mode])

  const handleGenerateBatch = (e: React.FormEvent) => {
    e.preventDefault()
    const qtd = parseInt(formQtd, 10) || 10
    const loteCode = `LOTE-${new Date().getFullYear()}-${String(lotes.length + 1).padStart(3, '0')}`
    const valorNum = parseFloat(formValor) || 5.0

    const newLote: LoteItem = {
      id: `lote-${Date.now()}`,
      codigo_lote: loteCode,
      plano: formPlano,
      quantidade: qtd,
      usados: 0,
      criado_em: new Date().toISOString().split('T')[0],
      tipo: 'impresso',
    }

    const newVouchers: VoucherItem[] = []
    for (let i = 0; i < qtd; i++) {
      const randStr = Math.random().toString(36).substring(2, 6).toUpperCase()
      const randNum = Math.floor(1000 + Math.random() * 9000)
      newVouchers.push({
        id: `v-${Date.now()}-${i}`,
        codigo: `${formPrefixo}-${randNum}-${randStr}`,
        plano: formPlano,
        valor: valorNum,
        lote_id: loteCode,
        status: 'disponivel',
        criado_em: new Date().toLocaleString('pt-BR'),
      })
    }

    persistLotes([newLote, ...lotes])
    persistVouchers([...newVouchers, ...vouchers])
    setShowCreateModal(false)
    setFeedback(`Lote ${loteCode} com ${qtd} vouchers gerado com sucesso!`)
    setTimeout(() => setFeedback(null), 3500)
  }

  const handleDeleteLote = (id: string, code: string) => {
    if (window.confirm(`Excluir o lote "${code}" e seus vouchers não utilizados?`)) {
      persistLotes(lotes.filter((l) => l.id !== id))
      persistVouchers(vouchers.filter((v) => v.lote_id !== code))
      setFeedback('Lote removido.')
      setTimeout(() => setFeedback(null), 3000)
    }
  }

  const handleDeleteVoucher = (id: string) => {
    persistVouchers(vouchers.filter((v) => v.id !== id))
  }

  const openPrint = (l: LoteItem) => {
    setSelectedLote(l)
    setShowPrintModal(true)
  }

  const vouchersOfSelectedLote = useMemo(() => {
    if (!selectedLote) return []
    return vouchers.filter((v) => v.lote_id === selectedLote.codigo_lote)
  }, [vouchers, selectedLote])

  return (
    <div className="space-y-6">
      {/* Header and Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-slate-800 dark:text-white flex items-center gap-2">
            <i className="bi bi-ticket-detailed text-indigo-400" />
            {mode === 'lotespix'
              ? 'Lotes de Vouchers PIX Automáticos'
              : mode === 'lotes'
              ? 'Lotes de Vouchers para Impressão'
              : 'Gestão de Vouchers & Códigos de Acesso'}
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Gere lotes para impressão térmica, consulte vouchers ativos e controle códigos emitidos.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 self-start sm:self-auto">
          <button
            type="button"
            onClick={() => setShowExportModal(true)}
            className="px-3.5 py-2 bg-sky-600/15 hover:bg-sky-600/25 text-sky-400 border border-sky-500/30 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer shadow-xs"
          >
            <i className="bi bi-broadcast-pin text-sm" />
            <span>Exportar para MikroTik (.rsc)</span>
          </button>

          <button
            type="button"
            onClick={() => setShowCreateModal(true)}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold shadow-lg shadow-indigo-600/20 transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <i className="bi bi-plus-lg text-sm" />
            <span>+ Gerar Lote de Vouchers</span>
          </button>
        </div>
      </div>

      {feedback && (
        <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs flex items-center gap-2 animate-in fade-in">
          <i className="bi bi-check-circle-fill text-base flex-shrink-0" />
          <span>{feedback}</span>
        </div>
      )}

      {/* Stats Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-sm">
          <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">Total de Vouchers</span>
          <p className="text-2xl font-bold text-slate-800 dark:text-white mt-1">{vouchers.length}</p>
          <span className="text-[10px] text-slate-400">No banco de dados</span>
        </div>
        <div className="bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-sm">
          <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">Disponíveis</span>
          <p className="text-2xl font-bold text-emerald-400 mt-1">
            {vouchers.filter((v) => v.status === 'disponivel').length}
          </p>
          <span className="text-[10px] text-emerald-400/80 font-semibold">Prontos para uso</span>
        </div>
        <div className="bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-sm">
          <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">Ativos / Conectados</span>
          <p className="text-2xl font-bold text-indigo-400 mt-1">
            {vouchers.filter((v) => v.status === 'ativo').length}
          </p>
          <span className="text-[10px] text-slate-400">Navegando no hotspot</span>
        </div>
        <div className="bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-sm">
          <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">Lotes Criados</span>
          <p className="text-2xl font-bold text-sky-400 mt-1">{lotes.length}</p>
          <span className="text-[10px] text-slate-400">Físicos e digitais</span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200 dark:border-slate-800 gap-6 text-xs font-semibold">
        <button
          type="button"
          onClick={() => setActiveTab('vouchers')}
          className={`pb-3 transition-colors border-b-2 cursor-pointer flex items-center gap-1.5 ${
            activeTab === 'vouchers'
              ? 'border-indigo-500 text-indigo-500 dark:text-indigo-400'
              : 'border-transparent text-slate-400 hover:text-slate-600 dark:hover:text-slate-300'
          }`}
        >
          <i className="bi bi-upc text-sm" />
          <span>Vouchers Individuais ({vouchers.length})</span>
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('lotes')}
          className={`pb-3 transition-colors border-b-2 cursor-pointer flex items-center gap-1.5 ${
            activeTab === 'lotes'
              ? 'border-indigo-500 text-indigo-500 dark:text-indigo-400'
              : 'border-transparent text-slate-400 hover:text-slate-600 dark:hover:text-slate-300'
          }`}
        >
          <i className="bi bi-collection text-sm" />
          <span>Controle de Lotes ({filteredLotes.length})</span>
        </button>
      </div>

      {/* Tab: Vouchers Individuais */}
      {activeTab === 'vouchers' && (
        <div className="bg-white dark:bg-slate-900/60 backdrop-blur-xl border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm">
          <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="relative min-w-[240px]">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <i className="bi bi-search text-xs" />
              </span>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Buscar por código ou dispositivo..."
                className="w-full pl-8 pr-3 py-1.5 text-xs rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-400">Status:</span>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-1.5 text-xs text-slate-800 dark:text-slate-100 outline-none"
              >
                <option value="todos">Todos</option>
                <option value="disponivel">Disponível</option>
                <option value="ativo">Ativo (Em Uso)</option>
                <option value="expirado">Expirado</option>
              </select>
            </div>
          </div>

          {filteredVouchers.length === 0 ? (
            <div className="p-12 text-center text-slate-400 space-y-2">
              <i className="bi bi-ticket-perforated text-3xl text-slate-500" />
              <p className="text-sm font-medium text-slate-300">Nenhum voucher gerado ainda</p>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Clique no botão <strong>Gerar Novo Lote de Vouchers</strong> acima para criar vouchers reais para seus clientes.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left text-slate-600 dark:text-slate-300">
                <thead>
                  <tr className="bg-slate-100 dark:bg-slate-800/90 border-b border-slate-200 dark:border-slate-800 text-[10px] uppercase font-bold text-slate-500 dark:text-slate-400 tracking-wider">
                    <th className="px-5 py-3">Código Voucher</th>
                    <th className="px-5 py-3">Plano</th>
                    <th className="px-5 py-3">Valor</th>
                    <th className="px-5 py-3 hidden md:table-cell">Lote</th>
                    <th className="px-5 py-3 hidden lg:table-cell">Dispositivo (MAC)</th>
                    <th className="px-5 py-3">Status</th>
                    <th className="px-5 py-3 text-right">Ação</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                  {filteredVouchers.map((v) => (
                    <tr key={v.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors">
                      <td className="px-5 py-3 font-mono font-bold text-indigo-400 whitespace-nowrap">
                        {v.codigo}
                      </td>
                      <td className="px-5 py-3 whitespace-nowrap font-medium text-slate-800 dark:text-white">
                        {v.plano}
                      </td>
                      <td className="px-5 py-3 font-mono font-bold text-emerald-400 whitespace-nowrap">
                        R$ {v.valor.toFixed(2).replace('.', ',')}
                      </td>
                      <td className="px-5 py-3 font-mono text-slate-500 dark:text-slate-400 hidden md:table-cell whitespace-nowrap">
                        {v.lote_id}
                      </td>
                      <td className="px-5 py-3 font-mono text-slate-400 hidden lg:table-cell whitespace-nowrap">
                        {v.usado_por || '—'}
                      </td>
                      <td className="px-5 py-3 whitespace-nowrap">
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                            v.status === 'ativo'
                              ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                              : v.status === 'disponivel'
                              ? 'bg-indigo-500/15 text-indigo-400 border border-indigo-500/30'
                              : 'bg-slate-500/15 text-slate-400'
                          }`}
                        >
                          {v.status === 'ativo'
                            ? 'Conectado'
                            : v.status === 'disponivel'
                            ? 'Disponível'
                            : 'Expirado'}
                        </span>
                      </td>
                      <td className="px-5 py-3 text-right whitespace-nowrap">
                        <button
                          type="button"
                          onClick={() => handleDeleteVoucher(v.id)}
                          className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors cursor-pointer"
                          title="Excluir"
                        >
                          <i className="bi bi-trash3 text-xs" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Tab: Controle de Lotes */}
      {activeTab === 'lotes' && (
        <div className="bg-white dark:bg-slate-900/60 backdrop-blur-xl border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm">
          {filteredLotes.length === 0 ? (
            <div className="p-12 text-center text-slate-400 space-y-2">
              <i className="bi bi-collection text-3xl text-slate-500" />
              <p className="text-sm font-medium text-slate-300">Nenhum lote gerado ainda</p>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Crie um lote de vouchers clicando no botão <strong>Gerar Novo Lote de Vouchers</strong> acima.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
            <table className="w-full text-xs text-left text-slate-600 dark:text-slate-300">
              <thead>
                <tr className="bg-slate-100 dark:bg-slate-800/90 border-b border-slate-200 dark:border-slate-800 text-[10px] uppercase font-bold text-slate-500 dark:text-slate-400 tracking-wider">
                  <th className="px-5 py-3">Código do Lote</th>
                  <th className="px-5 py-3">Plano Vinculado</th>
                  <th className="px-5 py-3">Quantidade</th>
                  <th className="px-5 py-3">Utilizados</th>
                  <th className="px-5 py-3 hidden sm:table-cell">Tipo</th>
                  <th className="px-5 py-3 hidden md:table-cell">Data de Geração</th>
                  <th className="px-5 py-3 text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                {filteredLotes.map((l) => (
                  <tr key={l.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors">
                    <td className="px-5 py-3 font-mono font-bold text-slate-800 dark:text-white whitespace-nowrap">
                      {l.codigo_lote}
                    </td>
                    <td className="px-5 py-3 whitespace-nowrap font-medium text-indigo-400">{l.plano}</td>
                    <td className="px-5 py-3 whitespace-nowrap font-semibold">{l.quantidade} vouchers</td>
                    <td className="px-5 py-3 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold">{l.usados}</span>
                        <div className="w-16 h-1.5 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
                          <div
                            className="h-full bg-emerald-500 rounded-full"
                            style={{ width: `${Math.min(100, (l.usados / l.quantidade) * 100)}%` }}
                          />
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-3 whitespace-nowrap hidden sm:table-cell">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-slate-100 dark:bg-slate-800 text-slate-400 uppercase">
                        {l.tipo}
                      </span>
                    </td>
                    <td className="px-5 py-3 whitespace-nowrap hidden md:table-cell font-mono text-slate-400">
                      {l.criado_em}
                    </td>
                    <td className="px-5 py-3 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          type="button"
                          onClick={() => openPrint(l)}
                          className="px-2.5 py-1 text-xs font-semibold bg-indigo-600/15 text-indigo-400 hover:bg-indigo-600/25 border border-indigo-500/30 rounded-lg transition-colors cursor-pointer flex items-center gap-1"
                        >
                          <i className="bi bi-printer" />
                          <span>Imprimir</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteLote(l.id, l.codigo_lote)}
                          className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors cursor-pointer"
                        >
                          <i className="bi bi-trash3 text-xs" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          )}
        </div>
      )}

      {/* Modal Gerar Lote */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in">
          <div className="relative w-full max-w-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-2xl">
            <button
              type="button"
              onClick={() => setShowCreateModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-200"
            >
              <i className="bi bi-x-lg text-base" />
            </button>

            <div className="flex items-center gap-2.5 mb-5">
              <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400">
                <i className="bi bi-upc-scan text-lg" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-800 dark:text-white">Gerar Novo Lote</h3>
                <p className="text-xs text-slate-400">Crie códigos em lote para impressão ou venda</p>
              </div>
            </div>

            <form onSubmit={handleGenerateBatch} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
                  Plano Vinculado *
                </label>
                <select
                  value={formPlano}
                  onChange={(e) => setFormPlano(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-800 dark:text-white outline-none focus:ring-1 focus:ring-indigo-500"
                >
                  <option value="1 Hora Básico">1 Hora Básico (R$ 3,00)</option>
                  <option value="2 Horas Padrão">2 Horas Padrão (R$ 5,00)</option>
                  <option value="12 Horas VIP">12 Horas VIP (R$ 15,00)</option>
                  <option value="24 Horas Turbo">24 Horas Turbo (R$ 25,00)</option>
                  <option value="7 Dias Semanal">7 Dias Semanal (R$ 60,00)</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
                    Quantidade de Vouchers
                  </label>
                  <select
                    value={formQtd}
                    onChange={(e) => setFormQtd(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-800 dark:text-white outline-none focus:ring-1 focus:ring-indigo-500"
                  >
                    <option value="10">10 Vouchers</option>
                    <option value="25">25 Vouchers</option>
                    <option value="50">50 Vouchers</option>
                    <option value="100">100 Vouchers</option>
                    <option value="200">200 Vouchers</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
                    Prefixo do Código
                  </label>
                  <input
                    type="text"
                    value={formPrefixo}
                    onChange={(e) => setFormPrefixo(e.target.value.toUpperCase())}
                    placeholder="CMS"
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-800 dark:text-white outline-none focus:ring-1 focus:ring-indigo-500 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
                  Valor Unitário do Voucher (R$)
                </label>
                <input
                  type="number"
                  step="0.50"
                  value={formValor}
                  onChange={(e) => setFormValor(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-800 dark:text-white outline-none focus:ring-1 focus:ring-indigo-500 font-mono font-bold"
                />
              </div>

              <div className="flex justify-end gap-2.5 pt-3 border-t border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-xl text-xs font-semibold hover:bg-slate-200 dark:hover:bg-slate-700"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold shadow-lg shadow-indigo-600/20 flex items-center gap-1.5"
                >
                  <i className="bi bi-check-lg" />
                  Gerar Lote Agora
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Impressão de Lote */}
      {showPrintModal && selectedLote && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in">
          <div className="relative w-full max-w-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-2xl max-h-[85vh] flex flex-col">
            <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <i className="bi bi-printer text-indigo-400 text-lg" />
                <h3 className="text-base font-bold text-slate-800 dark:text-white">
                  Impressão de Vouchers — {selectedLote.codigo_lote}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowPrintModal(false)}
                className="text-slate-400 hover:text-slate-200"
              >
                <i className="bi bi-x-lg text-base" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto py-4">
              <p className="text-xs text-slate-400 mb-3">
                Folha de vouchers formatada para recorte ou impressão térmica:
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {vouchersOfSelectedLote.map((v) => (
                  <div
                    key={v.id}
                    className="border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-xl p-3 text-center bg-slate-50 dark:bg-slate-800/40 space-y-1"
                  >
                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                      CMS_HOTSPOT WI-FI
                    </p>
                    <p className="text-xs font-semibold text-slate-700 dark:text-slate-300">{v.plano}</p>
                    <div className="my-1.5 p-1.5 bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-700">
                      <p className="text-sm font-extrabold font-mono text-indigo-500 tracking-wider">
                        {v.codigo}
                      </p>
                    </div>
                    <p className="text-[10px] text-emerald-500 font-bold">
                      R$ {v.valor.toFixed(2).replace('.', ',')}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-between items-center pt-4 border-t border-slate-200 dark:border-slate-800">
              <span className="text-xs text-slate-400">
                {vouchersOfSelectedLote.length} vouchers prontos para impressão
              </span>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setShowPrintModal(false)}
                  className="px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-xl text-xs font-semibold hover:bg-slate-200 dark:hover:bg-slate-700"
                >
                  Fechar
                </button>
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold shadow-lg shadow-indigo-600/20 flex items-center gap-1.5 cursor-pointer"
                >
                  <i className="bi bi-printer-fill" />
                  <span>Imprimir Agora</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Exportação para MikroTik RouterOS */}
      {showExportModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl w-full max-w-2xl p-6 shadow-2xl space-y-4 max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-sky-500/15 text-sky-400">
                  <i className="bi bi-broadcast-pin text-lg" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-800 dark:text-white">
                    Exportar Vouchers para MikroTik RouterOS
                  </h3>
                  <p className="text-xs text-slate-400">
                    Gera os comandos prontos para cadastrar os clientes no Hotspot User do MikroTik
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowExportModal(false)}
                className="text-slate-400 hover:text-slate-200 cursor-pointer p-1"
              >
                <i className="bi bi-x-lg text-base" />
              </button>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2">
                <span className="text-slate-400 font-medium">Filtrar Lote:</span>
                <select
                  value={exportLoteFilter}
                  onChange={(e) => setExportLoteFilter(e.target.value)}
                  className="bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-800 dark:text-white outline-none"
                >
                  <option value="todos">Todos os Vouchers ({vouchers.length})</option>
                  {lotes.map((l) => (
                    <option key={l.id} value={l.codigo_lote}>
                      {l.codigo_lote} - {l.plano} ({l.quantidade} vouchers)
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleDownloadVouchersRsc}
                  className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-sky-400 border border-sky-500/30 rounded-lg font-semibold flex items-center gap-1.5 cursor-pointer"
                >
                  <i className="bi bi-download" />
                  <span>Baixar .rsc</span>
                </button>
                <button
                  type="button"
                  onClick={handleCopyMikrotikScript}
                  className="px-3.5 py-1.5 bg-sky-600 hover:bg-sky-700 text-white rounded-lg font-semibold shadow-xs flex items-center gap-1.5 cursor-pointer"
                >
                  <i className={`bi ${copiedExport ? 'bi-check-lg' : 'bi-clipboard'}`} />
                  <span>{copiedExport ? 'Copiado!' : 'Copiar Comandos'}</span>
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-hidden flex flex-col">
              <pre className="flex-1 p-3.5 bg-slate-950 text-emerald-400 rounded-xl text-xs font-mono overflow-auto border border-slate-800 leading-relaxed max-h-72 select-all">
                {getMikrotikExportScript()}
              </pre>
            </div>

            <div className="p-3 bg-sky-950/20 border border-sky-500/20 rounded-xl text-xs text-slate-300 space-y-1">
              <strong className="text-sky-400 flex items-center gap-1">
                <i className="bi bi-info-circle" /> Como aplicar no seu MikroTik:
              </strong>
              <p className="text-[11px] text-slate-400">
                1. No WinBox, abra o menu <strong>New Terminal</strong>.<br />
                2. Clique com botão direito e selecione <strong>Paste</strong> (ou pressione Shift+Insert).<br />
                3. Os vouchers serão criados em <code>/ip hotspot user</code> e os clientes já podem navegar!
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
