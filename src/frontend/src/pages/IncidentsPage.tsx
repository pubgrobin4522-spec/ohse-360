import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  AlertTriangle,
  Filter,
  Plus,
  RefreshCw,
  Search,
  X,
} from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import {
  type CAPAView,
  IncidentStatus,
  IncidentType,
  type IncidentView,
} from "../backend";

type Severity = "Low" | "Medium" | "High" | "Critical";
import { IncidentDetailPanel } from "../components/incidents/IncidentDetailPanel";
import { IncidentReportDialog } from "../components/incidents/IncidentReportDialog";
import { useAuth } from "../hooks/useAuth";
import { useBackend } from "../hooks/useBackend";

// ─── Severity colour helpers ───────────────────────────────────────────────────
export function severityClass(s: Severity): string {
  switch (s) {
    case "Critical":
      return "bg-red-500/20 text-red-400 border-red-500/40";
    case "High":
      return "bg-amber-500/20 text-amber-400 border-amber-500/40";
    case "Medium":
      return "bg-yellow-500/20 text-yellow-400 border-yellow-500/40";
    case "Low":
      return "bg-green-500/20 text-green-400 border-green-500/40";
    default:
      return "";
  }
}

export function statusClass(s: IncidentStatus): string {
  switch (s) {
    case IncidentStatus.Open:
      return "bg-blue-500/20 text-blue-400 border-blue-500/40";
    case IncidentStatus.UnderInvestigation:
      return "bg-purple-500/20 text-purple-400 border-purple-500/40";
    case IncidentStatus.CAPAPending:
      return "bg-amber-500/20 text-amber-400 border-amber-500/40";
    case IncidentStatus.Closed:
      return "bg-muted text-muted-foreground border-border";
  }
}

export function formatIncidentType(t: IncidentType): string {
  const labels: Record<IncidentType, string> = {
    [IncidentType.NearMiss]: "Near Miss",
    [IncidentType.UnsafeAct]: "Unsafe Act",
    [IncidentType.UnsafeCondition]: "Unsafe Condition",
    [IncidentType.FirstAid]: "First Aid",
    [IncidentType.LTI]: "LTI",
    [IncidentType.Fatal]: "Fatal",
  };
  return labels[t] ?? t;
}

export function formatStatus(s: IncidentStatus): string {
  const labels: Record<IncidentStatus, string> = {
    [IncidentStatus.Open]: "Open",
    [IncidentStatus.UnderInvestigation]: "Under Investigation",
    [IncidentStatus.CAPAPending]: "CAPA Pending",
    [IncidentStatus.Closed]: "Closed",
  };
  return labels[s] ?? s;
}

