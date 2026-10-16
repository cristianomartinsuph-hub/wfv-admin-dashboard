import React from 'react'

interface SidebarItemProps {
  icon: string
  label: string
  active?: boolean
  badge?: string | number
  badgeColor?: 'red' | 'amber' | 'indigo' | 'emerald'
  onClick?: () => void
  href?: string
}

export const SidebarItem: React.FC<SidebarItemProps> = ({
  icon,
  label,
  active = false,
  badge,
  badgeColor = 'red',
  onClick,
}) => {
  const badgeClasses = {
    red: 'bg-red-500 text-white',
    amber: 'bg-amber-400/20 text-amber-400 border border-amber-400/30',
    indigo: 'bg-indigo-500/20 text-indigo-400 border border-indigo-500/30',
    emerald: 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30',
  }[badgeColor]

  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex items-center w-full gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 text-left group ${
        active
          ? 'bg-indigo-500/15 text-indigo-400 font-semibold shadow-sm shadow-indigo-500/10 border-l-2 border-indigo-500'
          : 'text-slate-400 hover:bg-slate-800/80 hover:text-slate-100 font-medium'
      }`}
    >
      <i className={`bi ${icon} text-lg flex-shrink-0 transition-transform group-hover:scale-110 ${active ? 'text-indigo-400' : 'text-slate-400 group-hover:text-slate-200'}`} />
      <span className="text-sm truncate sidebar-text">{label}</span>
      {badge !== undefined && (
        <span
          className={`ml-auto text-[10px] font-bold px-1.5 py-0.5 rounded-full leading-none min-w-[18px] text-center ${badgeClasses}`}
        >
          {badge}
        </span>
      )}
    </button>
  )
}
