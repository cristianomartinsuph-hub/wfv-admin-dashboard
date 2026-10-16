import { useState, useEffect, useCallback } from 'react'
import { Sidebar } from './components/Sidebar/Sidebar'
import { TopHeader } from './components/Header/TopHeader'
import { OverviewHeader } from './components/Overview/OverviewHeader'
import { MetricCards } from './components/Overview/MetricCards'
import { RealtimeCharts } from './components/RealtimeMonitoring/RealtimeCharts'
import { ConcentradoresTable } from './components/RealtimeMonitoring/ConcentradoresTable'
import { BottomNavMobile } from './components/Mobile/BottomNavMobile'
import { SectionViews } from './components/Views/SectionViews'
import { LoginPage } from './components/Auth/LoginPage'
import { UserProfileModal } from './components/Users/UserProfileModal'
import { ChangePasswordModal } from './components/Users/ChangePasswordModal'
import { supabase } from './lib/supabase'
import {
  initialMetrics,
  mockConcentradores,
  generateChartSeries,
} from './data/mockData'
import type { ActiveRoute, TimeInterval, DashboardMetrics, Concentrador } from './types/dashboard'

interface UserSession {
  email: string
  name: string
  empresa?: string
  telefone?: string
  logo?: string
}

export function App() {
  // 1. Theme State (Default to Dark Mode as explicitly requested by user)
  const [isDarkMode, setIsDarkMode] = useState(true)

  // 2. Authentication State (Supabase Auth / Local Session)
  const [currentUser, setCurrentUser] = useState<UserSession | null>(() => {
    try {
      const saved = localStorage.getItem('wfv_admin_session')
      return saved ? JSON.parse(saved) : null
    } catch {
      return null
    }
  })

  // Modals for User Profile & Password Change
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false)
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false)

  // 3. Mode: REAL PRODUCTION by default (test data removed) vs DEMO
  const [isDemoMode, setIsDemoMode] = useState(false)

  // 4. Sidebar & Navigation State
  const [activeRoute, setActiveRoute] = useState<ActiveRoute>('inicio')
  const [isPinned, setIsPinned] = useState(true)
  const [isMobileOpen, setIsMobileOpen] = useState(false)

  // 5. Real Concentradores from Local Storage / Database
  const [realConcentradores, setRealConcentradores] = useState<Concentrador[]>(() => {
    try {
      const saved = localStorage.getItem('wfv_real_concentradores')
      return saved ? JSON.parse(saved) : []
    } catch {
      return []
    }
  })

  // 6. Metrics & Intervals
  const [hotspotInterval, setHotspotInterval] = useState<TimeInterval>('24h')
  const [equipInterval, setEquipInterval] = useState<TimeInterval>('24h')
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [currentTimeStr, setCurrentTimeStr] = useState(() =>
    new Date().toLocaleTimeString('pt-BR')
  )

  // Demo simulation state (only active when user explicitly toggles Demo mode)
  const [demoMetrics, setDemoMetrics] = useState<DashboardMetrics>(initialMetrics)
  const [demoHotspotData, setDemoHotspotData] = useState(generateChartSeries('24h').hotspot)
  const [demoEquipData, setDemoEquipData] = useState(generateChartSeries('24h').equip)

  // Synchronize Dark Mode class on document
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [isDarkMode])

  // Check Supabase session on mount
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        const user: UserSession = {
          email: session.user.email || 'admin@wfvadmin.com',
          name:
            session.user.user_metadata?.name ||
            (session.user.email?.includes('cristiano') ? 'Cristiano Martins' : 'Administrador CMS_Hotspot'),
          empresa: session.user.user_metadata?.empresa || 'CMS_Hotspot Telecom',
          telefone: session.user.user_metadata?.telefone || '+55 (92) 98450-5812',
        }
        setCurrentUser(user)
        localStorage.setItem('wfv_admin_session', JSON.stringify(user))
      }
    })

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        const user: UserSession = {
          email: session.user.email || 'admin@wfvadmin.com',
          name:
            session.user.user_metadata?.name ||
            (session.user.email?.includes('cristiano') ? 'Cristiano Martins' : 'Administrador CMS_Hotspot'),
          empresa: session.user.user_metadata?.empresa || 'CMS_Hotspot Telecom',
          telefone: session.user.user_metadata?.telefone || '+55 (92) 98450-5812',
        }
        setCurrentUser(user)
        localStorage.setItem('wfv_admin_session', JSON.stringify(user))
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  // Keep live clock updated
  useEffect(() => {
    const clockTimer = setInterval(() => {
      setCurrentTimeStr(new Date().toLocaleTimeString('pt-BR'))
    }, 1000)
    return () => clearInterval(clockTimer)
  }, [])

  // Update demo charts if interval changes
  useEffect(() => {
    if (isDemoMode) {
      setDemoHotspotData(generateChartSeries(hotspotInterval).hotspot)
    }
  }, [hotspotInterval, isDemoMode])

  useEffect(() => {
    if (isDemoMode) {
      setDemoEquipData(generateChartSeries(equipInterval).equip)
    }
  }, [equipInterval, isDemoMode])

  // Manual Refresh Handler
  const handleManualRefresh = useCallback(() => {
    setIsRefreshing(true)
    const timeStr = new Date().toLocaleTimeString('pt-BR')
    setCurrentTimeStr(timeStr)

    setTimeout(() => {
      if (isDemoMode) {
        setDemoMetrics((prev) => ({
          ...prev,
          hotspot_online: Math.max(90, prev.hotspot_online + Math.floor(Math.random() * 7 - 3)),
          pppoe_online: Math.max(60, prev.pppoe_online + Math.floor(Math.random() * 5 - 2)),
          last_update: timeStr,
        }))
      }
      setIsRefreshing(false)
    }, 400)
  }, [isDemoMode])

  // Add Real Concentrador
  const handleAddRealConcentrador = (newDevice: Concentrador) => {
    const updated = [newDevice, ...realConcentradores]
    setRealConcentradores(updated)
    try {
      localStorage.setItem('wfv_real_concentradores', JSON.stringify(updated))
    } catch {
      // LocalStorage quota fallback
    }
  }

  // Delete Real Concentrador
  const handleDeleteRealConcentrador = (id: string) => {
    const updated = realConcentradores.filter((c) => c.id !== id)
    setRealConcentradores(updated)
    try {
      localStorage.setItem('wfv_real_concentradores', JSON.stringify(updated))
    } catch {
      // LocalStorage quota fallback
    }
  }

  // Handle Logout
  const handleLogout = async () => {
    try {
      await supabase.auth.signOut()
    } catch {
      // Offline fallback
    }
    localStorage.removeItem('wfv_admin_session')
    setCurrentUser(null)
  }

  // Handle Profile Update
  const handleUpdateProfile = (updated: {
    name: string
    empresa: string
    telefone: string
    logo?: string
  }) => {
    if (!currentUser) return
    const newUser: UserSession = {
      ...currentUser,
      name: updated.name,
      empresa: updated.empresa,
      telefone: updated.telefone,
      logo: updated.logo || currentUser.logo,
    }
    setCurrentUser(newUser)
    localStorage.setItem('wfv_admin_session', JSON.stringify(newUser))
  }

  const scrollToConcentradoresTable = () => {
    const el = document.getElementById('ov-tabela-concentradores')
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' })
    }
  }

  // Calculate Real Metrics from actual connected equipment
  const realOnlineCount = realConcentradores.filter((c) => c.online === 1).length
  const realMetrics: DashboardMetrics = {
    hotspot_online: 0,
    pppoe_online: 0,
    concentradores_online: realOnlineCount,
    total_concentradores: realConcentradores.length,
    last_update: currentTimeStr,
  }

  const displayedMetrics = isDemoMode ? demoMetrics : realMetrics
  const displayedHotspotChart = isDemoMode ? demoHotspotData : []
  const displayedEquipChart = isDemoMode ? demoEquipData : []
  const displayedConcentradores = isDemoMode ? mockConcentradores : realConcentradores

  // If user is not authenticated, render Login Page
  if (!currentUser) {
    return (
      <LoginPage
        onLoginSuccess={(user) => setCurrentUser(user)}
        isDarkMode={isDarkMode}
        onToggleDarkMode={() => setIsDarkMode(!isDarkMode)}
      />
    )
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 transition-colors duration-200">
      {/* 1. Left Sidebar (Fixed, Navy Blue / Slate) */}
      <Sidebar
        activeRoute={activeRoute}
        onNavigate={(route) => {
          setActiveRoute(route)
          setIsMobileOpen(false)
        }}
        isMobileOpen={isMobileOpen}
        onCloseMobile={() => setIsMobileOpen(false)}
        isPinned={isPinned}
        onTogglePin={() => setIsPinned(!isPinned)}
        currentUser={currentUser}
        onOpenProfile={() => setIsProfileModalOpen(true)}
      />

      {/* 2. Top Header (Fixed at top, responsive width) */}
      <TopHeader
        onOpenMobileSidebar={() => setIsMobileOpen(true)}
        isDarkMode={isDarkMode}
        onToggleDarkMode={() => setIsDarkMode(!isDarkMode)}
        isLiveSimulating={isDemoMode}
        onToggleLiveSimulation={() => setIsDemoMode(!isDemoMode)}
        notificationCount={0}
        isZeroMode={!isDemoMode}
        onToggleZeroMode={() => setIsDemoMode(!isDemoMode)}
        currentUser={currentUser}
        onLogout={handleLogout}
        onOpenProfile={() => setIsProfileModalOpen(true)}
        onOpenChangePassword={() => setIsPasswordModalOpen(true)}
      />

      {/* 3. Main Dashboard Workspace Content */}
      <main className="md:pl-64 pt-20 pb-20 md:pb-12 px-4 sm:px-6 md:px-8 transition-all duration-300">
        <div className="max-w-7xl mx-auto space-y-6">
          {activeRoute === 'inicio' ? (
            <>
              {/* Header da Página: Visão Geral */}
              <OverviewHeader
                lastUpdateTime={displayedMetrics.last_update}
                onManualRefresh={handleManualRefresh}
                isRefreshing={isRefreshing}
              />

              {/* Bloco Superior: Os 3 cards principais de métricas */}
              <MetricCards
                metrics={displayedMetrics}
                onSelectCard={(key) => {
                  if (key === 'hotspot') setActiveRoute('hotspot-dashboard')
                  else if (key === 'pppoe') setActiveRoute('consumo')
                  else if (key === 'concentradores') scrollToConcentradoresTable()
                }}
              />

              {/* Os dois blocos centrais inferiores de monitoramento em tempo real */}
              <RealtimeCharts
                hotspotData={displayedHotspotChart}
                equipData={displayedEquipChart}
                hotspotInterval={hotspotInterval}
                equipInterval={equipInterval}
                onChangeHotspotInterval={setHotspotInterval}
                onChangeEquipInterval={setEquipInterval}
                onScrollToTable={scrollToConcentradoresTable}
              />

              {/* Tabela de Concentradores e Equipamentos em tempo real */}
              <ConcentradoresTable
                concentradores={displayedConcentradores}
                onAddConcentrador={!isDemoMode ? handleAddRealConcentrador : undefined}
                onDeleteConcentrador={!isDemoMode ? handleDeleteRealConcentrador : undefined}
              />
            </>
          ) : (
            <SectionViews
              activeRoute={activeRoute}
              onBackToOverview={() => setActiveRoute('inicio')}
            />
          )}
        </div>
      </main>

      {/* 4. Bottom Navigation Bar for Mobile Screens */}
      <BottomNavMobile
        activeRoute={activeRoute}
        onNavigate={setActiveRoute}
        onToggleSidebar={() => setIsMobileOpen(!isMobileOpen)}
      />

      {/* 5. User Profile Modal */}
      <UserProfileModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        user={currentUser}
        onUpdateUser={handleUpdateProfile}
      />

      {/* 6. Change Password Modal */}
      <ChangePasswordModal
        isOpen={isPasswordModalOpen}
        onClose={() => setIsPasswordModalOpen(false)}
        userEmail={currentUser.email}
      />
    </div>
  )
}

export default App
