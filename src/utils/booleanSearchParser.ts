/**
 * Parses Naukri-style boolean search into PostgreSQL tsquery for to_tsquery('english', ...).
 * Supports: AND, OR, NOT, parentheses, quoted phrases, trailing wildcard (*)
 */

type TokenType = "AND" | "OR" | "NOT" | "LPAREN" | "RPAREN" | "PHRASE" | "WORD";

interface Token {
  type: TokenType;
  value: string;
}

export function tokenizeBooleanSearch(input: string): Token[] {
  const tokens: Token[] = [];
  let i = 0;
  const s = input.trim();

  while (i < s.length) {
    if (/\s/.test(s[i])) {
      i++;
      continue;
    }
    if (s[i] === "(") {
      tokens.push({ type: "LPAREN", value: "(" });
      i++;
      continue;
    }
    if (s[i] === ")") {
      tokens.push({ type: "RPAREN", value: ")" });
      i++;
      continue;
    }
    if (s[i] === '"') {
      let j = i + 1;
      while (j < s.length && s[j] !== '"') j++;
      const phrase = s.slice(i + 1, j);
      tokens.push({ type: "PHRASE", value: phrase });
      i = j < s.length ? j + 1 : j;
      continue;
    }
    let j = i;
    while (j < s.length && !/[\s()]/.test(s[j]) && s[j] !== '"') j++;
    const word = s.slice(i, j);
    const upper = word.toUpperCase();
    if (upper === "AND") tokens.push({ type: "AND", value: word });
    else if (upper === "OR") tokens.push({ type: "OR", value: word });
    else if (upper === "NOT") tokens.push({ type: "NOT", value: word });
    else if (word) tokens.push({ type: "WORD", value: word });
    i = j;
  }
  return tokens;
}

function escapeTsToken(word: string): string {
  const cleaned = word.replace(/[':!&|()<>]/g, "").trim();
  if (!cleaned) return "";
  if (cleaned.endsWith("*")) {
    const base = cleaned.slice(0, -1);
    return base ? `${base}:*` : "";
  }
  return cleaned;
}

function phraseToTsquery(phrase: string): string {
  const parts = phrase
    .split(/\s+/)
    .map(escapeTsToken)
    .filter(Boolean);
  if (parts.length === 0) return "";
  if (parts.length === 1) return parts[0];
  return parts.join(" <-> ");
}

function termToTsquery(token: Token): string {
  if (token.type === "PHRASE") return phraseToTsquery(token.value);
  return escapeTsToken(token.value);
}

class Parser {
  private tokens: Token[];
  private pos = 0;

  constructor(tokens: Token[]) {
    this.tokens = tokens;
  }

  private peek(): Token | undefined {
    return this.tokens[this.pos];
  }

  private consume(): Token | undefined {
    return this.tokens[this.pos++];
  }

  parse(): string {
    const expr = this.parseOr();
    if (this.peek()) {
      throw new Error("Unexpected token in search query");
    }
    return expr;
  }

  private parseOr(): string {
    let left = this.parseAnd();
    while (this.peek()?.type === "OR") {
      this.consume();
      const right = this.parseAnd();
      left = `(${left} | ${right})`;
    }
    return left;
  }

  private parseAnd(): string {
    let left = this.parseNot();
    while (this.peek()?.type === "AND") {
      this.consume();
      const right = this.parseNot();
      left = `(${left} & ${right})`;
    }
    return left;
  }

  private parseNot(): string {
    if (this.peek()?.type === "NOT") {
      this.consume();
      const operand = this.parseNot();
      return `(!${operand})`;
    }
    return this.parsePrimary();
  }

  private parsePrimary(): string {
    const t = this.peek();
    if (!t) return "";
    if (t.type === "LPAREN") {
      this.consume();
      const inner = this.parseOr();
      if (this.peek()?.type !== "RPAREN") {
        throw new Error("Missing closing parenthesis");
      }
      this.consume();
      return `(${inner})`;
    }
    if (t.type === "PHRASE" || t.type === "WORD") {
      this.consume();
      const q = termToTsquery(t);
      return q || "";
    }
    throw new Error(`Unexpected token: ${t.type}`);
  }
}

/** Normal mode: comma-separated terms → OR across fields (tsquery OR). */
export function normalToTsquery(input: string): string | null {
  const trimmed = input.trim();
  if (!trimmed) return null;

  const terms = trimmed
    .split(",")
    .map((t) => t.trim())
    .filter(Boolean);

  if (terms.length === 0) return null;

  const parts = terms.map((term) => {
    const words = term.split(/\s+/).map(escapeTsToken).filter(Boolean);
    if (words.length === 0) return "";
    if (words.length === 1) return words[0];
    return `(${words.join(" & ")})`;
  }).filter(Boolean);

  if (parts.length === 0) return null;
  if (parts.length === 1) return parts[0];
  return parts.join(" | ");
}

/** Returns tsquery string for RPC, or null if empty. */
export function booleanToTsquery(input: string): string | null {
  const trimmed = input.trim();
  if (!trimmed) return null;

  const hasOperators =
    /\b(AND|OR|NOT)\b/i.test(trimmed) || trimmed.includes("(") || trimmed.includes('"');

  if (!hasOperators) {
    const words = trimmed.split(/\s+/).map(escapeTsToken).filter(Boolean);
    if (words.length === 0) return null;
    if (words.length === 1) return words[0];
    return words.join(" & ");
  }

  try {
    const tokens = tokenizeBooleanSearch(trimmed);
    if (tokens.length === 0) return null;
    const result = new Parser(tokens).parse();
    return result || null;
  } catch {
    return trimmed
      .split(/\s+/)
      .map(escapeTsToken)
      .filter(Boolean)
      .join(" & ");
  }
}

/** Terms to highlight in UI results */
export function extractHighlightTerms(input: string, mode: "normal" | "boolean" = "boolean"): string[] {
  if (!input.trim()) return [];
  if (mode === "normal") {
    return input
      .split(",")
      .flatMap((t) => t.trim().split(/\s+/))
      .map((w) => w.toLowerCase().replace(/\*$/, ""))
      .filter((w) => w.length > 1);
  }
  const tokens = tokenizeBooleanSearch(input);
  return tokens
    .filter((t) => t.type === "WORD" || t.type === "PHRASE")
    .flatMap((t) => (t.type === "PHRASE" ? t.value.split(/\s+/) : [t.value.replace(/\*$/, "")]))
    .map((w) => w.toLowerCase())
    .filter((w) => w.length > 1 && !["and", "or", "not"].includes(w));
}
