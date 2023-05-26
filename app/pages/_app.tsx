import type { AppProps } from "next/app";
import { useEffect, useState } from "react";
import Head from "next/head";

import { evmosTestnet, evmos } from "wagmi/chains";
import { alchemyProvider } from "wagmi/providers/alchemy";
import { publicProvider } from "wagmi/providers/public";
import { configureChains, createClient, WagmiConfig } from "wagmi";

import { getDefaultWallets, RainbowKitProvider } from "@rainbow-me/rainbowkit";
import {
  ChakraProvider,
  extendTheme,
  createMultiStyleConfigHelpers,
} from "@chakra-ui/react";
import { selectAnatomy } from "@chakra-ui/anatomy";

import "@rainbow-me/rainbowkit/styles.css";
import "@styles/globals.css";

import Navbar from "@components/Navbar";

const { chains, provider } = configureChains(
  [evmosTestnet, evmos],
  [publicProvider()]
);

const { connectors } = getDefaultWallets({
  appName: "Trustsight",
  chains,
});

const wagmiConfig = createClient({
  autoConnect: true,
  connectors,
  provider,
});

const { definePartsStyle, defineMultiStyleConfig } =
  createMultiStyleConfigHelpers(selectAnatomy.keys);

const custom = definePartsStyle({
  field: {
    background: "blue.100",
    borderRadius: "20px !important",
    fontWeight: "700 !important",
  },
});

const selectTheme = defineMultiStyleConfig({
  variants: { custom },
});

const theme = extendTheme({
  styles: {
    global: {
      "*": {
        fontFamily: "Plus Jakarta Sans",
        color: "black",
      },
      a: {
        _hover: {
          textDecoration: "none !important",
        },
      },
    },
    components: {
      Select: selectTheme,
    },
  },
});

export default function App({ Component, pageProps, router }: AppProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  return (
    <>
      <WagmiConfig client={wagmiConfig}>
        <RainbowKitProvider chains={chains}>
          <ChakraProvider theme={theme}>
            <Head>
              <title>TrustSight: Enabling Trust in Web3</title>
              <meta name="description" content="Generated by create next app" />
              <link rel="icon" href="/favicon.ico" />
            </Head>
            <Navbar />
            <div className="fixed-background" />
            <Component {...pageProps} key={router.route} />
          </ChakraProvider>
        </RainbowKitProvider>
      </WagmiConfig>
    </>
  );
}
