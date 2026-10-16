import React, { useState } from 'react'

export interface SubmenuItem {
  id: string
  label: string
  icon: string
  badge?: string
  badgeColor?: 'red' | 'amber' | 'indigo' | 'emerald'
}

interface SidebarSubmenuProps {
  icon: string
  label: string
  items: SubmenuItem[]
  activeId?: string
  defaultOpen?: boolean
  onSelectItem: (id: string) => void
}

export const SidebarSubmenu: React.FC<SidebarSubmenuProps> = ({
  icon,
  label,
  items,
  activeId,
  defaultOpen = false,
  onSelectItem,
}) => {
  const [isOpen, setIsOpen] = useState(defaultOpen)

  const isAnyChildActive = items.some((item) => item.id === activeId)

  return (
    <div className="w-full">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center justify-between w-full gap-3 px-3 py-2.5 rounded-lg transition-colors text-left group ${
          isAnyChildActive
            ? 'text-indigo-400 font-medium'
            : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
        }`}
      >
        <span className="flex items-center gap-3 truncate">
          <i className={`bi ${icon} text-lg flex-shrink-0 transition-transform group-hover:scale-110 ${isAnyChildActive ? 'text-indigo-400' : ''}`} />
          <span className="text-sm font-medium sidebar-text truncate">{label}</span>
        </span>
        <i
          className={`bi bi-chevron-down text-xs sidebar-text transition-transform duration-200 ${
            isOpen ? 'rotate-180 text-indigo-400' : 'text-slate-500'
          }`}
        />
      </button>

      {isOpen && (
        <div className="pl-8 pr-2 mt-1 space-y-0.5 border-l border-slate-800 ml-4">
          {items.map((item) => {
            const isActive = item.id === activeId
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => onSelectItem(item.id)}
                className={`flex items-center justify-between w-full gap-2 px-2.5 py-1.5 rounded-md text-xs transition-colors text-left ${
                  isActive
                    ? 'bg-indigo-500/15 text-indigo-300 font-semibold'
                    : 'text-slate-400 hover:bg-slate-800/60 hover:text-slate-200'
                }`}
              >
                <span className="flex items-center gap-2 truncate">
                  <i className={`bi ${item.icon} text-sm flex-shrink-0 ${isActive ? 'text-indigo-400' : 'text-slate-500'}`} />
                  <span className="truncate">{item.label}</span>
                </span>
                {item.badge && (
                  <span className="text-[9px] font-bold bg-amber-400/20 text-amber-400 border border-amber-400/30 px-1 rounded-full">
                    {item.badge}
                  </span>
                )}
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}
