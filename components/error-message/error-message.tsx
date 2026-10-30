import { CircleAlertIcon } from "lucide-react"
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert"

type ErrorMessageProps = {
  message: string
  title?: string
}

export function ErrorMessage({
  message,
  title = "Something went wrong",
}: ErrorMessageProps) {
  return (
    <Alert variant="destructive">
      <CircleAlertIcon />
      <AlertTitle>{title}</AlertTitle>
      <AlertDescription>{message}</AlertDescription>
    </Alert>
  )
}
