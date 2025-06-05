
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { TruckIcon, LogIn } from "lucide-react";
import { toast } from "sonner";

const Login = () => {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [loading, setLoading] = useState(false);
  
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !senha) {
      toast.error("Preencha todos os campos");
      return;
    }

    setLoading(true);
    
    // Simular login - no futuro, isto seria substituído por uma conexão com backend/supabase
    setTimeout(() => {
      // Verificar usuários pré-cadastrados primeiro
      if ((email === "admin@exemplo.com" && senha === "12345") || 
          (email === "lucasfriske@agrofarm.net.br" && senha === "Nexus@4202")) {
        
        // Determina o nome baseado no email
        const nome = email === "admin@exemplo.com" ? "Administrador" : "Lucas Friske";
        
        localStorage.setItem("usuarioLogado", JSON.stringify({ email, nome }));
        toast.success("Login realizado com sucesso!");
        navigate("/");
        setLoading(false);
        return;
      }
      
      // Verificar usuários cadastrados no sistema
      const usuarios = JSON.parse(localStorage.getItem("usuarios") || "[]");
      const usuarioEncontrado = usuarios.find((user: any) => user.email === email);
      
      if (usuarioEncontrado) {
        // Para usuários cadastrados, vamos aceitar qualquer senha por simplicidade
        // Em um sistema real, a senha seria verificada contra um hash
        localStorage.setItem("usuarioLogado", JSON.stringify({ email, nome: usuarioEncontrado.nome }));
        toast.success("Login realizado com sucesso!");
        navigate("/");
      } else {
        toast.error("Email ou senha incorretos");
      }
      
      setLoading(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/10 p-4">
      <div className="w-full max-w-md">
        <div className="flex flex-col items-center justify-center mb-8">
          <TruckIcon className="h-12 w-12 text-primary mb-2" />
          <h1 className="text-2xl font-bold text-center">Planilha de Cotação de Frete</h1>
          <p className="text-sm text-muted-foreground mt-1">Entre para gerenciar suas cotações</p>
        </div>
        
        <Card className="border-t-4 border-t-primary shadow-md">
          <CardContent className="pt-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1">
                <label htmlFor="email" className="text-sm font-medium">
                  Email
                </label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="seu@email.com"
                  required
                />
              </div>
              
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <label htmlFor="senha" className="text-sm font-medium">
                    Senha
                  </label>
                  <a href="#" className="text-xs text-primary hover:underline">
                    Esqueceu a senha?
                  </a>
                </div>
                <Input
                  id="senha"
                  type="password"
                  value={senha}
                  onChange={(e) => setSenha(e.target.value)}
                  placeholder="********"
                  required
                />
              </div>
              
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Entrando..." : (
                  <>
                    <LogIn className="h-4 w-4 mr-2" />
                    Entrar
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Login;
