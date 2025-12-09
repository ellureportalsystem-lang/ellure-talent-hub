import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Search,
  HelpCircle,
  X,
  History,
  Sparkles,
} from "lucide-react";

interface BooleanSearchBarProps {
  value: string;
  onChange: (value: string) => void;
  onSearch: () => void;
  placeholder?: string;
}

const searchExamples = [
  '"Java Developer" AND "Microservices"',
  '"React" OR "Angular" OR "Vue.js"',
  '"Data Analyst" NOT "Python"',
  '"Project Manager" AND "Agile" AND "Scrum"',
  '"Full Stack" AND ("Node.js" OR "Django")',
];

const recentSearches = [
  '"Senior Java Developer" AND "Spring Boot"',
  '"DevOps Engineer" AND "AWS"',
  '"Product Manager" AND "B2B"',
];

const BooleanSearchBar = ({
  value,
  onChange,
  onSearch,
  placeholder = 'Try: "Java Developer" AND "Microservices" OR "Spring Boot"',
}: BooleanSearchBarProps) => {
  const [isFocused, setIsFocused] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      onSearch();
      setShowSuggestions(false);
    }
  };

  const highlightBooleanTerms = (text: string) => {
    const terms = ["AND", "OR", "NOT"];
    let highlighted = text;
    terms.forEach((term) => {
      highlighted = highlighted.replace(
        new RegExp(`\\b${term}\\b`, "g"),
        `<span class="text-primary font-semibold">${term}</span>`
      );
    });
    // Highlight quoted strings
    highlighted = highlighted.replace(
      /"([^"]+)"/g,
      '<span class="text-secondary font-medium">"$1"</span>'
    );
    return highlighted;
  };

  return (
    <div className="relative w-full">
      <div
        className={`relative flex items-center gap-2 bg-background border rounded-xl transition-all duration-300 ${
          isFocused
            ? "ring-2 ring-primary/20 border-primary shadow-lg"
            : "shadow-sm hover:shadow-md"
        }`}
      >
        <div className="flex items-center gap-2 pl-4">
          <Search className="h-5 w-5 text-muted-foreground" />
          <Sparkles className="h-4 w-4 text-primary animate-pulse" />
        </div>
        <Input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => {
            setIsFocused(true);
            setShowSuggestions(true);
          }}
          onBlur={() => {
            setIsFocused(false);
            setTimeout(() => setShowSuggestions(false), 200);
          }}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className="border-0 focus-visible:ring-0 text-base py-6 bg-transparent"
        />
        {value && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onChange("")}
            className="h-8 w-8 p-0 mr-2"
          >
            <X className="h-4 w-4" />
          </Button>
        )}
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="ghost" size="sm" className="mr-2">
              <HelpCircle className="h-4 w-4" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-96" align="end">
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold text-sm mb-2">
                  Boolean Search Guide
                </h4>
                <p className="text-xs text-muted-foreground mb-3">
                  Use Boolean operators to create powerful search queries:
                </p>
              </div>
              <div className="space-y-2">
                <div className="flex items-start gap-2">
                  <Badge variant="secondary" className="font-mono text-xs">
                    AND
                  </Badge>
                  <span className="text-xs text-muted-foreground">
                    Both terms must match
                  </span>
                </div>
                <div className="flex items-start gap-2">
                  <Badge variant="secondary" className="font-mono text-xs">
                    OR
                  </Badge>
                  <span className="text-xs text-muted-foreground">
                    Either term can match
                  </span>
                </div>
                <div className="flex items-start gap-2">
                  <Badge variant="secondary" className="font-mono text-xs">
                    NOT
                  </Badge>
                  <span className="text-xs text-muted-foreground">
                    Exclude the term
                  </span>
                </div>
                <div className="flex items-start gap-2">
                  <Badge variant="secondary" className="font-mono text-xs">
                    "quotes"
                  </Badge>
                  <span className="text-xs text-muted-foreground">
                    Exact phrase match
                  </span>
                </div>
              </div>
              <div className="pt-2 border-t">
                <p className="text-xs font-medium mb-2">Example Searches:</p>
                <div className="space-y-1">
                  {searchExamples.slice(0, 3).map((example, i) => (
                    <button
                      key={i}
                      onClick={() => onChange(example)}
                      className="block w-full text-left text-xs text-muted-foreground hover:text-primary transition-colors p-1 rounded hover:bg-muted"
                    >
                      {example}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </PopoverContent>
        </Popover>
        <Button
          onClick={onSearch}
          className="mr-2 px-6 bg-primary hover:bg-primary/90"
        >
          Search
        </Button>
      </div>

      {/* Suggestions Dropdown */}
      <AnimatePresence>
        {showSuggestions && !value && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute top-full left-0 right-0 mt-2 bg-background border rounded-xl shadow-xl z-50 overflow-hidden"
          >
            {/* Recent Searches */}
            <div className="p-4 border-b">
              <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground mb-3">
                <History className="h-4 w-4" />
                Recent Searches
              </div>
              <div className="space-y-2">
                {recentSearches.map((search, i) => (
                  <button
                    key={i}
                    onClick={() => {
                      onChange(search);
                      setShowSuggestions(false);
                    }}
                    className="block w-full text-left text-sm text-foreground hover:text-primary transition-colors p-2 rounded-lg hover:bg-muted"
                  >
                    <span
                      dangerouslySetInnerHTML={{
                        __html: highlightBooleanTerms(search),
                      }}
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Popular Searches */}
            <div className="p-4">
              <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground mb-3">
                <Sparkles className="h-4 w-4" />
                Try These Searches
              </div>
              <div className="flex flex-wrap gap-2">
                {searchExamples.map((example, i) => (
                  <Badge
                    key={i}
                    variant="outline"
                    className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors"
                    onClick={() => {
                      onChange(example);
                      setShowSuggestions(false);
                    }}
                  >
                    {example.length > 40
                      ? example.substring(0, 40) + "..."
                      : example}
                  </Badge>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default BooleanSearchBar;
