import React, { useState } from 'react'

export interface HotspotPlan {
  id: string
  nome: string
  valor: number
  duracao_minutos: number
  duracao_formatada: string
  download_mbps: number
  upload_mbps: number
  dispositivos: number
  ativo: boolean
  descricao?: string
}

const DEFAULT_PLANS: HotspotPlan[] = [
  {
    id: '1',
    nome: '1 Hora Básico',
    valor: 3.0,
    duracao_minutos: 60,
    duracao_formatada: '1 Hora',
    download_mbps: 5,
    upload_mbps: 2,
    dispositivos: 1,
    ativo: true,
    descricao: 'Ideal para acessos rápidos e mensagens',
  },
  {
    id: '2',
    nome: '2 Horas Padrão',
    valor: 5.0,
    duracao_minutos: 120,
    duracao_formatada: '2 Horas',
    download_mbps: 10,
    upload_mbps: 4,
    dispositivos: 1,
    ativo: true,
    descricao: 'Navegação para redes sociais e vídeos curtos',
  },
  {
    id: '3',
    nome: '12 Horas VIP',
    valor: 15.0,
    duracao_minutos: 720,
    duracao_formatada: '12 Horas',
    download_mbps: 20,
    upload_mbps: 10,
    dispositivos: 2,
    ativo: true,
    descricao: 'Ideal para um dia inteiro de trabalho ou lazer',
  },
  {
    id: '4',
    nome: '24 Horas Turbo',
    valor: 25.0,
    duracao_minutos: 1440,
    duracao_formatada: '24 Horas (1 Dia)',
    download_mbps: 30,
    upload_mbps: 15,
    dispositivos: 2,
    ativo: true,
    descricao: 'Acesso sem interrupções por 24 horas',
  },
  {
    id: '5',
    nome: '7 Dias Semanal',
    valor: 60.0,
    duracao_minutos: 10080,
    duracao_formatada: '7 Dias',
    download_mbps: 35,
    upload_mbps: 15,
    dispositivos: 3,
    ativo: true,
    descricao: 'Plano econômico semanal para hóspedes e turistas',
  },
]

