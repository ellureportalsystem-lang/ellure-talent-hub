import fs from "fs";

const pages = ["About", "Features", "Industries", "Contact", "Services", "FAQ"];
for (const p of pages) {
  const f = `src/pages/${p}.tsx`;
  let s = fs.readFileSync(f, "utf8");
  const before = (s.match(/className="container py-10"/g) || []).length;
  if (before) {
    s = s.replaceAll('className="container py-10"', 'className="marketing-section"');
    fs.writeFileSync(f, s);
    console.log(`${p}: ${before} sections`);
  }
}
