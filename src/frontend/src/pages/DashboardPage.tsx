import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { useQuery } from "@tanstack/react-query";
import {
  Activity,
  AlertTriangle,
  Biohazard,
  Box,
  ClipboardCheck,
  ClipboardList,
  Clock,
  FileCheck,
  GraduationCap,
  Lock,
  RefreshCw,
  ShieldAlert,
  ShieldCheck,
  TrendingDown,
  TrendingUp,
  Users,
} from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import type { ReactNode } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  Pie,
  PieChart,
  RadialBar,
  RadialBarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { DeptOHSEScore, KPISummary, MonthlyTrend } from "../backend";
import { useAuth } from "../hooks/useAuth";
import { useBackend } from "../hooks/useBackend";
import { Role } from "../types";

// ─── constants ──────────────────────────────────────────────────────────────

const MONTHS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];
const CURRENT_YEAR = new Date().getFullYear();
const YEARS = Array.from({ length: 5 }, (_, i) => CURRENT_YEAR - i);

// Command Center neon palette
const C_CYAN = "#22d3ee";
const C_GREEN = "#4ade80";
const C_AMBER = "#fbbf24";
const C_ORANGE = "#fb923c";
const C_RED = "#f87171";
const C_VIOLET = "#a78bfa";

const TOOLTIP_STYLE: React.CSSProperties = {
  background: "#0f172a",
  border: "1px solid rgba(148,163,184,0.2)",
  borderRadius: 8,
  color: "#e2e8f0",
  fontSize: 12,
};

const GRID_STYLE = { stroke: "rgba(148,163,184,0.12)", strokeDasharray: "3 3" };
const AXIS_STYLE = { fill: "#94a3b8", fontSize: 11 };

// ─── helpers ────────────────────────────────────────────────────────────────

function fmtNum(n: number, d = 2) {
  return Number.isFinite(n) ? n.toFixed(d) : "—";
}
function safeNum(v: bigint | number | undefined): number {
  if (v === undefined) return 0;
  return typeof v === "bigint" ? Number(v) : v;
}
function riskColor(score: number): string {
  if (score >= 80) return C_RED;
  if (score >= 60) return C_ORANGE;
  if (score >= 40) return C_AMBER;
  return C_GREEN;
}
function riskLabel(score: number): string {
  if (score >= 80) return "Critical";
  if (score >= 60) return "High";
  if (score >= 40) return "Medium";
  return "Low";
}

// ─── GlassCard ──────────────────────────────────────────────────────────────

function GlassCard({
  children,
  className = "",
  ocid,
}: { children: ReactNode; className?: string; ocid?: string }) {
  return (
    <div
      className={`rounded-xl border border-white/10 bg-white/5 backdrop-blur-sm p-5 ${className}`}
      data-ocid={ocid}
    >
      {children}
    </div>
  );
}

// ─── NeonKpiCard ─────────────────────────────────────────────────────────────

interface NeonKpiProps {
  label: string;
  value: string;
  unit?: string;
  icon: ReactNode;
  color: string;
  sub?: string;
  trend?: "up" | "down" | "neutral";
  loading: boolean;
  ocid: string;
}

function NeonKpiCard({
  label,
  value,
  unit,
  icon,
  color,
  sub,
  trend,
  loading,
  ocid,
}: NeonKpiProps) {
  return (
    <GlassCard
      ocid={ocid}
      className="hover:border-white/20 transition-colors cursor-default"
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <p
            className="text-xs font-medium uppercase tracking-wider mb-2"
            style={{ color: "#94a3b8" }}
          >
            {label}
          </p>
          {loading ? (
            <Skeleton className="h-9 w-24 bg-white/10" />
          ) : (
            <div className="flex items-baseline gap-1">
              <span
                className="text-3xl font-bold tabular-nums"
                style={{ color }}
              >
                {value}
              </span>
              {unit && (
                <span className="text-sm" style={{ color: "#64748b" }}>
                  {unit}
                </span>
              )}
            </div>
          )}
          {sub && !loading && (
            <div className="flex items-center gap-1 mt-1.5">
              {trend === "up" && (
                <TrendingUp className="w-3 h-3" style={{ color: C_RED }} />
              )}
              {trend === "down" && (
                <TrendingDown className="w-3 h-3" style={{ color: C_GREEN }} />
              )}
              <span className="text-xs" style={{ color: "#64748b" }}>
                {sub}
              </span>
            </div>
          )}
        </div>
        <div
          className="p-2.5 rounded-lg shrink-0"
          style={{ background: `${color}18` }}
        >
          <div style={{ color }}>{icon}</div>
        </div>
      </div>
    </GlassCard>
  );
}

// ─── AI Risk Gauge ───────────────────────────────────────────────────────────

function AiRiskGauge({ score, loading }: { score: number; loading: boolean }) {
  const color = riskColor(score);
  const label = riskLabel(score);
  const gaugeData = [
    { name: "score", value: score, fill: color },
    { name: "bg", value: 100 - score, fill: "rgba(255,255,255,0.05)" },
  ];
  return (
    <GlassCard
      ocid="dashboard.kpi.ai-risk"
      className="hover:border-white/20 transition-colors cursor-default"
    >
      <p
        className="text-xs font-medium uppercase tracking-wider mb-2"
        style={{ color: "#94a3b8" }}
      >
        AI Risk Score
      </p>
      {loading ? (
        <Skeleton className="h-32 w-full bg-white/10" />
      ) : (
        <div className="flex items-center gap-4">
          <div className="relative" style={{ width: 80, height: 80 }}>
            <ResponsiveContainer width={80} height={80}>
              <RadialBarChart
                cx={40}
                cy={40}
                innerRadius={28}
                outerRadius={40}
                startAngle={90}
                endAngle={-270}
                data={gaugeData}
              >
                <RadialBar
                  dataKey="value"
                  cornerRadius={4}
                  background={{ fill: "rgba(255,255,255,0.05)" }}
                />
              </RadialBarChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex items-center justify-center">
              <span
                className="text-lg font-bold tabular-nums"
                style={{ color }}
              >
                {score}
              </span>
            </div>
          </div>
          <div>
            <div className="text-xl font-bold" style={{ color }}>
              {label}
            </div>
            <p className="text-xs mt-0.5" style={{ color: "#64748b" }}>
              Risk Level
            </p>
            <div
              className="mt-2 h-1.5 w-24 rounded-full"
              style={{ background: "rgba(255,255,255,0.08)" }}
            >
              <div
                className="h-full rounded-full transition-all"
                style={{ width: `${score}%`, background: color }}
              />
            </div>
          </div>
        </div>
      )}
    </GlassCard>
  );
}

// ─── SectionHeader ───────────────────────────────────────────────────────────

