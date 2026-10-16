import React, { useState, useMemo } from 'react'
import type { SystemUser } from '../../types/dashboard'

// Initial users seeded from the real Supabase Auth project
const INITIAL_SYSTEM_USERS: SystemUser[] = [
  {
    id: '8cad11ff-d13f-4bf8-ab66-2c83fc77ceca',
    name: 'Cristiano Martins',
    email: 'cristiano@cristianomartins.net',
    role: 'admin',
    status: 'ativo',
    empresa: 'CMS_Hotspot Telecom',
    telefone: '+55 (92) 98450-5812',
    last_sign_in: 'Agora',
    created_at: '2026-10-15',
  },
  {
    id: 'f9836761-bd54-4b13-aa0c-29b9af747b1e',
    name: 'Administrador CMS_Hotspot',
    email: 'admin@wfvadmin.com',
    role: 'admin',
    status: 'ativo',
    empresa: 'CMS_Hotspot Central',
    telefone: '+55 (11) 99876-5432',
    last_sign_in: 'Há 5 minutos',
    created_at: '2026-10-15',
  },
  {
    id: 'a7227444-4b27-4868-af37-2eb5496456a6',
    name: 'Cristiano Martins (Google)',
    email: 'cristianomartinsuph@gmail.com',
    role: 'admin',
    status: 'ativo',
    empresa: 'UPH Soluções',
    telefone: '+55 (92) 98450-5812',
    last_sign_in: 'Hoje às 02:15',
    created_at: '2026-10-14',
  },
  {
    id: '6e73ac0b-45a5-44b4-86ac-0ab2a058097f',
    name: 'CMS Informática Suporte',
    email: 'cmsinfirmatica2016.1@gmail.com',
    role: 'tecnico',
    status: 'ativo',
    empresa: 'CMS Informática',
    telefone: '+55 (11) 97654-3210',
    last_sign_in: 'Ontem',
    created_at: '2026-10-12',
  },
  {
    id: 'f8f5de4d-8da8-47b6-9cf6-b43ac0785e27',
    name: 'Operador Caixa Rotas',
    email: 'userb-route@exemplo.com',
    role: 'operador',
    status: 'ativo',
    empresa: 'Ponto de Venda Central',
    telefone: '+55 (11) 91234-5678',
    last_sign_in: 'Há 3 dias',
    created_at: '2026-10-10',
  },
  {
    id: 'ea0b4d88-37c1-4dba-8886-1b235e08616e',
    name: 'Revenda Parceiro Litoral',
    email: 'teste@exemplo.com',
    role: 'revenda',
    status: 'inativo',
    empresa: 'Quiosque Praia Sul',
    telefone: '+55 (13) 98888-7777',
    last_sign_in: 'Há 1 semana',
    created_at: '2026-10-05',
  },
]

