import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { 
  Search, Filter, Download, Star, FolderPlus, Eye, MoreHorizontal
} from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const CandidatesPage = () => {
  const navigate = useNavigate();
  const mockApplicants = [
    { id: 1, name: "Priya Sharma", skill: "Full Stack Developer", city: "Mumbai", experience: "3 years", ctc: "₹8 LPA" },
    { id: 2, name: "Rahul Kumar", skill: "Data Analyst", city: "Delhi", experience: "2 years", ctc: "₹6 LPA" },
    { id: 3, name: "Anita Patel", skill: "UI/UX Designer", city: "Bangalore", experience: "4 years", ctc: "₹10 LPA" },
    { id: 4, name: "Vikram Singh", skill: "Product Manager", city: "Pune", experience: "5 years", ctc: "₹15 LPA" },
  ];
  
  const handleViewProfile = (candidateId: number) => {
    navigate(`/dashboard/client/candidates/${candidateId}`);
  };

  return (
    <div className="space-y-6">
      {/* Filters */}
      <Card className="shadow-sm">
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <div className="relative lg:col-span-2">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search candidates..."
                className="pl-9"
              />
            </div>
            
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="City" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Cities</SelectItem>
                <SelectItem value="mumbai">Mumbai</SelectItem>
                <SelectItem value="delhi">Delhi</SelectItem>
                <SelectItem value="bangalore">Bangalore</SelectItem>
              </SelectContent>
            </Select>

            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Experience" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Experience</SelectItem>
                <SelectItem value="fresher">Fresher</SelectItem>
                <SelectItem value="1-3">1-3 years</SelectItem>
                <SelectItem value="3-5">3-5 years</SelectItem>
              </SelectContent>
            </Select>

            <Button variant="outline">
              <Filter className="mr-2 h-4 w-4" />
              More Filters
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Candidates Table */}
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>Talent Pool</CardTitle>
        </CardHeader>
        <CardContent>
          {/* Bulk Actions */}
          <div className="flex items-center gap-2 mb-4 pb-4 border-b flex-wrap">
            <Button variant="outline" size="sm">
              <FolderPlus className="mr-2 h-4 w-4" />
              Add to Shortlist
            </Button>
            <Button variant="outline" size="sm">
              <Star className="mr-2 h-4 w-4" />
              Mark Favorite
            </Button>
            <Button variant="outline" size="sm">
              <Download className="mr-2 h-4 w-4" />
              Export Selected
            </Button>
            <div className="ml-auto text-sm text-muted-foreground">
              0 selected
            </div>
          </div>

          {/* Table */}
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">
                    <Checkbox />
                  </TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Skill</TableHead>
                  <TableHead>City</TableHead>
                  <TableHead>Experience</TableHead>
                  <TableHead>Current CTC</TableHead>
                  <TableHead className="w-12"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockApplicants.map((applicant) => (
                  <TableRow key={applicant.id} className="hover:bg-muted/50">
                    <TableCell>
                      <Checkbox />
                    </TableCell>
                    <TableCell className="font-medium">
                      <button
                        onClick={() => handleViewProfile(applicant.id)}
                        className="hover:text-primary hover:underline cursor-pointer"
                      >
                        {applicant.name}
                      </button>
                    </TableCell>
                    <TableCell>{applicant.skill}</TableCell>
                    <TableCell>{applicant.city}</TableCell>
                    <TableCell>{applicant.experience}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{applicant.ctc}</Badge>
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleViewProfile(applicant.id)}>
                            <Eye className="mr-2 h-4 w-4" />
                            View Profile
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Star className="mr-2 h-4 w-4" />
                            Add to Favorite
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Download className="mr-2 h-4 w-4" />
                            Download Resume
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between mt-4">
            <p className="text-sm text-muted-foreground">
              Showing 1-4 of 847 candidates
            </p>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" disabled>
                Previous
              </Button>
              <Button variant="outline" size="sm">
                Next
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CandidatesPage;
