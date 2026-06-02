import { Button } from "@/components/ui/button";

import { MarketingNavMegaDropdown } from "@/components/layout/MarketingNavMegaDropdown";
import { industriesMegaMenu, servicesMegaMenu } from "@/lib/marketingNavMegaConfig";

import { useNavbarScroll } from "@/hooks/useNavbarScroll";

import { useNavbarScrollHide } from "@/hooks/useNavbarScrollHide";
import { useIsLgUp } from "@/hooks/useIsLgUp";

import { INDUSTRY_NAV_ITEMS, NAVBAR_PRIMARY_LINKS, SERVICE_NAV_ITEMS } from "@/lib/marketingNavData";

import { cn } from "@/lib/utils";

import { AnimatePresence, motion } from "framer-motion";

import { ChevronDown, Menu, X } from "lucide-react";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

import { Link, useLocation } from "react-router-dom";



type NavbarProps = {
  /** Always-light sticky bar (BharatGo-style homepage) */
  variant?: "default" | "saas";
  /** White logo + links over dark hero until user scrolls */
  heroOverlay?: boolean;
};

const Navbar = ({ variant = "default", heroOverlay = false }: NavbarProps) => {
  const location = useLocation();
  const scrolled = useNavbarScroll(32);
  const isLgUp = useIsLgUp();
  const navHidden = useNavbarScrollHide(72, isLgUp || variant === "saas");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileServicesOpen, setMobileServicesOpen] = useState(false);
  const [mobileIndustriesOpen, setMobileIndustriesOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isSaas = variant === "saas";
  const forceSolidNav = isSaas && location.pathname === "/contact";
  const isSolidNav = scrolled || mobileMenuOpen || forceSolidNav;
  const useLightText = heroOverlay ? !isSolidNav : !isSaas && !isSolidNav;
  const useHeroNavChrome = heroOverlay && !isSolidNav;

  const servicesActive = location.pathname.startsWith("/services");
  const industriesActive = location.pathname.startsWith("/industries");



  useEffect(() => {

    if (!mobileMenuOpen) return;

    const prev = document.body.style.overflow;

    document.body.style.overflow = "hidden";

    return () => {

      document.body.style.overflow = prev;

    };

  }, [mobileMenuOpen]);



  useEffect(() => {

    setMobileMenuOpen(false);

    setMobileServicesOpen(false);

    setMobileIndustriesOpen(false);

  }, [location.pathname]);



  const linkClass = (href: string, extra?: string) => {
    const isActive = location.pathname === href;
    return cn(
      "relative rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200",
      isActive
        ? useLightText
          ? "bg-white/15 text-white"
          : "bg-primary/10 text-primary font-semibold"
        : useLightText
          ? "text-white hover:bg-white/12 hover:text-white"
          : isSaas && !isSolidNav
            ? "text-slate-800 hover:bg-white/70 hover:text-primary"
            : "text-foreground/80 hover:bg-muted/80 hover:text-primary",
      extra
    );
  };



  const mobileLinkClass = (href: string) =>

    cn(

      "flex min-h-[48px] items-center rounded-xl border border-border/60 bg-card px-4 py-3 text-base font-medium transition-colors active:scale-[0.98]",

      location.pathname === href

        ? "border-primary/30 bg-primary/5 text-primary"

        : "text-foreground hover:bg-muted/60"

    );



  const megaTriggerClass = cn(
    "h-9 bg-transparent px-3 text-sm font-medium shadow-none",
    useLightText
      ? "text-white hover:bg-white/12 hover:text-white"
      : isSaas && !isSolidNav
        ? "text-slate-800 hover:bg-white/70 hover:text-primary data-[state=open]:bg-white/80 data-[state=open]:text-primary"
        : "text-foreground/80 hover:bg-muted/80 hover:text-primary data-[state=open]:bg-primary/10 data-[state=open]:text-primary"
  );

  const megaTriggerActiveClass = useLightText ? "bg-white/15 text-white" : "bg-primary/10 text-primary font-semibold";

  const closeMobile = () => {

    setMobileMenuOpen(false);

    setMobileServicesOpen(false);

    setMobileIndustriesOpen(false);

  };



  const headerBar = (
      <motion.header
        className={cn(
          "fixed inset-x-0 top-0 z-[200] w-full transition-all duration-300 ease-out pt-[env(safe-area-inset-top,0px)]",
          isSolidNav
            ? "border-b border-border/80 bg-white/95 shadow-sm backdrop-blur-xl supports-[backdrop-filter]:bg-white/90"
            : useHeroNavChrome
              ? "border-b border-white/10 bg-[#060612]/50 shadow-[0_4px_24px_rgba(0,0,0,0.2)] backdrop-blur-md"
              : "border-b border-transparent bg-transparent"
        )}
        initial={false}
        animate={{ y: mobileMenuOpen || !navHidden ? 0 : -100 }}
        transition={{ duration: 0.28, ease: [0.4, 0, 0.2, 1] }}
      >
        <div className="container flex h-14 items-center justify-between gap-4 px-4 sm:h-[4.25rem] sm:px-6">
          <Link
            to="/"
            className="group flex min-w-0 shrink-0 items-center gap-2 sm:gap-2.5"
          >
            <img
              src="/ellure-logo.png"
              alt="Ellure NexHire"
              className="h-10 w-10 shrink-0 object-contain transition-transform duration-300 group-hover:scale-105 sm:h-12 sm:w-12"
            />
            <span
              className={cn(
                "font-poppins whitespace-nowrap text-lg font-bold leading-none tracking-tight transition-colors sm:text-xl",
                useLightText ? "text-white drop-shadow-sm" : "text-foreground"
              )}
            >
              <span className={useLightText ? "text-white" : "text-[#3d4853]"}>Ellure </span>
              <span className={useLightText ? "text-white" : "text-primary"}>NexHire</span>
            </span>
          </Link>

          {/* Desktop */}
          <div className="hidden items-center gap-0.5 lg:flex">
            <Link to="/" className={linkClass("/")}>
              Home
            </Link>
            <MarketingNavMegaDropdown
              label="Services"
              config={servicesMegaMenu}
              triggerClassName={cn(megaTriggerClass, servicesActive && megaTriggerActiveClass)}
            />
            <MarketingNavMegaDropdown
              label="Industries"
              config={industriesMegaMenu}
              triggerClassName={cn(megaTriggerClass, industriesActive && megaTriggerActiveClass)}
            />
            {NAVBAR_PRIMARY_LINKS.map((item) => (
              <Link key={item.href} to={item.href} className={linkClass(item.href)}>
                {item.label}
              </Link>
            ))}

            <div className="ml-2 flex items-center gap-2 pl-1">
              <Button
                asChild
                size="sm"
                variant="outline"
                className={cn(
                  "h-9 rounded-full px-4 font-medium transition-all",
                  useLightText
                    ? "border-white/35 bg-white/5 text-white hover:bg-white/15 hover:text-white"
                    : "border-border hover:bg-muted"
                )}
              >
                <Link to="/auth/login">Login</Link>
              </Button>
              <Button
                asChild
                size="sm"
                className="h-9 rounded-full px-5 font-semibold shadow-md btn-glow-primary transition-all hover:shadow-lg"
              >
                <Link to={isSaas ? "/auth/register" : "/contact"}>
                  {isSaas ? "Start for FREE" : "Hire Talent"}
                </Link>
              </Button>
            </div>
          </div>

          {/* Tablet / phone */}
          <div className="flex items-center gap-2 lg:hidden">
            <Button
              asChild
              size="sm"
              className={cn(
                "hidden h-9 rounded-full px-4 text-xs font-semibold sm:inline-flex",
                useLightText && "shadow-lg"
              )}
            >
              <Link to={isSaas ? "/auth/register" : "/contact"}>
                {isSaas ? "Start for FREE" : "Hire Talent"}
              </Link>
            </Button>
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className={cn(
                "touch-target flex h-11 w-11 items-center justify-center rounded-full transition-colors active:scale-95",
                useLightText ? "hover:bg-white/10" : "hover:bg-muted"
              )}
              aria-label="Toggle menu"
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? (
                <X className={cn("h-6 w-6", useLightText ? "text-white" : "text-foreground")} />
              ) : (
                <Menu className={cn("h-6 w-6", useLightText ? "text-white" : "text-foreground")} />
              )}
            </button>
          </div>
        </div>
      </motion.header>
  );

  return (

    <>

      {mounted
        ? createPortal(headerBar, document.body)
        : (
          <div
            className="pointer-events-none fixed inset-x-0 top-0 z-[200] h-14 sm:h-[4.25rem]"
            aria-hidden
          />
        )}

      {/* Spacer reserves space for fixed navbar */}
      <div className="h-14 shrink-0 sm:h-[4.25rem]" aria-hidden />



      {/* Mobile full-screen menu */}

      <AnimatePresence>

        {mobileMenuOpen && (

          <motion.div

            initial={{ opacity: 0 }}

            animate={{ opacity: 1 }}

            exit={{ opacity: 0 }}

            transition={{ duration: 0.2 }}

            className="fixed inset-0 top-14 z-[210] flex flex-col bg-background/98 backdrop-blur-md sm:top-[4.25rem] lg:hidden"

            style={{ paddingBottom: "env(safe-area-inset-bottom, 0px)" }}

          >

            <nav className="container flex flex-1 flex-col gap-2 overflow-y-auto px-4 py-4">

              <motion.div

                initial={{ opacity: 0, y: 8 }}

                animate={{ opacity: 1, y: 0 }}

                transition={{ delay: 0.03 }}

              >

                <Link to="/" onClick={closeMobile} className={mobileLinkClass("/")}>

                  Home

                </Link>

              </motion.div>



              <MobileMegaSection

                label="Services"

                open={mobileServicesOpen}

                onToggle={() => setMobileServicesOpen((v) => !v)}

                items={SERVICE_NAV_ITEMS}

                viewAllHref="/services"

                onNavigate={closeMobile}

              />



              <MobileMegaSection

                label="Industries"

                open={mobileIndustriesOpen}

                onToggle={() => setMobileIndustriesOpen((v) => !v)}

                items={INDUSTRY_NAV_ITEMS}

                viewAllHref="/industries"

                onNavigate={closeMobile}

              />



              {NAVBAR_PRIMARY_LINKS.map((item, index) => (

                <motion.div

                  key={item.href}

                  initial={{ opacity: 0, y: 8 }}

                  animate={{ opacity: 1, y: 0 }}

                  transition={{ delay: 0.05 + index * 0.03 }}

                >

                  <Link to={item.href} onClick={closeMobile} className={mobileLinkClass(item.href)}>

                    {item.label}

                  </Link>

                </motion.div>

              ))}



              <div className="mt-auto flex flex-col gap-2 border-t border-border pt-4">
                <Button asChild className="h-12 w-full rounded-full text-base" size="lg">
                  <Link to={isSaas ? "/auth/register" : "/contact"} onClick={closeMobile}>
                    {isSaas ? "Start for FREE" : "Hire Talent"}
                  </Link>
                </Button>
                <Button asChild variant="outline" className="h-12 w-full rounded-full text-base" size="lg">
                  <Link to="/showcase" onClick={closeMobile}>
                    Platform showcase
                  </Link>
                </Button>
                <Button asChild variant="outline" className="h-12 w-full rounded-full text-base" size="lg">
                  <Link to="/contact" onClick={closeMobile}>
                    Contact sales
                  </Link>
                </Button>
                <Button asChild variant="ghost" className="h-12 w-full rounded-full text-base" size="lg">
                  <Link to="/auth/login" onClick={closeMobile}>
                    Login / Register
                  </Link>
                </Button>
              </div>

            </nav>

          </motion.div>

        )}

      </AnimatePresence>

    </>

  );

};



