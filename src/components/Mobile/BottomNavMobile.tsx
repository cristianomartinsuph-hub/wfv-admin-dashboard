import React from 'react'
import type { ActiveRoute } from '../../types/dashboard'

interface BottomNavMobileProps {
  activeRoute: ActiveRoute
  onNavigate: (route: ActiveRoute) => void
  onToggleSidebar: () => void
}

export const BottomNavMobile: React.FC<BottomNavMobileProps> = ({
  activeRoute,
  onNavigate,
  onToggleSidebar,
}) => {
  return (
    <nav className="fixed bottom-0 left-0 right-0 h-16 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border-t border-slate-200 dark:border-slate-800 flex md:hidden z-40 px-2 shadow-lg">
      <div className="flex items-center justify-around w-full">
        {/* Início */}
        <button
          type="button"
          onClick={() => onNavigate('inicio')}
          className={`flex flex-col items-center gap-0.5 px-3 py-1.5 transition-colors ${
            activeRoute === 'inicio'
              ? 'text-indigo-500 font-semibold'
              : 'text-slate-500 dark:text-slate-400 hover:text-indigo-400'
          }`}
        >
          <i className="bi bi-house-door-fill text-lg" />
          <span className="text-[10px]">Início</span>
        </button>

        {/* Hotspots */}
        <button
          type="button"
          onClick={() => onNavigate('hotspot')}
          className={`flex flex-col items-center gap-0.5 px-3 py-1.5 transition-colors ${
            activeRoute.startsWith('hotspot')
              ? 'text-indigo-500 font-semibold'
              : 'text-slate-500 dark:text-slate-400 hover:text-indigo-400'
          }`}
        >
          <i className="bi bi-wifi text-lg" />
          <span className="text-[10px]">Hotspots</span>
        </button>

        {/* Vouchers */}
        <button
          type="button"
          onClick={() => onNavigate('vouchers')}
          className={`flex flex-col items-center gap-0.5 px-3 py-1.5 transition-colors ${
            activeRoute === 'vouchers'
              ? 'text-indigo-500 font-semibold'
              : 'text-slate-500 dark:text-slate-400 hover:text-indigo-400'
          }`}
        >
          <i className="bi bi-ticket-perforated text-lg" />
          <span className="text-[10px]">Vouchers</span>
        </button>

        {/* Financeiro */}
        <button
          type="button"
          onClick={() => onNavigate('financeiro')}
          className={`flex flex-col items-center gap-0.5 px-3 py-1.5 transition-colors ${
            activeRoute.startsWith('financeiro')
              ? 'text-indigo-500 font-semibold'
              : 'text-slate-500 dark:text-slate-400 hover:text-indigo-400'
          }`}
        >
          <i className="bi bi-cash-coin text-lg" />
          <span className="text-[10px]">PIX/Fin</span>
        </button>

        {/* Menu drawer */}
        <button
          type="button"
          onClick={onToggleSidebar}
          className="flex flex-col items-center gap-0.5 px-3 py-1.5 text-slate-500 dark:text-slate-400 hover:text-indigo-400 transition-colors"
        >
          <i className="bi bi-list text-lg" />
          <span className="text-[10px]">Menu</span>
        </button>
      </div>
    </nav>
  )
}
