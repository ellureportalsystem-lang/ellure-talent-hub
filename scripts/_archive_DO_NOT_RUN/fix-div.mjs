import fs from "fs";
import path from "path";

function walk(dir) {
  for (const name of fs.readdirSync(dir)) {
    const p = path.join(dir, name);
    if (fs.statSync(p).isDirectory() && name !== "node_modules") walk(p);
    else if (/\.(tsx?|jsx?)$/.test(name)) {
      let t = fs.readFileSync(p, "utf8");
      if (t.includes("motionlessLoader")) {
        fs.writeFileSync(p, t.replaceAll("motionlessLoader", "div"));
        console.log("fixed", p);
      }
    }
  }
}
walk("src");
