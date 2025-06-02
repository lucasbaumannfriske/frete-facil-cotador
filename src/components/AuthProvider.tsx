
import { useEffect } from 'react'
import { supabase } from '@/lib/supabase'
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
          
          const { data, error } = await supabase.auth.signInWithPassword({
            email: 'lucasfriske@agrofarm.net.br',
            password: 'Nexus@4202'
          })
          
          if (error) {
            console.error('Erro no login automático:', error)
            toast.error('Erro de autenticação: ' + error.message)
          } else {
            console.log('Login automático realizado')
            toast.success('Usuário autenticado com sucesso')
          }
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
