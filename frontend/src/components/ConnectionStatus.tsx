import { Chip } from '@heroui/react';
import React from 'react';

interface ConnectionStatusProps {
  isConnected: boolean;
}

export const ConnectionStatus = ({ isConnected }: ConnectionStatusProps) => {
  return (
    <div className="flex items-center gap-2">
      <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`} />
      <Chip
        color={isConnected ? 'success' : 'danger'}
        size="sm"
        variant="flat"
      >
        {isConnected ? 'Conectado' : 'Desconectado'}
      </Chip>
    </div>
  );
};
