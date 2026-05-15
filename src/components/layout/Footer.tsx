import { Link } from "react-router-dom";
import {
  Facebook,
  Linkedin,
  Instagram,
  Mail,
  Phone,
  MapPin,
  MessageCircle,
  HelpCircle,
  FileText,
  Shield,
} from "lucide-react";

const quickLinks = [
  { to: "/", label: "Home" },
  { to: "/about", label: "About Us" },
  { to: "/services", label: "Services" },
  { to: "/industries", label: "Industries" },
  { to: "/features", label: "Features" },
  { to: "/faq", label: "FAQ" },
];

const legalLinks = [
  { to: "/privacy", label: "Privacy Policy", icon: Shield },
  { to: "/terms", label: "Terms of Service", icon: FileText },
];

const Footer = () => (
  <footer className="border-t bg-muted/30 relative z-[1]">
    <div className="container py-10 md:py-14 px-4 sm:px-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-10 mb-10">
        <div className="lg:col-span-4 space-y-4">
          <Link to="/" className="flex items-center gap-1 group w-fit">
            <img
              src="/ellure-logo.png"
              alt="Ellure NexHire"
              className="h-11 sm:h-12 w-auto object-contain transition-transform duration-300 group-hover:scale-105"
            />
            <div className="flex flex-col leading-none items-start">
              <span className="text-lg font-bold" style={{ color: "#3d4853" }}>
                Ellure
              </span>
              <span className="text-lg font-bold -mt-2" style={{ color: "#0566cd" }}>
                NexHire
              </span>
            </div>
          </Link>
          <p className="text-sm text-muted-foreground max-w-sm leading-relaxed">
            Connecting exceptional talent with leading organizations through precision-driven recruitment solutions.
          </p>
          <div className="flex flex-wrap gap-2">
            <a
              href="https://www.linkedin.com/company/ellure-consulting-services"
              target="_blank"
              rel="noopener noreferrer"
              className="h-10 w-10 rounded-full bg-secondary/10 flex items-center justify-center transition-all duration-300 hover:bg-secondary hover:text-secondary-foreground hover:scale-110 hover:shadow-lg icon-brand-green"
              aria-label="LinkedIn"
            >
              <Linkedin className="h-5 w-5" />
            </a>
            <a
              href="https://www.facebook.com/ellureconsulting"
              target="_blank"
              rel="noopener noreferrer"
              className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center transition-all duration-300 hover:bg-primary hover:text-primary-foreground hover:scale-110"
              aria-label="Facebook"
            >
              <Facebook className="h-5 w-5 text-primary" />
            </a>
            <a
              href="https://www.instagram.com/ellureconsulting"
              target="_blank"
              rel="noopener noreferrer"
              className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center transition-all duration-300 hover:bg-primary hover:text-primary-foreground hover:scale-110"
              aria-label="Instagram"
            >
              <Instagram className="h-5 w-5 text-primary" />
            </a>
            <a
              href="https://wa.me/917517383196"
              target="_blank"
              rel="noopener noreferrer"
              className="h-10 w-10 rounded-full bg-secondary/10 flex items-center justify-center transition-all duration-300 hover:bg-secondary hover:text-secondary-foreground hover:scale-110 icon-brand-green"
              aria-label="WhatsApp"
            >
              <MessageCircle className="h-5 w-5" />
            </a>
          </div>
        </div>

        <div className="lg:col-span-2 space-y-4">
          <h4 className="font-semibold text-base md:text-lg">Quick Links</h4>
          <ul className="space-y-2">
            {quickLinks.map((link) => (
              <li key={link.to}>
                <Link
                  to={link.to}
                  className="text-sm text-muted-foreground hover:text-primary transition-colors duration-300 inline-flex items-center gap-1 group"
                >
                  <span className="transition-transform duration-300 group-hover:translate-x-1">
                    {link.label}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="lg:col-span-3 space-y-4">
          <h4 className="font-semibold text-base md:text-lg">Legal &amp; Help</h4>
          <ul className="space-y-2">
            {legalLinks.map((link) => (
              <li key={link.to}>
                <Link
                  to={link.to}
                  className="text-sm text-muted-foreground hover:text-primary transition-colors inline-flex items-center gap-2 group"
                >
                  <link.icon className="h-4 w-4 icon-brand-green shrink-0" />
                  {link.label}
                </Link>
              </li>
            ))}
            <li>
              <Link
                to="/contact"
                className="text-sm text-muted-foreground hover:text-primary transition-colors inline-flex items-center gap-2"
              >
                <Mail className="h-4 w-4 icon-brand-green shrink-0" />
                Contact Us
              </Link>
            </li>
            <li>
              <a
                href="mailto:info@ellureconsulting.com"
                className="text-sm text-muted-foreground hover:text-primary transition-colors inline-flex items-center gap-2 break-all"
              >
                <HelpCircle className="h-4 w-4 icon-brand-green shrink-0" />
                Help: info@ellureconsulting.com
              </a>
            </li>
          </ul>
        </div>

        <div className="lg:col-span-3 space-y-4">
          <h4 className="font-semibold text-base md:text-lg">Get in Touch</h4>
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <MapPin className="h-5 w-5 text-secondary mt-0.5 flex-shrink-0" />
              <p className="text-sm text-muted-foreground">
                H657 Parmar Nagar,
                <br />
                Pune, Maharashtra, India
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Phone className="h-5 w-5 text-secondary flex-shrink-0" />
              <a
                href="tel:+917517383196"
                className="text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                +91 7517383196
              </a>
            </div>
            <div className="flex items-center gap-3">
              <Mail className="h-5 w-5 text-secondary flex-shrink-0" />
              <a
                href="mailto:info@ellureconsulting.com"
                className="text-sm text-muted-foreground hover:text-primary transition-colors break-all"
              >
                info@ellureconsulting.com
              </a>
            </div>
          </div>
        </div>
      </div>

      <div className="pt-6 md:pt-8 border-t">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-center md:text-left">
          <p className="text-xs sm:text-sm text-muted-foreground">
            © {new Date().getFullYear()} Ellure NexHire. All rights reserved.
          </p>
          <div className="flex flex-wrap justify-center gap-4 sm:gap-6 text-xs sm:text-sm text-muted-foreground">
            <Link to="/privacy" className="hover:text-primary transition-colors">
              Privacy
            </Link>
            <Link to="/terms" className="hover:text-primary transition-colors">
              Terms
            </Link>
            <Link to="/contact" className="hover:text-primary transition-colors">
              Contact
            </Link>
            <a
              href="https://www.linkedin.com/company/ellure-consulting-services"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-primary transition-colors"
            >
              LinkedIn
            </a>
          </div>
        </div>
      </div>
    </div>
  </footer>
);

export default Footer;
