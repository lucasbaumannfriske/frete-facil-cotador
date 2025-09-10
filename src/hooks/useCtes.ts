import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface CTE {
  id: string;
  cotacao_id: string;
  transportadora_id: string;
  user_id: string;
  numero_cte: string;
  arquivo_url?: string;
  arquivo_nome?: string;
  created_at: string;
  updated_at: string;
}

export const useCtes = (cotacaoId?: string, transportadoraId?: string) => {
  const [ctes, setCtes] = useState<CTE[]>([]);
  const [loading, setLoading] = useState(true);

  const carregarCtes = async () => {
    if (!cotacaoId || !transportadoraId) {
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from("ctes")
        .select("*")
        .eq("cotacao_id", cotacaoId)
        .eq("transportadora_id", transportadoraId)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setCtes(data || []);
    } catch (error) {
      console.error("Erro ao carregar CTEs:", error);
      toast.error("Erro ao carregar CTEs");
    } finally {
      setLoading(false);
    }
  };

  const criarCte = async (numeroCte: string, arquivo?: File) => {
    try {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) throw new Error("Usuário não autenticado");
      if (!cotacaoId || !transportadoraId) throw new Error("Cotação ou transportadora não especificada");

      let arquivoUrl = null;
      let arquivoNome = null;

      // Upload do arquivo se fornecido
      if (arquivo) {
        const fileExt = arquivo.name.split(".").pop();
        const fileName = `${userData.user.id}/${cotacaoId}/${transportadoraId}/${Date.now()}.${fileExt}`;
        
        const { error: uploadError, data: uploadData } = await supabase.storage
          .from("cte-files")
          .upload(fileName, arquivo);

        if (uploadError) throw uploadError;

        arquivoUrl = uploadData.path;
        arquivoNome = arquivo.name;
      }

      const { error } = await supabase
        .from("ctes")
        .insert({
          cotacao_id: cotacaoId,
          transportadora_id: transportadoraId,
          user_id: userData.user.id,
          numero_cte: numeroCte,
          arquivo_url: arquivoUrl,
          arquivo_nome: arquivoNome,
        });

      if (error) throw error;

      toast.success("CTE adicionado com sucesso!");
      carregarCtes();
      return true;
    } catch (error) {
      console.error("Erro ao criar CTE:", error);
      toast.error("Erro ao adicionar CTE");
      return false;
    }
  };

  const deletarCte = async (id: string) => {
    try {
      // Buscar o CTE para obter a URL do arquivo
      const { data: cte } = await supabase
        .from("ctes")
        .select("arquivo_url")
        .eq("id", id)
        .single();

      // Deletar o arquivo do storage se existir
      if (cte?.arquivo_url) {
        await supabase.storage
          .from("cte-files")
          .remove([cte.arquivo_url]);
      }

      // Deletar o registro do CTE
      const { error } = await supabase
        .from("ctes")
        .delete()
        .eq("id", id);

      if (error) throw error;

      toast.success("CTE removido com sucesso!");
      carregarCtes();
      return true;
    } catch (error) {
      console.error("Erro ao deletar CTE:", error);
      toast.error("Erro ao remover CTE");
      return false;
    }
  };

  const baixarArquivo = async (arquivoUrl: string, nomeArquivo: string) => {
    try {
      const { data, error } = await supabase.storage
        .from("cte-files")
        .download(arquivoUrl);

      if (error) throw error;

      // Criar URL para download
      const url = URL.createObjectURL(data);
      const a = document.createElement("a");
      a.style.display = "none";
      a.href = url;
      a.download = nomeArquivo;
      document.body.appendChild(a);
      a.click();
      URL.revokeObjectURL(url);
      document.body.removeChild(a);

      toast.success("Download iniciado!");
    } catch (error) {
      console.error("Erro ao baixar arquivo:", error);
      toast.error("Erro ao baixar arquivo");
    }
  };

  useEffect(() => {
    carregarCtes();
  }, [cotacaoId, transportadoraId]);

  return {
    ctes,
    loading,
    criarCte,
    deletarCte,
    baixarArquivo,
    carregarCtes,
  };
};