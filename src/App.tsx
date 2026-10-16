import { useState, useEffect, useCallback } from 'react'
import { Sidebar } from './components/Sidebar/Sidebar'
import { TopHeader } from './components/Header/TopHeader'
import { OverviewHeader } from './components/Overview/OverviewHeader'
import { MetricCards } from './components/Overview/MetricCards'
import { RealtimeCharts } from './components/RealtimeMonitoring/RealtimeCharts'
import { ConcentradoresTable } from './components/RealtimeMonitoring/ConcentradoresTable'
import { BottomNavMobile } from './components/Mobile/BottomNavMobile'
import { SectionViews } from './components/Views/SectionViews'
import {
  initialMetrics,
  mockConcentradores,
  generateChartSeries,
} from './data/mockData'
import type { ActiveRoute, TimeInterval, DashboardMetrics } from './types/dashboard'

export function App() {
  // 1. Theme State (Default to Dark Mode as explicitly requested by user)
  const [isDarkMode, setIsDarkMode] = useState(true)

  // 2. Sidebar & Navigation State
  const [activeRoute, setActiveRoute] = useState<ActiveRoute>('inicio')
  const [isPinned, setIsPinned] = useState(true)
  const [isMobileOpen, setIsMobileOpen] = useState(false)

  // 3. Metrics & Live Monitoring State
  const [metrics, setMetrics] = useState<DashboardMetrics>(initialMetrics)
  const [hotspotInterval, setHotspotInterval] = useState<TimeInterval>('24h')
  const [equipInterval, setEquipInterval] = useState<TimeInterval>('24h')

  const [hotspotChartData, setHotspotChartData] = useState(
    generateChartSeries('24h').hotspot
  )
  const [equipChartData, setEquipChartData] = useState(
    generateChartSeries('24h').equip
  )

  const [isLiveSimulating, setIsLiveSimulating] = useState(true)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [isZeroMode, setIsZeroMode] = useState(false)

  // Synchronize Dark Mode class on document
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [isDarkMode])

  // Recalculate chart data on interval change
  useEffect(() => {
    setHotspotChartData(generateChartSeries(hotspotInterval).hotspot)
  }, [hotspotInterval])

  useEffect(() => {
    setEquipChartData(generateChartSeries(equipInterval).equip)
  }, [equipInterval])

  // Manual Refresh Handler
  const handleManualRefresh = useCallback(() => {
    setIsRefreshing(true)
    const now = new Date()
    const timeStr = now.toLocaleTimeString('pt-BR')

    setTimeout(() => {
      setMetrics((prev) => ({
        ...prev,
        hotspot_online: Math.max(90, prev.hotspot_online + Math.floor(Math.random() * 7 - 3)),
        pppoe_online: Math.max(60, prev.pppoe_online + Math.floor(Math.random() * 5 - 2)),
        last_update: timeStr,
      }))
      setIsRefreshing(false)
    }, 400)
  }, [])

  // Live Real-Time simulation heartbeat
  useEffect(() => {
    if (!isLiveSimulating) return

    const timer = setInterval(() => {
      const now = new Date()
      const timeStr = now.toLocaleTimeString('pt-BR')

      setMetrics((prev) => {
        // Natural slight jitter in online sessions
        const deltaHotspot = Math.floor(Math.random() * 5) - 2
        const deltaPppoe = Math.floor(Math.random() * 3) - 1

        const nextHotspot = Math.max(50, prev.hotspot_online + deltaHotspot)
        const nextPppoe = Math.max(40, prev.pppoe_online + deltaPppoe)

        return {
          ...prev,
          hotspot_online: nextHotspot,
          pppoe_online: nextPppoe,
          last_update: timeStr,
        }
      })

      // Update the latest point on hotspot chart
      setHotspotChartData((prev) => {
        if (!prev || prev.length === 0) return prev
        const updated = [...prev]
        const last = updated[updated.length - 1]
        const hour = now.getHours().toString().padStart(2, '0')
        const min = now.getMinutes().toString().padStart(2, '0')
        const sec = now.getSeconds().toString().padStart(2, '0')

        updated[updated.length - 1] = {
          ...last,
          date_time: `${hour}:${min}:${sec}`,
          value: Math.max(30, last.value + (Math.floor(Math.random() * 5) - 2)),
        }
        return updated
      })
    }, 4000)

    return () => clearInterval(timer)
  }, [isLiveSimulating])

  const scrollToConcentradoresTable = () => {
    const el = document.getElementById('ov-tabela-concentradores')
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' })
    }
  }

  // Displayed metrics and datasets (allowing instant switch between populated live demo and exact video recording blank state)
  const displayedMetrics = isZeroMode
    ? {
        hotspot_online: 0,
        pppoe_online: 0,
        concentradores_online: 0,
        total_concentradores: 0,
        last_update: '06:48:44',
      }
    : metrics

  const displayedHotspotChart = isZeroMode ? [] : hotspotChartData
  const displayedEquipChart = isZeroMode ? [] : equipChartData
  const displayedConcentradores = isZeroMode ? [] : mockConcentradores

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
      />

      {/* 2. Top Header (Fixed at top, responsive width) */}
      <TopHeader
        onOpenMobileSidebar={() => setIsMobileOpen(true)}
        isDarkMode={isDarkMode}
        onToggleDarkMode={() => setIsDarkMode(!isDarkMode)}
        isLiveSimulating={isLiveSimulating}
        onToggleLiveSimulation={() => setIsLiveSimulating(!isLiveSimulating)}
        notificationCount={2}
        isZeroMode={isZeroMode}
        onToggleZeroMode={() => setIsZeroMode(!isZeroMode)}
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
              <ConcentradoresTable concentradores={displayedConcentradores} />
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
    </div>
  )
}

export default App
