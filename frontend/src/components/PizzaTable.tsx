import { useToast } from './Utils/ToastProvider';
import React, { useState } from 'react';
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Avatar,
  Chip,
  Button,
  Card,
  CardBody
} from '@heroui/react';
import { pizzas } from '../data/pizzas';
import type { Pizza } from '../types/pizza';
import { createOrder } from '../services/service';
import { pizzas as catalog } from '../data/pizzas';

const PizzaTable: React.FC = () => {
  const [orders, setOrders] = useState<Record<string, number>>({});
  const { showToast } = useToast();

  const getStatusColor = (status: Pizza['status']) => {
    switch (status) {
      case 'ORDERING':
        return 'success';
      case 'COOKING':
        return 'warning';
      case 'INACTIVE':
        return 'danger';
      default:
        return 'default';
    }
  };

  const getStatusText = (status: Pizza['status']) => {
    switch (status) {
      case 'ORDERING':
        return 'Disponible';
      case 'COOKING':
        return 'Preparando';
      case 'INACTIVE':
        return 'Agotada';
      default:
        return status;
    }
  };

  const updateQuantity = (pizzaId: string, change: number) => {
    setOrders(prev => {
      const currentQuantity = prev[pizzaId] || 0;
      const newQuantity = Math.max(0, currentQuantity + change);
      
      if (newQuantity === 0) {
        const { [pizzaId]: removed, ...rest } = prev;
        return rest;
      }
      
      return {
        ...prev,
        [pizzaId]: newQuantity
      };
    });
  };

  const handleOrderAll = async () => {
    const entries = Object.entries(orders).filter(([, qty]) => qty > 0);
    if (entries.length === 0) return;

    const results = await Promise.allSettled(
      entries.map(([pizzaId, quantity]) => createOrder({ pizza_id: pizzaId, quantity }))
    );

    const success = results.filter(r => r.status === 'fulfilled').length;
    const fail = results.length - success;
    if (success > 0) {
      showToast(`¡${success} orden(es) enviada(s) a la cocina!`, 'success');
    }
    if (fail > 0) {
      showToast(`${fail} orden(es) fallaron`, 'error');
    }

    const items = entries.map(([pizzaId, qty]) => {
      const p = catalog.find(x => x.id === pizzaId);
      const price = p ? p.price : 0;
      const name = p ? p.name : pizzaId;
      const subtotal = price * Number(qty);
      return { name, quantity: Number(qty), subtotal };
    });
    const total = items.reduce((acc, it) => acc + it.subtotal, 0);
    window.dispatchEvent(new CustomEvent('order:submitted', { detail: { items, total } }));

    setOrders(prev => {
      const next = { ...prev } as Record<string, number>;
      for (const [pizzaId] of entries) next[pizzaId] = 0;
      return next;
    });
  };

  return (
    <Card className="w-full">
      <CardBody>
        <Table aria-label="Tabla de pizzas" className="w-full">
          <TableHeader>
            <TableColumn>PIZZA</TableColumn>
            <TableColumn>INGREDIENTES</TableColumn>
            <TableColumn>ESTADO</TableColumn>
            <TableColumn>ACCIONES</TableColumn>
          </TableHeader>
          <TableBody>
            {pizzas.map((pizza: Pizza) => (
              <TableRow key={pizza.id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Avatar
                      src={pizza.photo}
                      alt={pizza.name}
                      className="w-12 h-12"
                      isBordered
                      radius="full"
                    />
                    <div className="flex flex-col">
                      <p className="text-bold text-small capitalize">{pizza.name}</p>
                      <p className="text-bold text-tiny capitalize text-default-400">
                        ${pizza.price}
                      </p>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex flex-col">
                    <p className="text-bold text-small capitalize">{pizza.ingredients}</p>
                  </div>
                </TableCell>
                <TableCell>
                  <Chip
                    className="capitalize"
                    color={getStatusColor(pizza.status)}
                    size="sm"
                    variant="flat"
                  >
                    {getStatusText(pizza.status)}
                  </Chip>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Button
                      isIconOnly
                      size="sm"
                      variant="bordered"
                      onPress={() => updateQuantity(pizza.id, -1)}
                      isDisabled={!orders[pizza.id] || orders[pizza.id] <= 0}
                    >
                      -
                    </Button>
                    <span className="text-small font-medium min-w-[20px] text-center">
                      {orders[pizza.id] || 0}
                    </span>
                    <Button
                      isIconOnly
                      size="sm"
                      variant="bordered"
                      onPress={() => updateQuantity(pizza.id, 1)}
                      isDisabled={pizza.status === 'INACTIVE'}
                    >
                      +
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <div className="flex justify-end mt-4">
          <Button
            color="primary"
            size="sm"
            isDisabled={Object.values(orders).every(q => !q || q <= 0)}
            onPress={handleOrderAll}
          >
            Order
          </Button>
        </div>
      </CardBody>
    </Card>
  );
};

export default PizzaTable;
