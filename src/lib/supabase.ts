
import { createClient } from '@supabase/supabase-js'

// Configuração do Supabase usando as variáveis de ambiente
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// Verificar se as variáveis estão definidas
if (!supabaseUrl || !supabaseKey) {
  console.error('Variáveis de ambiente do Supabase não encontradas')
  console.log('VITE_SUPABASE_URL:', supabaseUrl)
  console.log('VITE_SUPABASE_ANON_KEY:', supabaseKey ? 'Definida' : 'Não definida')
}

export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  }
})

// Tipos para o banco de dados
export type Database = {
  public: {
    Tables: {
      cotacoes: {
        Row: {
          id: string
          cliente: string
          fazenda: string | null
          data: string
          endereco: string | null
          cidade: string | null
          estado: string | null
          cep: string | null
          origem: string | null
          destino: string | null
          roteiro: string | null
          observacoes: string | null
          user_id: string
          created_at: string
        }
        Insert: {
          id?: string
          cliente: string
          fazenda?: string | null
          data: string
          endereco?: string | null
          cidade?: string | null
          estado?: string | null
          cep?: string | null
          origem?: string | null
          destino?: string | null
          roteiro?: string | null
          observacoes?: string | null
          user_id?: string
          created_at?: string
        }
        Update: {
          id?: string
          cliente?: string
          fazenda?: string | null
          data?: string
          endereco?: string | null
          cidade?: string | null
          estado?: string | null
          cep?: string | null
          origem?: string | null
          destino?: string | null
          roteiro?: string | null
          observacoes?: string | null
          user_id?: string
          created_at?: string
        }
      }
      produtos: {
        Row: {
          id: string
          nome: string
          quantidade: number
          peso: string | null
          cotacao_id: string
          created_at: string
        }
        Insert: {
          id?: string
          nome: string
          quantidade: number
          peso?: string | null
          cotacao_id: string
          created_at?: string
        }
        Update: {
          id?: string
          nome?: string
          quantidade?: number
          peso?: string | null
          cotacao_id?: string
          created_at?: string
        }
      }
      transportadoras: {
        Row: {
          id: string
          nome: string
          prazo: string | null
          valor_unitario: string | null
          valor_total: string | null
          status: string
          proposta_final: string | null
          cotacao_id: string
          user_id: string | null
          created_at: string
        }
        Insert: {
          id?: string
          nome: string
          prazo?: string | null
          valor_unitario?: string | null
          valor_total?: string | null
          status?: string
          proposta_final?: string | null
          cotacao_id: string
          user_id?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          nome?: string
          prazo?: string | null
          valor_unitario?: string | null
          valor_total?: string | null
          status?: string
          proposta_final?: string | null
          cotacao_id?: string
          user_id?: string | null
          created_at?: string
        }
      }
    }
  }
}
