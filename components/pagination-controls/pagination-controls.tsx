import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";

type PaginationControlsProps = {
    pathName: string;
    query: string;
    currentPage: number;
    totalPages: number;
};

export function PaginationControls({ pathName, query, currentPage, totalPages }: PaginationControlsProps ) {

    // left side
    const showPreviousBtn = currentPage > 1;
    const showPreviousPageNumber = currentPage > 1;
    const showFirstPageBtn = currentPage > 2;
    const showEllipsisBefore = currentPage > 3;
    // right side 
    const showLastPageBtn = currentPage < totalPages - 1;
    const showNextBtn = currentPage < totalPages;
    const showNextPageNumber = currentPage < totalPages;
    const showEllipsisAfter = currentPage < totalPages - 2;


    function constructPageLink(page: number): string {
        const searchParams = new URLSearchParams({
            query,
            page: page.toString()
        });
        return `${pathName}?${searchParams.toString()}`;
    }

    return (
        <>
            <Pagination>
                <PaginationContent>
                    {showPreviousBtn && (
                        <PaginationItem>
                            <PaginationPrevious href={constructPageLink(currentPage - 1)} />
                        </PaginationItem>
                    )}
                    {showFirstPageBtn && (
                        <PaginationItem>
                            <PaginationLink href={constructPageLink(1)}>1</PaginationLink>
                        </PaginationItem>
                    )}
                    {showEllipsisBefore && (
                        <PaginationItem>
                            <PaginationEllipsis />
                        </PaginationItem>
                    )}
                    {showPreviousPageNumber && (
                        <PaginationItem>
                            <PaginationLink href={constructPageLink(currentPage - 1)}>{currentPage - 1}</PaginationLink>
                        </PaginationItem>
                    )}
                    <PaginationItem>
                        <PaginationLink href={constructPageLink(currentPage)} isActive>
                            {currentPage}
                        </PaginationLink>
                    </PaginationItem>
                    {showNextPageNumber && (
                        <PaginationItem>
                            <PaginationLink href={constructPageLink(currentPage + 1)}>{currentPage + 1}</PaginationLink>
                        </PaginationItem>
                    )}
                    {showEllipsisAfter && (
                        <PaginationItem>
                            <PaginationEllipsis />
                        </PaginationItem>
                    )}
                    {showLastPageBtn && (
                        <PaginationItem>
                            <PaginationLink href={constructPageLink(totalPages)}>{totalPages}</PaginationLink>
                        </PaginationItem>
                    )}
                    {showNextBtn && (
                        <PaginationItem>
                            <PaginationNext href={constructPageLink(currentPage + 1)} />
                        </PaginationItem>
                    )}
                </PaginationContent>
            </Pagination>
        </>
    );

}