"use client"

import { useSyncExternalStore } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeftIcon } from "lucide-react"
import { Button } from "@/components/ui/button"

const subscribe = () => () => {}

// The Navigation API only exposes same-origin history entries, so this is true
// only when the previous page belongs to the app (not an external site).
// (Not in this TS DOM lib yet, hence the cast.)
const getCanGoBack = () =>
  (window as { navigation?: { canGoBack: boolean } }).navigation?.canGoBack ??
  false

/**
 * Goes back to the previous page of the app. Renders nothing when there isn't
 * one (opened directly, or arrived from an external site).
 */
export function BackButton({ label = "Back" }: { label?: string }) {
  const router = useRouter()
  const canGoBack = useSyncExternalStore(subscribe, getCanGoBack, () => false)

  if (!canGoBack) return null

  return (
    <div>
      <Button
        type="button"
        variant="ghost"
        size="sm"
        onClick={() => router.back()}
      >
        <ArrowLeftIcon data-icon="inline-start" />
        {label}
      </Button>
    </div>
  )
}
