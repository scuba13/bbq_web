import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { getTemperatureData } from '../Api';

const MonitorContext = createContext(null);

const MAX_HISTORY = 1800; // 30 minutos a 1 leitura/s

function sendNotification(title, body) {
  if (!('Notification' in window)) return;
  const send = () => new Notification(title, { body, icon: '/favicon.ico' });
  if (Notification.permission === 'granted') {
    send();
  } else if (Notification.permission !== 'denied') {
    Notification.requestPermission().then(p => { if (p === 'granted') send(); });
  }
}

export function MonitorProvider({ children }) {
  const [temps, setTemps] = useState(null);
  const [history, setHistory] = useState([]);
  const historyRef = useRef([]);
  const prevProteinReached = useRef(false);
  const tickRef = useRef(0);

  useEffect(() => {
    const fetchTemps = async () => {
      try {
        const data = await getTemperatureData();
        setTemps(data);

        // Acumula histórico para o gráfico
        const now = new Date();
        const time = `${String(now.getHours()).padStart(2,'0')}:${String(now.getMinutes()).padStart(2,'0')}:${String(now.getSeconds()).padStart(2,'0')}`;
        const point = {
          time,
          bbq:     data.bbqCurrentTemp     !== '--' ? Number(data.bbqCurrentTemp)     : null,
          protein: data.proteinCurrentTemp  !== '--' ? Number(data.proteinCurrentTemp)  : null,
        };
        historyRef.current = [...historyRef.current.slice(-(MAX_HISTORY - 1)), point];

        // Atualiza o estado do gráfico a cada 10 ticks (10s) para não re-renderizar demais
        tickRef.current += 1;
        if (tickRef.current % 10 === 0) {
          setHistory([...historyRef.current]);
        }

        // Notificação: proteína pronta
        if (data.proteinReached && !prevProteinReached.current) {
          sendNotification('🥩 Proteína pronta!', `Atingiu ${data.proteinCurrentTemp}°C`);
        }
        prevProteinReached.current = data.proteinReached;

      } catch {}
    };

    // Pede permissão de notificação na montagem
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }

    fetchTemps();
    const id = setInterval(fetchTemps, 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <MonitorContext.Provider value={{ temps, history }}>
      {children}
    </MonitorContext.Provider>
  );
}

export const useMonitor = () => useContext(MonitorContext);
