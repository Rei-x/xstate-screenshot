import { ChakraProvider } from '@chakra-ui/react';
import type { AppProps } from 'next/app';
import { theme } from '../theme';
import Script from 'next/script';

const MyApp = ({ pageProps, Component }: AppProps) => {
  return (
    <ChakraProvider theme={theme}>
      <Script src="https://unpkg.com/html-to-image@1.11.11/dist/html-to-image.js" />
      <Component {...pageProps} />
    </ChakraProvider>
  );
};

export default MyApp;
