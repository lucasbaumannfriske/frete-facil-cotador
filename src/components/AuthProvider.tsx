
import { useEffect } from 'react'
import { loginUsuarioLucas } from '@/lib/supabase'
import { toast } from 'sonner'

const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  useEffect(() => {
    const initAuth = async () => {
      try {
        console.log('Inicializando autenticação automática...')
        await loginUsuarioLucas()
      } catch (error) {
        console.error('Erro na inicialização da autenticação:', error)
        toast.error('Erro na autenticação inicial')
      }
    }

    initAuth()
  }, [])

  return <>{children}</>
}

export default AuthProvider
