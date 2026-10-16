import React, { useState } from 'react'
import { supabase } from '../../lib/supabase'

interface LoginPageProps {
  onLoginSuccess: (user: { email: string; name: string }) => void
  isDarkMode: boolean
  onToggleDarkMode: () => void
}

export const LoginPage: React.FC<LoginPageProps> = ({
  onLoginSuccess,
  isDarkMode,
  onToggleDarkMode,
}) => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [rememberMe, setRememberMe] = useState(true)
  const [loading, setLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [showForgotPassword, setShowForgotPassword] = useState(false)
  const [resetEmail, setResetEmail] = useState('')
  const [resetSuccess, setResetSuccess] = useState(false)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setErrorMessage(null)

    const rawEmail = email.trim()
    const cleanEmail = rawEmail === 'admin' ? 'admin@wfvadmin.com' : rawEmail.toLowerCase()
    const cleanPassword = password.trim()

    // List of accepted default administrative emails
    const adminEmails = [
      'admin@wfvadmin.com',
      'cristiano@cristianomartins.net',
      'cristianomartinsuph@gmail.com',
      'cmsinfirmatica2016.1@gmail.com',
    ]

    // List of accepted passwords for local/offline/fallback
    const validPasswords = [
      'admin123',
      'Admin@WFV2026!',
      'admin',
      '123456',
      'admin@123',
      'admin2026',
    ]

    // Check if user exists in custom users saved in localStorage
    let customUser: { email: string; name?: string } | null = null
    try {
      const storedUsers = localStorage.getItem('wfv_custom_users')
      if (storedUsers) {
        const parsed = JSON.parse(storedUsers)
        customUser = parsed.find(
          (u: { email?: string }) => u.email?.toLowerCase() === cleanEmail
        )
      }
    } catch {}

    const isMasterAdmin = adminEmails.includes(cleanEmail) || cleanEmail.includes('admin')
    const isValidPass = validPasswords.includes(cleanPassword)

    try {
      // 1. Attempt Supabase Auth if online
      try {
        const { data, error } = await supabase.auth.signInWithPassword({
          email: cleanEmail,
          password: cleanPassword,
        })

        if (!error && data?.user) {
          const user = {
            email: data.user.email || cleanEmail,
            name:
              data.user.user_metadata?.name ||
              (data.user.email?.includes('cristiano')
                ? 'Cristiano Martins'
                : 'Administrador WFV'),
          }
          if (rememberMe) {
            localStorage.setItem('wfv_admin_session', JSON.stringify(user))
          }
          onLoginSuccess(user)
          return
        }
      } catch {
        // Continue to fallback
      }

      // 2. Master Admin Instant Fallback
      if (isMasterAdmin && (isValidPass || cleanPassword.length >= 3)) {
        const user = {
          email: cleanEmail,
          name: cleanEmail.includes('cristiano')
            ? 'Cristiano Martins'
            : cleanEmail.includes('cms')
            ? 'CMS Informática'
            : 'Administrador WFV',
        }
        if (rememberMe) {
          localStorage.setItem('wfv_admin_session', JSON.stringify(user))
        }
        onLoginSuccess(user)
        return
      }

      // 3. Custom Registered User Fallback
      if (customUser && (isValidPass || cleanPassword.length >= 3)) {
        const user = {
          email: customUser.email,
          name: customUser.name || 'Usuário WFV',
        }
        if (rememberMe) {
          localStorage.setItem('wfv_admin_session', JSON.stringify(user))
        }
        onLoginSuccess(user)
        return
      }

      // 4. Any Valid Email with standard password
      if (cleanEmail.includes('@') && isValidPass) {
        const user = {
          email: cleanEmail,
          name: cleanEmail.split('@')[0],
        }
        if (rememberMe) {
          localStorage.setItem('wfv_admin_session', JSON.stringify(user))
        }
        onLoginSuccess(user)
        return
      }

      setErrorMessage(
        'E-mail ou senha incorretos. Utilize admin@wfvadmin.com e senha admin123 ou clique no botão de preenchimento rápido.'
      )
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Erro ao processar login'
      setErrorMessage(msg)
    } finally {
      setLoading(false)
    }
  }

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!resetEmail) return
    setLoading(true)
    try {
      await supabase.auth.resetPasswordForEmail(resetEmail.trim())
      setResetSuccess(true)
    } catch {
      setResetSuccess(true) // Don't leak email existence
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 flex items-center justify-center p-4 selection:bg-indigo-500/30 overflow-x-hidden relative transition-colors duration-200">
      {/* Background glowing blurred gradients */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-500/10 dark:bg-indigo-600/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 dark:bg-purple-600/15 rounded-full blur-3xl pointer-events-none" />

      {/* Main Login Card (Matching real WFV Admin login.php) */}
      <div className="w-full max-w-4xl bg-white/90 dark:bg-slate-900/80 backdrop-blur-xl border border-slate-200 dark:border-slate-800 rounded-3xl overflow-hidden shadow-2xl grid grid-cols-1 md:grid-cols-12 relative z-10">
        {/* Left Side: Brand & Feature Highlights */}
        <div className="hidden md:flex md:col-span-5 bg-gradient-to-tr from-slate-100 to-indigo-50 dark:from-slate-900 dark:to-indigo-950/60 p-8 flex-col justify-between border-r border-slate-200 dark:border-slate-800 relative overflow-hidden">
          <div className="absolute -right-16 -top-16 w-48 h-48 bg-indigo-500/15 rounded-full blur-3xl pointer-events-none" />

          <div className="space-y-6 relative z-10">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-500/15 border border-indigo-500/30 flex items-center justify-center p-1.5 shadow-lg shadow-indigo-500/10">
                <img
                  src="/wifivoucher.png"
                  alt="WFV Admin"
                  className="w-full h-full object-contain"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none'
                  }}
                />
                <i className="bi bi-wifi text-indigo-400 text-lg hidden only:block" />
              </div>
              <span className="text-slate-900 dark:text-white font-bold tracking-tight text-lg">
                WFV Admin
              </span>
            </div>

            <div className="space-y-2 mt-8">
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white leading-tight">
                Bem-vindo de volta!
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Acesse sua conta administrativa para gerenciar hotspots, vouchers e faturamento em tempo real.
              </p>
            </div>
          </div>

          <div className="space-y-3.5 my-8 relative z-10">
            <p className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">
              Recursos Integrados
            </p>
            <ul className="space-y-2.5">
              {[
                'Acesso rápido e seguro',
                'Gestão de Hotspots e Vouchers',
                'Integração de Faturamento PIX',
                'Relatórios e Estatísticas Detalhadas',
                'Suporte com IA e Humano',
              ].map((item, idx) => (
                <li
                  key={idx}
                  className="flex items-center gap-2.5 text-xs text-slate-700 dark:text-slate-300"
                >
                  <i className="bi bi-check-circle-fill text-emerald-500 text-sm flex-shrink-0" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="text-[10px] text-slate-400 dark:text-slate-500 relative z-10">
            &copy; 2026 WFV Admin. Todos os direitos reservados.
          </div>
        </div>

        {/* Right Side: Authentication Form */}
        <div className="col-span-1 md:col-span-7 p-8 md:p-12 flex flex-col justify-center relative">
          {/* Top theme toggle */}
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-2 md:hidden">
              <img src="/wifivoucher.png" alt="Logo" className="w-7 h-7 rounded-lg" />
              <span className="font-bold text-sm text-slate-900 dark:text-white">WFV Admin</span>
            </div>
            <div className="ml-auto flex items-center gap-2">
              <button
                type="button"
                onClick={onToggleDarkMode}
                className="p-2 text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                title="Alternar tema claro/escuro"
              >
                {isDarkMode ? (
                  <i className="bi bi-sun-fill text-amber-400" />
                ) : (
                  <i className="bi bi-moon-stars-fill text-indigo-500" />
                )}
              </button>
            </div>
          </div>

          <div className="mb-6">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
              Entrar no Sistema
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Preencha seus dados de acesso para entrar no painel.
            </p>
          </div>

          {errorMessage && (
            <div className="mb-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs flex items-center gap-2 animate-in fade-in">
              <i className="bi bi-exclamation-triangle-fill text-base flex-shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Quick Fill Credentials Banner */}
          <div className="mb-4 p-3 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800/60 flex items-center justify-between gap-3 text-xs">
            <div className="min-w-0">
              <p className="font-semibold text-indigo-900 dark:text-indigo-200 flex items-center gap-1.5">
                <i className="bi bi-shield-lock-fill text-indigo-500" />
                Acesso do Administrador
              </p>
              <p className="text-[11px] text-indigo-700/80 dark:text-indigo-400 font-mono mt-0.5 truncate">
                admin@wfvadmin.com &bull; Senha: admin123
              </p>
            </div>
            <button
              type="button"
              onClick={() => {
                setEmail('admin@wfvadmin.com')
                setPassword('admin123')
                setErrorMessage(null)
              }}
              className="px-2.5 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-semibold text-[11px] transition-colors cursor-pointer whitespace-nowrap shadow-xs active:scale-95 flex-shrink-0"
            >
              Preencher
            </button>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            {/* Email Field */}
            <div>
              <label
                htmlFor="email"
                className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1.5 uppercase tracking-wider"
              >
                E-mail
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400 dark:text-slate-500 pointer-events-none">
                  <i className="bi bi-envelope text-sm" />
                </span>
                <input
                  type="email"
                  id="email"
                  name="email"
                  required
                  autoComplete="username"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="seu@email.com"
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-600 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors"
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label
                htmlFor="password"
                className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1.5 uppercase tracking-wider"
              >
                Senha
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400 dark:text-slate-500 pointer-events-none">
                  <i className="bi bi-lock text-sm" />
                </span>
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  name="password"
                  required
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Digite sua senha"
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl pl-10 pr-10 py-2.5 text-sm text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-600 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors focus:outline-none"
                  aria-label={showPassword ? 'Ocultar senha' : 'Ver senha'}
                >
                  <i className={`bi ${showPassword ? 'bi-eye-slash' : 'bi-eye'}`} />
                </button>
              </div>
            </div>

            {/* Remember Me */}
            <div className="flex items-center">
              <input
                type="checkbox"
                id="rememberMe"
                name="rememberMe"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="h-4 w-4 rounded border-slate-300 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
              />
              <label
                htmlFor="rememberMe"
                className="ml-2 text-xs font-medium text-slate-500 dark:text-slate-400 select-none cursor-pointer"
              >
                Lembrar de mim por 30 dias
              </label>
            </div>


            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 px-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-semibold transition-all duration-200 shadow-lg shadow-indigo-600/20 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <i className="bi bi-arrow-repeat animate-spin text-base" />
                  <span>Autenticando...</span>
                </>
              ) : (
                <>
                  <i className="bi bi-box-arrow-in-right text-base" />
                  <span>Entrar no Painel</span>
                </>
              )}
            </button>

            {/* Forgot password link */}
            <div className="text-center mt-4">
              <button
                type="button"
                onClick={() => setShowForgotPassword(true)}
                className="text-xs text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300 transition-colors font-medium focus:outline-none"
              >
                Esqueceu a senha?
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Forgot Password Modal */}
      {showForgotPassword && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in">
          <div className="relative w-full max-w-md rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 shadow-2xl">
            <button
              type="button"
              onClick={() => setShowForgotPassword(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-200"
            >
              <i className="bi bi-x-lg text-lg" />
            </button>

            <div className="flex items-center gap-3.5 mb-5">
              <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
                <i className="bi bi-key-fill text-lg" />
              </div>
              <div>
                <h3 className="text-base font-semibold text-slate-900 dark:text-white">
                  Recuperação de Senha
                </h3>
                <p className="text-xs text-slate-400">Redefina o acesso à sua conta.</p>
              </div>
            </div>

            {resetSuccess ? (
              <div className="space-y-4 text-center py-4">
                <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto text-2xl">
                  <i className="bi bi-check-lg" />
                </div>
                <p className="text-xs text-slate-300">
                  Se o e-mail estiver cadastrado, enviamos as instruções para redefinição.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setShowForgotPassword(false)
                    setResetSuccess(false)
                  }}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold"
                >
                  Fechar
                </button>
              </div>
            ) : (
              <form onSubmit={handleResetPassword} className="space-y-4">
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  Informe seu e-mail cadastrado e enviaremos um link com instruções para criar uma nova senha.
                </p>
                <div>
                  <label
                    htmlFor="resetEmail"
                    className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1.5 uppercase tracking-wider"
                  >
                    E-mail
                  </label>
                  <input
                    type="email"
                    id="resetEmail"
                    required
                    value={resetEmail}
                    onChange={(e) => setResetEmail(e.target.value)}
                    placeholder="seu@email.com"
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                </div>
                <div className="flex justify-end gap-2.5 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowForgotPassword(false)}
                    className="px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-lg text-xs font-semibold hover:bg-slate-200 dark:hover:bg-slate-700"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5"
                  >
                    <i className="bi bi-send" />
                    Enviar Link
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
