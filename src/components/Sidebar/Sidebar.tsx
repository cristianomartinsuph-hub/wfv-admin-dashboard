import React from 'react'
import { SidebarItem } from './SidebarItem'
import { SidebarSubmenu } from './SidebarSubmenu'
import type { ActiveRoute } from '../../types/dashboard'

interface SidebarProps {
  activeRoute: ActiveRoute
  onNavigate: (route: ActiveRoute) => void
  isMobileOpen: boolean
  onCloseMobile: () => void
  isPinned: boolean
  onTogglePin: () => void
  currentUser?: { email: string; name: string } | null
  onOpenProfile?: () => void
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeRoute,
  onNavigate,
  isMobileOpen,
  onCloseMobile,
  isPinned,
  onTogglePin,
  currentUser,
  onOpenProfile,
}) => {
  return (
    <>
      {/* Mobile Backdrop */}
      {isMobileOpen && (
        <div
          onClick={onCloseMobile}
          className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-40 md:hidden transition-opacity duration-300"
          aria-hidden="true"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 flex flex-col w-64 bg-slate-900 border-r border-slate-700/50 text-slate-200 transition-transform duration-300 ease-in-out md:translate-x-0 ${
          isMobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        } ${isPinned ? 'md:w-64' : 'md:w-64'}`}
      >
        {/* Header Branding */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-slate-700/50 bg-slate-900/90 backdrop-blur-md">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center p-1 shadow-lg shadow-indigo-500/20">
              <img
                src="/wifivoucher.png"
                alt="WFV Logo"
                className="w-full h-full object-contain"
                onError={(e) => {
                  e.currentTarget.style.display = 'none'
                }}
              />
              <i className="bi bi-wifi text-indigo-400 text-base hidden only:block" />
            </div>
            <span className="font-semibold text-white text-base tracking-tight block">WFV Admin</span>
          </div>

          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={onTogglePin}
              title={isPinned ? 'Desafixar menu' : 'Fixar menu'}
              className="p-1.5 text-slate-400 hover:text-white rounded-md hover:bg-slate-700/50 transition-colors hidden md:block"
            >
              <i className={`bi ${isPinned ? 'bi-pin-fill text-base' : 'bi-pin text-base'}`} />
            </button>
            <button
              type="button"
              onClick={onCloseMobile}
              className="p-1.5 text-slate-400 hover:text-white rounded-md hover:bg-slate-700/50 transition-colors md:hidden"
            >
              <i className="bi bi-x-lg text-base" />
            </button>
          </div>
        </div>

        {/* Scrollable Navigation */}
        <div className="flex-1 overflow-y-auto py-3 px-3 space-y-4">
          {/* PRINCIPAL */}
          <div className="space-y-0.5">
            <div className="px-3 pb-1 pt-1">
              <span className="block text-[10px] font-bold uppercase tracking-widest text-slate-500 truncate">
                Principal
              </span>
            </div>
            <SidebarItem
              icon="bi-speedometer2"
              label="Início"
              active={activeRoute === 'inicio'}
              onClick={() => onNavigate('inicio')}
            />
            <SidebarItem
              icon="bi-bell"
              label="Alertas"
              active={activeRoute === 'alertas'}
              badge="0"
              badgeColor="red"
              onClick={() => onNavigate('alertas')}
            />
          </div>

          {/* SERVIÇOS */}
          <div className="space-y-0.5 pt-3 border-t border-slate-700/50">
            <div className="px-3 pb-1">
              <span className="block text-[10px] font-bold uppercase tracking-widest text-slate-500 truncate">
                Serviços
              </span>
            </div>

            {/* Hotspot submenu */}
            <SidebarSubmenu
              icon="bi-wifi"
              label="Hotspot"
              defaultOpen={true}
              activeId={activeRoute}
              onSelectItem={(id) => onNavigate(id as ActiveRoute)}
              items={[
                { id: 'hotspot-dashboard', label: 'Dashboard', icon: 'bi-speedometer2' },
                { id: 'hotspot-planos', label: 'Planos', icon: 'bi-clock-history' },
                { id: 'hotspot-clientes', label: 'Clientes Fixos', icon: 'bi-person-check' },
                { id: 'hotspot-trial', label: 'Tempo Trial', icon: 'bi-stopwatch' },
                { id: 'hotspot-revendas', label: 'Revendas', icon: 'bi-person-lines-fill' },
                { id: 'hotspot-lotes', label: 'Lotes', icon: 'bi-upc' },
                { id: 'hotspot-lotespix', label: 'Lotes PIX', icon: 'bi-upc-scan' },
                { id: 'vouchers', label: 'Vouchers', icon: 'bi-ticket-detailed' },
                { id: 'financeiro', label: 'Financeiro', icon: 'bi-cash-coin' },
                { id: 'consumo', label: 'Consumo', icon: 'bi-database' },
              ]}
            />

            {/* PIX/CARTÃO submenu */}
            <SidebarSubmenu
              icon="bi-credit-card-2-front"
              label="PIX/CARTÃO"
              defaultOpen={false}
              activeId={activeRoute}
              onSelectItem={(id) => onNavigate(id as ActiveRoute)}
              items={[
                { id: 'financeiro-pix', label: 'Compras PIX/Cartão', icon: 'bi-bag-check' },
                { id: 'devolucao-pix', label: 'Devolução PIX', icon: 'bi-arrow-counterclockwise' },
                { id: 'pix-devolvidos', label: 'PIX Devolvidos', icon: 'bi-receipt-cutoff' },
                { id: 'contestacoes', label: 'Contestações', icon: 'bi-shield-exclamation' },
              ]}
            />
          </div>

          {/* REDE */}
          <div className="space-y-0.5 pt-3 border-t border-slate-700/50">
            <div className="px-3 pb-1">
              <span className="block text-[10px] font-bold uppercase tracking-widest text-slate-500 truncate">
                Rede
              </span>
            </div>
            <SidebarSubmenu
              icon="bi-broadcast-pin"
              label="Mikrotik"
              activeId={activeRoute}
              onSelectItem={(id) => onNavigate(id as ActiveRoute)}
              items={[{ id: 'mikrotik', label: 'Equipamentos', icon: 'bi-router' }]}
            />
            <SidebarSubmenu
              icon="bi-broadcast-pin"
              label="Grandstream"
              activeId={activeRoute}
              onSelectItem={(id) => onNavigate(id as ActiveRoute)}
              items={[{ id: 'grandstream', label: 'Equipamentos', icon: 'bi-router', badge: 'Beta' }]}
            />
            <SidebarSubmenu
              icon="bi-broadcast-pin"
              label="Omada"
              activeId={activeRoute}
              onSelectItem={(id) => onNavigate(id as ActiveRoute)}
              items={[{ id: 'omada', label: 'Equipamentos', icon: 'bi-router', badge: 'Beta' }]}
            />
          </div>

          {/* AJUDA E PRIVACIDADE */}
          <div className="space-y-0.5 pt-3 border-t border-slate-700/50">
            <div className="px-3 pb-1">
              <span className="block text-[10px] font-bold uppercase tracking-widest text-slate-500 truncate">
                Ajuda e Privacidade
              </span>
            </div>
            <SidebarItem
              icon="bi-play-btn-fill"
              label="Tutoriais"
              active={activeRoute === 'tutoriais'}
              onClick={() => onNavigate('tutoriais')}
            />
            <SidebarItem
              icon="bi-shield-x"
              label="Exclusão (LGPD)"
              active={activeRoute === 'lgpd'}
              onClick={() => onNavigate('lgpd')}
            />
          </div>

          {/* CONTA */}
          <div className="space-y-0.5 pt-3 border-t border-slate-700/50">
            <div className="px-3 pb-1">
              <span className="block text-[10px] font-bold uppercase tracking-widest text-slate-500 truncate">
                Conta & Acesso
              </span>
            </div>
            <SidebarItem
              icon="bi-people-fill"
              label="Gestão de Usuários"
              active={activeRoute === 'usuarios'}
              onClick={() => onNavigate('usuarios')}
            />
            <SidebarSubmenu
              icon="bi-credit-card-2-front"
              label="ASSINATURA"
              activeId={activeRoute}
              onSelectItem={(id) => onNavigate(id as ActiveRoute)}
              items={[
                { id: 'assinatura', label: 'Planos', icon: 'bi-tags' },
                { id: 'assinatura-faturas', label: 'Faturas', icon: 'bi-receipt' },
              ]}
            />
          </div>

          {/* SISTEMA */}
          <div className="space-y-0.5 pt-3 border-t border-slate-700/50">
            <div className="px-3 pb-1">
              <span className="block text-[10px] font-bold uppercase tracking-widest text-slate-500 truncate">
                Sistema
              </span>
            </div>
            <SidebarItem
              icon="bi-gear"
              label="Integrações"
              active={activeRoute === 'integracoes'}
              onClick={() => onNavigate('integracoes')}
            />
            <SidebarItem
              icon="bi-clock-history"
              label="Relógio do Sistema"
              active={activeRoute === 'relogio'}
              onClick={() => onNavigate('relogio')}
            />
          </div>
        </div>

        {/* User profile card at bottom */}
        <div className="p-3 border-t border-slate-700/50 bg-slate-900/60">
          <button
            type="button"
            onClick={onOpenProfile || (() => onNavigate('usuarios'))}
            className="w-full text-left flex items-center gap-3 p-2 rounded-xl bg-slate-800/40 hover:bg-slate-800/80 border border-slate-700/40 hover:border-indigo-500/30 transition-all cursor-pointer group"
          >
            <div className="w-8 h-8 rounded-lg bg-indigo-500/20 text-indigo-400 font-bold flex items-center justify-center text-xs border border-indigo-500/30">
              {(currentUser?.name || 'A').charAt(0).toUpperCase()}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-semibold text-slate-200 group-hover:text-indigo-300 truncate transition-colors">
                {currentUser?.name || 'Administrador WFV'}
              </p>
              <p className="text-[10px] text-slate-400 truncate">
                {currentUser?.email || 'admin@wfvadmin.com'}
              </p>
            </div>
            <span className="w-2 h-2 rounded-full bg-emerald-400 flex-shrink-0" title="Online" />
          </button>
        </div>
      </aside>
    </>
  )
}
