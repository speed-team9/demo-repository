import { useEffect } from 'react';
import { useRouter } from 'next/router';
import type { Role } from '../utils/constants';
import { ROLE_ROUTE } from '../utils/constants';

export default function Home() {
  const router = useRouter();
  useEffect(() => {
    const role = localStorage.getItem('role') as Role | null;
    if (role) router.replace(ROLE_ROUTE[role]);
    else router.replace('/login');
  }, [router]);
  return null;
}