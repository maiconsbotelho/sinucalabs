"use client";

import { useState, useEffect } from "react";

export default function SystemStatus() {
  const [currentTime, setCurrentTime] = useState<string>("");
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    // Marca que estamos no cliente
    setIsClient(true);
    
    // Só atualiza o tempo no cliente após hidratação com formato consistente
    const formatTime = (date: Date) => {
      return date.toLocaleTimeString('pt-BR', { 
        hour12: false,
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      });
    };
    
    setCurrentTime(formatTime(new Date()));
    
    // Opcional: atualizar a cada minuto
    const interval = setInterval(() => {
      setCurrentTime(formatTime(new Date()));
    }, 60000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="text-center py-3">
      <div className="font-mono text-xs text-retro-cyan/40 tracking-wider">
        RANKING.SYSTEM.ONLINE • LAST_UPDATE: {isClient ? currentTime : "..."}
      </div>
      <div className="w-24 h-px bg-gradient-to-r from-transparent via-retro-cyan/30 to-transparent mx-auto mt-1"></div>
    </div>
  );
}