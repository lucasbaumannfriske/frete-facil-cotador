
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient(supabaseUrl, supabaseKey)

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
