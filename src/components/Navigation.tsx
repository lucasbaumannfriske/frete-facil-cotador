
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { TruckIcon, ChartBarIcon, LogOut, User, ActivityIcon } from "lucide-react";
import { toast } from "sonner";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import LogsAuditoria from "@/components/LogsAuditoria";

const Navigation = () => {
  const location = useLocation();
  const currentPath = location.pathname;
  const [logsOpen, setLogsOpen] = useState(false);

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

        <Link to="/usuarios">
          <Button 
            variant={currentPath === "/usuarios" ? "default" : "ghost"} 
            className="flex items-center gap-2"
          >
            <User className="h-4 w-4" />
            <span>Usuários</span>
          </Button>
        </Link>
        
        <Dialog open={logsOpen} onOpenChange={setLogsOpen}>
          <DialogTrigger asChild>
            <Button 
              variant="ghost" 
              className="flex items-center gap-2"
            >
              <ActivityIcon className="h-4 w-4" />
              <span>Logs</span>
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[80vh]">
            <DialogHeader>
              <DialogTitle>Logs de Auditoria</DialogTitle>
            </DialogHeader>
            <LogsAuditoria />
          </DialogContent>
        </Dialog>
        
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
