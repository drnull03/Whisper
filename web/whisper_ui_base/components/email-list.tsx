"use client"

import { useState, useRef, useEffect } from "react"
import { Archive, Trash2, Clock, Menu, MoreHorizontal } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { Input } from "@/components/ui/input"
import type { Email, EmailFolder } from "@/types/email"
import { formatDistanceToNow } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { AvatarWithLogo } from "@/components/avatar-with-logo"

interface EmailListProps {
  emails: Email[]
  selectedEmail: Email | null
  selectedFolder: EmailFolder
  onSelectEmail: (email: Email) => void
  onToggleSidebar: () => void
  onArchiveEmail: (id: string) => void
  onDeleteEmail: (id: string) => void
  onSnoozeEmail: (id: string, snoozeUntil: Date) => void
}

export default function EmailList({
  emails,
  selectedEmail,
  selectedFolder,
  onSelectEmail,
  onToggleSidebar,
  onArchiveEmail,
  onDeleteEmail,
  onSnoozeEmail,
}: EmailListProps) {
  const [searchQuery, setSearchQuery] = useState("")

  // Filter emails based on search query
  const filteredEmails = emails.filter(
    (email) =>
      email.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      email.sender.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      email.content.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  // Get folder name for display
  const getFolderName = () => {
    switch (selectedFolder) {
      case "unified":
        return "Unified Inbox"
      case "unread":
        return "Unread"
      case "flagged":
        return "Flagged"
      case "snoozed":
        return "Snoozed"
      case "archived":
        return "Archived"
      case "trash":
        return "Trash"
      default:
        return selectedFolder
    }
  }

  return (
    <div className="h-full flex flex-col">
      <div className="p-4 flex items-center justify-between border-b border-border/50">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={onToggleSidebar} className="md:hidden">
            <Menu className="h-5 w-5" />
          </Button>
          <h2 className="text-lg font-medium">{getFolderName()}</h2>
        </div>
        <div className="flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <MoreHorizontal className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>Mark all as read</DropdownMenuItem>
              <DropdownMenuItem>Sort by date</DropdownMenuItem>
              <DropdownMenuItem>Sort by sender</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <div className="p-2">
        <Input
          placeholder="Search emails..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full bg-background/80"
        />
      </div>

      <ScrollArea className="flex-1">
        {filteredEmails.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
            <p>No emails found</p>
          </div>
        ) : (
          <div className="divide-y divide-border/50">
            {filteredEmails.map((email) => (
              <EmailListItem
                key={email.id}
                email={email}
                isSelected={selectedEmail?.id === email.id}
                onSelect={() => onSelectEmail(email)}
                onArchive={() => onArchiveEmail(email.id)}
                onDelete={() => onDeleteEmail(email.id)}
                onSnooze={onSnoozeEmail}
              />
            ))}
          </div>
        )}
      </ScrollArea>
    </div>
  )
}

interface EmailListItemProps {
  email: Email
  isSelected: boolean
  onSelect: () => void
  onArchive: () => void
  onDelete: () => void
  onSnooze: (id: string, snoozeUntil: Date) => void
}

function EmailListItem({ email, isSelected, onSelect, onArchive, onDelete, onSnooze }: EmailListItemProps) {
  const [isHovered, setIsHovered] = useState(false)
  const itemRef = useRef<HTMLDivElement>(null)

  // Scroll into view when selected
  useEffect(() => {
    if (isSelected && itemRef.current) {
      itemRef.current.scrollIntoView({ behavior: "smooth", block: "nearest" })
    }
  }, [isSelected])

  // Helper function to determine which badges to show
  const getBadges = () => {
    const badges = []

    if (email.account === "work") {
      badges.push({ label: "Work", variant: "default" })
    }

    if (email.account === "personal") {
      badges.push({ label: "Personal", variant: "secondary" })
    }

    if (email.flagged) {
      badges.push({ label: "Important", variant: "destructive" })
    }

    if (email.attachments && email.attachments.length > 0) {
      badges.push({
        label: `${email.attachments.length} Attachment${email.attachments.length > 1 ? "s" : ""}`,
        variant: "outline",
      })
    }

    return badges
  }

  return (
    <div
      ref={itemRef}
      className={`p-3 cursor-pointer relative flex items-center gap-3 ${
        isSelected
          ? "bg-primary/10 border-l-4 border-primary shadow-sm"
          : isHovered
            ? "bg-muted/50 border-l-4 border-transparent"
            : "border-l-4 border-transparent"
      } ${!email.read ? "font-medium" : ""}`}
      onClick={onSelect}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <AvatarWithLogo sender={email.sender} />

      <div className="flex-1 min-w-0">
        {/* Combined subject and sender name on one line */}
        <div className="flex justify-between items-center mb-1">
          <div className="truncate text-sm">
            {email.subject} <span className="text-muted-foreground">from {email.sender.name}</span>
          </div>
          <div className="text-xs text-muted-foreground whitespace-nowrap ml-2">
            {formatDistanceToNow(new Date(email.date))}
          </div>
        </div>

        {/* Preview of email content */}
        <div className="text-xs text-muted-foreground truncate mb-2">{email.content.substring(0, 100)}...</div>

        {/* Badges for email categories */}
        <div className="flex flex-wrap gap-1.5">
          {getBadges().map((badge, index) => (
            <Badge key={index} variant={badge.variant as any} className="text-xs px-1.5 py-0">
              {badge.label}
            </Badge>
          ))}
          {!email.read && (
            <Badge variant="secondary" className="bg-blue-500 text-white hover:bg-blue-500/90 text-xs px-1.5 py-0">
              New
            </Badge>
          )}
        </div>
      </div>

      {/* Action buttons - positioned absolutely to not affect row height */}
      {isHovered && (
        <div className="absolute right-3 top-1/2 -translate-y-1/2 flex gap-1 bg-muted/80 backdrop-blur-sm px-1 py-0.5 rounded-md">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={(e) => {
              e.stopPropagation()
              onArchive()
            }}
          >
            <Archive className="h-4 w-4" />
          </Button>

          <Popover>
            <PopoverTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8" onClick={(e) => e.stopPropagation()}>
                <Clock className="h-4 w-4" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="end">
              <div className="p-2">
                <div className="font-medium mb-2">Snooze until</div>
                <div className="space-y-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full justify-start"
                    onClick={(e) => {
                      e.stopPropagation()
                      const tomorrow = new Date()
                      tomorrow.setDate(tomorrow.getDate() + 1)
                      tomorrow.setHours(9, 0, 0, 0)
                      onSnooze(email.id, tomorrow)
                    }}
                  >
                    Tomorrow morning
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full justify-start"
                    onClick={(e) => {
                      e.stopPropagation()
                      const nextWeek = new Date()
                      nextWeek.setDate(nextWeek.getDate() + 7)
                      nextWeek.setHours(9, 0, 0, 0)
                      onSnooze(email.id, nextWeek)
                    }}
                  >
                    Next week
                  </Button>
                </div>
                <Calendar
                  mode="single"
                  selected={undefined}
                  onSelect={(date) => {
                    if (date) {
                      onSnooze(email.id, date)
                    }
                  }}
                  className="mt-2"
                />
              </div>
            </PopoverContent>
          </Popover>

          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={(e) => {
              e.stopPropagation()
              onDelete()
            }}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  )
}
