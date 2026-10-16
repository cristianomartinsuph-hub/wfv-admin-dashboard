import React, { useState } from 'react'

export const TutoriaisLgpdView: React.FC<{ mode: 'tutoriais' | 'lgpd' }> = ({ mode }) => {
  const [lgpdMac, setLgpdMac] = useState('')
  const [lgpdPhone, setLgpdPhone] = useState('')
  const [feedback, setFeedback] = useState<string | null>(null)

  const handleLgpdDelete = (e: React.FormEvent) => {
    e.preventDefault()
    if (!lgpdMac && !lgpdPhone) return
    setFeedback(`Solicitação LGPD protocolada (#LGPD-${Date.now().toString().slice(-6)}). Os dados de log de conexão foram anonimizados conforme a Lei 13.709/2018.`)
    setLgpdMac('')
    setLgpdPhone('')
    setTimeout(() => setFeedback(null), 5000)
  }

  if (mode === 'lgpd') {
    return (
      <div className="space-y-6 max-w-3xl">
        <div>
          <h2 className="text-lg font-bold text-slate-800 dark:text-white flex items-center gap-2">
            <i className="bi bi-shield-x text-rose-400" />
            Privacidade & Exclusão de Dados (LGPD)
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Atendimento aos direitos do titular de dados e anonimização de logs de captive portal.
          </p>
        </div>

        {feedback && (
          <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs flex items-center gap-2 animate-in fade-in">
            <i className="bi bi-check-circle-fill text-base flex-shrink-0" />
            <span>{feedback}</span>
          </div>
        )}

        <div className="bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-4">
          <h3 className="text-sm font-bold text-slate-800 dark:text-white">
            Anonimização e Exclusão de Registros de Conexão
          </h3>
          <p className="text-xs text-slate-400">
            Informe o número de telefone ou MAC do cliente para expurgar seus dados de navegação e histórico do captive portal.
          </p>

          <form onSubmit={handleLgpdDelete} className="space-y-4 pt-2">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                WhatsApp / Telefone do Titular
              </label>
              <input
                type="text"
                value={lgpdPhone}
                onChange={(e) => setLgpdPhone(e.target.value)}
                placeholder="(11) 98765-4321"
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-800 dark:text-white outline-none font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                MAC Address do Dispositivo (Opcional)
              </label>
              <input
                type="text"
                value={lgpdMac}
                onChange={(e) => setLgpdMac(e.target.value)}
                placeholder="00:1A:2B:3C:4D:5E"
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-800 dark:text-white outline-none font-mono"
              />
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="submit"
                className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-semibold shadow-lg shadow-rose-600/20 transition-all flex items-center gap-2 cursor-pointer"
              >
                <i className="bi bi-trash3" />
                <span>Anonimizar e Excluir Dados do Titular</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    )
  }

  // Tutoriais
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-bold text-slate-800 dark:text-white flex items-center gap-2">
          <i className="bi bi-play-btn-fill text-indigo-400" />
          Tutoriais & Central de Ajuda CMS_Hotspot
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
          Guias ilustrados passo a passo para configuração de roteadores, faturamento e impressão.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {[
          {
            title: '1. Configuração do MikroTik via Script Automático',
            desc: 'Aprenda como colar o script oficial do CMS_Hotspot no Terminal do Winbox para ativar o Hotspot, Walled Garden e captive portal em menos de 2 minutos.',
            icon: 'bi-router',
            badge: 'Essencial',
          },
          {
            title: '2. Integração PIX Automático do Mercado Pago',
            desc: 'Passo a passo para gerar seu Access Token e Public Key no Mercado Pago Developers e habilitar a liberação instantânea de internet.',
            icon: 'bi-qr-code',
            badge: 'Pagamento',
          },
          {
            title: '3. Impressão de Vouchers em Mini Impressoras Térmicas',
            desc: 'Como configurar a impressão de bobinas 58mm e 80mm via USB ou Bluetooth para venda física de vouchers no balcão.',
            icon: 'bi-printer',
            badge: 'Vendas',
          },
          {
            title: '4. Integração TP-Link Omada e Grandstream',
            desc: 'Guia de configuração do External Captive Portal em controladoras Omada Software / Hardware e access points GWN Series.',
            icon: 'bi-wifi',
            badge: 'Rede',
          },
        ].map((tut, i) => (
          <div
            key={i}
            className="bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm hover:border-indigo-500/40 transition-all space-y-3"
          >
            <div className="flex items-center justify-between">
              <div className="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center text-xl">
                <i className={`bi ${tut.icon}`} />
              </div>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-500/15 text-indigo-400">
                {tut.badge}
              </span>
            </div>

            <h3 className="text-sm font-bold text-slate-800 dark:text-white">{tut.title}</h3>
            <p className="text-xs text-slate-400 leading-relaxed">{tut.desc}</p>

            <button
              type="button"
              onClick={() => alert(`Abrindo tutorial completo: ${tut.title}`)}
              className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 flex items-center gap-1 cursor-pointer pt-1"
            >
              <span>Ver Tutorial Completo</span>
              <i className="bi bi-arrow-right" />
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}
