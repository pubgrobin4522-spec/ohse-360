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
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  BarChart3,
  Download,
  FileText,
  Plus,
  RefreshCw,
  Search,
} from "lucide-react";
import { useMemo, useState } from "react";
import {
  Bar,
  BarChart,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { PermitToWorkView } from "../backend";
import type { PTWStatus } from "../backend";
import { useAuth } from "../hooks/useAuth";
import { useBackend } from "../hooks/useBackend";
import { PermitTypeBadge, RiskBadge, StatusBadge } from "./ptw/PTWBadges";
import PTWCreateForm from "./ptw/PTWCreateForm";
import PTWDetail from "./ptw/PTWDetail";
import {
  PENDING_STATUSES,
  PERMIT_TYPE_LABELS,
  STATUS_LABELS,
} from "./ptw/ptwConstants";

type View = "list" | "create" | "detail";

const RISK_CHART_COLORS = {
  Low: "#22c55e",
  Medium: "#f59e0b",
  High: "#f97316",
  Critical: "#ef4444",
} as const;

const STATUS_CHART_COLORS: Record<string, string> = {
  Draft: "#64748b",
  Submitted: "#3b82f6",
  HODReview: "#f59e0b",
  AreaReview: "#f59e0b",
  IsolationReview: "#f97316",
  SafetyReview: "#a855f7",
  FinalApproval: "#6366f1",
  Approved: "#22c55e",
  Active: "#10b981",
  Suspended: "#eab308",
  Rejected: "#ef4444",
  Closed: "#475569",
  Expired: "#f97316",
};

function KPICard({
  label,
  value,
  color,
  ocid,
}: {
  label: string;
  value: number;
  color: string;
  ocid: string;
}) {
  return (
    <div
      className="rounded-xl border border-white/10 bg-slate-900/60 backdrop-blur-md p-4 flex flex-col gap-1"
      data-ocid={ocid}
    >
      <p className="text-xs text-slate-400 font-medium uppercase tracking-wide">
        {label}
      </p>
      <p className={`text-3xl font-bold ${color}`}>{value}</p>
    </div>
  );
}

export default function PTWPage() {
  const { actor, token, isReady } = useBackend();
  const { user } = useAuth();
  const qc = useQueryClient();
  const userRole = user?.role ?? "Employee";

  const [view, setView] = useState<View>("list");
  const [selectedPermit, setSelectedPermit] = useState<PermitToWorkView | null>(
    null,
  );
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState<string>("all");
  const [filterStatus, setFilterStatus] = useState<string>("all");

  const {
    data: permits = [],
    isLoading,
    refetch,
  } = useQuery<PermitToWorkView[]>({
    queryKey: ["ptws"],
    queryFn: async () => {
      if (!actor || !token) return [];
      const res = await actor.listPTWs(token, null, null);
      if (res.__kind__ === "err") throw new Error(res.err);
      return res.ok;
    },
    enabled: isReady,
  });

  const filtered = useMemo(() => {
    return permits.filter((p) => {
      const matchesSearch =
        !search ||
        p.id.toLowerCase().includes(search.toLowerCase()) ||
        p.jobDescription.toLowerCase().includes(search.toLowerCase()) ||
        p.jobLocation.toLowerCase().includes(search.toLowerCase());
      const matchesType = filterType === "all" || p.permitType === filterType;
      const matchesStatus = filterStatus === "all" || p.status === filterStatus;
      return matchesSearch && matchesType && matchesStatus;
    });
  }, [permits, search, filterType, filterStatus]);

  const kpis = useMemo(() => {
    const pendingStatuses = PENDING_STATUSES as readonly string[];
    return {
      total: permits.length,
      active: permits.filter((p) => p.status === "Active").length,
      pending: permits.filter((p) => pendingStatuses.includes(p.status)).length,
      expired: permits.filter((p) => p.status === "Expired").length,
      rejected: permits.filter((p) => p.status === "Rejected").length,
    };
  }, [permits]);

  const statusChartData = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const p of permits) {
      counts[p.status] = (counts[p.status] ?? 0) + 1;
    }
    return Object.entries(counts).map(([status, count]) => ({
      status: STATUS_LABELS[status as PTWStatus] ?? status,
      count,
      fill: STATUS_CHART_COLORS[status] ?? "#64748b",
    }));
  }, [permits]);

  const riskChartData = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const p of permits) {
      counts[p.riskLevel] = (counts[p.riskLevel] ?? 0) + 1;
    }
    return Object.entries(counts).map(([level, value]) => ({
      name: level,
      value,
      fill:
        RISK_CHART_COLORS[level as keyof typeof RISK_CHART_COLORS] ?? "#64748b",
    }));
  }, [permits]);

  function handleViewPermit(ptw: PermitToWorkView) {
    setSelectedPermit(ptw);
    setView("detail");
  }

  function handleRefreshDetail() {
    refetch();
    if (selectedPermit && actor && token) {
      actor.getPTW(token, selectedPermit.id).then((res) => {
        if (res.__kind__ === "ok") setSelectedPermit(res.ok);
      });
    }
  }

  function handleBackToList() {
    setView("list");
    setSelectedPermit(null);
    qc.invalidateQueries({ queryKey: ["ptws"] });
  }

  function exportCSV() {
    const headers = [
      "Permit ID",
      "Type",
      "Location",
      "Department",
      "Risk",
      "Status",
      "Created",
    ];
    const rows = filtered.map((p) => [
      p.id,
      PERMIT_TYPE_LABELS[p.permitType as keyof typeof PERMIT_TYPE_LABELS] ??
        p.permitType,
      p.jobLocation,
      p.department,
      p.riskLevel,
      STATUS_LABELS[p.status as PTWStatus] ?? p.status,
      new Date(Number(p.createdAt / 1_000_000n)).toLocaleDateString(),
    ]);
    const csv = [headers, ...rows]
      .map((r) => r.map((c) => `"${c}"`).join(","))
      .join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `ptw-permits-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  const canCreate = userRole !== "SafetyOfficer";

  // ── Create view ────────────────────────────────────────────────────────
  if (view === "create") {
    return (
      <div className="min-h-screen bg-background" data-ocid="ptw.page">
        <div className="px-4 py-6 max-w-5xl mx-auto space-y-4">
          <button
            type="button"
            onClick={handleBackToList}
            className="text-slate-400 hover:text-slate-100 text-sm flex items-center gap-1 transition-colors"
            data-ocid="ptw.create.back_button"
          >
            ← Back to Permits
          </button>
          <h1 className="text-xl font-bold text-foreground">
            New Work Permit (PTW)
          </h1>
          <PTWCreateForm
            onCancel={handleBackToList}
            onCreated={handleBackToList}
          />
        </div>
      </div>
    );
  }

  // ── Detail view ────────────────────────────────────────────────────────
  if (view === "detail" && selectedPermit) {
    return (
      <div className="min-h-screen bg-background" data-ocid="ptw.page">
        <div className="px-4 py-6 max-w-5xl mx-auto">
          <PTWDetail
            ptw={selectedPermit}
            onBack={handleBackToList}
            onRefresh={handleRefreshDetail}
          />
        </div>
      </div>
    );
  }

  // ── List / Dashboard view ──────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-background" data-ocid="ptw.page">
      <div className="px-4 py-6 max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold text-foreground tracking-tight">
              Work Permit Management (PTW)
            </h1>
            <p className="text-sm text-slate-400">
              Industrial command centre — permit lifecycle management
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => qc.invalidateQueries({ queryKey: ["ptws"] })}
              className="border-slate-600 text-slate-300 hover:text-slate-100"
              data-ocid="ptw.refresh_button"
            >
              <RefreshCw className="w-4 h-4" />
            </Button>
            <Button
              type="button"
              size="sm"
              variant="outline"
              onClick={exportCSV}
              disabled={filtered.length === 0}
              className="border-slate-600 text-slate-300 hover:text-slate-100 gap-1"
              data-ocid="ptw.export_csv_button"
            >
              <Download className="w-4 h-4" /> Export CSV
            </Button>
            {canCreate && (
              <Button
                type="button"
                size="sm"
                onClick={() => setView("create")}
                className="bg-cyan-700 hover:bg-cyan-600 text-white gap-1"
                data-ocid="ptw.create_permit_button"
              >
                <Plus className="w-4 h-4" /> New Permit
              </Button>
            )}
          </div>
        </div>

        {/* KPI Cards */}
        {isLoading ? (
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-24 rounded-xl bg-slate-800" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <KPICard
              label="Total Permits"
              value={kpis.total}
              color="text-cyan-300"
              ocid="ptw.kpi.total"
            />
            <KPICard
              label="Active"
              value={kpis.active}
              color="text-green-400"
              ocid="ptw.kpi.active"
            />
            <KPICard
              label="Pending Approvals"
              value={kpis.pending}
              color="text-amber-400"
              ocid="ptw.kpi.pending"
            />
            <KPICard
              label="Expired"
              value={kpis.expired}
              color="text-orange-400"
              ocid="ptw.kpi.expired"
            />
            <KPICard
              label="Rejected"
              value={kpis.rejected}
              color="text-red-400"
              ocid="ptw.kpi.rejected"
            />
          </div>
        )}

        {/* Charts */}
        {!isLoading && permits.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="rounded-xl border border-white/10 bg-slate-900/60 backdrop-blur-md p-4">
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-3 flex items-center gap-1">
                <BarChart3 className="w-3.5 h-3.5 text-cyan-400" /> Status
                Breakdown
              </p>
              <ResponsiveContainer width="100%" height={160}>
                <BarChart data={statusChartData} margin={{ left: -10 }}>
                  <XAxis
                    dataKey="status"
                    tick={{ fontSize: 9, fill: "#94a3b8" }}
                  />
                  <YAxis tick={{ fontSize: 10, fill: "#94a3b8" }} />
                  <Tooltip
                    contentStyle={{
                      background: "#0f172a",
                      border: "1px solid rgba(255,255,255,0.1)",
                      borderRadius: 8,
                    }}
                    labelStyle={{ color: "#e2e8f0" }}
                    itemStyle={{ color: "#94a3b8" }}
                  />
                  <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                    {statusChartData.map((entry, idx) => (
                      <Cell key={idx} fill={entry.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="rounded-xl border border-white/10 bg-slate-900/60 backdrop-blur-md p-4">
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-3 flex items-center gap-1">
                <BarChart3 className="w-3.5 h-3.5 text-amber-400" /> Risk Level
                Distribution
              </p>
              <div className="flex items-center gap-4">
                <ResponsiveContainer width="60%" height={160}>
                  <PieChart>
                    <Pie
                      data={riskChartData}
                      cx="50%"
                      cy="50%"
                      innerRadius={40}
                      outerRadius={70}
                      dataKey="value"
                    >
                      {riskChartData.map((entry, idx) => (
                        <Cell key={idx} fill={entry.fill} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        background: "#0f172a",
                        border: "1px solid rgba(255,255,255,0.1)",
                        borderRadius: 8,
                      }}
                      itemStyle={{ color: "#94a3b8" }}
                    />
                  </PieChart>
                </ResponsiveContainer>
                <div className="space-y-1.5">
                  {riskChartData.map((d) => (
                    <div
                      key={d.name}
                      className="flex items-center gap-2 text-xs"
                    >
                      <span
                        className="w-2.5 h-2.5 rounded-full shrink-0"
                        style={{ background: d.fill }}
                      />
                      <span className="text-slate-300">{d.name}</span>
                      <span className="text-slate-500 ml-auto">{d.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Filters & Search */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search permit ID, description, location…"
              className="pl-9 bg-slate-800/60 border-slate-700 text-slate-100 placeholder:text-slate-500"
              data-ocid="ptw.search_input"
            />
          </div>
          <Select value={filterType} onValueChange={setFilterType}>
            <SelectTrigger
              className="w-48 bg-slate-800/60 border-slate-700 text-slate-100"
              data-ocid="ptw.filter_type.select"
            >
              <SelectValue placeholder="All Types" />
            </SelectTrigger>
            <SelectContent className="bg-slate-900 border-slate-700">
              <SelectItem
                value="all"
                className="text-slate-100 focus:bg-slate-700"
              >
                All Types
              </SelectItem>
              {Object.entries(PERMIT_TYPE_LABELS).map(([k, v]) => (
                <SelectItem
                  key={k}
                  value={k}
                  className="text-slate-100 focus:bg-slate-700"
                >
                  {v}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger
              className="w-48 bg-slate-800/60 border-slate-700 text-slate-100"
              data-ocid="ptw.filter_status.select"
            >
              <SelectValue placeholder="All Statuses" />
            </SelectTrigger>
            <SelectContent className="bg-slate-900 border-slate-700">
              <SelectItem
                value="all"
                className="text-slate-100 focus:bg-slate-700"
              >
                All Statuses
              </SelectItem>
              {Object.entries(STATUS_LABELS).map(([k, v]) => (
                <SelectItem
                  key={k}
                  value={k}
                  className="text-slate-100 focus:bg-slate-700"
                >
                  {v}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Permits Table */}
        <div className="rounded-xl border border-white/10 bg-slate-900/60 backdrop-blur-md overflow-hidden">
          {isLoading ? (
            <div className="p-6 space-y-3">
              {Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} className="h-12 rounded-lg bg-slate-800" />
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div
              className="flex flex-col items-center justify-center py-16 text-slate-500"
              data-ocid="ptw.list.empty_state"
            >
              <FileText className="w-10 h-10 mb-3 opacity-30" />
              <p className="text-sm font-medium">No permits found</p>
              {canCreate && (
                <Button
                  type="button"
                  size="sm"
                  onClick={() => setView("create")}
                  className="mt-4 bg-cyan-700/30 text-cyan-300 border border-cyan-700/50 hover:bg-cyan-700/50"
                  data-ocid="ptw.list.create_cta"
                >
                  <Plus className="w-4 h-4 mr-1" /> Create First Permit
                </Button>
              )}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-white/10 bg-slate-800/60">
                    {[
                      "Permit No.",
                      "Type",
                      "Location",
                      "Dept",
                      "Risk",
                      "Status",
                      "Created",
                      "",
                    ].map((h) => (
                      <th
                        key={h}
                        className="px-4 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wide last:text-right"
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((ptw, i) => (
                    <tr
                      key={ptw.id}
                      className="border-b border-white/5 hover:bg-white/5 transition-colors cursor-pointer"
                      onClick={() => handleViewPermit(ptw)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ")
                          handleViewPermit(ptw);
                      }}
                      tabIndex={0}
                      data-ocid={`ptw.list.item.${i + 1}`}
                    >
                      <td className="px-4 py-3">
                        <span className="font-mono text-cyan-300 text-xs font-bold">
                          {ptw.id}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <PermitTypeBadge type={ptw.permitType} />
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-slate-300 text-xs truncate max-w-32 block">
                          {ptw.jobLocation}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-slate-300 text-xs truncate max-w-28 block">
                          {ptw.department}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <RiskBadge level={ptw.riskLevel} />
                      </td>
                      <td className="px-4 py-3">
                        <StatusBadge status={ptw.status} />
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-slate-400 text-xs">
                          {new Date(
                            Number(ptw.createdAt / 1_000_000n),
                          ).toLocaleDateString()}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <Button
                          type="button"
                          size="sm"
                          variant="outline"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleViewPermit(ptw);
                          }}
                          className="border-slate-600 text-slate-300 hover:text-slate-100 h-7 text-xs"
                          data-ocid={`ptw.list.view_button.${i + 1}`}
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
      </div>
    </div>
  );
}
