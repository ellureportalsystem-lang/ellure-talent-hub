import { Button } from "@/components/ui/button";
import { Linkedin, Github, Globe, Dribbble, Twitter, Instagram, Edit } from "lucide-react";

interface OnlineProfiles {
  linkedin?: string;
  github?: string;
  portfolio?: string;
  behance?: string;
  dribbble?: string;
  twitter?: string;
  instagram?: string;
  website?: string;
}

interface OnlineProfilesSectionProps {
  profiles: OnlineProfiles;
  viewMode: 'applicant' | 'admin' | 'client';
  onEdit?: () => void;
}

const profileConfig = [
  { key: 'linkedin', label: 'LinkedIn', icon: Linkedin, color: 'hover:bg-blue-500/10 hover:text-blue-600' },
  { key: 'github', label: 'GitHub', icon: Github, color: 'hover:bg-gray-500/10 hover:text-gray-600' },
  { key: 'portfolio', label: 'Portfolio', icon: Globe, color: 'hover:bg-purple-500/10 hover:text-purple-600' },
  { key: 'website', label: 'Website', icon: Globe, color: 'hover:bg-green-500/10 hover:text-green-600' },
  { key: 'dribbble', label: 'Dribbble', icon: Dribbble, color: 'hover:bg-pink-500/10 hover:text-pink-600' },
  { key: 'twitter', label: 'Twitter', icon: Twitter, color: 'hover:bg-blue-400/10 hover:text-blue-500' },
  { key: 'instagram', label: 'Instagram', icon: Instagram, color: 'hover:bg-pink-500/10 hover:text-pink-600' },
];

const OnlineProfilesSection = ({ profiles, viewMode, onEdit }: OnlineProfilesSectionProps) => {
  const activeProfiles = profileConfig.filter(p => profiles[p.key as keyof OnlineProfiles]);
  const canEdit = viewMode !== 'client';

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {activeProfiles.map((profile) => {
          const Icon = profile.icon;
          const url = profiles[profile.key as keyof OnlineProfiles];
          
          return (
            <a
              key={profile.key}
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className={`flex items-center gap-3 p-4 rounded-lg border transition-colors ${profile.color}`}
            >
              <Icon className="h-5 w-5" />
              <span className="font-medium text-sm">{profile.label}</span>
            </a>
          );
        })}
      </div>

      {activeProfiles.length === 0 && (
        <div className="text-center py-6 text-muted-foreground">
          <Globe className="h-8 w-8 mx-auto mb-2 opacity-50" />
          <p>No online profiles added yet</p>
        </div>
      )}
    </div>
  );
};

export default OnlineProfilesSection;
