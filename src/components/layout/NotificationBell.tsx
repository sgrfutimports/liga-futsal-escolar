import { useState, useEffect } from 'react';
import { Bell, BellOff, CheckCircle2, ShieldAlert } from 'lucide-react';
import { cn } from '@/src/lib/utils';
import { supabase } from '@/src/lib/supabase';

export default function NotificationBell() {
  const [permission, setPermission] = useState<NotificationPermission>(
    typeof Notification !== 'undefined' ? Notification.permission : 'default'
  );
  const [isHovered, setIsHovered] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (typeof Notification !== 'undefined') {
       setPermission(Notification.permission);
    }
  }, []);

  const requestPermission = async () => {
    if (!('Notification' in window)) {
      alert('Este navegador não suporta notificações.');
      return;
    }

    setLoading(true);
    try {
      const result = await Notification.requestPermission();
      setPermission(result);

      if (result === 'granted') {
        const registration = await navigator.serviceWorker.ready;
        const subscription = await registration.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: 'BIAhX5Y8N_Gv9R8ZqLzQWpY_RkYJtV7XyF8N6H9W5X1' // Placeholder VAPID Key
        });

        // Salvar no Supabase
        await supabase.from('lfe_push_subscriptions').upsert({
          endpoint: subscription.endpoint,
          auth_keys: JSON.stringify(subscription.toJSON().keys),
          created_at: new Date().toISOString()
        });

        console.log('Inscrição realizada com sucesso!');
      }
    } catch (error) {
      console.error('Erro ao pedir permissão:', error);
    } finally {
      setLoading(false);
    }
  };

  if (permission === 'denied') {
    return (
      <button className="relative p-2 text-gray-600 cursor-not-allowed group" title="Notificações Bloqueadas">
        <BellOff className="w-5 h-5" />
        <div className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full border border-dark"></div>
      </button>
    );
  }

  return (
    <div className="relative">
      <button 
        onClick={permission === 'default' ? requestPermission : undefined}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className={cn(
          "relative p-2 rounded-xl transition-all duration-300 flex items-center justify-center overflow-hidden",
          permission === 'granted' 
            ? "text-primary hover:bg-primary/10" 
            : "text-gray-400 hover:text-white hover:bg-white/5",
          loading && "animate-pulse"
        )}
      >
        {permission === 'granted' ? (
          <Bell className="w-5 h-5 fill-current" />
        ) : (
          <Bell className="w-5 h-5" />
        )}
        
        {permission === 'default' && (
           <div className="absolute top-1.5 right-1.5 w-2 h-2 bg-primary rounded-full animate-bounce"></div>
        )}
      </button>

      {/* Mini Tooltip / Popover */}
      {isHovered && (
        <div className="absolute top-full mt-2 right-0 w-64 bg-dark-card border border-dark-border p-4 rounded-2xl shadow-2xl z-50 animate-in fade-in slide-in-from-top-2">
           <div className="flex items-start gap-3">
              <div className={cn(
                "p-2 rounded-lg shrink-0",
                permission === 'granted' ? "bg-primary/20 text-primary" : "bg-white/10 text-white"
              )}>
                 {permission === 'granted' ? <CheckCircle2 className="w-5 h-5" /> : <Bell className="w-5 h-5" />}
              </div>
              <div>
                 <h4 className="text-white font-display text-sm font-bold uppercase tracking-tight">
                   {permission === 'granted' ? "Alertas Ativos!" : "Receber Alertas"}
                 </h4>
                 <p className="text-gray-500 text-[10px] uppercase tracking-widest leading-relaxed mt-1">
                   {permission === 'granted' 
                     ? "Você será avisado sobre novos gols e notícias importantes." 
                     : "Clique para ser notificado sobre novos placares."}
                 </p>
              </div>
           </div>
        </div>
      )}
    </div>
  );
}
