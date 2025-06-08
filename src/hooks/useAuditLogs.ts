
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { toast } from 'sonner'

export interface AuditLog {
  id: string
  user_id: string
  user_email: string | null
  action: string
  table_name: string
  record_id: string | null
  old_data: any
  new_data: any
  description: string | null
  created_at: string
}

export const useAuditLogs = () => {
  const [logs, setLogs] = useState<AuditLog[]>([])
  const [loading, setLoading] = useState(true)

  const carregarLogs = async () => {
    try {
      setLoading(true)
      
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        console.log('Usuário não autenticado')
        setLoading(false)
        return
      }

      console.log('Carregando logs de auditoria...')
      
      const { data: logsData, error } = await supabase
        .from('audit_logs')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(100) // Limitar para não sobrecarregar

      if (error) {
        console.error('Erro ao carregar logs:', error)
        toast.error('Erro ao carregar logs: ' + error.message)
        setLogs([])
        return
      }

      console.log('Logs carregados:', logsData?.length)
      setLogs(logsData || [])
      
    } catch (error) {
      console.error('Erro inesperado ao carregar logs:', error)
      toast.error('Erro inesperado ao carregar logs')
      setLogs([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    carregarLogs()
  }, [])

  return {
    logs,
    loading,
    carregarLogs
  }
}
