
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { TruckIcon, ChartBarIcon, LogOut } from "lucide-react";
import { toast } from "sonner";

const Navigation = () => {
  const location = useLocation();
  const currentPath = location.pathname;

  const handleLogout = () => {
    localStorage.removeItem("usuarioLogado");
    toast.success("Logout realizado com sucesso!");
    window.location.href = "/login";
  };

  return (
    <nav className="bg-background border-b py-3 px-4 flex justify-between items-center">
      <div className="flex items-center gap-2">
        <TruckIcon className="h-6 w-6 text-primary" />
        <span className="font-bold text-xl">AgroFarm Fretes</span>
      </div>
      
      <div className="flex items-center gap-4">
        <Link to="/">
          <Button 
            variant={currentPath === "/" ? "default" : "ghost"} 
            className="flex items-center gap-2"
          >
            <TruckIcon className="h-4 w-4" />
            <span>Cotações</span>
          </Button>
        </Link>
        
        <Link to="/reports">
          <Button 
            variant={currentPath === "/reports" ? "default" : "ghost"} 
            className="flex items-center gap-2"
          >
            <ChartBarIcon className="h-4 w-4" />
            <span>Relatórios</span>
          </Button>
        </Link>
        
        <Button 
          variant="outline" 
          className="flex items-center gap-2 ml-2"
          onClick={handleLogout}
        >
          <LogOut className="h-4 w-4" />
          <span>Sair</span>
        </Button>
      </div>
    </nav>
  );
};

export default Navigation;
