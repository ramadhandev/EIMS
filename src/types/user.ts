
export interface User {
  userId: number;
  name: string;
  userName: string;
  email?: string;
  role: string;
  department: string;
  status: string;
  createdAt: string;
}

export interface UserCreate {
  name: string;
  email: string;
  password: string;
  role: string;
  department: string;
}

export interface UserUpdate {
  name?: string;
  email?: string;
  role?: string;
  department?: string;
  password?: string;
  status?: string;
}

export type UserRole = 'Supervisor' | 'HSSE' | 'Worker';
export type UserStatus = 'Active' | 'Inactive';

export interface Filtere {
  role: string;
  status: string;
  department: string;
}