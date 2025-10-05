import React, { useEffect, useMemo, useState } from 'react';
import { Card, CardBody, CardHeader } from '@heroui/react';
import { pizzas as catalog } from '../data/pizzas';

interface OrderEntry {
  text: string;
}

const OrdersSummary: React.FC = () => {
  const [entries, setEntries] = useState<OrderEntry[]>([]);

  const pizzasById = useMemo(() => {
    const map: Record<string, typeof catalog[number]> = {};
    for (const p of catalog) map[p.id] = p;
    return map;
  }, []);

  useEffect(() => {
    const handler = (e: Event) => {
      const { items, total } = (e as CustomEvent).detail as { items: { name?: string; quantity: number; subtotal: number }[]; total: number };
      const parts = items.map((it, idx) => {
        const name = it.name ?? Object.values(pizzasById)[idx]?.name ?? 'Pizza';
        return `${name} x${it.quantity}`;
      });
      const text = `${parts.join(' - ')} - $${total.toFixed(2)}`;
      setEntries(prev => [{ text }, ...prev]);
    };
    window.addEventListener('order:submitted', handler as EventListener);
    return () => window.removeEventListener('order:submitted', handler as EventListener);
  }, [pizzasById]);

  return (
    <Card className="w-full h-fit">
      <CardHeader className="flex gap-3">
        <div className="flex flex-col">
          <p className="text-md font-bold">🧾 Pedidos</p>
          <p className="text-small text-default-500">Cada línea es un click en "Order"</p>
        </div>
      </CardHeader>
      <CardBody className="pt-0">
        {entries.length === 0 ? (
          <div className="text-center py-6 text-default-500">Aún no hay pedidos</div>
        ) : (
          <div className="space-y-2">
            {entries.map((e, i) => (
              <div key={i} className="text-small text-default-700">{e.text}</div>
            ))}
          </div>
        )}
      </CardBody>
    </Card>
  );
};

export default OrdersSummary;


