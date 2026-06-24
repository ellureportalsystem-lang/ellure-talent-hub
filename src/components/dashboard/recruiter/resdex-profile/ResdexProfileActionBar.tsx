import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Plus, Send, Clock, Forward, Video, ChevronDown } from "lucide-react";

type ResdexProfileActionBarProps = {
  onSendNvite?: () => void;
  onForward?: () => void;
};

export function ResdexProfileActionBar({ onSendNvite, onForward }: ResdexProfileActionBarProps) {
  return (
    <div className="border-b border-slate-200 bg-white px-4 py-2.5">
      <div className="flex flex-wrap items-center gap-1">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="h-8 text-xs text-slate-700">
              <Plus className="h-3.5 w-3.5 mr-1" />
              Add to
              <ChevronDown className="h-3 w-3 ml-0.5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem>Shortlist folder</DropdownMenuItem>
            <DropdownMenuItem>Requirement</DropdownMenuItem>
            <DropdownMenuItem>Project</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <Button variant="ghost" size="sm" className="h-8 text-xs text-slate-700" onClick={onSendNvite}>
          <Send className="h-3.5 w-3.5 mr-1" />
          Send NVite
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="h-8 text-xs text-slate-700">
              <Clock className="h-3.5 w-3.5 mr-1" />
              Set reminder
              <ChevronDown className="h-3 w-3 ml-0.5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem>Tomorrow</DropdownMenuItem>
            <DropdownMenuItem>In 3 days</DropdownMenuItem>
            <DropdownMenuItem>Next week</DropdownMenuItem>
            <DropdownMenuItem>Custom date</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <Button variant="ghost" size="sm" className="h-8 text-xs text-slate-700" onClick={onForward}>
          <Forward className="h-3.5 w-3.5 mr-1" />
          Forward
        </Button>

        <Button variant="ghost" size="sm" className="h-8 text-xs text-slate-700">
          <Video className="h-3.5 w-3.5 mr-1" />
          Schedule video call
          <Badge className="ml-1.5 h-4 bg-emerald-500 hover:bg-emerald-500 text-[9px] px-1">Online</Badge>
        </Button>
      </div>
    </div>
  );
}
