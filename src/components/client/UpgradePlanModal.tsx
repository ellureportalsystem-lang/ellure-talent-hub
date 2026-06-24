import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Lock } from "lucide-react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { fetchSubscriptionPlans } from "@/services/clientService";

type UpgradePlanModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  feature?: string;
};

export function UpgradePlanModal({ open, onOpenChange, feature }: UpgradePlanModalProps) {
  const { data: plans = [] } = useQuery({
    queryKey: ["subscription-plans-public"],
    queryFn: fetchSubscriptionPlans,
    enabled: open,
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Lock className="h-5 w-5 text-[#0566CD]" />
            Upgrade your plan
          </DialogTitle>
        </DialogHeader>
        {feature && (
          <p className="text-sm text-slate-600">
            <strong>{feature}</strong> is not included in your current plan. Compare plans below and upgrade to unlock it.
          </p>
        )}
        <div className="grid gap-3 sm:grid-cols-2 mt-2">
          {plans.map((plan) => {
            const features = (plan as { features?: Record<string, boolean> }).features ?? {};
            return (
              <div key={plan.id} className="rounded-lg border border-slate-200 p-4 space-y-2">
                <p className="font-bold text-slate-900">{plan.display_name || plan.name}</p>
                <p className="text-lg font-semibold text-[#0566CD]">
                  ₹{plan.price_monthly ?? 0}
                  <span className="text-xs font-normal text-slate-500">/mo</span>
                </p>
                <ul className="text-xs text-slate-600 space-y-1">
                  <li>{plan.cv_downloads_per_month} CV downloads/mo</li>
                  <li>{plan.max_active_jobs} job postings</li>
                  <li>{plan.max_saved_searches ?? 0} saved searches</li>
                  {plan.can_see_contact_details && <li>Contact details</li>}
                  {plan.can_export_excel && <li>Excel export</li>}
                  {features.can_send_nvite && <li>NVite mass mail</li>}
                  {features.can_boolean_search && <li>Boolean search</li>}
                </ul>
              </div>
            );
          })}
        </div>
        <div className="flex justify-end gap-2 pt-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>Close</Button>
          <Button asChild className="bg-[#0566CD] hover:bg-[#0066c0]">
            <Link to="/dashboard/client/billing">View billing</Link>
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

type LockedFeatureProps = {
  locked: boolean;
  featureLabel: string;
  onUpgrade: () => void;
  children: React.ReactNode;
  className?: string;
};

export function LockedFeatureWrap({ locked, featureLabel, onUpgrade, children, className }: LockedFeatureProps) {
  if (!locked) return <>{children}</>;
  return (
    <button
      type="button"
      className={className}
      title={`Upgrade your plan to access ${featureLabel}`}
      onClick={onUpgrade}
    >
      <span className="inline-flex items-center gap-1 opacity-60 pointer-events-none">{children}</span>
      <Lock className="inline h-3 w-3 ml-1 text-slate-400" />
    </button>
  );
}

export function tagColorClass(color: string) {
  const map: Record<string, string> = {
    blue: "bg-blue-100 text-blue-700 border-blue-200",
    green: "bg-emerald-100 text-emerald-700 border-emerald-200",
    orange: "bg-orange-100 text-orange-700 border-orange-200",
    purple: "bg-purple-100 text-purple-700 border-purple-200",
    red: "bg-red-100 text-red-700 border-red-200",
  };
  return map[color] ?? map.blue;
}
