import { FilmIcon } from "lucide-react"
import { cn } from "cn"

type MoviePosterProps = {
  src?: string | null
  title: string
  className?: string
}

export function MoviePoster({ src, title, className }: MoviePosterProps) {
  return (
    <div
      className={cn(
        "aspect-2/3 overflow-hidden rounded-lg bg-muted shadow-md",
        className
      )}
    >
      {src ? (
        <img src={src} alt={title} className="size-full object-cover" />
      ) : (
        <div
          role="img"
          aria-label={title}
          className="flex size-full items-center justify-center text-muted-foreground"
        >
          <FilmIcon />
        </div>
      )}
    </div>
  )
}
