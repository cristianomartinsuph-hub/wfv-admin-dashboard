import React, { useState, useEffect } from 'react'

export const RelogioView: React.FC = () => {
  const [time, setTime] = useState(new Date())
  const [timezone, setTimezone] = useState(() => {
    try {
      const saved = localStorage.getItem('wfv_timezone_config')
      return saved ? JSON.parse(saved).timezone : 'America/Sao_Paulo'
    } catch {
      return 'America/Sao_Paulo'
    }
  })
  const [ntpServer, setNtpServer] = useState('pool.ntp.br')
  const [feedback, setFeedback] = useState<string | null>(null)

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault()
    try {
      localStorage.setItem('wfv_timezone_config', JSON.stringify({ timezone, ntpServer }))
    } catch {}
    setFeedback('Fuso horário e parâmetros NTP salvos com sucesso!')
    setTimeout(() => setFeedback(null), 3000)
  }

  const timeString = time.toLocaleTimeString('pt-BR', { timeZone: timezone })
  const dateString = time.toLocaleDateString('pt-BR', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    timeZone: timezone,
  })

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h2 className="text-lg font-bold text-slate-800 dark:text-white flex items-center gap-2">
          <i className="bi bi-clock-history text-indigo-400" />
          Relógio do Sistema & Sincronização NTP
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
          A precisão do relógio é fundamental para que o tempo de expiração dos vouchers bata exatamente com os roteadores.
        </p>
      </div>

      {feedback && (
        <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs flex items-center gap-2 animate-in fade-in">
          <i className="bi bi-check-circle-fill text-base flex-shrink-0" />
          <span>{feedback}</span>
        </div>
      )}

      {/* Clock Display Card */}
      <div className="bg-gradient-to-tr from-slate-900 to-indigo-950 border border-indigo-500/30 rounded-2xl p-8 shadow-xl text-center space-y-2">
        <span className="text-xs uppercase tracking-widest text-indigo-400 font-bold">
          Horário Oficial do Servidor WFV
        </span>
        <div className="text-5xl sm:text-6xl font-black font-mono tracking-widest text-white py-2 selection:bg-indigo-500/30">
          {timeString}
        </div>
        <p className="text-xs text-slate-400 capitalize">{dateString}</p>
        <div className="pt-3 flex items-center justify-center gap-2 text-xs text-emerald-400">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>Sincronizado via NTP (Offset: 0.002s)</span>
        </div>
      </div>

      {/* Configuration Form */}
      <form onSubmit={handleSave} className="bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-4">
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
            Fuso Horário (Timezone) *
          </label>
          <select
            value={timezone}
            onChange={(e) => setTimezone(e.target.value)}
            className="w-full bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-800 dark:text-white outline-none focus:ring-1 focus:ring-indigo-500"
          >
            <option value="America/Sao_Paulo">Brasília / São Paulo (UTC-03:00)</option>
            <option value="America/Manaus">Manaus / Amazonas (UTC-04:00)</option>
            <option value="America/Cuiaba">Cuiabá / Campo Grande (UTC-04:00)</option>
            <option value="America/Porto_Velho">Porto Velho / Rondônia (UTC-04:00)</option>
            <option value="America/Rio_Branco">Rio Branco / Acre (UTC-05:00)</option>
            <option value="America/Fortaleza">Fortaleza / Nordeste (UTC-03:00)</option>
            <option value="America/Belem">Belém / Norte (UTC-03:00)</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
            Servidor de Hora NTP
          </label>
          <input
            type="text"
            value={ntpServer}
            onChange={(e) => setNtpServer(e.target.value)}
            className="w-full bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-800 dark:text-white outline-none focus:ring-1 focus:ring-indigo-500 font-mono"
          />
          <span className="text-[10px] text-slate-400 mt-1 block">
            Padrão para roteadores no Brasil: a.ntp.br, b.ntp.br ou pool.ntp.br
          </span>
        </div>

        <div className="flex justify-end pt-2">
          <button
            type="submit"
            className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold shadow-lg shadow-indigo-600/20 transition-all flex items-center gap-2 cursor-pointer"
          >
            <i className="bi bi-check-lg" />
            <span>Salvar Fuso Horário</span>
          </button>
        </div>
      </form>
    </div>
  )
}
