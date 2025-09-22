import type { Pizza } from '../types/pizza';

export const pizzas: Pizza[] = [
  {
    id: '1',
    name: 'Margherita',
    ingredients: 'Tomate, mozzarella, albahaca fresca',
    status: 'ORDERING',
    photo: 'https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?w=100&h=100&fit=crop&crop=center',
    price: 12.99
  },
  {
    id: '2',
    name: 'Pepperoni',
    ingredients: 'Tomate, mozzarella, pepperoni, orégano',
    status: 'COOKING',
    photo: 'https://images.unsplash.com/photo-1628840042765-356cda07504e?w=100&h=100&fit=crop&crop=center',
    price: 15.99
  },
  {
    id: '3',
    name: 'Hawaiana',
    ingredients: 'Tomate, mozzarella, jamón, piña',
    status: 'ORDERING',
    photo: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=100&h=100&fit=crop&crop=center',
    price: 16.99
  },
  {
    id: '4',
    name: 'Cuatro Quesos',
    ingredients: 'Mozzarella, gorgonzola, parmesano, ricotta',
    status: 'INACTIVE',
    photo: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=100&h=100&fit=crop&crop=center',
    price: 18.99
  },
  {
    id: '5',
    name: 'Vegetariana',
    ingredients: 'Tomate, mozzarella, pimientos, cebolla, champiñones',
    status: 'ORDERING',
    photo: 'https://images.unsplash.com/photo-1571997478779-2adcbbe9ab2f?w=100&h=100&fit=crop&crop=center',
    price: 14.99
  }
];