// src/pages/_app.tsx
import '../styles/globals.scss';
import type { AppProps } from 'next/app';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import PopulatedNavBar from '../components/PopulatedNavBar';

function MyApp({ Component, pageProps }: AppProps) {
  const router = useRouter();
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    const publicPages = ['/login', '/register'];
    const role = typeof window !== 'undefined' ? localStorage.getItem('role') : null;
    const onPublic = publicPages.includes(router.pathname);

    if (!role && !onPublic) {
      router.replace('/login');
    } else {
      setAuthorized(true);
    }
  }, [router.pathname]);

  if (!authorized) return null;

  const showNav = !['/login', '/register'].includes(router.pathname);
  return (
    <>
      {showNav && <PopulatedNavBar />}
      <Component {...pageProps} />
    </>
  );
}

export default MyApp;