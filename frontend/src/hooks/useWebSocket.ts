import { useState, useEffect, useRef } from 'react';

interface WebSocketMessage {
  type: 'pizza_status_update' | 'new_order' | 'pizza_ready';
  data: any;
}

interface UseWebSocketReturn {
  isConnected: boolean;
  sendMessage: (message: WebSocketMessage) => void;
  lastMessage: WebSocketMessage | null;
}

export const useWebSocket = (url: string): UseWebSocketReturn => {
  const [isConnected, setIsConnected] = useState(false);
  const [lastMessage, setLastMessage] = useState<WebSocketMessage | null>(null);
  const ws = useRef<WebSocket | null>(null);

  useEffect(() => {
    // Conectar al websocket del backend
    ws.current = new WebSocket(url);

    ws.current.onopen = () => {
      console.log('WebSocket conectado');
      setIsConnected(true);
    };

    ws.current.onmessage = (event) => {
      try {
        const message: WebSocketMessage = JSON.parse(event.data);
        setLastMessage(message);
        console.log('Mensaje recibido:', message);
      } catch (error) {
        console.error('Error al parsear mensaje:', error);
      }
    };

    ws.current.onclose = () => {
      console.log('WebSocket desconectado');
      setIsConnected(false);
    };

    ws.current.onerror = (error) => {
      console.error('Error en WebSocket:', error);
      setIsConnected(false);
    };

    return () => {
      if (ws.current) {
        ws.current.close();
      }
    };
  }, [url]);

  const sendMessage = (message: WebSocketMessage) => {
    if (ws.current && ws.current.readyState === WebSocket.OPEN) {
      ws.current.send(JSON.stringify(message));
    } else {
      console.warn('WebSocket no está conectado');
    }
  };

  return {
    isConnected,
    sendMessage,
    lastMessage
  };
};
