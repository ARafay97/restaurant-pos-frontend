export interface MenuItem {
  name: string;
  price: number;
  category: string;
}

export interface Order {
  id: string;
  table: number;
  orderNumber?: number | null;
  items: MenuItem[];
  isKitchenOrder?: boolean;
  startersDone: boolean;
  mainsDone: boolean;
  drinksDone: boolean;
  mocktailDoneItems?: string[];
}