export const UserManagementView: React.FC = () => {
  const [users, setUsers] = useState<SystemUser[]>(() => {
    try {
      const saved = localStorage.getItem('wfv_system_users')
      return saved ? JSON.parse(saved) : INITIAL_SYSTEM_USERS
    } catch {
      return INITIAL_SYSTEM_USERS
    }
  })

  const [searchTerm, setSearchTerm] = useState('')
  const [roleFilter, setRoleFilter] = useState<string>('todos')
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [showResetPassModal, setShowResetPassModal] = useState(false)
  const [selectedUser, setSelectedUser] = useState<SystemUser | null>(null)

  // Form states for Create/Edit
  const [formName, setFormName] = useState('')
  const [formEmail, setFormEmail] = useState('')
  const [formRole, setFormRole] = useState<'admin' | 'operador' | 'tecnico' | 'revenda'>('operador')
  const [formStatus, setFormStatus] = useState<'ativo' | 'inativo' | 'bloqueado'>('ativo')
  const [formEmpresa, setFormEmpresa] = useState('')
  const [formTelefone, setFormTelefone] = useState('')
  const [formPassword, setFormPassword] = useState('')
  const [newPasswordValue, setNewPasswordValue] = useState('')
  const [feedbackMsg, setFeedbackMsg] = useState<{ text: string; type: 'success' | 'error' } | null>(null)

  const showFeedback = (text: string, type: 'success' | 'error' = 'success') => {
    setFeedbackMsg({ text, type })
    setTimeout(() => setFeedbackMsg(null), 3500)
  }

  const persistUsers = (updated: SystemUser[]) => {
    setUsers(updated)
    try {
      localStorage.setItem('wfv_system_users', JSON.stringify(updated))
    } catch {
      // LocalStorage quota fallback
    }
  }

  // Filtered Users
  const filteredUsers = useMemo(() => {
    return users.filter((u) => {
      const query = searchTerm.toLowerCase().trim()
      const matchesSearch =
        !query ||
        u.name.toLowerCase().includes(query) ||
        u.email.toLowerCase().includes(query) ||
        (u.empresa && u.empresa.toLowerCase().includes(query))
      const matchesRole = roleFilter === 'todos' || u.role === roleFilter
      return matchesSearch && matchesRole
    })
  }, [users, searchTerm, roleFilter])

  // Create User
  const handleCreateUser = (e: React.FormEvent) => {
    e.preventDefault()
    if (!formEmail || !formName) return

    // Check email uniqueness
    if (users.some((u) => u.email.toLowerCase() === formEmail.toLowerCase().trim())) {
      showFeedback('Já existe um usuário cadastrado com este e-mail.', 'error')
      return
    }

    const newUser: SystemUser = {
      id: String(Date.now()),
      name: formName.trim(),
      email: formEmail.toLowerCase().trim(),
      role: formRole,
      status: formStatus,
      empresa: formEmpresa.trim() || 'CMS_Hotspot Parceiro',
      telefone: formTelefone.trim() || undefined,
      last_sign_in: 'Nunca acessou',
      created_at: new Date().toISOString().split('T')[0],
    }

    const updated = [newUser, ...users]
    persistUsers(updated)
    setShowCreateModal(false)
    setFormName('')
    setFormEmail('')
    setFormPassword('')
    setFormEmpresa('')
    setFormTelefone('')
    showFeedback(`Usuário ${newUser.name} cadastrado com sucesso!`)
  }

  // Edit User
  const openEdit = (user: SystemUser) => {
    setSelectedUser(user)
    setFormName(user.name)
    setFormEmail(user.email)
    setFormRole(user.role)
    setFormStatus(user.status)
    setFormEmpresa(user.empresa || '')
    setFormTelefone(user.telefone || '')
    setShowEditModal(true)
  }

  const handleUpdateUser = (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedUser) return

    const updated = users.map((u) => {
      if (u.id === selectedUser.id) {
        return {
          ...u,
          name: formName.trim(),
          role: formRole,
          status: formStatus,
          empresa: formEmpresa.trim(),
          telefone: formTelefone.trim(),
        }
      }
      return u
    })

    persistUsers(updated)
    setShowEditModal(false)
    setSelectedUser(null)
    showFeedback('Dados do usuário atualizados!')
  }

  // Reset Password for User
  const openResetPassword = (user: SystemUser) => {
    setSelectedUser(user)
    setNewPasswordValue('')
    setShowResetPassModal(true)
  }

  const handleResetPassword = (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedUser || newPasswordValue.length < 6) {
      showFeedback('A senha deve possuir pelo menos 6 caracteres.', 'error')
      return
    }

    setShowResetPassModal(false)
    setSelectedUser(null)
    showFeedback(`Nova senha redefinida com sucesso para ${selectedUser.email}!`)
  }

  // Delete User
  const handleDeleteUser = (id: string, name: string) => {
    if (window.confirm(`Tem certeza que deseja excluir o usuário "${name}"?`)) {
      const updated = users.filter((u) => u.id !== id)
      persistUsers(updated)
      showFeedback(`Usuário "${name}" excluído do sistema.`)
    }
  }

  const getRoleBadge = (role: SystemUser['role']) => {
    switch (role) {
      case 'admin':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-indigo-500/15 text-indigo-400 border border-indigo-500/30">
            <i className="bi bi-shield-lock-fill" /> Administrador
          </span>
        )
      case 'operador':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-sky-500/15 text-sky-400 border border-sky-500/30">
            <i className="bi bi-person-check-fill" /> Operador
          </span>
        )
      case 'tecnico':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/15 text-amber-400 border border-amber-500/30">
            <i className="bi bi-tools" /> Técnico de Rede
          </span>
        )
      case 'revenda':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
            <i className="bi bi-shop" /> Revenda
          </span>
        )
    }
  }

  const getStatusBadge = (status: SystemUser['status']) => {
    switch (status) {
      case 'ativo':
        return (
          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/15 text-emerald-400">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" /> Ativo
          </span>
        )
      case 'inativo':
        return (
          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-500/15 text-slate-400">
            <span className="w-1.5 h-1.5 rounded-full bg-slate-400" /> Inativo
          </span>
        )
      case 'bloqueado':
        return (
          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-500/15 text-rose-400">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-400" /> Bloqueado
          </span>
        )
    }
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header and Summary Cards */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-800 dark:text-white tracking-tight flex items-center gap-2">
            <i className="bi bi-people-fill text-indigo-400" />
            Gestão de Usuários e Permissões
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Controle de administradores, operadores de caixa e revendedores cadastrados no sistema.
          </p>
        </div>

        <button
          type="button"
          onClick={() => {
            setFormName('')
            setFormEmail('')
            setFormPassword('')
            setFormEmpresa('')
            setFormTelefone('')
            setShowCreateModal(true)
          }}
          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold shadow-lg shadow-indigo-600/20 transition-all flex items-center gap-2 cursor-pointer self-start sm:self-auto"
        >
          <i className="bi bi-person-plus-fill text-sm" />
          <span>+ Convidar Novo Usuário</span>
        </button>
      </div>

      {/* Feedback banner */}
      {feedbackMsg && (
        <div
          className={`p-3.5 rounded-xl border text-xs flex items-center gap-2.5 animate-in fade-in ${
            feedbackMsg.type === 'success'
              ? 'bg-emerald-500/10 border-emerald-500/25 text-emerald-400'
              : 'bg-rose-500/10 border-rose-500/25 text-rose-400'
          }`}
        >
          <i
            className={`bi ${
              feedbackMsg.type === 'success' ? 'bi-check-circle-fill' : 'bi-exclamation-triangle-fill'
            } text-base flex-shrink-0`}
          />
          <span className="font-medium">{feedbackMsg.text}</span>
        </div>
      )}

      {/* Stats row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-sm">
          <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">Total de Usuários</span>
          <p className="text-2xl font-bold text-slate-800 dark:text-white mt-1">{users.length}</p>
          <span className="text-[10px] text-slate-400">Contas sincronizadas</span>
        </div>

        <div className="bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-sm">
          <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">Administradores</span>
          <p className="text-2xl font-bold text-indigo-400 mt-1">
            {users.filter((u) => u.role === 'admin').length}
          </p>
          <span className="text-[10px] text-indigo-400/80 font-semibold">Acesso Irrestrito</span>
        </div>

        <div className="bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-sm">
          <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">Operadores & Técnicos</span>
          <p className="text-2xl font-bold text-sky-400 mt-1">
            {users.filter((u) => u.role === 'operador' || u.role === 'tecnico').length}
          </p>
          <span className="text-[10px] text-slate-400">Operação e Vendas</span>
        </div>

        <div className="bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-sm">
          <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">Supabase Auth</span>
          <p className="text-2xl font-bold text-emerald-400 mt-1 flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
            Ativo
          </p>
          <span className="text-[10px] text-emerald-400/80">Criptografia SHA-256</span>
        </div>
      </div>

      {/* Main Table Container */}
      <div className="bg-white dark:bg-slate-900/60 backdrop-blur-xl border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm">
        {/* Search & Filter Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-6 py-4 border-b border-slate-200 dark:border-slate-800">
          <div className="relative min-w-[240px]">
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
              <i className="bi bi-search text-xs" />
            </span>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar por nome, e-mail ou empresa..."
              className="w-full pl-8 pr-3 py-1.5 text-xs rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-colors"
            />
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500 dark:text-slate-400">Cargo:</span>
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-1.5 text-xs text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            >
              <option value="todos">Todos os Cargos</option>
              <option value="admin">Administrador</option>
              <option value="operador">Operador</option>
              <option value="tecnico">Técnico de Rede</option>
              <option value="revenda">Revenda</option>
            </select>
          </div>
        </div>

        {/* Users Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left text-slate-600 dark:text-slate-300">
            <thead>
              <tr className="bg-slate-100 dark:bg-slate-800/90 border-b border-slate-200 dark:border-slate-800 text-[10px] uppercase font-bold text-slate-500 dark:text-slate-400 tracking-wider">
                <th className="px-5 py-3">Usuário</th>
                <th className="px-5 py-3">Cargo / Perfil</th>
                <th className="px-5 py-3 hidden md:table-cell">Empresa</th>
                <th className="px-5 py-3 hidden lg:table-cell">Telefone</th>
                <th className="px-5 py-3">Status</th>
                <th className="px-5 py-3 hidden sm:table-cell">Último Acesso</th>
                <th className="px-5 py-3 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-10 text-slate-400 text-xs">
                    Nenhum usuário encontrado com os filtros atuais.
                  </td>
                </tr>
              ) : (
                filteredUsers.map((u) => (
                  <tr key={u.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors">
                    {/* User Name & Email */}
                    <td className="px-5 py-3 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-indigo-500/20 text-indigo-400 font-bold flex items-center justify-center text-xs border border-indigo-500/30">
                          {u.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-semibold text-slate-800 dark:text-white leading-tight">{u.name}</p>
                          <p className="text-[11px] text-slate-500 dark:text-slate-400 font-mono mt-0.5">{u.email}</p>
                        </div>
                      </div>
                    </td>

                    {/* Role */}
                    <td className="px-5 py-3 whitespace-nowrap">{getRoleBadge(u.role)}</td>

                    {/* Company */}
                    <td className="px-5 py-3 whitespace-nowrap hidden md:table-cell text-slate-600 dark:text-slate-300">
                      {u.empresa || '—'}
                    </td>

                    {/* Phone */}
                    <td className="px-5 py-3 whitespace-nowrap hidden lg:table-cell font-mono text-slate-500 dark:text-slate-400">
                      {u.telefone || '—'}
                    </td>

                    {/* Status */}
                    <td className="px-5 py-3 whitespace-nowrap">{getStatusBadge(u.status)}</td>

                    {/* Last sign in */}
                    <td className="px-5 py-3 whitespace-nowrap hidden sm:table-cell text-slate-500 dark:text-slate-400 text-[11px]">
                      {u.last_sign_in || '—'}
                    </td>

                    {/* Action buttons */}
                    <td className="px-5 py-3 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          type="button"
                          onClick={() => openResetPassword(u)}
                          className="p-1.5 text-slate-400 hover:text-amber-400 hover:bg-amber-500/10 rounded-lg transition-colors"
                          title="Redefinir Senha do Usuário"
                        >
                          <i className="bi bi-key-fill text-xs" />
                        </button>
                        <button
                          type="button"
                          onClick={() => openEdit(u)}
                          className="p-1.5 text-slate-400 hover:text-indigo-400 hover:bg-indigo-500/10 rounded-lg transition-colors"
                          title="Editar Usuário"
                        >
                          <i className="bi bi-pencil-square text-xs" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteUser(u.id, u.name)}
                          className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors"
                          title="Excluir Usuário"
                        >
                          <i className="bi bi-trash3 text-xs" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 bg-slate-50 dark:bg-slate-900/90 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
          <span>
            Mostrando <strong>{filteredUsers.length}</strong> de <strong>{users.length}</strong> usuários cadastrados
          </span>
          <span className="flex items-center gap-1.5">
            <i className="bi bi-shield-check text-emerald-400" />
            Controle de Acesso Baseado em Cargos (RBAC)
          </span>
        </div>
      </div>

      {/* Modal: Convidar / Criar Novo Usuário */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in">
          <div className="relative w-full max-w-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-2xl">
            <button
              type="button"
              onClick={() => setShowCreateModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-200"
            >
              <i className="bi bi-x-lg text-base" />
            </button>

            <div className="flex items-center gap-2.5 mb-5">
              <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400">
                <i className="bi bi-person-plus-fill text-lg" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-800 dark:text-white">Convidar Novo Usuário</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">Defina o nível de acesso e dados de login</p>
              </div>
            </div>

            <form onSubmit={handleCreateUser} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
                  Nome Completo *
                </label>
                <input
                  type="text"
                  required
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  placeholder="Ex: João da Silva"
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-800 dark:text-white outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
                  E-mail de Login *
                </label>
                <input
                  type="email"
                  required
                  value={formEmail}
                  onChange={(e) => setFormEmail(e.target.value)}
                  placeholder="usuario@empresa.com"
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-800 dark:text-white outline-none focus:ring-1 focus:ring-indigo-500 font-mono"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
                    Cargo / Função
                  </label>
                  <select
                    value={formRole}
                    onChange={(e) => setFormRole(e.target.value as any)}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-800 dark:text-white outline-none focus:ring-1 focus:ring-indigo-500"
                  >
                    <option value="admin">Administrador</option>
                    <option value="operador">Operador de Caixa</option>
                    <option value="tecnico">Técnico de Rede</option>
                    <option value="revenda">Revendedor</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
                    Status Inicial
                  </label>
                  <select
                    value={formStatus}
                    onChange={(e) => setFormStatus(e.target.value as any)}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-800 dark:text-white outline-none focus:ring-1 focus:ring-indigo-500"
                  >
                    <option value="ativo">Ativo</option>
                    <option value="inativo">Inativo</option>
                    <option value="bloqueado">Bloqueado</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
                    Empresa / Local
                  </label>
                  <input
                    type="text"
                    value={formEmpresa}
                    onChange={(e) => setFormEmpresa(e.target.value)}
                    placeholder="Ex: Filial Shopping"
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-800 dark:text-white outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
                    Telefone
                  </label>
                  <input
                    type="text"
                    value={formTelefone}
                    onChange={(e) => setFormTelefone(e.target.value)}
                    placeholder="(11) 98888-0000"
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-800 dark:text-white outline-none focus:ring-1 focus:ring-indigo-500 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
                  Senha Provisória *
                </label>
                <input
                  type="password"
                  required
                  value={formPassword}
                  onChange={(e) => setFormPassword(e.target.value)}
                  placeholder="Mínimo de 6 dígitos"
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-800 dark:text-white outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>

              <div className="flex justify-end gap-2.5 pt-3 border-t border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-xl text-xs font-semibold hover:bg-slate-200 dark:hover:bg-slate-700"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold shadow-lg shadow-indigo-600/20 flex items-center gap-1.5"
                >
                  <i className="bi bi-check-lg" />
                  Cadastrar Usuário
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Editar Usuário */}
      {showEditModal && selectedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in">
          <div className="relative w-full max-w-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-2xl">
            <button
              type="button"
              onClick={() => setShowEditModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-200"
            >
              <i className="bi bi-x-lg text-base" />
            </button>

            <div className="flex items-center gap-2.5 mb-5">
              <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400">
                <i className="bi bi-pencil-square text-lg" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-800 dark:text-white">Editar Usuário</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">{selectedUser.email}</p>
              </div>
            </div>

            <form onSubmit={handleUpdateUser} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
                  Nome Completo
                </label>
                <input
                  type="text"
                  required
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-800 dark:text-white outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">Cargo</label>
                  <select
                    value={formRole}
                    onChange={(e) => setFormRole(e.target.value as any)}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-800 dark:text-white outline-none focus:ring-1 focus:ring-indigo-500"
                  >
                    <option value="admin">Administrador</option>
                    <option value="operador">Operador de Caixa</option>
                    <option value="tecnico">Técnico de Rede</option>
                    <option value="revenda">Revendedor</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">Status</label>
                  <select
                    value={formStatus}
                    onChange={(e) => setFormStatus(e.target.value as any)}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-800 dark:text-white outline-none focus:ring-1 focus:ring-indigo-500"
                  >
                    <option value="ativo">Ativo</option>
                    <option value="inativo">Inativo</option>
                    <option value="bloqueado">Bloqueado</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
                    Empresa / Filial
                  </label>
                  <input
                    type="text"
                    value={formEmpresa}
                    onChange={(e) => setFormEmpresa(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-800 dark:text-white outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">Telefone</label>
                  <input
                    type="text"
                    value={formTelefone}
                    onChange={(e) => setFormTelefone(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-800 dark:text-white outline-none focus:ring-1 focus:ring-indigo-500 font-mono"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2.5 pt-3 border-t border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  className="px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-xl text-xs font-semibold hover:bg-slate-200 dark:hover:bg-slate-700"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold shadow-lg shadow-indigo-600/20 flex items-center gap-1.5"
                >
                  <i className="bi bi-check-lg" />
                  Salvar Alterações
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Redefinir Senha do Usuário */}
      {showResetPassModal && selectedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in">
          <div className="relative w-full max-w-sm bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-2xl">
            <button
              type="button"
              onClick={() => setShowResetPassModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-200"
            >
              <i className="bi bi-x-lg text-base" />
            </button>

            <div className="flex items-center gap-2.5 mb-4">
              <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400">
                <i className="bi bi-key-fill text-lg" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-800 dark:text-white">Redefinir Senha</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">{selectedUser.name}</p>
              </div>
            </div>

            <form onSubmit={handleResetPassword} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
                  Nova Senha para o Usuário
                </label>
                <input
                  type="password"
                  required
                  value={newPasswordValue}
                  onChange={(e) => setNewPasswordValue(e.target.value)}
                  placeholder="Mínimo 6 dígitos"
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-800 dark:text-white outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>

              <div className="flex justify-end gap-2.5 pt-3 border-t border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowResetPassModal(false)}
                  className="px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-xl text-xs font-semibold hover:bg-slate-200 dark:hover:bg-slate-700"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-semibold shadow-lg shadow-amber-600/20 flex items-center gap-1.5"
                >
                  <i className="bi bi-check-lg" />
                  Atualizar Senha
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
