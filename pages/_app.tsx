import type { AppProps } from "next/app";
import { ThemeProvider, DefaultTheme } from "styled-components";
import GlobalStyle from "../components/globalstyles";
import { useRouter } from "next/router";
import { useTransition } from "react-spring";
import { animated } from "@react-spring/web";
import { useEffect, useState } from "react";
import TransitionLayout from "../layouts/transitionLayout";
import { QueryClient, QueryClientProvider } from "react-query";

const theme: DefaultTheme = {
  colors: {
    primary: "#fff",
    secondary: "#0070DD",
    content_background: "#2a2e34",
    application_background: "#1c1e20",
  },
};

const queryClient = new QueryClient();

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <ThemeProvider theme={theme}>
        <GlobalStyle />
        {/* NOTE: Transition is still a WIP and won't be implemented for the moment */}
        {/* <TransitionLayout> */}
        <QueryClientProvider client={queryClient}>
          <Component {...pageProps} />
        </QueryClientProvider>
        {/* </TransitionLayout> */}
      </ThemeProvider>
    </>
  );
}
