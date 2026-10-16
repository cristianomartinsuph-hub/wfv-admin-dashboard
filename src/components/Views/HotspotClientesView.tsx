import React, { useState, useMemo } from 'react'

export interface ClienteFixo {
  id: string
  nome: string
  mac: string
  ip?: string
  plano: string
  concentrador: string
  status: 'ativo' | 'bloqueado'
  criado_em: string
  observacao?: string
}

const DEFAULT_CLIENTES: ClienteFixo[] = [
  {
    id: '1',
    nome: 'Recepção / Tablet Check-in',
    mac: '00:1A:2B:3C:4D:5E',
    ip: '192.168.88.10',
    plano: 'Acesso VIP Ilimitado',
    concentrador: 'Central-Mikrotik-01',
    status: 'ativo',
    criado_em: '2026-10-10',
    observacao: 'Tablet de autoatendimento da entrada',
  },
  {
    id: '2',
    nome: 'Maquininha de Cartão POS 01',
    mac: '44:65:0D:88:99:AA',
    ip: '192.168.88.25',
    plano: 'Prioridade POS (10M)',
    concentrador: 'Central-Mikrotik-01',
    status: 'ativo',
    criado_em: '2026-10-12',
    observacao: 'POS RedeStone Caixa 1',
  },
  {
    id: '3',
    nome: 'Gerência / Notebook Dell',
    mac: 'BC:D0:74:11:22:33',
    ip: '192.168.88.50',
    plano: 'Acesso VIP Ilimitado',
    concentrador: 'Central-Mikrotik-01',
    status: 'ativo',
    criado_em: '2026-10-14',
    observacao: 'Diretoria sem tela de captive portal',
  },
]

