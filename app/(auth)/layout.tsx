import { Card } from "@/components/ui/card";

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
    return (
        <main className="flex min-h-screen items-center justify-center">
            <Card className="w-full max-w-sm">
                {children}
            </Card>
        </main>
    );
}