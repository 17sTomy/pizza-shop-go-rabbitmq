import React, { useState, useEffect } from 'react';
import {
  Card,
  CardBody,
  CardHeader,
  Avatar,
  Chip,
  Progress
} from '@heroui/react';
import type { Pizza } from '../types/pizza';
import { pizzas as catalog } from '../data/pizzas';
import { useWebSocketContext } from '../contexts/WebSocketContext';

interface KitchenPizza extends Pizza {
  orderTime: Date;
  estimatedTime: number;
  progress: number;
}

const Kitchen: React.FC = () => {
  const [kitchenPizzas, setKitchenPizzas] = useState<KitchenPizza[]>([]);
  
  const { lastMessage } = useWebSocketContext();

  useEffect(() => {
    if (lastMessage) {
      switch (lastMessage.type) {
        case 'new_order':
          {
            const pizzaId = lastMessage.data.pizzaId as string;
            const found = catalog.find(p => p.id === pizzaId);
            if (found) {
              const newPizza: KitchenPizza = {
                ...found,
                status: 'COOKING',
                orderTime: new Date(),
                estimatedTime: 15,
                progress: 0
              };
              setKitchenPizzas(prev => [...prev, newPizza]);
            }
          }
          break;
          
        case 'pizza_status_update':
          setKitchenPizzas(prev => 
            prev.map(pizza => 
              pizza.id === lastMessage.data.pizzaId 
                ? { ...pizza, progress: lastMessage.data.progress }
                : pizza
            )
          );
          break;
          
        case 'pizza_ready':
          setKitchenPizzas(prev => 
            prev.filter(pizza => pizza.id !== lastMessage.data.pizzaId)
          );
          break;
      }
    }
  }, [lastMessage]);

  const getTimeRemaining = (orderTime: Date, estimatedTime: number) => {
    const elapsed = (Date.now() - orderTime.getTime()) / 60000;
    const remaining = Math.max(0, estimatedTime - elapsed);
    return Math.ceil(remaining);
  };

  const getProgressColor = (progress: number) => {
    if (progress < 30) return 'danger';
    if (progress < 70) return 'warning';
    return 'success';
  };

  return (
    <Card className="w-full h-fit">
      <CardHeader className="flex gap-3">
        <div className="flex flex-col">
          <p className="text-md font-bold">🍳 La Cocina</p>
          <p className="text-small text-default-500">
            Pizzas en preparación
          </p>
        </div>
      </CardHeader>
      <CardBody className="pt-0">
        {kitchenPizzas.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-default-500">No hay pizzas en preparación</p>
            <p className="text-small text-default-400 mt-2">
              Las órdenes aparecerán aquí automáticamente
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {kitchenPizzas.map((pizza) => (
              <Card key={pizza.id} className="bg-default-50">
                <CardBody className="p-4">
                  <div className="flex items-start gap-3">
                    <Avatar
                      src={pizza.photo}
                      alt={pizza.name}
                      className="w-12 h-12"
                      isBordered
                      radius="full"
                    />
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-bold text-small">{pizza.name}</h4>
                        <Chip
                          color="warning"
                          size="sm"
                          variant="flat"
                        >
                          En Cocina
                        </Chip>
                      </div>
                      
                      <p className="text-tiny text-default-600 mb-2">
                        {pizza.ingredients}
                      </p>
                      
                      <div className="space-y-2">
                        <div className="flex justify-between text-tiny">
                          <span>Progreso</span>
                          <span>{pizza.progress}%</span>
                        </div>
                        <Progress
                          value={pizza.progress}
                          color={getProgressColor(pizza.progress)}
                          className="w-full"
                          size="sm"
                        />
                        
                        <div className="flex justify-end text-tiny text-default-500">
                          <span>
                            Restante: {getTimeRemaining(pizza.orderTime, pizza.estimatedTime)} min
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardBody>
              </Card>
            ))}
          </div>
        )}
      </CardBody>
    </Card>
  );
};

export default Kitchen;
