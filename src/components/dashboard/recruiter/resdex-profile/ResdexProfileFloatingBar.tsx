import { Button } from "@/components/ui/button";
import { ThumbsUp, ThumbsDown, MessageSquare, Share2, ChevronUp, MoreHorizontal } from "lucide-react";

export function ResdexProfileFloatingBar() {
  return (
    <div className="fixed bottom-6 right-6 z-40 flex items-center gap-0.5 rounded-full border border-slate-700 bg-slate-800/95 px-2 py-1.5 shadow-lg">
      <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-300 hover:text-white hover:bg-slate-700">
        <ThumbsUp className="h-4 w-4" />
      </Button>
      <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-300 hover:text-white hover:bg-slate-700">
        <ThumbsDown className="h-4 w-4" />
      </Button>
      <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-300 hover:text-white hover:bg-slate-700">
        <MessageSquare className="h-4 w-4" />
      </Button>
      <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-300 hover:text-white hover:bg-slate-700">
        <Share2 className="h-4 w-4" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        className="h-8 w-8 text-slate-300 hover:text-white hover:bg-slate-700"
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      >
        <ChevronUp className="h-4 w-4" />
      </Button>
      <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-300 hover:text-white hover:bg-slate-700">
        <MoreHorizontal className="h-4 w-4" />
      </Button>
    </div>
  );
}
