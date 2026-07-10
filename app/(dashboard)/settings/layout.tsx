import { SettingsNav } from "@/components/settings-nav";
import { Separator } from "@/components/ui/separator";

export default function SettingsLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-bold">Settings</h1>
      <Separator />
      <div className="flex gap-10">
        <aside className="w-48 shrink-0">
          <SettingsNav />
        </aside>
        <div className="min-w-0 flex-1">{children}</div>
      </div>
    </div>
  );
}