// ─── Main page ──────────────────────────────────────────────────────────────────
export default function IncidentsPage() {
  const { actor, token, isReady } = useBackend();
  const { user } = useAuth();
  const qc = useQueryClient();

  // Filters
  const [typeFilter, setTypeFilter] = useState<IncidentType | "all">("all");
  const [severityFilter, setSeverityFilter] = useState<Severity | "all">("all");
  const [statusFilter, setStatusFilter] = useState<IncidentStatus | "all">(
    "all",
  );
  const [search, setSearch] = useState("");

  // UI state
  const [showReport, setShowReport] = useState(false);
  const [selectedIncident, setSelectedIncident] = useState<IncidentView | null>(
    null,
  );

  // ── Fetch list ──────────────────────────────────────────────────────────────
  const {
    data: incidents,
    isLoading,
    error,
    refetch,
  } = useQuery<IncidentView[]>({
    queryKey: ["incidents", typeFilter, severityFilter, statusFilter],
    queryFn: async () => {
      if (!actor || !token) return [];
      const res = await actor.listIncidents(
        token,
        typeFilter === "all" ? null : typeFilter,
        severityFilter === "all" ? null : severityFilter,
        statusFilter === "all" ? null : statusFilter,
        null,
      );
      if (res.__kind__ === "err") throw new Error(res.err);
      return res.ok;
    },
    enabled: isReady,
  });

  // ── Fetch CAPAs for selected incident ─────────────────────────────────────
  const { data: capas } = useQuery<CAPAView[]>({
    queryKey: ["capas", selectedIncident?.incidentNumber],
    queryFn: async () => {
      if (!actor || !token || !selectedIncident) return [];
      const res = await actor.listCAPAs(token, selectedIncident.incidentNumber);
      if (res.__kind__ === "err") throw new Error(res.err);
      return res.ok;
    },
    enabled: isReady && !!selectedIncident,
  });

  // ── Close CAPA mutation ───────────────────────────────────────────────────
  const closeCAPAMut = useMutation({
    mutationFn: async (capaId: bigint) => {
      if (!actor || !token) throw new Error("Not authenticated");
      const res = await actor.closeCAPA(token, capaId);
      if (res.__kind__ === "err") throw new Error(res.err);
    },
    onSuccess: () => {
      toast.success("CAPA closed successfully");
      qc.invalidateQueries({ queryKey: ["capas"] });
      qc.invalidateQueries({ queryKey: ["incidents"] });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  // ── Update incident status mutation ──────────────────────────────────────
  const updateStatusMut = useMutation({
    mutationFn: async ({
      incNum,
      status,
      rootCause,
      correctiveAction,
    }: {
      incNum: string;
      status: IncidentStatus;
      rootCause: string;
      correctiveAction: string;
    }) => {
      if (!actor || !token) throw new Error("Not authenticated");
      const res = await actor.updateIncidentStatus(
        token,
        incNum,
        status,
        rootCause,
        correctiveAction,
      );
      if (res.__kind__ === "err") throw new Error(res.err);
    },
    onSuccess: (_, vars) => {
      toast.success("Status updated");
      qc.invalidateQueries({ queryKey: ["incidents"] });
      if (selectedIncident?.incidentNumber === vars.incNum && actor && token) {
        actor.getIncident(token, vars.incNum).then((r) => {
          if (r.__kind__ === "ok") setSelectedIncident(r.ok);
        });
      }
    },
    onError: (e: Error) => toast.error(e.message),
  });

  // ── Client-side search ────────────────────────────────────────────────────
  const filtered = useMemo(() => {
    if (!incidents) return [];
    const q = search.toLowerCase();
    if (!q) return incidents;
    return incidents.filter(
      (i) =>
        i.incidentNumber.toLowerCase().includes(q) ||
        i.location.toLowerCase().includes(q) ||
        i.reportedByName.toLowerCase().includes(q) ||
        i.department.toLowerCase().includes(q),
    );
  }, [incidents, search]);

  const isSafetyOfficer =
    user?.role === "SafetyOfficer" || user?.role === "SystemAdmin";
  const clearFilters = () => {
    setTypeFilter("all");
    setSeverityFilter("all");
    setStatusFilter("all");
    setSearch("");
  };
  const hasActiveFilters =
    typeFilter !== "all" ||
    severityFilter !== "all" ||
    statusFilter !== "all" ||
    search;

  // ── If detail panel is open ──────────────────────────────────────────────
  if (selectedIncident) {
    return (
      <IncidentDetailPanel
        incident={selectedIncident}
        capas={capas ?? []}
        isSafetyOfficer={isSafetyOfficer}
        isUpdating={updateStatusMut.isPending}
        isClosingCapa={closeCAPAMut.isPending}
        onBack={() => setSelectedIncident(null)}
        onUpdateStatus={(status, rootCause, correctiveAction) =>
          updateStatusMut.mutate({
            incNum: selectedIncident.incidentNumber,
            status,
            rootCause,
            correctiveAction,
          })
        }
        onCloseCAPA={(id) => closeCAPAMut.mutate(id)}
      />
    );
  }

  return (
    <div className="space-y-6" data-ocid="incidents.page">
      {/* ── Page header ──────────────────────────────────────────────────── */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="section-header flex items-center gap-2 mb-1">
            <AlertTriangle className="w-6 h-6 text-primary" />
            Incident Reporting
          </h1>
          <p className="text-muted-foreground text-sm">
            {isSafetyOfficer
              ? "All incidents across departments"
              : "Your reported incidents"}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => refetch()}
            data-ocid="incidents.refresh_button"
          >
            <RefreshCw className="w-4 h-4" />
          </Button>
          <Button
            size="sm"
            onClick={() => setShowReport(true)}
            data-ocid="incidents.report_button"
            className="gap-1.5"
          >
            <Plus className="w-4 h-4" />
            Report Incident
          </Button>
        </div>
      </div>

      {/* ── Filters row ────────────────────────────────────────────────── */}
      <div className="elevated-card rounded-xl p-4">
        <div className="flex flex-wrap gap-3 items-center">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search by number, location, reporter…"
              className="pl-9"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              data-ocid="incidents.search_input"
            />
          </div>

          <Select
            value={typeFilter}
            onValueChange={(v) => setTypeFilter(v as IncidentType | "all")}
          >
            <SelectTrigger className="w-44" data-ocid="incidents.type_filter">
              <Filter className="w-3.5 h-3.5 mr-1.5" />
              <SelectValue placeholder="Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              {Object.values(IncidentType).map((t) => (
                <SelectItem key={t} value={t}>
                  {formatIncidentType(t)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={severityFilter}
            onValueChange={(v) => setSeverityFilter(v as Severity | "all")}
          >
            <SelectTrigger
              className="w-40"
              data-ocid="incidents.severity_filter"
            >
              <SelectValue placeholder="Severity" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Severities</SelectItem>
              {(["Low", "Medium", "High", "Critical"] as Severity[]).map(
                (s) => (
                  <SelectItem key={s as string} value={s as string}>
                    {s}
                  </SelectItem>
                ),
              )}
            </SelectContent>
          </Select>

          <Select
            value={statusFilter}
            onValueChange={(v) => setStatusFilter(v as IncidentStatus | "all")}
          >
            <SelectTrigger className="w-44" data-ocid="incidents.status_filter">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              {Object.values(IncidentStatus).map((s) => (
                <SelectItem key={s} value={s}>
                  {formatStatus(s)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {hasActiveFilters && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearFilters}
              className="gap-1.5"
            >
              <X className="w-3.5 h-3.5" /> Clear
            </Button>
          )}
        </div>
      </div>

      {/* ── Summary stats ─────────────────────────────────────────────── */}
      {incidents && incidents.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {(
            [
              {
                label: "Total",
                count: incidents.length,
                cls: "text-foreground",
              },
              {
                label: "Open",
                count: incidents.filter((i) => i.status === IncidentStatus.Open)
                  .length,
                cls: "text-blue-400",
              },
              {
                label: "CAPA Pending",
                count: incidents.filter(
                  (i) => i.status === IncidentStatus.CAPAPending,
                ).length,
                cls: "text-amber-400",
              },
              {
                label: "Critical",
                count: incidents.filter((i) => i.severity === "Critical")
                  .length,
                cls: "text-red-400",
              },
            ] as const
          ).map(({ label, count, cls }) => (
            <div
              key={label}
              className="elevated-card rounded-xl p-4 text-center"
            >
              <div className={`text-2xl font-bold font-mono ${cls}`}>
                {count}
              </div>
              <div className="stat-label mt-1">{label}</div>
            </div>
          ))}
        </div>
      )}

      {/* ── Incidents table ──────────────────────────────────────────── */}
      <div className="elevated-card rounded-xl overflow-hidden">
        {isLoading ? (
          <div className="p-6 space-y-3" data-ocid="incidents.loading_state">
            {[...Array(5)].map((_, i) => (
              <Skeleton key={i} className="h-12 w-full" />
            ))}
          </div>
        ) : error ? (
          <div className="p-8 text-center" data-ocid="incidents.error_state">
            <AlertTriangle className="w-8 h-8 text-destructive mx-auto mb-2" />
            <p className="text-destructive font-medium">
              Failed to load incidents
            </p>
            <p className="text-muted-foreground text-sm mt-1">
              {(error as Error).message}
            </p>
            <Button
              variant="outline"
              size="sm"
              className="mt-4"
              onClick={() => refetch()}
            >
              Retry
            </Button>
          </div>
        ) : filtered.length === 0 ? (
          <div className="p-12 text-center" data-ocid="incidents.empty_state">
            <AlertTriangle className="w-10 h-10 text-muted-foreground/40 mx-auto mb-3" />
            <p className="text-muted-foreground font-medium">
              No incidents found
            </p>
            {hasActiveFilters ? (
              <p className="text-muted-foreground/60 text-sm mt-1">
                Try adjusting your filters
              </p>
            ) : (
              <Button
                size="sm"
                className="mt-4"
                onClick={() => setShowReport(true)}
              >
                <Plus className="w-4 h-4 mr-1.5" /> Report First Incident
              </Button>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm" data-ocid="incidents.table">
              <thead>
                <tr className="border-b border-border bg-muted/30">
                  <th className="text-left px-4 py-3 text-muted-foreground font-medium whitespace-nowrap">
                    Incident #
                  </th>
                  <th className="text-left px-4 py-3 text-muted-foreground font-medium">
                    Type
                  </th>
                  <th className="text-left px-4 py-3 text-muted-foreground font-medium">
                    Severity
                  </th>
                  <th className="text-left px-4 py-3 text-muted-foreground font-medium">
                    Status
                  </th>
                  <th className="text-left px-4 py-3 text-muted-foreground font-medium">
                    Location
                  </th>
                  {isSafetyOfficer && (
                    <th className="text-left px-4 py-3 text-muted-foreground font-medium">
                      Reported By
                    </th>
                  )}
                  <th className="text-left px-4 py-3 text-muted-foreground font-medium whitespace-nowrap">
                    Date
                  </th>
                  <th className="text-left px-4 py-3 text-muted-foreground font-medium">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((inc, idx) => (
                  <tr
                    key={inc.incidentNumber}
                    className="border-b border-border/50 hover:bg-muted/20 transition-colors cursor-pointer"
                    onClick={() => setSelectedIncident(inc)}
                    onKeyDown={(e) =>
                      e.key === "Enter" && setSelectedIncident(inc)
                    }
                    tabIndex={0}
                    data-ocid={`incidents.item.${idx + 1}`}
                  >
                    <td className="px-4 py-3">
                      <span className="font-mono text-xs text-primary font-semibold">
                        {inc.incidentNumber}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-foreground whitespace-nowrap">
                      {formatIncidentType(inc.incidentType)}
                    </td>
                    <td className="px-4 py-3">
                      <Badge
                        variant="outline"
                        className={`text-xs font-semibold border ${severityClass(inc.severity)}`}
                      >
                        {inc.severity}
                      </Badge>
                    </td>
                    <td className="px-4 py-3">
                      <Badge
                        variant="outline"
                        className={`text-xs border ${statusClass(inc.status)}`}
                      >
                        {formatStatus(inc.status)}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground max-w-[140px] truncate">
                      {inc.location}
                    </td>
                    {isSafetyOfficer && (
                      <td className="px-4 py-3 text-muted-foreground">
                        {inc.reportedByName}
                      </td>
                    )}
                    <td className="px-4 py-3 text-muted-foreground whitespace-nowrap">
                      {inc.incidentDate}
                    </td>
                    <td className="px-4 py-3">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-primary hover:text-primary h-7 px-2"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedIncident(inc);
                        }}
                        data-ocid={`incidents.view_button.${idx + 1}`}
                      >
                        View
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ── Report dialog ──────────────────────────────────────────────── */}
      <IncidentReportDialog
        open={showReport}
        onClose={() => setShowReport(false)}
        onCreated={(inc) => {
          qc.invalidateQueries({ queryKey: ["incidents"] });
          setShowReport(false);
          toast.success(`Incident ${inc.incidentNumber} reported successfully`);
          setSelectedIncident(inc);
        }}
      />
    </div>
  );
}
