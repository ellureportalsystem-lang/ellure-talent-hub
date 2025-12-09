import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FolderKanban, ExternalLink, Github, Users, Calendar, Edit, Trash2 } from "lucide-react";

interface Project {
  id: number;
  title: string;
  description: string;
  skills: string[];
  link?: string;
  githubLink?: string;
  teamSize?: number;
  duration?: string;
}

interface ProjectsSectionProps {
  projects: Project[];
  viewMode: 'applicant' | 'admin' | 'client';
  onEdit?: (id: number) => void;
  onDelete?: (id: number) => void;
}

const ProjectsSection = ({ projects, viewMode, onEdit, onDelete }: ProjectsSectionProps) => {
  const canEdit = viewMode !== 'client';

  return (
    <div className="grid md:grid-cols-2 gap-4">
      {projects.map((project) => (
        <div 
          key={project.id}
          className="p-4 rounded-lg border hover:shadow-md transition-shadow group"
        >
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <FolderKanban className="h-5 w-5 text-primary" />
              </div>
              <h4 className="font-semibold">{project.title}</h4>
            </div>
            
            {canEdit && (
              <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => onEdit?.(project.id)}>
                  <Edit className="h-3 w-3" />
                </Button>
                <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive" onClick={() => onDelete?.(project.id)}>
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>
            )}
          </div>

          <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
            {project.description}
          </p>

          {/* Skills */}
          <div className="flex flex-wrap gap-1 mb-3">
            {project.skills.map((skill, index) => (
              <Badge key={index} variant="secondary" className="text-xs">
                {skill}
              </Badge>
            ))}
          </div>

          {/* Meta */}
          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            {project.teamSize && (
              <span className="flex items-center gap-1">
                <Users className="h-3 w-3" />
                {project.teamSize} members
              </span>
            )}
            {project.duration && (
              <span className="flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                {project.duration}
              </span>
            )}
          </div>

          {/* Links */}
          {(project.link || project.githubLink) && (
            <div className="flex gap-2 mt-3 pt-3 border-t">
              {project.githubLink && (
                <Button variant="outline" size="sm" className="text-xs" asChild>
                  <a href={project.githubLink} target="_blank" rel="noopener noreferrer">
                    <Github className="h-3 w-3 mr-1" />
                    GitHub
                  </a>
                </Button>
              )}
              {project.link && (
                <Button variant="outline" size="sm" className="text-xs" asChild>
                  <a href={project.link} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="h-3 w-3 mr-1" />
                    Live Demo
                  </a>
                </Button>
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default ProjectsSection;
