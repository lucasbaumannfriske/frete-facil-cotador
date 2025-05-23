
import { createClient } from '@supabase/supabase-js'

// Credenciais do Supabase - você precisa substituir pelas suas credenciais reais
const supabaseUrl = 'https://your-project-id.supabase.co'
const supabaseKey = 'your-anon-key'

export const supabase = createClient(supabaseUrl, supabaseKey)

// Função para fazer login automático do usuário Lucas
export const loginUsuarioLucas = async () => {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: 'lucasfriske@agrofarm.net.br',
      password: 'Nexus@4202'
    })
    
    if (error) {
      console.error('Erro no login:', error)
      return false
    }
    
    console.log('Login realizado com sucesso:', data)
    return true
  } catch (error) {
    console.error('Erro no login:', error)
    return false
  }
}

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
