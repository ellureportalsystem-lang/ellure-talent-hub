import fs from "fs";

// MarketingPageHero optional banner
let heroTsx = fs.readFileSync("src/components/marketing/MarketingPageHero.tsx", "utf8");
if (!heroTsx.includes("{imageSrc ?")) {
  heroTsx = heroTsx.replace(
    `    <motion.div
      className="absolute inset-0 marketing-hero-banner bg-cover bg-no-repeat"
      style={{ backgroundImage: \`url(\${imageSrc})\` }}
      aria-hidden
    />`,
    `    {imageSrc ? (
      <div
        className="absolute inset-0 marketing-hero-banner bg-cover bg-no-repeat"
        style={{ backgroundImage: \`url(\${imageSrc})\` }}
        aria-hidden
      />
    ) : null}`
  );
  heroTsx = heroTsx.replace(
    `<motion.div
      className="absolute inset-0 marketing-hero-banner`,
    `<motion.div
      className="absolute inset-0 marketing-hero-banner`
  );
  heroTsx = heroTsx.replace(
    `    <motion.div
      className="absolute inset-0 marketing-hero-banner`,
    `    {imageSrc ? (
      <motion.div
        className="absolute inset-0 marketing-hero-banner`
  );
}
// Simpler rewrite of banner block
heroTsx = fs.readFileSync("src/components/marketing/MarketingPageHero.tsx", "utf8");
heroTsx = heroTsx.replace(
  /    <div\n      className="absolute inset-0 marketing-hero-banner[\s\S]*?    \/>\n    <motion.div className="absolute inset-0 marketing-hero-overlay"/,
  `    {imageSrc ? (
      <div
        className="absolute inset-0 marketing-hero-banner bg-cover bg-no-repeat"
        style={{ backgroundImage: \`url(\${imageSrc})\` }}
        aria-hidden
      />
    ) : null}
    <div className="absolute inset-0 marketing-hero-overlay"`
);
heroTsx = heroTsx.replace("<motion.div className=\"absolute inset-0 marketing-hero-overlay\"", "<div className=\"absolute inset-0 marketing-hero-overlay\"");
fs.writeFileSync("src/components/marketing/MarketingPageHero.tsx", heroTsx);

function patchHero(file, replacement) {
  let s = fs.readFileSync(file, "utf8");
  if (!s.includes("MarketingPageHero") && !s.includes("import MarketingPageHero")) {
    s = s.replace(
      /import MarketingLayout from "@\/components\/marketing\/MarketingLayout";/,
      `import MarketingLayout from "@/components/marketing/MarketingLayout";\nimport MarketingPageHero from "@/components/marketing/MarketingPageHero";`
    );
  }
  const re = /      \{\/\* Hero Section \*\/\}[\s\S]*?      <\/section>\n/;
  if (!re.test(s)) {
    console.warn("No hero block:", file);
    return;
  }
  s = s.replace(re, replacement + "\n");
  fs.writeFileSync(file, s);
  console.log("Patched hero:", file);
}

patchHero(
  "src/pages/About.tsx",
  `      <MarketingPageHero
        imageSrc="/about-banner.jpg"
        align="left"
        title={<span className="gold-text">About Us</span>}
        subtitle={<>Building <span className="gold-text">structured, ethical, and scalable</span> hiring experiences.</>}
      />`
);

patchHero(
  "src/pages/Features.tsx",
  `      <MarketingPageHero
        imageSrc="/features-banner.jpg"
        title={<> <span className="gold-text">Platform Features</span></>}
        subtitle={<>Everything you need to manage recruitment at scale with <span className="gold-text">efficiency and precision</span></>}
      />`
);

patchHero(
  "src/pages/Industries.tsx",
  `      <MarketingPageHero
        imageSrc="/industries-banner.jpg"
        title={<> <span className="gold-text">Industries We Serve</span></>}
        subtitle={<>Specialised <span className="gold-text">recruitment expertise</span> across diverse sectors</>}
      />`
);

