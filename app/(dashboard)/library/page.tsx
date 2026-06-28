"use client";

import { useRouter } from "next/navigation";
import { LibraryTable, LibraryTableEmpty } from "@/components/library-table";
import { useLibraryItems } from "@/hooks/use-library-items";

export default function LibraryPage() {
    const router = useRouter();
    const { items, loading } = useLibraryItems();

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-64">
                <p className="text-muted-foreground">Loading...</p>
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-4">
            <h1 className="text-xl font-semibold">Library</h1>
            {items.length === 0 ? (
                <LibraryTableEmpty />
            ) : (
                <LibraryTable
                    items={items}
                    onRowClick={(item) =>
                        router.push(`/movie/${item.media.external_id}?back=/library`)
                    }
                />
            )}
        </div>
    );
}


