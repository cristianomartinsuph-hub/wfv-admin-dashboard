import React, { useState, useEffect } from 'react'

interface UserProfileModalProps {
  isOpen: boolean
  onClose: () => void
  user: { email: string; name: string; empresa?: string; telefone?: string; logo?: string } | null
  onUpdateUser: (updated: { name: string; empresa: string; telefone: string; logo?: string }) => void
}

const COUNTRIES = [
  { name: 'Brasil', code: '+55', flag: 'br' },
  { name: 'Argentina', code: '+54', flag: 'ar' },
  { name: 'Chile', code: '+56', flag: 'cl' },
  { name: 'Colômbia', code: '+57', flag: 'co' },
  { name: 'Estados Unidos', code: '+1', flag: 'us' },
  { name: 'Portugal', code: '+351', flag: 'pt' },
  { name: 'Uruguai', code: '+598', flag: 'uy' },
]

export const UserProfileModal: React.FC<UserProfileModalProps> = ({
  isOpen,
  onClose,
  user,
  onUpdateUser,
}) => {
  const [isEditing, setIsEditing] = useState(false)
  const [nome, setNome] = useState(user?.name || 'Administrador CMS_Hotspot')
  const [empresa, setEmpresa] = useState(user?.empresa || 'CMS_Hotspot Telecom')
  const [telefone, setTelefone] = useState(user?.telefone || '(11) 98765-4321')
  const [selectedCountry, setSelectedCountry] = useState(COUNTRIES[0])
  const [showCountryDropdown, setShowCountryDropdown] = useState(false)
  const [logoPreview, setLogoPreview] = useState<string | null>(user?.logo || null)
  const [successMsg, setSuccessMsg] = useState<string | null>(null)
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    if (user) {
      setNome(user.name || 'Administrador CMS_Hotspot')
      setEmpresa(user.empresa || 'CMS_Hotspot Telecom')
      setTelefone(user.telefone || '(11) 98765-4321')
      if (user.logo) setLogoPreview(user.logo)
    }
  }, [user])

  if (!isOpen) return null

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = () => {
        setLogoPreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)

    setTimeout(() => {
      onUpdateUser({
        name: nome,
        empresa,
        telefone: `${selectedCountry.code} ${telefone}`,
        logo: logoPreview || undefined,
      })
      setIsSaving(false)
      setIsEditing(false)
      setSuccessMsg('Perfil atualizado com sucesso!')
      setTimeout(() => setSuccessMsg(null), 3000)
    }, 400)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400">
              <i className="bi bi-person-circle text-lg" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-800 dark:text-white">Perfil da Conta</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">Gerencie seus dados de cadastro e empresa</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-white rounded-lg transition-colors focus:outline-none"
          >
            <i className="bi bi-x-lg text-base" />
          </button>
        </div>

        {/* Success notification */}
        {successMsg && (
          <div className="mx-6 mt-4 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs flex items-center gap-2 animate-in fade-in">
            <i className="bi bi-check-circle-fill text-base flex-shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* Content Body */}
        <div className="p-6">
          <div className="flex flex-col sm:flex-row gap-6 items-center sm:items-start">
            {/* Avatar & Logo */}
            <div className="flex flex-col items-center gap-2.5 flex-shrink-0">
              <div className="relative w-20 h-20 rounded-full border-2 border-indigo-500/40 p-1 bg-slate-100 dark:bg-slate-800 flex items-center justify-center overflow-hidden shadow-inner">
                {logoPreview ? (
                  <img src={logoPreview} alt="Logo" className="w-full h-full object-cover rounded-full" />
                ) : (
                  <img
                    src="/wifivoucher.png"
                    alt="Logo"
                    className="w-full h-full object-contain"
                    onError={(e) => {
                      e.currentTarget.src = 'https://ui-avatars.com/api/?name=Admin&background=6366f1&color=fff'
                    }}
                  />
                )}
              </div>
              {isEditing && (
                <label className="cursor-pointer text-[11px] font-semibold text-indigo-400 hover:text-indigo-300 bg-indigo-500/10 border border-indigo-500/30 px-3 py-1 rounded-lg transition-colors flex items-center gap-1.5">
                  <i className="bi bi-camera" />
                  <span>Trocar Logo</span>
                  <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
                </label>
              )}
              <span className="text-[10px] text-slate-400">Logo do Sistema</span>
            </div>

            {/* Form Fields */}
            <form id="profileForm" onSubmit={handleSubmit} className="flex-1 space-y-3.5 w-full">
              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
                  Nome da Empresa
                </label>
                <input
                  type="text"
                  value={empresa}
                  disabled={!isEditing}
                  onChange={(e) => setEmpresa(e.target.value)}
                  className={`w-full bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl px-3.5 py-2 text-xs text-slate-800 dark:text-white outline-none transition-colors ${
                    isEditing ? 'focus:ring-1 focus:ring-indigo-500' : 'cursor-default opacity-85'
                  }`}
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
                  Nome do Responsável
                </label>
                <input
                  type="text"
                  value={nome}
                  disabled={!isEditing}
                  onChange={(e) => setNome(e.target.value)}
                  className={`w-full bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl px-3.5 py-2 text-xs text-slate-800 dark:text-white outline-none transition-colors ${
                    isEditing ? 'focus:ring-1 focus:ring-indigo-500' : 'cursor-default opacity-85'
                  }`}
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
                  Telefone / WhatsApp
                </label>
                <div className="relative flex gap-2">
                  <div className="relative">
                    <button
                      type="button"
                      disabled={!isEditing}
                      onClick={() => setShowCountryDropdown(!showCountryDropdown)}
                      className={`h-full px-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 flex items-center gap-1.5 text-xs text-slate-800 dark:text-white ${
                        isEditing ? 'hover:bg-slate-100 dark:hover:bg-slate-700 cursor-pointer' : 'cursor-default opacity-85'
                      }`}
                    >
                      <span className="font-semibold">{selectedCountry.code}</span>
                      {isEditing && <i className="bi bi-chevron-down text-[10px] text-slate-400" />}
                    </button>

                    {showCountryDropdown && isEditing && (
                      <div className="absolute left-0 top-full mt-1 w-44 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-xl py-1 z-30 max-h-48 overflow-y-auto">
                        {COUNTRIES.map((c) => (
                          <button
                            key={c.code}
                            type="button"
                            onClick={() => {
                              setSelectedCountry(c)
                              setShowCountryDropdown(false)
                            }}
                            className="w-full text-left px-3 py-1.5 text-xs text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 flex items-center justify-between"
                          >
                            <span>{c.name}</span>
                            <span className="text-slate-400 font-mono text-[11px]">{c.code}</span>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  <input
                    type="tel"
                    value={telefone}
                    disabled={!isEditing}
                    onChange={(e) => setTelefone(e.target.value)}
                    className={`flex-1 min-w-0 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl px-3.5 py-2 text-xs text-slate-800 dark:text-white outline-none transition-colors ${
                      isEditing ? 'focus:ring-1 focus:ring-indigo-500' : 'cursor-default opacity-85'
                    }`}
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
                  E-mail de Acesso
                </label>
                <input
                  type="email"
                  value={user?.email || 'admin@wfvadmin.com'}
                  disabled
                  className="w-full bg-slate-100 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 rounded-xl px-3.5 py-2 text-xs text-slate-500 dark:text-slate-400 cursor-not-allowed outline-none"
                />
              </div>
            </form>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-2.5 px-6 py-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors"
          >
            Fechar
          </button>

          {!isEditing ? (
            <button
              type="button"
              onClick={() => setIsEditing(true)}
              className="px-4 py-2 text-xs font-semibold bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl shadow-lg shadow-indigo-600/20 transition-all flex items-center gap-1.5"
            >
              <i className="bi bi-pencil" />
              Editar Perfil
            </button>
          ) : (
            <button
              type="submit"
              form="profileForm"
              disabled={isSaving}
              className="px-4 py-2 text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl shadow-lg shadow-emerald-600/20 transition-all flex items-center gap-1.5 disabled:opacity-50"
            >
              {isSaving ? (
                <>
                  <i className="bi bi-arrow-repeat animate-spin" />
                  Salvando...
                </>
              ) : (
                <>
                  <i className="bi bi-check-lg" />
                  Salvar Alterações
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
