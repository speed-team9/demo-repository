// src/utils/constants.ts
export type Role = 'submitter' | 'moderator' | 'analyst' | 'administrator' | 'searcher';

export const ROLE_ROUTE: Record<Role, string> = {
  submitter: '/submitter',
  moderator: '/moderator',
  analyst: '/analyst',
  administrator: '/administrator',
  searcher: '/searcher',
};