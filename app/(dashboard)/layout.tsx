import { getCurrentUser } from "@/lib/auth";
import { Nav } from "@/components/nav";
import { redirect } from "next/navigation";

export default async function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const user = await getCurrentUser();
  if (!user) {
    redirect("/login");
  }

  return (
    <>
      <Nav />
      <main className="m-4">
        {children}
      </main>
    </>
  );
}
