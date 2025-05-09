export type EmailFolder = "unified" | "unread" | "flagged" | "snoozed" | "archived" | "trash" | string

export type EmailCategory = "work" | "personal" | "social" | "updates" | "promotions"

export interface SocialLink {
  platform: string
  url: string
  username?: string
}

export interface EmailSender {
  name: string
  email: string
  avatar?: string
  organization?: {
    name: string
    logo: string
    website?: string
  }
  bio?: string
  role?: string
  location?: string
  timezone?: string
  socialLinks?: SocialLink[]
  lastContacted?: string
  firstContacted?: string
  emailCount?: number
}

export interface EmailAttachment {
  name: string
  size: string
  type: string
  url: string
}

export interface Email {
  id: string
  subject: string
  sender: EmailSender
  recipients: EmailSender[]
  content: string
  date: string
  read: boolean
  flagged: boolean
  snoozed: boolean
  snoozeUntil?: Date
  archived: boolean
  deleted: boolean
  attachments?: EmailAttachment[]
  account: string
  categories?: EmailCategory[]
}

export interface EmailAccount {
  id: string
  name: string
  email: string
  color: string
}
