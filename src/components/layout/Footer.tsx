import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import {
  Facebook,
  Linkedin,
  Instagram,
  Mail,
  Phone,
  MapPin,
  MessageCircle,
  Shield,
  FileText,
} from "lucide-react";

const quickLinks = [
  { to: "/", label: "Home" },
  { to: "/about", label: "About Us" },
  { to: "/services", label: "Services" },
  { to: "/industries", label: "Industries" },
  { to: "/features", label: "Features" },
  { to: "/showcase", label: "Showcase" },
  { to: "/contact", label: "Contact" },
  { to: "/faq", label: "FAQ" },
];

const employerLinks = [
  { to: "/contact", label: "Contact sales" },
  { to: "/services", label: "Hiring services" },
  { to: "/industries", label: "Industry expertise" },
  { to: "/features", label: "Platform features" },
  { to: "/client/auth/login", label: "Client login" },
];

const applicantLinks = [
  { to: "/auth/register", label: "Create profile" },
  { to: "/auth/login", label: "Applicant login" },
  { to: "/auth/applicant-register/step-1", label: "Complete registration" },
  { to: "/faq", label: "Candidate FAQ" },
];

type FooterProps = {
  variant?: "dark" | "light";
};

const Footer = ({ variant = "dark" }: FooterProps) => {
  const { pathname } = useLocation();
  const hideOnMobile = variant === "dark" && pathname !== "/";
  const isLight = variant === "light";

  return (
  <footer
    className={cn(
      "relative z-[1] border-t",
      isLight
        ? "border-border bg-muted/30 text-foreground"
        : "marketing-footer-dark border-white/5",
      hideOnMobile && "hidden md:block"
    )}
  >
    <div className="container px-4 py-12 sm:px-6 md:py-16">
      <div className="grid grid-cols-2 gap-10 sm:grid-cols-2 lg:grid-cols-12 lg:gap-8 xl:gap-10">
        {/* Brand */}
        <div className="col-span-2 space-y-5 lg:col-span-3">
          <Link to="/" className="group flex w-fit items-center gap-2">
            <img
              src="/ellure-logo.png"
              alt="Ellure NexHire"
              className="h-11 w-auto object-contain transition-transform duration-300 group-hover:scale-105 sm:h-12"
            />
            <div className="flex flex-col leading-none">
              <span className={cn("text-lg font-bold", isLight ? "text-foreground" : "text-white")}>
                Ellure
              </span>
              <span
                className={cn(
                  "-mt-0.5 text-lg font-bold",
                  isLight ? "text-primary" : "text-[#5eb8e8]"
                )}
              >
                NexHire
              </span>
            </div>
          </Link>
          <p
            className={cn(
              "max-w-xs text-sm leading-relaxed",
              isLight ? "text-muted-foreground" : "marketing-footer-muted"
            )}
          >
            Connecting exceptional talent with leading organizations through precision-driven,
            ethical recruitment — across IT, BFSI, pharma, telecom, and more.
          </p>
          <div className="flex flex-wrap gap-2">
            {[
              {
                href: "https://www.linkedin.com/company/ellure-consulting-services",
                icon: Linkedin,
                label: "LinkedIn",
                className: "hover:bg-[#0a66c2] hover:text-white",
              },
              {
                href: "https://www.facebook.com/ellureconsulting",
                icon: Facebook,
                label: "Facebook",
                className: "hover:bg-[#1877f2] hover:text-white",
              },
              {
                href: "https://www.instagram.com/ellureconsulting",
                icon: Instagram,
                label: "Instagram",
                className: "hover:bg-gradient-to-br hover:from-purple-600 hover:to-orange-500 hover:text-white",
              },
              {
                href: "https://wa.me/917517383196",
                icon: MessageCircle,
                label: "WhatsApp",
                className: "hover:bg-[#25d366] hover:text-white",
              },
            ].map(({ href, icon: Icon, label, className }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className={`touch-target flex h-11 w-11 items-center justify-center rounded-full transition-all duration-300 hover:scale-105 ${
                  isLight
                    ? "bg-muted text-foreground ring-1 ring-border"
                    : `bg-white/10 text-white/80 ring-1 ring-white/10 ${className}`
                }`}
                aria-label={label}
              >
                <Icon className="h-5 w-5" />
              </a>
            ))}
          </div>
        </div>

        {/* Quick links */}
        <div className="col-span-1 space-y-4 lg:col-span-2">
          <h4
            className={cn(
              "text-sm font-semibold uppercase tracking-wider",
              isLight ? "text-foreground" : "text-white"
            )}
          >
            Quick links
          </h4>
          <ul className="space-y-2.5">
            {quickLinks.map((link) => (
              <li key={link.to}>
                <Link
                  to={link.to}
                  className={cn(
                    "group inline-flex text-sm transition-colors",
                    isLight ? "text-muted-foreground hover:text-primary" : "marketing-footer-muted"
                  )}
                >
                  <span className="transition-transform duration-300 group-hover:translate-x-0.5">
                    {link.label}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Employers */}
        <div className="col-span-1 space-y-4 lg:col-span-2">
          <h4
            className={cn(
              "text-sm font-semibold uppercase tracking-wider",
              isLight ? "text-foreground" : "text-white"
            )}
          >
            For employers
          </h4>
          <ul className="space-y-2.5">
            {employerLinks.map((link) => (
              <li key={link.to}>
                <Link
                  to={link.to}
                  className={cn(
                    "text-sm transition-colors",
                    isLight ? "text-muted-foreground hover:text-primary" : "marketing-footer-muted"
                  )}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Applicants */}
        <div className="col-span-1 space-y-4 lg:col-span-2">
          <h4
            className={cn(
              "text-sm font-semibold uppercase tracking-wider",
              isLight ? "text-foreground" : "text-white"
            )}
          >
            For applicants
          </h4>
          <ul className="space-y-2.5">
            {applicantLinks.map((link) => (
              <li key={link.to}>
                <Link to={link.to} className="marketing-footer-muted text-sm transition-colors">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
          <ul className="space-y-2 border-t border-white/10 pt-4">
            <li>
              <Link
                to="/privacy"
                className="marketing-footer-muted inline-flex items-center gap-2 text-sm transition-colors"
              >
                <Shield className="h-3.5 w-3.5 shrink-0" />
                Privacy Policy
              </Link>
            </li>
            <li>
              <Link
                to="/terms"
                className="marketing-footer-muted inline-flex items-center gap-2 text-sm transition-colors"
              >
                <FileText className="h-3.5 w-3.5 shrink-0" />
                Terms of Service
              </Link>
            </li>
          </ul>
        </div>

        {/* Contact */}
        <div className="col-span-2 space-y-4 lg:col-span-3">
          <h4 className="text-sm font-semibold uppercase tracking-wider text-white">Contact</h4>
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-secondary" />
              <p className="marketing-footer-muted text-sm leading-relaxed">
                H657 Parmar Nagar,
                <br />
                Pune, Maharashtra, India
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Phone className="h-5 w-5 shrink-0 text-secondary" />
              <a href="tel:+917517383196" className="marketing-footer-muted text-sm transition-colors">
                +91 7517383196
              </a>
            </div>
            <div className="flex items-center gap-3">
              <Mail className="h-5 w-5 shrink-0 text-secondary" />
              <a
                href="mailto:info@ellureconsulting.com"
                className="marketing-footer-muted break-all text-sm transition-colors"
              >
                info@ellureconsulting.com
              </a>
            </div>
            <ButtonLink to="/contact" label="Get in touch" />
          </div>
        </div>
      </div>

      <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-8 md:flex-row">
        <p className="marketing-footer-muted text-center text-xs sm:text-sm md:text-left">
          © {new Date().getFullYear()} Ellure NexHire. All rights reserved.
        </p>
        <div className="flex flex-wrap justify-center gap-5 text-xs text-white/60 sm:text-sm">
          <Link to="/privacy" className="transition-colors hover:text-secondary">
            Privacy
          </Link>
          <Link to="/terms" className="transition-colors hover:text-secondary">
            Terms
          </Link>
          <Link to="/contact" className="transition-colors hover:text-secondary">
            Contact
          </Link>
          <a
            href="https://www.linkedin.com/company/ellure-consulting-services"
            target="_blank"
            rel="noopener noreferrer"
            className="transition-colors hover:text-secondary"
          >
            LinkedIn
          </a>
        </div>
      </div>
    </div>
  </footer>
  );
};

function ButtonLink({ to, label }: { to: string; label: string }) {
  return (
    <Link
      to={to}
      className="inline-flex h-10 items-center justify-center rounded-lg bg-secondary px-5 text-sm font-medium text-secondary-foreground shadow-md transition-colors hover:bg-secondary/90"
    >
      {label}
    </Link>
  );
}

export default Footer;
