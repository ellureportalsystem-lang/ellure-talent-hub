import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FileText, Download, Upload, Eye, Clock, Sparkles } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";

interface ResumeSectionProps {
  applicant: any;
  viewMode: 'applicant' | 'admin' | 'client';
  onUpdateHeadline?: (headline: string) => void;
}

const ResumeSection = ({ applicant, viewMode, onUpdateHeadline }: ResumeSectionProps) => {
  const [headline, setHeadline] = useState(
    applicant.resumeHeadline || 
    `Experienced ${applicant.designation || 'Professional'} with expertise in ${applicant.skills?.slice(0, 3).join(', ')}. Looking for challenging opportunities to leverage my skills in ${applicant.primarySkill}.`
  );
  const [isEditingHeadline, setIsEditingHeadline] = useState(false);
  const maxHeadlineLength = 250;

  return (
    <div className="space-y-6">
      {/* Resume Headline */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h4 className="font-semibold flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-primary" />
            Resume Headline
          </h4>
          <Badge variant="outline" className="text-xs">
            First thing recruiters see
          </Badge>
        </div>
        
        {isEditingHeadline && viewMode !== 'client' ? (
          <div className="space-y-2">
            <Textarea
              value={headline}
              onChange={(e) => setHeadline(e.target.value.slice(0, maxHeadlineLength))}
              rows={3}
              placeholder="Write a compelling headline that summarizes your experience and skills..."
              className="resize-none"
            />
            <div className="flex items-center justify-between">
              <span className={`text-xs ${headline.length >= maxHeadlineLength ? 'text-destructive' : 'text-muted-foreground'}`}>
                {headline.length}/{maxHeadlineLength} characters
              </span>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={() => setIsEditingHeadline(false)}>
                  Cancel
                </Button>
                <Button size="sm" onClick={() => {
                  onUpdateHeadline?.(headline);
                  setIsEditingHeadline(false);
                }}>
                  Save
                </Button>
              </div>
            </div>
          </div>
        ) : (
          <div 
            className="p-4 bg-muted/50 rounded-lg cursor-pointer hover:bg-muted transition-colors"
            onClick={() => viewMode !== 'client' && setIsEditingHeadline(true)}
          >
            <p className="text-sm leading-relaxed">{headline}</p>
          </div>
        )}
      </div>

      {/* Resume File */}
      <div className="border rounded-lg overflow-hidden">
        <div className="bg-muted/50 p-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
              <FileText className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="font-medium">{applicant.name?.replace(" ", "_")}_Resume.pdf</p>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Clock className="h-3 w-3" />
                Updated: {applicant.resumeUpdated || 'Jan 15, 2024'}
                <span>•</span>
                <span>245 KB</span>
              </div>
            </div>
          </div>
          <div className="flex gap-2">
            {viewMode === 'applicant' && (
              <Button variant="outline" size="sm">
                <Upload className="h-4 w-4 mr-2" />
                Replace
              </Button>
            )}
            <Button variant="outline" size="sm">
              <Eye className="h-4 w-4 mr-2" />
              Preview
            </Button>
            <Button size="sm">
              <Download className="h-4 w-4 mr-2" />
              Download
            </Button>
          </div>
        </div>
        
        {/* Resume Preview */}
        <div className="h-[400px] bg-gradient-to-b from-muted/20 to-muted/50 flex items-center justify-center">
          <div className="text-center text-muted-foreground">
            <FileText className="h-16 w-16 mx-auto mb-4 opacity-30" />
            <p className="font-medium">Resume Preview</p>
            <p className="text-sm">PDF viewer would be displayed here</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResumeSection;
