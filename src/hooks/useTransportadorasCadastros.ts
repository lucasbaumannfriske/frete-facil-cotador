
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface TransportadoraCadastro {
  id: string;
  nome: string;
  email1: string;
  email2: string;
  telefone1: string;
  telefone2: string;
  cnpj?: string;
  created_at?: string;
  updated_at?: string;
}

export function useTransportadorasCadastros() {
  const queryClient = useQueryClient();

  const { data, isLoading, error } = useQuery({
    queryKey: ["transportadoras-cadastros"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("transportadoras_cadastros")
        .select("*")
        .order("nome", { ascending: true })
        .is("deleted_at", null);
      if (error) throw error;
      return data as TransportadoraCadastro[];
    }
  });

  const addMutation = useMutation({
    mutationFn: async (novo: Omit<TransportadoraCadastro, "id" | "created_at" | "updated_at">) => {
      const user = supabase.auth.getUser ? (await supabase.auth.getUser()).data.user : undefined;
      if (!user) throw new Error("Usuário não autenticado");
      const toInsert = {
        ...novo,
        user_id: user.id,
      };
      const { error } = await supabase.from("transportadoras_cadastros").insert([toInsert]);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Transportadora cadastrada com sucesso!");
      queryClient.invalidateQueries({ queryKey: ["transportadoras-cadastros"] });
    },
    onError: (err: any) => {
      toast.error("Erro ao cadastrar: " + err.message);
    }
  });

  const updateMutation = useMutation({
    mutationFn: async (update: TransportadoraCadastro) => {
      const { id, ...fields } = update;
      const { error } = await supabase
        .from("transportadoras_cadastros")
        .update(fields)
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Transportadora atualizada!");
      queryClient.invalidateQueries({ queryKey: ["transportadoras-cadastros"] });
    },
    onError: (err: any) => {
      toast.error("Erro ao atualizar: " + err.message);
    }
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("transportadoras_cadastros")
        .update({ deleted_at: new Date().toISOString() })
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.info("Transportadora removida.");
      queryClient.invalidateQueries({ queryKey: ["transportadoras-cadastros"] });
    },
    onError: (err: any) => {
      toast.error("Erro ao remover: " + err.message);
    }
  });

  return {
    transportadoras: data || [],
    isLoading,
    error,
    addTransportadora: addMutation.mutateAsync,
    updateTransportadora: updateMutation.mutateAsync,
    deleteTransportadora: deleteMutation.mutateAsync
  };
}
