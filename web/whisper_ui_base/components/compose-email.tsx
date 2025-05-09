"use client"

import type React from "react"

import { useState, useRef } from "react"
import { X, Paperclip, Minus, ChevronDown, Bold, Italic, List, ListOrdered, Link, ImageIcon } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { mockAccounts } from "@/lib/mock-data"

interface ComposeEmailProps {
  open: boolean
  onClose: () => void
  onSend?: (email: any) => void
  replyTo?: {
    to: string
    subject: string
    content?: string
  }
}

export default function ComposeEmail({ open, onClose, onSend, replyTo }: ComposeEmailProps) {
  const [minimized, setMinimized] = useState(false)
  const [to, setTo] = useState(replyTo?.to || "")
  const [cc, setCc] = useState("")
  const [bcc, setBcc] = useState("")
  const [subject, setSubject] = useState(replyTo?.subject ? `Re: ${replyTo.subject}` : "")
  const [content, setContent] = useState("")
  const [attachments, setAttachments] = useState<File[]>([])
  const [sending, setSending] = useState(false)
  const [showCcBcc, setShowCcBcc] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [selectedAccount, setSelectedAccount] = useState(mockAccounts[0])

  // Handle file selection
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files)
      setAttachments([...attachments, ...newFiles])
    }
  }

  // Handle file removal
  const handleRemoveFile = (index: number) => {
    const newAttachments = [...attachments]
    newAttachments.splice(index, 1)
    setAttachments(newAttachments)
  }

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSending(true)

    // Simulate sending email
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Create email object
    const email = {
      to,
      cc,
      bcc,
      subject,
      content,
      attachments: attachments.map((file) => ({
        name: file.name,
        size: `${Math.round(file.size / 1024)} KB`,
        type: file.type,
      })),
      from: selectedAccount.email,
      date: new Date().toISOString(),
    }

    // Call onSend callback if provided
    if (onSend) {
      onSend(email)
    }

    // Reset form and close modal
    setTo("")
    setCc("")
    setBcc("")
    setSubject("")
    setContent("")
    setAttachments([])
    setSending(false)
    onClose()
  }

  // Format text with selected style
  const formatText = (style: string) => {
    // This is a simple implementation - in a real app, you'd use a rich text editor
    switch (style) {
      case "bold":
        setContent(content + "**bold text**")
        break
      case "italic":
        setContent(content + "*italic text*")
        break
      case "list":
        setContent(content + "\n- List item\n- List item\n- List item")
        break
      case "ordered-list":
        setContent(content + "\n1. List item\n2. List item\n3. List item")
        break
      case "link":
        setContent(content + "[link text](https://example.com)")
        break
      default:
        break
    }
  }

  if (minimized) {
    return (
      <div className="fixed bottom-0 right-4 w-80 bg-background rounded-t-lg shadow-lg border border-border z-50">
        <div
          className="p-3 flex items-center justify-between border-b border-border cursor-pointer"
          onClick={() => setMinimized(false)}
        >
          <h3 className="font-medium truncate">{subject || "New Message"}</h3>
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6"
              onClick={(e) => {
                e.stopPropagation()
                setMinimized(false)
              }}
            >
              <Minus className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6"
              onClick={(e) => {
                e.stopPropagation()
                onClose()
              }}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <>
      <Dialog open={open} onOpenChange={(open) => !open && onClose()}>
        <DialogContent className="sm:max-w-[700px] p-0 gap-0 max-h-[90vh] flex flex-col">
          <DialogHeader className="p-4 border-b border-border">
            <div className="flex items-center justify-between">
              <DialogTitle>Compose Email</DialogTitle>
              <div className="flex items-center gap-1">
                <Button variant="ghost" size="icon" onClick={() => setMinimized(true)}>
                  <Minus className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" onClick={onClose}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="flex flex-col flex-1 overflow-hidden">
            <div className="p-4 space-y-4 overflow-y-auto flex-1">
              {/* From account selector */}
              <div className="flex items-center gap-2">
                <Label htmlFor="from" className="w-16">
                  From
                </Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-full justify-start">
                      <div className="flex items-center gap-2">
                        <div className="h-5 w-5 rounded-full" style={{ backgroundColor: selectedAccount.color }} />
                        <span>
                          {selectedAccount.name} &lt;{selectedAccount.email}&gt;
                        </span>
                      </div>
                      <ChevronDown className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-80 p-0">
                    <div className="p-2">
                      {mockAccounts.map((account) => (
                        <div
                          key={account.id}
                          className="flex items-center gap-2 p-2 hover:bg-muted rounded-md cursor-pointer"
                          onClick={() => setSelectedAccount(account)}
                        >
                          <div className="h-5 w-5 rounded-full" style={{ backgroundColor: account.color }} />
                          <div>
                            <div className="font-medium">{account.name}</div>
                            <div className="text-sm text-muted-foreground">{account.email}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </PopoverContent>
                </Popover>
              </div>

              {/* To field */}
              <div className="flex items-center gap-2">
                <Label htmlFor="to" className="w-16">
                  To
                </Label>
                <div className="flex-1 flex items-center gap-2">
                  <Input
                    id="to"
                    value={to}
                    onChange={(e) => setTo(e.target.value)}
                    placeholder="Recipients"
                    className="flex-1"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowCcBcc(!showCcBcc)}
                    className="text-xs"
                  >
                    {showCcBcc ? "Hide CC/BCC" : "Show CC/BCC"}
                  </Button>
                </div>
              </div>

              {/* CC and BCC fields */}
              {showCcBcc && (
                <>
                  <div className="flex items-center gap-2">
                    <Label htmlFor="cc" className="w-16">
                      Cc
                    </Label>
                    <Input
                      id="cc"
                      value={cc}
                      onChange={(e) => setCc(e.target.value)}
                      placeholder="Carbon copy recipients"
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <Label htmlFor="bcc" className="w-16">
                      Bcc
                    </Label>
                    <Input
                      id="bcc"
                      value={bcc}
                      onChange={(e) => setBcc(e.target.value)}
                      placeholder="Blind carbon copy recipients"
                    />
                  </div>
                </>
              )}

              {/* Subject field */}
              <div className="flex items-center gap-2">
                <Label htmlFor="subject" className="w-16">
                  Subject
                </Label>
                <Input
                  id="subject"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="Email subject"
                />
              </div>

              {/* Email content */}
              <div className="border rounded-md">
                <div className="border-b p-1 flex items-center gap-1">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => formatText("bold")}>
                          <Bold className="h-4 w-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>Bold</TooltipContent>
                    </Tooltip>

                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => formatText("italic")}>
                          <Italic className="h-4 w-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>Italic</TooltipContent>
                    </Tooltip>

                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => formatText("list")}>
                          <List className="h-4 w-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>Bullet List</TooltipContent>
                    </Tooltip>

                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => formatText("ordered-list")}
                        >
                          <ListOrdered className="h-4 w-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>Numbered List</TooltipContent>
                    </Tooltip>

                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => formatText("link")}>
                          <Link className="h-4 w-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>Insert Link</TooltipContent>
                    </Tooltip>

                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => fileInputRef.current?.click()}
                        >
                          <ImageIcon className="h-4 w-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>Insert Image</TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
                <Textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Write your email here..."
                  className="border-0 rounded-none min-h-[200px] resize-none"
                />
              </div>

              {/* Attachments */}
              {attachments.length > 0 && (
                <div className="border rounded-md p-3">
                  <h4 className="text-sm font-medium mb-2">Attachments</h4>
                  <div className="flex flex-wrap gap-2">
                    {attachments.map((file, index) => (
                      <div key={index} className="flex items-center gap-2 bg-muted/50 rounded-md p-2 text-sm">
                        <span className="truncate max-w-[150px]">{file.name}</span>
                        <span className="text-xs text-muted-foreground">({Math.round(file.size / 1024)} KB)</span>
                        <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => handleRemoveFile(index)}>
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Hidden file input */}
              <input type="file" ref={fileInputRef} onChange={handleFileSelect} className="hidden" multiple />
            </div>

            {/* Footer with actions */}
            <div className="p-4 border-t border-border flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Button type="submit" disabled={sending}>
                  {sending ? "Sending..." : "Send"}
                </Button>
                <Button type="button" variant="outline" onClick={() => fileInputRef.current?.click()}>
                  <Paperclip className="h-4 w-4 mr-2" />
                  Attach
                </Button>
              </div>
              <Button type="button" variant="ghost" onClick={onClose}>
                Discard
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </>
  )
}
