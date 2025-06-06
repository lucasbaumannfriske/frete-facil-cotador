
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { TruckIcon, LogIn } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

const Login = () => {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [loading, setLoading] = useState(false);
  
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !senha) {
      toast.error("Preencha todos os campos");
      return;
    }

    setLoading(true);
    
    try {
      console.log('Tentando fazer login com:', email);
      
      // Tentar login com Supabase Auth
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password: senha,
      });

      if (error) {
        console.error('Erro no login Supabase:', error);
        throw error;
      }

      if (data.user) {
        console.log('Login bem-sucedido:', data.user);
        
        // Verificar se o usuário existe na tabela system_users
        const { data: systemUser } = await supabase
          .from('system_users')
          .select('*')
          .eq('email', data.user.email)
          .single();

        if (!systemUser) {
          // Se não existir, criar entrada na tabela system_users
          console.log('Criando entrada na tabela system_users...');
          const { error: insertError } = await supabase
            .from('system_users')
            .insert({
              nome: data.user.user_metadata?.nome || data.user.email?.split('@')[0] || 'Usuário',
              email: data.user.email!,
              created_by: data.user.id
            });

          if (insertError) {
            console.error('Erro ao criar entrada system_users:', insertError);
          }
        }

        // Salvar dados do usuário no localStorage para compatibilidade
        const nome = systemUser?.nome || data.user.user_metadata?.nome || data.user.email?.split('@')[0] || "Usuário";
        localStorage.setItem("usuarioLogado", JSON.stringify({ 
          email: data.user.email, 
          nome,
          id: data.user.id 
        }));
        
        toast.success("Login realizado com sucesso!");
        navigate("/");
      }
    } catch (error: any) {
      console.error('Erro no login:', error);
      toast.error(error.message || "Email ou senha incorretos");
    } finally {
      setLoading(false);
    }
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
