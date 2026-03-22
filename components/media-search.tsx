"use client";

import { Controller, type UseFormReturn } from "react-hook-form";
import { SearchIcon } from "lucide-react";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import {
    InputGroup,
    InputGroupAddon,
    InputGroupButton,
    InputGroupInput,
} from "@/components/ui/input-group";
import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination";
import { type SearchFormValues } from "@/hooks/use-media-search";

// ─── Search Form ─────────────────────────────────────────────────────────────

type MediaSearchFormProps = {
    form: UseFormReturn<SearchFormValues>;
    onSubmit: (data: SearchFormValues) => void;
    placeholder?: string;
};

export function MediaSearchForm({
    form,
    onSubmit,
    placeholder = "Search...",
}: MediaSearchFormProps) {
    return (
        <form onSubmit={form.handleSubmit(onSubmit)} className="mb-2">
            <Controller
                control={form.control}
                name="query"
                render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                        <FieldLabel htmlFor={field.name} hidden>
                            {placeholder}
                        </FieldLabel>
                        <InputGroup>
                            <InputGroupInput
                                {...field}
                                id={field.name}
                                aria-invalid={fieldState.invalid}
                                placeholder={placeholder}
                                type="search"
                            />
                            <InputGroupAddon align="inline-end">
                                <InputGroupButton type="submit" aria-label="Search">
                                    <SearchIcon />
                                </InputGroupButton>
                            </InputGroupAddon>
                        </InputGroup>
                        {fieldState.invalid && (
                            <FieldError errors={[fieldState.error]} />
                        )}
                    </Field>
                )}
            />
        </form>
    );
}

// ─── Feedback States ──────────────────────────────────────────────────────────

export function MediaSearchLoading() {
    return <p>Loading...</p>;
}

type MediaSearchEmptyProps = {
    message: string;
};

export function MediaSearchEmpty({ message }: MediaSearchEmptyProps) {
    return <p>{message}</p>;
}

// ─── Results Meta ─────────────────────────────────────────────────────────────

type MediaSearchResultsCountProps = {
    count: number;
};

export function MediaSearchResultsCount({ count }: MediaSearchResultsCountProps) {
    return (
        <span className="text-sm text-muted-foreground">
            {count} results found
        </span>
    );
}

// ─── Pagination ───────────────────────────────────────────────────────────────

type MediaSearchPaginationProps = {
    currentPage: number;
    totalPages: number;
    generatePageLink: (page: number) => string;
};

export function MediaSearchPagination({
    currentPage,
    totalPages,
    generatePageLink,
}: MediaSearchPaginationProps) {
    if (totalPages <= 1) return null;

    const isFirst = currentPage <= 1;
    const isLast = currentPage >= totalPages;

    return (
        <Pagination className="mt-4">
            <PaginationContent>
                <PaginationItem>
                    <PaginationPrevious
                        href={generatePageLink(currentPage - 1)}
                        aria-disabled={isFirst}
                        tabIndex={isFirst ? -1 : 0}
                        className={isFirst ? "pointer-events-none opacity-50" : ""}
                    />
                </PaginationItem>
                <PaginationItem>
                    <span className="inline-flex items-center px-4 text-sm text-muted-foreground">
                        Page {currentPage} of {totalPages}
                    </span>
                </PaginationItem>
                <PaginationItem>
                    <PaginationNext
                        href={generatePageLink(currentPage + 1)}
                        aria-disabled={isLast}
                        tabIndex={isLast ? -1 : 0}
                        className={isLast ? "pointer-events-none opacity-50" : ""}
                    />
                </PaginationItem>
            </PaginationContent>
        </Pagination>
    );
}
