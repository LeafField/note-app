import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { useEffect, useCallback } from "react";
import { QueryClient, QueryClientProvider } from "react-query";
import { supabase } from "../utils/supabase";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      refetchOnWindowFocus: false,
    },
  },
});

export default function App({ Component, pageProps, router }: AppProps) {
  const validateSession = useCallback(async () => {
    const user = await supabase.auth.getUser();
    if (user.data && router.pathname === "/") {
      router.push("/notes");
    } else if (!user.data && router.pathname !== "/") {
      router.push("/");
    }
  }, [router]);

  supabase.auth.onAuthStateChange((event) => {
    if (event === "SIGNED_IN" && router.pathname === "/") {
      router.push("/notes");
    }
    if (event === "SIGNED_OUT") {
      router.push("/");
    }
  });

  useEffect(() => {
    validateSession();
  }, [validateSession]);

  return (
    <QueryClientProvider client={queryClient}>
      <Component {...pageProps} />
    </QueryClientProvider>
  );
}
