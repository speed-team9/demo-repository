// src/utils/auth.ts
export type Role = 'submitter' | 'moderator' | 'analyst' | 'administrator' | 'searcher';

export interface User {
  userId: string;
  username: string;
  name: string;
  role: Role;
}

export interface LoginDto {
  username: string;
  password: string;
}

export interface RegisterDto extends LoginDto {
  name: string;
  role?: Role;
}

export interface Article {
  _id: string;
  title: string;
  authors: string[];
  source: string;
  pubyear: string;
  doi?: string;
  claim?: string;
  createdAt?: string;
  updatedAt?: string;
}