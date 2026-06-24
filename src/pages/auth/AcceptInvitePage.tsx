import { useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/contexts/AuthContext";
import { acceptTeamInvite } from "@/services/clientService";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";

const AcceptInvitePage = () => {
  const [params] = useSearchParams();
  const token = params.get("token");
  const { user } = useAuth();
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const confirm = async () => {
    if (!token) {
      toast.error("Invalid invite link");
      return;
    }
    setLoading(true);
    try {
      let userId = user?.id;
      if (!userId && password) {
        const email = prompt("Enter your email for this invite");
        if (!email) return;
        const { data, error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;
        userId = data.user?.id;
      }
      if (!userId) {
        toast.error("Please sign in first");
        navigate("/auth/client");
        return;
      }
      await acceptTeamInvite(token, userId);
      toast.success("Welcome to the team!");
      navigate("/dashboard/client");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed to accept invite");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-subtle">
      <Card className="w-full max-w-md">
        <CardHeader><CardTitle>Accept Team Invitation</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">Join your company&apos;s Ellure TalentHub workspace.</p>
          {!user && (
            <div className="space-y-2">
              <Label>Create password (new users)</Label>
              <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
            </div>
          )}
          <Button className="w-full" onClick={confirm} disabled={loading}>
            {loading ? "Confirming..." : "Accept Invitation"}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default AcceptInvitePage;

