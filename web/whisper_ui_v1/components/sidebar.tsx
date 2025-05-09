"use client"

import { useState } from "react"
import {
  Inbox,
  Archive,
  Clock,
  Flag,
  Trash2,
  Settings,
  Menu,
  X,
  AlertCircle,
  PenSquare,
  LogOut,
  User,
  AlertTriangle,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import type { EmailAccount, EmailFolder } from "@/types/email"
import ThemeSwitcher from "@/components/theme-switcher"
import { useMobile } from "@/hooks/use-mobile"
import ComposeEmail from "@/components/compose-email"
import SettingsModal from "@/components/settings-modal"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger, SheetClose } from "@/components/ui/sheet"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { useToast } from "@/hooks/use-toast"

interface SidebarProps {
  accounts: EmailAccount[]
  selectedFolder: EmailFolder
  onSelectFolder: (folder: EmailFolder) => void
  onToggleSidebar: () => void
  onSendEmail?: (email: any) => void
}

export default function Sidebar({
  accounts,
  selectedFolder,
  onSelectFolder,
  onToggleSidebar,
  onSendEmail,
}: SidebarProps) {
  const [composeOpen, setComposeOpen] = useState(false)
  const [settingsOpen, setSettingsOpen] = useState(false)
  const isMobile = useMobile()
  const { toast } = useToast()

  // Mock user data
  const user = {
    name: "Alex Johnson",
    email: "alex.johnson@example.com",
    avatar: "/placeholder.svg?height=40&width=40",
    role: "Premium User",
  }

  // Handle logout
  const handleLogout = () => {
    toast({
      title: "Logged out",
      description: "You have been successfully logged out.",
    })
  }

  const folderItems = [
    { id: "unified", label: "Inbox", icon: Inbox },
    { id: "unread", label: "Unread", icon: AlertCircle },
    { id: "flagged", label: "Flagged", icon: Flag },
    { id: "snoozed", label: "Snoozed", icon: Clock },
    { id: "spam", label: "Spam", icon: AlertTriangle },
    { id: "archived", label: "Archived", icon: Archive },
    { id: "trash", label: "Trash", icon: Trash2 },
  ]

  return (
    <div className="h-full flex flex-col bg-background/60 backdrop-blur-md w-64">
      <div className="p-4 flex items-center justify-between border-b border-border/50">
        <h1 className="text-xl font-semibold">Mail</h1>
        <div className="flex items-center gap-2">
          {isMobile ? (
            <Button variant="ghost" size="icon" onClick={onToggleSidebar}>
              <X className="h-5 w-5" />
            </Button>
          ) : (
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-[300px]">
                <SheetHeader className="text-left">
                  <SheetTitle>User Profile</SheetTitle>
                </SheetHeader>

                {/* User Profile Section */}
                <div className="flex items-center gap-3 p-4 mt-2">
                  <Avatar className="h-16 w-16">
                    <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.name} />
                    <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col">
                    <span className="font-medium text-lg">{user.name}</span>
                    <span className="text-sm text-muted-foreground">{user.email}</span>
                    <span className="text-sm text-primary">{user.role}</span>
                  </div>
                </div>

                <Separator className="my-4" />

                <div className="space-y-2 p-2">
                  <SheetClose asChild>
                    <Button variant="outline" className="w-full justify-start" size="lg">
                      <User className="mr-2 h-5 w-5" />
                      My Profile
                    </Button>
                  </SheetClose>

                  <SheetClose asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-start"
                      size="lg"
                      onClick={() => setSettingsOpen(true)}
                    >
                      <Settings className="mr-2 h-5 w-5" />
                      Settings
                    </Button>
                  </SheetClose>
                </div>

                <Separator className="my-4" />

                <div className="p-2">
                  <SheetClose asChild>
                    <Button variant="destructive" className="w-full" onClick={handleLogout}>
                      <LogOut className="mr-2 h-5 w-5" />
                      Log Out
                    </Button>
                  </SheetClose>
                </div>
              </SheetContent>
            </Sheet>
          )}
        </div>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-2">
          <Button variant="default" className="w-full justify-start mb-2" onClick={() => setComposeOpen(true)}>
            <PenSquare className="mr-2 h-4 w-4" />
            Compose
          </Button>

          {/* Main folders */}
          <div className="space-y-1 mb-4">
            {folderItems.map((item) => {
              const Icon = item.icon
              return (
                <Button
                  key={item.id}
                  variant={selectedFolder === item.id ? "secondary" : "ghost"}
                  className="w-full justify-start"
                  onClick={() => onSelectFolder(item.id as EmailFolder)}
                >
                  <Icon className="mr-2 h-4 w-4" />
                  {item.label}
                </Button>
              )
            })}
          </div>

          {/* Accounts - Direct list without collapsible */}
          <div className="space-y-1 mb-4">
            <div className="h-px bg-border/50 my-3"></div>
            {accounts.map((account) => (
              <Button
                key={account.id}
                variant={selectedFolder === account.id ? "secondary" : "ghost"}
                className="w-full justify-start"
                onClick={() => onSelectFolder(account.id as EmailFolder)}
              >
                <span className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: account.color }} />
                {account.name}
              </Button>
            ))}
          </div>
        </div>
      </ScrollArea>

      <div className="p-4 border-t border-border/50 flex justify-between items-center">
        <Button variant="ghost" size="icon" onClick={() => setSettingsOpen(true)}>
          <Settings className="h-5 w-5" />
        </Button>
        <ThemeSwitcher />
      </div>

      {/* Compose Email Modal */}
      <ComposeEmail open={composeOpen} onClose={() => setComposeOpen(false)} onSend={onSendEmail} />

      {/* Settings Modal */}
      <SettingsModal open={settingsOpen} onClose={() => setSettingsOpen(false)} accounts={accounts} />
    </div>
  )
}
