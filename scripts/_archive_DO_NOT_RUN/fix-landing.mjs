import fs from "fs";

let s = fs.readFileSync("src/pages/Landing.tsx", "utf8");

const bad = "</" + "motion.div" + ">";
const good = "</" + "motion" + ".div>"; // framer - NO
const goodDiv = "</div>";

console.log("bad vs div", bad === goodDiv, bad, goodDiv);

const heroBad = `            ${bad}
            ${bad}

            <motion.div className="order-1 lg:order-2 flex justify-center pt-12 sm:pt-16 lg:pt-0 z-10">
              <HeroDashboardMockup />
            ${bad}
          ${bad}
        </div>`;

const heroGood = `            ${goodDiv}
            ${goodDiv}

            <div className="order-1 lg:order-2 flex justify-center pt-12 sm:pt-16 lg:pt-0 z-10">
              <HeroDashboardMockup />
            </div>
          </motion.div>
        </motion.div>`;

// grid and container are div - fix heroGood
const heroGood2 = `            ${goodDiv}
            ${goodDiv}

            <div className="order-1 lg:order-2 flex justify-center pt-12 sm:pt-16 lg:pt-0 z-10">
              <HeroDashboardMockup />
            </div>
          </motion.div>
        </motion.div>`;

const heroGood3 = `            ${goodDiv}
            ${goodDiv}

            <div className="order-1 lg:order-2 flex justify-center pt-12 sm:pt-16 lg:pt-0 z-10">
              <HeroDashboardMockup />
            </div>
          </div>
        </div>`;

if (s.includes(heroBad)) {
  s = s.replace(heroBad, heroGood3);
  console.log("hero fixed");
} else {
  console.log("hero pattern not found, trying line by line");
  const lines = s.split("\n");
  for (let i = 0; i < lines.length; i++) {
    if ([169, 170, 174, 175].includes(i) && lines[i].includes(bad)) {
      lines[i] = lines[i].replace(bad, goodDiv);
    }
    if (i === 175 && lines[i].trim() === bad) lines[i] = lines[i].replace(bad, goodDiv);
    if (i === 176 && lines[i].includes(bad)) lines[i] = lines[i].replace(bad, goodDiv);
  }
  s = lines.join("\n");
}

s = s.replace(" px-4 sm:px-6 MARKER", " px-4 sm:px-6");

s = s.replace(
  `          </motion.div>
        </motion.div>
      </section>

      {/* About Us Section */}
      <section className="relative py-10 md:py-12 overflow-hidden">`,
  `          </motion.div>
        </motion.div>
      </FadeInSection>

      <FadeInSection className="relative py-10 md:py-12 overflow-hidden">`
);

s = s.replace(/bg-success\/10/g, "bg-secondary/10");
s = s.replace(/text-success/g, "text-secondary");
s = s.replace("p-8 md:p-10 card-hover group", "p-8 md:p-10 marketing-card-lift group");
s = s.replace("p-8 md:p-12 card-hover", "p-8 md:p-12 marketing-card-lift");
s = s.replace(/cursor-pointer card-hover group/g, "cursor-pointer marketing-card-lift group");

fs.writeFileSync("src/pages/Landing.tsx", s);
console.log("lines 170-177", s.split("\n").slice(169, 178));
