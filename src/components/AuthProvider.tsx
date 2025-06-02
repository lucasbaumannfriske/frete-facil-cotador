
import { useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { toast } from 'sonner'

const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  useEffect(() => {
    const verificarConfiguracaoSupabase = () => {
      // Verificar se o Supabase está configurado
      if (!import.meta.env.VITE_SUPABASE_URL || import.meta.env.VITE_SUPABASE_URL === 'https://your-project-id.supabase.co') {
        console.error('Configurações do Supabase não encontradas')
        toast.error('Configure as credenciais do Supabase nas variáveis de ambiente')
        return false
      }
      return true
    }

    if (verificarConfiguracaoSupabase()) {
      console.log('AuthProvider inicializado - Supabase configurado')
    }
  }, [])

  return <>{children}</>
}

export default AuthProvider
