import React from 'react'
import type { ActiveRoute } from '../../types/dashboard'
import { UserManagementView } from '../Users/UserManagementView'
import { HotspotPlanosView } from './HotspotPlanosView'
import { HotspotClientesView } from './HotspotClientesView'
import { HotspotTrialView } from './HotspotTrialView'
import { HotspotRevendasView } from './HotspotRevendasView'
import { HotspotLotesView } from './HotspotLotesView'
import { FinanceiroPixView } from './FinanceiroPixView'
import { RedeEquipamentosView } from './RedeEquipamentosView'
import { IntegracoesView } from './IntegracoesView'
import { AssinaturaView } from './AssinaturaView'
import { AlertasView } from './AlertasView'
import { ConsumoView } from './ConsumoView'
import { TutoriaisLgpdView } from './TutoriaisLgpdView'
import { RelogioView } from './RelogioView'
import { HotspotDashboardView } from './HotspotDashboardView'

interface SectionViewsProps {
  activeRoute: ActiveRoute
  onBackToOverview: () => void
}

export const SectionViews: React.FC<SectionViewsProps> = ({ activeRoute, onBackToOverview }) => {
  if (activeRoute === 'inicio') return null

  // Route label for breadcrumb
  const getRouteLabel = () => {
    switch (activeRoute) {
      case 'usuarios': return 'Gestão de Usuários'
      case 'hotspot':
      case 'hotspot-dashboard': return 'Hotspot / Dashboard Operacional'
      case 'hotspot-planos': return 'Hotspot / Planos & Tarifas'
      case 'hotspot-clientes': return 'Hotspot / Clientes Fixos'
      case 'hotspot-trial': return 'Hotspot / Tempo Trial Captive Portal'
      case 'hotspot-revendas': return 'Hotspot / Revendas & Pontos de Venda'
      case 'hotspot-lotes': return 'Hotspot / Lotes de Vouchers Impressos'
      case 'hotspot-lotespix': return 'Hotspot / Lotes PIX Automatizados'
      case 'vouchers': return 'Gestão de Vouchers'
      case 'financeiro': return 'Financeiro & Visão Geral'
      case 'financeiro-pix': return 'Financeiro / Compras PIX & Cartão'
      case 'devolucao-pix': return 'Financeiro / Estorno e Devolução PIX'
      case 'pix-devolvidos': return 'Financeiro / Histórico de PIX Devolvidos'
      case 'contestacoes': return 'Financeiro / Contestações & Disputas'
      case 'relatorios':
      case 'consumo': return 'Relatórios & Consumo de Banda'
      case 'mikrotik': return 'Rede / Equipamentos MikroTik RouterOS'
      case 'grandstream': return 'Rede / Equipamentos Grandstream AP'
      case 'omada': return 'Rede / Equipamentos TP-Link Omada SDN'
      case 'tutoriais': return 'Central de Ajuda / Tutoriais'
      case 'lgpd': return 'Privacidade & Conformidade LGPD'
      case 'assinatura': return 'Assinatura / Planos da Plataforma'
      case 'assinatura-faturas': return 'Assinatura / Faturas & Recibos'
      case 'integracoes': return 'Configurações de Integrações (Gateways & WhatsApp)'
      case 'alertas': return 'Central de Alertas & Notificações'
      case 'relogio': return 'Relógio do Sistema & Sincronização NTP'
      default: return 'Painel do Sistema'
    }
  }

  const renderContent = () => {
    switch (activeRoute) {
      case 'usuarios':
        return <UserManagementView />

      case 'hotspot':
      case 'hotspot-dashboard':
        return <HotspotDashboardView />

      case 'hotspot-planos':
        return <HotspotPlanosView />

      case 'hotspot-clientes':
        return <HotspotClientesView />

      case 'hotspot-trial':
        return <HotspotTrialView />

      case 'hotspot-revendas':
        return <HotspotRevendasView />

      case 'hotspot-lotes':
        return <HotspotLotesView mode="lotes" />

      case 'hotspot-lotespix':
        return <HotspotLotesView mode="lotespix" />

      case 'vouchers':
        return <HotspotLotesView mode="vouchers" />

      case 'financeiro':
        return <FinanceiroPixView route="financeiro" />

      case 'financeiro-pix':
        return <FinanceiroPixView route="financeiro-pix" />

      case 'devolucao-pix':
        return <FinanceiroPixView route="devolucao-pix" />

      case 'pix-devolvidos':
        return <FinanceiroPixView route="pix-devolvidos" />

      case 'contestacoes':
        return <FinanceiroPixView route="contestacoes" />

      case 'relatorios':
      case 'consumo':
        return <ConsumoView />

      case 'mikrotik':
        return <RedeEquipamentosView deviceType="mikrotik" />

      case 'grandstream':
        return <RedeEquipamentosView deviceType="grandstream" />

      case 'omada':
        return <RedeEquipamentosView deviceType="omada" />

      case 'tutoriais':
        return <TutoriaisLgpdView mode="tutoriais" />

      case 'lgpd':
        return <TutoriaisLgpdView mode="lgpd" />

      case 'assinatura':
        return <AssinaturaView mode="planos" />

      case 'assinatura-faturas':
        return <AssinaturaView mode="faturas" />

      case 'integracoes':
        return <IntegracoesView />

      case 'alertas':
        return <AlertasView />

      case 'relogio':
        return <RelogioView />

      default:
        return (
          <div className="p-8 text-center bg-slate-900 border border-slate-800 rounded-2xl">
            <i className="bi bi-info-circle text-4xl text-indigo-400 mb-3 block" />
            <p className="text-slate-300 font-medium">Selecione uma opção no menu lateral para visualizar.</p>
          </div>
        )
    }
  }

  return (
    <div className="space-y-4 animate-in fade-in duration-200">
      {/* Universal Breadcrumb / Back Bar */}
      <div className="flex items-center justify-between bg-white dark:bg-slate-900/80 backdrop-blur-md border border-slate-200 dark:border-slate-800 px-4 py-2.5 rounded-xl shadow-xs">
        <div className="flex items-center gap-2 text-xs">
          <button
            type="button"
            onClick={onBackToOverview}
            className="text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 flex items-center gap-1 font-medium transition-colors cursor-pointer"
          >
            <i className="bi bi-speedometer2" />
            Início
          </button>
          <span className="text-slate-300 dark:text-slate-600">/</span>
          <span className="text-slate-800 dark:text-indigo-400 font-semibold truncate">
            {getRouteLabel()}
          </span>
        </div>

        <button
          type="button"
          onClick={onBackToOverview}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-500/30 hover:bg-indigo-100 dark:hover:bg-indigo-500/20 transition-all cursor-pointer shadow-xs active:scale-95"
        >
          <i className="bi bi-arrow-left" />
          <span>Voltar para Início</span>
        </button>
      </div>

      {/* Render the specialized functional view */}
      {renderContent()}
    </div>
  )
}