patchHero(
  "src/pages/Contact.tsx",
  `      <MarketingPageHero
        imageSrc="/contact-banner.jpg"
        title={<> <span className="gold-text">Get in Touch</span></>}
        subtitle={<>We'd love to hear from you. Let's discuss how we can <span className="gold-text">help</span>.</>}
      />`
);

// FAQ - gradient hero only
let faq = fs.readFileSync("src/pages/FAQ.tsx", "utf8");
if (!faq.includes("MarketingPageHero")) {
  faq = faq.replace(
    /import MarketingLayout from "@\/components\/marketing\/MarketingLayout";/,
    `import MarketingLayout from "@/components/marketing/MarketingLayout";\nimport MarketingPageHero from "@/components/marketing/MarketingPageHero";`
  );
  faq = faq.replace(
    /      \{\/\* Hero Section \*\/\}[\s\S]*?      <\/section>\n/,
    `      <MarketingPageHero
        title="Frequently Asked Questions"
        subtitle="Find answers to common questions about Ellure Nexhire"
        align="left"
      />\n`
  );
  fs.writeFileSync("src/pages/FAQ.tsx", faq);
  console.log("Patched hero: FAQ");
}

// Contact map height
let contact = fs.readFileSync("src/pages/Contact.tsx", "utf8");
contact = contact.replace('height="380"', 'className="w-full h-[min(50vh,280px)] sm:h-[320px] md:h-[380px]"');
contact = contact.replace(/\n                height="380"\n/, "\n");
contact = contact.replace(
  'className="rounded-lg pointer-events-none"',
  'className="rounded-lg pointer-events-none w-full h-[min(50vh,280px)] sm:h-[320px] md:h-[380px]"'
);
fs.writeFileSync("src/pages/Contact.tsx", contact);

// FAQPreview
let faqPrev = fs.readFileSync("src/components/FAQPreview.tsx", "utf8");
faqPrev = faqPrev.replace(
  '<section className="py-10 md:py-12 relative overflow-hidden">',
  '<section className="py-10 md:py-12 relative overflow-hidden px-4 sm:px-6">'
);
faqPrev = faqPrev.replace(
  '<motion.div className="container relative">',
  '<motion.div className="container relative px-0 sm:px-6">'
);
faqPrev = faqPrev.replace("<motion.div className=\"container relative\">", "<div className=\"container relative\">");
faqPrev = faqPrev.replace('grid md:grid-cols-2 gap-6', 'grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6');
faqPrev = faqPrev.replace('Card className="p-6 h-full', 'Card className="p-5 sm:p-6 h-full marketing-card-lift');
faqPrev = faqPrev.replace('h3 className="font-semibold text-lg', 'h3 className="font-semibold text-base sm:text-lg');
fs.writeFileSync("src/components/FAQPreview.tsx", faqPrev);

// Hero mockup smaller on mobile
let mock = fs.readFileSync("src/components/marketing/HeroDashboardMockup.tsx", "utf8");
mock = mock.replace(
  "max-w-[280px] sm:max-w-md",
  "max-w-[min(100%,260px)] sm:max-w-md"
);
fs.writeFileSync("src/components/marketing/HeroDashboardMockup.tsx", mock);

// Landing feature cards
let landing = fs.readFileSync("src/pages/Landing.tsx", "utf8");
landing = landing.replace(
  'className={`p-6 cursor-pointer marketing-card-lift',
  'className={`p-5 sm:p-6 cursor-pointer marketing-card-lift'
);
landing = landing.replace(
  'Card className="p-8 md:p-10 marketing-card-lift group cursor-pointer border-2 border-border shadow-lg hover:shadow-2xl hover:border-secondary/60',
  'Card className="marketing-card-pad marketing-card-lift group cursor-pointer border-2 border-border shadow-lg hover:shadow-2xl hover:border-secondary/60'
);
fs.writeFileSync("src/pages/Landing.tsx", landing);

console.log("Done");
