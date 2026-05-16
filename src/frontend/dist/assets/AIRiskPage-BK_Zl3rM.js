import { a as createLucideIcon, u as useBackend, d as useAuth, g as useNavigate, h as useQueryClient, r as reactExports, f as useQuery, i as useMutation, j as jsxRuntimeExports, al as Brain, B as Button, T as TriangleAlert } from "./index-KlJ1Xkuh.js";
import { B as Badge } from "./badge-9gf8k1SD.js";
import { C as Card, a as CardHeader, b as CardTitle, c as CardContent } from "./card-G8esgozQ.js";
import { S as Skeleton } from "./skeleton-BD1qWQ8I.js";
import { R as RefreshCw } from "./refresh-cw-lIVh7Ceb.js";
import { S as ShieldAlert } from "./shield-alert-C5iAlGox.js";
import { T as TrendingUp } from "./trending-up-CAvmj4MV.js";
import { Z as Zap } from "./zap-n6AJy9mg.js";
import { T as TrendingDown } from "./trending-down-CpFOXsjD.js";
import { R as ResponsiveContainer, T as Tooltip, U as ReferenceLine, B as Bar, C as Cell } from "./generateCategoricalChart-DRXsXmjl.js";
import { L as LineChart, C as CartesianGrid, a as Line } from "./LineChart-BFOsffuX.js";
import { X as XAxis, Y as YAxis, B as BarChart } from "./BarChart-B8tcd6V2.js";
import { S as ShieldCheck } from "./shield-check-CrpLyen4.js";
import { C as ChevronRight } from "./chevron-right-DIz5FQTE.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$1 = [
  ["path", { d: "M12 8V4H8", key: "hb8ula" }],
  ["rect", { width: "16", height: "12", x: "4", y: "8", rx: "2", key: "enze0r" }],
  ["path", { d: "M2 14h2", key: "vft8re" }],
  ["path", { d: "M20 14h2", key: "4cs60a" }],
  ["path", { d: "M15 13v2", key: "1xurst" }],
  ["path", { d: "M9 13v2", key: "rq6x2g" }]
];
const Bot = createLucideIcon("bot", __iconNode$1);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  [
    "path",
    {
      d: "M14.536 21.686a.5.5 0 0 0 .937-.024l6.5-19a.496.496 0 0 0-.635-.635l-19 6.5a.5.5 0 0 0-.024.937l7.93 3.18a2 2 0 0 1 1.112 1.11z",
      key: "1ffxy3"
    }
  ],
  ["path", { d: "m21.854 2.147-10.94 10.939", key: "12cjpa" }]
];
const Send = createLucideIcon("send", __iconNode);
const RISK_COLORS = {
  Low: "#22c55e",
  Medium: "#f59e0b",
  High: "#f97316",
  Critical: "#ef4444"
};
const RISK_BG = {
  Low: "bg-emerald-500/10 border-emerald-500/30 text-emerald-400",
  Medium: "bg-amber-500/10 border-amber-500/30 text-amber-400",
  High: "bg-orange-500/10 border-orange-500/30 text-orange-400",
  Critical: "bg-red-500/10 border-red-500/30 text-red-400"
};
const TOOLTIP_STYLE = {
  background: "oklch(0.16 0.01 260)",
  border: "1px solid oklch(0.22 0.01 260)",
  borderRadius: 8,
  color: "oklch(0.92 0.01 260)",
  fontSize: 12
};
const RISK_FACTORS = [
  { key: "nearMissCount", label: "Near Miss", weight: 30, icon: TriangleAlert },
  {
    key: "unsafeObsCount",
    label: "Unsafe Observations",
    weight: 25,
    icon: ShieldAlert
  },
  { key: "trainingGapCount", label: "Training Gaps", weight: 25, icon: Brain },
  {
    key: "overdueCAPACount",
    label: "Overdue CAPAs",
    weight: 10,
    icon: TrendingUp
  },
  {
    key: "openHighCriticalIncidents",
    label: "Open High/Critical Incidents",
    weight: 10,
    icon: Zap
  }
];
const EXAMPLE_QUESTIONS = [
  "What is the highest risk department this month?",
  "How many overdue CAPAs are there?",
  "What is the current overall risk score?",
  "Which training gaps are contributing most to risk?"
];
const MODULE_ROUTES = {
  training: "/training",
  incident: "/incidents",
  capa: "/incidents",
  observation: "/incidents",
  ptw: "/ptw",
  audit: "/audit"
};
function getRiskLevel(score) {
  if (score <= 40) return "Low";
  if (score <= 60) return "Medium";
  if (score <= 80) return "High";
  return "Critical";
}
function getRiskColor(score) {
  return RISK_COLORS[getRiskLevel(score)];
}
function getModuleRoute(recommendation) {
  const lower = recommendation.toLowerCase();
  for (const [key, route] of Object.entries(MODULE_ROUTES)) {
    if (lower.includes(key)) return route;
  }
  return "/dashboard";
}
function fmtTimestamp(ts) {
  if (!ts) return "Never";
  const ms = Number(ts) / 1e6;
  return new Date(ms).toLocaleString();
}
function RiskGauge({ score, level }) {
  const clampedScore = Math.max(0, Math.min(100, score));
  const radius = 80;
  const cx = 110;
  const cy = 110;
  const startAngle = -225;
  const totalDeg = 270;
  const angleDeg = startAngle + clampedScore / 100 * totalDeg;
  const toRad = (d) => d * Math.PI / 180;
  const arcPath = (start, end, r) => {
    const s = {
      x: cx + r * Math.cos(toRad(start)),
      y: cy + r * Math.sin(toRad(start))
    };
    const e = {
      x: cx + r * Math.cos(toRad(end)),
      y: cy + r * Math.sin(toRad(end))
    };
    const large = end - start > 180 ? 1 : 0;
    return `M ${s.x} ${s.y} A ${r} ${r} 0 ${large} 1 ${e.x} ${e.y}`;
  };
  const needleX = cx + (radius - 8) * Math.cos(toRad(angleDeg));
  const needleY = cy + (radius - 8) * Math.sin(toRad(angleDeg));
  const color = RISK_COLORS[level];
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "svg",
    {
      viewBox: "0 0 220 160",
      className: "w-full max-w-[260px] mx-auto",
      role: "img",
      "aria-label": `Risk score: ${score}`,
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "path",
          {
            d: arcPath(-225, 45, radius),
            fill: "none",
            stroke: "oklch(0.22 0.01 260)",
            strokeWidth: 14,
            strokeLinecap: "round"
          }
        ),
        clampedScore > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx(
          "path",
          {
            d: arcPath(
              -225,
              startAngle + clampedScore / 100 * totalDeg,
              radius
            ),
            fill: "none",
            stroke: color,
            strokeWidth: 14,
            strokeLinecap: "round",
            style: { filter: `drop-shadow(0 0 6px ${color}80)` }
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "circle",
          {
            cx: needleX,
            cy: needleY,
            r: 6,
            fill: color,
            style: { filter: `drop-shadow(0 0 4px ${color})` }
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "text",
          {
            x: cx,
            y: cy + 8,
            textAnchor: "middle",
            fontSize: 36,
            fontWeight: 700,
            fill: color,
            fontFamily: "monospace",
            children: clampedScore
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "text",
          {
            x: cx,
            y: cy + 28,
            textAnchor: "middle",
            fontSize: 13,
            fill: "oklch(0.65 0.01 260)",
            fontWeight: 500,
            children: "/ 100"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "text",
          {
            x: 24,
            y: 148,
            fontSize: 9,
            fill: RISK_COLORS.Low,
            textAnchor: "middle",
            children: "Low"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "text",
          {
            x: 73,
            y: 100,
            fontSize: 9,
            fill: RISK_COLORS.Medium,
            textAnchor: "middle",
            children: "Med"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "text",
          {
            x: 147,
            y: 100,
            fontSize: 9,
            fill: RISK_COLORS.High,
            textAnchor: "middle",
            children: "High"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "text",
          {
            x: 196,
            y: 148,
            fontSize: 9,
            fill: RISK_COLORS.Critical,
            textAnchor: "middle",
            children: "Crit"
          }
        )
      ]
    }
  );
}
function FactorBar({
  label,
  weight,
  rawValue,
  maxValue
}) {
  const pct = maxValue > 0 ? Math.min(100, rawValue / maxValue * 100) : 0;
  const contribution = pct / 100 * weight;
  const color = contribution > weight * 0.7 ? RISK_COLORS.High : contribution > weight * 0.4 ? RISK_COLORS.Medium : RISK_COLORS.Low;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between text-xs", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground font-medium", children: label }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-foreground font-mono", children: rawValue }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-muted-foreground/60", children: [
          "(",
          weight,
          "% weight)"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-mono font-semibold", style: { color }, children: [
          contribution.toFixed(1),
          " pts"
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-2 rounded-full bg-muted/40 overflow-hidden", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
      "div",
      {
        className: "h-full rounded-full transition-all duration-700",
        style: {
          width: `${pct}%`,
          background: color,
          boxShadow: `0 0 6px ${color}60`
        }
      }
    ) })
  ] });
}
function AIRiskPage() {
  const { actor, token, isReady } = useBackend();
  const { user } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const chatEndRef = reactExports.useRef(null);
  const [chatInput, setChatInput] = reactExports.useState("");
  const [chatMessages, setChatMessages] = reactExports.useState([
    {
      id: 0,
      role: "assistant",
      text: "Hello! I can answer questions about your site's safety risk profile. Try asking about departments, overdue items, or current risk scores."
    }
  ]);
  const [msgId, setMsgId] = reactExports.useState(1);
  const [chatLoading, setChatLoading] = reactExports.useState(false);
  const scoreQuery = useQuery({
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
    staleTime: 55e3
  });
  const trendQuery = useQuery({
    queryKey: ["riskTrend"],
    queryFn: async () => {
      if (!actor || !token) return Promise.reject(new Error("Not ready"));
      const res = await actor.getRiskScoreTrend(token);
      if (res.__kind__ === "err") throw new Error(res.err);
      return res.ok;
    },
    enabled: isReady && !!token,
    staleTime: 55e3
  });
  const deptQuery = useQuery({
    queryKey: ["deptRisk"],
    queryFn: async () => {
      if (!actor || !token) return Promise.reject(new Error("Not ready"));
      const res = await actor.getDeptRiskBreakdown(token);
      if (res.__kind__ === "err") throw new Error(res.err);
      return res.ok;
    },
    enabled: isReady && !!token,
    staleTime: 55e3
  });
  const recsQuery = useQuery({
    queryKey: ["riskRecs"],
    queryFn: async () => {
      if (!actor || !token) return Promise.reject(new Error("Not ready"));
      const res = await actor.getRiskRecommendations(token);
      if (res.__kind__ === "err") throw new Error(res.err);
      return res.ok;
    },
    enabled: isReady && !!token,
    staleTime: 55e3
  });
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
    }
  });
  const sendMessage = reactExports.useCallback(
    async (question) => {
      if (!question.trim() || chatLoading || !actor || !token) return;
      const userMsg = {
        id: msgId,
        role: "user",
        text: question.trim()
      };
      setMsgId((n) => n + 1);
      setChatMessages((prev) => [...prev, userMsg]);
      setChatInput("");
      setChatLoading(true);
      setTimeout(
        () => {
          var _a;
          return (_a = chatEndRef.current) == null ? void 0 : _a.scrollIntoView({ behavior: "smooth" });
        },
        50
      );
      try {
        const res = await actor.answerRiskQuery(token, question.trim());
        const reply = res.__kind__ === "ok" ? res.ok : `Error: ${res.err}`;
        setChatMessages((prev) => [
          ...prev,
          { id: msgId + 1, role: "assistant", text: reply }
        ]);
        setMsgId((n) => n + 1);
      } catch (_e) {
        setChatMessages((prev) => [
          ...prev,
          {
            id: msgId + 1,
            role: "assistant",
            text: "Sorry, I couldn't process that question right now. Please try again."
          }
        ]);
        setMsgId((n) => n + 1);
      } finally {
        setChatLoading(false);
        setTimeout(
          () => {
            var _a;
            return (_a = chatEndRef.current) == null ? void 0 : _a.scrollIntoView({ behavior: "smooth" });
          },
          50
        );
      }
    },
    [chatLoading, actor, token, msgId]
  );
  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage(chatInput);
    }
  };
  const score = scoreQuery.data;
  const overallScore = score ? Number(score.overallScore) : 0;
  const riskLevel = score ? score.riskLevel : "Low";
  const riskColor = RISK_COLORS[riskLevel];
  const trendData = (trendQuery.data ?? []).map(([label, s]) => ({
    month: label,
    score: Number(s)
  }));
  const deptData = (deptQuery.data ?? []).map(([dept, s, level]) => ({
    department: dept.length > 14 ? `${dept.slice(0, 14)}…` : dept,
    fullName: dept,
    score: Number(s),
    level
  }));
  const recs = recsQuery.data ?? [];
  const topDrivers = recs.slice(0, 3);
  const actionCards = recs.slice(0, 5);
  const maxFactor = score ? Math.max(
    Number(score.nearMissCount),
    Number(score.unsafeObsCount),
    Number(score.trainingGapCount),
    Number(score.overdueCAPACount),
    Number(score.openHighCriticalIncidents),
    1
  ) : 1;
  const loading = scoreQuery.isLoading || !isReady;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6", "data-ocid": "ai-risk.page", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col sm:flex-row sm:items-center justify-between gap-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2.5 mb-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-1.5 rounded-md bg-primary/15", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Brain, { className: "w-5 h-5 text-primary" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-2xl font-bold text-foreground", children: "AI Risk Scoring" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "Predictive safety analytics — rule-based risk scoring from live data" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        Button,
        {
          type: "button",
          variant: "outline",
          size: "sm",
          className: "flex items-center gap-2 border-primary/30 text-primary hover:bg-primary/10",
          onClick: () => recalcMutation.mutate(),
          disabled: recalcMutation.isPending || !isReady,
          "data-ocid": "ai-risk.recalculate_button",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              RefreshCw,
              {
                className: `w-3.5 h-3.5 ${recalcMutation.isPending ? "animate-spin" : ""}`
              }
            ),
            recalcMutation.isPending ? "Calculating..." : "Recalculate Risk Score"
          ]
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-2 gap-5", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        Card,
        {
          className: "elevated-card border-border",
          style: { boxShadow: loading ? void 0 : `0 0 30px ${riskColor}18` },
          "data-ocid": "ai-risk.gauge.card",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { className: "pb-2", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardTitle, { className: "text-base font-semibold text-foreground flex items-center justify-between", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Overall Site Risk Score" }),
              !loading && score && /* @__PURE__ */ jsxRuntimeExports.jsx(
                Badge,
                {
                  className: `text-xs border ${RISK_BG[riskLevel]}`,
                  "data-ocid": "ai-risk.risk_level.badge",
                  children: riskLevel
                }
              )
            ] }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { className: "flex flex-col items-center gap-4", children: loading ? /* @__PURE__ */ jsxRuntimeExports.jsx(
              Skeleton,
              {
                className: "h-40 w-64",
                "data-ocid": "ai-risk.gauge.loading_state"
              }
            ) : scoreQuery.isError ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "div",
              {
                className: "flex flex-col items-center gap-2 py-6 text-muted-foreground",
                "data-ocid": "ai-risk.gauge.error_state",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(TriangleAlert, { className: "w-8 h-8 text-destructive" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm", children: "Failed to load risk score. Click Recalculate to generate one." })
                ]
              }
            ) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(RiskGauge, { score: overallScore, level: riskLevel }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center space-y-1", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm font-medium text-muted-foreground", children: [
                  "Last calculated:",
                  " ",
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-foreground font-mono text-xs", children: score ? fmtTimestamp(score.calculatedAt) : "—" })
                ] }),
                score && /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground/60", children: [
                  "by ",
                  score.calculatedBy
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-full grid grid-cols-4 gap-1 text-center", children: ["Low", "Medium", "High", "Critical"].map((lvl) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                "div",
                {
                  className: `py-1.5 rounded text-xs font-medium border ${riskLevel === lvl ? RISK_BG[lvl] : "bg-muted/20 border-border text-muted-foreground/50"}`,
                  children: lvl
                },
                lvl
              )) })
            ] }) })
          ]
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "elevated-card", "data-ocid": "ai-risk.factors.card", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(CardHeader, { className: "pb-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { className: "text-base font-semibold text-foreground", children: "Risk Score Breakdown" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: "Weighted contribution of each safety factor" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { className: "space-y-5", children: loading ? Array.from({ length: 5 }).map((_, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-3 w-36" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-3 w-20" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-2 w-full" })
        ] }, i)) : RISK_FACTORS.map(({ key, label, weight }) => /* @__PURE__ */ jsxRuntimeExports.jsx(
          FactorBar,
          {
            label,
            weight,
            rawValue: score ? Number(score[key]) : 0,
            maxValue: maxFactor
          },
          key
        )) })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 xl:grid-cols-2 gap-5", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "elevated-card", "data-ocid": "ai-risk.trend.card", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { className: "pb-2", children: /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { className: "text-base font-semibold text-foreground", children: "Risk Score Trend (6 Months)" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { children: trendQuery.isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx(
          Skeleton,
          {
            className: "h-52 w-full",
            "data-ocid": "ai-risk.trend.loading_state"
          }
        ) : trendQuery.isError ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: "flex items-center justify-center h-52 text-sm text-muted-foreground",
            "data-ocid": "ai-risk.trend.error_state",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(TriangleAlert, { className: "w-4 h-4 text-destructive mr-2" }),
              " ",
              "Failed to load trend data"
            ]
          }
        ) : trendData.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-center justify-center h-52 gap-2 text-muted-foreground", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(TrendingDown, { className: "w-6 h-6 opacity-40" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm", children: "No trend data yet. Recalculate to generate scores." })
        ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx(ResponsiveContainer, { width: "100%", height: 210, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
          LineChart,
          {
            data: trendData,
            margin: { top: 5, right: 10, left: -10, bottom: 5 },
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                CartesianGrid,
                {
                  strokeDasharray: "3 3",
                  stroke: "oklch(0.22 0.01 260)",
                  strokeOpacity: 0.6
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                XAxis,
                {
                  dataKey: "month",
                  tick: { fill: "oklch(0.65 0.01 260)", fontSize: 11 },
                  axisLine: false,
                  tickLine: false
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                YAxis,
                {
                  domain: [0, 100],
                  tick: { fill: "oklch(0.65 0.01 260)", fontSize: 11 },
                  axisLine: false,
                  tickLine: false
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Tooltip,
                {
                  contentStyle: TOOLTIP_STYLE,
                  formatter: (v) => [`${v}`, "Risk Score"]
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                ReferenceLine,
                {
                  y: 40,
                  stroke: RISK_COLORS.Low,
                  strokeDasharray: "4 2",
                  strokeOpacity: 0.5,
                  label: { value: "40", fill: RISK_COLORS.Low, fontSize: 9 }
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                ReferenceLine,
                {
                  y: 60,
                  stroke: RISK_COLORS.Medium,
                  strokeDasharray: "4 2",
                  strokeOpacity: 0.5,
                  label: {
                    value: "60",
                    fill: RISK_COLORS.Medium,
                    fontSize: 9
                  }
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                ReferenceLine,
                {
                  y: 80,
                  stroke: RISK_COLORS.High,
                  strokeDasharray: "4 2",
                  strokeOpacity: 0.5,
                  label: { value: "80", fill: RISK_COLORS.High, fontSize: 9 }
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Line,
                {
                  type: "monotone",
                  dataKey: "score",
                  strokeWidth: 2.5,
                  dot: (props) => {
                    const c = getRiskColor(props.payload.score);
                    return /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "circle",
                      {
                        cx: props.cx,
                        cy: props.cy,
                        r: 4,
                        fill: c,
                        stroke: "transparent"
                      },
                      `dot-${props.cx}`
                    );
                  },
                  activeDot: { r: 6 },
                  stroke: "oklch(0.68 0.18 145)",
                  name: "Risk Score"
                }
              )
            ]
          }
        ) }) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "elevated-card", "data-ocid": "ai-risk.dept.card", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { className: "pb-2", children: /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { className: "text-base font-semibold text-foreground", children: "Department Risk Breakdown" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { children: deptQuery.isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx(
          Skeleton,
          {
            className: "h-52 w-full",
            "data-ocid": "ai-risk.dept.loading_state"
          }
        ) : deptQuery.isError ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: "flex items-center justify-center h-52 text-sm text-muted-foreground",
            "data-ocid": "ai-risk.dept.error_state",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(TriangleAlert, { className: "w-4 h-4 text-destructive mr-2" }),
              " ",
              "Failed to load department data"
            ]
          }
        ) : deptData.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: "flex flex-col items-center justify-center h-52 gap-2 text-muted-foreground",
            "data-ocid": "ai-risk.dept.empty_state",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(ShieldCheck, { className: "w-6 h-6 opacity-40" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm", children: "No department risk data available." })
            ]
          }
        ) : /* @__PURE__ */ jsxRuntimeExports.jsx(ResponsiveContainer, { width: "100%", height: 210, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
          BarChart,
          {
            data: deptData,
            margin: { top: 5, right: 10, left: -10, bottom: 5 },
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                CartesianGrid,
                {
                  strokeDasharray: "3 3",
                  stroke: "oklch(0.22 0.01 260)",
                  strokeOpacity: 0.6,
                  vertical: false
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                XAxis,
                {
                  dataKey: "department",
                  tick: { fill: "oklch(0.65 0.01 260)", fontSize: 10 },
                  axisLine: false,
                  tickLine: false
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                YAxis,
                {
                  domain: [0, 100],
                  tick: { fill: "oklch(0.65 0.01 260)", fontSize: 11 },
                  axisLine: false,
                  tickLine: false
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Tooltip,
                {
                  contentStyle: TOOLTIP_STYLE,
                  formatter: (val, _n, props) => {
                    var _a, _b;
                    return [
                      `${val} (${((_a = props.payload) == null ? void 0 : _a.level) ?? ""})`,
                      ((_b = props.payload) == null ? void 0 : _b.fullName) ?? ""
                    ];
                  },
                  cursor: { fill: "oklch(0.35 0.01 260 / 0.3)" }
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Bar,
                {
                  dataKey: "score",
                  radius: [4, 4, 0, 0],
                  maxBarSize: 56,
                  name: "Risk Score",
                  children: deptData.map((entry, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                    Cell,
                    {
                      fill: RISK_COLORS[entry.level] ?? RISK_COLORS.Low
                    },
                    `cell-${i}`
                  ))
                }
              )
            ]
          }
        ) }) })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-2 gap-5", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3", "data-ocid": "ai-risk.drivers.section", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("h2", { className: "text-sm font-semibold text-foreground uppercase tracking-wider flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(ShieldAlert, { className: "w-4 h-4 text-destructive" }),
          "Top Risk Drivers"
        ] }),
        recsQuery.isLoading ? Array.from({ length: 3 }).map((_, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-20 w-full" }, i)) : topDrivers.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: "flex items-center gap-3 p-4 rounded-lg bg-primary/5 border border-primary/20",
            "data-ocid": "ai-risk.drivers.empty_state",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(ShieldCheck, { className: "w-5 h-5 text-primary shrink-0" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "No critical risk drivers identified. Good standing!" })
            ]
          }
        ) : topDrivers.map((rec, i) => {
          const sev = rec.severity;
          const validSev = RISK_COLORS[sev] ? sev : "Low";
          return /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              className: `flex items-start gap-3 p-4 rounded-lg border ${RISK_BG[validSev]} transition-smooth`,
              "data-ocid": `ai-risk.driver.item.${i + 1}`,
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-0.5 shrink-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx(TriangleAlert, { className: "w-4 h-4" }) }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0 space-y-1", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-semibold truncate", children: rec.driver }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      Badge,
                      {
                        className: `text-xs shrink-0 border ${RISK_BG[validSev]}`,
                        children: rec.severity
                      }
                    )
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs opacity-80 line-clamp-2", children: rec.recommendation })
                ] })
              ]
            },
            i
          );
        })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3", "data-ocid": "ai-risk.actions.section", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("h2", { className: "text-sm font-semibold text-foreground uppercase tracking-wider flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Zap, { className: "w-4 h-4 text-secondary" }),
          "Recommended Actions"
        ] }),
        recsQuery.isLoading ? Array.from({ length: 3 }).map((_, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-20 w-full" }, i)) : actionCards.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: "flex items-center gap-3 p-4 rounded-lg bg-muted/20 border border-border",
            "data-ocid": "ai-risk.actions.empty_state",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(ShieldCheck, { className: "w-5 h-5 text-primary shrink-0" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "No recommended actions at this time." })
            ]
          }
        ) : actionCards.map((rec, i) => {
          const route = getModuleRoute(rec.recommendation);
          const sev = rec.severity;
          const validSev = RISK_COLORS[sev] ? sev : "Low";
          return /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              className: "flex items-start gap-3 p-4 rounded-lg border border-border bg-card hover:border-primary/30 transition-smooth",
              "data-ocid": `ai-risk.action.item.${i + 1}`,
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "div",
                  {
                    className: "mt-0.5 p-1.5 rounded-md shrink-0",
                    style: { background: `${RISK_COLORS[validSev]}18` },
                    children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                      Brain,
                      {
                        className: "w-3.5 h-3.5",
                        style: { color: RISK_COLORS[validSev] }
                      }
                    )
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0 space-y-2", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground leading-relaxed", children: rec.recommendation }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs(
                    Button,
                    {
                      type: "button",
                      variant: "ghost",
                      size: "sm",
                      className: "h-6 px-2 text-xs text-primary hover:bg-primary/10 -ml-2",
                      onClick: () => navigate({ to: route }),
                      "data-ocid": `ai-risk.action.take_action.${i + 1}`,
                      children: [
                        "Take Action ",
                        /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronRight, { className: "w-3 h-3 ml-0.5" })
                      ]
                    }
                  )
                ] })
              ]
            },
            i
          );
        })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "elevated-card", "data-ocid": "ai-risk.chatbot.card", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { className: "pb-3 border-b border-border", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2.5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-1.5 rounded-md bg-primary/15", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Bot, { className: "w-4 h-4 text-primary" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { className: "text-base font-semibold text-foreground", children: "Safety AI Assistant" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mt-0.5", children: "Ask questions about your site's risk profile" })
        ] })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "p-0 flex flex-col", style: { height: 380 }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-wrap gap-1.5 p-3 border-b border-border/50 bg-muted/10", children: EXAMPLE_QUESTIONS.map((q) => /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            type: "button",
            onClick: () => sendMessage(q),
            className: "text-xs px-2.5 py-1 rounded-full border border-border bg-muted/30 text-muted-foreground hover:bg-primary/10 hover:text-primary hover:border-primary/30 transition-colors truncate max-w-[200px]",
            "data-ocid": "ai-risk.chatbot.example_button",
            disabled: chatLoading || !isReady,
            children: q
          },
          q
        )) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: "flex-1 overflow-y-auto p-4 space-y-3",
            role: "log",
            "aria-live": "polite",
            children: [
              chatMessages.map((msg) => {
                var _a, _b;
                return /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  "div",
                  {
                    className: `flex gap-2.5 ${msg.role === "user" ? "justify-end" : "justify-start"}`,
                    "data-ocid": `ai-risk.chat.msg.${msg.id}`,
                    children: [
                      msg.role === "assistant" && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-1.5 h-7 w-7 rounded-full bg-primary/15 shrink-0 flex items-center justify-center mt-0.5", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Bot, { className: "w-3.5 h-3.5 text-primary" }) }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "div",
                        {
                          className: `max-w-[75%] rounded-2xl px-3.5 py-2 text-sm leading-relaxed ${msg.role === "user" ? "bg-primary/20 text-foreground rounded-tr-sm border border-primary/20" : "bg-muted/40 text-foreground rounded-tl-sm border border-border"}`,
                          children: msg.text
                        }
                      ),
                      msg.role === "user" && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-1.5 h-7 w-7 rounded-full bg-muted shrink-0 flex items-center justify-center mt-0.5 text-xs font-bold text-muted-foreground", children: ((_b = (_a = user == null ? void 0 : user.name) == null ? void 0 : _a[0]) == null ? void 0 : _b.toUpperCase()) ?? "U" })
                    ]
                  },
                  msg.id
                );
              }),
              chatLoading && /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "div",
                {
                  className: "flex gap-2.5 justify-start",
                  "data-ocid": "ai-risk.chatbot.loading_state",
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-1.5 h-7 w-7 rounded-full bg-primary/15 shrink-0 flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Bot, { className: "w-3.5 h-3.5 text-primary" }) }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-muted/40 border border-border rounded-2xl rounded-tl-sm px-4 py-2.5 flex gap-1 items-center", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "span",
                        {
                          className: "w-1.5 h-1.5 rounded-full bg-primary/60 animate-bounce",
                          style: { animationDelay: "0ms" }
                        }
                      ),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "span",
                        {
                          className: "w-1.5 h-1.5 rounded-full bg-primary/60 animate-bounce",
                          style: { animationDelay: "150ms" }
                        }
                      ),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "span",
                        {
                          className: "w-1.5 h-1.5 rounded-full bg-primary/60 animate-bounce",
                          style: { animationDelay: "300ms" }
                        }
                      )
                    ] })
                  ]
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { ref: chatEndRef })
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2 p-3 border-t border-border bg-muted/10", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "input",
            {
              type: "text",
              value: chatInput,
              onChange: (e) => setChatInput(e.target.value),
              onKeyDown: handleKeyDown,
              placeholder: "Ask a question about site safety risk...",
              className: "flex-1 h-9 rounded-lg bg-muted/40 border border-input px-3 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-1 focus:ring-primary/50",
              disabled: chatLoading || !isReady,
              "data-ocid": "ai-risk.chatbot.input",
              "aria-label": "Chat input"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              type: "button",
              size: "sm",
              className: "h-9 px-3 bg-primary hover:bg-primary/80 text-primary-foreground",
              onClick: () => sendMessage(chatInput),
              disabled: !chatInput.trim() || chatLoading || !isReady,
              "data-ocid": "ai-risk.chatbot.send_button",
              "aria-label": "Send message",
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(Send, { className: "w-3.5 h-3.5" })
            }
          )
        ] })
      ] })
    ] })
  ] });
}
export {
  AIRiskPage as default
};