type MobileMegaSectionProps = {

  label: string;

  open: boolean;

  onToggle: () => void;

  items: typeof SERVICE_NAV_ITEMS;

  viewAllHref: string;

  onNavigate: () => void;

};



function MobileMegaSection({

  label,

  open,

  onToggle,

  items,

  viewAllHref,

  onNavigate,

}: MobileMegaSectionProps) {

  return (

    <div className="rounded-xl border border-border/60 bg-card">

      <button

        type="button"

        onClick={onToggle}

        className="flex min-h-[48px] w-full items-center justify-between px-4 py-3 text-base font-semibold text-foreground active:scale-[0.98]"

      >

        {label}

        <ChevronDown className={cn("h-5 w-5 transition-transform", open && "rotate-180")} />

      </button>

      <AnimatePresence>

        {open && (

          <motion.div

            initial={{ height: 0, opacity: 0 }}

            animate={{ height: "auto", opacity: 1 }}

            exit={{ height: 0, opacity: 0 }}

            className="overflow-hidden"

          >

            <ul className="space-y-1 border-t border-border/60 px-2 pb-2 pt-1">

              {items.map((item) => {

                const Icon = item.icon;

                return (

                  <li key={item.title}>

                    <Link

                      to={item.href}

                      onClick={onNavigate}

                      className="flex min-h-[48px] gap-3 rounded-lg px-2 py-2.5 active:scale-[0.98] hover:bg-muted/80"

                    >

                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary">

                        <Icon className="h-4 w-4" />

                      </div>

                      <div className="min-w-0 text-left">

                        <p className="text-sm font-medium text-foreground">{item.title}</p>

                        <p className="line-clamp-1 text-xs text-muted-foreground">{item.description}</p>

                      </div>

                    </Link>

                  </li>

                );

              })}

              <li>

                <Link

                  to={viewAllHref}

                  onClick={onNavigate}

                  className="flex min-h-[44px] items-center px-2 py-2 text-sm font-medium text-primary"

                >

                  View all →

                </Link>

              </li>

            </ul>

          </motion.div>

        )}

      </AnimatePresence>

    </div>

  );

}



export default Navbar;

