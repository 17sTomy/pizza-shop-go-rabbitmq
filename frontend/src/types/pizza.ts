export interface Pizza {
  id: string;
  name: string;
  ingredients: string;
  status: 'ORDERING' | 'COOKING' | 'INACTIVE';
  photo: string;
  price: number;
}

export interface PizzaOrder {
  pizzaId: string;
  quantity: number;
}
