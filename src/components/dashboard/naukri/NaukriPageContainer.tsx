import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

import { NAUKRI_CONTENT_WRAP } from "./naukriShellStyles";



type NaukriPageContainerProps = {

  children: ReactNode;

  className?: string;

  /** Full-bleed pages (Resdex results, jobs sidebar layout) skip max-width */

  fullBleed?: boolean;

  /** Tighter vertical padding for dense tool pages */

  dense?: boolean;

};



export function NaukriPageContainer({

  children,

  className,

  fullBleed = false,

  dense = false,

}: NaukriPageContainerProps) {

  if (fullBleed) {

    return <div className={cn("w-full", className)}>{children}</div>;

  }



  return (

    <div

      className={cn(

        NAUKRI_CONTENT_WRAP,

        dense ? "py-4" : "py-5 md:py-6",

        className

      )}

    >

      {children}

    </div>

  );

}


