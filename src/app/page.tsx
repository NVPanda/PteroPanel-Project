"use client";

import { useEffect, useState } from "react";
import { 
  Users, 
  DollarSign, 
  Server, 
  Activity,
  TrendingUp,
  TrendingDown,
  MoreHorizontal
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

interface Stats {
  users: number;
  sales: number;
  revenue: number;
  services: number;
  usersChange: number;
  revenueChange: number;
}

interface Activity {
  id: number;
  type: "service" | "sale" | "user";
  message: string;
  time: string;
  user: string;
}

export default function DashboardPage() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Verificar autenticação
    const token = localStorage.getItem("token");
    if (!token) {
      window.location.href = "/login";
      return;
    }

    fetch("/api/dashboard/stats")
      .then((res) => res.json())
      .then((data) => {
        setStats(data);
        setLoading(false);
      });

    // Simular atividades
    setActivities([
      { id: 1, type: "service", message: "Servidor Minecraft iniciado", time: "2 min atrás", user: "João" },
      { id: 2, type: "sale", message: "Venda de 100 tokens", time: "15 min atrás", user: "Maria" },
      { id: 3, type: "user", message: "Novo usuário registrado", time: "1 hora atrás", user: "Pedro" },
      { id: 4, type: "service", message: "Backup automático concluído", time: "2 horas atrás", user: "Sistema" },
    ]);
  }, []);

  const statCards = [
    {
      title: "Usuários",
      value: stats?.users ?? 0,
      change: "+12%",
      trend: "up",
      icon: Users,
      color: "bg-blue-500",
    },
    {
      title: "Receita",
      value: `R$ ${(stats?.revenue ?? 0).toFixed(2)}`,
      change: "+8%",
      trend: "up",
      icon: DollarSign,
      color: "bg-green-500",
    },
    {
      title: "Serviços",
      value: stats?.services ?? 0,
      change: "-2%",
      trend: "down",
      icon: Server,
      color: "bg-purple-500",
    },
    {
      title: "Vendas",
      value: stats?.sales ?? 0,
      change: "+23%",
      trend: "up",
      icon: Activity,
      color: "bg-orange-500",
    },
  ];

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "service": return <Server className="h-4 w-4" />;
      case "sale": return <DollarSign className="h-4 w-4" />;
      case "user": return <Users className="h-4 w-4" />;
      default: return <Activity className="h-4 w-4" />;
    }
  };

  const getActivityColor = (type: string) => {
    switch (type) {
      case "service": return "bg-blue-100 text-blue-600";
      case "sale": return "bg-green-100 text-green-600";
      case "user": return "bg-purple-100 text-purple-600";
      default: return "bg-gray-100 text-gray-600";
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground mt-0.5">
            Visão geral do seu sistema
          </p>
        </div>
        <Button variant="outline" size="sm" className="rounded-full">
          <MoreHorizontal className="h-4 w-4 mr-2" />
          Ações
        </Button>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {statCards.map((card) => (
          <Card key={card.title} className="border-0 telegram-shadow">
            <CardContent className="p-5">
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  <p className="text-sm font-medium text-muted-foreground">
                    {card.title}
                  </p>
                  <div className="flex items-baseline gap-2">
                    <h3 className="text-2xl font-bold">
                      {loading ? (
                        <div className="h-8 w-20 animate-pulse rounded bg-muted" />
                      ) : (
                        card.value
                      )}
                    </h3>
                    {!loading && (
                      <span className={cn(
                        "text-xs font-medium flex items-center",
                        card.trend === "up" ? "text-green-600" : "text-red-600"
                      )}>
                        {card.trend === "up" ? (
                          <TrendingUp className="h-3 w-3 mr-0.5" />
                        ) : (
                          <TrendingDown className="h-3 w-3 mr-0.5" />
                        )}
                        {card.change}
                      </span>
                    )}
                  </div>
                </div>
                <div className={cn("p-2.5 rounded-xl", card.color.replace("bg-", "bg-opacity-10 bg-"))}>
                  <card.icon className={cn("h-5 w-5", card.color.replace("bg-", "text-"))} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Content Grid */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Atividades Recentes */}
        <Card className="lg:col-span-2 border-0 telegram-shadow">
          <CardHeader className="pb-4">
            <CardTitle className="text-base font-semibold">Atividades Recentes</CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="space-y-4">
              {activities.map((activity) => (
                <div key={activity.id} className="flex items-start gap-4 p-3 rounded-xl hover:bg-accent/50 transition-colors">
                  <div className={cn("p-2 rounded-lg", getActivityColor(activity.type))}>
                    {getActivityIcon(activity.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium">{activity.message}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      por {activity.user} • {activity.time}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Status do Sistema */}
        <Card className="border-0 telegram-shadow">
          <CardHeader className="pb-4">
            <CardTitle className="text-base font-semibold">Status do Sistema</CardTitle>
          </CardHeader>
          <CardContent className="pt-0 space-y-4">
            {[
              { name: "API", status: "online", latency: "45ms" },
              { name: "Banco de Dados", status: "online", latency: "12ms" },
              { name: "Containers", status: "online", count: "3 ativos" },
              { name: "Cache Redis", status: "online", latency: "2ms" },
            ].map((service) => (
              <div key={service.name} className="flex items-center justify-between p-3 rounded-xl bg-secondary/30">
                <div className="flex items-center gap-3">
                  <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
                  <span className="text-sm font-medium">{service.name}</span>
                </div>
                <Badge variant="secondary" className="text-xs rounded-full">
                  {service.latency || service.count}
                </Badge>
              </div>
            ))}
            
            <div className="pt-4 border-t">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Uptime</span>
                <span className="font-medium">99.9%</span>
              </div>
              <div className="flex items-center justify-between text-sm mt-2">
                <span className="text-muted-foreground">Versão</span>
                <span className="font-medium">v2.1.0</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

// Helper
function cn(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(" ");
}