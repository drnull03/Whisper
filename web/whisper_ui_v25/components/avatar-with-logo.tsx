"use client"

import { useState } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import type { EmailSender } from "@/types/email"
import SenderProfile from "@/components/sender-profile"

interface AvatarWithLogoProps {
  sender: EmailSender
  size?: "sm" | "md" | "lg"
  className?: string
}

export function AvatarWithLogo({ sender, size = "md", className = "" }: AvatarWithLogoProps) {
  const [showProfile, setShowProfile] = useState(false)

  // Determine avatar size
  const avatarSizeClasses = {
    sm: "h-8 w-8",
    md: "h-10 w-10",
    lg: "h-12 w-12",
  }

  // Determine logo size
  const logoSizeClasses = {
    sm: "h-3.5 w-3.5",
    md: "h-4.5 w-4.5",
    lg: "h-5.5 w-5.5",
  }

  return (
    <>
      <div
        className={`relative ${className} cursor-pointer hover:opacity-90 transition-opacity`}
        onClick={(e) => {
          e.stopPropagation()
          setShowProfile(true)
        }}
      >
        <Avatar className={avatarSizeClasses[size]}>
          <AvatarImage src={sender.avatar || "/placeholder.svg"} alt={sender.name} />
          <AvatarFallback>
            {sender.name
              .split(" ")
              .map((n) => n[0])
              .join("")}
          </AvatarFallback>
        </Avatar>

        {sender.organization && (
          <div className="absolute -bottom-1 -right-1 rounded-full border-2 border-background">
            <div
              className={`${logoSizeClasses[size]} rounded-full bg-white overflow-hidden ring-2 ring-background flex items-center justify-center`}
            >
              <img
                src={sender.organization.logo || "/placeholder.svg"}
                alt={sender.organization.name}
                className="h-full w-full object-cover"
              />
            </div>
          </div>
        )}
      </div>

      <SenderProfile sender={sender} open={showProfile} onClose={() => setShowProfile(false)} />
    </>
  )
}
