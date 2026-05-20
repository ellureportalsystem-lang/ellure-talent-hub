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
import { Applicant } from "@/hooks/useApplicants";

interface ApplicantTableProps {
  applicants: Applicant[];
  selectedIds: string[];
  onSelectionChange: (ids: string[]) => void;
  sortField: string;
  sortDirection: "asc" | "desc";
  onSort: (field: string) => void;
  isAdmin?: boolean;
}

const statusColors: Record<string, string> = {
  submitted: "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950 dark:text-blue-300 dark:border-blue-800",
  Active: "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950 dark:text-emerald-300 dark:border-emerald-800",
  Shortlisted: "bg-violet-50 text-violet-700 border-violet-200 dark:bg-violet-950 dark:text-violet-300 dark:border-violet-800",
  Interview: "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950 dark:text-amber-300 dark:border-amber-800",
  Hired: "bg-sky-50 text-sky-700 border-sky-200 dark:bg-sky-950 dark:text-sky-300 dark:border-sky-800",
  Rejected: "bg-red-50 text-red-700 border-red-200 dark:bg-red-950 dark:text-red-300 dark:border-red-800",
  "On Hold": "bg-gray-50 text-gray-600 border-gray-200 dark:bg-gray-900 dark:text-gray-400 dark:border-gray-700",
};

