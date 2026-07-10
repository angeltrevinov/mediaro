import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default async function MetadataSettingsPage() {
    return (
        <div className="flex flex-col gap-6">
            <Card>
                <CardHeader>
                    <CardTitle>Movie Provider</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                    <a
                        href="https://www.themoviedb.org/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 text-sm text-muted-foreground underline underline-offset-4"
                    >
                        <Image
                            src="https://www.themoviedb.org/assets/2/v4/logos/v2/blue_short-8e7b30f73a4020692ccca9c88bafe5dcb6f8a62a4c6bc55cd9ba82bb2cd95f6c.svg"
                            alt="The Movie Database (TMDB)"
                            width={154}
                            height={20}
                        />
                        <span>Data provided by TMDB</span>
                    </a>
                    <p className="text-xs text-muted-foreground">
                        This project uses the TMDB API but is not endorsed, sponsored, or affiliated with TMDB.
                    </p>
                </CardContent>
            </Card>
        </div>
    );
}