import { useEffect, useId, useRef, useState } from "react";
import { cn } from "@/lib/utils";

type ResdexAutocompleteInputProps = {
  value: string;
  onChange: (value: string) => void;
  onSelect?: (value: string) => void;
  suggestions: string[];
  placeholder?: string;
  multiline?: boolean;
  className?: string;
  inputClassName?: string;
  minChars?: number;
};

export function ResdexAutocompleteInput({
  value,
  onChange,
  onSelect,
  suggestions,
  placeholder,
  multiline = false,
  className,
  inputClassName,
  minChars = 1,
}: ResdexAutocompleteInputProps) {
  const listId = useId();
  const wrapRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const [highlight, setHighlight] = useState(0);

  const filtered =
    value.trim().length >= minChars
      ? suggestions.filter((s) => s.toLowerCase().includes(value.trim().toLowerCase())).slice(0, 10)
      : [];

  useEffect(() => {
    setHighlight(0);
  }, [value, suggestions.length]);

  useEffect(() => {
    const onDoc = (e: MouseEvent) => {
      if (!wrapRef.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, []);

  const pick = (item: string) => {
    onChange(item);
    onSelect?.(item);
    setOpen(false);
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (!open || !filtered.length) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setHighlight((h) => Math.min(h + 1, filtered.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlight((h) => Math.max(h - 1, 0));
    } else if (e.key === "Enter" && filtered[highlight]) {
      e.preventDefault();
      pick(filtered[highlight]);
    } else if (e.key === "Escape") {
      setOpen(false);
    }
  };

  const sharedProps = {
    value,
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      onChange(e.target.value);
      setOpen(true);
    },
    onFocus: () => setOpen(true),
    onKeyDown,
    placeholder,
    className: cn(
      "w-full rounded-md border border-slate-200 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#0566CD]/30",
      multiline ? "min-h-[80px] py-2" : "h-9",
      inputClassName
    ),
    autoComplete: "off" as const,
    "aria-autocomplete": "list" as const,
    "aria-controls": listId,
  };

  return (
    <div ref={wrapRef} className={cn("relative", className)}>
      {multiline ? (
        <textarea {...sharedProps} />
      ) : (
        <input type="text" {...sharedProps} />
      )}

      {open && filtered.length > 0 && (
        <ul
          id={listId}
          role="listbox"
          className="absolute z-50 mt-1 max-h-52 w-full overflow-auto rounded-md border border-slate-200 bg-white py-1 shadow-lg"
        >
          {filtered.map((item, i) => (
            <li key={item} role="option" aria-selected={i === highlight}>
              <button
                type="button"
                className={cn(
                  "w-full px-3 py-2 text-left text-sm hover:bg-slate-50",
                  i === highlight && "bg-blue-50 text-[#0566CD]"
                )}
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => pick(item)}
              >
                {item}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
