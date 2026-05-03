export interface MenuItem {
  id: string;
  name: string;
  category: string;
  price: number;
  description: string;
  image: string;
  isPopular?: boolean;
}

export interface CartItem extends MenuItem {
  quantity: number;
}

export type Category = 'Broast Chicken' | 'Chicking Meals' | 'Burgers' | 'Fries & Sides' | 'Drinks';
