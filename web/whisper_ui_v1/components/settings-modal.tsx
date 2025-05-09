"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { useTheme } from "next-themes"
import { useToast } from "@/hooks/use-toast"
import type { EmailAccount } from "@/types/email"
import { Moon, Sun, Laptop, Mail, User, Trash2, Clock } from "lucide-react"

interface SettingsModalProps {
  open: boolean
  onClose: () => void
  accounts: EmailAccount[]
}

export default function SettingsModal({ open, onClose, accounts }: SettingsModalProps) {
  const { theme, setTheme } = useTheme()
  const { toast } = useToast()
  const [activeTab, setActiveTab] = useState("general")

  // General settings
  const [sendReadReceipts, setSendReadReceipts] = useState(true)
  const [autoDownloadAttachments, setAutoDownloadAttachments] = useState(false)
  const [defaultReplyAction, setDefaultReplyAction] = useState("reply")
  const [showAvatars, setShowAvatars] = useState(true)

  // Notification settings
  const [emailNotifications, setEmailNotifications] = useState(true)
  const [soundEnabled, setSoundEnabled] = useState(true)
  const [desktopNotifications, setDesktopNotifications] = useState(true)
  const [notificationPreview, setNotificationPreview] = useState("sender-subject")

  // Cleanup settings
  const [autoArchiveAfter, setAutoArchiveAfter] = useState("30")
  const [autoDeleteTrash, setAutoDeleteTrash] = useState("30")
  const [autoDeleteJunk, setAutoDeleteJunk] = useState("7")

  // Save settings
  const handleSave = () => {
    toast({
      title: "Settings saved",
      description: "Your preferences have been updated.",
    })
    onClose()
  }

  return (
    <Dialog open={open} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[600px] max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl">Settings</DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="general" value={activeTab} onValueChange={setActiveTab} className="mt-4">
          <TabsList className="grid grid-cols-4 mb-4">
            <TabsTrigger value="general">General</TabsTrigger>
            <TabsTrigger value="accounts">Accounts</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
            <TabsTrigger value="cleanup">Cleanup</TabsTrigger>
          </TabsList>

          {/* General Settings */}
          <TabsContent value="general" className="space-y-4">
            <div className="space-y-4">
              <div className="space-y-2">
                <h3 className="text-lg font-medium">Appearance</h3>
                <div className="grid grid-cols-3 gap-4">
                  <Button
                    variant={theme === "light" ? "default" : "outline"}
                    className="flex flex-col items-center justify-center gap-2 h-auto py-4"
                    onClick={() => setTheme("light")}
                  >
                    <Sun className="h-6 w-6" />
                    <span>Light</span>
                  </Button>
                  <Button
                    variant={theme === "dark" ? "default" : "outline"}
                    className="flex flex-col items-center justify-center gap-2 h-auto py-4"
                    onClick={() => setTheme("dark")}
                  >
                    <Moon className="h-6 w-6" />
                    <span>Dark</span>
                  </Button>
                  <Button
                    variant={theme === "system" ? "default" : "outline"}
                    className="flex flex-col items-center justify-center gap-2 h-auto py-4"
                    onClick={() => setTheme("system")}
                  >
                    <Laptop className="h-6 w-6" />
                    <span>System</span>
                  </Button>
                </div>
              </div>

              <Separator />

              <div className="space-y-2">
                <h3 className="text-lg font-medium">Behavior</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="show-avatars">Show contact avatars</Label>
                      <p className="text-sm text-muted-foreground">Display profile pictures in the email list</p>
                    </div>
                    <Switch id="show-avatars" checked={showAvatars} onCheckedChange={setShowAvatars} />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="read-receipts">Send read receipts</Label>
                      <p className="text-sm text-muted-foreground">Let senders know when you've read their emails</p>
                    </div>
                    <Switch id="read-receipts" checked={sendReadReceipts} onCheckedChange={setSendReadReceipts} />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="auto-download">Auto-download attachments</Label>
                      <p className="text-sm text-muted-foreground">
                        Automatically download attachments when opening emails
                      </p>
                    </div>
                    <Switch
                      id="auto-download"
                      checked={autoDownloadAttachments}
                      onCheckedChange={setAutoDownloadAttachments}
                    />
                  </div>

                  <div className="space-y-1">
                    <Label htmlFor="default-reply">Default reply action</Label>
                    <Select value={defaultReplyAction} onValueChange={setDefaultReplyAction}>
                      <SelectTrigger id="default-reply">
                        <SelectValue placeholder="Select a default reply action" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="reply">Reply</SelectItem>
                        <SelectItem value="reply-all">Reply All</SelectItem>
                        <SelectItem value="forward">Forward</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          {/* Accounts Settings */}
          <TabsContent value="accounts" className="space-y-4">
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Your Email Accounts</h3>

              {accounts.map((account) => (
                <div key={account.id} className="p-4 border rounded-md space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-full" style={{ backgroundColor: account.color }}>
                      <Mail className="h-5 w-5 text-white m-1.5" />
                    </div>
                    <div>
                      <h4 className="font-medium">{account.name}</h4>
                      <p className="text-sm text-muted-foreground">{account.email}</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <Button variant="outline" size="sm" className="w-full">
                      <User className="mr-2 h-4 w-4" />
                      Edit Profile
                    </Button>
                    <Button variant="outline" size="sm" className="w-full">
                      <Mail className="mr-2 h-4 w-4" />
                      Sync Settings
                    </Button>
                  </div>
                </div>
              ))}

              <Button className="w-full" variant="outline">
                Add Another Account
              </Button>
            </div>
          </TabsContent>

          {/* Notifications Settings */}
          <TabsContent value="notifications" className="space-y-4">
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Notification Preferences</h3>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="email-notifications">Email notifications</Label>
                    <p className="text-sm text-muted-foreground">Receive notifications for new emails</p>
                  </div>
                  <Switch
                    id="email-notifications"
                    checked={emailNotifications}
                    onCheckedChange={setEmailNotifications}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="sound-enabled">Notification sounds</Label>
                    <p className="text-sm text-muted-foreground">Play a sound when new emails arrive</p>
                  </div>
                  <Switch id="sound-enabled" checked={soundEnabled} onCheckedChange={setSoundEnabled} />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="desktop-notifications">Desktop notifications</Label>
                    <p className="text-sm text-muted-foreground">Show notifications on your desktop</p>
                  </div>
                  <Switch
                    id="desktop-notifications"
                    checked={desktopNotifications}
                    onCheckedChange={setDesktopNotifications}
                  />
                </div>

                <div className="space-y-1">
                  <Label htmlFor="notification-preview">Notification preview</Label>
                  <Select value={notificationPreview} onValueChange={setNotificationPreview}>
                    <SelectTrigger id="notification-preview">
                      <SelectValue placeholder="Select what to show in notifications" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="sender-only">Sender name only</SelectItem>
                      <SelectItem value="sender-subject">Sender and subject</SelectItem>
                      <SelectItem value="full-preview">Full message preview</SelectItem>
                      <SelectItem value="no-preview">No preview (count only)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </TabsContent>

          {/* Cleanup Settings */}
          <TabsContent value="cleanup" className="space-y-4">
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Automatic Cleanup</h3>

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4 items-center">
                  <div className="space-y-0.5">
                    <Label htmlFor="auto-archive">Auto-archive after</Label>
                    <p className="text-sm text-muted-foreground">Archive old emails automatically</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Select value={autoArchiveAfter} onValueChange={setAutoArchiveAfter}>
                      <SelectTrigger id="auto-archive" className="w-full">
                        <SelectValue placeholder="Select days" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="never">Never</SelectItem>
                        <SelectItem value="30">30 days</SelectItem>
                        <SelectItem value="60">60 days</SelectItem>
                        <SelectItem value="90">90 days</SelectItem>
                        <SelectItem value="180">6 months</SelectItem>
                        <SelectItem value="365">1 year</SelectItem>
                      </SelectContent>
                    </Select>
                    <Clock className="h-5 w-5 text-muted-foreground" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 items-center">
                  <div className="space-y-0.5">
                    <Label htmlFor="auto-delete-trash">Empty trash after</Label>
                    <p className="text-sm text-muted-foreground">Permanently delete emails in trash</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Select value={autoDeleteTrash} onValueChange={setAutoDeleteTrash}>
                      <SelectTrigger id="auto-delete-trash" className="w-full">
                        <SelectValue placeholder="Select days" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="never">Never</SelectItem>
                        <SelectItem value="7">7 days</SelectItem>
                        <SelectItem value="14">14 days</SelectItem>
                        <SelectItem value="30">30 days</SelectItem>
                        <SelectItem value="60">60 days</SelectItem>
                      </SelectContent>
                    </Select>
                    <Trash2 className="h-5 w-5 text-muted-foreground" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 items-center">
                  <div className="space-y-0.5">
                    <Label htmlFor="auto-delete-junk">Empty junk/spam after</Label>
                    <p className="text-sm text-muted-foreground">Permanently delete junk emails</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Select value={autoDeleteJunk} onValueChange={setAutoDeleteJunk}>
                      <SelectTrigger id="auto-delete-junk" className="w-full">
                        <SelectValue placeholder="Select days" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="never">Never</SelectItem>
                        <SelectItem value="1">1 day</SelectItem>
                        <SelectItem value="7">7 days</SelectItem>
                        <SelectItem value="14">14 days</SelectItem>
                        <SelectItem value="30">30 days</SelectItem>
                      </SelectContent>
                    </Select>
                    <Trash2 className="h-5 w-5 text-muted-foreground" />
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        <div className="flex justify-end gap-2 mt-4">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSave}>Save Changes</Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
