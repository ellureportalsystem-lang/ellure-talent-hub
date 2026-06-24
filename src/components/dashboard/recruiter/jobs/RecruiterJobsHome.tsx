import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Eye } from "lucide-react";
import { useClientContext } from "@/hooks/useClientContext";
import { fetchJobsForClient } from "@/services/jobService";
import { fetchSavedSearches } from "@/services/clientService";
import {
  buildSavedSearchResultsUrl,
  formatSavedSearchMeta,
  getSavedSearchQuery,
  type SavedSearchRow,
} from "@/lib/savedSearchUtils";
import { RecruiterJobsSidebar } from "./RecruiterJobsSidebar";

type ClientJob = Awaited<ReturnType<typeof fetchJobsForClient>>[number];

export function RecruiterJobsHome() {
  const { data: ctx } = useClientContext();
  const clientId = ctx?.client?.id;
  const [jobs, setJobs] = useState<ClientJob[]>([]);
  const [savedSearches, setSavedSearches] = useState<SavedSearchRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!clientId) return;
    setLoading(true);
    Promise.all([fetchJobsForClient(clientId), fetchSavedSearches(clientId)])
      .then(([jobRows, searchRows]) => {
        setJobs(jobRows);
        setSavedSearches((searchRows as SavedSearchRow[]).slice(0, 10));
      })
      .finally(() => setLoading(false));
  }, [clientId]);

  return (
    <div className="flex min-h-[calc(100vh-52px)] bg-[#f4f5f7]">
      <RecruiterJobsSidebar />

      <div className="flex-1 min-w-0 p-4 md:p-6 space-y-6">
        <h1 className="text-xl font-bold text-slate-900">Welcome to Jobs &amp; Responses</h1>

        <div className="space-y-6">
          <Card className="border-slate-200 shadow-sm">
            <CardContent className="p-6">
              <h2 className="text-lg font-bold text-slate-900">Job Posting</h2>
              <p className="mt-1 text-sm text-slate-600">Post jobs and manage applications from your dashboard.</p>
              <Button asChild className="mt-4 bg-gradient-to-b from-slate-50 to-slate-100 border border-slate-300 text-slate-800 hover:from-white shadow-sm">
                <Link to="/dashboard/client/jobs/post">Post a Job Now</Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="border-slate-200 shadow-sm">
            <CardContent className="p-0">
              <div className="border-b border-slate-100 px-4 py-3">
                <h2 className="font-bold text-slate-900">Your active jobs</h2>
              </div>
              {loading ? (
                <Skeleton className="h-32 m-4" />
              ) : jobs.length === 0 ? (
                <p className="p-6 text-sm text-slate-500">No jobs posted yet. Post your first job to start receiving applications.</p>
              ) : (
                <div className="divide-y divide-slate-100">
                  {jobs.map((j) => (
                    <div key={j.id} className="flex items-center justify-between px-4 py-3 hover:bg-slate-50">
                      <div>
                        <p className="font-semibold text-slate-900">{j.title}</p>
                        <p className="text-xs text-slate-500">{j.applications_count ?? 0} applications</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="text-[10px]">{j.status}</Badge>
                        <Button size="sm" variant="ghost" className="h-8" asChild>
                          <Link to={`/dashboard/client/jobs/${j.id}/applications`}>
                            <Eye className="h-4 w-4" />
                          </Link>
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="border-slate-200 shadow-sm">
            <CardContent className="p-0">
              <div className="border-b border-slate-100 px-4 py-3">
                <h2 className="font-bold text-slate-900">Saved Searches</h2>
              </div>
              {loading ? (
                <Skeleton className="h-24 m-4" />
              ) : savedSearches.length === 0 ? (
                <p className="p-6 text-sm text-slate-500">
                  No saved searches. Save a Resdex search to reuse it from here.
                </p>
              ) : (
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-slate-100 text-left text-xs text-slate-500">
                      <th className="px-4 py-2 font-medium">Name</th>
                      <th className="px-4 py-2 font-medium">Keyword</th>
                      <th className="px-4 py-2 font-medium">Filters</th>
                    </tr>
                  </thead>
                  <tbody>
                    {savedSearches.map((row) => (
                      <tr key={row.id} className="border-b border-slate-50 hover:bg-slate-50">
                        <td className="px-4 py-2.5 font-medium">
                          <Link to={buildSavedSearchResultsUrl(row)} className="text-[#0566CD] hover:underline">
                            {row.name}
                          </Link>
                        </td>
                        <td className="px-4 py-2.5 text-slate-600 truncate max-w-[200px]">
                          {getSavedSearchQuery(row)}
                        </td>
                        <td className="px-4 py-2.5 text-slate-600">{formatSavedSearchMeta(row)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
