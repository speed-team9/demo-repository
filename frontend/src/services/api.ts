// src/services/api.ts
import axios from 'axios';
import type { Article, LoginDto, RegisterDto, User } from '../utils/auth';

const instance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API || '',
  headers: { 'Content-Type': 'application/json' },
});

export const authAPI = {
  login: (data: LoginDto) => instance.post<User>('/api/auth/login', data).then((r) => r.data),
  register: (data: RegisterDto) => instance.post<User>('/api/auth/register', data).then((r) => r.data),
};

export const articleAPI = {
  list: () =>
    instance.get<Article[]>('/articles').then((r) => r.data),
  create: (data: Omit<Article, '_id' | 'createdAt' | 'updatedAt'>) =>
    instance.post<Article>('/articles', data).then((r) => r.data),
};