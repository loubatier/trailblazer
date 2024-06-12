import React from "react";
import { SessionProvider } from "next-auth/react";
import type { AppProps } from "next/app";
import { QueryClient, QueryClientProvider } from "react-query";
import { DefaultTheme, ThemeProvider } from "styled-components";
import GlobalStyle from "../components/globalstyles";

const theme: DefaultTheme = {
  colors: {
    primary: "#fff",
    secondary: "#0070DD",
    content_background: "#2a2e34",
    application_background: "#1c1e20",
  },
};

const queryClient = new QueryClient();

const App = ({ Component, pageProps: { session, ...pageProps } }: AppProps) => {
  return (
    <SessionProvider session={session}>
      <ThemeProvider theme={theme}>
        <GlobalStyle />
        {/* NOTE: Transition is still a WIP and won't be implemented for the moment */}
        {/* <TransitionLayout> */}
        <QueryClientProvider client={queryClient}>
          <Component {...pageProps} />
        </QueryClientProvider>
        {/* </TransitionLayout> */}
      </ThemeProvider>
    </SessionProvider>
  );
};

export default App;
