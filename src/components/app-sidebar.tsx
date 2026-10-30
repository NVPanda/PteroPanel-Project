"use client";

import { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { 
  LayoutDashboard, 
  Server, 
  ShoppingCart, 
  Users, 
  Settings, 
  Menu,
  LogOut,
  X,
  ChevronRight
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";

const menuItems = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/" },
  { icon: Server, label: "Serviços", href: "/services" },
  { icon: ShoppingCart, label: "Vendas", href: "/sales" },
  { icon: Users, label: "Usuários", href: "/users" },
  { icon: Settings, label: "Configurações", href: "/settings" },
];

export function AppSidebar() {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    toast.success("Logout realizado");
    router.push("/login");
  };

  const SidebarContent = ({ isMobile = false }: { isMobile?: boolean }) => (
    <div className={cn(
      "flex h-full flex-col bg-card",
      isMobile && "w-72"
    )}>
      {/* Logo - Estilo Telegram */}
      <div className="flex h-16 items-center justify-between px-5 border-b border-border/50">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center">
            <Server className="h-5 w-5 text-white" />
          </div>
          <div>
            <span className="text-lg font-semibold tracking-tight">PainelPro</span>
            <p className="text-[10px] text-muted-foreground -mt-1">Gerenciamento</p>
          </div>
        </div>
        {isMobile && (
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => setIsMobileOpen(false)}
            className="rounded-full h-8 w-8"
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>

      {/* Menu - Estilo Telegram */}
      <div className="flex-1 overflow-auto py-3 px-3">
        <nav className="space-y-1">
          {menuItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <a
                key={item.href}
                href={item.href}
                onClick={() => isMobile && setIsMobileOpen(false)}
                className={cn(
                  "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium telegram-transition",
                  isActive 
                    ? "bg-primary/10 text-primary" 
                    : "text-muted-foreground hover:bg-accent hover:text-foreground"
                )}
              >
                <item.icon className={cn("h-5 w-5", isActive && "text-primary")} />
                <span>{item.label}</span>
                {isActive && (
                  <ChevronRight className="ml-auto h-4 w-4 opacity-50" />
                )}
              </a>
            );
          })}
        </nav>
      </div>

      <Separator className="mx-3 w-auto" />

      {/* User - Estilo Telegram */}
      <div className="p-3">
        <div className="flex items-center gap-3 p-2 rounded-xl hover:bg-accent transition-colors">
          <Avatar className="h-10 w-10 border-2 border-primary/20">
            <AvatarImage src="" />
            <AvatarFallback className="bg-primary/10 text-primary font-medium">
              {user?.name?.charAt(0) || "A"}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">{user?.name || "Admin"}</p>
            <p className="text-xs text-muted-foreground truncate">{user?.email || "admin@exemplo.com"}</p>
          </div>
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={handleLogout}
            className="h-8 w-8 rounded-full opacity-60 hover:opacity-100"
          >
            <LogOut className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );

  // Não mostrar sidebar na tela de login
  if (pathname === "/login" || pathname === "/register") {
    return null;
  }

  return (
    <>
      {/* Botão Mobile */}
      <Button 
        variant="secondary"
        size="icon" 
        onClick={() => setIsMobileOpen(true)}
        className="fixed left-4 top-4 z-50 lg:hidden rounded-full shadow-lg"
      >
        <Menu className="h-5 w-5" />
      </Button>

      {/* Overlay Mobile */}
      {isMobileOpen && (
        <>
          <div 
            className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm lg:hidden"
            onClick={() => setIsMobileOpen(false)}
          />
          <div className="fixed left-0 top-0 z-50 h-full lg:hidden telegram-shadow-lg">
            <SidebarContent isMobile={true} />
          </div>
        </>
      )}

      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex w-72 flex-col border-r border-border/50 bg-card">
        <SidebarContent />
      </aside>
    </>
  );
}