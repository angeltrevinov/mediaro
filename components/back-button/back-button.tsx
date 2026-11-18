import Link from "next/link"
import { ArrowLeftIcon } from "lucide-react"
import { buttonVariants } from "@/components/ui/button"

type BackButtonProps = {
  href: string
  label?: string
}

/**
 * Navigation back link styled as a button. It renders a real link (not a
 * button) so assistive tech announces it as navigation.
 */
export function BackButton({ href, label = "Back" }: BackButtonProps) {
  return (
    <div>
      <Link
        href={href}
        className={buttonVariants({ variant: "ghost", size: "sm" })}
      >
        <ArrowLeftIcon data-icon="inline-start" />
        {label}
      </Link>
    </div>
  )
}
