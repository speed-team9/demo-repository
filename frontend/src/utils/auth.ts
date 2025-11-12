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

export const NAV_CONFIG: Record<Role, NavItem[]> = {
  searcher: [
    { label: 'Home', href: '/' },
    { label: 'Articles', href: '/articles' },
  ],
  submitter: [
    { label: 'Home', href: '/' },
    { label: 'Articles', href: '/articles' },
    { label: 'New Article', href: '/articles/new' },
  ],
  moderator: [
    { label: 'Home', href: '/' },
    { label: 'Articles', href: '/articles' },
    { label: 'Review', href: '/review' },
  ],
  analyst: [
    { label: 'Home', href: '/' },
    { label: 'Articles', href: '/articles' },
    { label: 'Analysis', href: '/analysis' },
  ],
  administrator: [
    { label: 'Home', href: '/' },
    { label: 'Articles', href: '/articles' },
    { label: 'Users', href: '/admin/users' },
  ],
};

export interface NavItem {
  label: string;
  href: string;
}

export const SHOW_SUBMIT_NEW: Record<Role, boolean> = {
  submitter: true,
  moderator: false,
  analyst: false,
  administrator: false,
  searcher: false,
};