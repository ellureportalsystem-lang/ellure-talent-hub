import fs from "fs";
import path from "path";

const ROOT = "src";
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
      const top = stack.pop();
      if (top === "motion.div") {
        out += CLOSE_MOTION;
      } else {
        out += CLOSE_PLAIN;
        changed = true;
      }
      i += CLOSE_MOTION.length;
      continue;
    }
    if (src.startsWith(CLOSE_PLAIN, i)) {
      stack.pop();
      out += CLOSE_PLAIN;
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

function walk(dir) {
  const fixed = [];
  for (const name of fs.readdirSync(dir)) {
    const p = path.join(dir, name);
    const st = fs.statSync(p);
    if (st.isDirectory()) {
      fixed.push(...walk(p));
    } else if (/\.(tsx|jsx)$/.test(name)) {
      if (fixFile(p)) fixed.push(p);
    }
  }
  return fixed;
}

const fixed = walk(ROOT);
console.log(fixed.length ? `Fixed:\n${fixed.join("\n")}` : "No fixes needed");
