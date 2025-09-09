import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Trash2, Plus } from "lucide-react";
import { useGrupos } from "@/hooks/useGrupos";

const GruposGestao = () => {
  const { grupos, loading, criarGrupo, deletarGrupo } = useGrupos();
  const [novoGrupo, setNovoGrupo] = useState("");

  const handleCriar = async () => {
    if (!novoGrupo.trim()) return;
    
    const sucesso = await criarGrupo(novoGrupo.trim());
    if (sucesso) {
      setNovoGrupo("");
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Gestão de Grupos</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-2">
          <Input
            placeholder="Nome do grupo"
            value={novoGrupo}
            onChange={(e) => setNovoGrupo(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleCriar()}
          />
          <Button onClick={handleCriar} disabled={!novoGrupo.trim()}>
            <Plus className="h-4 w-4 mr-2" />
            Adicionar
          </Button>
        </div>

        {loading ? (
          <p>Carregando grupos...</p>
        ) : (
          <div className="space-y-2">
            {grupos.length === 0 ? (
              <p className="text-muted-foreground">Nenhum grupo cadastrado</p>
            ) : (
              grupos.map((grupo) => (
                <div key={grupo.id} className="flex items-center justify-between p-2 border rounded">
                  <Badge variant="outline">{grupo.nome}</Badge>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => deletarGrupo(grupo.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default GruposGestao;