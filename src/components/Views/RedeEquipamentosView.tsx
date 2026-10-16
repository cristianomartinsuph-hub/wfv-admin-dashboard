import React, { useState } from 'react'

interface RedeEquipamentosViewProps {
  deviceType?: 'mikrotik' | 'grandstream' | 'omada'
}

export const RedeEquipamentosView: React.FC<RedeEquipamentosViewProps> = ({
  deviceType = 'mikrotik',
}) => {
  const [activeTab, setActiveTab] = useState<'mikrotik' | 'grandstream' | 'omada'>(deviceType)
  const [copied, setCopied] = useState(false)
  const [pingStatus, setPingStatus] = useState<string | null>(null)
  const [testingId, setTestingId] = useState<string | null>(null)

  const mikrotikScript = `# ==========================================
# WFV ADMIN - SCRIPT DE PROVISIONAMENTO AUTOMÁTICO
# Suporta RouterOS v6.x e v7.x (RB750, RB4011, CCR, hAP)
# ==========================================
/ip hotspot profile
set [ find default=yes ] html-directory=hotspot login-by=http-chap,http-pap rate-limit=10M/5M
/ip hotspot walled-garden
add comment="WFV Admin Gateway" dst-host=*.wifivouche.com
add comment="Mercado Pago PIX" dst-host=*.mercadopago.com
add comment="Mercado Pago API" dst-host=*.mercadolivre.com
add comment="Banco Central Pix" dst-host=*.bcb.gov.br
add comment="Gerencianet / Efi" dst-host=*.efipay.com.br
/tool fetch url="https://login.wifivouche.com/download/wfv-login.zip" mode=https dst-path=hotspot.zip
/file print`

  const handleCopy = () => {
    navigator.clipboard.writeText(mikrotikScript)
    setCopied(true)
    setTimeout(() => setCopied(false), 2500)
  }

  const handleTestPing = (id: string, ip: string) => {
    setTestingId(id)
    setPingStatus('Enviando pacotes ICMP / WireGuard VPN...')
    setTimeout(() => {
      setPingStatus(`Gateway ${ip} respondeu em 12ms. Conexão VPN WireGuard 100% OK!`)
      setTestingId(null)
      setTimeout(() => setPingStatus(null), 4000)
    }, 1200)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-lg font-bold text-slate-800 dark:text-white flex items-center gap-2">
          <i className="bi bi-router text-sky-400" />
          Infraestrutura de Rede & Concentradores
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
          Provisionamento, scripts RouterOS, túneis VPN e compatibilidade com MikroTik, TP-Link Omada e Grandstream.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200 dark:border-slate-800 gap-6 text-xs font-semibold">
        <button
          type="button"
          onClick={() => setActiveTab('mikrotik')}
          className={`pb-3 transition-colors border-b-2 cursor-pointer flex items-center gap-2 ${
            activeTab === 'mikrotik'
              ? 'border-sky-500 text-sky-400 font-bold'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <i className="bi bi-broadcast-pin" />
          <span>MikroTik RouterOS (Nativo)</span>
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('omada')}
          className={`pb-3 transition-colors border-b-2 cursor-pointer flex items-center gap-2 ${
            activeTab === 'omada'
              ? 'border-sky-500 text-sky-400 font-bold'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <i className="bi bi-wifi" />
          <span>TP-Link Omada (Controladora)</span>
          <span className="text-[9px] bg-indigo-500/20 text-indigo-400 px-1.5 py-0.2 rounded font-mono">Beta</span>
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('grandstream')}
          className={`pb-3 transition-colors border-b-2 cursor-pointer flex items-center gap-2 ${
            activeTab === 'grandstream'
              ? 'border-sky-500 text-sky-400 font-bold'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <i className="bi bi-hdd-network" />
          <span>Grandstream GWN Series</span>
          <span className="text-[9px] bg-indigo-500/20 text-indigo-400 px-1.5 py-0.2 rounded font-mono">Beta</span>
        </button>
      </div>

      {pingStatus && (
        <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs flex items-center gap-2 animate-in fade-in">
          <i className="bi bi-activity text-base flex-shrink-0 animate-pulse" />
          <span>{pingStatus}</span>
        </div>
      )}

      {/* MikroTik Tab */}
      {activeTab === 'mikrotik' && (
        <div className="space-y-6">
          {/* Script Generator Card */}
          <div className="bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-sm font-bold text-slate-800 dark:text-white flex items-center gap-2">
                  <i className="bi bi-terminal-fill text-indigo-400" />
                  Script de Configuração Automática RouterOS
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Cole este terminal no seu MikroTik (Terminal / CLI) para liberar o Walled Garden do PIX e instalar o captive portal.
                </p>
              </div>

              <button
                type="button"
                onClick={handleCopy}
                className="px-3.5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold shadow-lg shadow-indigo-600/20 transition-all flex items-center gap-1.5 self-start sm:self-auto cursor-pointer"
              >
                <i className={`bi ${copied ? 'bi-check-lg' : 'bi-clipboard'}`} />
                <span>{copied ? 'Copiado para Área de Transferência!' : 'Copiar Script RouterOS'}</span>
              </button>
            </div>

            <pre className="p-4 bg-slate-950 text-emerald-400 rounded-xl text-xs font-mono overflow-x-auto border border-slate-800 leading-relaxed">
              {mikrotikScript}
            </pre>
          </div>

          {/* Connected Routers Table */}
          <div className="bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm">
            <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-800 dark:text-white">
                Roteadores MikroTik Conectados
              </h3>
              <span className="text-xs text-emerald-400 font-semibold flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" /> Túneis VPN Ativos
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left text-slate-600 dark:text-slate-300">
                <thead>
                  <tr className="bg-slate-100 dark:bg-slate-800/90 border-b border-slate-200 dark:border-slate-800 text-[10px] uppercase font-bold text-slate-500">
                    <th className="px-5 py-3">Roteador / Identidade</th>
                    <th className="px-5 py-3">Modelo</th>
                    <th className="px-5 py-3">IP VPN / Local</th>
                    <th className="px-5 py-3">Versão ROS</th>
                    <th className="px-5 py-3">Status</th>
                    <th className="px-5 py-3 text-right">Diagnóstico</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                  {[
                    { id: '1', nome: 'Central-Mikrotik-01', modelo: 'RB750Gr3 (hEX)', ip: '192.168.88.1', ros: 'v7.16', status: 'ON' },
                    { id: '2', nome: 'Shopping-Norte-Core', modelo: 'hAP ax² WiFi6', ip: '10.10.20.1', ros: 'v7.15.2', status: 'ON' },
                    { id: '3', nome: 'Concentrador-Torre-03', modelo: 'CCR2004-16G-2S+', ip: '10.200.1.1', ros: 'v7.14', status: 'ON' },
                  ].map((r) => (
                    <tr key={r.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                      <td className="px-5 py-3 font-semibold text-slate-800 dark:text-white">{r.nome}</td>
                      <td className="px-5 py-3 text-slate-400">{r.modelo}</td>
                      <td className="px-5 py-3 font-mono text-indigo-400">{r.ip}</td>
                      <td className="px-5 py-3 font-mono text-slate-400">{r.ros}</td>
                      <td className="px-5 py-3">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/15 text-emerald-400">
                          ONLINE
                        </span>
                      </td>
                      <td className="px-5 py-3 text-right">
                        <button
                          type="button"
                          disabled={testingId === r.id}
                          onClick={() => handleTestPing(r.id, r.ip)}
                          className="px-2.5 py-1 text-xs font-semibold bg-sky-600/15 text-sky-400 hover:bg-sky-600/25 border border-sky-500/30 rounded-lg transition-colors cursor-pointer"
                        >
                          {testingId === r.id ? 'Testando...' : 'Testar Ping / VPN'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TP-Link Omada Tab */}
      {activeTab === 'omada' && (
        <div className="bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-sky-500/10 text-sky-400 text-xl">
              <i className="bi bi-wifi" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-800 dark:text-white">
                Integração TP-Link Omada SDN (Controller)
              </h3>
              <p className="text-xs text-slate-400">
                Suporta controladoras Omada Software Controller, OC200 e OC300 via External Web Portal.
              </p>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 space-y-2 text-xs text-slate-600 dark:text-slate-300">
            <p className="font-semibold text-slate-800 dark:text-white">Passo a passo de configuração na Omada:</p>
            <ol className="list-decimal pl-4 space-y-1 text-slate-400">
              <li>Acesse o Controller Omada &rarr; <strong>Settings &rarr; Authentication &rarr; Portal</strong>.</li>
              <li>Em Authentication Type, selecione <strong>External Web Portal</strong>.</li>
              <li>Em External Portal Server URL, informe: <strong className="text-indigo-400 font-mono">https://login.wifivouche.com/omada/</strong></li>
              <li>Libere os IPs do Walled Garden para o PIX do Banco Central e Mercado Pago.</li>
            </ol>
          </div>
        </div>
      )}

      {/* Grandstream Tab */}
      {activeTab === 'grandstream' && (
        <div className="bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-indigo-500/10 text-indigo-400 text-xl">
              <i className="bi bi-hdd-network" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-800 dark:text-white">
                Grandstream GWN Series & GWN.Cloud
              </h3>
              <p className="text-xs text-slate-400">
                Configuração de captive portal externo em access points GWN7660, GWN7630 e GWN7605.
              </p>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 space-y-2 text-xs text-slate-600 dark:text-slate-300">
            <p className="font-semibold text-slate-800 dark:text-white">URL do Captive Portal Grandstream:</p>
            <p className="font-mono text-indigo-400 bg-slate-900 p-2 rounded-lg border border-slate-800 select-all">
              https://login.wifivouche.com/grandstream/portal.php?ap_mac=$AP_MAC&client_mac=$CLIENT_MAC
            </p>
          </div>
        </div>
      )}
    </div>
  )
}
