import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface Grupo {
  id: string;
  nome: string;
  user_id: string;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}

export const useGrupos = () => {
  const [grupos, setGrupos] = useState<Grupo[]>([]);
  const [loading, setLoading] = useState(true);

  const carregarGrupos = async () => {
    try {
      const { data, error } = await supabase
        .from("grupos")
        .select("*")
        .is("deleted_at", null)
        .order("nome");

      if (error) throw error;
      setGrupos(data || []);
    } catch (error) {
      console.error("Erro ao carregar grupos:", error);
      toast.error("Erro ao carregar grupos");
    } finally {
      setLoading(false);
    }
  };

  const criarGrupo = async (nome: string) => {
    try {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) throw new Error("Usuário não autenticado");

      const { error } = await supabase
        .from("grupos")
        .insert({
          nome,
          user_id: userData.user.id,
        });

      if (error) throw error;

      toast.success("Grupo criado com sucesso!");
      carregarGrupos();
      return true;
    } catch (error) {
      console.error("Erro ao criar grupo:", error);
      toast.error("Erro ao criar grupo");
      return false;
    }
  };

  const deletarGrupo = async (id: string) => {
    try {
      const { error } = await supabase
        .from("grupos")
        .update({ deleted_at: new Date().toISOString() })
        .eq("id", id);

      if (error) throw error;

      toast.success("Grupo removido com sucesso!");
      carregarGrupos();
      return true;
    } catch (error) {
      console.error("Erro ao deletar grupo:", error);
      toast.error("Erro ao remover grupo");
      return false;
    }
  };

  useEffect(() => {
    carregarGrupos();
  }, []);

  return {
    grupos,
    loading,
    criarGrupo,
    deletarGrupo,
    carregarGrupos,
  };
};