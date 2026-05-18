import { ReactNode } from "react";
import { RoleBasedRoute } from "@/components/RoleBasedRoute";

type Role = "applicant" | "admin" | "client";

interface DashboardRouteProps {
  allowedRoles: Role[];
  children: ReactNode;
}

export const DashboardRoute = ({ allowedRoles, children }: DashboardRouteProps) => (
  <RoleBasedRoute allowedRoles={allowedRoles}>{children}</RoleBasedRoute>
);
