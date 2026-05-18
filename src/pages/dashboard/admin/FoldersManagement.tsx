import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Checkbox } from "@/components/ui/checkbox";
import { 
  FolderPlus, Folder, Users, Download, Share2, Trash2, MoreHorizontal,
  Search, Plus, Edit, Eye, FolderOpen, Star, ArrowLeft, FileText,
  UserPlus, X, Check, Mail, Phone
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
import { useShortlists, type FolderView } from "@/hooks/useShortlists";
import { searchApplicantsForFolder, type ApplicantSummary } from "@/services/shortlistService";
import { exportApplicantsToExcel } from "@/utils/applicantExport";
import type { Applicant } from "@/hooks/useApplicants";
import { Loader2 } from "lucide-react";

interface Folder {
  id: string;
  name: string;
  description: string;
  count: number;
  createdAt: string;
  isShared: boolean;
  sharedWith: string[];
  applicantIds: string[];
  color: string;
}

function folderFromView(f: FolderView): Folder {
  return {
    id: f.id,
    name: f.name,
    description: f.description,
    count: f.applicants.length,
    createdAt: f.createdAt,
    isShared: f.isShared,
    sharedWith: [],
    applicantIds: f.applicants.map((a) => a.id),
    color: f.color,
  };
}

const FoldersManagement = () => {
  const { folders: folderViews, loading, createFolder, removeFolder, addToFolder, removeFromFolder, reload } =
    useShortlists("admin");
  const folders: Folder[] = folderViews.map(folderFromView);

  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [selectedFolder, setSelectedFolder] = useState<Folder | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [newFolderName, setNewFolderName] = useState("");
  const [newFolderDescription, setNewFolderDescription] = useState("");
  const [newFolderColor, setNewFolderColor] = useState("blue");
  const [selectedApplicants, setSelectedApplicants] = useState<string[]>([]);
  const [isAddApplicantsDialogOpen, setIsAddApplicantsDialogOpen] = useState(false);
  const [addSearchQuery, setAddSearchQuery] = useState("");
  const [addSearchResults, setAddSearchResults] = useState<ApplicantSummary[]>([]);

  const colorOptions = [
    { value: "blue", label: "Blue", class: "bg-blue-500" },
    { value: "green", label: "Green", class: "bg-green-500" },
    { value: "purple", label: "Purple", class: "bg-purple-500" },
    { value: "yellow", label: "Yellow", class: "bg-yellow-500" },
    { value: "cyan", label: "Cyan", class: "bg-cyan-500" },
    { value: "red", label: "Red", class: "bg-red-500" },
  ];

  const getColorClass = (color: string) => {
    const colorMap: Record<string, string> = {
      blue: "bg-blue-500/10 text-blue-600",
      green: "bg-green-500/10 text-green-600",
      purple: "bg-purple-500/10 text-purple-600",
      yellow: "bg-yellow-500/10 text-yellow-600",
      cyan: "bg-cyan-500/10 text-cyan-600",
      red: "bg-red-500/10 text-red-600",
    };
    return colorMap[color] || colorMap.blue;
  };

  const handleCreateFolder = async () => {
    if (!newFolderName.trim()) return;
    const ok = await createFolder(newFolderName.trim(), newFolderDescription.trim(), newFolderColor);
    if (ok) {
      setNewFolderName("");
      setNewFolderDescription("");
      setNewFolderColor("blue");
      setIsCreateDialogOpen(false);
    }
  };

  const handleDeleteFolder = async (folderId: string) => {
    await removeFolder(folderId);
    if (selectedFolder?.id === folderId) setSelectedFolder(null);
  };

  const handleAddApplicantsToFolder = async () => {
    if (selectedFolder && selectedApplicants.length > 0) {
      await addToFolder(selectedFolder.id, selectedApplicants);
      setSelectedApplicants([]);
      setIsAddApplicantsDialogOpen(false);
      const fresh = folderViews.find((f) => f.id === selectedFolder.id);
      if (fresh) setSelectedFolder(folderFromView(fresh));
    }
  };

  const handleRemoveFromFolder = async (applicantId: string) => {
    if (selectedFolder) {
      await removeFromFolder(selectedFolder.id, applicantId);
      const fresh = folderViews.find((f) => f.id === selectedFolder.id);
      if (fresh) setSelectedFolder(folderFromView(fresh));
    }
  };

  const searchApplicantsToAdd = async () => {
    const { data } = await searchApplicantsForFolder(addSearchQuery, 25);
    setAddSearchResults(data ?? []);
  };

  const filteredFolders = folders.filter(f => 
    f.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    f.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const folderApplicants: ApplicantSummary[] = selectedFolder
    ? folderViews.find((f) => f.id === selectedFolder.id)?.applicants ?? []
    : [];

  if (loading && folders.length === 0) {
    return (
      <div className="flex items-center justify-center p-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  // Folder Detail View
  if (selectedFolder) {
    return (
      <div className="space-y-6 p-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" onClick={() => setSelectedFolder(null)}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Folders
            </Button>
            <div className="h-8 w-px bg-border" />
            <div className="flex items-center gap-3">
              <div className={`h-10 w-10 rounded-lg flex items-center justify-center ${getColorClass(selectedFolder.color)}`}>
                <FolderOpen className="h-5 w-5" />
              </div>
              <div>
                <h1 className="text-xl font-bold">{selectedFolder.name}</h1>
                <p className="text-sm text-muted-foreground">{selectedFolder.count} applicants</p>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={() => setIsAddApplicantsDialogOpen(true)}>
              <UserPlus className="h-4 w-4 mr-2" />
              Add Applicants
            </Button>
            <Button variant="outline" size="sm">
              <Share2 className="h-4 w-4 mr-2" />
              Share
            </Button>
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Export All
            </Button>
          </div>
        </div>

        {/* Folder Info Card */}
        <Card>
          <CardContent className="py-4">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">{selectedFolder.description}</p>
                <div className="flex items-center gap-4 text-sm">
                  <span>Created: {selectedFolder.createdAt}</span>
                  {selectedFolder.isShared && (
                    <Badge variant="outline" className="gap-1">
                      <Share2 className="h-3 w-3" />
                      Shared with {selectedFolder.sharedWith.length} people
                    </Badge>
                  )}
                </div>
              </div>
              <Button variant="outline" size="sm">
                <Edit className="h-4 w-4 mr-2" />
                Edit Folder
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Applicants in Folder */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Applicants in this Folder</CardTitle>
              <div className="relative w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Search applicants..." className="pl-10" />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {folderApplicants.length === 0 ? (
              <div className="text-center py-12">
                <Users className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="font-semibold mb-2">No applicants in this folder</h3>
                <p className="text-sm text-muted-foreground mb-4">Add applicants to organize your shortlist</p>
                <Button onClick={() => setIsAddApplicantsDialogOpen(true)}>
                  <UserPlus className="h-4 w-4 mr-2" />
                  Add Applicants
                </Button>
              </div>
            ) : (
              <div className="space-y-2">
                {folderApplicants.map((applicant) => (
                  <div 
                    key={applicant.id} 
                    className="flex items-center justify-between p-4 rounded-lg border hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <Avatar className="h-10 w-10">
                        <AvatarFallback className="bg-primary/10 text-primary">
                          {applicant.name.split(" ").map(n => n[0]).join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{applicant.name}</p>
                        <div className="flex items-center gap-3 text-sm text-muted-foreground">
                          <span>{applicant.current_designation || applicant.job_role || "Professional"}</span>
                          <span>•</span>
                          <span>{applicant.city || "—"}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="flex gap-1">
                        {(applicant.key_skills || "")
                          .split(/[,;|]/)
                          .map((s) => s.trim())
                          .filter(Boolean)
                          .slice(0, 3)
                          .map((skill, i) => (
                            <Badge key={i} variant="secondary" className="text-xs">
                              {skill}
                            </Badge>
                          ))}
                      </div>
                      <div className="flex items-center gap-1">
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <Download className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <Mail className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-8 w-8 text-destructive hover:text-destructive"
                          onClick={() => handleRemoveFromFolder(applicant.id)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Add Applicants Dialog */}
        <Dialog open={isAddApplicantsDialogOpen} onOpenChange={setIsAddApplicantsDialogOpen}>
          <DialogContent className="max-w-2xl max-h-[80vh]">
            <DialogHeader>
              <DialogTitle>Add Applicants to {selectedFolder.name}</DialogTitle>
              <DialogDescription>
                Select applicants to add to this folder
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search applicants..."
                  className="pl-10 flex-1"
                  value={addSearchQuery}
                  onChange={(e) => setAddSearchQuery(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && void searchApplicantsToAdd()}
                />
                <Button type="button" variant="secondary" onClick={() => void searchApplicantsToAdd()}>
                  Search
                </Button>
              </div>
              <div className="max-h-[400px] overflow-y-auto space-y-2">
                {addSearchResults
                  .filter((a) => !selectedFolder.applicantIds.includes(a.id))
                  .map((applicant) => (
                  <div 
                    key={applicant.id}
                    className={`flex items-center gap-4 p-3 rounded-lg border cursor-pointer transition-colors ${
                      selectedApplicants.includes(applicant.id) ? "bg-primary/10 border-primary" : "hover:bg-muted/50"
                    }`}
                    onClick={() => {
                      setSelectedApplicants(prev => 
                        prev.includes(applicant.id) 
                          ? prev.filter(id => id !== applicant.id)
                          : [...prev, applicant.id]
                      );
                    }}
                  >
                    <Checkbox checked={selectedApplicants.includes(applicant.id)} />
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="text-xs bg-primary/10 text-primary">
                        {applicant.name.split(" ").map(n => n[0]).join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <p className="font-medium text-sm">{applicant.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {(applicant.key_skills || "").slice(0, 40)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex items-center justify-between pt-4 border-t">
                <span className="text-sm text-muted-foreground">
                  {selectedApplicants.length} applicants selected
                </span>
                <div className="flex gap-2">
                  <Button variant="outline" onClick={() => {
                    setSelectedApplicants([]);
                    setIsAddApplicantsDialogOpen(false);
                  }}>
                    Cancel
                  </Button>
                  <Button onClick={handleAddApplicantsToFolder} disabled={selectedApplicants.length === 0}>
                    <Check className="h-4 w-4 mr-2" />
                    Add Selected
                  </Button>
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    );
  }

  // Folders Grid View
  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Shortlist Folders</h1>
          <p className="text-muted-foreground">Organize applicants into folders for easy management</p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <FolderPlus className="mr-2 h-4 w-4" />
              Create New Folder
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Folder</DialogTitle>
              <DialogDescription>
                Create a new folder to organize your shortlisted applicants
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="folder-name">Folder Name</Label>
                <Input 
                  id="folder-name" 
                  placeholder="e.g., Infosys Applicants"
                  value={newFolderName}
                  onChange={(e) => setNewFolderName(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="folder-description">Description (Optional)</Label>
                <Textarea 
                  id="folder-description" 
                  placeholder="Add a description for this folder..."
                  rows={3}
                  value={newFolderDescription}
                  onChange={(e) => setNewFolderDescription(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>Folder Color</Label>
                <div className="flex gap-2">
                  {colorOptions.map((color) => (
                    <button
                      key={color.value}
                      className={`h-8 w-8 rounded-full ${color.class} transition-transform ${
                        newFolderColor === color.value ? "ring-2 ring-offset-2 ring-primary scale-110" : ""
                      }`}
                      onClick={() => setNewFolderColor(color.value)}
                    />
                  ))}
                </div>
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleCreateFolder}>
                Create Folder
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input 
          placeholder="Search folders..." 
          className="pl-10"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-blue-500/10 to-transparent">
          <CardContent className="py-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-blue-500/20 flex items-center justify-center">
                <Folder className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{folders.length}</p>
                <p className="text-sm text-muted-foreground">Total Folders</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-green-500/10 to-transparent">
          <CardContent className="py-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-green-500/20 flex items-center justify-center">
                <Users className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{folders.reduce((acc, f) => acc + f.count, 0)}</p>
                <p className="text-sm text-muted-foreground">Total Shortlisted</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-purple-500/10 to-transparent">
          <CardContent className="py-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-purple-500/20 flex items-center justify-center">
                <Share2 className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{folders.filter(f => f.isShared).length}</p>
                <p className="text-sm text-muted-foreground">Shared Folders</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-yellow-500/10 to-transparent">
          <CardContent className="py-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-yellow-500/20 flex items-center justify-center">
                <Star className="h-5 w-5 text-yellow-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{Math.round(folders.reduce((acc, f) => acc + f.count, 0) / folders.length)}</p>
                <p className="text-sm text-muted-foreground">Avg per Folder</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Folders Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredFolders.map((folder) => (
          <Card 
            key={folder.id} 
            className="group hover:shadow-lg transition-all duration-300 cursor-pointer border-l-4"
            style={{ borderLeftColor: `var(--${folder.color}-500, #3b82f6)` }}
            onClick={() => setSelectedFolder(folder)}
          >
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className={`h-12 w-12 rounded-lg flex items-center justify-center ${getColorClass(folder.color)}`}>
                    <Folder className="h-6 w-6" />
                  </div>
                  <div>
                    <CardTitle className="text-base group-hover:text-primary transition-colors">
                      {folder.name}
                    </CardTitle>
                    <p className="text-xs text-muted-foreground mt-1">
                      Created {folder.createdAt}
                    </p>
                  </div>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                    <Button variant="ghost" size="sm" className="opacity-0 group-hover:opacity-100 transition-opacity">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={(e) => { e.stopPropagation(); setSelectedFolder(folder); }}>
                      <Eye className="mr-2 h-4 w-4" />
                      View Folder
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={(e) => e.stopPropagation()}>
                      <Edit className="mr-2 h-4 w-4" />
                      Edit Folder
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={(e) => e.stopPropagation()}>
                      <Share2 className="mr-2 h-4 w-4" />
                      Share Folder
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={(e) => e.stopPropagation()}>
                      <Download className="mr-2 h-4 w-4" />
                      Export Folder
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem 
                      className="text-destructive"
                      onClick={(e) => { e.stopPropagation(); handleDeleteFolder(folder.id); }}
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      Delete Folder
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground line-clamp-2">
                {folder.description}
              </p>
              
              {/* Preview Avatars */}
              <div className="flex items-center gap-2">
                <div className="flex -space-x-2">
                  {(folderViews.find((fv) => fv.id === folder.id)?.applicants ?? [])
                    .slice(0, 4)
                    .map((applicant, i) => (
                    <Avatar key={applicant.id} className="h-7 w-7 border-2 border-background">
                      <AvatarFallback className="text-xs bg-primary/10 text-primary">
                        {applicant.name.split(" ").map((n) => n[0]).join("")}
                      </AvatarFallback>
                    </Avatar>
                  ))}
                  {folder.count > 4 && (
                    <div className="h-7 w-7 rounded-full bg-muted flex items-center justify-center text-xs font-medium border-2 border-background">
                      +{folder.count - 4}
                    </div>
                  )}
                </div>
              </div>
              
              <div className="flex items-center justify-between pt-2 border-t">
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">{folder.count} applicants</span>
                </div>
                {folder.isShared && (
                  <Badge variant="outline" className="text-xs">
                    <Share2 className="mr-1 h-3 w-3" />
                    Shared
                  </Badge>
                )}
              </div>

              <div className="flex gap-2">
                <Button variant="outline" size="sm" className="flex-1">
                  <Eye className="h-4 w-4 mr-2" />
                  View
                </Button>
                <Button variant="outline" size="sm" onClick={(e) => e.stopPropagation()}>
                  <Download className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Empty State */}
      {filteredFolders.length === 0 && (
        <Card className="shadow-sm">
          <CardContent className="py-12">
            <div className="text-center">
              <div className="mx-auto h-16 w-16 rounded-full bg-muted flex items-center justify-center mb-4">
                <FolderPlus className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-semibold mb-2">
                {searchQuery ? "No folders found" : "No folders yet"}
              </h3>
              <p className="text-muted-foreground mb-6">
                {searchQuery 
                  ? "Try adjusting your search query" 
                  : "Create your first folder to start organizing applicants"
                }
              </p>
              {!searchQuery && (
                <Button onClick={() => setIsCreateDialogOpen(true)}>
                  <FolderPlus className="mr-2 h-4 w-4" />
                  Create New Folder
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default FoldersManagement;
