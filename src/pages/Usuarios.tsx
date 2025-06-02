
import Navigation from "@/components/Navigation";
import GerenciadorUsuarios from "@/components/GerenciadorUsuarios";
import { Card, CardContent } from "@/components/ui/card";
import { User } from "lucide-react";

const Usuarios = () => {
  return (
    <div>
      <Navigation />
      <div className="container max-w-6xl py-8">
        <div className="flex items-center justify-center gap-3 mb-6">
          <User className="h-8 w-8 text-primary" />
          <h1 className="text-3xl font-bold text-center">Gerenciar Usuários</h1>
        </div>

        <Card className="border-t-4 border-t-primary shadow-md">
          <CardContent className="p-6">
            <GerenciadorUsuarios />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Usuarios;
