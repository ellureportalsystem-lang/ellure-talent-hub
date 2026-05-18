import fs from "fs";

const file = "src/pages/Landing.tsx";
let s = fs.readFileSync(file, "utf8");

const D = "</" + "div>";
const M = "</" + "motion.div>";

const list = [
  [
    `Register Now</Link>\n                </Button>\n              ${M}\n            </Card>`,
    `Register Now</Link>\n                </Button>\n              ${D}\n            </Card>`,
  ],
  [
    `Contact Us</Link>\n                </Button>\n              ${M}\n            </Card>`,
    `Contact Us</Link>\n                </Button>\n              ${D}\n            </Card>`,
  ],
  [
    `            </Card>\n          ${M}\n        ${M}\n      </FadeInSection>\n\n      <FadeInSection className="relative py-10`,
    `            </Card>\n          ${M}\n        ${D}\n      </FadeInSection>\n\n      <FadeInSection className="relative py-10`,
  ],
  [
    `            </Card>\n          ${D}\n        ${D}\n      </FadeInSection>\n\n      <FadeInSection className="py-10 md:py-12 px-4 sm:px-6">\n        <motion.div className="container">\n          <motion.div \n            className="text-center mb-8"`,
    `            </Card>\n          ${M}\n        ${D}\n      </FadeInSection>\n\n      <FadeInSection className="py-10 md:py-12 px-4 sm:px-6">\n        <div className="container">\n          <motion.div \n            className="text-center mb-8"`,
  ],
  [
    `                </Card>\n              ${D}\n            ))}\n          ${D}\n          \n          <motion.div className="text-center mt-8">`,
    `                </Card>\n              ${M}\n            ))}\n          ${D}\n          \n          <div className="text-center mt-8">`,
  ],
  [
    `            </Button>\n          ${M}\n        ${M}\n      </FadeInSection>\n\n      <FadeInSection className="py-10 md:py-12 px-4 sm:px-6">\n        <motion.div className="container">\n          <motion.div\n            initial={{ opacity: 0, y: 20 }}`,
    `            </Button>\n          ${D}\n        ${D}\n      </FadeInSection>\n\n      <FadeInSection className="py-10 md:py-12 px-4 sm:px-6">\n        <div className="container">\n          <motion.div\n            initial={{ opacity: 0, y: 20 }}`,
  ],
  [
    `            </Card>\n          ${D}\n        ${D}\n      </FadeInSection>\n\n      <FAQPreview />`,
    `            </Card>\n          ${M}\n        ${D}\n      </FadeInSection>\n\n      <FAQPreview />`,
  ],
];

let n = 0;
for (const [from, to] of list) {
  if (s.includes(from)) {
    s = s.replace(from, to);
    n++;
  } else {
    console.warn("MISSING:", from.slice(0, 70).replace(/\n/g, "\\n"));
  }
}

fs.writeFileSync(file, s);
console.log("Applied", n, "fixes");
