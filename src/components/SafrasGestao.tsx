import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Trash2, Plus } from "lucide-react";
import { useSafras } from "@/hooks/useSafras";

const SafrasGestao = () => {
  const { safras, loading, criarSafra, deletarSafra } = useSafras();
  const [novaSafra, setNovaSafra] = useState("");

  const handleCriar = async () => {
    if (!novaSafra.trim()) return;
    
    const sucesso = await criarSafra(novaSafra.trim());
    if (sucesso) {
      setNovaSafra("");
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Gestão de Safras</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-2">
          <Input
            placeholder="Nome da safra"
            value={novaSafra}
            onChange={(e) => setNovaSafra(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleCriar()}
          />
          <Button onClick={handleCriar} disabled={!novaSafra.trim()}>
            <Plus className="h-4 w-4 mr-2" />
            Adicionar
          </Button>
        </div>

        {loading ? (
          <p>Carregando safras...</p>
        ) : (
          <div className="space-y-2">
            {safras.length === 0 ? (
              <p className="text-muted-foreground">Nenhuma safra cadastrada</p>
            ) : (
              safras.map((safra) => (
                <div key={safra.id} className="flex items-center justify-between p-2 border rounded">
                  <Badge variant="outline">{safra.nome}</Badge>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => deletarSafra(safra.id)}
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

export default SafrasGestao;