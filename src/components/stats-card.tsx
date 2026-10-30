"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, DollarSign, Server, Activity } from "lucide-react";

interface Stats {
  users: number;
  sales: number;
  revenue: number;
  services: number;
}

export function StatsCards() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/dashboard/stats")
      .then((res) => res.json())
      .then((data) => {
        setStats(data);
        setLoading(false);
      });
  }, []);

  const cards = [
    {
      title: "Usuários Totais",
      value: stats?.users ?? 0,
      icon: Users,
      color: "text-blue-500",
    },
    {
      title: "Receita Total",
      value: `R$ ${(stats?.revenue ?? 0).toFixed(2)}`,
      icon: DollarSign,
      color: "text-green-500",
    },
    {
      title: "Serviços Ativos",
      value: stats?.services ?? 0,
      icon: Server,
      color: "text-purple-500",
    },
    {
      title: "Vendas",
      value: stats?.sales ?? 0,
      icon: Activity,
      color: "text-orange-500",
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {cards.map((card) => (
        <Card key={card.title}>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {card.title}
            </CardTitle>
            <card.icon className={`h-4 w-4 ${card.color}`} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {loading ? (
                <div className="h-8 w-24 animate-pulse rounded bg-muted" />
              ) : (
                card.value
              )}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Atualizado agora
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}