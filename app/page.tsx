import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { routes } from "@/lib/routes";

export default async function Home() {
    const user = await getCurrentUser();
    if (user) {
        redirect(routes.dashboard.library);
    } else {
        redirect(routes.auth.login);
    }
}
