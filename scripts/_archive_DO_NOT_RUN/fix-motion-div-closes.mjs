import fs from "fs";

const CLOSE_PLAIN = "</" + "div>";
const CLOSE_MOTION = "</" + "motion.div>";

function fixFile(filePath) {
  let src = fs.readFileSync(filePath, "utf8");
  const stack = [];
  let out = "";
  let i = 0;
  let changed = false;

  while (i < src.length) {
    if (src.startsWith(CLOSE_MOTION, i)) {
      stack.pop();
      out += CLOSE_MOTION;
      i += CLOSE_MOTION.length;
      continue;
    }
    if (src.startsWith(CLOSE_PLAIN, i)) {
      const top = stack.pop();
      if (top === "motion.div") {
        out += CLOSE_MOTION;
        changed = true;
      } else {
        out += CLOSE_PLAIN;
      }
      i += CLOSE_PLAIN.length;
      continue;
    }
    const rest = src.slice(i);
    const motionOpen = rest.match(/^<motion\.div\b/);
    if (motionOpen) {
      stack.push("motion.div");
      out += motionOpen[0];
      i += motionOpen[0].length;
      continue;
    }
    const divOpen = rest.match(/^<div\b/);
    if (motionOpen === null && divOpen) {
      stack.push("div");
      out += divOpen[0];
      i += divOpen[0].length;
      continue;
    }
    out += src[i];
    i += 1;
  }

  if (changed) {
    fs.writeFileSync(filePath, out);
    return true;
  }
  return false;
}

const files = [
  "src/pages/Landing.tsx",
  "src/pages/Contact.tsx",
  "src/pages/Services.tsx",
  "src/pages/About.tsx",
  "src/pages/Features.tsx",
  "src/pages/Industries.tsx",
  "src/pages/FAQ.tsx",
  "src/components/FAQPreview.tsx",
  "src/components/layout/Navbar.tsx",
  "src/components/marketing/HeroDashboardMockup.tsx",
];

const fixed = [];
for (const f of files) {
  if (fs.existsSync(f) && fixFile(f)) fixed.push(f);
}
console.log(fixed.length ? `Fixed:\n${fixed.join("\n")}` : "No fixes");
