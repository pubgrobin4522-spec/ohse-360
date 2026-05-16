import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import {
  AlertTriangle,
  Bot,
  Brain,
  ChevronRight,
  RefreshCw,
  Send,
  ShieldAlert,
  ShieldCheck,
  TrendingDown,
  TrendingUp,
  Zap,
} from "lucide-react";
import { useCallback, useRef, useState } from "react";
import type { KeyboardEvent } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { RiskScoreView } from "../backend";
import { useAuth } from "../hooks/useAuth";
import { useBackend } from "../hooks/useBackend";

// ─── Constants ────────────────────────────────────────────────────────────────

const RISK_COLORS = {
  Low: "#22c55e",
  Medium: "#f59e0b",
  High: "#f97316",
  Critical: "#ef4444",
};

const RISK_BG = {
  Low: "bg-emerald-500/10 border-emerald-500/30 text-emerald-400",
  Medium: "bg-amber-500/10 border-amber-500/30 text-amber-400",
  High: "bg-orange-500/10 border-orange-500/30 text-orange-400",
  Critical: "bg-red-500/10 border-red-500/30 text-red-400",
};

type RiskLevelKey = "Low" | "Medium" | "High" | "Critical";

const TOOLTIP_STYLE = {
  background: "oklch(0.16 0.01 260)",
  border: "1px solid oklch(0.22 0.01 260)",
  borderRadius: 8,
  color: "oklch(0.92 0.01 260)",
  fontSize: 12,
};

const RISK_FACTORS = [
  { key: "nearMissCount", label: "Near Miss", weight: 30, icon: AlertTriangle },
  {
    key: "unsafeObsCount",
    label: "Unsafe Observations",
    weight: 25,
    icon: ShieldAlert,
  },
  { key: "trainingGapCount", label: "Training Gaps", weight: 25, icon: Brain },
  {
    key: "overdueCAPACount",
    label: "Overdue CAPAs",
    weight: 10,
    icon: TrendingUp,
  },
  {
    key: "openHighCriticalIncidents",
    label: "Open High/Critical Incidents",
    weight: 10,
    icon: Zap,
  },
] as const;

const EXAMPLE_QUESTIONS = [
  "What is the highest risk department this month?",
  "How many overdue CAPAs are there?",
  "What is the current overall risk score?",
  "Which training gaps are contributing most to risk?",
];

const MODULE_ROUTES: Record<string, string> = {
  training: "/training",
  incident: "/incidents",
  capa: "/incidents",
  observation: "/incidents",
  ptw: "/ptw",
  audit: "/audit",
};

// ─── Helpers ─────────────────────────────────────────────────────────────────

function getRiskLevel(score: number): RiskLevelKey {
  if (score <= 40) return "Low";
  if (score <= 60) return "Medium";
  if (score <= 80) return "High";
  return "Critical";
}

function getRiskColor(score: number): string {
  return RISK_COLORS[getRiskLevel(score)];
}

function getModuleRoute(recommendation: string): string {
  const lower = recommendation.toLowerCase();
  for (const [key, route] of Object.entries(MODULE_ROUTES)) {
    if (lower.includes(key)) return route;
  }
  return "/dashboard";
}

function fmtTimestamp(ts: bigint): string {
  if (!ts) return "Never";
  const ms = Number(ts) / 1_000_000;
  return new Date(ms).toLocaleString();
}

// ─── Risk Gauge ──────────────────────────────────────────────────────────────

