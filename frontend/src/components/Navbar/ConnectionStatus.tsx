import { Chip } from '@heroui/react';

interface ConnectionStatusProps {
  isConnected: boolean;
}

export const ConnectionStatus = ({ isConnected }: ConnectionStatusProps) => {
  return (
    <div className="flex items-center gap-2">
      <Chip
        color={isConnected ? 'success' : 'danger'}
        size="sm"
        variant="flat"
      >
        <div className="flex items-center gap-1">
          {isConnected ? 'Conectado' : 'Desconectado'}
          <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`} />
        </div>
      </Chip>
    </div>
  );
};
