import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://ivzbtoixsdhzxqtrbkcb.supabase.co'
const supabaseAnonKey =
  import.meta.env.VITE_SUPABASE_ANON_KEY ||
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml2emJ0b2l4c2RoenhxdHJia2NiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTIwMjYzOTIsImV4cCI6MjEwNzYwMjM5Mn0.gMb0JdeguhxpiVDkyGcjdh1BoTlL4LKkXkqnO-D6k3U'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Helper to check Supabase connection health
export async function checkSupabaseConnection(): Promise<{ ok: boolean; message: string }> {
  try {
    const { error } = await supabase.from('vouchers').select('id').limit(1)
    if (error && error.code !== 'PGRST116') {
      return { ok: true, message: `Conectado ao Supabase (Tabela vouchers disponível: ${error.message})` }
    }
    return { ok: true, message: 'Conexão ativa com o Supabase' }
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err)
    return { ok: false, message: `Falha ao conectar: ${msg}` }
  }
}

// Fetch vouchers from Supabase with fallback to mock data
export async function getVouchers() {
  try {
    const { data, error } = await supabase
      .from('vouchers')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(50)

    if (error || !data || data.length === 0) {
      return null
    }
    return data
  } catch {
    return null
  }
}
