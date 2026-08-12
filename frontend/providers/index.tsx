"use client";
// import StoreProvider from "./store";
import ThemeProviders from "./theme";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    // <StoreProvider>
      <ThemeProviders>{children}</ThemeProviders>
    // </StoreProvider>
  );
}
