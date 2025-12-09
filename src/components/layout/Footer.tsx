import { Link } from "react-router-dom";
import { Facebook, Linkedin, Instagram, Mail, Phone, MapPin, MessageCircle } from "lucide-react";

const Footer = () => {
  return (
    <footer className="border-t bg-muted/30">
      <div className="container py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {/* Company Info */}
          <div className="space-y-4">
            <Link to="/" className="flex items-center gap-2 group">
              <img 
                src="/logo1.png" 
                alt="Ellure NexHire" 
                className="h-8 w-8 object-contain transition-transform duration-300 group-hover:scale-110" 
              />
              <span className="text-lg font-bold transition-colors duration-300 group-hover:text-primary">
                Ellure NexHire
              </span>
            </Link>
            <p className="text-sm text-muted-foreground">
              Connecting exceptional talent with leading organizations through precision-driven recruitment solutions.
            </p>
            <div className="flex gap-3">
              <a 
                href="https://www.linkedin.com/company/ellure-consulting-services" 
                target="_blank" 
                rel="noopener noreferrer"
                className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center transition-all duration-300 hover:bg-primary hover:text-primary-foreground hover:scale-110 hover:shadow-lg"
                aria-label="LinkedIn"
              >
                <Linkedin className="h-5 w-5" />
              </a>
              <a 
                href="https://www.facebook.com/ellureconsulting" 
                target="_blank" 
                rel="noopener noreferrer"
                className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center transition-all duration-300 hover:bg-primary hover:text-primary-foreground hover:scale-110 hover:shadow-lg"
                aria-label="Facebook"
              >
                <Facebook className="h-5 w-5" />
              </a>
              <a 
                href="https://www.instagram.com/ellureconsulting" 
                target="_blank" 
                rel="noopener noreferrer"
                className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center transition-all duration-300 hover:bg-primary hover:text-primary-foreground hover:scale-110 hover:shadow-lg"
                aria-label="Instagram"
              >
                <Instagram className="h-5 w-5" />
              </a>
              <a 
                href="https://wa.me/917517383196" 
                target="_blank" 
                rel="noopener noreferrer"
                className="h-10 w-10 rounded-full bg-green-500/10 flex items-center justify-center transition-all duration-300 hover:bg-green-500 hover:text-white hover:scale-110 hover:shadow-lg"
                aria-label="WhatsApp"
              >
                <MessageCircle className="h-5 w-5 text-green-600 group-hover:text-white" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="font-semibold text-lg">Quick Links</h4>
            <ul className="space-y-2">
              {[
                { to: "/", label: "Home" },
                { to: "/about", label: "About Us" },
                { to: "/services", label: "Services" },
                { to: "/industries", label: "Industries" },
                { to: "/features", label: "Features" },
                { to: "/contact", label: "Contact Us" },
              ].map((link) => (
                <li key={link.to}>
                  <Link 
                    to={link.to} 
                    className="text-sm text-muted-foreground hover:text-primary transition-colors duration-300 inline-flex items-center gap-1 group"
                  >
                    <span className="transition-transform duration-300 group-hover:translate-x-1">{link.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div className="space-y-4">
            <h4 className="font-semibold text-lg">Our Services</h4>
            <ul className="space-y-2">
              {[
                "IT Recruitment",
                "Non-IT Recruitment",
                "Executive Search",
                "Bulk Hiring",
                "Talent Management",
              ].map((service) => (
                <li key={service}>
                  <Link 
                    to="/services" 
                    className="text-sm text-muted-foreground hover:text-primary transition-colors duration-300 inline-flex items-center gap-1 group"
                  >
                    <span className="transition-transform duration-300 group-hover:translate-x-1">{service}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h4 className="font-semibold text-lg">Contact Info</h4>
            <div className="space-y-3">
              <div className="flex items-start gap-3 group">
                <MapPin className="h-5 w-5 text-primary mt-0.5 flex-shrink-0 transition-transform duration-300 group-hover:scale-110" />
                <p className="text-sm text-muted-foreground">
                  H657 Parmar Nagar,<br />
                  Pune, Maharashtra, India
                </p>
              </div>
              <div className="flex items-center gap-3 group">
                <Phone className="h-5 w-5 text-primary flex-shrink-0 transition-transform duration-300 group-hover:scale-110" />
                <a href="tel:+917517383196" className="text-sm text-muted-foreground hover:text-primary transition-colors duration-300">
                  +91 7517383196
                </a>
              </div>
              <div className="flex items-center gap-3 group">
                <Mail className="h-5 w-5 text-primary flex-shrink-0 transition-transform duration-300 group-hover:scale-110" />
                <a href="mailto:info@ellureconsulting.com" className="text-sm text-muted-foreground hover:text-primary transition-colors duration-300">
                  info@ellureconsulting.com
                </a>
              </div>
              <div className="flex items-center gap-3 group">
                <MessageCircle className="h-5 w-5 text-green-600 flex-shrink-0 transition-transform duration-300 group-hover:scale-110" />
                <a 
                  href="https://wa.me/917517383196" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-sm text-muted-foreground hover:text-green-600 transition-colors duration-300"
                >
                  WhatsApp Us
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-muted-foreground text-center md:text-left">
              © {new Date().getFullYear()} Ellure NexHire. All rights reserved.
            </p>
            <div className="flex gap-6 text-sm text-muted-foreground">
              <Link to="/privacy" className="hover:text-primary transition-colors duration-300">
                Privacy Policy
              </Link>
              <Link to="/terms" className="hover:text-primary transition-colors duration-300">
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
