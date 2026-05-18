import fs from "fs";

const file = "src/pages/Landing.tsx";
let s = fs.readFileSync(file, "utf8");
const d = "</" + "div>";
const m = "</" + "motion.div>";

s = s.replace(
  `                    </Link>
                  </Button>
                ${m}
              ${m}
            </Card>
          ${m}
        ${m}
      </FadeInSection>

      <FadeInSection className="py-10 md:py-12 px-4 sm:px-6">
        <div className="container">
          <motion.div 
            className="text-center mb-8"`,
  `                    </Link>
                  </Button>
                ${d}
              ${d}
            </Card>
          ${m}
        ${d}
      </FadeInSection>

      <FadeInSection className="py-10 md:py-12 px-4 sm:px-6">
        <motion.div className="container">
          <motion.div 
            className="text-center mb-8"`
);

// undo accidental container motion change
s = s.replace(
  `<FadeInSection className="py-10 md:py-12 px-4 sm:px-6">
        <motion.div className="container">
          <motion.div 
            className="text-center mb-8"`,
  `<FadeInSection className="py-10 md:py-12 px-4 sm:px-6">
        <div className="container">
          <motion.div 
            className="text-center mb-8"`
);

s = s.replace(
  `                    <Link to="/services">View Our Services</Link>
                  </Button>
                ${m}
              ${m}
            </Card>
          ${m}
        ${m}
      </FadeInSection>

      <FAQPreview />`,
  `                    <Link to="/services">View Our Services</Link>
                  </Button>
                ${d}
              ${d}
            </Card>
          ${m}
        ${d}
      </FadeInSection>

      <FAQPreview />`
);

fs.writeFileSync(file, s);
console.log("Landing about + CTA tags fixed");
