"use client";

import type { Route } from "next";
import { useCallback, useEffect, useState } from "react";
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
    generatePageLink: (page: number) => Route;
}

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

    const fetchPage = useCallback(async (query: string, page: number) => {
        setLoading(true);
        try {
            setResults(await fetchFn(query, page));
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    }, [fetchFn]);

    useEffect(() => {
        const query = (searchParams.get("query") ?? "").trim();
        const page = Math.max(1, Number(searchParams.get("page")) || 1);

        form.setValue("query", query);
        form.setValue("page", page);

        if (query) {
            fetchPage(query, page);
        }
    }, [searchParams, fetchPage]);

    function onSubmit(data: SearchFormValues) {
        const query = data.query.trim();
        if (!query) return;
        const params = new URLSearchParams(searchParams.toString());
        params.set("query", query);
        params.set("page", "1");
        router.push(`${pathname}?${params.toString()}` as Route);
    }

    function generatePageLink(page: number) {
        const params = new URLSearchParams(searchParams.toString());
        params.set("query", form.getValues("query") ?? "");
        params.set("page", page.toString());
        return `${pathname}?${params.toString()}` as Route;
    }

    return { form, results, loading, onSubmit, generatePageLink };
}
