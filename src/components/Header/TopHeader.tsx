import React, { useState } from 'react'

interface TopHeaderProps {
  onOpenMobileSidebar: () => void
  isDarkMode: boolean
  onToggleDarkMode: () => void
  isLiveSimulating: boolean
  onToggleLiveSimulation: () => void
  notificationCount: number
  isZeroMode?: boolean
  onToggleZeroMode?: () => void
  currentUser?: { email: string; name: string } | null
  onLogout?: () => void
  onOpenProfile?: () => void
  onOpenChangePassword?: () => void
}

export const TopHeader: React.FC<TopHeaderProps> = ({
  onOpenMobileSidebar,
  isDarkMode,
  onToggleDarkMode,
  isLiveSimulating,
  onToggleLiveSimulation,
  notificationCount,
  isZeroMode = false,
  onToggleZeroMode,
  currentUser,
  onLogout,
  onOpenProfile,
  onOpenChangePassword,
}) => {
  const [showNotifications, setShowNotifications] = useState(false)
  const [showProfileMenu, setShowProfileMenu] = useState(false)

  return (
    <header className="fixed top-0 right-0 left-0 md:left-64 h-16 bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl border-b border-slate-200 dark:border-slate-800 flex items-center justify-between px-4 md:px-6 z-30 transition-all duration-300">
      {/* Left side */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onOpenMobileSidebar}
          className="p-2 text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 rounded-lg transition-colors md:hidden"
          aria-label="Abrir menu"
        >
          <i className="bi bi-list text-2xl" />
        </button>

        <img
          src="/wifivoucher.png"
          alt="WFV Logo"
          className="w-8 h-8 rounded-lg object-contain bg-slate-800 md:hidden"
          onError={(e) => {
            e.currentTarget.style.display = 'none'
          }}
        />

        <div className="hidden sm:flex items-center gap-2">
          <span className="text-slate-800 dark:text-white font-bold text-sm tracking-tight">WFV Admin</span>
          <span className="text-slate-400 dark:text-slate-600">/</span>
          <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">Painel de Controle</span>
        </div>
      </div>

      {/* Right side actions */}
      <div className="flex items-center gap-2">
        {/* Supabase Status Indicator */}
        <div
          className="hidden xl:flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/25 shadow-sm"
          title="Supabase: wifi-voucher-system (sa-east-1)"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <span>Supabase Conectado</span>
        </div>

        {/* Toggle between Active Data and Video Empty State */}
        {onToggleZeroMode && (
          <button
            type="button"
            onClick={onToggleZeroMode}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 border ${
              isZeroMode
                ? 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                : 'bg-indigo-500/10 text-indigo-400 border-indigo-500/30'
            }`}
            title="Alternar entre modo com dados demonstrativos ou tela vazia (como no vídeo gravado)"
          >
            <i className={`bi ${isZeroMode ? 'bi-camera-video' : 'bi-database-check'}`} />
            <span className="hidden lg:inline">
              {isZeroMode ? 'Modo: Vídeo (Vazio)' : 'Modo: Com Dados'}
            </span>
          </button>
        )}

        {/* Real-time simulation status indicator */}
        <button
          type="button"
          onClick={onToggleLiveSimulation}
          className={`flex items-center gap-2 px-2.5 py-1.5 rounded-full text-xs font-semibold transition-all duration-200 border ${
            isLiveSimulating
              ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30 shadow-sm shadow-emerald-500/10'
              : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 border-slate-200 dark:border-slate-700'
          }`}
          title="Clique para alternar simulação em tempo real"
        >
          <span
            className={`w-2 h-2 rounded-full ${
              isLiveSimulating ? 'bg-emerald-400 animate-ping' : 'bg-slate-400'
            }`}
          />
          <span className="hidden sm:inline">
            {isLiveSimulating ? 'Tempo Real: Ativo' : 'Tempo Real: Pausado'}
          </span>
        </button>

        {/* Anotações */}
        <button
          type="button"
          className="p-2 text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 transition-colors rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
          title="Anotações Rápidas"
        >
          <i className="bi bi-journal-text text-lg" />
        </button>

        {/* Theme Toggle */}
        <button
          type="button"
          onClick={onToggleDarkMode}
          className="p-2 text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 transition-colors rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 focus:outline-none"
          title={isDarkMode ? 'Mudar para tema claro' : 'Mudar para tema escuro'}
        >
          {isDarkMode ? (
            <i className="bi bi-sun-fill text-lg text-amber-400" />
          ) : (
            <i className="bi bi-moon-stars-fill text-lg text-indigo-500" />
          )}
        </button>

        {/* Notifications */}
        <div className="relative">
          <button
            type="button"
            onClick={() => {
              setShowNotifications(!showNotifications)
              setShowProfileMenu(false)
            }}
            className="p-2 text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 transition-colors rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 relative focus:outline-none"
            aria-label="Notificações"
          >
            <i className="bi bi-bell-fill text-lg" />
            {notificationCount > 0 && (
              <span className="absolute top-1 right-1 min-w-[18px] h-[18px] px-1 bg-rose-500 text-[10px] font-bold text-white rounded-full flex items-center justify-center border-2 border-white dark:border-slate-900 leading-none">
                {notificationCount}
              </span>
            )}
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-2xl z-50 overflow-hidden animate-in fade-in duration-200">
              <div className="px-4 py-3 border-b border-slate-200 dark:border-slate-700 font-semibold text-sm text-slate-800 dark:text-slate-200 flex items-center justify-between">
                <span>Notificações</span>
                <span className="text-[10px] text-indigo-400 font-normal cursor-pointer hover:underline">
                  Marcar lidas
                </span>
              </div>
              <div className="divide-y divide-slate-100 dark:divide-slate-700/50 max-h-64 overflow-y-auto">
                <div className="p-3 hover:bg-slate-50 dark:hover:bg-slate-750 transition-colors">
                  <div className="flex items-start gap-2.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 mt-1.5 flex-shrink-0" />
                    <div>
                      <p className="text-xs font-semibold text-slate-800 dark:text-white">
                        Venda PIX Aprovada
                      </p>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                        Voucher 24h emitido para hotspot Central-Mikrotik-01 (R$ 15,00).
                      </p>
                      <span className="text-[9px] text-slate-400 mt-1 block">Há 2 minutos</span>
                    </div>
                  </div>
                </div>
                <div className="p-3 hover:bg-slate-50 dark:hover:bg-slate-750 transition-colors">
                  <div className="flex items-start gap-2.5">
                    <span className="w-2 h-2 rounded-full bg-indigo-400 mt-1.5 flex-shrink-0" />
                    <div>
                      <p className="text-xs font-semibold text-slate-800 dark:text-white">
                        Novo Concentrador Conectado
                      </p>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                        MikroTik RB750Gr3 sincronizou com o gateway VPN.
                      </p>
                      <span className="text-[9px] text-slate-400 mt-1 block">Há 15 minutos</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Profile Menu */}
        <div className="relative">
          <button
            type="button"
            onClick={() => {
              setShowProfileMenu(!showProfileMenu)
              setShowNotifications(false)
            }}
            className="flex items-center gap-2 focus:outline-none p-1 rounded-full hover:ring-2 hover:ring-indigo-500/30 transition-all cursor-pointer"
          >
            <img
              src="/wifivoucher.png"
              alt="Perfil"
              className="rounded-full border border-slate-200 dark:border-slate-700 hover:border-indigo-400 w-8 h-8 object-cover bg-indigo-500/20"
              onError={(e) => {
                e.currentTarget.src = 'https://ui-avatars.com/api/?name=Admin&background=6366f1&color=fff'
              }}
            />
          </button>

          {showProfileMenu && (
            <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-2xl z-50 overflow-hidden animate-in fade-in duration-200">
              <div className="px-4 py-2.5 bg-slate-50 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-700">
                <p className="text-xs font-semibold text-slate-800 dark:text-white truncate">
                  {currentUser?.name || 'Administrador WFV'}
                </p>
                <p className="text-[10px] text-slate-500 dark:text-slate-400 truncate">
                  {currentUser?.email || 'admin@wfvadmin.com'}
                </p>
              </div>
              <div className="py-1">
                <button
                  type="button"
                  onClick={() => {
                    setShowProfileMenu(false)
                    if (onOpenProfile) onOpenProfile()
                  }}
                  className="w-full text-left flex items-center gap-2.5 px-4 py-2 text-xs text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer"
                >
                  <i className="bi bi-person-circle text-sm text-slate-400" />
                  Perfil da Conta
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowProfileMenu(false)
                    if (onOpenChangePassword) onOpenChangePassword()
                  }}
                  className="w-full text-left flex items-center gap-2.5 px-4 py-2 text-xs text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer"
                >
                  <i className="bi bi-key text-sm text-slate-400" />
                  Alterar Senha
                </button>
                <div className="border-t border-slate-200 dark:border-slate-700/50 my-1" />
                <button
                  type="button"
                  onClick={() => {
                    setShowProfileMenu(false)
                    if (onLogout) onLogout()
                  }}
                  className="w-full text-left flex items-center gap-2.5 px-4 py-2 text-xs text-rose-500 dark:text-rose-400 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors cursor-pointer"
                >
                  <i className="bi bi-box-arrow-right text-sm" />
                  Sair do Painel
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
