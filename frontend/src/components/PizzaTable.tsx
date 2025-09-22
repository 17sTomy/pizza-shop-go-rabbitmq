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

const PizzaTable: React.FC = () => {
  const [orders, setOrders] = useState<Record<string, number>>({});

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

  const handleOrder = (pizzaId: string) => {
    const quantity = orders[pizzaId] || 0;
    if (quantity > 0) {
      // Aquí puedes agregar la lógica para procesar la orden
      console.log(`Ordenando ${quantity} pizza(s) con ID: ${pizzaId}`);
      // Por ahora solo mostramos un alert
      alert(`¡Orden realizada! ${quantity} pizza(s) agregada(s) al carrito.`);
    }
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
                    <Button
                      color="primary"
                      size="sm"
                      onPress={() => handleOrder(pizza.id)}
                      isDisabled={!orders[pizza.id] || orders[pizza.id] <= 0 || pizza.status === 'INACTIVE'}
                    >
                      Ordenar
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardBody>
    </Card>
  );
};

export default PizzaTable;
