import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { 
  Inbox, Send, Paperclip, Search, MoreHorizontal
} from "lucide-react";
import { Separator } from "@/components/ui/separator";

const MessagesPage = () => {
  const mockMessages = [
    { id: 1, from: "Admin Support", subject: "Welcome to Ellure Portal", preview: "Thank you for joining...", time: "2 hours ago", unread: true },
    { id: 2, from: "Priya Sharma", subject: "Application Follow-up", preview: "I wanted to follow up on...", time: "1 day ago", unread: true },
    { id: 3, from: "System Notification", subject: "New candidates match your criteria", preview: "We found 5 new candidates...", time: "2 days ago", unread: false },
    { id: 4, from: "Admin Support", subject: "Monthly Report Ready", preview: "Your monthly hiring report...", time: "3 days ago", unread: false },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Messages</h1>
        <p className="text-muted-foreground">Communicate with candidates and admin</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Messages List */}
        <Card className="lg:col-span-1 shadow-sm">
          <CardContent className="p-0">
            <div className="p-4 border-b">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search messages..."
                  className="pl-9"
                />
              </div>
            </div>
            <div className="p-2">
              <Button variant="default" className="w-full mb-2">
                <Send className="mr-2 h-4 w-4" />
                Compose New
              </Button>
            </div>
            <Separator />
            <div className="divide-y">
              {mockMessages.map((message) => (
                <div 
                  key={message.id} 
                  className={`p-4 hover:bg-muted/50 cursor-pointer ${message.unread ? 'bg-muted/20' : ''}`}
                >
                  <div className="flex items-start justify-between mb-1">
                    <p className={`text-sm font-medium ${message.unread ? 'font-semibold' : ''}`}>
                      {message.from}
                    </p>
                    {message.unread && (
                      <Badge variant="default" className="h-2 w-2 p-0 rounded-full" />
                    )}
                  </div>
                  <p className="text-sm font-medium text-foreground mb-1">
                    {message.subject}
                  </p>
                  <p className="text-xs text-muted-foreground line-clamp-1 mb-2">
                    {message.preview}
                  </p>
                  <p className="text-xs text-muted-foreground">{message.time}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Message Content */}
        <Card className="lg:col-span-2 shadow-sm">
          <CardContent className="p-0">
            {/* Message Header */}
            <div className="p-4 border-b">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold">Welcome to Ellure Portal</h3>
                  <p className="text-sm text-muted-foreground">From: Admin Support</p>
                </div>
                <Button variant="ghost" size="sm">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Message Body */}
            <div className="p-6 min-h-[400px]">
              <p className="text-sm text-muted-foreground mb-4">2 hours ago</p>
              <div className="prose prose-sm max-w-none">
                <p>Dear Client,</p>
                <p>Welcome to the Ellure NexHire recruitment portal! We're excited to have you on board.</p>
                <p>Here are some quick tips to get started:</p>
                <ul>
                  <li>Search and filter candidates based on your requirements</li>
                  <li>Create shortlists to organize candidates</li>
                  <li>Export candidate data in multiple formats</li>
                  <li>Post job openings and track applications</li>
                </ul>
                <p>If you need any assistance, feel free to reach out to our support team.</p>
                <p>Best regards,<br />Ellure Team</p>
              </div>
            </div>

            {/* Reply Section */}
            <div className="p-4 border-t bg-muted/20">
              <Textarea 
                placeholder="Type your reply..."
                rows={4}
                className="mb-2"
              />
              <div className="flex items-center justify-between">
                <Button variant="outline" size="sm">
                  <Paperclip className="mr-2 h-4 w-4" />
                  Attach
                </Button>
                <Button size="sm">
                  <Send className="mr-2 h-4 w-4" />
                  Send Reply
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default MessagesPage;