export const HotspotPlanosView: React.FC = () => {
  const [planos, setPlanos] = useState<HotspotPlan[]>(() => {
    try {
      const saved = localStorage.getItem('wfv_hotspot_planos')
      return saved ? JSON.parse(saved) : DEFAULT_PLANS
    } catch {
      return DEFAULT_PLANS
    }
  })

  const [showModal, setShowModal] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)

  // Form states
  const [formNome, setFormNome] = useState('')
  const [formValor, setFormValor] = useState('5.00')
  const [formDuracao, setFormDuracao] = useState('60')
  const [formDownload, setFormDownload] = useState('10')
  const [formUpload, setFormUpload] = useState('5')
  const [formDispositivos, setFormDispositivos] = useState('1')
  const [formDescricao, setFormDescricao] = useState('')
  const [feedback, setFeedback] = useState<string | null>(null)

  const persist = (data: HotspotPlan[]) => {
    setPlanos(data)
    try {
      localStorage.setItem('wfv_hotspot_planos', JSON.stringify(data))
    } catch {}
  }

  const openCreateModal = () => {
    setEditingId(null)
    setFormNome('')
    setFormValor('5.00')
    setFormDuracao('60')
    setFormDownload('10')
    setFormUpload('5')
    setFormDispositivos('1')
    setFormDescricao('')
    setShowModal(true)
  }

  const openEditModal = (p: HotspotPlan) => {
    setEditingId(p.id)
    setFormNome(p.nome)
    setFormValor(p.valor.toFixed(2))
    setFormDuracao(String(p.duracao_minutos))
    setFormDownload(String(p.download_mbps))
    setFormUpload(String(p.upload_mbps))
    setFormDispositivos(String(p.dispositivos))
    setFormDescricao(p.descricao || '')
    setShowModal(true)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!formNome) return

    const minutos = parseInt(formDuracao, 10) || 60
    let duracaoTxt = `${minutos} Minutos`
    if (minutos >= 1440 && minutos % 1440 === 0) {
      duracaoTxt = `${minutos / 1440} Dia(s)`
    } else if (minutos >= 60 && minutos % 60 === 0) {
      duracaoTxt = `${minutos / 60} Hora(s)`
    }

    if (editingId) {
      const updated = planos.map((p) =>
        p.id === editingId
          ? {
              ...p,
              nome: formNome,
              valor: parseFloat(formValor) || 0,
              duracao_minutos: minutos,
              duracao_formatada: duracaoTxt,
              download_mbps: parseInt(formDownload, 10) || 10,
              upload_mbps: parseInt(formUpload, 10) || 5,
              dispositivos: parseInt(formDispositivos, 10) || 1,
              descricao: formDescricao,
            }
          : p
      )
      persist(updated)
      setFeedback('Plano atualizado com sucesso!')
    } else {
      const newPlan: HotspotPlan = {
        id: String(Date.now()),
        nome: formNome,
        valor: parseFloat(formValor) || 0,
        duracao_minutos: minutos,
        duracao_formatada: duracaoTxt,
        download_mbps: parseInt(formDownload, 10) || 10,
        upload_mbps: parseInt(formUpload, 10) || 5,
        dispositivos: parseInt(formDispositivos, 10) || 1,
        ativo: true,
        descricao: formDescricao,
      }
      persist([...planos, newPlan])
      setFeedback('Novo plano criado com sucesso!')
    }

    setShowModal(false)
    setTimeout(() => setFeedback(null), 3000)
  }

  const toggleAtivo = (id: string) => {
    const updated = planos.map((p) => (p.id === id ? { ...p, ativo: !p.ativo } : p))
    persist(updated)
  }

  const deletePlano = (id: string, nome: string) => {
    if (window.confirm(`Tem certeza que deseja remover o plano "${nome}"?`)) {
      const updated = planos.filter((p) => p.id !== id)
      persist(updated)
      setFeedback('Plano removido.')
      setTimeout(() => setFeedback(null), 3000)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header and Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-slate-800 dark:text-white flex items-center gap-2">
            <i className="bi bi-clock-history text-indigo-400" />
            Planos Tarifários de Hotspot
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Defina preços, limites de tempo, banda (QoS) e simultaneidade de conexões para o captive portal.
          </p>
        </div>

        <button
          type="button"
          onClick={openCreateModal}
          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold shadow-lg shadow-indigo-600/20 transition-all flex items-center gap-1.5 self-start sm:self-auto cursor-pointer"
        >
          <i className="bi bi-plus-lg text-sm" />
          <span>+ Criar Novo Plano</span>
        </button>
      </div>

      {feedback && (
        <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs flex items-center gap-2 animate-in fade-in">
          <i className="bi bi-check-circle-fill text-base flex-shrink-0" />
          <span>{feedback}</span>
        </div>
      )}

      {/* Grid of Plans */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {planos.map((plano) => (
          <div
            key={plano.id}
            className={`bg-white dark:bg-slate-900/60 border rounded-2xl p-5 shadow-sm transition-all duration-200 relative overflow-hidden flex flex-col justify-between ${
              plano.ativo
                ? 'border-slate-200 dark:border-slate-800 hover:border-indigo-500/40'
                : 'border-slate-200/50 dark:border-slate-800/40 opacity-60'
            }`}
          >
            <div>
              <div className="flex items-start justify-between gap-2 mb-2">
                <span className="font-bold text-base text-slate-800 dark:text-white leading-tight">
                  {plano.nome}
                </span>
                <span
                  className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                    plano.ativo
                      ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/25'
                      : 'bg-slate-500/15 text-slate-400'
                  }`}
                >
                  {plano.ativo ? 'Ativo no Portal' : 'Pausado'}
                </span>
              </div>

              <div className="flex items-baseline gap-1 my-3">
                <span className="text-xs text-slate-400">R$</span>
                <span className="text-3xl font-extrabold text-indigo-400 font-mono">
                  {plano.valor.toFixed(2).replace('.', ',')}
                </span>
                <span className="text-xs text-slate-500 dark:text-slate-400">
                  / {plano.duracao_formatada}
                </span>
              </div>

              {plano.descricao && (
                <p className="text-xs text-slate-500 dark:text-slate-400 mb-4 line-clamp-2">
                  {plano.descricao}
                </p>
              )}

              <div className="space-y-2 py-3 border-t border-slate-100 dark:border-slate-800/80 text-xs text-slate-600 dark:text-slate-300">
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1.5 text-slate-400">
                    <i className="bi bi-speedometer" /> Velocidade:
                  </span>
                  <span className="font-mono font-semibold">
                    {plano.download_mbps}M Down / {plano.upload_mbps}M Up
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1.5 text-slate-400">
                    <i className="bi bi-phone" /> Dispositivos:
                  </span>
                  <span className="font-semibold">{plano.dispositivos} simultâneo(s)</span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800/80 mt-2">
              <button
                type="button"
                onClick={() => toggleAtivo(plano.id)}
                className={`text-xs font-semibold px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${
                  plano.ativo
                    ? 'text-amber-400 hover:bg-amber-500/10'
                    : 'text-emerald-400 hover:bg-emerald-500/10'
                }`}
              >
                {plano.ativo ? 'Desativar' : 'Ativar'}
              </button>

              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => openEditModal(plano)}
                  className="p-1.5 text-slate-400 hover:text-indigo-400 hover:bg-indigo-500/10 rounded-lg transition-colors cursor-pointer"
                  title="Editar Plano"
                >
                  <i className="bi bi-pencil text-xs" />
                </button>
                <button
                  type="button"
                  onClick={() => deletePlano(plano.id, plano.nome)}
                  className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors cursor-pointer"
                  title="Excluir Plano"
                >
                  <i className="bi bi-trash3 text-xs" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal Criar/Editar */}
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
                <i className="bi bi-clock-history text-lg" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-800 dark:text-white">
                  {editingId ? 'Editar Plano Hotspot' : 'Novo Plano de Acesso'}
                </h3>
                <p className="text-xs text-slate-400">Configure a tarifa e velocidade da conexão</p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
                  Nome do Plano *
                </label>
                <input
                  type="text"
                  required
                  value={formNome}
                  onChange={(e) => setFormNome(e.target.value)}
                  placeholder="Ex: 2 Horas Ilimitado"
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-800 dark:text-white outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
                    Preço (R$) *
                  </label>
                  <input
                    type="number"
                    step="0.50"
                    min="0"
                    required
                    value={formValor}
                    onChange={(e) => setFormValor(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-800 dark:text-white outline-none focus:ring-1 focus:ring-indigo-500 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
                    Duração (Minutos) *
                  </label>
                  <select
                    value={formDuracao}
                    onChange={(e) => setFormDuracao(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-800 dark:text-white outline-none focus:ring-1 focus:ring-indigo-500"
                  >
                    <option value="30">30 Minutos</option>
                    <option value="60">1 Hora (60 min)</option>
                    <option value="120">2 Horas (120 min)</option>
                    <option value="360">6 Horas</option>
                    <option value="720">12 Horas</option>
                    <option value="1440">24 Horas (1 Dia)</option>
                    <option value="4320">3 Dias</option>
                    <option value="10080">7 Dias (1 Semana)</option>
                    <option value="43200">30 Dias (1 Mês)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
                    Download
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      min="1"
                      value={formDownload}
                      onChange={(e) => setFormDownload(e.target.value)}
                      className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl pl-3 pr-8 py-2 text-xs text-slate-800 dark:text-white outline-none focus:ring-1 focus:ring-indigo-500 font-mono"
                    />
                    <span className="absolute right-2 top-2 text-[10px] text-slate-400">Mb</span>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
                    Upload
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      min="1"
                      value={formUpload}
                      onChange={(e) => setFormUpload(e.target.value)}
                      className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl pl-3 pr-8 py-2 text-xs text-slate-800 dark:text-white outline-none focus:ring-1 focus:ring-indigo-500 font-mono"
                    />
                    <span className="absolute right-2 top-2 text-[10px] text-slate-400">Mb</span>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
                    Dispositivos
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="10"
                    value={formDispositivos}
                    onChange={(e) => setFormDispositivos(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-800 dark:text-white outline-none focus:ring-1 focus:ring-indigo-500 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
                  Descrição (aparece no captive portal)
                </label>
                <input
                  type="text"
                  value={formDescricao}
                  onChange={(e) => setFormDescricao(e.target.value)}
                  placeholder="Ex: Acesso em alta velocidade para navegação e streaming"
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
                  {editingId ? 'Salvar Alterações' : 'Criar Plano'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
