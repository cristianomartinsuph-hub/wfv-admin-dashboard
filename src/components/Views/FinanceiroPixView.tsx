import React, { useState, useMemo } from 'react'

export interface PixTransaction {
  id: string
  endToEndId: string
  cliente: string
  cpf: string
  valor: number
  status: 'aprovado' | 'devolvido' | 'contestacao' | 'pendente'
  data_hora: string
  voucher_codigo?: string
  motivo_devolucao?: string
}

const DEFAULT_TRANSACTIONS: PixTransaction[] = [
  {
    id: 'tx-101',
    endToEndId: 'E1823612020261015143000928172',
    cliente: 'Marcos Aurelio Santos',
    cpf: '***.482.918-**',
    valor: 15.0,
    status: 'aprovado',
    data_hora: '2026-10-15 14:30:12',
    voucher_codigo: 'CMS-7712-BT',
  },
  {
    id: 'tx-102',
    endToEndId: 'E1823612020261015132200817263',
    cliente: 'Camila Ferreira Lima',
    cpf: '***.901.233-**',
    valor: 5.0,
    status: 'aprovado',
    data_hora: '2026-10-15 13:22:05',
    voucher_codigo: 'CMS-9842-AX',
  },
  {
    id: 'tx-103',
    endToEndId: 'E1823612020261015111000728190',
    cliente: 'Rodrigo Medeiros',
    cpf: '***.112.980-**',
    valor: 25.0,
    status: 'aprovado',
    data_hora: '2026-10-15 11:10:44',
    voucher_codigo: 'CMS-3310-QR',
  },
  {
    id: 'tx-104',
    endToEndId: 'E1823612020261014164500619283',
    cliente: 'Luciana Albuquerque',
    cpf: '***.773.120-**',
    valor: 15.0,
    status: 'devolvido',
    data_hora: '2026-10-14 16:45:00',
    voucher_codigo: 'CMS-1102-LK',
    motivo_devolucao: 'Pagamento duplicado pelo cliente',
  },
  {
    id: 'tx-105',
    endToEndId: 'E1823612020261014101200554411',
    cliente: 'Felipe Goncalves',
    cpf: '***.344.890-**',
    valor: 60.0,
    status: 'contestacao',
    data_hora: '2026-10-14 10:12:18',
    voucher_codigo: 'CMS-7788-SEM',
    motivo_devolucao: 'Contestação MED em análise pelo banco',
  },
]

interface FinanceiroPixViewProps {
  route: string
}

