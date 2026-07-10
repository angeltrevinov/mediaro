import { Card, CardContent, CardFooter, CardTitle } from "./ui/card";

export function MediaCard({ children }: React.PropsWithChildren) {
    return (
        <Card className="w-full flex flex-row gap-4 items-stretch p-4">
            {children}
        </Card>
    );
}

type MediaCardImageProps = {
    src: string;
    alt: string;
};
export function MediaCardImage({ src, alt }: MediaCardImageProps) {
    if (!src) {
        return (
            <div
                className="h-56 w-36 rounded-md self-center bg-muted/30 border border-muted"
                aria-label="No image available"
            />
        );
    }
    return (
        <img
            src={src}
            alt={alt}
            className="h-56 w-36 object-cover rounded-md self-center" />
    );
}

export function MediaCardContent({ children }: React.PropsWithChildren) {
    return (
        <div className="flex-1 flex flex-col gap-2">
            {children}
        </div>
    );
}

export function MediaCardTitle({ children }: React.PropsWithChildren) {
    return (
        <CardTitle className="text-2xl">{children}</CardTitle>
    );
}

export function MediaCardDescription({ children }: React.PropsWithChildren) {
    // Clamp to 3 lines, show ellipsis if overflow
    return (
        <CardContent className="px-0 line-clamp-6 overflow-hidden text-ellipsis">{children}</CardContent>
    );
}

export function MediaCardAttribution({ children }: React.PropsWithChildren) {
    return (
        <CardFooter className="px-0 pt-2 text-left text-xs text-muted-foreground">
            {children}
        </CardFooter>
    );
}