import { Nav } from "@/components/nav";

export default async function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <Nav />
      <main className="m-4">{children}</main>
    </>
  );
}
