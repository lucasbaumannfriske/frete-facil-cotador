import { Link, useLocation } from "react-router-dom";
import {
  TruckIcon,
  ChartBarIcon,
  User,
  ActivityIcon,
  Settings,
  Package,
  Tags,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const navigation = [
  {
    title: "Cotações",
    url: "/",
    icon: TruckIcon,
  },
  {
    title: "Relatórios", 
    url: "/reports",
    icon: ChartBarIcon,
  },
  {
    title: "Transportadoras",
    url: "/transportadoras",
    icon: TruckIcon,
  },
  {
    title: "Usuários",
    url: "/usuarios", 
    icon: User,
  },
  {
    title: "Configurações",
    url: "/configuracoes",
    icon: Settings,
  },
];

export function AppSidebar() {
  const location = useLocation();
  const currentPath = location.pathname;

  const handleLogout = () => {
    localStorage.removeItem("usuarioLogado");
    toast.success("Logout realizado com sucesso!");
    window.location.href = "/login";
  };

  const isActive = (path: string) => currentPath === path;

  return (
    <Sidebar className="border-r">
      <SidebarHeader className="p-4">
        <div className="flex items-center gap-2">
          <TruckIcon className="h-6 w-6 text-primary" />
          <span className="font-bold text-lg">AgroFarm Fretes</span>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Menu Principal</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navigation.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild isActive={isActive(item.url)}>
                    <Link to={item.url} className="flex items-center gap-2">
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-4">
        <Button
          variant="outline"
          className="w-full justify-start"
          onClick={handleLogout}
        >
          <ActivityIcon className="h-4 w-4 mr-2" />
          Sair
        </Button>
      </SidebarFooter>
    </Sidebar>
  );
}