export const HotspotClientesView: React.FC = () => {
  const [clientes, setClientes] = useState<ClienteFixo[]>(() => {
    try {
      const saved = localStorage.getItem('wfv_clientes_fixos')
      return saved ? JSON.parse(saved) : DEFAULT_CLIENTES
    } catch {
      return DEFAULT_CLIENTES
    }
  })

  const [searchTerm, setSearchTerm] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [formNome, setFormNome] = useState('')
  const [formMac, setFormMac] = useState('')
  const [formIp, setFormIp] = useState('')
  const [formPlano, setFormPlano] = useState('Acesso VIP Ilimitado')
  const [formConcentrador, setFormConcentrador] = useState('Central-Mikrotik-01')
  const [formObs, setFormObs] = useState('')
  const [feedback, setFeedback] = useState<string | null>(null)

  const persist = (data: ClienteFixo[]) => {
    setClientes(data)
    try {
      localStorage.setItem('wfv_clientes_fixos', JSON.stringify(data))
    } catch {}
  }

  const filtered = useMemo(() => {
    const q = searchTerm.toLowerCase().trim()
    if (!q) return clientes
    return clientes.filter(
      (c) =>
        c.nome.toLowerCase().includes(q) ||
        c.mac.toLowerCase().includes(q) ||
        (c.ip && c.ip.includes(q))
    )
  }, [clientes, searchTerm])

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault()
    if (!formNome || !formMac) return

    const newCliente: ClienteFixo = {
      id: String(Date.now()),
      nome: formNome.trim(),
      mac: formMac.toUpperCase().trim(),
      ip: formIp.trim() || undefined,
      plano: formPlano,
      concentrador: formConcentrador,
      status: 'ativo',
      criado_em: new Date().toISOString().split('T')[0],
      observacao: formObs.trim() || undefined,
    }

    persist([newCliente, ...clientes])
    setShowModal(false)
    setFormNome('')
    setFormMac('')
    setFormIp('')
    setFormObs('')
    setFeedback(`Cliente fixo "${newCliente.nome}" cadastrado com sucesso!`)
    setTimeout(() => setFeedback(null), 3000)
  }

  const toggleStatus = (id: string) => {
    const updated = clientes.map((c) =>
      c.id === id ? { ...c, status: c.status === 'ativo' ? ('bloqueado' as const) : ('ativo' as const) } : c
    )
    persist(updated)
  }

  const handleDelete = (id: string, nome: string) => {
    if (window.confirm(`Excluir o cliente fixo "${nome}"?`)) {
      const updated = clientes.filter((c) => c.id !== id)
      persist(updated)
      setFeedback('Cliente removido.')
      setTimeout(() => setFeedback(null), 3000)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-slate-800 dark:text-white flex items-center gap-2">
            <i className="bi bi-person-check text-indigo-400" />
            Clientes Fixos & Dispositivos VIP
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Cadastre dispositivos por MAC ou IP para liberação automática de internet sem necessidade de voucher.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setShowModal(true)}
          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold shadow-lg shadow-indigo-600/20 transition-all flex items-center gap-1.5 self-start sm:self-auto cursor-pointer"
        >
          <i className="bi bi-plus-lg text-sm" />
          <span>+ Adicionar Cliente Fixo</span>
        </button>
      </div>

      {feedback && (
        <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs flex items-center gap-2 animate-in fade-in">
          <i className="bi bi-check-circle-fill text-base flex-shrink-0" />
          <span>{feedback}</span>
        </div>
      )}

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
              placeholder="Buscar por nome, MAC ou IP..."
              className="w-full pl-8 pr-3 py-1.5 text-xs rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
          </div>
          <span className="text-xs text-slate-400">
            Total: <strong>{filtered.length}</strong> clientes fixos
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left text-slate-600 dark:text-slate-300">
            <thead>
              <tr className="bg-slate-100 dark:bg-slate-800/90 border-b border-slate-200 dark:border-slate-800 text-[10px] uppercase font-bold text-slate-500 dark:text-slate-400 tracking-wider">
                <th className="px-5 py-3">Dispositivo / Cliente</th>
                <th className="px-5 py-3">MAC Address</th>
                <th className="px-5 py-3 hidden sm:table-cell">IP Fixo</th>
                <th className="px-5 py-3 hidden md:table-cell">Plano / Perfil</th>
                <th className="px-5 py-3">Status</th>
                <th className="px-5 py-3 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-10 text-slate-400 text-xs">
                    Nenhum cliente fixo cadastrado.
                  </td>
                </tr>
              ) : (
                filtered.map((c) => (
                  <tr key={c.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors">
                    <td className="px-5 py-3 whitespace-nowrap">
                      <p className="font-semibold text-slate-800 dark:text-white">{c.nome}</p>
                      {c.observacao && <p className="text-[11px] text-slate-400">{c.observacao}</p>}
                    </td>
                    <td className="px-5 py-3 font-mono font-bold text-indigo-400 whitespace-nowrap">
                      {c.mac}
                    </td>
                    <td className="px-5 py-3 font-mono text-slate-500 dark:text-slate-400 hidden sm:table-cell whitespace-nowrap">
                      {c.ip || 'DHCP Dinâmico'}
                    </td>
                    <td className="px-5 py-3 text-slate-700 dark:text-slate-300 hidden md:table-cell whitespace-nowrap">
                      {c.plano}
                    </td>
                    <td className="px-5 py-3 whitespace-nowrap">
                      <button
                        type="button"
                        onClick={() => toggleStatus(c.id)}
                        className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold cursor-pointer transition-colors ${
                          c.status === 'ativo'
                            ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                            : 'bg-rose-500/15 text-rose-400 border border-rose-500/30'
                        }`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${
                            c.status === 'ativo' ? 'bg-emerald-400 animate-pulse' : 'bg-rose-400'
                          }`}
                        />
                        {c.status === 'ativo' ? 'Liberado' : 'Bloqueado'}
                      </button>
                    </td>
                    <td className="px-5 py-3 text-right whitespace-nowrap">
                      <button
                        type="button"
                        onClick={() => handleDelete(c.id, c.nome)}
                        className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors cursor-pointer"
                        title="Excluir"
                      >
                        <i className="bi bi-trash3 text-xs" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Adicionar Cliente */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in">
          <div className="relative w-full max-w-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-2xl">
            <button
              type="button"
              onClick={() => setShowModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-200"
            >
              <i className="bi bi-x-lg text-base" />
            </button>

            <div className="flex items-center gap-2.5 mb-5">
              <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400">
                <i className="bi bi-person-check text-lg" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-800 dark:text-white">
                  Cadastrar Cliente Fixo / VIP
                </h3>
                <p className="text-xs text-slate-400">Liberação de acesso direta por MAC Address</p>
              </div>
            </div>

            <form onSubmit={handleAdd} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
                  Nome do Dispositivo ou Cliente *
                </label>
                <input
                  type="text"
                  required
                  value={formNome}
                  onChange={(e) => setFormNome(e.target.value)}
                  placeholder="Ex: Recepção Tablet 01"
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-800 dark:text-white outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
                  MAC Address (Físico) *
                </label>
                <input
                  type="text"
                  required
                  value={formMac}
                  onChange={(e) => setFormMac(e.target.value)}
                  placeholder="Ex: 00:1A:2B:3C:4D:5E"
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-800 dark:text-white outline-none focus:ring-1 focus:ring-indigo-500 font-mono"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
                    IP Estático (Opcional)
                  </label>
                  <input
                    type="text"
                    value={formIp}
                    onChange={(e) => setFormIp(e.target.value)}
                    placeholder="192.168.88.50"
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-800 dark:text-white outline-none focus:ring-1 focus:ring-indigo-500 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
                    Plano de Velocidade
                  </label>
                  <select
                    value={formPlano}
                    onChange={(e) => setFormPlano(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-800 dark:text-white outline-none focus:ring-1 focus:ring-indigo-500"
                  >
                    <option value="Acesso VIP Ilimitado">Acesso VIP Ilimitado</option>
                    <option value="Prioridade POS (10M)">Prioridade POS (10M)</option>
                    <option value="Funcionários (5M)">Funcionários (5M)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
                    Concentrador Vinculado
                  </label>
                  <select
                    value={formConcentrador}
                    onChange={(e) => setFormConcentrador(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-800 dark:text-white outline-none focus:ring-1 focus:ring-indigo-500"
                  >
                    <option value="Central-Mikrotik-01">Central-Mikrotik-01</option>
                    <option value="Grandstream-Hotel-01">Grandstream-Hotel-01</option>
                    <option value="Omada-Praca-02">Omada-Praca-02</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
                  Observações
                </label>
                <input
                  type="text"
                  value={formObs}
                  onChange={(e) => setFormObs(e.target.value)}
                  placeholder="Ex: Terminal de pagamento do caixa 2"
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-800 dark:text-white outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>

              <div className="flex justify-end gap-2.5 pt-3 border-t border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-xl text-xs font-semibold hover:bg-slate-200 dark:hover:bg-slate-700"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold shadow-lg shadow-indigo-600/20 flex items-center gap-1.5"
                >
                  <i className="bi bi-check-lg" />
                  Salvar Cliente Fixo
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