const avatarColors = [
  "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300",
  "bg-violet-100 text-violet-700 dark:bg-violet-900 dark:text-violet-300",
  "bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300",
  "bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-300",
  "bg-rose-100 text-rose-700 dark:bg-rose-900 dark:text-rose-300",
  "bg-sky-100 text-sky-700 dark:bg-sky-900 dark:text-sky-300",
  "bg-teal-100 text-teal-700 dark:bg-teal-900 dark:text-teal-300",
];

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
    onSelectionChange(checked ? applicants.map((a) => a.id) : []);
  };

  const handleSelectOne = (id: string, checked: boolean) => {
    onSelectionChange(checked ? [...selectedIds, id] : selectedIds.filter((i) => i !== id));
  };

  const handleViewProfile = (applicantId: string) => {
    navigate(`/dashboard/admin/applicants/${applicantId}`);
  };

  const SortableHeader = ({ field, children }: { field: string; children: React.ReactNode }) => (
    <button
      className="flex items-center gap-1 hover:text-foreground transition-colors text-xs font-medium uppercase tracking-wider"
      onClick={() => onSort(field)}
    >
      {children}
      {sortField === field ? (
        sortDirection === "asc" ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />
      ) : (
        <ArrowUpDown className="h-3 w-3 opacity-30" />
      )}
    </button>
  );

  const getInitials = (name: string) =>
    name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);

  const getAvatarColor = (name: string) => {
    const idx = name.split("").reduce((a, c) => a + c.charCodeAt(0), 0) % avatarColors.length;
    return avatarColors[idx];
  };

  return (
    <TooltipProvider>
      <div className="rounded-lg border bg-card overflow-hidden min-w-0">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/40 hover:bg-muted/40 border-b">
                <TableHead className="w-10 pl-4">
                  <Checkbox
                    checked={selectedIds.length === applicants.length && applicants.length > 0}
                    onCheckedChange={handleSelectAll}
                  />
                </TableHead>
                <TableHead className="w-10"></TableHead>
                <TableHead className="min-w-[200px]">
                  <SortableHeader field="name">Candidate</SortableHeader>
                </TableHead>
                <TableHead className="min-w-[180px]">
                  <SortableHeader field="primarySkill">Role / Skills</SortableHeader>
                </TableHead>
                <TableHead className="w-[90px]">
                  <SortableHeader field="experience">Exp.</SortableHeader>
                </TableHead>
                <TableHead className="w-[110px]">
                  <SortableHeader field="currentCity">Location</SortableHeader>
                </TableHead>
                <TableHead className="w-[110px]">
                  <SortableHeader field="currentCTC">CTC</SortableHeader>
                </TableHead>
                <TableHead className="w-[90px]">
                  <SortableHeader field="noticePeriod">Notice</SortableHeader>
                </TableHead>
                <TableHead className="w-[90px]">
                  <SortableHeader field="status">Status</SortableHeader>
                </TableHead>
                <TableHead className="w-[100px]">
                  <SortableHeader field="lastActive">Updated</SortableHeader>
                </TableHead>
                <TableHead className="w-[80px] pr-4 text-right">
                  <span className="text-xs font-medium uppercase tracking-wider">Actions</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {applicants.map((applicant, index) => {
                const skills = (applicant.key_skills || applicant.skill || "").split(/[,;|]/).map(s => s.trim()).filter(Boolean);

                return (
                  <motion.tr
                    key={applicant.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.15, delay: index * 0.015 }}
                    className={`group hover:bg-muted/30 transition-colors cursor-pointer border-b last:border-0 ${
                      selectedIds.includes(applicant.id) ? "bg-primary/[0.03]" : ""
                    }`}
                    onClick={() => handleViewProfile(applicant.id)}
                  >
                    <TableCell className="pl-4" onClick={(e) => e.stopPropagation()}>
                      <Checkbox
                        checked={selectedIds.includes(applicant.id)}
                        onCheckedChange={(checked) => handleSelectOne(applicant.id, checked as boolean)}
                      />
                    </TableCell>
                    <TableCell onClick={(e) => e.stopPropagation()}>
                      <button className="p-0.5 hover:bg-muted rounded transition-colors">
                        <Star className="h-3.5 w-3.5 text-muted-foreground/40 hover:text-warning transition-colors" />
                      </button>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-9 w-9 flex-shrink-0">
                          <AvatarFallback className={`text-[11px] font-semibold ${getAvatarColor(applicant.name || 'U')}`}>
                            {getInitials(applicant.name || 'U')}
                          </AvatarFallback>
                        </Avatar>
                        <div className="min-w-0">
                          <p className="text-sm font-medium text-foreground truncate group-hover:text-primary transition-colors">
                            {applicant.name || 'Unknown'}
                          </p>
                          <p className="text-[11px] text-muted-foreground truncate">
                            {applicant.current_company || applicant.email}
                          </p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="min-w-0">
                        <p className="text-sm font-medium truncate">
                          {applicant.current_designation || applicant.job_role || applicant.skill_job_role_applying_for || applicant.skill || '--'}
                        </p>
                        {skills.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-1">
                            {skills.slice(0, 2).map((skill, idx) => (
                              <span key={idx} className="inline-block text-[10px] px-1.5 py-0.5 rounded bg-muted text-muted-foreground">
                                {skill}
                              </span>
                            ))}
                            {skills.length > 2 && (
                              <span className="inline-block text-[10px] px-1.5 py-0.5 rounded bg-muted text-muted-foreground">
                                +{skills.length - 2}
                              </span>
                            )}
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm tabular-nums">
                        {(() => {
                          const exp = parseFloat(applicant.total_experience_numbers || applicant.total_experience || '0');
                          return exp === 0 ? "Fresher" : `${exp} yrs`;
                        })()}
                      </span>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm text-muted-foreground">
                        {applicant.city || applicant.city_current_location || '--'}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="text-sm tabular-nums">{applicant.current_ctc ? `${applicant.current_ctc}` : '--'}</p>
                        {(applicant.expected_ctc || (applicant as any).exp_ctc) && (
                          <p className="text-[10px] text-muted-foreground tabular-nums">
                            Exp: {applicant.expected_ctc || (applicant as any).exp_ctc}
                          </p>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={`text-[10px] font-normal ${
                          applicant.notice_period === "Immediate"
                            ? "border-emerald-300 text-emerald-700 dark:border-emerald-700 dark:text-emerald-400"
                            : "border-border"
                        }`}
                      >
                        {applicant.notice_period || '--'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={`text-[10px] font-normal ${statusColors[applicant.status] || statusColors['submitted']}`}
                      >
                        {applicant.status || 'submitted'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <span className="text-[11px] text-muted-foreground tabular-nums">
                        {(applicant as any).updated_at
                          ? new Date((applicant as any).updated_at).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })
                          : new Date(applicant.created_at).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })}
                      </span>
                    </TableCell>
                    <TableCell className="pr-4" onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center justify-end gap-0.5 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => handleViewProfile(applicant.id)}>
                              <Eye className="h-3.5 w-3.5" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent side="bottom" className="text-xs">View Profile</TooltipContent>
                        </Tooltip>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-7 w-7">
                              <Download className="h-3.5 w-3.5" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent side="bottom" className="text-xs">Download Resume</TooltipContent>
                        </Tooltip>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-7 w-7">
                              <MoreHorizontal className="h-3.5 w-3.5" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-44">
                            <DropdownMenuItem className="text-xs">
                              <Eye className="mr-2 h-3.5 w-3.5" /> View Full Profile
                            </DropdownMenuItem>
                            <DropdownMenuItem className="text-xs">
                              <FileText className="mr-2 h-3.5 w-3.5" /> Download Resume
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="text-xs">
                              <Star className="mr-2 h-3.5 w-3.5" /> Add to Shortlist
                            </DropdownMenuItem>
                            <DropdownMenuItem className="text-xs">
                              <FolderPlus className="mr-2 h-3.5 w-3.5" /> Add to Folder
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="text-xs">
                              <Phone className="mr-2 h-3.5 w-3.5" /> Call
                            </DropdownMenuItem>
                            <DropdownMenuItem className="text-xs">
                              <Mail className="mr-2 h-3.5 w-3.5" /> Email
                            </DropdownMenuItem>
                            <DropdownMenuItem className="text-xs">
                              <MessageSquare className="mr-2 h-3.5 w-3.5" /> Add Note
                            </DropdownMenuItem>
                            {isAdmin && (
                              <>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem className="text-xs">
                                  <UserPlus className="mr-2 h-3.5 w-3.5" /> Assign to Client
                                </DropdownMenuItem>
                                <DropdownMenuItem className="text-xs text-destructive focus:text-destructive">
                                  <Trash2 className="mr-2 h-3.5 w-3.5" /> Delete
                                </DropdownMenuItem>
                              </>
                            )}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </TableCell>
                  </motion.tr>
                );
              })}
            </TableBody>
          </Table>
        </div>
      </div>
    </TooltipProvider>
  );
};

export default ApplicantTable;
