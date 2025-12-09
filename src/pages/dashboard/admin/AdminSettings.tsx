import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Upload, Bell, Key, FileText } from "lucide-react";

const AdminSettings = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Admin Settings</h1>
        <p className="text-muted-foreground">Configure system settings and preferences</p>
      </div>

      {/* Branding */}
      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg">Branding</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="company-name">Company Name</Label>
            <Input 
              id="company-name" 
              defaultValue="Ellure NexHire"
            />
          </div>
          <div className="space-y-2">
            <Label>Company Logo</Label>
            <div className="flex items-center gap-4">
              <div className="h-20 w-20 rounded-lg border flex items-center justify-center bg-muted">
                <span className="text-xs text-muted-foreground">Logo</span>
              </div>
              <Button variant="outline">
                <Upload className="mr-2 h-4 w-4" />
                Upload Logo
              </Button>
            </div>
          </div>
          <Separator />
          <Button>Save Branding</Button>
        </CardContent>
      </Card>

      {/* Notifications */}
      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Notification Settings
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Email Notifications</p>
              <p className="text-sm text-muted-foreground">Receive email updates for new applicants</p>
            </div>
            <Switch defaultChecked />
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Client Activity Alerts</p>
              <p className="text-sm text-muted-foreground">Get notified when clients access data</p>
            </div>
            <Switch defaultChecked />
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Weekly Reports</p>
              <p className="text-sm text-muted-foreground">Receive weekly summary reports</p>
            </div>
            <Switch />
          </div>
        </CardContent>
      </Card>

      {/* Email Templates */}
      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Email Template Editor
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Welcome Email Template</Label>
            <Textarea 
              rows={4}
              defaultValue="Dear {name}, Welcome to Ellure Portal..."
              placeholder="Edit email template..."
            />
          </div>
          <div className="space-y-2">
            <Label>Application Confirmation Template</Label>
            <Textarea 
              rows={4}
              defaultValue="Thank you for submitting your application..."
              placeholder="Edit email template..."
            />
          </div>
          <Button>Save Templates</Button>
        </CardContent>
      </Card>

      {/* Integration Keys */}
      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Key className="h-5 w-5" />
            Integration Keys
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>API Key</Label>
            <div className="flex gap-2">
              <Input 
                type="password"
                value="••••••••••••••••••••"
                readOnly
              />
              <Button variant="outline">Regenerate</Button>
            </div>
          </div>
          <div className="space-y-2">
            <Label>Webhook URL</Label>
            <Input 
              placeholder="https://your-webhook-url.com"
            />
          </div>
          <Button>Save Integration Keys</Button>
        </CardContent>
      </Card>

      {/* System Logs */}
      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg">System Logs</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64 rounded-lg border bg-muted/20 p-4 font-mono text-xs overflow-auto">
            <p className="text-muted-foreground">[2024-03-15 10:23:45] User admin@ellureconsulting.com logged in</p>
            <p className="text-muted-foreground">[2024-03-15 10:25:12] New applicant registered: priya@example.com</p>
            <p className="text-muted-foreground">[2024-03-15 10:27:33] CSV import completed: 200 records</p>
            <p className="text-muted-foreground">[2024-03-15 10:30:15] Client client+infosys accessed applicant data</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminSettings;
