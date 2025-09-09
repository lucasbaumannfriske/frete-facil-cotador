import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface Safra {
  id: string;
  nome: string;
  user_id: string;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}

export const useSafras = () => {
  const [safras, setSafras] = useState<Safra[]>([]);
  const [loading, setLoading] = useState(true);

  const carregarSafras = async () => {
    try {
      const { data, error } = await supabase
        .from("safras")
        .select("*")
        .is("deleted_at", null)
        .order("nome");

      if (error) throw error;
      setSafras(data || []);
    } catch (error) {
      console.error("Erro ao carregar safras:", error);
      toast.error("Erro ao carregar safras");
    } finally {
      setLoading(false);
    }
  };

  const criarSafra = async (nome: string) => {
    try {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) throw new Error("Usuário não autenticado");

      const { error } = await supabase
        .from("safras")
        .insert({
          nome,
          user_id: userData.user.id,
        });

      if (error) throw error;

      toast.success("Safra criada com sucesso!");
      carregarSafras();
      return true;
    } catch (error) {
      console.error("Erro ao criar safra:", error);
      toast.error("Erro ao criar safra");
      return false;
    }
  };

  const deletarSafra = async (id: string) => {
    try {
      const { error } = await supabase
        .from("safras")
        .update({ deleted_at: new Date().toISOString() })
        .eq("id", id);

      if (error) throw error;

      toast.success("Safra removida com sucesso!");
      carregarSafras();
      return true;
    } catch (error) {
      console.error("Erro ao deletar safra:", error);
      toast.error("Erro ao remover safra");
      return false;
    }
  };

  useEffect(() => {
    carregarSafras();
  }, []);

  return {
    safras,
    loading,
    criarSafra,
    deletarSafra,
    carregarSafras,
  };
};