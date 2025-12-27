import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Checkbox } from "@/components/ui/checkbox";
import { 
  FolderPlus, Folder, Users, Download, Share2, MoreHorizontal,
  Search, Plus, Eye, FolderOpen, Star, ArrowLeft,
  UserPlus, X, Check, Trash2
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
import { mockApplicants } from "@/data/mockApplicants";

interface Folder {
  id: number;
  name: string;
  description: string;
  count: number;
  createdAt: string;
  applicantIds: number[];
  color: string;
}

const ClientFoldersManagement = () => {
  const navigate = useNavigate();
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [selectedFolder, setSelectedFolder] = useState<Folder | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [newFolderName, setNewFolderName] = useState("");
  const [newFolderDescription, setNewFolderDescription] = useState("");
  const [newFolderColor, setNewFolderColor] = useState("blue");
  const [selectedApplicants, setSelectedApplicants] = useState<number[]>([]);
  const [isAddApplicantsDialogOpen, setIsAddApplicantsDialogOpen] = useState(false);

  const [folders, setFolders] = useState<Folder[]>([
    { 
      id: 1, 
      name: "Java Developers", 
      description: "Shortlisted Java developers for backend role", 
      count: 12, 
      createdAt: "2024-01-15", 
      applicantIds: mockApplicants.slice(0, 12).map(a => a.id),
      color: "blue"
    },
    { 
      id: 2, 
      name: "Frontend Experts", 
      description: "React and Angular developers", 
      count: 8, 
      createdAt: "2024-01-20", 
      applicantIds: mockApplicants.slice(5, 13).map(a => a.id),
      color: "green"
    },
    { 
      id: 3, 
      name: "Data Scientists", 
      description: "ML and AI specialists", 
      count: 6, 
      createdAt: "2024-02-01", 
      applicantIds: mockApplicants.slice(10, 16).map(a => a.id),
      color: "purple"
    },
  ]);

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

  const handleCreateFolder = () => {
    if (newFolderName.trim()) {
      const newFolder: Folder = {
        id: Date.now(),
        name: newFolderName,
        description: newFolderDescription,
        count: 0,
        createdAt: new Date().toISOString().split('T')[0],
        applicantIds: [],
        color: newFolderColor,
      };
      setFolders([newFolder, ...folders]);
      setNewFolderName("");
      setNewFolderDescription("");
      setNewFolderColor("blue");
      setIsCreateDialogOpen(false);
      toast.success("Folder created successfully");
    }
  };

  const handleDeleteFolder = (folderId: number) => {
    setFolders(folders.filter(f => f.id !== folderId));
    toast.success("Folder deleted");
  };

  const handleAddApplicantsToFolder = () => {
    if (selectedFolder && selectedApplicants.length > 0) {
      setFolders(folders.map(f => {
        if (f.id === selectedFolder.id) {
          const newApplicantIds = [...new Set([...f.applicantIds, ...selectedApplicants])];
          return { ...f, applicantIds: newApplicantIds, count: newApplicantIds.length };
        }
        return f;
      }));
      setSelectedApplicants([]);
      setIsAddApplicantsDialogOpen(false);
      toast.success(`${selectedApplicants.length} candidates added to folder`);
    }
  };

  const handleRemoveFromFolder = (applicantId: number) => {
    if (selectedFolder) {
      setFolders(folders.map(f => {
        if (f.id === selectedFolder.id) {
          const newApplicantIds = f.applicantIds.filter(id => id !== applicantId);
          return { ...f, applicantIds: newApplicantIds, count: newApplicantIds.length };
        }
        return f;
      }));
      setSelectedFolder(prev => prev ? {
        ...prev,
        applicantIds: prev.applicantIds.filter(id => id !== applicantId),
        count: prev.count - 1
      } : null);
      toast.success("Candidate removed from folder");
    }
  };

  const handleViewProfile = (applicantId: number) => {
    navigate(`/dashboard/client/candidates/${applicantId}`);
  };

  const filteredFolders = folders.filter(f => 
    f.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    f.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const folderApplicants = selectedFolder 
    ? mockApplicants.filter(a => selectedFolder.applicantIds.includes(a.id))
    : [];

  // Folder Detail View
  if (selectedFolder) {
    return (
      <div className="p-6 space-y-6">
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
                <p className="text-sm text-muted-foreground">{selectedFolder.count} candidates</p>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={() => setIsAddApplicantsDialogOpen(true)}>
              <UserPlus className="h-4 w-4 mr-2" />
              Add Candidates
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
                <p className="text-sm">Created: {selectedFolder.createdAt}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Candidates in Folder */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Candidates in this Folder</CardTitle>
              <div className="relative w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Search candidates..." className="pl-10" />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {folderApplicants.length === 0 ? (
              <div className="text-center py-12">
                <Users className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="font-semibold mb-2">No candidates in this folder</h3>
                <p className="text-sm text-muted-foreground mb-4">Add candidates to organize your shortlist</p>
                <Button onClick={() => setIsAddApplicantsDialogOpen(true)}>
                  <UserPlus className="h-4 w-4 mr-2" />
                  Add Candidates
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
                        <p 
                          className="font-medium cursor-pointer hover:text-primary"
                          onClick={() => handleViewProfile(applicant.id)}
                        >
                          {applicant.name}
                        </p>
                        <div className="flex items-center gap-3 text-sm text-muted-foreground">
                          <span>{applicant.designation}</span>
                          <span>•</span>
                          <span>{applicant.experience} yrs exp</span>
                          <span>•</span>
                          <span>{applicant.currentCity}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="flex gap-1">
                        {applicant.skills.slice(0, 3).map((skill, i) => (
                          <Badge key={i} variant="secondary" className="text-xs">
                            {skill}
                          </Badge>
                        ))}
                      </div>
                      <div className="flex items-center gap-1">
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-8 w-8"
                          onClick={() => handleViewProfile(applicant.id)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <Download className="h-4 w-4" />
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

        {/* Add Candidates Dialog */}
        <Dialog open={isAddApplicantsDialogOpen} onOpenChange={setIsAddApplicantsDialogOpen}>
          <DialogContent className="max-w-2xl max-h-[80vh]">
            <DialogHeader>
              <DialogTitle>Add Candidates to {selectedFolder.name}</DialogTitle>
              <DialogDescription>
                Select candidates to add to this folder
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Search candidates..." className="pl-10" />
              </div>
              <div className="max-h-[400px] overflow-y-auto space-y-2">
                {mockApplicants.filter(a => !selectedFolder.applicantIds.includes(a.id)).slice(0, 20).map((applicant) => (
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
                        {applicant.skills.slice(0, 2).join(", ")} • {applicant.experience} yrs
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex items-center justify-between pt-4 border-t">
                <span className="text-sm text-muted-foreground">
                  {selectedApplicants.length} candidates selected
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
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">My Shortlists</h1>
          <p className="text-muted-foreground">Organize candidates into folders for easy management</p>
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
                Create a new folder to organize your shortlisted candidates
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="folder-name">Folder Name</Label>
                <Input 
                  id="folder-name" 
                  placeholder="e.g., Backend Developers"
                  value={newFolderName}
                  onChange={(e) => setNewFolderName(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="folder-desc">Description</Label>
                <Textarea 
                  id="folder-desc" 
                  placeholder="Brief description of this folder"
                  value={newFolderDescription}
                  onChange={(e) => setNewFolderDescription(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>Color</Label>
                <div className="flex gap-2">
                  {colorOptions.map(color => (
                    <button
                      key={color.value}
                      className={`h-8 w-8 rounded-full ${color.class} transition-transform ${
                        newFolderColor === color.value ? "scale-110 ring-2 ring-offset-2 ring-primary" : ""
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
              <Button onClick={handleCreateFolder} disabled={!newFolderName.trim()}>
                Create Folder
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Folders</p>
                <p className="text-3xl font-bold mt-1">{folders.length}</p>
              </div>
              <div className="h-12 w-12 rounded-lg bg-info/10 flex items-center justify-center">
                <Folder className="h-6 w-6 text-info" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Shortlisted</p>
                <p className="text-3xl font-bold mt-1">
                  {folders.reduce((acc, f) => acc + f.count, 0)}
                </p>
              </div>
              <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                <Users className="h-6 w-6 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Avg. per Folder</p>
                <p className="text-3xl font-bold mt-1">
                  {folders.length > 0 ? Math.round(folders.reduce((acc, f) => acc + f.count, 0) / folders.length) : 0}
                </p>
              </div>
              <div className="h-12 w-12 rounded-lg bg-success/10 flex items-center justify-center">
                <Star className="h-6 w-6 text-success" />
              </div>
            </div>
          </CardContent>
        </Card>
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

      {/* Folders Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredFolders.map((folder) => (
          <Card 
            key={folder.id}
            className="shadow-sm hover:shadow-md transition-all cursor-pointer group"
            onClick={() => setSelectedFolder(folder)}
          >
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className={`h-12 w-12 rounded-lg flex items-center justify-center ${getColorClass(folder.color)}`}>
                  <Folder className="h-6 w-6" />
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                    <Button variant="ghost" size="icon" className="opacity-0 group-hover:opacity-100 transition-opacity">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={(e) => {
                      e.stopPropagation();
                      setSelectedFolder(folder);
                    }}>
                      <Eye className="mr-2 h-4 w-4" />
                      View Folder
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={(e) => e.stopPropagation()}>
                      <Download className="mr-2 h-4 w-4" />
                      Export
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem 
                      className="text-destructive"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteFolder(folder.id);
                      }}
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              <h3 className="font-semibold text-lg mb-1">{folder.name}</h3>
              <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
                {folder.description}
              </p>
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-muted-foreground" />
                  <span>{folder.count} candidates</span>
                </div>
                <span className="text-muted-foreground">{folder.createdAt}</span>
              </div>
            </CardContent>
          </Card>
        ))}

        {/* Empty State - Create New Folder */}
        <Card 
          className="shadow-sm border-dashed cursor-pointer hover:border-primary/50 transition-colors"
          onClick={() => setIsCreateDialogOpen(true)}
        >
          <CardContent className="p-6 flex flex-col items-center justify-center h-full min-h-[200px]">
            <div className="h-12 w-12 rounded-lg bg-muted flex items-center justify-center mb-4">
              <Plus className="h-6 w-6 text-muted-foreground" />
            </div>
            <p className="font-medium text-muted-foreground">Create New Folder</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ClientFoldersManagement;
