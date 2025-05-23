
import { useEffect } from 'react'
import { loginUsuarioLucas, supabase } from '@/lib/supabase'
import { toast } from 'sonner'

const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  useEffect(() => {
    const initAuth = async () => {
      try {
        console.log('Verificando autenticação...')
        
        // Primeiro verifica se já existe um usuário logado
        const { data: { user }, error: userError } = await supabase.auth.getUser()
        
        if (userError) {
          console.log('Erro ao verificar usuário:', userError)
        }
        
        if (!user) {
          console.log('Usuário não encontrado, fazendo login automático...')
          await loginUsuarioLucas()
          console.log('Login automático realizado')
        } else {
          console.log('Usuário já autenticado:', user.email)
        }
      } catch (error) {
        console.error('Erro na inicialização da autenticação:', error)
        toast.error('Erro na autenticação. Verifique as configurações do Supabase.')
      }
    }

    // Verificar se o Supabase está configurado
    if (!import.meta.env.VITE_SUPABASE_URL || import.meta.env.VITE_SUPABASE_URL === 'https://your-project-id.supabase.co') {
      console.error('Configurações do Supabase não encontradas')
      toast.error('Configure as credenciais do Supabase nas variáveis de ambiente')
      return
    }

    initAuth()
  }, [])

  return <>{children}</>
}

export default AuthProvider
