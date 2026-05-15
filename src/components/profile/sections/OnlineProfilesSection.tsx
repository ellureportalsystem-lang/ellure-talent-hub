import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Linkedin, Github, Globe, Dribbble, Twitter, Instagram, Plus, Save, X } from "lucide-react";
import { toast } from "sonner";

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
  onSave?: (profiles: OnlineProfiles) => void | Promise<void>;
}

const profileConfig = [
  { key: 'linkedin', label: 'LinkedIn', icon: Linkedin, placeholder: 'https://linkedin.com/in/your-profile', color: 'hover:bg-blue-500/10 hover:text-blue-600' },
  { key: 'github', label: 'GitHub', icon: Github, placeholder: 'https://github.com/your-username', color: 'hover:bg-gray-500/10 hover:text-gray-600' },
  { key: 'portfolio', label: 'Portfolio', icon: Globe, placeholder: 'https://your-portfolio.com', color: 'hover:bg-purple-500/10 hover:text-purple-600' },
];

const OnlineProfilesSection = ({ profiles, viewMode, onSave }: OnlineProfilesSectionProps) => {
  const activeProfiles = profileConfig.filter(p => profiles[p.key as keyof OnlineProfiles]);
  const canEdit = viewMode !== 'client';
  const [isEditing, setIsEditing] = useState(false);
  const [editValues, setEditValues] = useState<OnlineProfiles>({ ...profiles });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (isEditing) return;
    setEditValues({ ...profiles });
  }, [
    isEditing,
    profiles.linkedin,
    profiles.github,
    profiles.portfolio,
    profiles.behance,
    profiles.dribbble,
    profiles.twitter,
    profiles.instagram,
    profiles.website,
  ]);

  const handleSave = async () => {
    setSaving(true);
    try {
      await onSave?.(editValues);
      setIsEditing(false);
      toast.success("Online profiles updated");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Could not save profiles");
    } finally {
      setSaving(false);
    }
  };

  if (isEditing && canEdit) {
    return (
      <div className="space-y-3">
        {profileConfig.map((p) => {
          const Icon = p.icon;
          return (
            <div key={p.key} className="flex items-center gap-2">
              <Icon className="h-4 w-4 text-muted-foreground flex-shrink-0" />
              <Input
                value={editValues[p.key as keyof OnlineProfiles] || ''}
                onChange={(e) => setEditValues({ ...editValues, [p.key]: e.target.value })}
                placeholder={p.placeholder}
                className="h-8 text-sm flex-1"
              />
            </div>
          );
        })}
        <div className="flex gap-2 pt-1">
          <Button size="sm" className="h-7 text-xs" disabled={saving} onClick={() => void handleSave()}>
            <Save className="h-3 w-3 mr-1" /> {saving ? 'Saving…' : 'Save'}
          </Button>
          <Button variant="outline" size="sm" className="h-7 text-xs" onClick={() => { setIsEditing(false); setEditValues({ ...profiles }); }}>
            <X className="h-3 w-3 mr-1" /> Cancel
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {activeProfiles.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
          {activeProfiles.map((profile) => {
            const Icon = profile.icon;
            const url = profiles[profile.key as keyof OnlineProfiles];
            return (
              <a
                key={profile.key}
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className={`flex items-center gap-2 p-3 rounded-lg border transition-colors text-sm ${profile.color}`}
              >
                <Icon className="h-4 w-4" />
                <span className="font-medium">{profile.label}</span>
              </a>
            );
          })}
        </div>
      )}

      {activeProfiles.length === 0 && (
        <div className="text-center py-4 text-muted-foreground">
          <Globe className="h-6 w-6 mx-auto mb-1.5 opacity-40" />
          <p className="text-sm">No online profiles added yet</p>
        </div>
      )}

      {canEdit && (
        <Button variant="outline" size="sm" className="h-7 text-xs" onClick={() => setIsEditing(true)}>
          <Plus className="h-3 w-3 mr-1" />
          {activeProfiles.length > 0 ? 'Edit profiles' : 'Add profiles'}
        </Button>
      )}
    </div>
  );
};

export default OnlineProfilesSection;
