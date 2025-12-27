# Ellure NexHire - Pages Documentation

This document provides comprehensive details about all pages in the Ellure NexHire website, including content, colors, banners, layouts, and styling information.

---

## Table of Contents

1. [Homepage](#homepage)
2. [Services Page](#services-page)
3. [Features Page](#features-page)
4. [Industries Page](#industries-page)
5. [About Page](#about-page)
6. [Contact Us Page](#contact-us-page)
7. [FAQ Page](#faq-page)

---

## Homepage

### Overview
The homepage serves as the main landing page with multiple sections showcasing the platform's capabilities, services, and value propositions.

### Hero Section
- **Height**: `h-[480px] md:h-[530px]`
- **Background**: Rotating banner images (`banner-1.jpg`, `banner-2.jpg`, `banner-3.jpg`)
- **Animation**: Horizontal slide transition (slides in from right, exits to left)
- **Overlay**: `bg-gradient-to-r from-black/40 via-black/20 to-transparent`
- **Text Position**: `pt-32 md:pt-36` (lowered by 1-2cm)

#### Hero Slides Content:
1. **Slide 1**:
   - Title: "Empowering Organizations With" + "Exceptional Talent" (gold)
   - Subtitle: "We connect businesses with highly skilled professionals through precision-driven recruitment and industry expertise."

2. **Slide 2**:
   - Title: "Your Trusted Partner in" + "End-to-End Recruitment Excellence" (gold)
   - Subtitle: "Delivering the right talent for every role, every time — with speed, accuracy, and integrity."

3. **Slide 3**:
   - Title: "Transforming Hiring for a" + "Better, Smarter Workforce" (gold)
   - Subtitle: "Structured hiring solutions tailored for IT, Non-IT, Telecom, E-Commerce, BFSI, Engineering, and more."

#### Hero Buttons:
- **Join as Applicant** (links to `/auth/register`)
- **Hire Talent** (links to `/contact`)
- **Slider Indicators**: 3 dots for manual navigation

### Stats Strip Section
- **Background**: `bg-background` with gradient overlay
- **Layout**: 2 columns on mobile, 4 columns on desktop
- **Stats Cards**:
  - 500+ Successful Placements
  - 50+ Corporate Clients
  - 8+ Years Experience
  - 95% Client Satisfaction
- **Styling**: 
  - Border: `border-2 border-border`
  - Shadow: `shadow-md hover:shadow-xl`
  - Hover: `hover:border-primary/60`
  - Decorative corner elements on hover

### CTA Cards Section
Two large cards side by side:

#### Join as Applicant Card
- **Icon**: Users icon
- **Content**:
  - Title: "Join as Applicant"
  - Description: "Create your profile and get discovered by top employers across multiple industries."
  - Features:
    - Free profile creation
    - Access to top companies
    - Career guidance support
  - Button: "Register Now" (links to `/auth/register`)
- **Styling**: 
  - Primary color theme
  - Decorative corner elements (top-right and bottom-left)
  - Shadow: `shadow-lg hover:shadow-2xl`

#### Hire Talent Card
- **Icon**: Building2 icon
- **Content**:
  - Title: "Hire Talent"
  - Description: "Access our curated talent pool and find perfect candidates for your organization."
  - Features:
    - Pre-screened candidates
    - Industry-specific talent
    - Fast turnaround time
  - Button: "Contact Us" (links to `/contact`)
- **Styling**: 
  - Secondary color theme
  - Decorative corner elements
  - Shadow: `shadow-lg hover:shadow-2xl`

### About Us Section
- **Background**: Gradient overlay `from-muted/40 via-muted/20 to-transparent`
- **Content**:
  - Section Label: "Who We Are"
  - Title: "About Us"
  - Description: "Ellure NexHire connects organizations with exceptional, industry-ready talent through modern, data-driven recruitment solutions. With nearly a decade of experience across IT, Non-IT, Telecom, BFSI, Engineering, and more, we help businesses hire smarter, faster, and with confidence. Our mission is simple — deliver the right talent for the right role, every time."
  - Button: "Learn More About Us" (links to `/about`)
- **Styling**: 
  - Card with decorative corner elements
  - Shadow: `shadow-xl hover:shadow-2xl`

### Features Section
- **Section Label**: "What We Offer"
- **Title**: "Powerful Features"
- **Subtitle**: "Click on any feature card to explore its full capabilities"
- **Layout**: 2 columns on tablet, 3 columns on desktop
- **Features** (6 total, expandable cards):
  1. **Smart Application Management**
     - Icon: FileCheck
     - Short: "Multi-step registration and automated profile creation"
     - Full: "Multi-step registration, automated profile creation, resume parsing, and instant dashboard access."

  2. **Advanced Analytics**
     - Icon: TrendingUp
     - Short: "Track hiring performance and real-time metrics"
     - Full: "Track hiring performance, applicant flow, skill clusters, and real-time metrics."

  3. **Bulk Operations**
     - Icon: Users
     - Short: "Upload thousands of applicants and manage at scale"
     - Full: "Upload thousands of applicants via CSV/Excel, export structured reports, and manage data at scale."

  4. **Enterprise Security**
     - Icon: Shield
     - Short: "Role-based access control and encrypted data"
     - Full: "Role-based access control, audit logging, encrypted data, and SOC-2-ready workflows."

  5. **Client Collaboration Tools**
     - Icon: Building2
     - Short: "Share candidate folders and manage communication"
     - Full: "Share candidate folders, collect feedback, and manage communication efficiently."

  6. **Smart Matching Engine**
     - Icon: Sparkles
     - Short: "AI-powered resume analysis and recommendations"
     - Full: "AI-powered resume analysis and automated skill-based candidate recommendations."

- **Styling**: 
  - Expandable cards with click interaction
  - Border: `border-2 border-border hover:border-primary/60`
  - Shadow: `shadow-md hover:shadow-xl`
  - Decorative corner elements

### Final CTA Section
- **Background Image**: `cta-banner.jpg`
- **Overlay**: `from-black/50 via-black/30 to-black/50`
- **Content**:
  - Title: "Ready to Transform Your Hiring?" (with "Transform Your Hiring" in gold)
  - Description: "Join hundreds of organizations that trust Ellure for their recruitment needs."
  - Buttons:
    - "Get Started Today" (links to `/contact`)
    - "View Our Services" (links to `/services`)
- **Styling**: 
  - White text on dark overlay
  - Border: `border-2 border-white/20 hover:border-white/40`

### FAQ Preview Section
- **Section Label**: "Help Center"
- **Title**: "Frequently Asked Questions"
- **Layout**: 2x2 grid (4 FAQs)
- **FAQs**:
  1. "What is Ellure Nexhire?"
  2. "Is Ellure Nexhire a recruitment consultancy?"
  3. "Is data secure on Ellure Nexhire?"
  4. "How do I get started as an applicant?"
- **Button**: "View All FAQs" (links to `/faq`)
- **Styling**: 
  - Cards with `shadow-md hover:shadow-xl`
  - Border: `border-2 border-border hover:border-primary/60`

### Color Scheme
- **Primary Color**: Blue (`#0566cd`)
- **Gold Text**: Custom gold color class (`.gold-text`)
- **Background**: `bg-gradient-subtle`
- **Cards**: White with borders and shadows

### Animations
- **Banner Transition**: Horizontal slide (0.7s duration, cubic-bezier easing)
- **Text Animation**: Fade and slide (0.6s duration)
- **Scroll Animations**: Framer Motion with `whileInView`
- **Hover Effects**: Scale, shadow, and border color changes

---

## Services Page

### Overview
The Services page details the hiring solutions and services offered by Ellure NexHire.

### Hero Section
- **Height**: `py-16 md:py-20`
- **Background Image**: `services-banner.jpg`
- **Overlay**: `from-black/40 via-black/20 to-transparent`
- **Content**:
  - Title: "Our Services" (with "Services" in gold)
  - Subtitle: "Structured hiring solutions for employers and candidates." (with "hiring solutions" in gold)
- **Text Alignment**: Center

### What We Do Section
- **Title**: "What We Do"
- **Description**: "We support hiring outcomes through structured coordination, relevance screening, and ethical process management — without replacing internal HR or recruitment ownership."

### Our Services Section
- **Title**: "Our Services"
- **Subtitle**: "Explore what we offer"
- **Layout**: 2 columns on tablet, 4 columns on desktop
- **Services** (6 total, expandable):
  1. **Resume Intake & Validation**
     - Icon: FileText
     - Short: "Structured resume submission and basic validation"
     - Full: "Structured resume submission and basic validation to ensure profiles are relevant and ready for hiring workflows."

  2. **Profile Relevance Screening**
     - Icon: CheckCircle
     - Short: "Initial screening based on skills and role fit"
     - Full: "Initial screening based on skills, experience alignment, notice period, and role fit — without claiming deep interviews."

  3. **Skill & Role Mapping**
     - Icon: BarChart3
     - Short: "Accurate mapping of candidate skills to role requirements"
     - Full: "Accurate mapping of candidate skills to role requirements to improve shortlist quality and relevance."

  4. **Candidate–Client Coordination**
     - Icon: Users
     - Short: "End-to-end coordination including interview scheduling"
     - Full: "End-to-end coordination including interview scheduling, feedback sharing, offer updates, and joiner follow-ups."

  5. **Hiring Process Support**
     - Icon: Briefcase
     - Short: "Operational support across hiring stages"
     - Full: "Operational support across hiring stages such as interview flow management, timeline follow-ups, and closure assistance."

  6. **Ethical Hiring Enablement**
     - Icon: Shield
     - Short: "Promoting transparency and accountability"
     - Full: "Promoting transparency, timely communication, and accountability across candidates and employers throughout the hiring process."

- **Styling**: 
  - Expandable cards
  - Border: `border-2 border-border hover:border-primary/60`
  - Shadow: `shadow-md hover:shadow-xl`
  - "Get Started" button in expanded state

### How It Works Section
- **Background**: `bg-muted/30` with gradient line
- **Title**: "How It Works"
- **Subtitle**: "Our hiring process"
- **Layout**: 4 columns
- **Process Steps**:
  1. **Understand**: "Role requirements, expectations, and timelines are aligned."
  2. **Source**: "Relevant profiles are sourced through structured intake."
  3. **Screen**: "Profiles are screened and mapped for relevance and fit."
  4. **Deliver**: "Shortlists, coordination, and hiring support are delivered through the platform."

- **Styling**: 
  - Cards with large step numbers
  - Border: `border-2 border-border`
  - Shadow: `shadow-md hover:shadow-xl`

### CTA Section
- **Background Image**: `services-cta-banner.jpg`
- **Overlay**: `from-black/70 via-black/60 to-black/70` (darker than other pages)
- **Content**:
  - Title: "Ready to Get Started?" (with "Get Started" in gold)
  - Description: "Let's discuss your hiring needs and discover how we can support your organization." (with "hiring needs" and "support" in gold)
  - Buttons:
    - "Get in Touch" (links to `/contact`)
    - "Learn More" (links to `/about`)

### Color Scheme
- **Primary Color**: Blue
- **Gold Text**: Used for emphasis
- **Background**: `bg-gradient-subtle`

### Animations
- **Scroll Animations**: Framer Motion
- **Card Expansions**: Smooth height transitions
- **Hover Effects**: Shadow and border changes

---

## Features Page

### Overview
The Features page showcases the platform's technical capabilities and features.

### Hero Section
- **Height**: `py-16 md:py-20`
- **Background Image**: `features-banner.jpg`
- **Overlay**: `from-black/40 via-black/20 to-transparent`
- **Content**:
  - Title: "Platform Features" (entire title in gold)
  - Subtitle: "Everything you need to manage recruitment at scale with efficiency and precision" (with "efficiency and precision" in gold)
- **Text Alignment**: Center

### Powerful Features Section
- **Section Label**: "Explore"
- **Title**: "Powerful Features"
- **Subtitle**: "Click on any feature to explore its capabilities and key benefits"
- **Layout**: 2 columns on tablet, 3 columns on desktop
- **Features** (6 total, expandable):
  1. **Application Lifecycle Management**
     - Icon: FileCheck
     - Short: "Tracks candidate journey end-to-end"
     - Full: "Tracks candidate journey end-to-end. Mandatory for any serious hiring portal. HRs understand this immediately. Complete visibility into every stage of the application process from submission to final decision."
     - Benefits:
       - End-to-end candidate tracking
       - Stage-by-stage visibility
       - HR-friendly interface
       - Complete application history

  2. **Context-Based Matching Engine**
     - Icon: Search
     - Short: "Matches candidates by relevance, not keywords"
     - Full: "Matches candidates by relevance, not keywords. Strong differentiator when explained properly. Avoids fake 'AI' claims. Intelligent matching that understands context and role requirements for better candidate fit."
     - Benefits:
       - Relevance-based matching
       - Context understanding
       - Better candidate fit
       - Transparent process

  3. **HR–Recruiter Collaboration Workspace**
     - Icon: MessageSquare
     - Short: "Private feedback & notes for ethical hiring"
     - Full: "Private feedback & notes. Ethical, transparent hiring. Aligns with Ellure's brand values. Secure workspace for HR and recruiters to collaborate, share feedback, and maintain transparent communication throughout the hiring process."
     - Benefits:
       - Private feedback system
       - Secure collaboration
       - Transparent communication
       - Ethical hiring practices

  4. **Controlled Bulk Actions**
     - Icon: Users
     - Short: "Saves recruiter time with enterprise-safe limits"
     - Full: "Saves recruiter time. Prevents spam & misuse. Enterprise-safe. Controlled bulk operations with built-in limits to ensure quality and prevent abuse while maintaining efficiency for recruiters."
     - Benefits:
       - Time-saving bulk operations
       - Spam prevention
       - Enterprise-safe limits
       - Quality control

  5. **Essential Hiring Analytics**
     - Icon: TrendingUp
     - Short: "Actionable metrics without dashboard overload"
     - Full: "Actionable metrics only. No dashboard overload. Builds trust with MNCs. Focused analytics that provide meaningful insights without overwhelming users with unnecessary data."
     - Benefits:
       - Actionable insights
       - Clean dashboard
       - MNC-ready
       - Trust-building metrics

  6. **Enterprise-Grade Security & Compliance**
     - Icon: Shield
     - Short: "Non-negotiable for MNC clients"
     - Full: "Non-negotiable for MNC clients. Data protection & access control. Silent credibility booster. Enterprise-grade security with comprehensive data protection, access controls, and compliance features that MNCs require."
     - Benefits:
       - Data protection
       - Access control
       - MNC compliance
       - Enterprise security

- **Styling**: 
  - Expandable cards with benefits list
  - Border: `border-2 border-border hover:border-primary/60`
  - Shadow: `shadow-md hover:shadow-xl`

### Platform Impact Section
- **Background**: `bg-muted/30` with gradient line
- **Section Label**: "Results"
- **Title**: "Platform Impact"
- **Subtitle**: "Real results from organizations using our platform"
- **Layout**: 4 columns
- **Stats**:
  - 80% Time Saved (In recruitment processes)
  - 95% Accuracy (In candidate matching)
  - 50K+ Profiles (Managed efficiently)
  - 24/7 Support (Available when you need)
- **Styling**: 
  - Cards with large stat values
  - Hover scale effect on values

### Built for Enterprise Section
- **Section Label**: "Enterprise Ready"
- **Title**: "Built for Scale & Security"
- **Subtitle**: "Enterprise-grade features designed for scale and security"
- **Layout**: 3 columns
- **Items**:
  1. **Enterprise Security**: "Bank-level encryption and compliance ready" (Shield icon)
  2. **Lightning Fast**: "Optimized performance at any scale" (Zap icon)
  3. **Collaborative**: "Built for teams and stakeholders" (Users icon)

### CTA Section
- **Background Image**: `features-cta-banner.jpg`
- **Overlay**: `from-black/50 via-black/30 to-black/50`
- **Content**:
  - Title: "Ready to Experience These Features?" (with "Experience" and "Features" in gold)
  - Description: "Get started today and transform your recruitment process." (with "transform" in gold)
  - Buttons:
    - "Start Free Trial" (links to `/auth/register`)
    - "Schedule Demo" (links to `/contact`)

### Color Scheme
- **Primary Color**: Blue
- **Gold Text**: Used for emphasis
- **Success Color**: Green (for checkmarks)

### Animations
- **Scroll Animations**: Framer Motion
- **Card Expansions**: Smooth transitions
- **Hover Effects**: Scale and shadow changes

---

## Industries Page

### Overview
The Industries page showcases the various industry sectors that Ellure NexHire serves.

### Hero Section
- **Height**: `py-16 md:py-20`
- **Background Image**: `industries-banner.jpg`
- **Overlay**: `from-black/40 via-black/20 to-transparent`
- **Content**:
  - Title: "Industries We Serve" (entire title in gold)
  - Subtitle: "Specialised recruitment expertise across diverse sectors" (with "recruitment expertise" in gold)
- **Text Alignment**: Center

### Industries We Serve Section
- **Title**: "Industries We Serve"
- **Subtitle**: "Our sector expertise"
- **Layout**: 2 columns on tablet, 4 columns on desktop
- **Industries** (7 total, clickable for details):
  1. **IT & Technology Services**
     - Icon: Code
     - Short: "Technology and software development"
     - Full: "Comprehensive recruitment solutions for software developers, engineers, architects, DevOps specialists, cloud experts, and IT leadership roles across all technology stacks."
     - Sample Roles: Software Developer, Full Stack Engineer, DevOps Engineer, Cloud Architect, IT Manager

  2. **ITES & Shared Services**
     - Icon: Headphones
     - Short: "IT-enabled services and BPO"
     - Full: "Specialized hiring for customer support, technical support, data entry, back office operations, and process management roles in the ITES sector."
     - Sample Roles: Customer Support, Technical Support, Data Entry Operator, Process Associate, Team Leader

  3. **BFSI**
     - Icon: DollarSign
     - Short: "Banking, financial services, and insurance"
     - Full: "Strategic hiring for banking operations, financial analysis, insurance sales, risk management, and compliance roles in the BFSI sector."
     - Sample Roles: Relationship Manager, Financial Analyst, Insurance Advisor, Risk Manager, Compliance Officer

  4. **E-commerce & Digital Businesses**
     - Icon: ShoppingCart
     - Short: "Online retail and digital marketplaces"
     - Full: "Talent acquisition for e-commerce operations, logistics, digital marketing, customer service, and management roles in the rapidly growing online retail sector."
     - Sample Roles: E-commerce Manager, Logistics Coordinator, Digital Marketing, Customer Service, Operations Head

  5. **Pharmaceuticals & Life Sciences**
     - Icon: Pill
     - Short: "Healthcare and pharmaceutical industry"
     - Full: "Specialized hiring for pharmaceutical sales, medical representatives, quality control, R&D, and regulatory affairs professionals."
     - Sample Roles: Medical Representative, Pharma Sales, Quality Control, R&D Scientist, Regulatory Affairs

  6. **Manufacturing & Engineering**
     - Icon: HardHat
     - Short: "Infrastructure and engineering"
     - Full: "Recruitment for engineers, project managers, quality control, production managers, and technical professionals in manufacturing and engineering sectors."
     - Sample Roles: Production Engineer, Quality Engineer, Project Manager, Maintenance Engineer, Process Engineer

  7. **Telecom & Infrastructure**
     - Icon: Building2
     - Short: "Telecommunications and networking"
     - Full: "Expert recruitment for telecom engineers, network specialists, RF engineers, sales executives, and technical support roles in the telecommunications industry."
     - Sample Roles: Network Engineer, RF Engineer, Telecom Sales, Technical Support, Infrastructure Manager

- **Styling**: 
  - Cards open dialog on click
  - Border: `border-2 border-border`
  - Shadow: `shadow-md hover:shadow-xl`
  - Hover lift effect: `y: -8`

### Why Clients Choose Us Section
- **Background**: `bg-muted/30` with gradient line
- **Title**: "Why Clients Choose Us"
- **Layout**: 2 columns on tablet, 4 columns on desktop
- **Items**:
  1. **Industry Expertise** (TrendingUp icon): "Understanding role nuances across sectors."
  2. **Quality-Focused Screening** (CheckCircle icon): "Relevance over volume — no bulk resumes."
  3. **Strong Talent Network** (Users icon): "Access to active and passive candidates."
  4. **Proven Track Record** (Award icon): "Consistent delivery and ethical hiring practices."

### Industry Partnerships Section
- **Title**: "Industry Partnerships"
- **Layout**: 3 columns
- **Stats**:
  - 50+ Hiring Partners
  - 1,000+ Successful Placements
  - 95% Client Satisfaction
- **Note**: "Across multiple roles and industry verticals."

### Industry Detail Dialog
- **Trigger**: Click on any industry card
- **Content**:
  - Industry icon and title
  - Full description
  - Sample roles (displayed as badges)
  - Action buttons:
    - "Discuss Requirements" (links to `/contact`)
    - "View Services" (links to `/services`)

### CTA Section
- **Background Image**: `industries-cta-banner.jpg`
- **Overlay**: `from-black/50 via-black/30 to-black/50`
- **Content**:
  - Title: "Looking for talent in your industry?" (with "talent" and "industry" in gold)
  - Description: "Let's support your hiring goals with structured and ethical hiring solutions." (with "hiring goals" and "hiring solutions" in gold)
  - Buttons:
    - "Get in Touch" (links to `/contact`)
    - "Discuss Your Hiring Needs" (links to `/contact`)

### Color Scheme
- **Primary Color**: Blue
- **Gold Text**: Used for emphasis
- **Background**: `bg-gradient-subtle`

### Animations
- **Scroll Animations**: Framer Motion
- **Card Hover**: Lift effect
- **Dialog**: Smooth open/close

---

## About Page

### Overview
The About page provides information about Ellure NexHire's history, mission, vision, and values.

### Hero Section
- **Height**: `py-16 md:py-20`
- **Background Image**: `about-banner.jpg`
- **Overlay**: `from-black/40 via-black/20 to-transparent`
- **Content**:
  - Title: "About Us" (entire title in gold)
  - Subtitle: "Building structured, ethical, and scalable hiring experiences." (with "structured, ethical, and scalable" in gold)
- **Text Alignment**: Left

### Our Journey Section
- **Title**: "Our Journey"
- **Content**: Three paragraphs describing:
  1. Ellure's founding purpose
  2. Support to organizations over the years
  3. Development of Ellure Nexhire platform
- **Styling**: 
  - Card with `shadow-md hover:shadow-xl`
  - Border: `border-2 border-border hover:border-primary/60`

### Our Mission Section
- **Background**: `bg-muted/30` with gradient line
- **Title**: "Our Mission"
- **Content**: "To enable organisations and candidates to experience efficient, transparent, and ethical hiring through structured workflows and technology-enabled collaboration."
- **Styling**: 
  - Centered card
  - Border: `border-2 border-border`

### Our Vision Section
- **Title**: "Our Vision"
- **Content**: "To become a trusted hiring ecosystem where employers and candidates engage through clarity, relevance, and long-term value."
- **Styling**: 
  - Centered card
  - Border: `border-2 border-border`

### Our Values Section
- **Background**: `bg-muted/30` with gradient line
- **Title**: "Our Values"
- **Layout**: 2 columns
- **Values**:
  1. **Ethical Hiring**: "Transparency and fairness at every stage"
  2. **Quality Over Quantity**: "Relevance matters more than volume"
  3. **Accountability**: "Clear ownership and timely communication"
  4. **Collaboration**: "Working closely with clients and candidates"
- **Styling**: 
  - Cards with icons
  - Border: `border-2 border-border`

### Why Choose Ellure Section
- **Title**: "Why Choose Ellure"
- **Layout**: 2 columns (last item spans full width)
- **Items**:
  1. **10+ Years of Deep Industry Knowledge** (TrendingUp icon): "Hands-on experience supporting hiring across multiple sectors and roles."
  2. **Strong Process & Platform Approach** (Users icon): "Human coordination supported by structured workflows and technology."
  3. **Quality-Focused Delivery** (CheckCircle icon): "Shortlists based on relevance, not bulk submissions."
  4. **Higher Success Ratio** (Award icon): "Consistent closures driven by clarity, coordination, and follow-through."
  5. **Ready to Work With You** (Heart icon): "Flexible, responsive, and aligned to your hiring timelines." (full width)

### CTA Section
- **Background Image**: `about-cta-banner.jpg`
- **Overlay**: `from-black/50 via-black/30 to-black/50`
- **Content**:
  - Title: "Ready to Work With Us?" (with "Work With Us" in gold)
  - Description: "Let's build hiring outcomes that are structured, ethical, and scalable." (with "hiring outcomes" and "structured, ethical, and scalable" in gold)
  - Buttons:
    - "Get in Touch" (links to `/contact`)
    - "Learn More" (links to `/services`)

### Color Scheme
- **Primary Color**: Blue
- **Gold Text**: Used for emphasis
- **Background**: `bg-gradient-subtle`

### Animations
- **Scroll Animations**: Framer Motion
- **Card Hover**: Shadow and border changes

---

## Contact Us Page

### Overview
The Contact Us page provides contact information, a contact form, and business hours.

### Hero Section
- **Height**: `py-16 md:py-20`
- **Background Image**: `contact-banner.jpg`
- **Overlay**: `from-black/40 via-black/20 to-transparent`
- **Content**:
  - Title: "Get in Touch" (entire title in gold)
  - Subtitle: "We'd love to hear from you. Let's discuss how we can help." (with "help" in gold)
- **Text Alignment**: Center

### Google Map Section
- **Map**: Embedded Google Maps iframe
- **Location**: Ellure Consulting Services, H657 Parmar Nagar, Opp Vishal Mega Mart, Wanowrie, Pune – 411013
- **Styling**: 
  - Card with border
  - Clickable to open in Google Maps
  - Border: `border-2 border-border`
  - Shadow: `shadow-md hover:shadow-xl`

### Contact Section
- **Layout**: 2 columns (form on left, info on right)

#### Contact Form
- **Title**: "Send Us a Message"
- **Fields**:
  - Full Name (required)
  - Email Address (required)
  - Phone Number (required)
  - Your Message (required, textarea)
- **Button**: "Send Message" (with Send icon)
- **Styling**: 
  - Card with border
  - Input focus effects

#### Contact Information Card
- **Title**: "Contact Information"
- **Items**:
  1. **Office Address** (MapPin icon):
     - "H657 Parmar Nagar, Opp Vishal Mega Mart, Wanowrie, Pune – 411013"
  2. **Phone Number** (Phone icon):
     - "7517383196" (clickable tel link)
  3. **Email Address** (Mail icon):
     - "ayessha03@ellure-consulttingservices.com" (clickable mailto link)
- **Styling**: 
  - Icons with colored backgrounds
  - Hover effects on links

#### Connect With Us Card
- **Title**: "Connect With Us"
- **Description**: "Follow us on social media for the latest updates and opportunities."
- **Social Links**:
  - LinkedIn
  - Facebook
  - Instagram
  - WhatsApp
- **Styling**: 
  - Circular icon buttons
  - Hover scale and color changes
  - WhatsApp has green theme

#### Business Hours Card
- **Background Image**: `contact-business-hours-banner.jpg`
- **Overlay**: `from-black/50 via-black/30 to-black/50`
- **Title**: "Business Hours" (with Clock icon)
- **Hours**:
  - Monday - Friday: 9:00 AM - 6:00 PM
  - Saturday: 9:00 AM - 2:00 PM
  - Sunday: Closed
- **Styling**: 
  - White text on dark overlay
  - Border: `border-2 border-border`

### Color Scheme
- **Primary Color**: Blue
- **Secondary Color**: Used for phone icon
- **Success Color**: Green (for email and WhatsApp)
- **Gold Text**: Used for emphasis

### Animations
- **Scroll Animations**: Framer Motion
- **Form Focus**: Shadow effects
- **Social Icons**: Scale and color transitions

---

## FAQ Page

### Overview
The FAQ page provides answers to frequently asked questions about Ellure NexHire.

### Hero Section
- **Height**: `py-16 md:py-20`
- **Background**: `bg-gradient-primary` (no banner image)
- **Content**:
  - Title: "Frequently Asked Questions"
  - Subtitle: "Find answers to common questions about Ellure NexHire"
- **Text Alignment**: Left

### FAQ Section
- **Layout**: Single column, max-width 3xl
- **FAQs** (6 total, expandable):
  1. **What is Ellure Nexhire?**
     - Answer: "Ellure Nexhire is a hiring platform that connects employers and candidates through structured, transparent hiring workflows."

  2. **How is Ellure Nexhire different from Ellure Consulting Services?**
     - Answer: "Ellure Consulting Services is a recruitment company. Ellure Nexhire is a technology platform developed to support scalable and ethical hiring."

  3. **Is Ellure Nexhire a recruitment consultancy?**
     - Answer: "No. Ellure Nexhire is a platform, not a consultancy."

  4. **Do you provide recruitment or executive search services?**
     - Answer: "No. Recruitment services are provided separately under Ellure Consulting Services."

  5. **Can users track hiring progress?**
     - Answer: "Yes. Both employers and candidates can track application progress clearly within the portal."

  6. **Is data secure on Ellure Nexhire?**
     - Answer: "Yes. The platform follows enterprise-grade security and controlled access practices."

- **Styling**: 
  - Expandable cards
  - Chevron icons (up/down)
  - Hover background change
  - Smooth expand/collapse animation

### Color Scheme
- **Primary Color**: Blue
- **Background**: `bg-gradient-subtle`

### Animations
- **Scroll Animations**: Framer Motion
- **FAQ Expansion**: Smooth height and opacity transitions
- **Chevron Rotation**: Based on expanded state

---

## Common Elements Across All Pages

### Navigation Bar
- **Logo**: Ellure NexHire logo image
- **Links**: Home, Services, Industries, Features, About, Contact Us
- **Button**: "Login / Register"
- **Styling**: Sticky header with backdrop blur

### Footer
- **Sections**:
  - Company Info (logo, description, social links)
  - Quick Links (all main pages + FAQ)
  - Our Services (service list)
  - Contact Info (address, phone, email, WhatsApp)
- **Bottom Bar**: Copyright, FAQ, Privacy Policy, Terms of Service

### Color Classes
- **`.gold-text`**: Custom gold color for emphasis
- **`.bg-gradient-subtle`**: Subtle background gradient
- **`.bg-gradient-primary`**: Primary gradient background
- **`.card-hover`**: Hover effects for cards
- **`.btn-hover`**: Hover effects for buttons

### Common Styling Patterns
- **Cards**: `border-2 border-border shadow-md hover:shadow-xl hover:border-primary/60`
- **Sections**: `py-10 md:py-12` padding
- **Animations**: Framer Motion with `whileInView`
- **Transitions**: `transition-all duration-300`

### Banner Images Used
- `banner-1.jpg`, `banner-2.jpg`, `banner-3.jpg` (Homepage hero)
- `services-banner.jpg` (Services hero)
- `services-cta-banner.jpg` (Services CTA)
- `features-banner.jpg` (Features hero)
- `features-cta-banner.jpg` (Features CTA)
- `industries-banner.jpg` (Industries hero)
- `industries-cta-banner.jpg` (Industries CTA)
- `about-banner.jpg` (About hero)
- `about-cta-banner.jpg` (About CTA)
- `contact-banner.jpg` (Contact hero)
- `contact-business-hours-banner.jpg` (Contact business hours)
- `cta-banner.jpg` (Homepage final CTA)

---

## Notes

- All pages use consistent spacing and padding
- Gold text is used strategically for emphasis on key phrases
- All interactive elements have hover effects
- Cards have depth with shadows and borders
- Animations are smooth and non-intrusive
- Responsive design works on mobile, tablet, and desktop
- All external links open in new tabs with proper security attributes

---

*Last Updated: [Current Date]*

