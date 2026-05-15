import { Link, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Home, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import MarketingLayout from "@/components/marketing/MarketingLayout";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <MarketingLayout showGeometry={false}>
      <Navbar />
      <div className="container flex min-h-[60vh] flex-col items-center justify-center px-4 py-16 text-center">
        <p className="text-sm font-medium text-primary uppercase tracking-wider mb-2">404</p>
        <h1 className="font-poppins text-3xl md:text-4xl font-semibold tracking-tight mb-3">Page not found</h1>
        <p className="text-muted-foreground max-w-md mb-8">
          The page <span className="font-mono text-foreground">{location.pathname}</span> does not exist or may have
          moved.
        </p>
        <div className="flex flex-col sm:flex-row gap-3">
          <Button asChild variant="default" className="btn-glow">
            <Link to="/">
              <Home className="mr-2 h-4 w-4" />
              Back to home
            </Link>
          </Button>
          <Button type="button" variant="outline" onClick={() => window.history.back()}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Go back
          </Button>
        </div>
      </div>
      <Footer />
    </MarketingLayout>
  );
};

export default NotFound;