function SectionHeader({ title, badge }: { title: string; badge?: string }) {
  return (
    <div className="flex items-center gap-3 mb-4">
      <h2 className="text-lg font-semibold text-white">{title}</h2>
      {badge && (
        <span
          className="px-2 py-0.5 rounded-full text-xs font-medium"
          style={{ background: "rgba(34,211,238,0.12)", color: C_CYAN }}
        >
          {badge}
        </span>
      )}
      <div
        className="flex-1 h-px"
        style={{ background: "rgba(148,163,184,0.1)" }}
      />
    </div>
  );
}

// ─── ChartError / EmptyChart ─────────────────────────────────────────────────

function ChartError({ message, ocid }: { message: string; ocid: string }) {
  return (
    <div
      className="flex flex-col items-center justify-center h-48 gap-2"
      style={{ color: "#64748b" }}
      data-ocid={ocid}
    >
      <AlertTriangle className="w-6 h-6" style={{ color: C_RED }} />
      <p className="text-sm">{message}</p>
    </div>
  );
}

function EmptyChart({ message }: { message: string }) {
  return (
    <div
      className="flex flex-col items-center justify-center h-48 gap-2"
      style={{ color: "#64748b" }}
    >
      <ShieldCheck className="w-6 h-6" style={{ color: "#334155" }} />
      <p className="text-sm text-center max-w-xs">{message}</p>
    </div>
  );
}

// ─── DepartmentRiskHeatmap ───────────────────────────────────────────────────

interface DeptRiskRow {
  dept: string;
  low: number;
  medium: number;
  high: number;
  critical: number;
}

