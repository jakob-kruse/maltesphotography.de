import '@fontsource/inter';
import { SessionProvider } from 'next-auth/react';
import { DefaultSeo } from 'next-seo';
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
    <>
      <DefaultSeo
        titleTemplate="maltesphotography.de | %s"
        description="Personal photography website"
        canonical="https://maltesphotography.de"
        twitter={{
          handle: '@MalteOfficial',
          site: '@MalteOfficial',
          cardType: 'summary',
        }}
      />
      <SessionProvider session={session}>
        <Component {...pageProps} />
      </SessionProvider>
    </>
  );
}
