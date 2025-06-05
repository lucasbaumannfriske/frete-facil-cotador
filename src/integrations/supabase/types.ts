export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      cotacoes: {
        Row: {
          cep: string | null
          cidade: string | null
          cliente: string
          created_at: string | null
          data: string
          destino: string | null
          endereco: string | null
          estado: string | null
          fazenda: string | null
          id: string
          observacoes: string | null
          origem: string | null
          roteiro: string | null
          user_id: string
        }
        Insert: {
          cep?: string | null
          cidade?: string | null
          cliente: string
          created_at?: string | null
          data: string
          destino?: string | null
          endereco?: string | null
          estado?: string | null
          fazenda?: string | null
          id?: string
          observacoes?: string | null
          origem?: string | null
          roteiro?: string | null
          user_id: string
        }
        Update: {
          cep?: string | null
          cidade?: string | null
          cliente?: string
          created_at?: string | null
          data?: string
          destino?: string | null
          endereco?: string | null
          estado?: string | null
          fazenda?: string | null
          id?: string
          observacoes?: string | null
          origem?: string | null
          roteiro?: string | null
          user_id?: string
        }
        Relationships: []
      }
      produtos: {
        Row: {
          cotacao_id: string
          created_at: string | null
          id: string
          nome: string
          peso: string | null
          quantidade: number
        }
        Insert: {
          cotacao_id: string
          created_at?: string | null
          id?: string
          nome: string
          peso?: string | null
          quantidade?: number
        }
        Update: {
          cotacao_id?: string
          created_at?: string | null
          id?: string
          nome?: string
          peso?: string | null
          quantidade?: number
        }
        Relationships: [
          {
            foreignKeyName: "produtos_cotacao_id_fkey"
            columns: ["cotacao_id"]
            isOneToOne: false
            referencedRelation: "cotacoes"
            referencedColumns: ["id"]
          },
        ]
      }
      system_users: {
        Row: {
          created_at: string
          created_by: string | null
          email: string
          id: string
          nome: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          email: string
          id?: string
          nome: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          created_by?: string | null
          email?: string
          id?: string
          nome?: string
          updated_at?: string
        }
        Relationships: []
      }
      transportadoras: {
        Row: {
          cotacao_id: string
          created_at: string | null
          id: string
          nome: string
          prazo: string | null
          proposta_final: string | null
          status: string | null
          user_id: string
          valor_total: string | null
          valor_unitario: string | null
        }
        Insert: {
          cotacao_id: string
          created_at?: string | null
          id?: string
          nome: string
          prazo?: string | null
          proposta_final?: string | null
          status?: string | null
          user_id: string
          valor_total?: string | null
          valor_unitario?: string | null
        }
        Update: {
          cotacao_id?: string
          created_at?: string | null
          id?: string
          nome?: string
          prazo?: string | null
          proposta_final?: string | null
          status?: string | null
          user_id?: string
          valor_total?: string | null
          valor_unitario?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "transportadoras_cotacao_id_fkey"
            columns: ["cotacao_id"]
            isOneToOne: false
            referencedRelation: "cotacoes"
            referencedColumns: ["id"]
          },
        ]
      }
      users: {
        Row: {
          created_at: string | null
          email: string
          id: string
          nome: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          email: string
          id?: string
          nome: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          email?: string
          id?: string
          nome?: string
          updated_at?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      relatorio_cotacoes_usuário: {
        Args: Record<PropertyKey, never>
        Returns: {
          cotacao_id: string
          user_id: string
          cliente: string
          data: string
          origem: string
          destino: string
          transportadora_id: string
          transportadora: string
          valor_total: number
          proposta_final: number
          status: string
          valor_efetivo: number
        }[]
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
