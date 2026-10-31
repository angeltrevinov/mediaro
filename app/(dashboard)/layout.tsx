import { AppSidebar } from "@/components/app-side-bar/app-side-bar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    return (
        <SidebarProvider>
            <AppSidebar />
            <main className="min-w-0 flex-1">
                <SidebarTrigger />
                <div className="px-4">
                    {children}
                </div>
            </main>
        </SidebarProvider>
    );
}