import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, Send, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ElluraAvatar } from "./ElluraAvatar";
import type { ElluraMood } from "./elluraTypes";

type ChatMessage = {
  id: string;
  role: "bot" | "user";
  text: string;
};

type ChatStep = "intro" | "name" | "chat";

function formatName(raw: string) {
  const trimmed = raw.trim();
  if (!trimmed) return "";
  return trimmed.charAt(0).toUpperCase() + trimmed.slice(1).toLowerCase();
}

const INTRO_MESSAGES: { text: string; delay: number }[] = [
  { text: "Hi! I'm Ellura — your NexHire guide.", delay: 0 },
  {
    text: "I can help with hiring, plans, and how the platform works.",
    delay: 500,
  },
  { text: "What should I call you?", delay: 1000 },
];

export function ElluraChatbot() {
  const [open, setOpen] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [step, setStep] = useState<ChatStep>("intro");
  const [userName, setUserName] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [introDone, setIntroDone] = useState(false);
  const [showInvite, setShowInvite] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const launcherMood: ElluraMood = open ? "happy" : "idle";
  const headerMood: ElluraMood = step === "chat" ? "happy" : "wink";

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  useEffect(() => {
    if (!open || introDone) return;
    const timers: ReturnType<typeof setTimeout>[] = [];
    INTRO_MESSAGES.forEach(({ text, delay }) => {
      timers.push(
        setTimeout(() => {
          setMessages((prev) => [
            ...prev,
            { id: `intro-${delay}`, role: "bot", text },
          ]);
          if (delay === 1000) {
            setStep("name");
            setIntroDone(true);
          }
        }, delay + 260)
      );
    });
    return () => timers.forEach(clearTimeout);
  }, [open, introDone]);

  useEffect(() => {
    if (!open || step === "intro") return;
    const t = setTimeout(() => inputRef.current?.focus(), 300);
    return () => clearTimeout(t);
  }, [open, step]);

  const handleOpen = () => {
    setOpen(true);
    setShowInvite(false);
  };

  const handleClose = () => {
    setOpen(false);
    setTimeout(() => setShowInvite(true), 800);
  };

  const addMessage = (role: "bot" | "user", text: string) => {
    setMessages((prev) => [
      ...prev,
      { id: `${Date.now()}-${Math.random()}`, role, text },
    ]);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const value = input.trim();
    if (!value) return;

    if (step === "name") {
      const name = formatName(value);
      if (!name) return;
      setUserName(name);
      addMessage("user", name);
      setInput("");
      setTimeout(() => {
        addMessage("bot", `Hey ${name}! Great to meet you.`);
        setTimeout(() => {
          addMessage(
            "bot",
            "Ask me anything — I'm still learning, but happy to help!"
          );
          setStep("chat");
        }, 450);
      }, 350);
      return;
    }

    if (step === "chat") {
      addMessage("user", value);
      setInput("");
      setTimeout(() => {
        addMessage(
          "bot",
          userName
            ? `Thanks, ${userName}! Smarter replies are coming soon — we're building that now.`
            : "Thanks! Smarter replies are coming soon — we're building that now."
        );
      }, 500);
    }
  };

  return (
    <>
      {/* Side tab (visible when Ellura is hidden) */}
      <AnimatePresence>
        {hidden && !open && (
          <motion.button
            type="button"
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 24 }}
            transition={{ type: "spring", stiffness: 520, damping: 32 }}
            onClick={() => setHidden(false)}
            className={cn(
              "fixed z-50",
              "bottom-[6rem] right-0 md:bottom-10",
              "flex items-center gap-2 rounded-l-full border border-violet-200 bg-white/95 pl-2 pr-3 py-2 shadow-lg backdrop-blur",
              "text-xs font-semibold text-violet-900"
            )}
            aria-label="Show Ellura"
          >
            <ChevronLeft className="h-4 w-4 text-violet-700" aria-hidden />
            <span>Ellura</span>
          </motion.button>
        )}
      </AnimatePresence>

      <motion.div
        className={cn(
          "fixed z-50 flex flex-col items-end gap-3",
          "bottom-[5.5rem] right-4 md:bottom-6 md:right-6"
        )}
        drag={open ? false : "x"}
        dragConstraints={{ left: -20, right: 92 }}
        dragElastic={0.12}
        onDragEnd={(_, info) => {
          if (open) return;
          if (info.offset.x > 40) setHidden(true);
          if (info.offset.x < -30) setHidden(false);
        }}
        animate={{ x: hidden && !open ? 92 : 0, opacity: hidden && !open ? 0 : 1 }}
        transition={{ type: "spring", stiffness: 520, damping: 34 }}
        style={{ pointerEvents: hidden && !open ? "none" : "auto" }}
      >
      <AnimatePresence>
        {open && (
          <motion.div
            role="dialog"
            aria-label="Chat with Ellura"
            aria-modal="true"
            initial={{ opacity: 0, y: 16, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.98 }}
            transition={{ type: "spring", stiffness: 420, damping: 34 }}
            className={cn(
              "flex w-[min(100vw-2rem,380px)] flex-col overflow-hidden",
              "rounded-3xl border border-violet-100 bg-white",
              "shadow-[0_20px_60px_-12px_rgba(91,33,182,0.35)]",
              "h-[min(520px,calc(100dvh-9.5rem))]"
            )}
          >
            <header className="flex items-center gap-3 border-b border-violet-100 bg-gradient-to-br from-violet-600 via-violet-700 to-indigo-800 px-4 py-3">
              <ElluraAvatar
                size={58}
                mood={headerMood}
                animate
                className="shrink-0 drop-shadow-md"
              />
              <div className="min-w-0 flex-1">
                <p className="font-semibold text-white">Ellura</p>
                <p className="text-xs text-violet-100/95">At your service</p>
              </div>
              <span className="rounded-full bg-white/15 px-2 py-0.5 text-[10px] font-medium text-emerald-100">
                Online
              </span>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="h-8 w-8 shrink-0 text-white hover:bg-white/15"
                onClick={handleClose}
                aria-label="Close chat"
              >
                <X className="h-4 w-4" />
              </Button>
            </header>

            <div className="flex flex-1 flex-col gap-2.5 overflow-y-auto bg-slate-50/80 px-3.5 py-3.5">
              {messages.length === 0 && step === "intro" && !introDone && (
                <p className="py-2 text-center text-xs text-slate-400">
                  Ellura is typing…
                </p>
              )}
              {messages.map((msg) => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={cn(
                    "flex max-w-[92%] gap-2",
                    msg.role === "bot"
                      ? "self-start"
                      : "self-end flex-row-reverse"
                  )}
                >
                  {msg.role === "bot" && (
                    <ElluraAvatar
                      size={36}
                      mood="happy"
                      className="mt-0.5 shrink-0"
                    />
                  )}
                  <div
                    className={cn(
                      "rounded-2xl px-3 py-2 text-[13px] leading-relaxed",
                      msg.role === "bot"
                        ? "bg-white text-slate-700 shadow-sm ring-1 ring-slate-200/60"
                        : "bg-violet-600 text-white shadow-sm"
                    )}
                  >
                    {msg.text}
                  </div>
                </motion.div>
              ))}
              {step === "intro" && !introDone && (
                <div className="flex gap-1 pl-9">
                  <span className="ellura-typing-dot h-1.5 w-1.5 rounded-full bg-violet-400" />
                  <span className="ellura-typing-dot ellura-typing-dot-2 h-1.5 w-1.5 rounded-full bg-violet-400" />
                  <span className="ellura-typing-dot ellura-typing-dot-3 h-1.5 w-1.5 rounded-full bg-violet-400" />
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            <form
              onSubmit={handleSubmit}
              className="border-t border-violet-100 bg-white p-3"
            >
              <div className="flex gap-2 rounded-xl border border-violet-200 bg-slate-50 p-1 pl-3 focus-within:border-violet-400 focus-within:ring-2 focus-within:ring-violet-400/15">
                <Input
                  ref={inputRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder={
                    step === "name" ? "Your name…" : "Message Ellura…"
                  }
                  disabled={step === "intro"}
                  className="h-9 flex-1 border-0 bg-transparent px-0 text-sm shadow-none focus-visible:ring-0"
                  autoComplete="off"
                />
                <Button
                  type="submit"
                  size="icon"
                  disabled={step === "intro" || !input.trim()}
                  className="h-9 w-9 shrink-0 rounded-lg bg-violet-600 hover:bg-violet-700"
                  aria-label="Send"
                >
                  <Send className="h-3.5 w-3.5" />
                </Button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="relative">
        <AnimatePresence>
          {showInvite && !open && (
            <motion.div
              initial={{ opacity: 0, x: 12 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 8 }}
              transition={{ type: "spring", stiffness: 400, damping: 28 }}
              className="absolute bottom-4 right-[calc(100%+12px)] z-10 w-[min(15.5rem,calc(100vw-6.5rem))]"
            >
              <div className="ellura-invite-bubble relative rounded-2xl rounded-tr-sm px-3.5 py-2.5 text-left">
                <p className="text-sm font-semibold text-violet-950">
                  Need help with hiring?
                </p>
                <p className="mt-0.5 text-xs text-violet-700/90">
                  Chat with Ellura — your NexHire guide.
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <motion.button
          type="button"
          onClick={() => (open ? handleClose() : handleOpen())}
          aria-expanded={open}
          aria-label={open ? "Close Ellura" : "Open Ellura chat"}
          className={cn(
            "ellura-launcher-btn group relative flex items-end justify-center border-0 bg-transparent p-0 shadow-none",
            open && "opacity-90"
          )}
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.94 }}
        >
          <span
            className="ellura-launcher-pulse pointer-events-none absolute bottom-0 left-1/2 h-14 w-[5.25rem] -translate-x-1/2 rounded-[50%]"
            aria-hidden
          />
          <ElluraAvatar
            size={84}
            mood={launcherMood}
            animate
            showHoverShadow
            className="relative z-[1]"
          />
        </motion.button>
      </div>
      </motion.div>
    </>
  );
}

export default ElluraChatbot;
