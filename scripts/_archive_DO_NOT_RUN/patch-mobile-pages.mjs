import fs from "fs";

const heroBlock = (image, titleInner, subtitleInner, align = "center") => `      <MarketingPageHero
        imageSrc="${image}"
        align="${align}"
        title={<>${titleInner}</>}
        subtitle={<>${subtitleInner}</>}
      />`;

const pages = [
  {
    file: "src/pages/About.tsx",
    import: 'import MarketingPageHero from "@/components/marketing/MarketingPageHero";',
    start: /      \{\/\* Hero Section \*\/\}[\s\S]*?      <\/section>\n\n      \{\/\* Section 1/,
    replace: `${heroBlock("/about-banner.jpg", '<span className="gold-text">About Us</span>', 'Building <span className="gold-text">structured, ethical, and scalable</span> hiring experiences.', "left")}

      {/* Section 1`,
  },
];

// Manual patches done via search_replace - script for reference only
console.log("Use search_replace for remaining pages");
