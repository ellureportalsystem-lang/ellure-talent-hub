import fs from "fs";
const f = "src/components/dashboard/admin/BulkActionsBar.tsx";
let lines = fs.readFileSync(f, "utf8").split("\n");
const divClose = "</" + "div>";
const motionClose = "</" + "motion.div>";
if (lines[145].includes(divClose)) {
  lines[145] = lines[145].replace(divClose, motionClose);
}
fs.writeFileSync(f, lines.join("\n"));
console.log("line 146:", lines[145]);
