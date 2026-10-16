import React, { useState } from 'react'

export const AssinaturaView: React.FC<{ mode?: 'planos' | 'faturas' }> = ({ mode = 'planos' }) => {
  const [activeTab, setActiveTab] = useState<'plano' | 'faturas'>(mode === 'faturas' ? 'faturas' : 'plano')
  const [showPixModal, setShowPixModal] = useState(false)
  const [selectedFatura, setSelectedFatura] = useState<any>(null)

  const faturas = [
    { id: 'FAT-2026-10', mes: 'Outubro / 2026', valor: 149.9, vencimento: '2026-10-25', status: 'aberto' },
    { id: 'FAT-2026-09', mes: 'Setembro / 2026', valor: 149.9, vencimento: '2026-09-25', status: 'pago' },
    { id: 'FAT-2026-08', mes: 'Agosto / 2026', valor: 149.9, vencimento: '2026-08-25', status: 'pago' },
  ]

  const handleOpenPix = (fat: any) => {
    setSelectedFatura(fat)
    setShowPixModal(true)
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-bold text-slate-800 dark:text-white flex items-center gap-2">
          <i className="bi bi-credit-card-2-front text-indigo-400" />
          Assinatura CMS_Hotspot & Faturas
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
          Gerencie o plano da sua plataforma, limites de roteadores contratados e 2ª via de faturas.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200 dark:border-slate-800 gap-6 text-xs font-semibold">
        <button
          type="button"
          onClick={() => setActiveTab('plano')}
          className={`pb-3 transition-colors border-b-2 cursor-pointer ${
            activeTab === 'plano'
              ? 'border-indigo-500 text-indigo-400 font-bold'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          Meu Plano & Recursos
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('faturas')}
          className={`pb-3 transition-colors border-b-2 cursor-pointer ${
            activeTab === 'faturas'
              ? 'border-indigo-500 text-indigo-400 font-bold'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          Faturas & Histórico de Pagamentos
        </button>
      </div>

      {activeTab === 'plano' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-4">
            <div className="flex items-start justify-between">
              <div>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                  Assinatura Ativa
                </span>
                <h3 className="text-xl font-bold text-slate-800 dark:text-white mt-2">
                  CMS_Hotspot — Plano Pro Ilimitado
                </h3>
                <p className="text-xs text-slate-400">Próxima renovação em 25 de Outubro de 2026</p>
              </div>

              <div className="text-right">
                <span className="text-xs text-slate-400">Mensalidade</span>
                <p className="text-2xl font-bold text-indigo-400 font-mono">R$ 149,90</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-4 border-t border-slate-100 dark:border-slate-800 text-xs">
              <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
                <i className="bi bi-check-circle-fill text-emerald-400 text-sm" />
                <span>Até 10 Concentradores MikroTik/Omada</span>
              </div>
              <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
                <i className="bi bi-check-circle-fill text-emerald-400 text-sm" />
                <span>Vouchers e Usuários Ilimitados</span>
              </div>
              <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
                <i className="bi bi-check-circle-fill text-emerald-400 text-sm" />
                <span>Integração PIX 24h sem taxa adicional</span>
              </div>
              <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
                <i className="bi bi-check-circle-fill text-emerald-400 text-sm" />
                <span>Túneis VPN WireGuard dedicados</span>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-indigo-950/40 to-slate-900 border border-indigo-500/30 rounded-2xl p-6 shadow-sm flex flex-col justify-between space-y-4">
            <div>
              <span className="text-xs font-semibold text-indigo-400 uppercase tracking-wider">
                Precisa de Mais?
              </span>
              <h4 className="text-base font-bold text-white mt-1">Upgrade para Plano Enterprise</h4>
              <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                Concentradores ilimitados, servidor VPN privado de alta velocidade e suporte com SLA de 1 hora.
              </p>
            </div>
            <button
              type="button"
              className="w-full py-2.5 px-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold transition-all shadow-lg shadow-indigo-600/20"
            >
              Falar com Suporte CMS_Hotspot
            </button>
          </div>
        </div>
      )}

      {activeTab === 'faturas' && (
        <div className="bg-white dark:bg-slate-900/60 backdrop-blur-xl border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left text-slate-600 dark:text-slate-300">
              <thead>
                <tr className="bg-slate-100 dark:bg-slate-800/90 border-b border-slate-200 dark:border-slate-800 text-[10px] uppercase font-bold text-slate-500">
                  <th className="px-5 py-3">Fatura</th>
                  <th className="px-5 py-3">Competência</th>
                  <th className="px-5 py-3">Valor</th>
                  <th className="px-5 py-3">Vencimento</th>
                  <th className="px-5 py-3">Status</th>
                  <th className="px-5 py-3 text-right">Ação</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                {faturas.map((f) => (
                  <tr key={f.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                    <td className="px-5 py-3 font-mono font-bold text-slate-800 dark:text-white">{f.id}</td>
                    <td className="px-5 py-3">{f.mes}</td>
                    <td className="px-5 py-3 font-mono font-bold text-emerald-400">
                      R$ {f.valor.toFixed(2).replace('.', ',')}
                    </td>
                    <td className="px-5 py-3 font-mono text-slate-400">{f.vencimento}</td>
                    <td className="px-5 py-3">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          f.status === 'pago'
                            ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                            : 'bg-amber-500/15 text-amber-400 border border-amber-500/30'
                        }`}
                      >
                        {f.status === 'pago' ? 'Paga' : 'Aguardando Pagamento'}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-right">
                      {f.status === 'aberto' ? (
                        <button
                          type="button"
                          onClick={() => handleOpenPix(f)}
                          className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold cursor-pointer shadow-sm flex items-center gap-1.5 ml-auto"
                        >
                          <i className="bi bi-qr-code" /> Pagar com PIX
                        </button>
                      ) : (
                        <span className="text-slate-400 text-xs">Comprovante OK</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal Pagamento PIX Fatura */}
      {showPixModal && selectedFatura && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in">
          <div className="relative w-full max-w-sm bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-2xl text-center space-y-4">
            <button
              type="button"
              onClick={() => setShowPixModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-200"
            >
              <i className="bi bi-x-lg text-base" />
            </button>

            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center mx-auto text-2xl">
              <i className="bi bi-qr-code-scan" />
            </div>

            <div>
              <h3 className="text-base font-bold text-slate-800 dark:text-white">Pagar Mensalidade via PIX</h3>
              <p className="text-xs text-slate-400">{selectedFatura.mes}</p>
            </div>

            <div className="p-4 bg-white rounded-xl inline-block border-2 border-dashed border-slate-300 shadow-inner">
              <img
                src="https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=00020126580014br.gov.bcb.pix0136financeiro@wifivouche.com5204000053039865405149.905802BR"
                alt="QR Code PIX"
                className="w-40 h-40 object-contain mx-auto"
              />
            </div>

            <p className="text-lg font-bold text-emerald-400 font-mono">
              R$ {selectedFatura.valor.toFixed(2).replace('.', ',')}
            </p>

            <button
              type="button"
              onClick={() => {
                navigator.clipboard.writeText('00020126580014br.gov.bcb.pix0136financeiro@wifivouche.com5204000053039865405149.905802BR')
                alert('Código PIX Copia e Cola copiado com sucesso!')
              }}
              className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold"
            >
              Copiar Código PIX Copia e Cola
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
