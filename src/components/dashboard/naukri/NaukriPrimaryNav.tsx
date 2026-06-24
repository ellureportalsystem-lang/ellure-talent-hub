import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import {
  isNavActive,
  naukriNavLinkActiveClass,
  naukriNavLinkClass,
  type NaukriNavMenuLink,
} from "./naukriShellStyles";
import type { NaukriNavItem } from "./NaukriTopNavShell";

type NaukriPrimaryNavProps = {
  primaryNav: readonly NaukriNavItem[];
  navMenus?: Record<string, NaukriNavMenuLink[]>;
  mobile?: boolean;
};

export function NaukriPrimaryNav({ primaryNav, navMenus = {}, mobile = false }: NaukriPrimaryNavProps) {
  const location = useLocation();
  const [openMenu, setOpenMenu] = useState<string | null>(null);

  if (mobile) {
    return (
      <nav className="flex flex-col gap-0.5 p-4">
        {primaryNav.map((item) => {
          const active = isNavActive(location.pathname, item);
          const menu = navMenus[item.label];
          return (
            <div key={item.path}>
              <Link
                to={item.path}
                className={cn(
                  "block rounded-md px-3 py-2.5 text-sm font-medium",
                  active ? "bg-[#f0f7ff] text-[#0566CD]" : "text-[#333] hover:bg-slate-50"
                )}
              >
                {item.label}
              </Link>
              {menu?.map((link) => (
                <Link
                  key={`${item.label}-${link.to}-${link.label}`}
                  to={link.to}
                  className="block py-2 pl-8 pr-3 text-sm text-[#666] hover:text-[#0566CD]"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          );
        })}
      </nav>
    );
  }

  return (
    <nav className="flex h-14 flex-nowrap items-stretch">
      {primaryNav.map((item) => {
        const active = isNavActive(location.pathname, item);
        const menu = navMenus[item.label];

        if (!menu?.length) {
          return (
            <Link
              key={item.path}
              to={item.path}
              className={cn(naukriNavLinkClass, active && naukriNavLinkActiveClass)}
            >
              {item.label}
            </Link>
          );
        }

        return (
          <div
            key={item.path}
            className="relative flex shrink-0 items-stretch"
            onMouseEnter={() => setOpenMenu(item.label)}
            onMouseLeave={() => setOpenMenu(null)}
          >
            <Link
              to={item.path}
              className={cn(naukriNavLinkClass, active && naukriNavLinkActiveClass)}
            >
              {item.label}
            </Link>

            {openMenu === item.label && (
              <div className="absolute left-0 top-full z-50 min-w-[220px]">
                <div className="rounded-b-md border border-[#e8e8e8] border-t-0 bg-white py-1.5 shadow-[0_4px_12px_rgba(0,0,0,0.1)]">
                  {menu.map((link) => (
                    <Link
                      key={`${item.label}-${link.to}-${link.label}`}
                      to={link.to}
                      className="block px-4 py-2 text-sm text-[#333] hover:bg-[#f4f5f7] hover:text-[#0566CD]"
                      onClick={() => setOpenMenu(null)}
                    >
                      {link.label}
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        );
      })}
    </nav>
  );
}
