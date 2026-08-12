import { serverApi } from "@/utils/api/ssr-api";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  try {
    const ssrApi = await serverApi();
    const { data } = await ssrApi.get("/auth/me");
    if (data?.user) {
      redirect("/");
    }
  } catch (err: any) {
    if (err?.digest?.startsWith("NEXT_REDIRECT")) {
      throw err;
    }
  }
  return children;
}
