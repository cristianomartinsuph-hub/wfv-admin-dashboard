import React, { useState, useMemo } from 'react'

export interface Revenda {
  id: string
  nome: string
  responsavel: string
  telefone: string
  cidade: string
  saldo: number
  comissao_pct: number
  vouchers_vendidos: number
  status: 'ativo' | 'inativo'
  criado_em: string
}

export const HotspotRevendasView: React.FC = () => {
  const [revendas, setRevendas] = useState<Revenda[]>(() => {
    try {
      const saved = localStorage.getItem('wfv_revendas')
      if (!saved) return []
      const parsed = JSON.parse(saved)
      return Array.isArray(parsed) ? parsed.filter((r: Revenda) => !['1', '2', '3'].includes(r.id)) : []
    } catch {
      return []
    }
  })

  const [searchTerm, setSearchTerm] = useState('')
  const [showAddModal, setShowAddModal] = useState(false)
  const [showCreditModal, setShowCreditModal] = useState(false)
  const [selectedRevenda, setSelectedRevenda] = useState<Revenda | null>(null)
  const [creditAmount, setCreditAmount] = useState('50.00')

  // Form states
  const [formNome, setFormNome] = useState('')
  const [formResponsavel, setFormResponsavel] = useState('')
  const [formTelefone, setFormTelefone] = useState('')
  const [formCidade, setFormCidade] = useState('')
  const [formComissao, setFormComissao] = useState('20')
  const [formSaldo, setFormSaldo] = useState('100.00')
  const [feedback, setFeedback] = useState<string | null>(null)

  const persist = (data: Revenda[]) => {
    setRevendas(data)
    try {
      localStorage.setItem('wfv_revendas', JSON.stringify(data))
    } catch {}
  }

  const filtered = useMemo(() => {
    const q = searchTerm.toLowerCase().trim()
    if (!q) return revendas
    return revendas.filter(
      (r) =>
        r.nome.toLowerCase().includes(q) ||
        r.responsavel.toLowerCase().includes(q) ||
        r.cidade.toLowerCase().includes(q)
    )
  }, [revendas, searchTerm])

  const handleAddRevenda = (e: React.FormEvent) => {
    e.preventDefault()
    if (!formNome || !formResponsavel) return

    const newRevenda: Revenda = {
      id: String(Date.now()),
      nome: formNome.trim(),
      responsavel: formResponsavel.trim(),
      telefone: formTelefone.trim() || '+55 (11) 90000-0000',
      cidade: formCidade.trim() || 'Principal',
      saldo: parseFloat(formSaldo) || 0,
      comissao_pct: parseInt(formComissao, 10) || 20,
      vouchers_vendidos: 0,
      status: 'ativo',
      criado_em: new Date().toISOString().split('T')[0],
    }

    persist([newRevenda, ...revendas])
    setShowAddModal(false)
    setFeedback(`Revenda "${newRevenda.nome}" cadastrada com sucesso!`)
    setTimeout(() => setFeedback(null), 3000)
  }

  const handleAddCredit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedRevenda) return
    const valor = parseFloat(creditAmount) || 0

    const updated = revendas.map((r) =>
      r.id === selectedRevenda.id ? { ...r, saldo: r.saldo + valor } : r
    )
    persist(updated)
    setShowCreditModal(false)
    setFeedback(`Crédito de R$ ${valor.toFixed(2)} inserido para ${selectedRevenda.nome}!`)
    setTimeout(() => setFeedback(null), 3000)
  }

  const toggleStatus = (id: string) => {
    const updated = revendas.map((r) =>
      r.id === id ? { ...r, status: r.status === 'ativo' ? ('inativo' as const) : ('ativo' as const) } : r
    )
    persist(updated)
  }

  const handleDelete = (id: string, nome: string) => {
    if (window.confirm(`Excluir revenda "${nome}"?`)) {
      const updated = revendas.filter((r) => r.id !== id)
      persist(updated)
      setFeedback('Revenda excluída.')
      setTimeout(() => setFeedback(null), 3000)
    }
  }

  const totalSaldo = revendas.reduce((acc, r) => acc + r.saldo, 0)
  const totalVendidos = revendas.reduce((acc, r) => acc + r.vouchers_vendidos, 0)

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-slate-800 dark:text-white flex items-center gap-2">
            <i className="bi bi-person-lines-fill text-indigo-400" />
            Gestão de Revendas & Pontos de Venda
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Cadastre parceiros, bancas e quiosques para comercialização de vouchers físicos com comissão.
          </p>
        </div>

        <button
          type="button"
          onClick={() => {
            setFormNome('')
            setFormResponsavel('')
            setFormTelefone('')
            setFormCidade('')
            setShowAddModal(true)
          }}
          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold shadow-lg shadow-indigo-600/20 transition-all flex items-center gap-1.5 self-start sm:self-auto cursor-pointer"
        >
          <i className="bi bi-plus-lg text-sm" />
          <span>+ Nova Revenda</span>
        </button>
      </div>

      {feedback && (
        <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs flex items-center gap-2 animate-in fade-in">
          <i className="bi bi-check-circle-fill text-base flex-shrink-0" />
          <span>{feedback}</span>
        </div>
      )}

      {/* Summary Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-sm">
          <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">Total Revendedores</span>
          <p className="text-2xl font-bold text-slate-800 dark:text-white mt-1">{revendas.length}</p>
          <span className="text-[10px] text-slate-400">Pontos de venda</span>
        </div>
        <div className="bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-sm">
          <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">Saldo em Créditos</span>
          <p className="text-2xl font-bold text-emerald-400 mt-1 font-mono">
            R$ {totalSaldo.toFixed(2).replace('.', ',')}
          </p>
          <span className="text-[10px] text-slate-400">Disponível para emissão</span>
        </div>
        <div className="bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-sm">
          <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">Vouchers Emitidos</span>
          <p className="text-2xl font-bold text-indigo-400 mt-1 font-mono">{totalVendidos}</p>
          <span className="text-[10px] text-slate-400">Pelos parceiros</span>
        </div>
        <div className="bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-sm">
          <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">Comissão Média</span>
          <p className="text-2xl font-bold text-amber-400 mt-1">20%</p>
          <span className="text-[10px] text-slate-400">Margem dos parceiros</span>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-slate-900/60 backdrop-blur-xl border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm">
        <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between gap-4">
          <div className="relative min-w-[240px]">
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
              <i className="bi bi-search text-xs" />
            </span>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar por ponto de venda, responsável..."
              className="w-full pl-8 pr-3 py-1.5 text-xs rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
          </div>
          <span className="text-xs text-slate-400">
            Mostrando <strong>{filtered.length}</strong> revendas
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left text-slate-600 dark:text-slate-300">
            <thead>
              <tr className="bg-slate-100 dark:bg-slate-800/90 border-b border-slate-200 dark:border-slate-800 text-[10px] uppercase font-bold text-slate-500 dark:text-slate-400 tracking-wider">
                <th className="px-5 py-3">Revenda / Ponto</th>
                <th className="px-5 py-3">Responsável</th>
                <th className="px-5 py-3 hidden md:table-cell">Cidade</th>
                <th className="px-5 py-3">Saldo Atual</th>
                <th className="px-5 py-3 hidden sm:table-cell">Comissão</th>
                <th className="px-5 py-3 hidden lg:table-cell">Vendas</th>
                <th className="px-5 py-3">Status</th>
                <th className="px-5 py-3 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={8} className="text-center py-10 text-slate-400 text-xs">
                    Nenhum ponto de revenda ou parceiro cadastrado.
                  </td>
                </tr>
              ) : (
                filtered.map((r) => (
                  <tr key={r.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors">
                  <td className="px-5 py-3 whitespace-nowrap">
                    <p className="font-semibold text-slate-800 dark:text-white">{r.nome}</p>
                    <p className="text-[11px] text-slate-400 font-mono">{r.telefone}</p>
                  </td>
                  <td className="px-5 py-3 whitespace-nowrap text-slate-700 dark:text-slate-300">
                    {r.responsavel}
                  </td>
                  <td className="px-5 py-3 whitespace-nowrap hidden md:table-cell text-slate-500 dark:text-slate-400">
                    {r.cidade}
                  </td>
                  <td className="px-5 py-3 whitespace-nowrap font-mono font-bold text-emerald-400">
                    R$ {r.saldo.toFixed(2).replace('.', ',')}
                  </td>
                  <td className="px-5 py-3 whitespace-nowrap hidden sm:table-cell font-semibold text-indigo-400">
                    {r.comissao_pct}%
                  </td>
                  <td className="px-5 py-3 whitespace-nowrap hidden lg:table-cell font-mono text-slate-400">
                    {r.vouchers_vendidos} un
                  </td>
                  <td className="px-5 py-3 whitespace-nowrap">
                    <button
                      type="button"
                      onClick={() => toggleStatus(r.id)}
                      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold cursor-pointer ${
                        r.status === 'ativo'
                          ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                          : 'bg-slate-500/15 text-slate-400'
                      }`}
                    >
                      {r.status === 'ativo' ? 'Ativo' : 'Inativo'}
                    </button>
                  </td>
                  <td className="px-5 py-3 text-right whitespace-nowrap">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedRevenda(r)
                          setCreditAmount('50.00')
                          setShowCreditModal(true)
                        }}
                        className="px-2 py-1 text-xs font-semibold bg-emerald-600/15 text-emerald-400 hover:bg-emerald-600/25 border border-emerald-500/30 rounded-lg transition-colors cursor-pointer"
                        title="Recarregar Saldo"
                      >
                        + Saldo
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(r.id, r.nome)}
                        className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors cursor-pointer"
                        title="Excluir"
                      >
                        <i className="bi bi-trash3 text-xs" />
                      </button>
                    </div>
                  </td>
                </tr>
              )))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Nova Revenda */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in">
          <div className="relative w-full max-w-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-2xl">
            <button
              type="button"
              onClick={() => setShowAddModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-200"
            >
              <i className="bi bi-x-lg text-base" />
            </button>

            <div className="flex items-center gap-2.5 mb-5">
              <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400">
                <i className="bi bi-person-lines-fill text-lg" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-800 dark:text-white">Cadastrar Nova Revenda</h3>
                <p className="text-xs text-slate-400">Adicione um ponto de venda parceiro</p>
              </div>
            </div>

            <form onSubmit={handleAddRevenda} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
                  Nome do Estabelecimento *
                </label>
                <input
                  type="text"
                  required
                  value={formNome}
                  onChange={(e) => setFormNome(e.target.value)}
                  placeholder="Ex: Mercearia do Bairro"
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-800 dark:text-white outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
                  Nome do Responsável *
                </label>
                <input
                  type="text"
                  required
                  value={formResponsavel}
                  onChange={(e) => setFormResponsavel(e.target.value)}
                  placeholder="Ex: Carlos Eduardo"
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-800 dark:text-white outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
                    WhatsApp / Telefone
                  </label>
                  <input
                    type="text"
                    value={formTelefone}
                    onChange={(e) => setFormTelefone(e.target.value)}
                    placeholder="(11) 99999-0000"
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-800 dark:text-white outline-none focus:ring-1 focus:ring-indigo-500 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
                    Cidade
                  </label>
                  <input
                    type="text"
                    value={formCidade}
                    onChange={(e) => setFormCidade(e.target.value)}
                    placeholder="São Paulo - SP"
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-800 dark:text-white outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
                    Saldo Inicial (R$)
                  </label>
                  <input
                    type="number"
                    step="10"
                    value={formSaldo}
                    onChange={(e) => setFormSaldo(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-800 dark:text-white outline-none focus:ring-1 focus:ring-indigo-500 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
                    Comissão (%)
                  </label>
                  <input
                    type="number"
                    min="5"
                    max="50"
                    value={formComissao}
                    onChange={(e) => setFormComissao(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-800 dark:text-white outline-none focus:ring-1 focus:ring-indigo-500 font-mono"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2.5 pt-3 border-t border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-xl text-xs font-semibold hover:bg-slate-200 dark:hover:bg-slate-700"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold shadow-lg shadow-indigo-600/20 flex items-center gap-1.5"
                >
                  <i className="bi bi-check-lg" />
                  Salvar Revenda
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Adicionar Crédito */}
      {showCreditModal && selectedRevenda && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in">
          <div className="relative w-full max-w-sm bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-2xl">
            <button
              type="button"
              onClick={() => setShowCreditModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-200"
            >
              <i className="bi bi-x-lg text-base" />
            </button>

            <div className="flex items-center gap-2.5 mb-4">
              <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400">
                <i className="bi bi-cash-coin text-lg" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-800 dark:text-white">Inserir Crédito</h3>
                <p className="text-xs text-slate-400">{selectedRevenda.nome}</p>
              </div>
            </div>

            <form onSubmit={handleAddCredit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
                  Valor a Creditar (R$)
                </label>
                <input
                  type="number"
                  step="10"
                  min="5"
                  required
                  value={creditAmount}
                  onChange={(e) => setCreditAmount(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-sm text-slate-800 dark:text-white outline-none focus:ring-1 focus:ring-indigo-500 font-mono font-bold"
                />
                <span className="text-[10px] text-slate-400 mt-1 block">
                  Saldo atual: R$ {selectedRevenda.saldo.toFixed(2)}
                </span>
              </div>

              <div className="flex justify-end gap-2.5 pt-3 border-t border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowCreditModal(false)}
                  className="px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-xl text-xs font-semibold hover:bg-slate-200 dark:hover:bg-slate-700"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold shadow-lg shadow-emerald-600/20 flex items-center gap-1.5"
                >
                  <i className="bi bi-check-lg" />
                  Confirmar Crédito
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
