import fs from "fs";

const p = "src/pages/Landing.tsx";
let s = fs.readFileSync(p, "utf8");

// Stats -> StatsStrip component
const i0 = s.indexOf("      {/* Stats Strip */}");
const i1 = s.indexOf("      {/* CTA Cards Section */}");
if (i0 < 0 || i1 < 0) throw new Error("markers missing");
s = s.slice(0, i0) + "      <StatsStrip />\n\n      " + s.slice(i1).replace(
  '<section className="container py-10 md:py-12">',
  '<FadeInSection className="container py-10 md:py-12 px-4 sm:px-6">'
).replace("      {/* CTA Cards Section */}\n      ", "");

// Hero mockup before StatsStrip
const iStats = s.indexOf("      <StatsStrip />");
const heroTail = s.slice(iStats - 80, iStats);
const heroEnd = s.lastIndexOf("</section>", iStats);
const heroStart = s.lastIndexOf("            </motion.div>", iStats - 20);
// Find the three closing divs before stats
const sliceEnd = iStats;
let searchFrom = sliceEnd - 200;
const chunk = s.slice(searchFrom, sliceEnd);
const mockup = `
            </motion.div>

            <div className="order-1 lg:order-2 flex justify-center pt-12 sm:pt-16 lg:pt-0 z-10">
              <HeroDashboardMockup />
            </motion.div>
          </motion.div>
        </motion.div>
      </section>

`;
// Replace last occurrence of slider-close pattern before StatsStrip
const closePattern = /            <\/div>\n          <\/div>\n        <\/div>\n      <\/section>\n\n      <StatsStrip \/>/;
if (!closePattern.test(s)) {
  console.error("hero close not found", JSON.stringify(s.slice(iStats - 150, iStats + 20)));
  process.exit(1);
}
s = s.replace(
  closePattern,
  `            </motion.div>
            </motion.div>

            <motion.div className="order-1 lg:order-2 flex justify-center pt-12 sm:pt-16 lg:pt-0 z-10">
              <HeroDashboardMockup />
            </motion.div>
          </motion.div>
        </motion.div>
      </section>

      <StatsStrip />`
);

// Fix to div tags
s = s.replace(
  `            </motion.div>
            </motion.div>

            <motion.div className="order-1 lg:order-2 flex justify-center pt-12 sm:pt-16 lg:pt-0 z-10">
              <HeroDashboardMockup />
            </motion.div>
          </motion.div>
        </motion.div>
      </section>

      <StatsStrip />`,
  `            </motion.div>
            </motion.div>

            <div className="order-1 lg:order-2 flex justify-center pt-12 sm:pt-16 lg:pt-0 z-10">
              <HeroDashboardMockup />
            </motion.div>
          </motion.div>
        </motion.div>
      </section>

      <StatsStrip />`
);

s = s.replace(
  `            </motion.div>
            </motion.div>

            <div className="order-1 lg:order-2 flex justify-center pt-12 sm:pt-16 lg:pt-0 z-10">
              <HeroDashboardMockup />
            </motion.div>
          </motion.div>
        </motion.div>
      </section>

      <StatsStrip />`,
  `            </motion.div>
            </motion.div>

            <div className="order-1 lg:order-2 flex justify-center pt-12 sm:pt-16 lg:pt-0 z-10">
              <HeroDashboardMockup />
            </motion.div>
          </motion.div>
        </motion.div>
      </section>

      <StatsStrip />`
);

// REAL div closes
s = s.replace(
  /            <\/motion\.div>\n            <\/motion\.motion\.div>\n\n            <div className="order-1[\s\S]*?<\/motion\.div>\n          <\/motion\.div>\n        <\/motion\.div>\n      <\/section>\n\n      <StatsStrip \/>/,
  `            </motion.div>
            </motion.div>

            <div className="order-1 lg:order-2 flex justify-center pt-12 sm:pt-16 lg:pt-0 z-10">
              <HeroDashboardMockup />
            </motion.div>
          </motion.div>
        </motion.div>
      </section>

      <StatsStrip />`
);

const divClose = `            </motion.div>
            </motion.div>

            <div className="order-1 lg:order-2 flex justify-center pt-12 sm:pt-16 lg:pt-0 z-10">
              <HeroDashboardMockup />
            </motion.div>
          </motion.div>
        </motion.div>
      </section>

      <StatsStrip />`;

const divCloseReal = `            </motion.div>
            </motion.div>

            <div className="order-1 lg:order-2 flex justify-center pt-12 sm:pt-16 lg:pt-0 z-10">
              <HeroDashboardMockup />
            </motion.div>
          </motion.div>
        </motion.div>
      </section>

      <StatsStrip />`;

const REAL = `            </motion.div>
            </motion.div>

            <div className="order-1 lg:order-2 flex justify-center pt-12 sm:pt-16 lg:pt-0 z-10">
              <HeroDashboardMockup />
            </motion.div>
          </motion.div>
        </motion.div>
      </section>

      <StatsStrip />`;

s = s.replace(closePattern, `            </motion.div>
            </motion.div>

            <div className="order-1 lg:order-2 flex justify-center pt-12 sm:pt-16 lg:pt-0 z-10">
              <HeroDashboardMockup />
            </motion.div>
          </motion.div>
        </motion.div>
      </section>

      <StatsStrip />`);

// Close CTA FadeInSection before About
s = s.replace(
  "        </motion.div>\n      </section>\n\n      {/* About Us Section */}\n      <section className=\"relative py-10",
  "        </motion.div>\n      </FadeInSection>\n\n      <FadeInSection className=\"relative py-10"
);

s = s.replace(
  "        </motion.div>\n      </section>\n\n      {/* About Us Section */}\n      <section className=\"relative py-10",
  "        </motion.div>\n      </FadeInSection>\n\n      <FadeInSection className=\"relative py-10"
);

s = s.replace(/bg-success\/10/g, "bg-secondary/10");
s = s.replace(/text-success/g, "text-secondary");
s = s.replace("p-8 md:p-10 card-hover group", "p-8 md:p-10 marketing-card-lift group");
s = s.replace("p-8 md:p-12 card-hover", "p-8 md:p-12 marketing-card-lift");
s = s.replace(/cursor-pointer card-hover group/g, "cursor-pointer marketing-card-lift group");

fs.writeFileSync(p, s);
console.log({ mockup: s.includes("HeroDashboardMockup"), trusted: s.includes("trustedStats") });
