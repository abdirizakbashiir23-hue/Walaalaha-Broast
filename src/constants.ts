import {MenuItem} from './types';

export const MENU_ITEMS: MenuItem[] = [
  // Broast Chicken
  {
    id: 'b1',
    name: '4pc Classic Broast Meal',
    category: 'Broast Chicken',
    price: 12.99,
    description: '4 pieces of our famous crispy broast chicken, served with fries, garlic sauce, and a bun.',
    image: 'https://images.unsplash.com/photo-1626645738196-c2a7c87a8f58?q=80&w=800&auto=format&fit=crop',
    isPopular: true,
  },
  {
    id: 'b2',
    name: '8pc Family Broast Bucket',
    category: 'Broast Chicken',
    price: 24.99,
    description: '8 pieces of crispy perfection, large fries, coleslaw, and 4 garlic sauces.',
    image: 'https://images.unsplash.com/photo-1562967914-608f82629710?q=80&w=800&auto=format&fit=crop',
  },
  
  // Chicking Meals
  {
    id: 'c1',
    name: 'Flame Grilled Chicking (Half)',
    category: 'Chicking Meals',
    price: 14.50,
    description: 'Half chicken marinated in our secret herbs and flame-grilled to succulent perfection.',
    image: 'https://images.unsplash.com/photo-1598103442097-8b74394b95c6?q=80&w=800&auto=format&fit=crop',
    isPopular: true,
  },
  {
    id: 'c2',
    name: 'Spicy Chicking Platter',
    category: 'Chicking Meals',
    price: 16.99,
    description: 'Grilled spicy tenders served with fragrant rice and fresh salad.',
    image: 'https://images.unsplash.com/photo-1532550907401-a500c9a5743a?q=80&w=800&auto=format&fit=crop',
  },

  // Burgers
  {
    id: 'br1',
    name: 'The Big Bro Burger',
    category: 'Burgers',
    price: 9.99,
    description: 'Crispy broast chicken breast, iceberg lettuce, tomato, and our signature spicy mayo.',
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?q=80&w=800&auto=format&fit=crop',
    isPopular: true,
  },
  {
    id: 'br2',
    name: 'Walaalaha Signature Burger',
    category: 'Burgers',
    price: 11.50,
    description: 'Double grilled chicken patties, grilled onions, cheese, and BBQ sauce.',
    image: 'https://images.unsplash.com/photo-1521305916504-4a1121188589?q=80&w=800&auto=format&fit=crop',
  },

  // Fries & Sides
  {
    id: 's1',
    name: 'Cajun Loaded Fries',
    category: 'Fries & Sides',
    price: 6.50,
    description: 'Crispy fries topped with melted cheese, spicy sauce, and chicken bits.',
    image: 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?q=80&w=800&auto=format&fit=crop',
  },
  {
    id: 's2',
    name: 'Signature Garlic Sauce',
    category: 'Fries & Sides',
    price: 0.99,
    description: 'Our world-famous creamy garlic dip.',
    image: 'https://images.unsplash.com/photo-1505253304499-671c55fb57fe?q=80&w=800&auto=format&fit=crop',
  },

  // Drinks
  {
    id: 'd1',
    name: 'Fresh Mango Juice',
    category: 'Drinks',
    price: 4.50,
    description: '100% natural Alphonso mangoes, squeezed fresh daily.',
    image: 'https://images.unsplash.com/photo-1546173159-315724a31696?q=80&w=800&auto=format&fit=crop',
    isPopular: true,
  },
  {
    id: 'd2',
    name: 'Iced Watermelon Refresher',
    category: 'Drinks',
    price: 4.25,
    description: 'Fresh watermelon juice with a hint of mint and lime.',
    image: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?q=80&w=800&auto=format&fit=crop',
  },
];
