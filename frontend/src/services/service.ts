import { siteConfig } from '../config/site';

interface CreateOrderRequest {
  pizza_id: string;
  quantity: number;
}

export async function createOrder(payload: CreateOrderRequest) {
  const response = await fetch(`${siteConfig.apiBaseUrl}/orders/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(text || 'Failed to create order');
  }

  return response.json();
}


