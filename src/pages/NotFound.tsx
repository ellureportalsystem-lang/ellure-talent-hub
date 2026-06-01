import { Link, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Home, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { MarketingSaasShell } from "@/components/marketing/MarketingSaasShell";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <MarketingSaasShell showFinalCta={false} showMobileCta={false}>
      <div className="container flex min-h-[60vh] flex-col items-center justify-center px-4 py-16 text-center">
        <p className="mb-2 text-sm font-semibold uppercase tracking-widest text-primary">404</p>
        <h1 className="font-poppins text-3xl font-bold tracking-tight sm:text-4xl">Page not found</h1>
        <p className="mt-3 max-w-md text-muted-foreground">
          The page <span className="font-mono text-foreground">{location.pathname}</span> does not exist or may have
          moved.
        </p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Button asChild className="rounded-full">
            <Link to="/">
              <Home className="mr-2 h-4 w-4" />
              Back to home
            </Link>
          </Button>
          <Button type="button" variant="outline" className="rounded-full" onClick={() => window.history.back()}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Go back
          </Button>
        </div>
      </div>
    </MarketingSaasShell>
  );
};

export default NotFound;
