"use client"

import { useState, useEffect, useMemo } from "react"
import Sidebar from "@/components/sidebar"
import EmailList from "@/components/email-list"
import EmailDetail from "@/components/email-detail"
import type { Email, EmailAccount, EmailFolder } from "@/types/email"
import { mockEmails, mockAccounts } from "@/lib/mock-data"
import { useMobile } from "@/hooks/use-mobile"
import { useToast } from "@/hooks/use-toast"
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from "@/components/ui/resizable"
import { Button } from "@/components/ui/button"
import { ChevronRight } from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

export default function EmailClient() {
  const [selectedFolder, setSelectedFolder] = useState<EmailFolder>("unified")
  const [selectedEmail, setSelectedEmail] = useState<Email | null>(null)
  const [emails, setEmails] = useState<Email[]>(mockEmails)
  const [accounts, setAccounts] = useState<EmailAccount[]>(mockAccounts)
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [detailOpen, setDetailOpen] = useState(false)
  const [showImportantOnly, setShowImportantOnly] = useState(false)
  const isMobile = useMobile()
  const { toast } = useToast()

  // Filter emails based on selected folder and importance filter
  const filteredEmails = useMemo(() => {
    const filtered = emails.filter((email) => {
      // Apply importance filter if active
      if (showImportantOnly) {
        return email.flagged
      }

      // Show deleted emails only in trash folder
      if (selectedFolder === "trash") return email.deleted

      // Show spam emails only in spam folder
      if (selectedFolder === "spam") return email.spam

      // Don't show deleted or spam emails in other folders
      if (email.deleted || email.spam) return false

      // Handle other special folders
      if (selectedFolder === "snoozed") return email.snoozed
      if (selectedFolder === "archived") return email.archived
      if (selectedFolder === "flagged") return email.flagged

      // Handle standard folders
      if (selectedFolder === "unified") return !email.archived && !email.snoozed
      if (selectedFolder === "unread") return !email.read && !email.archived && !email.snoozed

      // Handle account-specific folders
      return email.account === selectedFolder && !email.archived && !email.snoozed
    })

    return filtered
  }, [emails, selectedFolder, showImportantOnly])

  // Close sidebar on mobile by default
  useEffect(() => {
    if (isMobile) {
      setSidebarOpen(false)
    } else {
      setSidebarOpen(true)
    }
  }, [isMobile])

  // Close detail view when no email is selected
  useEffect(() => {
    if (!selectedEmail) {
      setDetailOpen(false)
    }
  }, [selectedEmail])

  // Handle email selection
  const handleEmailSelect = (email: Email) => {
    setSelectedEmail(email)

    // Mark as read
    setEmails(emails.map((e) => (e.id === email.id ? { ...e, read: true } : e)))

    // Open detail view on mobile
    if (isMobile) {
      setDetailOpen(true)
    }
  }

  // Handle email snooze
  const handleSnoozeEmail = (emailId: string, snoozeUntil: Date) => {
    setEmails(emails.map((email) => (email.id === emailId ? { ...email, snoozed: true, snoozeUntil } : email)))
  }

  // Handle email archive
  const handleArchiveEmail = (emailId: string) => {
    setEmails(emails.map((email) => (email.id === emailId ? { ...email, archived: true } : email)))

    if (selectedEmail?.id === emailId) {
      setSelectedEmail(null)
    }
  }

  // Handle email delete - move to trash
  const handleDeleteEmail = (emailId: string) => {
    // Toast notification for trash
    toast({
      title: "Email moved to trash",
      description: "The email has been moved to the trash folder.",
    })

    // Update the email to be in trash
    setEmails(
      emails.map((email) =>
        email.id === emailId ? { ...email, deleted: true, archived: false, snoozed: false, spam: false } : email,
      ),
    )

    // If the deleted email is currently selected, deselect it
    if (selectedEmail?.id === emailId) {
      setSelectedEmail(null)
    }
  }

  // Handle marking an email as spam
  const handleMarkAsSpam = (emailId: string) => {
    // Toast notification for spam
    toast({
      title: "Email marked as spam",
      description: "The email has been moved to the spam folder.",
    })

    // Update the email to be marked as spam
    setEmails(
      emails.map((email) =>
        email.id === emailId ? { ...email, spam: true, archived: false, snoozed: false, deleted: false } : email,
      ),
    )

    // If the spam email is currently selected, deselect it
    if (selectedEmail?.id === emailId) {
      setSelectedEmail(null)
    }
  }

  // Handle marking an email as not spam
  const handleMarkAsNotSpam = () => {
    if (!selectedEmail) return

    // Toast notification for not spam
    toast({
      title: "Marked as Not Spam",
      description: "This email has been moved to your inbox.",
    })

    // Update the email to remove spam flag
    setEmails(emails.map((email) => (email.id === selectedEmail.id ? { ...email, spam: false } : email)))

    // Update the selected email to reflect changes
    setSelectedEmail({
      ...selectedEmail,
      spam: false,
    })

    // If we're in the spam folder, navigate back to inbox
    if (selectedFolder === "spam") {
      setSelectedFolder("unified")
    }
  }

  // Handle toggling important flag
  const handleToggleImportant = () => {
    if (!selectedEmail) return

    const newFlaggedState = !selectedEmail.flagged

    // Toast notification
    toast({
      title: newFlaggedState ? "Marked as important" : "Removed from important",
      description: newFlaggedState
        ? "This email has been marked as important."
        : "This email is no longer marked as important.",
    })

    // Update the email's flagged status
    setEmails(emails.map((email) => (email.id === selectedEmail.id ? { ...email, flagged: newFlaggedState } : email)))

    // Update the selected email to reflect changes
    setSelectedEmail({
      ...selectedEmail,
      flagged: newFlaggedState,
    })
  }

  // Toggle important only filter
  const toggleImportantOnly = () => {
    setShowImportantOnly(!showImportantOnly)
  }

  // Handle sending email
  const handleSendEmail = (email: any) => {
    // In a real app, you would send the email to a server
    // For now, we'll just show a toast notification
    toast({
      title: "Email Sent",
      description: `Your email to ${email.to} has been sent.`,
    })
  }

  // Toggle sidebar
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen)
  }

  // Select first email by default
  useEffect(() => {
    if (emails.length > 0 && !selectedEmail) {
      const firstVisibleEmail = filteredEmails[0]
      if (firstVisibleEmail) {
        setSelectedEmail(firstVisibleEmail)

        // Mark as read
        setEmails(emails.map((e) => (e.id === firstVisibleEmail.id ? { ...e, read: true } : e)))
      }
    }
  }, [emails, filteredEmails, selectedEmail])

  return (
    <div className="flex h-screen w-full">
      {/* Sidebar */}
      <div
        className={`${
          sidebarOpen ? "block" : "hidden"
        } border-r border-border/50 bg-background/60 backdrop-blur-md transition-all duration-300 md:w-64`}
      >
        <Sidebar
          accounts={accounts}
          selectedFolder={selectedFolder}
          onSelectFolder={setSelectedFolder}
          onToggleSidebar={toggleSidebar}
          onSendEmail={handleSendEmail}
        />
      </div>

      {/* Expand sidebar button (only shown when sidebar is collapsed) */}
      {!sidebarOpen && (
        <div className="relative">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute left-2 top-1/2 transform -translate-y-1/2 h-8 w-8 rounded-full border border-border bg-background shadow-md z-10"
                  onClick={toggleSidebar}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="right">Expand sidebar</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      )}

      {/* Main Content with Resizable Panels */}
      {isMobile ? (
        // Mobile view - show either list or detail
        <div className="flex-1">
          {detailOpen && selectedEmail ? (
            <EmailDetail
              email={selectedEmail}
              onClose={() => setDetailOpen(false)}
              onArchive={() => handleArchiveEmail(selectedEmail.id)}
              onDelete={() => handleDeleteEmail(selectedEmail.id)}
              onSnooze={handleSnoozeEmail}
              onMarkAsSpam={() => handleMarkAsSpam(selectedEmail.id)}
              onMarkAsNotSpam={handleMarkAsNotSpam}
              onToggleImportant={handleToggleImportant}
            />
          ) : (
            <EmailList
              emails={filteredEmails}
              selectedEmail={selectedEmail}
              onSelectEmail={handleEmailSelect}
              onToggleSidebar={toggleSidebar}
              onArchiveEmail={handleArchiveEmail}
              onDeleteEmail={handleDeleteEmail}
              onSnoozeEmail={handleSnoozeEmail}
              selectedFolder={selectedFolder}
              showImportantOnly={showImportantOnly}
              onToggleImportantOnly={toggleImportantOnly}
            />
          )}
        </div>
      ) : (
        // Desktop view - resizable panels
        <ResizablePanelGroup direction="horizontal" className="flex-1">
          <ResizablePanel defaultSize={30} minSize={20}>
            <EmailList
              emails={filteredEmails}
              selectedEmail={selectedEmail}
              onSelectEmail={handleEmailSelect}
              onToggleSidebar={toggleSidebar}
              onArchiveEmail={handleArchiveEmail}
              onDeleteEmail={handleDeleteEmail}
              onSnoozeEmail={handleSnoozeEmail}
              selectedFolder={selectedFolder}
              showImportantOnly={showImportantOnly}
              onToggleImportantOnly={toggleImportantOnly}
            />
          </ResizablePanel>

          <ResizableHandle withHandle />

          <ResizablePanel defaultSize={70}>
            {selectedEmail ? (
              <EmailDetail
                email={selectedEmail}
                onClose={() => setSelectedEmail(null)}
                onArchive={() => handleArchiveEmail(selectedEmail.id)}
                onDelete={() => handleDeleteEmail(selectedEmail.id)}
                onSnooze={handleSnoozeEmail}
                onMarkAsSpam={() => handleMarkAsSpam(selectedEmail.id)}
                onMarkAsNotSpam={handleMarkAsNotSpam}
                onToggleImportant={handleToggleImportant}
              />
            ) : (
              <div className="flex h-full items-center justify-center text-muted-foreground">
                <p>Select an email to view</p>
              </div>
            )}
          </ResizablePanel>
        </ResizablePanelGroup>
      )}
    </div>
  )
}
