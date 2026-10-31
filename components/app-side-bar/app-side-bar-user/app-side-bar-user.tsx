"use client"

import { useState } from "react"
import { LogOut } from "lucide-react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { ErrorMessage } from "@/components/error-message/error-message"
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSkeleton,
} from "@/components/ui/sidebar"
import { authClient } from "@/lib/better-auth/auth-client"

function getInitials(name: string | null | undefined) {
  const nameParts = name?.trim().split(/\s+/).filter(Boolean) ?? []

  if (nameParts.length === 0) {
    return "?"
  }

  if (nameParts.length === 1) {
    return nameParts[0].slice(0, 2).toUpperCase()
  }

  return `${nameParts[0][0]}${nameParts[nameParts.length - 1][0]}`.toUpperCase()
}

export function AppSidebarUser() {
  const router = useRouter()
  const [logoutError, setLogoutError] = useState(false)
  const { data: session, isPending, error } = authClient.useSession()

  const onLogOut = async () => {
    setLogoutError(false)
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          router.push("/login") // redirect to login page
        },
        onError: () => {
          setLogoutError(true)
        },
      },
    })
  }

  if (isPending) {
    return (
      <SidebarMenu>
        <SidebarMenuItem>
          <SidebarMenuSkeleton showIcon />
        </SidebarMenuItem>
      </SidebarMenu>
    )
  }

  if (error) {
    return (
      <ErrorMessage
        title="Account unavailable"
        message="Unable to load account information."
      />
    )
  }

  if (!session) {
    return null
  }

  const { name, email, image } = session.user

  return (
    <>
      {logoutError && (
        <SidebarMenuItem>
          <ErrorMessage
            title="Logout failed"
            message="Unable to log out. Please try again."
          />
        </SidebarMenuItem>
      )}
      <SidebarMenuItem>
        <SidebarMenuButton onClick={onLogOut}>
          <LogOut aria-hidden="true" />
          Log out
        </SidebarMenuButton>
      </SidebarMenuItem>
      <SidebarMenuItem>
        <SidebarMenuButton
          size="lg"
          render={<div />}
          className="cursor-default hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
        >
          {image ? (
            <Image
              src={image}
              alt=""
              width={32}
              height={32}
              unoptimized
              className="size-8 shrink-0 rounded-lg object-cover"
            />
          ) : (
            <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-sidebar-primary text-xs font-medium text-sidebar-primary-foreground">
              {getInitials(name)}
            </div>
          )}
          <div className="grid min-w-0 flex-1 text-left text-sm leading-tight">
            <span className="truncate font-medium">{name || email}</span>
            <span className="truncate text-xs text-muted-foreground">
              {email}
            </span>
          </div>
        </SidebarMenuButton>
      </SidebarMenuItem>
    </>
  )
}