function RiskGauge({ score, level }: { score: number; level: RiskLevelKey }) {
  const clampedScore = Math.max(0, Math.min(100, score));
  // SVG arc gauge: 0 = left (-135deg), 100 = right (+135deg)
  const radius = 80;
  const cx = 110;
  const cy = 110;
  const startAngle = -225;
  const totalDeg = 270;
  const angleDeg = startAngle + (clampedScore / 100) * totalDeg;
  const toRad = (d: number) => (d * Math.PI) / 180;

  // Background arc path
  const arcPath = (start: number, end: number, r: number) => {
    const s = {
      x: cx + r * Math.cos(toRad(start)),
      y: cy + r * Math.sin(toRad(start)),
    };
    const e = {
      x: cx + r * Math.cos(toRad(end)),
      y: cy + r * Math.sin(toRad(end)),
    };
    const large = end - start > 180 ? 1 : 0;
    return `M ${s.x} ${s.y} A ${r} ${r} 0 ${large} 1 ${e.x} ${e.y}`;
  };

  const needleX = cx + (radius - 8) * Math.cos(toRad(angleDeg));
  const needleY = cy + (radius - 8) * Math.sin(toRad(angleDeg));

  const color = RISK_COLORS[level];

  return (
    <svg
      viewBox="0 0 220 160"
      className="w-full max-w-[260px] mx-auto"
      role="img"
      aria-label={`Risk score: ${score}`}
    >
      {/* Track */}
      <path
        d={arcPath(-225, 45, radius)}
        fill="none"
        stroke="oklch(0.22 0.01 260)"
        strokeWidth={14}
        strokeLinecap="round"
      />
      {/* Fill arc */}
      {clampedScore > 0 && (
        <path
          d={arcPath(
            -225,
            startAngle + (clampedScore / 100) * totalDeg,
            radius,
          )}
          fill="none"
          stroke={color}
          strokeWidth={14}
          strokeLinecap="round"
          style={{ filter: `drop-shadow(0 0 6px ${color}80)` }}
        />
      )}
      {/* Needle dot */}
      <circle
        cx={needleX}
        cy={needleY}
        r={6}
        fill={color}
        style={{ filter: `drop-shadow(0 0 4px ${color})` }}
      />
      {/* Center score */}
      <text
        x={cx}
        y={cy + 8}
        textAnchor="middle"
        fontSize={36}
        fontWeight={700}
        fill={color}
        fontFamily="monospace"
      >
        {clampedScore}
      </text>
      <text
        x={cx}
        y={cy + 28}
        textAnchor="middle"
        fontSize={13}
        fill="oklch(0.65 0.01 260)"
        fontWeight={500}
      >
        / 100
      </text>
      {/* Zone labels */}
      <text
        x={24}
        y={148}
        fontSize={9}
        fill={RISK_COLORS.Low}
        textAnchor="middle"
      >
        Low
      </text>
      <text
        x={73}
        y={100}
        fontSize={9}
        fill={RISK_COLORS.Medium}
        textAnchor="middle"
      >
        Med
      </text>
      <text
        x={147}
        y={100}
        fontSize={9}
        fill={RISK_COLORS.High}
        textAnchor="middle"
      >
        High
      </text>
      <text
        x={196}
        y={148}
        fontSize={9}
        fill={RISK_COLORS.Critical}
        textAnchor="middle"
      >
        Crit
      </text>
    </svg>
  );
}

// ─── Factor Bar ──────────────────────────────────────────────────────────────

function FactorBar({
  label,
  weight,
  rawValue,
  maxValue,
}: { label: string; weight: number; rawValue: number; maxValue: number }) {
  const pct = maxValue > 0 ? Math.min(100, (rawValue / maxValue) * 100) : 0;
  const contribution = (pct / 100) * weight;
  const color =
    contribution > weight * 0.7
      ? RISK_COLORS.High
      : contribution > weight * 0.4
        ? RISK_COLORS.Medium
        : RISK_COLORS.Low;
  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between text-xs">
        <span className="text-muted-foreground font-medium">{label}</span>
        <div className="flex items-center gap-2">
          <span className="text-foreground font-mono">{rawValue}</span>
          <span className="text-muted-foreground/60">({weight}% weight)</span>
          <span className="font-mono font-semibold" style={{ color }}>
            {contribution.toFixed(1)} pts
          </span>
        </div>
      </div>
      <div className="h-2 rounded-full bg-muted/40 overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-700"
          style={{
            width: `${pct}%`,
            background: color,
            boxShadow: `0 0 6px ${color}60`,
          }}
        />
      </div>
    </div>
  );
}

