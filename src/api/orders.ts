import { CartItem, Order } from '@/types';

const delay = (ms = 300) => new Promise(resolve => setTimeout(resolve, ms));

export const createOrder = async (userId: string, items: CartItem[], total: number): Promise<Order> => {
  await delay();
  return {
    id: `order-${Date.now()}`,
    userId,
    items: items.map(item => ({ ...item, productSnapshot: { ...item.productSnapshot } })),
    total,
    status: 'pending',
    createdAt: new Date().toISOString(),
    paymentStatus: 'pending',
  };
};
