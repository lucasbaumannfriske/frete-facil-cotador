
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Cadastro from "./pages/Cadastro";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

// Inicializar usuário pré-cadastrado
const initializePreregisteredUser = () => {
  // Adiciona o usuário pré-registrado à lista de usuários
  const usuarios = JSON.parse(localStorage.getItem("usuarios") || "[]");
  const preregisteredUser = {
    nome: "Lucas Friske",
    email: "lucasfriske@agrofarm.net.br"
  };
  
  // Verifica se o usuário já existe na lista
  if (!usuarios.some((user: any) => user.email === preregisteredUser.email)) {
    usuarios.push(preregisteredUser);
    localStorage.setItem("usuarios", JSON.stringify(usuarios));
  }
};

// Initialize on app load
initializePreregisteredUser();

// Protective wrapper to check login status
const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
  const isAuthenticated = localStorage.getItem("usuarioLogado") !== null;
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  return children;
};

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const checkAuth = () => {
      const auth = localStorage.getItem("usuarioLogado") !== null;
      setIsAuthenticated(auth);
    };
    
    checkAuth();
    
    // Listen for storage changes (in case of login/logout in another tab)
    window.addEventListener("storage", checkAuth);
    
    return () => {
      window.removeEventListener("storage", checkAuth);
    };
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route 
              path="/" 
              element={
                <ProtectedRoute>
                  <Index />
                </ProtectedRoute>
              } 
            />
            <Route path="/login" element={<Login />} />
            <Route path="/cadastro" element={<Cadastro />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
