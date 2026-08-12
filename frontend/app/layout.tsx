import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import Providers from "@/providers";
import { serverApi } from "@/utils/api/ssr-api";
import { User } from "@/features/users/users.type";
import ResponsiveAppBar from "@/components/app-bar/responsive-app-bar";
import { Box } from "@mui/material";

const poppins = Poppins({
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  subsets: ["latin"],
  variable: "--font-poppins",
});

export const metadata: Metadata = {
  title: "Feedloop",
  description: "Feedback and Voting Platform",
};

export default async function RootLayout({ children }: LayoutProps<"/">) {
  let user: User | null = null;
  try {
    const api = await serverApi();
    const { data } = await api.get("/auth/me");
    user = data?.user ?? null;
  } catch {
    user = null;
  }

  return (
    <html lang="en" className={poppins.variable}>
      <body>
        <Providers>
          <ResponsiveAppBar user={user} />
          <Box sx={{ pt: 12, px: 10, height: "100%", pb: 5 }}>{children}</Box>
        </Providers>
      </body>
    </html>
  );
}
