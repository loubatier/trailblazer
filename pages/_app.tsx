import React, { ReactNode } from "react";
import { SessionProvider, useSession } from "next-auth/react";
import type { AppProps } from "next/app";
import { QueryClient, QueryClientProvider } from "react-query";
import { DefaultTheme, ThemeProvider } from "styled-components";
import GlobalStyle from "../components/globalstyles";
import Sidebar from "../components/sidebar";

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
        <QueryClientProvider client={queryClient}>
          <Layout>
            <Component {...pageProps} />
          </Layout>
        </QueryClientProvider>
      </ThemeProvider>
    </SessionProvider>
  );
};

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const { data: session } = useSession();

  return (
    <div>
      {session && <Sidebar />}
      <main>{children}</main>
    </div>
  );
};

export default App;
