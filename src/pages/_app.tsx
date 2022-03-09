import '@fontsource/inter';
import { SessionProvider } from 'next-auth/react';
import type { AppProps } from 'next/app';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/virtual';

import '../styles/globals.css';

export default function MyApp({
  Component,
  pageProps: { session, ...pageProps },
}: AppProps) {
  return (
    <SessionProvider session={session}>
      <Component {...pageProps} />
    </SessionProvider>
  );
}
