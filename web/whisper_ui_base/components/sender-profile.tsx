import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import {
  Calendar,
  Mail,
  MapPin,
  Clock,
  MessageSquare,
  Briefcase,
  Twitter,
  Linkedin,
  Github,
  Instagram,
  Facebook,
  ExternalLink,
} from "lucide-react"
import type { EmailSender } from "@/types/email"

interface SenderProfileProps {
  sender: EmailSender | null
  open: boolean
  onClose: () => void
}

export default function SenderProfile({ sender, open, onClose }: SenderProfileProps) {
  if (!sender) return null

  // Mock data for the profile
  const profile = {
    bio: sender.organization
      ? `${sender.name} works at ${sender.organization.name} as a Product Manager.`
      : `${sender.name} is a freelance designer based in San Francisco.`,
    location: "San Francisco, CA",
    timezone: "Pacific Time (GMT-7)",
    lastContacted: "3 days ago",
    meetingHistory: [
      { title: "Project Kickoff", date: "April 15, 2023" },
      { title: "Design Review", date: "April 22, 2023" },
    ],
    socialLinks: [
      { platform: "Twitter", url: "https://twitter.com" },
      { platform: "LinkedIn", url: "https://linkedin.com" },
      { platform: "GitHub", url: "https://github.com" },
    ],
  }

  // Get social icon based on platform name
  const getSocialIcon = (platform: string) => {
    switch (platform.toLowerCase()) {
      case "twitter":
        return <Twitter className="h-4 w-4" />
      case "linkedin":
        return <Linkedin className="h-4 w-4" />
      case "github":
        return <Github className="h-4 w-4" />
      case "instagram":
        return <Instagram className="h-4 w-4" />
      case "facebook":
        return <Facebook className="h-4 w-4" />
      default:
        return <ExternalLink className="h-4 w-4" />
    }
  }

  return (
    <Sheet open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <SheetContent className="w-[400px] sm:w-[540px] overflow-y-auto">
        <SheetHeader className="text-left pb-4">
          <SheetTitle>Contact Profile</SheetTitle>
        </SheetHeader>

        <div className="space-y-6">
          {/* Header with avatar and name */}
          <div className="flex items-center gap-4">
            <Avatar className="h-16 w-16">
              <AvatarImage src={sender.avatar || "/placeholder.svg"} alt={sender.name} />
              <AvatarFallback className="text-lg">
                {sender.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>
            <div>
              <h3 className="text-xl font-semibold">{sender.name}</h3>
              <p className="text-muted-foreground">{sender.email}</p>
              {sender.organization && (
                <div className="flex items-center gap-2 mt-1">
                  <div className="h-4 w-4 rounded-full overflow-hidden">
                    <img
                      src={sender.organization.logo || "/placeholder.svg"}
                      alt={sender.organization.name}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <span className="text-sm">{sender.organization.name}</span>
                </div>
              )}
            </div>
          </div>

          {/* Quick actions */}
          <div className="flex gap-2">
            <Button className="flex-1" size="sm">
              <Mail className="mr-2 h-4 w-4" />
              Email
            </Button>
            <Button className="flex-1" variant="outline" size="sm">
              <MessageSquare className="mr-2 h-4 w-4" />
              Message
            </Button>
            <Button className="flex-1" variant="outline" size="sm">
              <Calendar className="mr-2 h-4 w-4" />
              Schedule
            </Button>
          </div>

          <Separator />

          {/* Bio section */}
          <div>
            <h4 className="text-sm font-medium mb-2">About</h4>
            <p className="text-sm text-muted-foreground">{profile.bio}</p>
          </div>

          {/* Contact details */}
          <div>
            <h4 className="text-sm font-medium mb-2">Details</h4>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <span>{profile.location}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <span>{profile.timezone}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Briefcase className="h-4 w-4 text-muted-foreground" />
                <span>{sender.organization?.name || "Freelancer"}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <MessageSquare className="h-4 w-4 text-muted-foreground" />
                <span>Last contacted {profile.lastContacted}</span>
              </div>
            </div>
          </div>

          {/* Social links */}
          <div>
            <h4 className="text-sm font-medium mb-2">Social</h4>
            <div className="flex flex-wrap gap-2">
              {profile.socialLinks.map((link, index) => (
                <a
                  key={index}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs bg-muted hover:bg-muted/80 transition-colors"
                >
                  {getSocialIcon(link.platform)}
                  {link.platform}
                </a>
              ))}
            </div>
          </div>

          {/* Meeting history */}
          <div>
            <h4 className="text-sm font-medium mb-2">Meeting History</h4>
            <div className="space-y-2">
              {profile.meetingHistory.map((meeting, index) => (
                <div key={index} className="flex justify-between items-center text-sm p-2 rounded-md bg-muted/50">
                  <span>{meeting.title}</span>
                  <span className="text-muted-foreground">{meeting.date}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Email history preview */}
          <div>
            <h4 className="text-sm font-medium mb-2">Recent Emails</h4>
            <div className="space-y-2">
              <div className="p-3 rounded-md border border-border/50 hover:bg-muted/50 cursor-pointer">
                <div className="flex justify-between items-center mb-1">
                  <span className="font-medium text-sm">Project Update</span>
                  <span className="text-xs text-muted-foreground">2 days ago</span>
                </div>
                <p className="text-xs text-muted-foreground line-clamp-2">
                  Here's the latest update on our project progress. We've completed the initial design phase...
                </p>
              </div>
              <div className="p-3 rounded-md border border-border/50 hover:bg-muted/50 cursor-pointer">
                <div className="flex justify-between items-center mb-1">
                  <span className="font-medium text-sm">Meeting Invitation</span>
                  <span className="text-xs text-muted-foreground">1 week ago</span>
                </div>
                <p className="text-xs text-muted-foreground line-clamp-2">
                  I'd like to schedule a meeting to discuss the next steps for our collaboration...
                </p>
              </div>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}
