export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.3 (519615d)"
  }
  public: {
    Tables: {
      audit_logs: {
        Row: {
          action: string
          created_at: string
          description: string | null
          id: string
          new_data: Json | null
          old_data: Json | null
          record_id: string | null
          table_name: string
          user_email: string | null
          user_id: string
        }
        Insert: {
          action: string
          created_at?: string
          description?: string | null
          id?: string
          new_data?: Json | null
          old_data?: Json | null
          record_id?: string | null
          table_name: string
          user_email?: string | null
          user_id: string
        }
        Update: {
          action?: string
          created_at?: string
          description?: string | null
          id?: string
          new_data?: Json | null
          old_data?: Json | null
          record_id?: string | null
          table_name?: string
          user_email?: string | null
          user_id?: string
        }
        Relationships: []
      }
      cotacoes: {
        Row: {
          cep: string | null
          cidade: string | null
          cliente: string
          created_at: string | null
          data: string
          deleted_at: string | null
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
          deleted_at?: string | null
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
          deleted_at?: string | null
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
      ctes: {
        Row: {
          arquivo_nome: string | null
          arquivo_url: string | null
          cotacao_id: string
          created_at: string
          id: string
          numero_cte: string
          quantidade: number | null
          transportadora_id: string
          updated_at: string
          user_id: string
          valor_cte: number | null
        }
        Insert: {
          arquivo_nome?: string | null
          arquivo_url?: string | null
          cotacao_id: string
          created_at?: string
          id?: string
          numero_cte: string
          quantidade?: number | null
          transportadora_id: string
          updated_at?: string
          user_id: string
          valor_cte?: number | null
        }
        Update: {
          arquivo_nome?: string | null
          arquivo_url?: string | null
          cotacao_id?: string
          created_at?: string
          id?: string
          numero_cte?: string
          quantidade?: number | null
          transportadora_id?: string
          updated_at?: string
          user_id?: string
          valor_cte?: number | null
        }
        Relationships: []
      }
      grupos: {
        Row: {
          created_at: string
          deleted_at: string | null
          id: string
          nome: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          deleted_at?: string | null
          id?: string
          nome: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          deleted_at?: string | null
          id?: string
          nome?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      produtos: {
        Row: {
          cotacao_id: string
          created_at: string | null
          deleted_at: string | null
          grupo_id: string | null
          id: string
          nome: string
          peso: string | null
          quantidade: number
          safra_id: string | null
        }
        Insert: {
          cotacao_id: string
          created_at?: string | null
          deleted_at?: string | null
          grupo_id?: string | null
          id?: string
          nome: string
          peso?: string | null
          quantidade?: number
          safra_id?: string | null
        }
        Update: {
          cotacao_id?: string
          created_at?: string | null
          deleted_at?: string | null
          grupo_id?: string | null
          id?: string
          nome?: string
          peso?: string | null
          quantidade?: number
          safra_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "produtos_cotacao_id_fkey"
            columns: ["cotacao_id"]
            isOneToOne: false
            referencedRelation: "cotacoes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "produtos_grupo_id_fkey"
            columns: ["grupo_id"]
            isOneToOne: false
            referencedRelation: "grupos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "produtos_safra_id_fkey"
            columns: ["safra_id"]
            isOneToOne: false
            referencedRelation: "safras"
            referencedColumns: ["id"]
          },
        ]
      }
      safras: {
        Row: {
          created_at: string
          deleted_at: string | null
          id: string
          nome: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          deleted_at?: string | null
          id?: string
          nome: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          deleted_at?: string | null
          id?: string
          nome?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
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
          deleted_at: string | null
          id: string
          nome: string
          prazo: string | null
          proposta_final: string | null
          quantidade_entregue: string | null
          status: string | null
          user_id: string
          valor_total: string | null
          valor_unitario: string | null
        }
        Insert: {
          cotacao_id: string
          created_at?: string | null
          deleted_at?: string | null
          id?: string
          nome: string
          prazo?: string | null
          proposta_final?: string | null
          quantidade_entregue?: string | null
          status?: string | null
          user_id: string
          valor_total?: string | null
          valor_unitario?: string | null
        }
        Update: {
          cotacao_id?: string
          created_at?: string | null
          deleted_at?: string | null
          id?: string
          nome?: string
          prazo?: string | null
          proposta_final?: string | null
          quantidade_entregue?: string | null
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
      transportadoras_cadastros: {
        Row: {
          cnpj: string | null
          created_at: string | null
          deleted_at: string | null
          email1: string | null
          email2: string | null
          id: string
          nome: string
          telefone1: string | null
          telefone2: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          cnpj?: string | null
          created_at?: string | null
          deleted_at?: string | null
          email1?: string | null
          email2?: string | null
          id?: string
          nome: string
          telefone1?: string | null
          telefone2?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          cnpj?: string | null
          created_at?: string | null
          deleted_at?: string | null
          email1?: string | null
          email2?: string | null
          id?: string
          nome?: string
          telefone1?: string | null
          telefone2?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
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
          cliente: string
          cotacao_id: string
          data: string
          destino: string
          origem: string
          proposta_final: number
          status: string
          transportadora: string
          transportadora_id: string
          user_id: string
          valor_efetivo: number
          valor_total: number
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

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
