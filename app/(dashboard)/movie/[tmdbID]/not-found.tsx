import { FilmIcon } from "lucide-react"
import { BackButton } from "@/components/back-button/back-button"
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty"

export default function MovieNotFound() {
  return (
    <div className="container mx-auto flex flex-col gap-4">
      <BackButton />
      <Empty>
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <FilmIcon />
          </EmptyMedia>
          <EmptyTitle>Movie not found</EmptyTitle>
          <EmptyDescription>
            We couldn&apos;t find the movie you&apos;re looking for.
          </EmptyDescription>
        </EmptyHeader>
      </Empty>
    </div>
  )
}
