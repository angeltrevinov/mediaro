"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import * as z from "zod";
import { useForm, type UseFormReturn } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

export interface PaginatedResult<T> {
    page: number;
    results: T[];
    totalResults: number;
    totalPages: number;
}

const searchFormSchema = z.object({
    query: z.string().min(1, "Should not be empty"),
    page: z.number().min(1),
});

export type SearchFormValues = z.infer<typeof searchFormSchema>;

export interface UseMediaSearchReturn<T> {
    form: UseFormReturn<SearchFormValues>;
    results: PaginatedResult<T> | null;
    loading: boolean;
    onSubmit: (data: SearchFormValues) => void;
    generatePageLink: (page: number) => string;
}

/**
 * Generic hook for media search pages. Handles URL param syncing, form state,
 * and data fetching. Pass a media-specific fetch function to customise the source.
 *
 * The fetch function should be defined outside the component (or wrapped in
 * useCallback) so it is stable across renders.
 */
export function useMediaSearch<T>(
    fetchFn: (query: string, page: number) => Promise<PaginatedResult<T>>,
): UseMediaSearchReturn<T> {
    const router = useRouter();
    const searchParams = useSearchParams();
    const pathname = usePathname();

    const [results, setResults] = useState<PaginatedResult<T> | null>(null);
    const [loading, setLoading] = useState(false);

    const form = useForm<SearchFormValues>({
        resolver: zodResolver(searchFormSchema),
        defaultValues: { query: "", page: 1 },
    });

    useEffect(() => {
        const query = (searchParams.get("query") ?? "").trim();
        const pageRaw = Number(searchParams.get("page") ?? "1");
        const page = Number.isFinite(pageRaw) && pageRaw > 0 ? pageRaw : 1;

        form.setValue("query", query);
        form.setValue("page", page);

        if (query) {
            fetchPage(query, page);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [searchParams]);

    async function fetchPage(query: string, page: number) {
        setLoading(true);
        try {
            const data = await fetchFn(query, page);
            setResults(data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    }

    function onSubmit(data: SearchFormValues) {
        const query = data.query.trim();
        if (!query) return;
        const params = new URLSearchParams(searchParams.toString());
        params.set("query", query);
        params.set("page", "1");
        router.push(`${pathname}?${params.toString()}`);
    }

    function generatePageLink(page: number) {
        const params = new URLSearchParams(searchParams.toString());
        params.set("query", form.getValues("query") ?? "");
        params.set("page", page.toString());
        return `${pathname}?${params.toString()}`;
    }

    return { form, results, loading, onSubmit, generatePageLink };
}