export const FinanceiroPixView: React.FC<FinanceiroPixViewProps> = ({ route }) => {
  const [transactions, setTransactions] = useState<PixTransaction[]>(() => {
    try {
      const saved = localStorage.getItem('wfv_pix_transactions')
      return saved ? JSON.parse(saved) : DEFAULT_TRANSACTIONS
    } catch {
      return DEFAULT_TRANSACTIONS
    }
  })

  // Selected subview based on route
  const defaultTab =
    route === 'devolucao-pix'
      ? 'devolucao'
      : route === 'pix-devolvidos'
      ? 'devolvidos'
      : route === 'contestacoes'
      ? 'contestacoes'
      : 'compras'

  const [activeTab, setActiveTab] = useState<'compras' | 'devolucao' | 'devolvidos' | 'contestacoes'>(
    defaultTab
  )

  const [searchTerm, setSearchTerm] = useState('')
  const [refundTxId, setRefundTxId] = useState('')
  const [refundMotivo, setRefundMotivo] = useState('')
  const [feedback, setFeedback] = useState<string | null>(null)

  const persist = (data: PixTransaction[]) => {
    setTransactions(data)
    try {
      localStorage.setItem('wfv_pix_transactions', JSON.stringify(data))
    } catch {}
  }

  const filtered = useMemo(() => {
    let list = transactions
    if (activeTab === 'devolvidos') {
      list = list.filter((t) => t.status === 'devolvido')
    } else if (activeTab === 'contestacoes') {
      list = list.filter((t) => t.status === 'contestacao')
    }

    const q = searchTerm.toLowerCase().trim()
    if (!q) return list
    return list.filter(
      (t) =>
        t.cliente.toLowerCase().includes(q) ||
        t.endToEndId.toLowerCase().includes(q) ||
        (t.voucher_codigo && t.voucher_codigo.toLowerCase().includes(q))
    )
  }, [transactions, activeTab, searchTerm])

  const handleRefundSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!refundTxId) return

    const tx = transactions.find((t) => t.id === refundTxId || t.endToEndId === refundTxId)
    if (!tx) {
      alert('Transação não encontrada pelo ID informado.')
      return
    }

    const updated = transactions.map((t) =>
      t.id === tx.id
        ? {
            ...t,
            status: 'devolvido' as const,
            motivo_devolucao: refundMotivo.trim() || 'Estorno solicitado pelo administrador',
          }
        : t
    )

    persist(updated)
    setRefundTxId('')
    setRefundMotivo('')
    setFeedback(`Devolução de R$ ${tx.valor.toFixed(2)} confirmada para ${tx.cliente}!`)
    setTimeout(() => setFeedback(null), 3500)
    setActiveTab('devolvidos')
  }

  const totalAprovado = transactions
    .filter((t) => t.status === 'aprovado')
    .reduce((acc, t) => acc + t.valor, 0)
  const totalDevolvido = transactions
    .filter((t) => t.status === 'devolvido')
    .reduce((acc, t) => acc + t.valor, 0)

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-slate-800 dark:text-white flex items-center gap-2">
            <i className="bi bi-cash-coin text-emerald-400" />
            Financeiro, Transações PIX & Cartão
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Conciliação instantânea 24h de pagamentos via PIX, estornos e notificações bancárias.
          </p>
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
          <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">Faturamento Líquido</span>
          <p className="text-2xl font-bold text-emerald-400 mt-1 font-mono">
            R$ {(totalAprovado - totalDevolvido).toFixed(2).replace('.', ',')}
          </p>
          <span className="text-[10px] text-slate-400">Total PIX liquidado</span>
        </div>
        <div className="bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-sm">
          <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">Vendas Aprovadas</span>
          <p className="text-2xl font-bold text-slate-800 dark:text-white mt-1">
            {transactions.filter((t) => t.status === 'aprovado').length}
          </p>
          <span className="text-[10px] text-emerald-400 font-semibold">100% automáticas</span>
        </div>
        <div className="bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-sm">
          <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">Estornos / Devoluções</span>
          <p className="text-2xl font-bold text-rose-400 mt-1 font-mono">
            R$ {totalDevolvido.toFixed(2).replace('.', ',')}
          </p>
          <span className="text-[10px] text-slate-400">{transactions.filter((t) => t.status === 'devolvido').length} reembolsos</span>
        </div>
        <div className="bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-sm">
          <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">Contestações MED</span>
          <p className="text-2xl font-bold text-amber-400 mt-1">
            {transactions.filter((t) => t.status === 'contestacao').length}
          </p>
          <span className="text-[10px] text-slate-400">Em análise bancária</span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200 dark:border-slate-800 gap-6 text-xs font-semibold overflow-x-auto">
        <button
          type="button"
          onClick={() => setActiveTab('compras')}
          className={`pb-3 transition-colors border-b-2 cursor-pointer whitespace-nowrap ${
            activeTab === 'compras'
              ? 'border-emerald-500 text-emerald-500 dark:text-emerald-400'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          Compras PIX/Cartão ({transactions.filter((t) => t.status === 'aprovado').length})
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('devolucao')}
          className={`pb-3 transition-colors border-b-2 cursor-pointer whitespace-nowrap ${
            activeTab === 'devolucao'
              ? 'border-emerald-500 text-emerald-500 dark:text-emerald-400'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          Solicitar Devolução PIX
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('devolvidos')}
          className={`pb-3 transition-colors border-b-2 cursor-pointer whitespace-nowrap ${
            activeTab === 'devolvidos'
              ? 'border-emerald-500 text-emerald-500 dark:text-emerald-400'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          PIX Devolvidos ({transactions.filter((t) => t.status === 'devolvido').length})
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('contestacoes')}
          className={`pb-3 transition-colors border-b-2 cursor-pointer whitespace-nowrap ${
            activeTab === 'contestacoes'
              ? 'border-emerald-500 text-emerald-500 dark:text-emerald-400'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          Contestações / MED ({transactions.filter((t) => t.status === 'contestacao').length})
        </button>
      </div>

      {/* Tab: Solicitar Devolução */}
      {activeTab === 'devolucao' && (
        <div className="max-w-2xl bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
          <h3 className="text-sm font-bold text-slate-800 dark:text-white mb-2 flex items-center gap-2">
            <i className="bi bi-arrow-counterclockwise text-emerald-400" />
            Solicitação de Reembolso / Devolução PIX
          </h3>
          <p className="text-xs text-slate-400 mb-5">
            O valor será estornado instantaneamente para a mesma conta bancária do pagador via API Pix do Banco Central.
          </p>

          <form onSubmit={handleRefundSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Selecione a Transação Aprovada *
              </label>
              <select
                required
                value={refundTxId}
                onChange={(e) => setRefundTxId(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-800 dark:text-white outline-none focus:ring-1 focus:ring-emerald-500"
              >
                <option value="">Selecione um pagamento...</option>
                {transactions
                  .filter((t) => t.status === 'aprovado')
                  .map((t) => (
                    <option key={t.id} value={t.id}>
                      R$ {t.valor.toFixed(2)} — {t.cliente} ({t.voucher_codigo}) — {t.data_hora}
                    </option>
                  ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Motivo da Devolução
              </label>
              <textarea
                rows={3}
                value={refundMotivo}
                onChange={(e) => setRefundMotivo(e.target.value)}
                placeholder="Ex: Usuário comprou plano incorreto ou link instável"
                className="w-full bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-800 dark:text-white outline-none focus:ring-1 focus:ring-emerald-500"
              />
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="submit"
                className="px-5 py-2.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-semibold shadow-lg shadow-rose-600/20 transition-all flex items-center gap-2 cursor-pointer"
              >
                <i className="bi bi-arrow-counterclockwise" />
                <span>Confirmar Estorno PIX</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Tab: Table of Transactions (Compras, Devolvidos, Contestações) */}
      {activeTab !== 'devolucao' && (
        <div className="bg-white dark:bg-slate-900/60 backdrop-blur-xl border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm">
          <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
            <div className="relative min-w-[240px]">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <i className="bi bi-search text-xs" />
              </span>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Buscar por pagador, EndToEndId ou voucher..."
                className="w-full pl-8 pr-3 py-1.5 text-xs rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-emerald-500"
              />
            </div>
            <span className="text-xs text-slate-400">
              Total: <strong>{filtered.length}</strong> transações
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left text-slate-600 dark:text-slate-300">
              <thead>
                <tr className="bg-slate-100 dark:bg-slate-800/90 border-b border-slate-200 dark:border-slate-800 text-[10px] uppercase font-bold text-slate-500 dark:text-slate-400 tracking-wider">
                  <th className="px-5 py-3">Cliente / Pagador</th>
                  <th className="px-5 py-3">EndToEndId (PIX)</th>
                  <th className="px-5 py-3">Valor</th>
                  <th className="px-5 py-3 hidden md:table-cell">Voucher Gerado</th>
                  <th className="px-5 py-3">Status</th>
                  <th className="px-5 py-3 hidden sm:table-cell">Data / Hora</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                {filtered.map((t) => (
                  <tr key={t.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors">
                    <td className="px-5 py-3 whitespace-nowrap">
                      <p className="font-semibold text-slate-800 dark:text-white">{t.cliente}</p>
                      <p className="text-[10px] text-slate-400 font-mono">{t.cpf}</p>
                    </td>
                    <td className="px-5 py-3 font-mono text-[11px] text-slate-500 dark:text-slate-400 whitespace-nowrap">
                      {t.endToEndId}
                    </td>
                    <td className="px-5 py-3 font-mono font-bold text-emerald-400 whitespace-nowrap">
                      R$ {t.valor.toFixed(2).replace('.', ',')}
                    </td>
                    <td className="px-5 py-3 font-mono font-bold text-indigo-400 hidden md:table-cell whitespace-nowrap">
                      {t.voucher_codigo || '—'}
                    </td>
                    <td className="px-5 py-3 whitespace-nowrap">
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                          t.status === 'aprovado'
                            ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                            : t.status === 'devolvido'
                            ? 'bg-rose-500/15 text-rose-400 border border-rose-500/30'
                            : 'bg-amber-500/15 text-amber-400 border border-amber-500/30'
                        }`}
                      >
                        {t.status === 'aprovado'
                          ? 'Aprovado'
                          : t.status === 'devolvido'
                          ? 'Devolvido'
                          : 'Contestação MED'}
                      </span>
                    </td>
                    <td className="px-5 py-3 font-mono text-slate-400 hidden sm:table-cell whitespace-nowrap">
                      {t.data_hora}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