// ─── Chat Message ────────────────────────────────────────────────────────────

interface ChatMsg {
  id: number;
  role: "user" | "assistant";
  text: string;
}

// ─── AIRiskPage ───────────────────────────────────────────────────────────────

export default function AIRiskPage() {
  const { actor, token, isReady } = useBackend();
  const { user } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const chatEndRef = useRef<HTMLDivElement>(null);

  const [chatInput, setChatInput] = useState("");
  const [chatMessages, setChatMessages] = useState<ChatMsg[]>([
    {
      id: 0,
      role: "assistant",
      text: "Hello! I can answer questions about your site's safety risk profile. Try asking about departments, overdue items, or current risk scores.",
    },
  ]);
  const [msgId, setMsgId] = useState(1);
  const [chatLoading, setChatLoading] = useState(false);

  // ─── Queries ───────────────────────────────────────────────────────────

  const scoreQuery = useQuery<RiskScoreView>({
    queryKey: ["riskScore"],
    queryFn: async () => {
      if (!actor || !token) return Promise.reject(new Error("Not ready"));
      const history = await actor.getRiskScoreHistory(token);
      if (history.__kind__ === "err") throw new Error(history.err);
      const latest = history.ok[history.ok.length - 1];
      if (!latest) throw new Error("No score data");
      return latest;
    },
    enabled: isReady && !!token,
    staleTime: 55_000,
  });

  const trendQuery = useQuery<Array<[string, bigint]>>({
    queryKey: ["riskTrend"],
    queryFn: async () => {
      if (!actor || !token) return Promise.reject(new Error("Not ready"));
      const res = await actor.getRiskScoreTrend(token);
      if (res.__kind__ === "err") throw new Error(res.err);
      return res.ok;
    },
    enabled: isReady && !!token,
    staleTime: 55_000,
  });

  const deptQuery = useQuery<Array<[string, bigint, string]>>({
    queryKey: ["deptRisk"],
    queryFn: async () => {
      if (!actor || !token) return Promise.reject(new Error("Not ready"));
      const res = await actor.getDeptRiskBreakdown(token);
      if (res.__kind__ === "err") throw new Error(res.err);
      return res.ok;
    },
    enabled: isReady && !!token,
    staleTime: 55_000,
  });

  const recsQuery = useQuery<
    Array<{ driver: string; recommendation: string; severity: string }>
  >({
    queryKey: ["riskRecs"],
    queryFn: async () => {
      if (!actor || !token) return Promise.reject(new Error("Not ready"));
      const res = await actor.getRiskRecommendations(token);
      if (res.__kind__ === "err") throw new Error(res.err);
      return res.ok;
    },
    enabled: isReady && !!token,
    staleTime: 55_000,
  });

  // ─── Recalculate mutation ─────────────────────────────────────────────

  const recalcMutation = useMutation({
    mutationFn: async () => {
      if (!actor || !token) throw new Error("Not ready");
      const res = await actor.calculateRiskScore(token);
      if (res.__kind__ === "err") throw new Error(res.err);
      return res.ok;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["riskScore"] });
      queryClient.invalidateQueries({ queryKey: ["riskTrend"] });
      queryClient.invalidateQueries({ queryKey: ["deptRisk"] });
      queryClient.invalidateQueries({ queryKey: ["riskRecs"] });
    },
  });

  // ─── Chat handler ─────────────────────────────────────────────────────

  const sendMessage = useCallback(
    async (question: string) => {
      if (!question.trim() || chatLoading || !actor || !token) return;
      const userMsg: ChatMsg = {
        id: msgId,
        role: "user",
        text: question.trim(),
      };
      setMsgId((n) => n + 1);
      setChatMessages((prev) => [...prev, userMsg]);
      setChatInput("");
      setChatLoading(true);
      setTimeout(
        () => chatEndRef.current?.scrollIntoView({ behavior: "smooth" }),
        50,
      );
      try {
        const res = await actor.answerRiskQuery(token, question.trim());
        const reply = res.__kind__ === "ok" ? res.ok : `Error: ${res.err}`;
        setChatMessages((prev) => [
          ...prev,
          { id: msgId + 1, role: "assistant", text: reply },
        ]);
        setMsgId((n) => n + 1);
      } catch (_e) {
        setChatMessages((prev) => [
          ...prev,
          {
            id: msgId + 1,
            role: "assistant",
            text: "Sorry, I couldn't process that question right now. Please try again.",
          },
        ]);
        setMsgId((n) => n + 1);
      } finally {
        setChatLoading(false);
        setTimeout(
          () => chatEndRef.current?.scrollIntoView({ behavior: "smooth" }),
          50,
        );
      }
    },
    [chatLoading, actor, token, msgId],
  );

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage(chatInput);
    }
  };

  // ─── Derived data ─────────────────────────────────────────────────────

  const score = scoreQuery.data;
  const overallScore = score ? Number(score.overallScore) : 0;
  const riskLevel = score ? (score.riskLevel as RiskLevelKey) : "Low";
  const riskColor = RISK_COLORS[riskLevel];

  const trendData = (trendQuery.data ?? []).map(([label, s]) => ({
    month: label,
    score: Number(s),
  }));

  const deptData = (deptQuery.data ?? []).map(([dept, s, level]) => ({
    department: dept.length > 14 ? `${dept.slice(0, 14)}…` : dept,
    fullName: dept,
    score: Number(s),
    level: level as RiskLevelKey,
  }));

  const recs = recsQuery.data ?? [];
  const topDrivers = recs.slice(0, 3);
  const actionCards = recs.slice(0, 5);

  const maxFactor = score
    ? Math.max(
        Number(score.nearMissCount),
        Number(score.unsafeObsCount),
        Number(score.trainingGapCount),
        Number(score.overdueCAPACount),
        Number(score.openHighCriticalIncidents),
        1,
      )
    : 1;

  const loading = scoreQuery.isLoading || !isReady;

  // ─── Render ───────────────────────────────────────────────────────────

  return (
    <div className="space-y-6" data-ocid="ai-risk.page">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2.5 mb-1">
            <div className="p-1.5 rounded-md bg-primary/15">
              <Brain className="w-5 h-5 text-primary" />
            </div>
            <h1 className="text-2xl font-bold text-foreground">
              AI Risk Scoring
            </h1>
          </div>
          <p className="text-sm text-muted-foreground">
            Predictive safety analytics — rule-based risk scoring from live data
          </p>
        </div>
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="flex items-center gap-2 border-primary/30 text-primary hover:bg-primary/10"
          onClick={() => recalcMutation.mutate()}
          disabled={recalcMutation.isPending || !isReady}
          data-ocid="ai-risk.recalculate_button"
        >
          <RefreshCw
            className={`w-3.5 h-3.5 ${recalcMutation.isPending ? "animate-spin" : ""}`}
          />
          {recalcMutation.isPending
            ? "Calculating..."
            : "Recalculate Risk Score"}
        </Button>
      </div>

      {/* ── Row 1: Gauge + Factor Breakdown ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Risk Gauge Card */}
        <Card
          className="elevated-card border-border"
          style={{ boxShadow: loading ? undefined : `0 0 30px ${riskColor}18` }}
          data-ocid="ai-risk.gauge.card"
        >
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-semibold text-foreground flex items-center justify-between">
              <span>Overall Site Risk Score</span>
              {!loading && score && (
                <Badge
                  className={`text-xs border ${RISK_BG[riskLevel]}`}
                  data-ocid="ai-risk.risk_level.badge"
                >
                  {riskLevel}
                </Badge>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center gap-4">
            {loading ? (
              <Skeleton
                className="h-40 w-64"
                data-ocid="ai-risk.gauge.loading_state"
              />
            ) : scoreQuery.isError ? (
              <div
                className="flex flex-col items-center gap-2 py-6 text-muted-foreground"
                data-ocid="ai-risk.gauge.error_state"
              >
                <AlertTriangle className="w-8 h-8 text-destructive" />
                <p className="text-sm">
                  Failed to load risk score. Click Recalculate to generate one.
                </p>
              </div>
            ) : (
              <>
                <RiskGauge score={overallScore} level={riskLevel} />
                <div className="text-center space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">
                    Last calculated:{" "}
                    <span className="text-foreground font-mono text-xs">
                      {score ? fmtTimestamp(score.calculatedAt) : "—"}
                    </span>
                  </p>
                  {score && (
                    <p className="text-xs text-muted-foreground/60">
                      by {score.calculatedBy}
                    </p>
                  )}
                </div>
                {/* Risk level thresholds */}
                <div className="w-full grid grid-cols-4 gap-1 text-center">
                  {(
                    ["Low", "Medium", "High", "Critical"] as RiskLevelKey[]
                  ).map((lvl) => (
                    <div
                      key={lvl}
                      className={`py-1.5 rounded text-xs font-medium border ${riskLevel === lvl ? RISK_BG[lvl] : "bg-muted/20 border-border text-muted-foreground/50"}`}
                    >
                      {lvl}
                    </div>
                  ))}
                </div>
              </>
            )}
          </CardContent>
        </Card>

        {/* Risk Factor Breakdown */}
        <Card className="elevated-card" data-ocid="ai-risk.factors.card">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-semibold text-foreground">
              Risk Score Breakdown
            </CardTitle>
            <p className="text-xs text-muted-foreground">
              Weighted contribution of each safety factor
            </p>
          </CardHeader>
          <CardContent className="space-y-5">
            {loading
              ? Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="space-y-2">
                    <div className="flex justify-between">
                      <Skeleton className="h-3 w-36" />
                      <Skeleton className="h-3 w-20" />
                    </div>
                    <Skeleton className="h-2 w-full" />
                  </div>
                ))
              : RISK_FACTORS.map(({ key, label, weight }) => (
                  <FactorBar
                    key={key}
                    label={label}
                    weight={weight}
                    rawValue={
                      score
                        ? Number(score[key as keyof RiskScoreView] as bigint)
                        : 0
                    }
                    maxValue={maxFactor}
                  />
                ))}
          </CardContent>
        </Card>
      </div>

      {/* ── Row 2: Trend Chart + Dept Breakdown ── */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
        {/* Risk Score Trend */}
        <Card className="elevated-card" data-ocid="ai-risk.trend.card">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-semibold text-foreground">
              Risk Score Trend (6 Months)
            </CardTitle>
          </CardHeader>
          <CardContent>
            {trendQuery.isLoading ? (
              <Skeleton
                className="h-52 w-full"
                data-ocid="ai-risk.trend.loading_state"
              />
            ) : trendQuery.isError ? (
              <div
                className="flex items-center justify-center h-52 text-sm text-muted-foreground"
                data-ocid="ai-risk.trend.error_state"
              >
                <AlertTriangle className="w-4 h-4 text-destructive mr-2" />{" "}
                Failed to load trend data
              </div>
            ) : trendData.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-52 gap-2 text-muted-foreground">
                <TrendingDown className="w-6 h-6 opacity-40" />
                <p className="text-sm">
                  No trend data yet. Recalculate to generate scores.
                </p>
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={210}>
                <LineChart
                  data={trendData}
                  margin={{ top: 5, right: 10, left: -10, bottom: 5 }}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="oklch(0.22 0.01 260)"
                    strokeOpacity={0.6}
                  />
                  <XAxis
                    dataKey="month"
                    tick={{ fill: "oklch(0.65 0.01 260)", fontSize: 11 }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    domain={[0, 100]}
                    tick={{ fill: "oklch(0.65 0.01 260)", fontSize: 11 }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <Tooltip
                    contentStyle={TOOLTIP_STYLE}
                    formatter={(v: number) => [`${v}`, "Risk Score"]}
                  />
                  <ReferenceLine
                    y={40}
                    stroke={RISK_COLORS.Low}
                    strokeDasharray="4 2"
                    strokeOpacity={0.5}
                    label={{ value: "40", fill: RISK_COLORS.Low, fontSize: 9 }}
                  />
                  <ReferenceLine
                    y={60}
                    stroke={RISK_COLORS.Medium}
                    strokeDasharray="4 2"
                    strokeOpacity={0.5}
                    label={{
                      value: "60",
                      fill: RISK_COLORS.Medium,
                      fontSize: 9,
                    }}
                  />
                  <ReferenceLine
                    y={80}
                    stroke={RISK_COLORS.High}
                    strokeDasharray="4 2"
                    strokeOpacity={0.5}
                    label={{ value: "80", fill: RISK_COLORS.High, fontSize: 9 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="score"
                    strokeWidth={2.5}
                    dot={(props: {
                      cx: number;
                      cy: number;
                      payload: { score: number };
                    }) => {
                      const c = getRiskColor(props.payload.score);
                      return (
                        <circle
                          key={`dot-${props.cx}`}
                          cx={props.cx}
                          cy={props.cy}
                          r={4}
                          fill={c}
                          stroke="transparent"
                        />
                      );
                    }}
                    activeDot={{ r: 6 }}
                    stroke="oklch(0.68 0.18 145)"
                    name="Risk Score"
                  />
                </LineChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        {/* Department Risk Breakdown */}
        <Card className="elevated-card" data-ocid="ai-risk.dept.card">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-semibold text-foreground">
              Department Risk Breakdown
            </CardTitle>
          </CardHeader>
          <CardContent>
            {deptQuery.isLoading ? (
              <Skeleton
                className="h-52 w-full"
                data-ocid="ai-risk.dept.loading_state"
              />
            ) : deptQuery.isError ? (
              <div
                className="flex items-center justify-center h-52 text-sm text-muted-foreground"
                data-ocid="ai-risk.dept.error_state"
              >
                <AlertTriangle className="w-4 h-4 text-destructive mr-2" />{" "}
                Failed to load department data
              </div>
            ) : deptData.length === 0 ? (
              <div
                className="flex flex-col items-center justify-center h-52 gap-2 text-muted-foreground"
                data-ocid="ai-risk.dept.empty_state"
              >
                <ShieldCheck className="w-6 h-6 opacity-40" />
                <p className="text-sm">No department risk data available.</p>
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={210}>
                <BarChart
                  data={deptData}
                  margin={{ top: 5, right: 10, left: -10, bottom: 5 }}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="oklch(0.22 0.01 260)"
                    strokeOpacity={0.6}
                    vertical={false}
                  />
                  <XAxis
                    dataKey="department"
                    tick={{ fill: "oklch(0.65 0.01 260)", fontSize: 10 }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    domain={[0, 100]}
                    tick={{ fill: "oklch(0.65 0.01 260)", fontSize: 11 }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <Tooltip
                    contentStyle={TOOLTIP_STYLE}
                    formatter={(
                      val: number,
                      _n: string,
                      props: {
                        payload?: { fullName?: string; level?: string };
                      },
                    ) => [
                      `${val} (${props.payload?.level ?? ""})`,
                      props.payload?.fullName ?? "",
                    ]}
                    cursor={{ fill: "oklch(0.35 0.01 260 / 0.3)" }}
                  />
                  <Bar
                    dataKey="score"
                    radius={[4, 4, 0, 0]}
                    maxBarSize={56}
                    name="Risk Score"
                  >
                    {deptData.map((entry, i) => (
                      <Cell
                        key={`cell-${i}`}
                        fill={RISK_COLORS[entry.level] ?? RISK_COLORS.Low}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>
      </div>

      {/* ── Row 3: Top Risk Drivers + Action Cards ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Top 3 Risk Driver Alert Cards */}
        <div className="space-y-3" data-ocid="ai-risk.drivers.section">
          <h2 className="text-sm font-semibold text-foreground uppercase tracking-wider flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-destructive" />
            Top Risk Drivers
          </h2>
          {recsQuery.isLoading ? (
            Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-20 w-full" />
            ))
          ) : topDrivers.length === 0 ? (
            <div
              className="flex items-center gap-3 p-4 rounded-lg bg-primary/5 border border-primary/20"
              data-ocid="ai-risk.drivers.empty_state"
            >
              <ShieldCheck className="w-5 h-5 text-primary shrink-0" />
              <p className="text-sm text-muted-foreground">
                No critical risk drivers identified. Good standing!
              </p>
            </div>
          ) : (
            topDrivers.map((rec, i) => {
              const sev = rec.severity as RiskLevelKey;
              const validSev: RiskLevelKey = RISK_COLORS[sev] ? sev : "Low";
              return (
                <div
                  key={i}
                  className={`flex items-start gap-3 p-4 rounded-lg border ${RISK_BG[validSev]} transition-smooth`}
                  data-ocid={`ai-risk.driver.item.${i + 1}`}
                >
                  <div className="mt-0.5 shrink-0">
                    <AlertTriangle className="w-4 h-4" />
                  </div>
                  <div className="flex-1 min-w-0 space-y-1">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-semibold truncate">
                        {rec.driver}
                      </p>
                      <Badge
                        className={`text-xs shrink-0 border ${RISK_BG[validSev]}`}
                      >
                        {rec.severity}
                      </Badge>
                    </div>
                    <p className="text-xs opacity-80 line-clamp-2">
                      {rec.recommendation}
                    </p>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Predictive Action Cards */}
        <div className="space-y-3" data-ocid="ai-risk.actions.section">
          <h2 className="text-sm font-semibold text-foreground uppercase tracking-wider flex items-center gap-2">
            <Zap className="w-4 h-4 text-secondary" />
            Recommended Actions
          </h2>
          {recsQuery.isLoading ? (
            Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-20 w-full" />
            ))
          ) : actionCards.length === 0 ? (
            <div
              className="flex items-center gap-3 p-4 rounded-lg bg-muted/20 border border-border"
              data-ocid="ai-risk.actions.empty_state"
            >
              <ShieldCheck className="w-5 h-5 text-primary shrink-0" />
              <p className="text-sm text-muted-foreground">
                No recommended actions at this time.
              </p>
            </div>
          ) : (
            actionCards.map((rec, i) => {
              const route = getModuleRoute(rec.recommendation);
              const sev = rec.severity as RiskLevelKey;
              const validSev: RiskLevelKey = RISK_COLORS[sev] ? sev : "Low";
              return (
                <div
                  key={i}
                  className="flex items-start gap-3 p-4 rounded-lg border border-border bg-card hover:border-primary/30 transition-smooth"
                  data-ocid={`ai-risk.action.item.${i + 1}`}
                >
                  <div
                    className="mt-0.5 p-1.5 rounded-md shrink-0"
                    style={{ background: `${RISK_COLORS[validSev]}18` }}
                  >
                    <Brain
                      className="w-3.5 h-3.5"
                      style={{ color: RISK_COLORS[validSev] }}
                    />
                  </div>
                  <div className="flex-1 min-w-0 space-y-2">
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      {rec.recommendation}
                    </p>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="h-6 px-2 text-xs text-primary hover:bg-primary/10 -ml-2"
                      onClick={() => navigate({ to: route as "/dashboard" })}
                      data-ocid={`ai-risk.action.take_action.${i + 1}`}
                    >
                      Take Action <ChevronRight className="w-3 h-3 ml-0.5" />
                    </Button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* ── Row 4: AI Chatbot ── */}
      <Card className="elevated-card" data-ocid="ai-risk.chatbot.card">
        <CardHeader className="pb-3 border-b border-border">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 rounded-md bg-primary/15">
              <Bot className="w-4 h-4 text-primary" />
            </div>
            <div>
              <CardTitle className="text-base font-semibold text-foreground">
                Safety AI Assistant
              </CardTitle>
              <p className="text-xs text-muted-foreground mt-0.5">
                Ask questions about your site's risk profile
              </p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0 flex flex-col" style={{ height: 380 }}>
          {/* Example questions */}
          <div className="flex flex-wrap gap-1.5 p-3 border-b border-border/50 bg-muted/10">
            {EXAMPLE_QUESTIONS.map((q) => (
              <button
                key={q}
                type="button"
                onClick={() => sendMessage(q)}
                className="text-xs px-2.5 py-1 rounded-full border border-border bg-muted/30 text-muted-foreground hover:bg-primary/10 hover:text-primary hover:border-primary/30 transition-colors truncate max-w-[200px]"
                data-ocid="ai-risk.chatbot.example_button"
                disabled={chatLoading || !isReady}
              >
                {q}
              </button>
            ))}
          </div>

          {/* Chat messages */}
          <div
            className="flex-1 overflow-y-auto p-4 space-y-3"
            role="log"
            aria-live="polite"
          >
            {chatMessages.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-2.5 ${
                  msg.role === "user" ? "justify-end" : "justify-start"
                }`}
                data-ocid={`ai-risk.chat.msg.${msg.id}`}
              >
                {msg.role === "assistant" && (
                  <div className="p-1.5 h-7 w-7 rounded-full bg-primary/15 shrink-0 flex items-center justify-center mt-0.5">
                    <Bot className="w-3.5 h-3.5 text-primary" />
                  </div>
                )}
                <div
                  className={`max-w-[75%] rounded-2xl px-3.5 py-2 text-sm leading-relaxed ${
                    msg.role === "user"
                      ? "bg-primary/20 text-foreground rounded-tr-sm border border-primary/20"
                      : "bg-muted/40 text-foreground rounded-tl-sm border border-border"
                  }`}
                >
                  {msg.text}
                </div>
                {msg.role === "user" && (
                  <div className="p-1.5 h-7 w-7 rounded-full bg-muted shrink-0 flex items-center justify-center mt-0.5 text-xs font-bold text-muted-foreground">
                    {user?.name?.[0]?.toUpperCase() ?? "U"}
                  </div>
                )}
              </div>
            ))}
            {chatLoading && (
              <div
                className="flex gap-2.5 justify-start"
                data-ocid="ai-risk.chatbot.loading_state"
              >
                <div className="p-1.5 h-7 w-7 rounded-full bg-primary/15 shrink-0 flex items-center justify-center">
                  <Bot className="w-3.5 h-3.5 text-primary" />
                </div>
                <div className="bg-muted/40 border border-border rounded-2xl rounded-tl-sm px-4 py-2.5 flex gap-1 items-center">
                  <span
                    className="w-1.5 h-1.5 rounded-full bg-primary/60 animate-bounce"
                    style={{ animationDelay: "0ms" }}
                  />
                  <span
                    className="w-1.5 h-1.5 rounded-full bg-primary/60 animate-bounce"
                    style={{ animationDelay: "150ms" }}
                  />
                  <span
                    className="w-1.5 h-1.5 rounded-full bg-primary/60 animate-bounce"
                    style={{ animationDelay: "300ms" }}
                  />
                </div>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          {/* Input */}
          <div className="flex gap-2 p-3 border-t border-border bg-muted/10">
            <input
              type="text"
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask a question about site safety risk..."
              className="flex-1 h-9 rounded-lg bg-muted/40 border border-input px-3 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-1 focus:ring-primary/50"
              disabled={chatLoading || !isReady}
              data-ocid="ai-risk.chatbot.input"
              aria-label="Chat input"
            />
            <Button
              type="button"
              size="sm"
              className="h-9 px-3 bg-primary hover:bg-primary/80 text-primary-foreground"
              onClick={() => sendMessage(chatInput)}
              disabled={!chatInput.trim() || chatLoading || !isReady}
              data-ocid="ai-risk.chatbot.send_button"
              aria-label="Send message"
            >
              <Send className="w-3.5 h-3.5" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