function DeptRiskHeatmap({
  data,
  loading,
}: { data: DeptRiskRow[]; loading: boolean }) {
  const LEVELS = ["Low", "Medium", "High", "Critical"] as const;
  const levelColor: Record<string, string> = {
    Low: C_GREEN,
    Medium: C_AMBER,
    High: C_ORANGE,
    Critical: C_RED,
  };
  return (
    <div className="overflow-x-auto" data-ocid="dashboard.chart.risk-heatmap">
      {loading ? (
        <Skeleton
          className="h-48 w-full bg-white/10"
          data-ocid="dashboard.chart.risk-heatmap.loading_state"
        />
      ) : data.length === 0 ? (
        <EmptyChart message="No department risk data available." />
      ) : (
        <table className="w-full text-sm">
          <thead>
            <tr>
              <th
                className="text-left py-2 pr-4 text-xs font-medium"
                style={{ color: "#94a3b8" }}
              >
                Department
              </th>
              {LEVELS.map((l) => (
                <th
                  key={l}
                  className="text-center py-2 px-3 text-xs font-medium"
                  style={{ color: levelColor[l] }}
                >
                  {l}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((row) => (
              <tr
                key={row.dept}
                className="border-t"
                style={{ borderColor: "rgba(148,163,184,0.08)" }}
              >
                <td
                  className="py-2 pr-4 text-sm font-medium"
                  style={{ color: "#e2e8f0" }}
                >
                  {row.dept}
                </td>
                {LEVELS.map((level) => {
                  const val = row[
                    level.toLowerCase() as keyof DeptRiskRow
                  ] as number;
                  const bg = val > 0 ? `${levelColor[level]}18` : "transparent";
                  return (
                    <td key={level} className="py-2 px-3 text-center">
                      <span
                        className="inline-block min-w-[2rem] px-2 py-0.5 rounded text-xs font-bold"
                        style={{
                          background: bg,
                          color: val > 0 ? levelColor[level] : "#334155",
                        }}
                      >
                        {val || "—"}
                      </span>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

// ─── DashboardHeader ─────────────────────────────────────────────────────────

interface DashboardHeaderProps {
  userName: string | null;
  userRole: string | null;
  userDept: string | null;
  selectedYear: number;
  selectedMonth: number | null;
  selectedDept: string;
  deptOptions: string[];
  onYearChange: (y: number) => void;
  onMonthChange: (m: number | null) => void;
  onDeptChange: (d: string) => void;
  onRefresh: () => void;
  lastRefresh: Date;
}

function DashboardHeader({
  userName,
  userRole,
  userDept,
  selectedYear,
  selectedMonth,
  selectedDept,
  deptOptions,
  onYearChange,
  onMonthChange,
  onDeptChange,
  onRefresh,
  lastRefresh,
}: DashboardHeaderProps) {
  const [, setTick] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setTick((t) => t + 1), 30_000);
    return () => clearInterval(id);
  }, []);
  const secsAgo = Math.round((Date.now() - lastRefresh.getTime()) / 1000);
  const refreshLabel =
    secsAgo < 10
      ? "Just now"
      : secsAgo < 60
        ? `${secsAgo}s ago`
        : `${Math.round(secsAgo / 60)}m ago`;

  return (
    <div
      className="flex flex-col sm:flex-row sm:items-start justify-between gap-4"
      data-ocid="dashboard.header"
    >
      <div>
        <div className="flex items-center gap-2">
          <div
            className="w-1 h-8 rounded-full"
            style={{
              background: `linear-gradient(180deg, ${C_CYAN}, ${C_GREEN})`,
            }}
          />
          <h1 className="text-2xl font-bold text-white">
            {userRole === "HOD"
              ? `${userDept ?? ""} Dashboard`
              : "RKTR Command Center"}
          </h1>
        </div>
        <p className="text-sm mt-1 ml-3" style={{ color: "#64748b" }}>
          Welcome back,{" "}
          <span className="font-medium" style={{ color: "#94a3b8" }}>
            {userName ?? "—"}
          </span>
        </p>
      </div>
      <div className="flex items-center gap-2 flex-wrap">
        <Select
          value={selectedMonth === null ? "all" : String(selectedMonth)}
          onValueChange={(v) => onMonthChange(v === "all" ? null : Number(v))}
        >
          <SelectTrigger
            className="w-[110px] h-8 text-xs border-white/10 bg-white/5 text-slate-300"
            data-ocid="dashboard.filter.month"
          >
            <SelectValue placeholder="Month" />
          </SelectTrigger>
          <SelectContent className="bg-slate-900 border-white/10">
            <SelectItem value="all" className="text-xs text-slate-300">
              All Months
            </SelectItem>
            {MONTHS.map((m, i) => (
              <SelectItem
                key={m}
                value={String(i + 1)}
                className="text-xs text-slate-300"
              >
                {m}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select
          value={String(selectedYear)}
          onValueChange={(v) => onYearChange(Number(v))}
        >
          <SelectTrigger
            className="w-[90px] h-8 text-xs border-white/10 bg-white/5 text-slate-300"
            data-ocid="dashboard.filter.year"
          >
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="bg-slate-900 border-white/10">
            {YEARS.map((y) => (
              <SelectItem
                key={y}
                value={String(y)}
                className="text-xs text-slate-300"
              >
                {y}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {deptOptions.length > 0 && (
          <Select value={selectedDept} onValueChange={onDeptChange}>
            <SelectTrigger
              className="w-[130px] h-8 text-xs border-white/10 bg-white/5 text-slate-300"
              data-ocid="dashboard.filter.dept"
            >
              <SelectValue placeholder="Department" />
            </SelectTrigger>
            <SelectContent className="bg-slate-900 border-white/10">
              <SelectItem value="all" className="text-xs text-slate-300">
                All Departments
              </SelectItem>
              {deptOptions.map((d) => (
                <SelectItem
                  key={d}
                  value={d}
                  className="text-xs text-slate-300"
                >
                  {d}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
        <button
          type="button"
          onClick={onRefresh}
          className="flex items-center gap-1.5 h-8 px-3 rounded-md text-xs font-medium transition-colors"
          style={{
            background: "rgba(255,255,255,0.05)",
            border: "1px solid rgba(255,255,255,0.1)",
            color: "#94a3b8",
          }}
          data-ocid="dashboard.refresh.button"
          aria-label="Refresh dashboard data"
        >
          <RefreshCw className="w-3 h-3" />
          <span className="hidden sm:inline">{refreshLabel}</span>
        </button>
      </div>
    </div>
  );
}

// ─── DashboardPage ────────────────────────────────────────────────────────────

export default function DashboardPage() {
  const { actor, token, isReady } = useBackend();
  const { user } = useAuth();
  const [selectedYear, setSelectedYear] = useState<number>(CURRENT_YEAR);
  const [selectedMonth, setSelectedMonth] = useState<number | null>(null);
  const [selectedDept, setSelectedDept] = useState<string>("all");
  const [lastRefresh, setLastRefresh] = useState<Date>(new Date());

  const isHOD = user?.role === Role.HOD;
  const isEmployee = user?.role === Role.Employee;
  const isAIC = user?.role === Role.AreaInCharge;
  const isContractorAdmin = user?.role === Role.ContractorAdmin;
  const isSafetyOrAdmin =
    user?.role === Role.SafetyOfficer || user?.role === Role.SystemAdmin;
  const deptFilter = isHOD
    ? (user?.department ?? null)
    : selectedDept !== "all"
      ? selectedDept
      : null;

  const handleRefresh = useCallback(() => setLastRefresh(new Date()), []);

  // Phase 1 queries
  const kpiQuery = useQuery<KPISummary>({
    queryKey: ["kpi", deptFilter, lastRefresh],
    queryFn: async () => {
      if (!actor || !token) throw new Error("Not ready");
      const res = await actor.getKPISummary(token, deptFilter);
      if (res.__kind__ === "err") throw new Error(res.err);
      return res.ok;
    },
    enabled: isReady && !!token,
    staleTime: 55_000,
    refetchInterval: 60_000,
  });

  const trendQuery = useQuery<MonthlyTrend[]>({
    queryKey: ["trend", selectedYear, deptFilter, lastRefresh],
    queryFn: async () => {
      if (!actor || !token) throw new Error("Not ready");
      const res = await actor.getIncidentTrend(token, BigInt(selectedYear));
      if (res.__kind__ === "err") throw new Error(res.err);
      return res.ok;
    },
    enabled: isReady && !!token,
    staleTime: 55_000,
  });

  const deptQuery = useQuery<DeptOHSEScore[]>({
    queryKey: ["deptScores", lastRefresh],
    queryFn: async () => {
      if (!actor || !token) throw new Error("Not ready");
      const res = await actor.getDeptOHSEScores(token);
      if (res.__kind__ === "err") throw new Error(res.err);
      return res.ok;
    },
    enabled: isReady && !!token && !isEmployee,
    staleTime: 55_000,
  });

  // Phase 2 queries (all wrapped in try/catch for graceful degradation)
  const bbsQuery = useQuery({
    queryKey: ["bbs", lastRefresh],
    queryFn: async () => {
      if (!actor || !token) throw new Error("Not ready");
      try {
        const r = await actor.getBbsStats(token);
        return r.__kind__ === "ok" ? r.ok : null;
      } catch {
        return null;
      }
    },
    enabled: isReady && !!token && !isEmployee,
    staleTime: 55_000,
  });

  const esgQuery = useQuery({
    queryKey: ["esg", selectedMonth, selectedYear, deptFilter, lastRefresh],
    queryFn: async () => {
      if (!actor || !token) throw new Error("Not ready");
      try {
        const r = await actor.getEsgStats(
          token,
          selectedMonth !== null ? BigInt(selectedMonth) : null,
          BigInt(selectedYear),
          deptFilter,
        );
        return r.__kind__ === "ok" ? r.ok : null;
      } catch {
        return null;
      }
    },
    enabled: isReady && !!token && !isEmployee,
    staleTime: 55_000,
  });

  const lotoQuery = useQuery({
    queryKey: ["lotoStats", lastRefresh],
    queryFn: async () => {
      if (!actor || !token) throw new Error("Not ready");
      try {
        const r = await actor.getLotoStats(token);
        return r.__kind__ === "ok" ? r.ok : null;
      } catch {
        return null;
      }
    },
    enabled: isReady && !!token && !isEmployee,
    staleTime: 55_000,
  });

  const contractorQuery = useQuery({
    queryKey: ["contractorStats", lastRefresh],
    queryFn: async () => {
      if (!actor || !token) throw new Error("Not ready");
      try {
        const r = await actor.getContractorStats(token);
        return r.__kind__ === "ok" ? r.ok : null;
      } catch {
        return null;
      }
    },
    enabled: isReady && !!token && !isEmployee,
    staleTime: 55_000,
  });

  const capa2Query = useQuery({
    queryKey: ["capa2Stats", lastRefresh],
    queryFn: async () => {
      if (!actor || !token) throw new Error("Not ready");
      try {
        const r = await actor.getCapa2Stats(token);
        return r.__kind__ === "ok" ? r.ok : null;
      } catch {
        return null;
      }
    },
    enabled: isReady && !!token && !isEmployee,
    staleTime: 55_000,
  });

  const hiraQuery = useQuery({
    queryKey: ["hiras", lastRefresh],
    queryFn: async () => {
      if (!actor || !token) throw new Error("Not ready");
      try {
        const r = await actor.listHIRAs(token);
        return r.__kind__ === "ok" ? r.ok : [];
      } catch {
        return [];
      }
    },
    enabled: isReady && !!token && !isEmployee,
    staleTime: 55_000,
  });

  const ppeQuery = useQuery({
    queryKey: ["ppeStats", lastRefresh],
    queryFn: async () => {
      if (!actor || !token) throw new Error("Not ready");
      try {
        const r = await actor.getPpeStats(token);
        return r.__kind__ === "ok" ? r.ok : null;
      } catch {
        return null;
      }
    },
    enabled: isReady && !!token && !isEmployee,
    staleTime: 55_000,
  });

  const riskScoreQuery = useQuery({
    queryKey: ["riskScore", lastRefresh],
    queryFn: async () => {
      if (!actor || !token) throw new Error("Not ready");
      try {
        const r = await actor.calculateRiskScore(token);
        return r.__kind__ === "ok" ? r.ok : null;
      } catch {
        return null;
      }
    },
    enabled: isReady && !!token && (isSafetyOrAdmin || isHOD),
    staleTime: 120_000,
  });

  const riskTrendQuery = useQuery({
    queryKey: ["riskTrend", lastRefresh],
    queryFn: async () => {
      if (!actor || !token) throw new Error("Not ready");
      try {
        const r = await actor.getRiskScoreTrend(token);
        return r.__kind__ === "ok" ? r.ok : [];
      } catch {
        return [];
      }
    },
    enabled: isReady && !!token && (isSafetyOrAdmin || isHOD),
    staleTime: 55_000,
  });

  const deptRiskQuery = useQuery({
    queryKey: ["deptRisk", lastRefresh],
    queryFn: async () => {
      if (!actor || !token) throw new Error("Not ready");
      try {
        const r = await actor.getDeptRiskBreakdown(token);
        return r.__kind__ === "ok" ? r.ok : [];
      } catch {
        return [];
      }
    },
    enabled: isReady && !!token && (isSafetyOrAdmin || isHOD),
    staleTime: 55_000,
  });

  const ptwStatsQuery = useQuery({
    queryKey: ["ptwStats", lastRefresh],
    queryFn: async () => {
      if (!actor || !token) throw new Error("Not ready");
      try {
        const r = await actor.getPtwDashboardStats(token);
        return r.__kind__ === "ok" ? r.ok : null;
      } catch {
        return null;
      }
    },
    enabled: isReady && !!token && !isEmployee,
    staleTime: 55_000,
  });

  // Derived values
  const kpi = kpiQuery.data;
  const kpiLoading = kpiQuery.isLoading || !isReady;
  const trainingPct = kpi?.trainingCompliancePct ?? 0;
  const ptwPct = kpi?.ptwCompliancePct ?? 0;

  const bbsScore = safeNum(bbsQuery.data?.score);
  const esgScore = safeNum(esgQuery.data?.esgScore);
  const activeLOTOs = safeNum(lotoQuery.data?.active);
  const activeContractors = safeNum(contractorQuery.data?.activeCount);
  const capaClosureRate = safeNum(capa2Query.data?.closureRate);
  const openHIRAs = (hiraQuery.data ?? []).filter(
    (h) => h.status !== "Approved" && h.status !== "Expired",
  ).length;
  const ppeCompliance = safeNum(ppeQuery.data?.complianceRate);
  const aiRiskScore = safeNum(riskScoreQuery.data?.overallScore);

  // Chart data
  const trendData = (trendQuery.data ?? []).map((t) => ({
    month: MONTHS[Number(t.month) - 1] ?? `M${t.month}`,
    incidents: Number(t.incidentCount),
  }));

  const deptData = (deptQuery.data ?? []).map((d) => ({
    department:
      d.department.length > 12 ? `${d.department.slice(0, 12)}…` : d.department,
    score: Math.round(d.score * 10) / 10,
    fullName: d.department,
  }));

  const nonCompliantPct = 100 - trainingPct;
  const pendingPct = Math.max(0, nonCompliantPct * 0.4);
  const trueNonCompliant = Math.max(0, nonCompliantPct - pendingPct);
  const PIE_COLORS = [C_GREEN, C_RED, C_AMBER];
  const pieData = [
    { name: "Compliant", value: Math.round(trainingPct) },
    { name: "Non-Compliant", value: Math.round(trueNonCompliant) },
    { name: "Pending", value: Math.round(pendingPct) },
  ].filter((d) => d.value > 0);

  const esgTrend = (esgQuery.data?.trendData ?? []).map(([label, val]) => ({
    label,
    value: val,
  }));

  const CAPA_PIE_COLORS = [C_CYAN, C_AMBER, C_VIOLET, C_GREEN, C_ORANGE, C_RED];
  const capaSources = (capa2Query.data?.bySource ?? []).map(([name, val]) => ({
    name,
    value: Number(val),
  }));

  const riskTrend = (riskTrendQuery.data ?? []).map(([label, score]) => ({
    label,
    score: Number(score),
  }));

  const contractorPerf = (contractorQuery.data?.performanceSummary ?? []).map(
    ([name, score]) => ({
      name: name.length > 14 ? `${name.slice(0, 14)}…` : name,
      score: Number(score),
      fullName: name,
    }),
  );

  const ptwByType = (ptwStatsQuery.data?.byType ?? []).map(([type, count]) => ({
    type,
    count: Number(count),
  }));

  const deptRiskHeatmap: DeptRiskRow[] = (() => {
    const raw = deptRiskQuery.data ?? [];
    const map: Record<string, DeptRiskRow> = {};
    for (const [dept, count, level] of raw) {
      if (!map[dept])
        map[dept] = { dept, low: 0, medium: 0, high: 0, critical: 0 };
      const l = level.toLowerCase() as keyof DeptRiskRow;
      if (l in map[dept])
        (map[dept] as unknown as Record<string, number>)[l] = Number(count);
    }
    return Object.values(map);
  })();

  const deptOptions = Array.from(
    new Set([
      ...(deptQuery.data ?? []).map((d) => d.department),
      ...deptRiskHeatmap.map((r) => r.dept),
    ]),
  ).filter(Boolean);

  const p2Loading =
    bbsQuery.isLoading || esgQuery.isLoading || capa2Query.isLoading;

  // Employee view
  if (isEmployee) {
    return (
      <div className="space-y-6" data-ocid="dashboard.page">
        <div className="flex items-center gap-2">
          <div
            className="w-1 h-8 rounded-full"
            style={{
              background: `linear-gradient(180deg, ${C_CYAN}, ${C_GREEN})`,
            }}
          />
          <h1 className="text-2xl font-bold text-white">My Dashboard</h1>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <NeonKpiCard
            ocid="dashboard.kpi.employee-training"
            label="My Training Compliance"
            value={kpiLoading ? "…" : fmtNum(trainingPct, 0)}
            unit="%"
            icon={<GraduationCap className="w-5 h-5" />}
            color={trainingPct >= 80 ? C_GREEN : C_AMBER}
            loading={kpiLoading}
            sub={trainingPct >= 80 ? "On track" : "Needs attention"}
          />
          <NeonKpiCard
            ocid="dashboard.kpi.employee-incidents"
            label="Total Incidents"
            value={kpiLoading ? "…" : String(safeNum(kpi?.totalIncidents))}
            icon={<AlertTriangle className="w-5 h-5" />}
            color={C_AMBER}
            loading={kpiLoading}
          />
        </div>
        <GlassCard className="flex flex-col items-center justify-center h-32 gap-2">
          <ShieldCheck className="w-7 h-7" style={{ color: "#334155" }} />
          <p
            className="text-sm text-center max-w-xs"
            style={{ color: "#64748b" }}
          >
            Full analytics are visible to Safety Officers, HODs, and
            administrators.
          </p>
        </GlassCard>
      </div>
    );
  }

  // Contractor Admin view
  if (isContractorAdmin) {
    const cLoading = contractorQuery.isLoading || !isReady;
    return (
      <div className="space-y-6" data-ocid="dashboard.page">
        <div className="flex items-center gap-2">
          <div
            className="w-1 h-8 rounded-full"
            style={{
              background: `linear-gradient(180deg, ${C_CYAN}, ${C_GREEN})`,
            }}
          />
          <h1 className="text-2xl font-bold text-white">
            Contractor Dashboard
          </h1>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <NeonKpiCard
            ocid="dashboard.kpi.active-contractors"
            label="Active Contractors"
            value={cLoading ? "…" : String(activeContractors)}
            icon={<Users className="w-5 h-5" />}
            color={C_CYAN}
            loading={cLoading}
          />
          <NeonKpiCard
            ocid="dashboard.kpi.induction"
            label="Induction Compliance"
            value={
              cLoading
                ? "…"
                : fmtNum(safeNum(contractorQuery.data?.inductionCompliance), 0)
            }
            unit="%"
            icon={<GraduationCap className="w-5 h-5" />}
            color={C_GREEN}
            loading={cLoading}
          />
          <NeonKpiCard
            ocid="dashboard.kpi.expiring-docs"
            label="Expiring Docs"
            value={
              cLoading
                ? "…"
                : String(safeNum(contractorQuery.data?.expiringDocs))
            }
            icon={<FileCheck className="w-5 h-5" />}
            color={C_AMBER}
            loading={cLoading}
          />
          <NeonKpiCard
            ocid="dashboard.kpi.contractor-incidents"
            label="Contractor Incidents"
            value={
              cLoading
                ? "…"
                : String(safeNum(contractorQuery.data?.incidentCount))
            }
            icon={<AlertTriangle className="w-5 h-5" />}
            color={C_RED}
            loading={cLoading}
          />
        </div>
      </div>
    );
  }

  // Area In Charge view
  if (isAIC) {
    return (
      <div className="space-y-6" data-ocid="dashboard.page">
        <div className="flex items-center gap-2">
          <div
            className="w-1 h-8 rounded-full"
            style={{
              background: `linear-gradient(180deg, ${C_AMBER}, ${C_ORANGE})`,
            }}
          />
          <h1 className="text-2xl font-bold text-white">
            Area In Charge Dashboard
          </h1>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <NeonKpiCard
            ocid="dashboard.kpi.active-lotos"
            label="Active LOTOs"
            value={lotoQuery.isLoading ? "…" : String(activeLOTOs)}
            icon={<Lock className="w-5 h-5" />}
            color={C_AMBER}
            loading={lotoQuery.isLoading}
          />
          <NeonKpiCard
            ocid="dashboard.kpi.open-hiras"
            label="Open HIRAs"
            value={hiraQuery.isLoading ? "…" : String(openHIRAs)}
            icon={<ShieldAlert className="w-5 h-5" />}
            color={C_ORANGE}
            loading={hiraQuery.isLoading}
          />
          <NeonKpiCard
            ocid="dashboard.kpi.ptw-compliance"
            label="PTW Compliance"
            value={kpiLoading ? "…" : fmtNum(ptwPct, 1)}
            unit="%"
            icon={<ClipboardList className="w-5 h-5" />}
            color={ptwPct >= 90 ? C_GREEN : C_AMBER}
            loading={kpiLoading}
          />
          <NeonKpiCard
            ocid="dashboard.kpi.open-capas"
            label="Open CAPAs"
            value={kpiLoading ? "…" : String(safeNum(kpi?.openCAPAs))}
            icon={<ClipboardCheck className="w-5 h-5" />}
            color={C_RED}
            loading={kpiLoading}
          />
        </div>
      </div>
    );
  }

  // Full view: SystemAdmin, SafetyOfficer, HOD
  return (
    <div className="space-y-8" data-ocid="dashboard.page">
      <DashboardHeader
        userName={user?.name ?? null}
        userRole={user?.role ?? null}
        userDept={user?.department ?? null}
        selectedYear={selectedYear}
        selectedMonth={selectedMonth}
        selectedDept={selectedDept}
        deptOptions={deptOptions}
        onYearChange={setSelectedYear}
        onMonthChange={setSelectedMonth}
        onDeptChange={setSelectedDept}
        onRefresh={handleRefresh}
        lastRefresh={lastRefresh}
      />

      {/* Phase 1 KPIs */}
      <section data-ocid="dashboard.kpi.phase1.section">
        <SectionHeader title="Safety KPIs" badge="Phase 1" />
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
          <NeonKpiCard
            ocid="dashboard.kpi.trir"
            label="TRIR"
            value={kpiLoading ? "…" : fmtNum(kpi?.trir ?? 0)}
            unit="per 200k hrs"
            icon={<AlertTriangle className="w-5 h-5" />}
            color={(kpi?.trir ?? 0) > 2 ? C_RED : C_GREEN}
            loading={kpiLoading}
            sub={(kpi?.trir ?? 0) > 2 ? "Above target (2.0)" : "Within target"}
            trend={(kpi?.trir ?? 0) > 2 ? "up" : "down"}
          />
          <NeonKpiCard
            ocid="dashboard.kpi.ltifr"
            label="LTIFR"
            value={kpiLoading ? "…" : fmtNum(kpi?.ltifr ?? 0)}
            unit="per 1M hrs"
            icon={<Clock className="w-5 h-5" />}
            color={(kpi?.ltifr ?? 0) > 1 ? C_RED : C_GREEN}
            loading={kpiLoading}
            sub={(kpi?.ltifr ?? 0) > 1 ? "Above target (1.0)" : "Within target"}
            trend={(kpi?.ltifr ?? 0) > 1 ? "up" : "down"}
          />
          <NeonKpiCard
            ocid="dashboard.kpi.nearmiss"
            label="Near Miss Count"
            value={kpiLoading ? "…" : String(safeNum(kpi?.nearMissCount))}
            icon={<ShieldCheck className="w-5 h-5" />}
            color={C_AMBER}
            loading={kpiLoading}
          />
          <NeonKpiCard
            ocid="dashboard.kpi.audit"
            label="Audit Score"
            value={kpiLoading ? "…" : fmtNum(kpi?.auditScorePct ?? 0, 1)}
            unit="%"
            icon={<FileCheck className="w-5 h-5" />}
            color={(kpi?.auditScorePct ?? 0) >= 80 ? C_GREEN : C_AMBER}
            loading={kpiLoading}
            sub={
              (kpi?.auditScorePct ?? 0) >= 80 ? "Good standing" : "Below 80%"
            }
          />
          <NeonKpiCard
            ocid="dashboard.kpi.training"
            label="Training Compliance"
            value={kpiLoading ? "…" : fmtNum(trainingPct, 1)}
            unit="%"
            icon={<GraduationCap className="w-5 h-5" />}
            color={trainingPct >= 80 ? C_GREEN : C_AMBER}
            loading={kpiLoading}
            sub={trainingPct >= 80 ? "On track" : "Needs attention"}
            trend={trainingPct >= 80 ? "down" : "up"}
          />
          <NeonKpiCard
            ocid="dashboard.kpi.ptw"
            label="PTW Compliance"
            value={kpiLoading ? "…" : fmtNum(ptwPct, 1)}
            unit="%"
            icon={<ClipboardList className="w-5 h-5" />}
            color={ptwPct >= 90 ? C_GREEN : C_AMBER}
            loading={kpiLoading}
            sub={ptwPct >= 90 ? "On track" : "Below 90%"}
            trend={ptwPct >= 90 ? "down" : "up"}
          />
        </div>
      </section>

      {/* Phase 2 KPIs */}
      <section data-ocid="dashboard.kpi.phase2.section">
        <SectionHeader title="Intelligence KPIs" badge="Phase 2" />
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <NeonKpiCard
            ocid="dashboard.kpi.bbs"
            label="BBS Score"
            value={p2Loading ? "…" : fmtNum(bbsScore, 0)}
            unit="%"
            icon={<Activity className="w-5 h-5" />}
            color={bbsScore >= 80 ? C_GREEN : bbsScore >= 60 ? C_AMBER : C_RED}
            loading={p2Loading}
            sub={`${safeNum(bbsQuery.data?.safe)} safe acts observed`}
          />
          <NeonKpiCard
            ocid="dashboard.kpi.esg"
            label="ESG Score"
            value={p2Loading ? "…" : fmtNum(esgScore, 0)}
            unit="%"
            icon={<Biohazard className="w-5 h-5" />}
            color={esgScore >= 80 ? C_GREEN : esgScore >= 60 ? C_AMBER : C_RED}
            loading={p2Loading}
            sub="Environmental compliance"
          />
          <NeonKpiCard
            ocid="dashboard.kpi.active-lotos"
            label="Active LOTOs"
            value={lotoQuery.isLoading ? "…" : String(activeLOTOs)}
            icon={<Lock className="w-5 h-5" />}
            color={C_AMBER}
            loading={lotoQuery.isLoading}
            sub={`${safeNum(lotoQuery.data?.completedThisMonth)} completed this month`}
          />
          <NeonKpiCard
            ocid="dashboard.kpi.active-contractors"
            label="Active Contractors"
            value={contractorQuery.isLoading ? "…" : String(activeContractors)}
            icon={<Users className="w-5 h-5" />}
            color={C_CYAN}
            loading={contractorQuery.isLoading}
            sub={`${safeNum(contractorQuery.data?.expiringDocs)} docs expiring`}
          />
          <NeonKpiCard
            ocid="dashboard.kpi.capa-closure"
            label="CAPA Closure Rate"
            value={p2Loading ? "…" : fmtNum(capaClosureRate, 0)}
            unit="%"
            icon={<ClipboardCheck className="w-5 h-5" />}
            color={capaClosureRate >= 80 ? C_GREEN : C_AMBER}
            loading={p2Loading}
            sub={`${safeNum(capa2Query.data?.overdue)} overdue`}
          />
          <NeonKpiCard
            ocid="dashboard.kpi.open-hiras"
            label="Open HIRAs"
            value={hiraQuery.isLoading ? "…" : String(openHIRAs)}
            icon={<ShieldAlert className="w-5 h-5" />}
            color={openHIRAs > 5 ? C_ORANGE : C_AMBER}
            loading={hiraQuery.isLoading}
          />
          <NeonKpiCard
            ocid="dashboard.kpi.ppe-compliance"
            label="PPE Compliance"
            value={ppeQuery.isLoading ? "…" : fmtNum(ppeCompliance, 0)}
            unit="%"
            icon={<Box className="w-5 h-5" />}
            color={ppeCompliance >= 90 ? C_GREEN : C_AMBER}
            loading={ppeQuery.isLoading}
            sub={`${safeNum(ppeQuery.data?.lowStockItems)} low stock items`}
          />
          <AiRiskGauge score={aiRiskScore} loading={riskScoreQuery.isLoading} />
        </div>
      </section>

      {/* Phase 1 Charts */}
      <section data-ocid="dashboard.charts.phase1.section">
        <SectionHeader title="Safety Analytics" badge="Phase 1" />
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
          <GlassCard ocid="dashboard.chart.trend">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-white">
                Incident Trend — {selectedYear}
              </h3>
              <span
                className="px-2 py-0.5 rounded-full text-xs font-mono"
                style={{ background: `${C_CYAN}15`, color: C_CYAN }}
              >
                {trendData.reduce((s, d) => s + d.incidents, 0)} total
              </span>
            </div>
            {trendQuery.isLoading ? (
              <Skeleton
                className="h-48 w-full bg-white/10"
                data-ocid="dashboard.chart.trend.loading_state"
              />
            ) : trendQuery.isError ? (
              <ChartError
                message="Failed to load incident trend"
                ocid="dashboard.chart.trend.error_state"
              />
            ) : trendData.length === 0 ? (
              <EmptyChart message="No incident data for this year." />
            ) : (
              <ResponsiveContainer width="100%" height={200}>
                <LineChart
                  data={trendData}
                  margin={{ top: 5, right: 10, left: -10, bottom: 5 }}
                >
                  <CartesianGrid {...GRID_STYLE} />
                  <XAxis
                    dataKey="month"
                    tick={AXIS_STYLE}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    allowDecimals={false}
                    tick={AXIS_STYLE}
                    axisLine={false}
                    tickLine={false}
                  />
                  <Tooltip
                    contentStyle={TOOLTIP_STYLE}
                    itemStyle={{ color: C_CYAN }}
                    cursor={{ stroke: C_CYAN, strokeOpacity: 0.2 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="incidents"
                    stroke={C_CYAN}
                    strokeWidth={2.5}
                    dot={{ fill: C_CYAN, r: 3, strokeWidth: 0 }}
                    activeDot={{ r: 5, fill: C_CYAN }}
                    name="Incidents"
                  />
                </LineChart>
              </ResponsiveContainer>
            )}
          </GlassCard>

          <GlassCard ocid="dashboard.chart.compliance">
            <h3 className="text-sm font-semibold text-white mb-4">
              Training Compliance Status
            </h3>
            {kpiLoading ? (
              <Skeleton
                className="h-48 w-full bg-white/10"
                data-ocid="dashboard.chart.compliance.loading_state"
              />
            ) : kpiQuery.isError ? (
              <ChartError
                message="Failed to load compliance data"
                ocid="dashboard.chart.compliance.error_state"
              />
            ) : (
              <div className="flex items-center gap-4">
                <ResponsiveContainer width="55%" height={180}>
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={80}
                      paddingAngle={3}
                      dataKey="value"
                    >
                      {pieData.map((_e, i) => (
                        <Cell
                          key={pieData[i].name}
                          fill={PIE_COLORS[i % PIE_COLORS.length]}
                          stroke="transparent"
                        />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={TOOLTIP_STYLE}
                      formatter={(val: number) => [`${val}%`, ""]}
                    />
                  </PieChart>
                </ResponsiveContainer>
                <div className="flex flex-col gap-2.5 min-w-0">
                  {pieData.map((e, i) => (
                    <div key={e.name} className="flex items-center gap-2">
                      <div
                        className="w-2.5 h-2.5 rounded-full shrink-0"
                        style={{
                          background: PIE_COLORS[i % PIE_COLORS.length],
                        }}
                      />
                      <div className="min-w-0">
                        <p className="text-xs font-medium text-white truncate">
                          {e.name}
                        </p>
                        <p
                          className="text-xs font-mono"
                          style={{ color: "#64748b" }}
                        >
                          {e.value}%
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </GlassCard>

          {!isHOD && (
            <GlassCard className="xl:col-span-2" ocid="dashboard.chart.dept">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-semibold text-white">
                  Department OHSE Scores
                </h3>
                <span
                  className="px-2 py-0.5 rounded-full text-xs font-mono"
                  style={{ background: `${C_AMBER}15`, color: C_AMBER }}
                >
                  {deptData.length} departments
                </span>
              </div>
              {deptQuery.isLoading ? (
                <Skeleton
                  className="h-48 w-full bg-white/10"
                  data-ocid="dashboard.chart.dept.loading_state"
                />
              ) : deptQuery.isError ? (
                <ChartError
                  message="Failed to load department scores"
                  ocid="dashboard.chart.dept.error_state"
                />
              ) : deptData.length === 0 ? (
                <EmptyChart message="No department score data available." />
              ) : (
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart
                    data={deptData}
                    margin={{ top: 5, right: 10, left: -10, bottom: 5 }}
                  >
                    <CartesianGrid {...GRID_STYLE} vertical={false} />
                    <XAxis
                      dataKey="department"
                      tick={AXIS_STYLE}
                      axisLine={false}
                      tickLine={false}
                    />
                    <YAxis
                      domain={[0, 100]}
                      tick={AXIS_STYLE}
                      axisLine={false}
                      tickLine={false}
                      tickFormatter={(v: number) => `${v}%`}
                    />
                    <Tooltip
                      contentStyle={TOOLTIP_STYLE}
                      formatter={(
                        val: number,
                        _n: string,
                        p: { payload?: { fullName?: string } },
                      ) => [`${val}%`, p.payload?.fullName ?? ""]}
                      cursor={{ fill: "rgba(255,255,255,0.04)" }}
                    />
                    <Bar
                      dataKey="score"
                      radius={[4, 4, 0, 0]}
                      maxBarSize={60}
                      name="OHSE Score"
                    >
                      {deptData.map((e, i) => (
                        <Cell
                          key={deptData[i].department}
                          fill={
                            e.score >= 80
                              ? C_GREEN
                              : e.score >= 60
                                ? C_AMBER
                                : C_RED
                          }
                        />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              )}
            </GlassCard>
          )}
        </div>
      </section>

      {/* Phase 2 Charts */}
      <section data-ocid="dashboard.charts.phase2.section">
        <SectionHeader title="Intelligence Analytics" badge="Phase 2" />
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
          <GlassCard ocid="dashboard.chart.esg-trend">
            <h3 className="text-sm font-semibold text-white mb-4">ESG Trend</h3>
            {esgQuery.isLoading ? (
              <Skeleton
                className="h-48 w-full bg-white/10"
                data-ocid="dashboard.chart.esg-trend.loading_state"
              />
            ) : esgTrend.length === 0 ? (
              <EmptyChart message="No ESG trend data yet. Log environmental entries to see trends." />
            ) : (
              <ResponsiveContainer width="100%" height={200}>
                <LineChart
                  data={esgTrend}
                  margin={{ top: 5, right: 10, left: -10, bottom: 5 }}
                >
                  <CartesianGrid {...GRID_STYLE} />
                  <XAxis
                    dataKey="label"
                    tick={AXIS_STYLE}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis tick={AXIS_STYLE} axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={TOOLTIP_STYLE} />
                  <Line
                    type="monotone"
                    dataKey="value"
                    stroke={C_GREEN}
                    strokeWidth={2.5}
                    dot={{ fill: C_GREEN, r: 3, strokeWidth: 0 }}
                    name="ESG Index"
                  />
                </LineChart>
              </ResponsiveContainer>
            )}
          </GlassCard>

          <GlassCard ocid="dashboard.chart.capa-source">
            <h3 className="text-sm font-semibold text-white mb-4">
              CAPA Source Breakdown
            </h3>
            {capa2Query.isLoading ? (
              <Skeleton
                className="h-48 w-full bg-white/10"
                data-ocid="dashboard.chart.capa-source.loading_state"
              />
            ) : capaSources.length === 0 ? (
              <EmptyChart message="No CAPA data yet." />
            ) : (
              <div className="flex items-center gap-4">
                <ResponsiveContainer width="55%" height={180}>
                  <PieChart>
                    <Pie
                      data={capaSources}
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={80}
                      paddingAngle={3}
                      dataKey="value"
                    >
                      {capaSources.map((_e, i) => (
                        <Cell
                          key={capaSources[i].name}
                          fill={CAPA_PIE_COLORS[i % CAPA_PIE_COLORS.length]}
                          stroke="transparent"
                        />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={TOOLTIP_STYLE} />
                  </PieChart>
                </ResponsiveContainer>
                <div className="flex flex-col gap-2.5">
                  {capaSources.map((e, i) => (
                    <div key={e.name} className="flex items-center gap-2">
                      <div
                        className="w-2.5 h-2.5 rounded-full shrink-0"
                        style={{
                          background:
                            CAPA_PIE_COLORS[i % CAPA_PIE_COLORS.length],
                        }}
                      />
                      <div>
                        <p className="text-xs font-medium text-white">
                          {e.name}
                        </p>
                        <p
                          className="text-xs font-mono"
                          style={{ color: "#64748b" }}
                        >
                          {e.value}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </GlassCard>

          <GlassCard ocid="dashboard.chart.risk-trend">
            <h3 className="text-sm font-semibold text-white mb-4">
              AI Risk Score Trend (6 months)
            </h3>
            {riskTrendQuery.isLoading ? (
              <Skeleton
                className="h-48 w-full bg-white/10"
                data-ocid="dashboard.chart.risk-trend.loading_state"
              />
            ) : riskTrend.length === 0 ? (
              <EmptyChart message="No risk score history yet. Calculate risk score to build trend data." />
            ) : (
              <ResponsiveContainer width="100%" height={200}>
                <LineChart
                  data={riskTrend}
                  margin={{ top: 5, right: 10, left: -10, bottom: 5 }}
                >
                  <CartesianGrid {...GRID_STYLE} />
                  <XAxis
                    dataKey="label"
                    tick={AXIS_STYLE}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    domain={[0, 100]}
                    tick={AXIS_STYLE}
                    axisLine={false}
                    tickLine={false}
                  />
                  <Tooltip
                    contentStyle={TOOLTIP_STYLE}
                    itemStyle={{ color: C_ORANGE }}
                  />
                  <Line
                    type="monotone"
                    dataKey="score"
                    stroke={C_ORANGE}
                    strokeWidth={2.5}
                    dot={{ fill: C_ORANGE, r: 3, strokeWidth: 0 }}
                    activeDot={{ r: 5 }}
                    name="Risk Score"
                  />
                </LineChart>
              </ResponsiveContainer>
            )}
          </GlassCard>

          <GlassCard ocid="dashboard.chart.contractor-perf">
            <h3 className="text-sm font-semibold text-white mb-4">
              Contractor Safety Performance
            </h3>
            {contractorQuery.isLoading ? (
              <Skeleton
                className="h-48 w-full bg-white/10"
                data-ocid="dashboard.chart.contractor-perf.loading_state"
              />
            ) : contractorPerf.length === 0 ? (
              <EmptyChart message="No contractor performance data yet." />
            ) : (
              <ResponsiveContainer width="100%" height={200}>
                <BarChart
                  data={contractorPerf}
                  margin={{ top: 5, right: 10, left: -10, bottom: 5 }}
                  layout="vertical"
                >
                  <CartesianGrid {...GRID_STYLE} horizontal={false} />
                  <XAxis
                    type="number"
                    domain={[0, 100]}
                    tick={AXIS_STYLE}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    dataKey="name"
                    type="category"
                    tick={AXIS_STYLE}
                    axisLine={false}
                    tickLine={false}
                    width={90}
                  />
                  <Tooltip
                    contentStyle={TOOLTIP_STYLE}
                    formatter={(
                      val: number,
                      _n: string,
                      p: { payload?: { fullName?: string } },
                    ) => [`${val}`, p.payload?.fullName ?? ""]}
                    cursor={{ fill: "rgba(255,255,255,0.04)" }}
                  />
                  <Bar
                    dataKey="score"
                    radius={[0, 4, 4, 0]}
                    maxBarSize={24}
                    fill={C_CYAN}
                  >
                    {contractorPerf.map((e, i) => (
                      <Cell
                        key={contractorPerf[i].name}
                        fill={
                          e.score >= 80
                            ? C_GREEN
                            : e.score >= 60
                              ? C_CYAN
                              : e.score >= 40
                                ? C_AMBER
                                : C_RED
                        }
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            )}
          </GlassCard>

          <GlassCard ocid="dashboard.chart.ptw-type">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-white">
                Permits by Type
              </h3>
              {ptwStatsQuery.data && (
                <span className="text-xs" style={{ color: "#64748b" }}>
                  Avg {ptwStatsQuery.data.avgCycleTimeDays.toFixed(1)}d cycle
                </span>
              )}
            </div>
            {ptwStatsQuery.isLoading ? (
              <Skeleton
                className="h-48 w-full bg-white/10"
                data-ocid="dashboard.chart.ptw-type.loading_state"
              />
            ) : ptwByType.length === 0 ? (
              <EmptyChart message="No PTW data for selected period." />
            ) : (
              <ResponsiveContainer width="100%" height={200}>
                <BarChart
                  data={ptwByType}
                  margin={{ top: 5, right: 10, left: -10, bottom: 5 }}
                >
                  <CartesianGrid {...GRID_STYLE} vertical={false} />
                  <XAxis
                    dataKey="type"
                    tick={AXIS_STYLE}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    allowDecimals={false}
                    tick={AXIS_STYLE}
                    axisLine={false}
                    tickLine={false}
                  />
                  <Tooltip
                    contentStyle={TOOLTIP_STYLE}
                    cursor={{ fill: "rgba(255,255,255,0.04)" }}
                  />
                  <Bar
                    dataKey="count"
                    fill={C_VIOLET}
                    radius={[4, 4, 0, 0]}
                    maxBarSize={48}
                    name="Count"
                  />
                </BarChart>
              </ResponsiveContainer>
            )}
          </GlassCard>

          <GlassCard
            className="xl:col-span-2"
            ocid="dashboard.chart.risk-heatmap-wrap"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-white">
                Department Risk Heatmap
              </h3>
              <div className="flex items-center gap-3">
                {(["Low", "Medium", "High", "Critical"] as const).map((l) => {
                  const clr: Record<string, string> = {
                    Low: C_GREEN,
                    Medium: C_AMBER,
                    High: C_ORANGE,
                    Critical: C_RED,
                  };
                  return (
                    <div key={l} className="flex items-center gap-1">
                      <div
                        className="w-2 h-2 rounded-full"
                        style={{ background: clr[l] }}
                      />
                      <span className="text-xs" style={{ color: "#64748b" }}>
                        {l}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
            <DeptRiskHeatmap
              data={deptRiskHeatmap}
              loading={deptRiskQuery.isLoading}
            />
          </GlassCard>
        </div>
      </section>

      {/* Open CAPAs strip */}
      <section
        className="flex items-center gap-3 p-4 rounded-xl border"
        style={{
          background: "rgba(251,191,36,0.06)",
          borderColor: "rgba(251,191,36,0.2)",
        }}
        data-ocid="dashboard.capa.summary"
      >
        <div
          className="p-2 rounded-lg"
          style={{ background: "rgba(251,191,36,0.12)" }}
        >
          <AlertTriangle className="w-4 h-4" style={{ color: C_AMBER }} />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-white">
            {kpiLoading ? (
              <Skeleton className="h-4 w-48 inline-block bg-white/10" />
            ) : (
              <>
                <span
                  className="font-mono font-bold"
                  style={{ color: C_AMBER }}
                >
                  {String(safeNum(kpi?.openCAPAs))}
                </span>
                {" open CAPA"}
                {Number(safeNum(kpi?.openCAPAs)) !== 1 ? "s" : ""}
                {" · "}
                <span className="font-mono font-bold" style={{ color: C_RED }}>
                  {String(safeNum(capa2Query.data?.overdue))}
                </span>
                {" overdue"}
              </>
            )}
          </p>
          <p className="text-xs" style={{ color: "#64748b" }}>
            Review corrective actions to prevent overdue items
          </p>
        </div>
        {capa2Query.data && (
          <div className="text-right shrink-0">
            <p className="text-xs" style={{ color: "#64748b" }}>
              Closure Rate
            </p>
            <p
              className="text-lg font-bold font-mono"
              style={{ color: capaClosureRate >= 80 ? C_GREEN : C_AMBER }}
            >
              {fmtNum(capaClosureRate, 0)}%
            </p>
          </div>
        )}
      </section>
    </div>
  );
}

// Suppress unused-import warnings for shadcn types pulled in transitively
const _unusedBadge = Badge;
const _unusedCard = Card;
const _unusedCardContent = CardContent;
const _unusedCardHeader = CardHeader;
const _unusedCardTitle = CardTitle;
void _unusedBadge;
void _unusedCard;
void _unusedCardContent;
void _unusedCardHeader;
void _unusedCardTitle;
