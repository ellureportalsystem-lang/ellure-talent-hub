import { Button } from "@/components/ui/button";
import { Link, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const navItems = [
  { href: "/", label: "Home" },
  { href: "/services", label: "Services" },
  { href: "/industries", label: "Industries" },
  { href: "/features", label: "Features" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact Us" },
];

const Navbar = () => {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center gap-2 group">
          <img 
            src="/logo1.png" 
            alt="Ellure Consulting Services" 
            className="h-10 w-10 object-contain transition-transform duration-300 group-hover:scale-105" 
          />
          <span className="text-xl font-bold transition-colors duration-300 group-hover:text-primary">
            Ellure Consulting Services
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-1">
          {navItems.map((item) => {
            const isActive = location.pathname === item.href;
            return (
              <Link
                key={item.href}
                to={item.href}
                className="relative px-4 py-2 text-sm font-medium transition-all duration-300 group"
              >
                <span className={`relative z-10 transition-colors duration-300 ${
                  isActive 
                    ? "text-primary" 
                    : "text-muted-foreground group-hover:text-primary"
                }`}>
                  {item.label}
                </span>
                {/* Hover underline animation */}
                <span className={`absolute bottom-0 left-1/2 h-0.5 bg-primary transition-all duration-300 ease-out ${
                  isActive 
                    ? "w-3/4 -translate-x-1/2" 
                    : "w-0 -translate-x-1/2 group-hover:w-3/4"
                }`} />
                {/* Hover background */}
                <span className="absolute inset-0 rounded-md bg-primary/5 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
              </Link>
            );
          })}
          <Button asChild className="ml-4 transition-all duration-300 hover:scale-105 hover:shadow-lg">
            <Link to="/auth/login">Login / Register</Link>
          </Button>
        </nav>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-2 rounded-md hover:bg-muted transition-colors"
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile Navigation */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
            className="md:hidden border-t bg-background overflow-hidden"
          >
            <nav className="container py-4 flex flex-col gap-2">
              {navItems.map((item) => {
                const isActive = location.pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    to={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`px-4 py-3 rounded-md text-sm font-medium transition-all duration-300 ${
                      isActive
                        ? "bg-primary/10 text-primary"
                        : "text-muted-foreground hover:bg-muted hover:text-foreground"
                    }`}
                  >
                    {item.label}
                  </Link>
                );
              })}
              <Button asChild className="mt-2">
                <Link to="/auth/login" onClick={() => setMobileMenuOpen(false)}>
                  Login / Register
                </Link>
              </Button>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Navbar;
