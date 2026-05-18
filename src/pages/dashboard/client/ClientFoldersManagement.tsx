import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { FolderPlus, Folder, Eye, Trash2, UserPlus } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { useShortlists } from "@/hooks/useShortlists";
import { Skeleton } from "@/components/ui/skeleton";

const ClientFoldersManagement = () => {
  const navigate = useNavigate();
  const { folders, loading, createFolder, removeFolder, removeFromFolder } = useShortlists("client");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [createOpen, setCreateOpen] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const selected = folders.find((f) => f.id === selectedId) || folders[0];

  const handleCreate = async () => {
    if (!name.trim()) return;
    await createFolder(name, description);
    setCreateOpen(false);
    setName("");
    setDescription("");
    toast.success("Shortlist created");
  };

  if (loading) {
    return (
      <div className="p-6 space-y-4">
        <Skeleton className="h-10 w-48" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">My Shortlists</h1>
          <p className="text-muted-foreground">Organize candidates into folders</p>
        </div>
        <Dialog open={createOpen} onOpenChange={setCreateOpen}>
          <DialogTrigger asChild>
            <Button><FolderPlus className="h-4 w-4 mr-2" />New Shortlist</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>Create Shortlist</DialogTitle></DialogHeader>
            <div className="space-y-3">
              <div><Label>Name</Label><Input value={name} onChange={(e) => setName(e.target.value)} /></div>
              <div><Label>Description</Label><Textarea value={description} onChange={(e) => setDescription(e.target.value)} /></div>
            </div>
            <DialogFooter><Button onClick={handleCreate}>Create</Button></DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-1">
          <CardHeader><CardTitle className="text-base flex items-center gap-2"><Folder className="h-4 w-4" />Folders</CardTitle></CardHeader>
          <CardContent className="space-y-2">
            {folders.length === 0 ? (
              <p className="text-sm text-muted-foreground">No shortlists yet</p>
            ) : folders.map((f) => (
              <button
                key={f.id}
                type="button"
                onClick={() => setSelectedId(f.id)}
                className={`w-full text-left p-3 rounded-lg border transition-colors ${selected?.id === f.id ? "border-primary bg-primary/5" : "hover:bg-muted"}`}
              >
                <p className="font-medium">{f.name}</p>
                <p className="text-xs text-muted-foreground">{f.applicants.length} candidates</p>
              </button>
            ))}
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>{selected?.name || "Select a folder"}</CardTitle>
            {selected && (
              <Button variant="ghost" size="sm" className="text-destructive" onClick={() => removeFolder(selected.id)}>
                <Trash2 className="h-4 w-4" />
              </Button>
            )}
          </CardHeader>
          <CardContent>
            {!selected ? (
              <p className="text-muted-foreground text-sm">Select or create a shortlist</p>
            ) : selected.applicants.length === 0 ? (
              <p className="text-muted-foreground text-sm">No candidates in this shortlist. Add from search.</p>
            ) : (
              <div className="space-y-2">
                {selected.applicants.map((a) => (
                  <div key={a.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <Avatar><AvatarFallback>{a.name?.slice(0, 2).toUpperCase()}</AvatarFallback></Avatar>
                      <div>
                        <p className="font-medium">{a.name}</p>
                        <p className="text-xs text-muted-foreground">{a.city} · {a.experience}y exp</p>
                      </div>
                    </div>
                    <div className="flex gap-1">
                      <Button size="sm" variant="outline" onClick={() => navigate(`/dashboard/client/candidates/${a.id}`)}>
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="ghost" onClick={() => removeFromFolder(selected.id, a.id)}>
                        <UserPlus className="h-4 w-4 rotate-45" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
            <Button className="mt-4" variant="outline" asChild>
              <a href="/dashboard/client/candidates">Browse candidates to add</a>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ClientFoldersManagement;
