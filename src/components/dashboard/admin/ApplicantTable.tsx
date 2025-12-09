import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Eye,
  Star,
  Download,
  FolderPlus,
  Mail,
  Phone,
  MoreHorizontal,
  Trash2,
  UserPlus,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  MessageSquare,
  FileText,
} from "lucide-react";
import { Applicant } from "@/data/mockApplicants";

interface ApplicantTableProps {
  applicants: Applicant[];
  selectedIds: number[];
  onSelectionChange: (ids: number[]) => void;
  sortField: string;
  sortDirection: "asc" | "desc";
  onSort: (field: string) => void;
  isAdmin?: boolean;
}

const statusColors: Record<string, string> = {
  Active: "bg-success/10 text-success border-success/20",
  Shortlisted: "bg-primary/10 text-primary border-primary/20",
  Interview: "bg-warning/10 text-warning border-warning/20",
  Hired: "bg-info/10 text-info border-info/20",
  Rejected: "bg-destructive/10 text-destructive border-destructive/20",
  "On Hold": "bg-muted text-muted-foreground border-border",
};

const ApplicantTable = ({
  applicants,
  selectedIds,
  onSelectionChange,
  sortField,
  sortDirection,
  onSort,
  isAdmin = true,
}: ApplicantTableProps) => {
  const navigate = useNavigate();

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      onSelectionChange(applicants.map((a) => a.id));
    } else {
      onSelectionChange([]);
    }
  };

  const handleSelectOne = (id: number, checked: boolean) => {
    if (checked) {
      onSelectionChange([...selectedIds, id]);
    } else {
      onSelectionChange(selectedIds.filter((i) => i !== id));
    }
  };

  const toggleFavorite = (id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    // Handle favorite toggle
  };

  const handleViewProfile = (applicantId: number) => {
    navigate(`/dashboard/admin/applicants/${applicantId}`);
  };

  const SortableHeader = ({
    field,
    children,
  }: {
    field: string;
    children: React.ReactNode;
  }) => (
    <button
      className="flex items-center gap-1 hover:text-primary transition-colors"
      onClick={() => onSort(field)}
    >
      {children}
      {sortField === field ? (
        sortDirection === "asc" ? (
          <ArrowUp className="h-3 w-3" />
        ) : (
          <ArrowDown className="h-3 w-3" />
        )
      ) : (
        <ArrowUpDown className="h-3 w-3 opacity-50" />
      )}
    </button>
  );

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  return (
    <TooltipProvider>
      <div className="rounded-xl border bg-card overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50 hover:bg-muted/50">
              <TableHead className="w-12">
                <Checkbox
                  checked={
                    selectedIds.length === applicants.length &&
                    applicants.length > 0
                  }
                  onCheckedChange={handleSelectAll}
                />
              </TableHead>
              <TableHead className="w-12"></TableHead>
              <TableHead>
                <SortableHeader field="name">Candidate</SortableHeader>
              </TableHead>
              <TableHead>
                <SortableHeader field="primarySkill">Role / Skills</SortableHeader>
              </TableHead>
              <TableHead>
                <SortableHeader field="experience">Experience</SortableHeader>
              </TableHead>
              <TableHead>
                <SortableHeader field="currentCity">Location</SortableHeader>
              </TableHead>
              <TableHead>
                <SortableHeader field="currentCTC">CTC (LPA)</SortableHeader>
              </TableHead>
              <TableHead>
                <SortableHeader field="noticePeriod">Notice</SortableHeader>
              </TableHead>
              <TableHead>
                <SortableHeader field="status">Status</SortableHeader>
              </TableHead>
              <TableHead>
                <SortableHeader field="lastActive">Last Active</SortableHeader>
              </TableHead>
              <TableHead className="w-20">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {applicants.map((applicant, index) => (
              <motion.tr
                key={applicant.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2, delay: index * 0.02 }}
                className={`group hover:bg-muted/30 transition-colors cursor-pointer ${
                  selectedIds.includes(applicant.id) ? "bg-primary/5" : ""
                }`}
                onClick={() => handleViewProfile(applicant.id)}
              >
                <TableCell onClick={(e) => e.stopPropagation()}>
                  <Checkbox
                    checked={selectedIds.includes(applicant.id)}
                    onCheckedChange={(checked) =>
                      handleSelectOne(applicant.id, checked as boolean)
                    }
                  />
                </TableCell>
                <TableCell onClick={(e) => e.stopPropagation()}>
                  <button
                    onClick={(e) => toggleFavorite(applicant.id, e)}
                    className="p-1 hover:bg-muted rounded transition-colors"
                  >
                    <Star
                      className={`h-4 w-4 ${
                        applicant.isFavorite
                          ? "fill-warning text-warning"
                          : "text-muted-foreground"
                      }`}
                    />
                  </button>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10 border-2 border-muted">
                      <AvatarFallback className="bg-primary/10 text-primary text-sm font-medium">
                        {getInitials(applicant.name)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium text-foreground group-hover:text-primary transition-colors">
                        {applicant.name}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {applicant.currentCompany}
                      </p>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div>
                    <p className="font-medium text-sm">{applicant.designation}</p>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {applicant.skills.slice(0, 2).map((skill) => (
                        <Badge
                          key={skill}
                          variant="secondary"
                          className="text-xs py-0"
                        >
                          {skill}
                        </Badge>
                      ))}
                      {applicant.skills.length > 2 && (
                        <Badge variant="outline" className="text-xs py-0">
                          +{applicant.skills.length - 2}
                        </Badge>
                      )}
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <span className="font-medium">
                    {applicant.experience === 0
                      ? "Fresher"
                      : `${applicant.experience} yrs`}
                  </span>
                </TableCell>
                <TableCell>
                  <div>
                    <p className="text-sm">{applicant.currentCity}</p>
                    {applicant.preferredCity !== applicant.currentCity && (
                      <p className="text-xs text-muted-foreground">
                        Pref: {applicant.preferredCity}
                      </p>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <div>
                    <p className="font-medium">₹{applicant.currentCTC}L</p>
                    <p className="text-xs text-muted-foreground">
                      Exp: ₹{applicant.expectedCTC}L
                    </p>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge
                    variant="outline"
                    className={`text-xs ${
                      applicant.noticePeriod === "Immediate"
                        ? "border-success text-success"
                        : ""
                    }`}
                  >
                    {applicant.noticePeriod}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge
                    variant="outline"
                    className={`${statusColors[applicant.status]}`}
                  >
                    {applicant.status}
                  </Badge>
                </TableCell>
                <TableCell>
                  <span className="text-sm text-muted-foreground">
                    {applicant.lastActive}
                  </span>
                </TableCell>
                <TableCell onClick={(e) => e.stopPropagation()}>
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0"
                          onClick={() => handleViewProfile(applicant.id)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>View Profile</TooltipContent>
                    </Tooltip>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                          <Download className="h-4 w-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>Download Resume</TooltipContent>
                    </Tooltip>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-48">
                        <DropdownMenuItem>
                          <Eye className="mr-2 h-4 w-4" />
                          View Full Profile
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <FileText className="mr-2 h-4 w-4" />
                          Download Resume
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>
                          <Star className="mr-2 h-4 w-4" />
                          Add to Shortlist
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <FolderPlus className="mr-2 h-4 w-4" />
                          Add to Folder
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>
                          <Phone className="mr-2 h-4 w-4" />
                          Call Candidate
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Mail className="mr-2 h-4 w-4" />
                          Send Email
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <MessageSquare className="mr-2 h-4 w-4" />
                          Add Note
                        </DropdownMenuItem>
                        {isAdmin && (
                          <>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem>
                              <UserPlus className="mr-2 h-4 w-4" />
                              Assign to Client
                            </DropdownMenuItem>
                            <DropdownMenuItem className="text-destructive">
                              <Trash2 className="mr-2 h-4 w-4" />
                              Delete Profile
                            </DropdownMenuItem>
                          </>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </TableCell>
              </motion.tr>
            ))}
          </TableBody>
        </Table>
      </div>
    </TooltipProvider>
  );
};

export default ApplicantTable;
