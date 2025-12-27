import { useState, useMemo } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { 
  Search, Filter, Download, Star, FolderPlus, Eye, MoreHorizontal,
  ChevronDown, ChevronUp, MapPin, Briefcase, GraduationCap,
  Clock, X, SlidersHorizontal, RefreshCw
} from "lucide-react";
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
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { toast } from "sonner";
import { mockApplicants, Applicant } from "@/data/mockApplicants";

const CandidatesPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  
  // Initialize search from URL params
  const initialSearch = searchParams.get('q') || '';
  const initialLocation = searchParams.get('location') || '';
  
  const [searchQuery, setSearchQuery] = useState(initialSearch);
  const [selectedCandidates, setSelectedCandidates] = useState<number[]>([]);
  const [sortField, setSortField] = useState<keyof Applicant>('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [currentPage, setCurrentPage] = useState(1);
  const [filtersOpen, setFiltersOpen] = useState(false);
  
  // Filter states
  const [experienceRange, setExperienceRange] = useState([0, 15]);
  const [salaryRange, setSalaryRange] = useState([0, 50]);
  const [selectedCities, setSelectedCities] = useState<string[]>(initialLocation ? [initialLocation] : []);
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [selectedEducation, setSelectedEducation] = useState<string[]>([]);
  const [selectedNotice, setSelectedNotice] = useState<string[]>([]);
  const [selectedStatus, setSelectedStatus] = useState<string[]>([]);
  
  const itemsPerPage = 15;

  // Get unique values for filters
  const cities = [...new Set(mockApplicants.map(a => a.currentCity))].sort();
  const skills = [...new Set(mockApplicants.flatMap(a => a.skills))].sort();
  const educationLevels = [...new Set(mockApplicants.map(a => a.education.highest))].sort();
  const noticePeriods = [...new Set(mockApplicants.map(a => a.noticePeriod))];
  const statuses = ['Active', 'Shortlisted', 'Interview', 'Hired', 'On Hold'];

  // Filter and sort candidates
  const filteredCandidates = useMemo(() => {
    let result = [...mockApplicants];
    
    // Text search
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(a => 
        a.name.toLowerCase().includes(query) ||
        a.skills.some(s => s.toLowerCase().includes(query)) ||
        a.designation.toLowerCase().includes(query) ||
        a.currentCompany.toLowerCase().includes(query) ||
        a.currentCity.toLowerCase().includes(query)
      );
    }
    
    // Experience filter
    result = result.filter(a => 
      a.experience >= experienceRange[0] && a.experience <= experienceRange[1]
    );
    
    // Salary filter
    result = result.filter(a => 
      a.currentCTC >= salaryRange[0] && a.currentCTC <= salaryRange[1]
    );
    
    // City filter
    if (selectedCities.length > 0) {
      result = result.filter(a => selectedCities.includes(a.currentCity));
    }
    
    // Skills filter
    if (selectedSkills.length > 0) {
      result = result.filter(a => 
        selectedSkills.some(skill => a.skills.includes(skill))
      );
    }
    
    // Education filter
    if (selectedEducation.length > 0) {
      result = result.filter(a => selectedEducation.includes(a.education.highest));
    }
    
    // Notice period filter
    if (selectedNotice.length > 0) {
      result = result.filter(a => selectedNotice.includes(a.noticePeriod));
    }
    
    // Status filter
    if (selectedStatus.length > 0) {
      result = result.filter(a => selectedStatus.includes(a.status));
    }
    
    // Sort
    result.sort((a, b) => {
      const aVal = a[sortField];
      const bVal = b[sortField];
      if (typeof aVal === 'string' && typeof bVal === 'string') {
        return sortOrder === 'asc' ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
      }
      if (typeof aVal === 'number' && typeof bVal === 'number') {
        return sortOrder === 'asc' ? aVal - bVal : bVal - aVal;
      }
      return 0;
    });
    
    return result;
  }, [searchQuery, experienceRange, salaryRange, selectedCities, selectedSkills, selectedEducation, selectedNotice, selectedStatus, sortField, sortOrder]);

  // Pagination
  const totalPages = Math.ceil(filteredCandidates.length / itemsPerPage);
  const paginatedCandidates = filteredCandidates.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleSort = (field: keyof Applicant) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  const handleSelectAll = () => {
    if (selectedCandidates.length === paginatedCandidates.length) {
      setSelectedCandidates([]);
    } else {
      setSelectedCandidates(paginatedCandidates.map(c => c.id));
    }
  };

  const handleSelectCandidate = (id: number) => {
    setSelectedCandidates(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const handleViewProfile = (candidateId: number) => {
    navigate(`/dashboard/client/candidates/${candidateId}`);
  };

  const handleAddToFolder = () => {
    toast.success(`${selectedCandidates.length} candidates added to folder`);
    setSelectedCandidates([]);
  };

  const handleDownloadResumes = () => {
    toast.success(`Downloading ${selectedCandidates.length} resumes...`);
  };

  const handleMarkFavorite = () => {
    toast.success(`${selectedCandidates.length} candidates marked as favorite`);
    setSelectedCandidates([]);
  };

  const clearFilters = () => {
    setExperienceRange([0, 15]);
    setSalaryRange([0, 50]);
    setSelectedCities([]);
    setSelectedSkills([]);
    setSelectedEducation([]);
    setSelectedNotice([]);
    setSelectedStatus([]);
    setSearchQuery('');
  };

  const activeFiltersCount = [
    experienceRange[0] !== 0 || experienceRange[1] !== 15,
    salaryRange[0] !== 0 || salaryRange[1] !== 50,
    selectedCities.length > 0,
    selectedSkills.length > 0,
    selectedEducation.length > 0,
    selectedNotice.length > 0,
    selectedStatus.length > 0,
  ].filter(Boolean).length;

  const FilterSection = ({ 
    title, 
    icon: Icon, 
    children,
    defaultOpen = false 
  }: { 
    title: string; 
    icon: React.ElementType; 
    children: React.ReactNode;
    defaultOpen?: boolean;
  }) => {
    const [isOpen, setIsOpen] = useState(defaultOpen);
    
    return (
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CollapsibleTrigger className="flex items-center justify-between w-full py-3 text-sm font-medium hover:text-primary transition-colors">
          <div className="flex items-center gap-2">
            <Icon className="h-4 w-4" />
            {title}
          </div>
          {isOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        </CollapsibleTrigger>
        <CollapsibleContent className="pb-4 space-y-2">
          {children}
        </CollapsibleContent>
      </Collapsible>
    );
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Candidate Search</h1>
          <p className="text-muted-foreground">Browse and shortlist candidates for your requirements</p>
        </div>
      </div>

      {/* Search Bar */}
      <Card className="shadow-sm">
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search by name, skills, designation, company, location..."
                className="pl-9"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            <div className="flex gap-2">
              <Sheet open={filtersOpen} onOpenChange={setFiltersOpen}>
                <SheetTrigger asChild>
                  <Button variant="outline" className="relative">
                    <SlidersHorizontal className="mr-2 h-4 w-4" />
                    Filters
                    {activeFiltersCount > 0 && (
                      <Badge className="ml-2 h-5 w-5 p-0 flex items-center justify-center text-xs">
                        {activeFiltersCount}
                      </Badge>
                    )}
                  </Button>
                </SheetTrigger>
                <SheetContent className="w-[400px] overflow-y-auto">
                  <SheetHeader>
                    <SheetTitle>Filter Candidates</SheetTitle>
                    <SheetDescription>
                      Refine your search with advanced filters
                    </SheetDescription>
                  </SheetHeader>
                  
                  <div className="mt-6 space-y-1 divide-y">
                    {/* Experience Range */}
                    <FilterSection title="Experience" icon={Briefcase} defaultOpen>
                      <div className="px-2">
                        <Slider
                          value={experienceRange}
                          onValueChange={setExperienceRange}
                          max={15}
                          step={1}
                          className="my-4"
                        />
                        <div className="flex justify-between text-sm text-muted-foreground">
                          <span>{experienceRange[0]} years</span>
                          <span>{experienceRange[1]}+ years</span>
                        </div>
                      </div>
                    </FilterSection>

                    {/* Salary Range */}
                    <FilterSection title="Current CTC (LPA)" icon={Briefcase}>
                      <div className="px-2">
                        <Slider
                          value={salaryRange}
                          onValueChange={setSalaryRange}
                          max={50}
                          step={1}
                          className="my-4"
                        />
                        <div className="flex justify-between text-sm text-muted-foreground">
                          <span>₹{salaryRange[0]} LPA</span>
                          <span>₹{salaryRange[1]}+ LPA</span>
                        </div>
                      </div>
                    </FilterSection>

                    {/* Location */}
                    <FilterSection title="Location" icon={MapPin} defaultOpen>
                      <div className="grid grid-cols-2 gap-2">
                        {cities.map(city => (
                          <label key={city} className="flex items-center gap-2 text-sm cursor-pointer">
                            <Checkbox
                              checked={selectedCities.includes(city)}
                              onCheckedChange={(checked) => {
                                if (checked) {
                                  setSelectedCities([...selectedCities, city]);
                                } else {
                                  setSelectedCities(selectedCities.filter(c => c !== city));
                                }
                              }}
                            />
                            {city}
                          </label>
                        ))}
                      </div>
                    </FilterSection>

                    {/* Skills */}
                    <FilterSection title="Skills" icon={Briefcase}>
                      <div className="max-h-48 overflow-y-auto space-y-2">
                        {skills.slice(0, 20).map(skill => (
                          <label key={skill} className="flex items-center gap-2 text-sm cursor-pointer">
                            <Checkbox
                              checked={selectedSkills.includes(skill)}
                              onCheckedChange={(checked) => {
                                if (checked) {
                                  setSelectedSkills([...selectedSkills, skill]);
                                } else {
                                  setSelectedSkills(selectedSkills.filter(s => s !== skill));
                                }
                              }}
                            />
                            {skill}
                          </label>
                        ))}
                      </div>
                    </FilterSection>

                    {/* Education */}
                    <FilterSection title="Education" icon={GraduationCap}>
                      <div className="space-y-2">
                        {educationLevels.map(level => (
                          <label key={level} className="flex items-center gap-2 text-sm cursor-pointer">
                            <Checkbox
                              checked={selectedEducation.includes(level)}
                              onCheckedChange={(checked) => {
                                if (checked) {
                                  setSelectedEducation([...selectedEducation, level]);
                                } else {
                                  setSelectedEducation(selectedEducation.filter(e => e !== level));
                                }
                              }}
                            />
                            {level}
                          </label>
                        ))}
                      </div>
                    </FilterSection>

                    {/* Notice Period */}
                    <FilterSection title="Notice Period" icon={Clock}>
                      <div className="space-y-2">
                        {noticePeriods.map(period => (
                          <label key={period} className="flex items-center gap-2 text-sm cursor-pointer">
                            <Checkbox
                              checked={selectedNotice.includes(period)}
                              onCheckedChange={(checked) => {
                                if (checked) {
                                  setSelectedNotice([...selectedNotice, period]);
                                } else {
                                  setSelectedNotice(selectedNotice.filter(n => n !== period));
                                }
                              }}
                            />
                            {period}
                          </label>
                        ))}
                      </div>
                    </FilterSection>
                  </div>

                  <div className="mt-6 flex gap-2">
                    <Button variant="outline" className="flex-1" onClick={clearFilters}>
                      <RefreshCw className="mr-2 h-4 w-4" />
                      Clear All
                    </Button>
                    <Button className="flex-1" onClick={() => setFiltersOpen(false)}>
                      Apply Filters
                    </Button>
                  </div>
                </SheetContent>
              </Sheet>

              <Select value={sortField} onValueChange={(v) => setSortField(v as keyof Applicant)}>
                <SelectTrigger className="w-[160px]">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="name">Name</SelectItem>
                  <SelectItem value="experience">Experience</SelectItem>
                  <SelectItem value="currentCTC">Current CTC</SelectItem>
                  <SelectItem value="currentCity">Location</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Active Filters */}
          {(selectedCities.length > 0 || selectedSkills.length > 0 || selectedEducation.length > 0 || selectedNotice.length > 0) && (
            <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t">
              <span className="text-sm text-muted-foreground">Active filters:</span>
              {selectedCities.map(city => (
                <Badge key={city} variant="secondary" className="gap-1">
                  {city}
                  <X 
                    className="h-3 w-3 cursor-pointer" 
                    onClick={() => setSelectedCities(selectedCities.filter(c => c !== city))}
                  />
                </Badge>
              ))}
              {selectedSkills.map(skill => (
                <Badge key={skill} variant="secondary" className="gap-1">
                  {skill}
                  <X 
                    className="h-3 w-3 cursor-pointer" 
                    onClick={() => setSelectedSkills(selectedSkills.filter(s => s !== skill))}
                  />
                </Badge>
              ))}
              {selectedEducation.map(edu => (
                <Badge key={edu} variant="secondary" className="gap-1">
                  {edu}
                  <X 
                    className="h-3 w-3 cursor-pointer" 
                    onClick={() => setSelectedEducation(selectedEducation.filter(e => e !== edu))}
                  />
                </Badge>
              ))}
              {selectedNotice.map(notice => (
                <Badge key={notice} variant="secondary" className="gap-1">
                  {notice}
                  <X 
                    className="h-3 w-3 cursor-pointer" 
                    onClick={() => setSelectedNotice(selectedNotice.filter(n => n !== notice))}
                  />
                </Badge>
              ))}
              <Button variant="ghost" size="sm" onClick={clearFilters}>
                Clear all
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Bulk Actions Bar */}
      {selectedCandidates.length > 0 && (
        <Card className="shadow-lg border-primary/20 bg-primary/5">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">
                {selectedCandidates.length} candidate{selectedCandidates.length > 1 ? 's' : ''} selected
              </span>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" onClick={handleAddToFolder}>
                  <FolderPlus className="mr-2 h-4 w-4" />
                  Add to Folder
                </Button>
                <Button variant="outline" size="sm" onClick={handleMarkFavorite}>
                  <Star className="mr-2 h-4 w-4" />
                  Mark Favorite
                </Button>
                <Button variant="outline" size="sm" onClick={handleDownloadResumes}>
                  <Download className="mr-2 h-4 w-4" />
                  Download Resumes
                </Button>
                <Button variant="ghost" size="sm" onClick={() => setSelectedCandidates([])}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Candidates Table */}
      <Card className="shadow-sm">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">
              Talent Pool
              <Badge variant="secondary" className="ml-2">
                {filteredCandidates.length} candidates
              </Badge>
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">
                    <Checkbox 
                      checked={selectedCandidates.length === paginatedCandidates.length && paginatedCandidates.length > 0}
                      onCheckedChange={handleSelectAll}
                    />
                  </TableHead>
                  <TableHead 
                    className="cursor-pointer hover:text-primary"
                    onClick={() => handleSort('name')}
                  >
                    <div className="flex items-center gap-1">
                      Candidate
                      {sortField === 'name' && (sortOrder === 'asc' ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />)}
                    </div>
                  </TableHead>
                  <TableHead>Skills</TableHead>
                  <TableHead 
                    className="cursor-pointer hover:text-primary"
                    onClick={() => handleSort('currentCity')}
                  >
                    <div className="flex items-center gap-1">
                      Location
                      {sortField === 'currentCity' && (sortOrder === 'asc' ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />)}
                    </div>
                  </TableHead>
                  <TableHead 
                    className="cursor-pointer hover:text-primary"
                    onClick={() => handleSort('experience')}
                  >
                    <div className="flex items-center gap-1">
                      Experience
                      {sortField === 'experience' && (sortOrder === 'asc' ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />)}
                    </div>
                  </TableHead>
                  <TableHead 
                    className="cursor-pointer hover:text-primary"
                    onClick={() => handleSort('currentCTC')}
                  >
                    <div className="flex items-center gap-1">
                      CTC
                      {sortField === 'currentCTC' && (sortOrder === 'asc' ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />)}
                    </div>
                  </TableHead>
                  <TableHead>Notice</TableHead>
                  <TableHead className="w-12"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedCandidates.map((candidate) => (
                  <TableRow 
                    key={candidate.id} 
                    className="hover:bg-muted/50 cursor-pointer"
                    onClick={() => handleViewProfile(candidate.id)}
                  >
                    <TableCell onClick={(e) => e.stopPropagation()}>
                      <Checkbox 
                        checked={selectedCandidates.includes(candidate.id)}
                        onCheckedChange={() => handleSelectCandidate(candidate.id)}
                      />
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-9 w-9">
                          <AvatarFallback className="bg-primary/10 text-primary text-sm">
                            {candidate.name.split(" ").map(n => n[0]).join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium hover:text-primary">{candidate.name}</p>
                          <p className="text-sm text-muted-foreground">{candidate.designation}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {candidate.skills.slice(0, 3).map((skill, i) => (
                          <Badge key={i} variant="secondary" className="text-xs">
                            {skill}
                          </Badge>
                        ))}
                        {candidate.skills.length > 3 && (
                          <Badge variant="outline" className="text-xs">
                            +{candidate.skills.length - 3}
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>{candidate.currentCity}</TableCell>
                    <TableCell>{candidate.experience} yrs</TableCell>
                    <TableCell>
                      <Badge variant="outline">₹{candidate.currentCTC} LPA</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge 
                        variant={candidate.noticePeriod === 'Immediate' ? 'default' : 'secondary'}
                        className="text-xs"
                      >
                        {candidate.noticePeriod}
                      </Badge>
                    </TableCell>
                    <TableCell onClick={(e) => e.stopPropagation()}>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleViewProfile(candidate.id)}>
                            <Eye className="mr-2 h-4 w-4" />
                            View Profile
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <FolderPlus className="mr-2 h-4 w-4" />
                            Add to Folder
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem>
                            <Star className="mr-2 h-4 w-4" />
                            Add to Favorites
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
              Showing {(currentPage - 1) * itemsPerPage + 1}-{Math.min(currentPage * itemsPerPage, filteredCandidates.length)} of {filteredCandidates.length} candidates
            </p>
            <div className="flex items-center gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(p => p - 1)}
              >
                Previous
              </Button>
              <div className="flex items-center gap-1">
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  const page = i + 1;
                  return (
                    <Button
                      key={page}
                      variant={currentPage === page ? "default" : "outline"}
                      size="sm"
                      className="w-8"
                      onClick={() => setCurrentPage(page)}
                    >
                      {page}
                    </Button>
                  );
                })}
                {totalPages > 5 && (
                  <>
                    <span className="px-2">...</span>
                    <Button
                      variant={currentPage === totalPages ? "default" : "outline"}
                      size="sm"
                      className="w-8"
                      onClick={() => setCurrentPage(totalPages)}
                    >
                      {totalPages}
                    </Button>
                  </>
                )}
              </div>
              <Button 
                variant="outline" 
                size="sm" 
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(p => p + 1)}
              >
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
