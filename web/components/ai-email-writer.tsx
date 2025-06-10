"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Sparkles, Send, Copy, ArrowRight } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface Message {
  role: "user" | "assistant"
  content: string
}

interface AIEmailWriterProps {
  open: boolean
  onClose: () => void
  onInsertContent: (content: string) => void
}

export default function AIEmailWriter({ open, onClose, onInsertContent }: AIEmailWriterProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: "Hi! I'm your AI email assistant. How can I help you write your email today?",
    },
  ])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const scrollAreaRef = useRef<HTMLDivElement>(null)
  const { toast } = useToast()

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    if (scrollAreaRef.current) {
      const scrollArea = scrollAreaRef.current
      scrollArea.scrollTop = scrollArea.scrollHeight
    }
  }, [messages])

  // Handle sending a message
  const handleSendMessage = async () => {
    if (!input.trim()) return

    // Add user message
    const userMessage: Message = { role: "user", content: input }
    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsLoading(true)

    // Simulate AI response (in a real app, this would call an API)
    setTimeout(() => {
      let response = ""

      // Generate different responses based on user input
      if (input.toLowerCase().includes("write") && input.toLowerCase().includes("email")) {
        if (input.toLowerCase().includes("thank")) {
          response = generateThankYouEmail()
        } else if (input.toLowerCase().includes("meeting") || input.toLowerCase().includes("schedule")) {
          response = generateMeetingEmail()
        } else if (input.toLowerCase().includes("follow up") || input.toLowerCase().includes("followup")) {
          response = generateFollowUpEmail()
        } else if (input.toLowerCase().includes("introduction") || input.toLowerCase().includes("introduce")) {
          response = generateIntroductionEmail()
        } else {
          response = generateGenericEmail()
        }
      } else if (input.toLowerCase().includes("help") || input.toLowerCase().includes("can you")) {
        response = `I can help you write various types of emails. Just tell me what kind of email you need, such as:
        
- A thank you email
- A meeting request
- A follow-up email
- An introduction email
- A professional response
        
You can also provide specific details about what you want to include in the email.`
      } else {
        response = `I'd be happy to help you write an email. Could you provide more details about what kind of email you need? For example:
        
- Who is the recipient?
- What's the purpose of the email?
- Any specific points you want to include?`
      }

      // Add AI response
      const aiMessage: Message = { role: "assistant", content: response }
      setMessages((prev) => [...prev, aiMessage])
      setIsLoading(false)
    }, 1500)
  }

  // Handle key press (Enter to send)
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  // Handle inserting content into the email
  const handleInsertContent = (content: string) => {
    onInsertContent(content)
    toast({
      title: "Content inserted",
      description: "The AI-generated content has been added to your email.",
    })
    onClose()
  }

  // Generate a thank you email
  const generateThankYouEmail = () => {
    return `Dear [Recipient],

I wanted to take a moment to express my sincere gratitude for [reason for thanks]. Your [support/help/contribution] has been invaluable and has made a significant difference.

[Add a specific example or detail about how their actions helped you]

Thank you again for your [kindness/generosity/time]. I truly appreciate it.

Best regards,
[Your Name]

---

Would you like me to customize this further? Just let me know what details you'd like to include.`
  }

  // Generate a meeting request email
  const generateMeetingEmail = () => {
    return `Dear [Recipient],

I hope this email finds you well. I'm writing to request a meeting to discuss [topic/project].

Would you be available for a [duration: e.g., 30-minute] meeting on [suggest 2-3 possible dates and times]? If these options don't work for you, please let me know what times would be more convenient for your schedule.

During this meeting, I'd like to cover:
- [Agenda item 1]
- [Agenda item 2]
- [Agenda item 3]

Please let me know if you need any additional information before our meeting.

Looking forward to speaking with you.

Best regards,
[Your Name]

---

Would you like me to adjust any part of this email? I can add more specific details if needed.`
  }

  // Generate a follow-up email
  const generateFollowUpEmail = () => {
    return `Dear [Recipient],

I hope you're doing well. I'm following up on our [previous conversation/meeting/email] about [topic] on [date].

[Reference a specific point from your previous interaction]

I wanted to check if there have been any developments regarding [the matter discussed] or if you need any additional information from my end to move forward.

I'm looking forward to your response and am happy to discuss this further at your convenience.

Best regards,
[Your Name]

---

Would you like me to make this more specific to your situation? Let me know what details to include.`
  }

  // Generate an introduction email
  const generateIntroductionEmail = () => {
    return `Dear [Recipient],

I hope this email finds you well. My name is [Your Name], and I am [your position/role] at [your company/organization]. I'm reaching out because [reason for contact].

[Brief paragraph about yourself or your company that's relevant to the recipient]

I would love the opportunity to [purpose: e.g., discuss potential collaboration, learn more about your work, etc.]. [Add a specific question or request if applicable]

Thank you for your time, and I look forward to your response.

Best regards,
[Your Name]
[Your Contact Information]

---

Would you like me to tailor this introduction for a specific industry or purpose?`
  }

  // Generate a generic email
  const generateGenericEmail = () => {
    return `Dear [Recipient],

I hope this email finds you well. I'm writing regarding [subject of the email].

[Main content paragraph 1: Introduce the main topic or purpose]

[Main content paragraph 2: Provide details, explanations, or questions]

[Main content paragraph 3: Specify any action items or next steps]

Thank you for your time and consideration. I look forward to your response.

Best regards,
[Your Name]
[Your Contact Information]

---

This is a general template. Would you like me to create something more specific for your needs?`
  }

  return (
    <Dialog open={open} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[500px] h-[600px] flex flex-col p-0">
        <DialogHeader className="p-4 border-b">
          <DialogTitle className="flex items-center">
            <Sparkles className="h-5 w-5 mr-2 text-primary" />
            AI Email Writer
          </DialogTitle>
        </DialogHeader>

        <div className="flex-1 flex flex-col overflow-hidden">
          <ScrollArea className="flex-1 p-4" ref={scrollAreaRef}>
            <div className="space-y-4">
              {messages.map((message, index) => (
                <div key={index} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
                  <div
                    className={`max-w-[80%] rounded-lg p-3 ${
                      message.role === "user" ? "bg-primary text-primary-foreground" : "bg-muted border border-border"
                    }`}
                  >
                    <div className="whitespace-pre-wrap text-sm">{message.content}</div>
                    {message.role === "assistant" && message.content.includes("Dear") && (
                      <div className="mt-2 flex justify-end gap-2">
                        <Button
                          variant="secondary"
                          size="sm"
                          className="h-7"
                          onClick={() => {
                            navigator.clipboard.writeText(message.content)
                            toast({
                              title: "Copied to clipboard",
                              description: "The email content has been copied to your clipboard.",
                            })
                          }}
                        >
                          <Copy className="h-3.5 w-3.5 mr-1" />
                          Copy
                        </Button>
                        <Button
                          variant="default"
                          size="sm"
                          className="h-7"
                          onClick={() => handleInsertContent(message.content)}
                        >
                          <ArrowRight className="h-3.5 w-3.5 mr-1" />
                          Use
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="max-w-[80%] rounded-lg p-3 bg-muted border border-border">
                    <div className="flex space-x-2 items-center">
                      <div className="w-2 h-2 rounded-full bg-primary animate-bounce" />
                      <div className="w-2 h-2 rounded-full bg-primary animate-bounce [animation-delay:0.2s]" />
                      <div className="w-2 h-2 rounded-full bg-primary animate-bounce [animation-delay:0.4s]" />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>

          <div className="p-4 border-t">
            <div className="flex gap-2">
              <Input
                placeholder="Ask the AI to write an email for you..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyPress}
                disabled={isLoading}
                className="flex-1"
              />
              <Button onClick={handleSendMessage} disabled={isLoading || !input.trim()}>
                <Send className="h-4 w-4" />
              </Button>
            </div>
            <div className="mt-2 text-xs text-muted-foreground">
              Try: "Write a thank you email" or "Help me draft a meeting request"
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
