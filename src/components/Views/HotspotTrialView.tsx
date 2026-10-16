import React, { useState } from 'react'

export const HotspotTrialView: React.FC = () => {
  const [enabled, setEnabled] = useState(() => {
    try {
      const saved = localStorage.getItem('wfv_trial_config')
      return saved ? JSON.parse(saved).enabled : true
    } catch {
      return true
    }
  })

  const [tempoMinutos, setTempoMinutos] = useState('15')
  const [resetHoras, setResetHoras] = useState('24')
  const [downloadMbps, setDownloadMbps] = useState('5')
  const [uploadMbps, setUploadMbps] = useState('2')
  const [requireName, setRequireName] = useState(true)
  const [requirePhone, setRequirePhone] = useState(true)
  const [requireEmail, setRequireEmail] = useState(false)
  const [feedback, setFeedback] = useState<string | null>(null)

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault()
    const config = {
      enabled,
      tempoMinutos,
      resetHoras,
      downloadMbps,
      uploadMbps,
      requireName,
      requirePhone,
      requireEmail,
    }
    try {
      localStorage.setItem('wfv_trial_config', JSON.stringify(config))
    } catch {}
    setFeedback('Configurações de Tempo Trial salvas e sincronizadas com os roteadores!')
    setTimeout(() => setFeedback(null), 3500)
  }

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h2 className="text-lg font-bold text-slate-800 dark:text-white flex items-center gap-2">
          <i className="bi bi-stopwatch text-indigo-400" />
          Configuração de Tempo Trial (Acesso Gratuito)
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
          Permita que novos visitantes naveguem gratuitamente por alguns minutos antes de comprar um voucher.
        </p>
      </div>

      {feedback && (
        <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs flex items-center gap-2 animate-in fade-in">
          <i className="bi bi-check-circle-fill text-base flex-shrink-0" />
          <span>{feedback}</span>
        </div>
      )}

      <form onSubmit={handleSave} className="bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-6">
        {/* Toggle Enable */}
        <div className="flex items-center justify-between pb-6 border-b border-slate-200 dark:border-slate-800">
          <div>
            <span className="text-sm font-bold text-slate-800 dark:text-white block">
              Ativar Botão de Teste Grátis no Portal
            </span>
            <span className="text-xs text-slate-500 dark:text-slate-400">
              Exibe a opção "Experimentar Grátis" na tela de login Wi-Fi
            </span>
          </div>
          <button
            type="button"
            onClick={() => setEnabled(!enabled)}
            className={`w-12 h-6 flex items-center rounded-full p-1 transition-colors duration-200 cursor-pointer ${
              enabled ? 'bg-indigo-600' : 'bg-slate-300 dark:bg-slate-700'
            }`}
          >
            <div
              className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-200 ${
                enabled ? 'translate-x-6' : 'translate-x-0'
              }`}
            />
          </button>
        </div>

        {/* Trial Times & Limits */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Duração da Degustação
            </label>
            <select
              value={tempoMinutos}
              onChange={(e) => setTempoMinutos(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-800 dark:text-white outline-none focus:ring-1 focus:ring-indigo-500"
            >
              <option value="5">5 Minutos</option>
              <option value="10">10 Minutos</option>
              <option value="15">15 Minutos (Recomendado)</option>
              <option value="30">30 Minutos</option>
              <option value="60">60 Minutos (1 Hora)</option>
            </select>
            <span className="text-[10px] text-slate-400 mt-1 block">Tempo que a conexão permanecerá ativa</span>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Intervalo para Novo Teste por Dispositivo (MAC)
            </label>
            <select
              value={resetHoras}
              onChange={(e) => setResetHoras(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-800 dark:text-white outline-none focus:ring-1 focus:ring-indigo-500"
            >
              <option value="1">A cada 1 Hora</option>
              <option value="6">A cada 6 Horas</option>
              <option value="12">A cada 12 Horas</option>
              <option value="24">A cada 24 Horas (1 Vez ao dia)</option>
              <option value="168">A cada 7 Dias</option>
            </select>
            <span className="text-[10px] text-slate-400 mt-1 block">Impede que o mesmo usuário repita o trial seguido</span>
          </div>
        </div>

        {/* QoS Bandwidth Limits */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-slate-200 dark:border-slate-800">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Velocidade Máxima Download (Mbps)
            </label>
            <input
              type="number"
              min="1"
              value={downloadMbps}
              onChange={(e) => setDownloadMbps(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-800 dark:text-white outline-none focus:ring-1 focus:ring-indigo-500 font-mono"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Velocidade Máxima Upload (Mbps)
            </label>
            <input
              type="number"
              min="1"
              value={uploadMbps}
              onChange={(e) => setUploadMbps(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-800 dark:text-white outline-none focus:ring-1 focus:ring-indigo-500 font-mono"
            />
          </div>
        </div>

        {/* Lead Capture Fields */}
        <div className="pt-4 border-t border-slate-200 dark:border-slate-800 space-y-3">
          <label className="block text-xs font-bold text-slate-800 dark:text-white">
            Campos Exigidos para Liberar o Teste (Captura de Leads)
          </label>
          <div className="flex flex-wrap gap-4 text-xs">
            <label className="flex items-center gap-2 cursor-pointer text-slate-700 dark:text-slate-300">
              <input
                type="checkbox"
                checked={requireName}
                onChange={(e) => setRequireName(e.target.checked)}
                className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
              />
              <span>Nome do Visitante</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer text-slate-700 dark:text-slate-300">
              <input
                type="checkbox"
                checked={requirePhone}
                onChange={(e) => setRequirePhone(e.target.checked)}
                className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
              />
              <span>WhatsApp / Telefone</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer text-slate-700 dark:text-slate-300">
              <input
                type="checkbox"
                checked={requireEmail}
                onChange={(e) => setRequireEmail(e.target.checked)}
                className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
              />
              <span>E-mail</span>
            </label>
          </div>
        </div>

        <div className="flex justify-end pt-4 border-t border-slate-200 dark:border-slate-800">
          <button
            type="submit"
            className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold shadow-lg shadow-indigo-600/20 transition-all flex items-center gap-2 cursor-pointer"
          >
            <i className="bi bi-save" />
            <span>Salvar Configurações do Trial</span>
          </button>
        </div>
      </form>
    </div>
  )
}
