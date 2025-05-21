
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { TruckIcon, UserPlus } from "lucide-react";
import { toast } from "sonner";

const Cadastro = () => {
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [confirmSenha, setConfirmSenha] = useState("");
  const [loading, setLoading] = useState(false);
  
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!nome || !email || !senha || !confirmSenha) {
      toast.error("Preencha todos os campos");
      return;
    }

    if (senha !== confirmSenha) {
      toast.error("As senhas não correspondem");
      return;
    }

    if (senha.length < 6) {
      toast.error("A senha deve ter pelo menos 6 caracteres");
      return;
    }

    // Verifica se é o email pré-cadastrado
    if (email === "lucasfriske@agrofarm.net.br") {
      toast.error("Este email já está cadastrado. Por favor, faça login.");
      navigate("/login");
      return;
    }

    setLoading(true);
    
    // Simular cadastro - no futuro, isto seria substituído por uma conexão com backend/supabase
    setTimeout(() => {
      // Armazenar usuários cadastrados no localStorage - seria substituído por banco de dados
      const usuarios = JSON.parse(localStorage.getItem("usuarios") || "[]");
      
      // Verifica se o email já está cadastrado
      if (usuarios.some((user: any) => user.email === email)) {
        toast.error("Este email já está cadastrado");
        setLoading(false);
        return;
      }
      
      // Adiciona novo usuário
      usuarios.push({ nome, email });
      localStorage.setItem("usuarios", JSON.stringify(usuarios));
      
      toast.success("Cadastro realizado com sucesso!");
      navigate("/login");
      setLoading(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/10 p-4">
      <div className="w-full max-w-md">
        <div className="flex flex-col items-center justify-center mb-8">
          <TruckIcon className="h-12 w-12 text-primary mb-2" />
          <h1 className="text-2xl font-bold text-center">Planilha de Cotação de Frete</h1>
          <p className="text-sm text-muted-foreground mt-1">Crie sua conta para começar</p>
        </div>
        
        <Card className="border-t-4 border-t-primary shadow-md">
          <CardContent className="pt-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1">
                <label htmlFor="nome" className="text-sm font-medium">
                  Nome completo
                </label>
                <Input
                  id="nome"
                  type="text"
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                  placeholder="Seu nome completo"
                  required
                />
              </div>
              
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
                <label htmlFor="senha" className="text-sm font-medium">
                  Senha
                </label>
                <Input
                  id="senha"
                  type="password"
                  value={senha}
                  onChange={(e) => setSenha(e.target.value)}
                  placeholder="********"
                  required
                />
              </div>
              
              <div className="space-y-1">
                <label htmlFor="confirmSenha" className="text-sm font-medium">
                  Confirme a senha
                </label>
                <Input
                  id="confirmSenha"
                  type="password"
                  value={confirmSenha}
                  onChange={(e) => setConfirmSenha(e.target.value)}
                  placeholder="********"
                  required
                />
              </div>
              
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Cadastrando..." : (
                  <>
                    <UserPlus className="h-4 w-4 mr-2" />
                    Criar conta
                  </>
                )}
              </Button>
              
              <div className="text-center text-sm">
                <span className="text-muted-foreground">
                  Já tem uma conta?{" "}
                </span>
                <Link to="/login" className="text-primary hover:underline font-medium">
                  Entrar
                </Link>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Cadastro;
