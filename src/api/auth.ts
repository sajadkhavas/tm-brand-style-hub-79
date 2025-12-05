import { User } from '@/types';

const delay = (ms = 200) => new Promise(resolve => setTimeout(resolve, ms));

let mockUser: User | null = {
  id: 'user-1',
  fullName: 'کاربر TM-BRAND',
  phone: '09120000000',
  email: 'user@tm-brand.com',
  addresses: [],
};

export interface LoginPayload {
  identifier: string;
  password: string;
}

export const login = async ({ identifier }: LoginPayload): Promise<{ user: User; token: string }> => {
  await delay();
  if (!mockUser) {
    throw new Error('No user');
  }
  return { user: mockUser, token: 'mock-token' };
};

export interface RegisterPayload {
  fullName: string;
  email?: string;
  phone?: string;
  password: string;
}

export const register = async (payload: RegisterPayload): Promise<{ user: User; token: string }> => {
  await delay();
  mockUser = {
    id: 'user-registered',
    fullName: payload.fullName,
    email: payload.email,
    phone: payload.phone,
    addresses: [],
  };
  return { user: mockUser, token: 'mock-token' };
};

export const logout = async () => {
  await delay();
  return true;
};
