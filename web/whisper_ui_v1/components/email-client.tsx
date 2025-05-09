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

export default function EmailClient() {
  const [selectedFolder, setSelectedFolder] = useState<EmailFolder>("unified")
  const [selectedEmail, setSelectedEmail] = useState<Email | null>(null)
  const [emails, setEmails] = useState<Email[]>(mockEmails)
  const [accounts, setAccounts] = useState<EmailAccount[]>(mockAccounts)
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [detailOpen, setDetailOpen] = useState(false)
  const isMobile = useMobile()
  const { toast } = useToast()

  // Filter emails based on selected folder
  const filteredEmails = useMemo(() => {
    return emails.filter((email) => {
      // Show deleted emails only in trash folder
      if (selectedFolder === "trash") return email.deleted

      // Show spam emails only in spam folder
      if (selectedFolder === "spam") return email.spam

      // Don't show deleted or spam emails in other folders
      if (email.deleted || email.spam) return false

      // Handle other special folders
      if (email.snoozed) return selectedFolder === "snoozed"
      if (email.archived) return selectedFolder === "archived"

      // Handle standard folders
      if (selectedFolder === "unified") return !email.archived && !email.snoozed
      if (selectedFolder === "unread") return !email.read && !email.archived && !email.snoozed
      if (selectedFolder === "flagged") return email.flagged && !email.archived && !email.snoozed

      // Handle account-specific folders
      return email.account === selectedFolder && !email.archived && !email.snoozed
    })
  }, [emails, selectedFolder])

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

  // Handle sending email
  const handleSendEmail = (email: any) => {
    // In a real app, you would send the email to a server
    // For now, we'll just show a toast notification
    toast({
      title: "Email Sent",
      description: `Your email to ${email.to} has been sent.`,
    })
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
        className={`${sidebarOpen ? "block" : "hidden"} md:block border-r border-border/50 bg-background/60 backdrop-blur-md`}
      >
        <Sidebar
          accounts={accounts}
          selectedFolder={selectedFolder}
          onSelectFolder={setSelectedFolder}
          onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
          onSendEmail={handleSendEmail}
        />
      </div>

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
            />
          ) : (
            <EmailList
              emails={filteredEmails}
              selectedEmail={selectedEmail}
              onSelectEmail={handleEmailSelect}
              onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
              onArchiveEmail={handleArchiveEmail}
              onDeleteEmail={handleDeleteEmail}
              onSnoozeEmail={handleSnoozeEmail}
              selectedFolder={selectedFolder}
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
              onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
              onArchiveEmail={handleArchiveEmail}
              onDeleteEmail={handleDeleteEmail}
              onSnoozeEmail={handleSnoozeEmail}
              selectedFolder={selectedFolder}
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
