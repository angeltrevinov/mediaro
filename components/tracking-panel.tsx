"use client";

import { useCallback, useEffect, useState } from "react";
import { MediaForm, TrackingData } from "./media-form";
import { Button } from "./ui/button";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "./ui/alert-dialog";
import {
    deleteTracking,
    getTrackingByExternalId,
} from "@/lib/services/client/tracking-service";

type TrackingPanelProps = {
    externalId: string;
    title?: string;
    posterPath?: string | null;
};

export function TrackingPanel({ externalId, title, posterPath }: TrackingPanelProps) {
    const [tracking, setTracking] = useState<TrackingData | null>(null);
    const [loaded, setLoaded] = useState(false);
    const [deleting, setDeleting] = useState(false);

    const fetchTracking = useCallback(async () => {
        try {
            const data = (await getTrackingByExternalId(externalId)) as TrackingData | null;
            setTracking(data);
        } catch {
            // no tracking found
        } finally {
            setLoaded(true);
        }
    }, [externalId]);

    useEffect(() => {
        fetchTracking();
    }, [fetchTracking]);

    async function handleDelete() {
        setDeleting(true);
        try {
            await deleteTracking(externalId);
            setTracking(null);
        } finally {
            setDeleting(false);
        }
    }

    return (
        <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
                <h2 className="text-base font-semibold">Your Tracking</h2>
                {tracking && (
                    <AlertDialog>
                        <AlertDialogTrigger asChild>
                            <Button
                                variant="destructive"
                                size="sm"
                                disabled={deleting}
                            >
                                {deleting ? "Removing..." : "Remove"}
                            </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle>Remove tracking?</AlertDialogTitle>
                                <AlertDialogDescription>
                                    This will permanently remove this title from your library.
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction
                                    className="bg-destructive text-white hover:bg-destructive/90"
                                    onClick={handleDelete}
                                >
                                    Remove
                                </AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                )}
            </div>

            {loaded ? (
                <MediaForm
                    externalId={externalId}
                    title={title}
                    posterPath={posterPath}
                    tracking={tracking ?? undefined}
                    onSuccess={fetchTracking}
                />
            ) : (
                <p className="text-sm text-muted-foreground">Loading...</p>
            )}
        </div>
    );
}
