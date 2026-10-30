"use client";

import { useState, useEffect } from "react";
import { 
  Server, 
  Play, 
  Square, 
  Settings, 
  Trash2, 
  Plus,
  Cpu,
  HardDrive,
  Globe
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";

interface Service {
  id: number;
  name: string;
  type: string;
  status: "running" | "stopped" | "error";
  memory: number;
  cpu: number;
  uptime: string;
}

export default function ServicesPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [newService, setNewService] = useState({ name: "", type: "minecraft" });

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      const res = await fetch("/api/services");
      const data = await res.json();
      // Simular dados extras
      setServices(data.map((s: any) => ({
        ...s,
        cpu: Math.floor(Math.random() * 60) + 10,
        uptime: "2d 4h 32m"
      })));
    } catch (e) {
      // Dados mock para demonstração
      setServices([
        { id: 1, name: "Servidor Minecraft #1", type: "minecraft", status: "running", memory: 2048, cpu: 45, uptime: "5d 2h 15m" },
        { id: 2, name: "Servidor Web Nginx", type: "nginx", status: "running", memory: 512, cpu: 12, uptime: "12d 8h 42m" },
        { id: 3, name: "Bot Discord", type: "nodejs", status: "stopped", memory: 256, cpu: 0, uptime: "-" },
        { id: 4, name: "Database Postgres", type: "database", status: "running", memory: 1024, cpu: 25, uptime: "15d 6h 20m" },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateService = async () => {
    try {
      const res = await fetch("/api/services", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...newService, userId: 1 }),
      });
      if (res.ok) {
        toast.success("Serviço criado com sucesso!");
        fetchServices();
      }
    } catch (e) {
      toast.error("Erro ao criar serviço");
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "running": return "bg-green-500";
      case "stopped": return "bg-gray-400";
      case "error": return "bg-red-500";
      default: return "bg-gray-400";
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "minecraft": return <Gamepad2 className="h-5 w-5" />;
      case "nginx": return <Globe className="h-5 w-5" />;
      case "nodejs": return <Code className="h-5 w-5" />;
      case "database": return <HardDrive className="h-5 w-5" />;
      default: return <Server className="h-5 w-5" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Serviços</h1>
          <p className="text-muted-foreground mt-0.5">
            Gerencie seus servidores e aplicações
          </p>
        </div>
        
        <Dialog>
          <DialogTrigger asChild>
            <Button className="rounded-full">
              <Plus className="h-4 w-4 mr-2" />
              Novo Serviço
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md rounded-2xl">
            <DialogHeader>
              <DialogTitle>Criar Novo Serviço</DialogTitle>
              <DialogDescription>
                Configure um novo servidor ou aplicação
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>Nome do Serviço</Label>
                <Input 
                  placeholder="Meu Servidor"
                  value={newService.name}
                  onChange={(e) => setNewService({...newService, name: e.target.value})}
                  className="rounded-xl"
                />
              </div>
              <div className="space-y-2">
                <Label>Tipo</Label>
                <Select 
                  value={newService.type}
                  onValueChange={(v) => setNewService({...newService, type: v})}
                >
                  <SelectTrigger className="rounded-xl">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="minecraft">Minecraft Server</SelectItem>
                    <SelectItem value="nginx">Nginx Web</SelectItem>
                    <SelectItem value="nodejs">Node.js App</SelectItem>
                    <SelectItem value="database">PostgreSQL</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button onClick={handleCreateService} className="w-full rounded-xl">
                Criar Serviço
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4">
        {services.map((service) => (
          <Card key={service.id} className="border-0 telegram-shadow hover:shadow-md transition-shadow">
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-primary/10 rounded-xl">
                    {getTypeIcon(service.type)}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold">{service.name}</h3>
                      <div className={cn("h-2 w-2 rounded-full", getStatusColor(service.status))} />
                    </div>
                    <p className="text-sm text-muted-foreground capitalize">{service.type}</p>
                  </div>
                </div>

                <div className="flex items-center gap-6">
                  {/* Stats */}
                  <div className="hidden md:flex items-center gap-6 text-sm">
                    <div className="flex items-center gap-2">
                      <Cpu className="h-4 w-4 text-muted-foreground" />
                      <span>{service.cpu}%</span>
                      <Progress value={service.cpu} className="w-16 h-1.5" />
                    </div>
                    <div className="flex items-center gap-2">
                      <HardDrive className="h-4 w-4 text-muted-foreground" />
                      <span>{service.memory} MB</span>
                    </div>
                    <div className="text-muted-foreground min-w-[100px]">
                      {service.uptime}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2">
                    <Button 
                      variant="outline" 
                      size="icon" 
                      className={cn(
                        "rounded-full",
                        service.status === "running" ? "text-green-600 border-green-200" : ""
                      )}
                    >
                      {service.status === "running" ? (
                        <Square className="h-4 w-4" />
                      ) : (
                        <Play className="h-4 w-4" />
                      )}
                    </Button>
                    <Button variant="outline" size="icon" className="rounded-full">
                      <Settings className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="icon" className="rounded-full text-destructive hover:text-destructive">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

// Icons extras
function Gamepad2(props: any) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="6" x2="10" y1="12" y2="12"/><line x1="8" x2="8" y1="10" y2="14"/><line x1="15" x2="15.01" y1="13" y2="13"/><line x1="18" x2="18.01" y1="10" y2="10"/><path d="M17.32 5H6.68a4 4 0 0 0-3.978 3.59c-.006.052-.01.101-.017.152C2.604 9.416 2 14.456 2 16a3 3 0 0 0 3 3c1 0 1.5-.5 2-1l1.414-1.414A2 2 0 0 1 9.828 16h4.344a2 2 0 0 1 1.414.586L17 18c.5.5 1 1 2 1a3 3 0 0 0 3-3c0-1.545-.604-6.584-.685-8.258a4 4 0 0 0-3.978-3.59z"/></svg>
  );
}

function Code(props: any) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>
  );
}

function cn(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(" ");
}