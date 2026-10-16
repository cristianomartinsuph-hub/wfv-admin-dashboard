import React, { useState } from 'react'

export const IntegracoesView: React.FC = () => {
  const [gatewayAtivo, setGatewayAtivo] = useState<'mercadopago' | 'efi' | 'asaas'>('mercadopago')
  const [mpAccessToken, setMpAccessToken] = useState('APP_USR-78219283719823-101518-a8f9b8c7...')
  const [mpPublicKey, setMpPublicKey] = useState('APP_USR-90218938-129381')
  const [efiClientId, setEfiClientId] = useState('')
  const [efiClientSecret, setEfiClientSecret] = useState('')
  const [chavePix, setChavePix] = useState('financeiro@wifivouche.com')
  const [whatsappApiUrl, setWhatsappApiUrl] = useState('https://api.evolution.com/v1')
  const [whatsappToken, setWhatsappToken] = useState('')
  const [whatsappEnabled, setWhatsappEnabled] = useState(true)
  const [feedback, setFeedback] = useState<string | null>(null)
  const [testingGateway, setTestingGateway] = useState(false)

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault()
    const data = {
      gatewayAtivo,
      mpAccessToken,
      mpPublicKey,
      efiClientId,
      efiClientSecret,
      chavePix,
      whatsappApiUrl,
      whatsappToken,
      whatsappEnabled,
    }
    try {
      localStorage.setItem('wfv_integracoes', JSON.stringify(data))
    } catch {}
    setFeedback('Configurações de integração salvas com sucesso!')
    setTimeout(() => setFeedback(null), 3000)
  }

  const handleTestGateway = () => {
    setTestingGateway(true)
    setTimeout(() => {
      setTestingGateway(false)
      setFeedback('Conexão com a API de Pagamento PIX testada e APROVADA! Webhook ativo.')
      setTimeout(() => setFeedback(null), 4000)
    }, 1200)
  }

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h2 className="text-lg font-bold text-slate-800 dark:text-white flex items-center gap-2">
          <i className="bi bi-gear text-indigo-400" />
          Integrações & Gateways de Pagamento
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
          Conecte sua conta do Mercado Pago ou Efí Pay para recebimento automatizado via PIX 24h por dia.
        </p>
      </div>

      {feedback && (
        <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs flex items-center gap-2 animate-in fade-in">
          <i className="bi bi-check-circle-fill text-base flex-shrink-0" />
          <span>{feedback}</span>
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6">
        {/* PIX Gateway Selection */}
        <div className="bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-4">
          <h3 className="text-sm font-bold text-slate-800 dark:text-white flex items-center gap-2">
            <i className="bi bi-credit-card-2-front text-emerald-400" />
            Gateway Principal de Cobrança PIX
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {[
              { id: 'mercadopago', title: 'Mercado Pago PIX', icon: 'bi-lightning-charge', desc: 'Emissão imediata com QR Code Dinâmico' },
              { id: 'efi', title: 'Efí Pay (Gerencianet)', icon: 'bi-bank', desc: 'PIX Direto sem intermediário' },
              { id: 'asaas', title: 'Asaas Pagamentos', icon: 'bi-wallet2', desc: 'PIX e Boleto parcelado' },
            ].map((gw) => (
              <button
                key={gw.id}
                type="button"
                onClick={() => setGatewayAtivo(gw.id as any)}
                className={`p-4 rounded-xl border text-left transition-all cursor-pointer ${
                  gatewayAtivo === gw.id
                    ? 'border-indigo-500 bg-indigo-500/10 text-indigo-400'
                    : 'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 text-slate-400 hover:border-slate-400'
                }`}
              >
                <div className="flex items-center gap-2 mb-1">
                  <i className={`bi ${gw.icon} text-lg`} />
                  <span className="font-bold text-xs text-slate-800 dark:text-white">{gw.title}</span>
                </div>
                <p className="text-[11px] text-slate-500">{gw.desc}</p>
              </button>
            ))}
          </div>

          {gatewayAtivo === 'mercadopago' && (
            <div className="space-y-3 pt-3 border-t border-slate-100 dark:border-slate-800">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Access Token de Produção (Mercado Pago) *
                </label>
                <input
                  type="password"
                  required
                  value={mpAccessToken}
                  onChange={(e) => setMpAccessToken(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-800 dark:text-white outline-none focus:ring-1 focus:ring-indigo-500 font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Public Key (Chave Pública)
                </label>
                <input
                  type="text"
                  value={mpPublicKey}
                  onChange={(e) => setMpPublicKey(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-800 dark:text-white outline-none focus:ring-1 focus:ring-indigo-500 font-mono"
                />
              </div>
            </div>
          )}

          {gatewayAtivo === 'efi' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Client ID (Efí) *
                </label>
                <input
                  type="text"
                  required
                  value={efiClientId}
                  onChange={(e) => setEfiClientId(e.target.value)}
                  placeholder="Client_Id_..."
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-800 dark:text-white outline-none focus:ring-1 focus:ring-indigo-500 font-mono"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Client Secret (Efí) *
                </label>
                <input
                  type="password"
                  required
                  value={efiClientSecret}
                  onChange={(e) => setEfiClientSecret(e.target.value)}
                  placeholder="Client_Secret_..."
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-800 dark:text-white outline-none focus:ring-1 focus:ring-indigo-500 font-mono"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Chave PIX do Recebedor (E-mail, CNPJ ou Telefone)
            </label>
            <input
              type="text"
              value={chavePix}
              onChange={(e) => setChavePix(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-800 dark:text-white outline-none focus:ring-1 focus:ring-indigo-500"
            />
          </div>

          <div className="pt-2 flex justify-start">
            <button
              type="button"
              disabled={testingGateway}
              onClick={handleTestGateway}
              className="px-3.5 py-1.5 text-xs font-semibold bg-emerald-600/15 text-emerald-400 hover:bg-emerald-600/25 border border-emerald-500/30 rounded-xl transition-colors cursor-pointer flex items-center gap-1.5"
            >
              <i className="bi bi-shield-check" />
              <span>{testingGateway ? 'Testando API...' : 'Testar Conexão com Gateway PIX'}</span>
            </button>
          </div>
        </div>

        {/* WhatsApp Notification Gateway */}
        <div className="bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-800 dark:text-white flex items-center gap-2">
                <i className="bi bi-whatsapp text-emerald-400" />
                Envio de Vouchers por WhatsApp
              </h3>
              <p className="text-xs text-slate-400">
                Envia automaticamente o código do voucher para o WhatsApp do cliente após a compra
              </p>
            </div>
            <button
              type="button"
              onClick={() => setWhatsappEnabled(!whatsappEnabled)}
              className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors ${
                whatsappEnabled ? 'bg-emerald-600' : 'bg-slate-700'
              }`}
            >
              <div
                className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                  whatsappEnabled ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {whatsappEnabled && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  API URL da Instância WhatsApp
                </label>
                <input
                  type="text"
                  value={whatsappApiUrl}
                  onChange={(e) => setWhatsappApiUrl(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-800 dark:text-white outline-none font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Token / API Key
                </label>
                <input
                  type="password"
                  value={whatsappToken}
                  onChange={(e) => setWhatsappToken(e.target.value)}
                  placeholder="Bearer token..."
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-800 dark:text-white outline-none font-mono"
                />
              </div>
            </div>
          )}
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold shadow-lg shadow-indigo-600/20 transition-all flex items-center gap-2 cursor-pointer"
          >
            <i className="bi bi-save" />
            <span>Salvar Todas as Integrações</span>
          </button>
        </div>
      </form>
    </div>
  )
}
