import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Bell, Building2, Key } from "lucide-react";

const ClientSettings = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Settings</h1>
        <p className="text-muted-foreground">Manage your account and preferences</p>
      </div>

      {/* Company Information */}
      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Building2 className="h-5 w-5" />
            Company Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="company-name">Company Name</Label>
            <Input 
              id="company-name" 
              defaultValue="Infosys Technologies Ltd"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="contact-person">Contact Person</Label>
            <Input 
              id="contact-person" 
              defaultValue="Rajesh Kumar"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input 
              id="email" 
              type="email"
              defaultValue="client+infosys@ellureconsulting.com"
              disabled
            />
            <p className="text-xs text-muted-foreground">Contact admin to change email</p>
          </div>
          <div className="space-y-2">
            <Label htmlFor="phone">Phone</Label>
            <Input 
              id="phone" 
              defaultValue="+91 98765 43210"
            />
          </div>
          <Separator />
          <Button>Save Changes</Button>
        </CardContent>
      </Card>

      {/* Subscription */}
      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg">Subscription</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Current Plan</p>
              <p className="text-sm text-muted-foreground">Premium Access</p>
            </div>
            <Badge variant="default">Active</Badge>
          </div>
          <Separator />
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Subscription Start</p>
              <p className="font-medium">January 15, 2024</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Subscription End</p>
              <p className="font-medium">January 14, 2025</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Max Applicants</p>
              <p className="font-medium">Unlimited</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Used This Month</p>
              <p className="font-medium">847</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Notifications */}
      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Notification Preferences
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Email Notifications</p>
              <p className="text-sm text-muted-foreground">Receive updates about new candidates</p>
            </div>
            <Switch defaultChecked />
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Candidate Match Alerts</p>
              <p className="text-sm text-muted-foreground">Get notified when candidates match your criteria</p>
            </div>
            <Switch defaultChecked />
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Weekly Summary</p>
              <p className="text-sm text-muted-foreground">Receive weekly activity summary</p>
            </div>
            <Switch />
          </div>
        </CardContent>
      </Card>

      {/* Password */}
      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Key className="h-5 w-5" />
            Change Password
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="current-password">Current Password</Label>
            <Input 
              id="current-password" 
              type="password"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="new-password">New Password</Label>
            <Input 
              id="new-password" 
              type="password"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="confirm-password">Confirm New Password</Label>
            <Input 
              id="confirm-password" 
              type="password"
            />
          </div>
          <Button>Update Password</Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default ClientSettings;
