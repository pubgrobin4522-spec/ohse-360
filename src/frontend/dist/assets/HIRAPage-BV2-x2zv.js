import { a as createLucideIcon, u as useBackend, d as useAuth, r as reactExports, f as useQuery, j as jsxRuntimeExports, T as TriangleAlert, B as Button, m as Label, a2 as HIRAStatus, h as useQueryClient, i as useMutation, n as ue, I as Input, a3 as HazardType } from "./index-o5KNRZJC.js";
import { D as Dialog, a as DialogContent, b as DialogHeader, c as DialogTitle } from "./dialog-BC0tVdjJ.js";
import { S as Select, a as SelectTrigger, b as SelectValue, c as SelectContent, d as SelectItem } from "./select-DLpeTQN2.js";
import { S as Separator } from "./separator-DZbs1p3t.js";
import { S as Skeleton } from "./skeleton-FWJuhcbn.js";
import { T as Textarea } from "./textarea-DwLBGk5G.js";
import { C as CircleCheck } from "./circle-check-BdjlexTo.js";
import { T as TrendingUp } from "./trending-up-BAOuh3As.js";
import { P as Plus, X } from "./x-CXE19MnU.js";
import { F as Funnel } from "./funnel-zCB_4DbY.js";
import { C as ChevronRight } from "./chevron-right-CrBkjx2r.js";
import { L as LoaderCircle } from "./loader-circle-BLgF8ams.js";
import { S as ShieldAlert } from "./shield-alert-C2RCAJyr.js";
import { C as CircleX } from "./circle-x-CUsDDx9A.js";
import { C as Clock } from "./clock-DrVeXQTh.js";
import "./index-BgKcp2pS.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  ["path", { d: "M14 2v4a2 2 0 0 0 2 2h4", key: "tnqrlb" }],
  [
    "path",
    { d: "M4.268 21a2 2 0 0 0 1.727 1H18a2 2 0 0 0 2-2V7l-5-5H6a2 2 0 0 0-2 2v3", key: "ms7g94" }
  ],
  ["path", { d: "m9 18-1.5-1.5", key: "1j6qii" }],
  ["circle", { cx: "5", cy: "14", r: "3", key: "ufru5t" }]
];
const FileSearch = createLucideIcon("file-search", __iconNode);
function calcRiskScore(likelihood, severity) {
  return likelihood * severity;
}
function scoreToLevel(score) {
  if (score <= 4) return "Low";
  if (score <= 9) return "Medium";
  if (score <= 16) return "High";
  return "Critical";
}
const RISK_COLORS = {
  Low: "bg-primary/20 text-primary border-primary/40",
  Medium: "bg-secondary/20 text-secondary border-secondary/40",
  High: "bg-orange-500/20 text-orange-400 border-orange-500/40",
  Critical: "bg-destructive/20 text-destructive border-destructive/40"
};
const MATRIX_CELL_COLOR = (score) => {
  if (score <= 4) return "bg-primary/30 border-primary/40";
  if (score <= 9) return "bg-secondary/30 border-secondary/40";
  if (score <= 16) return "bg-orange-500/30 border-orange-500/40";
  return "bg-destructive/30 border-destructive/40";
};
const HAZARD_TYPE_LABELS = {
  Physical: "Physical",
  Chemical: "Chemical",
  Biological: "Biological",
  Ergonomic: "Ergonomic",
  Psychological: "Psychological",
  Environmental: "Environmental"
};
const STATUS_LABELS = {
  Draft: "Draft",
  UnderReview: "Under Review",
  Approved: "Approved",
  Expired: "Expired"
};
function topRiskLevel(hira) {
  if (!hira.hazards.length) return "Low";
  const maxScore = Math.max(...hira.hazards.map((h) => Number(h.riskScore)));
  return scoreToLevel(maxScore);
}
function isOverdueReview(hira) {
  if (hira.status !== "Approved") return false;
  return new Date(hira.reviewDate) < /* @__PURE__ */ new Date();
}
function RiskBadge({ level }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "span",
    {
      className: `inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold border ${RISK_COLORS[level]}`,
      children: level
    }
  );
}
function StatusBadge({ status }) {
  const variants = {
    Draft: "bg-muted/50 text-muted-foreground border-border",
    UnderReview: "bg-secondary/20 text-secondary border-secondary/40",
    Approved: "bg-primary/20 text-primary border-primary/40",
    Expired: "bg-destructive/20 text-destructive border-destructive/40"
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "span",
    {
      className: `inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold border ${variants[status]}`,
      children: [
        status === "Approved" && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "w-1.5 h-1.5 rounded-full bg-primary" }),
        STATUS_LABELS[status]
      ]
    }
  );
}
function RiskMatrix({ plotted }) {
  const plottedSet = new Set(plotted.map(([l, s]) => `${l}-${s}`));
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2", children: "5×5 Risk Matrix" }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "overflow-x-auto", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "border-collapse text-xs", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "w-12 text-muted-foreground text-right pr-1 pb-1 font-normal" }),
          [1, 2, 3, 4, 5].map((s) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "th",
            {
              className: "w-10 h-6 text-center text-muted-foreground font-semibold pb-1",
              children: [
                "S",
                s
              ]
            },
            s
          ))
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("tbody", { children: [5, 4, 3, 2, 1].map((l) => /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("td", { className: "pr-1 text-right text-muted-foreground font-semibold", children: [
            "L",
            l
          ] }),
          [1, 2, 3, 4, 5].map((s) => {
            const score = l * s;
            const hasPlot = plottedSet.has(`${l}-${s}`);
            return /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "td",
              {
                className: `w-10 h-9 text-center border ${MATRIX_CELL_COLOR(score)} text-foreground font-mono relative`,
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] opacity-70", children: score }),
                  hasPlot && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "absolute inset-0 flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "w-3 h-3 rounded-full bg-foreground/80 ring-1 ring-foreground" }) })
                ]
              },
              s
            );
          })
        ] }, l)) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-wrap gap-3 mt-3", children: [
        ["Low (1-4)", "bg-primary/30 border-primary/40"],
        ["Medium (5-9)", "bg-secondary/30 border-secondary/40"],
        ["High (10-16)", "bg-orange-500/30 border-orange-500/40"],
        ["Critical (17-25)", "bg-destructive/30 border-destructive/40"]
      ].map(([label, cls]) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `w-3 h-3 rounded border ${cls}` }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground", children: label })
      ] }, label)) })
    ] })
  ] });
}
function HIRAApprovalStepper({ hira }) {
  const step = Number(hira.approvalStep);
  const steps = [
    {
      label: "HOD Review",
      role: "Head of Department",
      done: step > 1 || hira.status === "Approved" && step >= 1,
      active: hira.status === "UnderReview" && step === 1,
      at: hira.hodAt,
      remarks: hira.hodRemarks
    },
    {
      label: "Area In Charge Validation",
      role: "Area In Charge",
      done: step > 2 || hira.status === "Approved" && step >= 2,
      active: hira.status === "UnderReview" && step === 2,
      at: hira.aicAt,
      remarks: hira.aicRemarks
    },
    {
      label: "Safety Officer Approval",
      role: "Safety Officer",
      done: hira.status === "Approved",
      active: hira.status === "UnderReview" && step === 3,
      at: hira.soAt,
      remarks: hira.soRemarks
    }
  ];
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-0", children: steps.map((s, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-3", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-center", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "div",
        {
          className: `w-8 h-8 rounded-full flex items-center justify-center shrink-0 border-2 ${s.done ? "bg-primary/20 border-primary" : s.active ? "bg-secondary/20 border-secondary animate-pulse" : "bg-muted/30 border-border"}`,
          children: s.done ? /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "w-4 h-4 text-primary" }) : s.active ? /* @__PURE__ */ jsxRuntimeExports.jsx(Clock, { className: "w-4 h-4 text-secondary" }) : /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-bold text-muted-foreground", children: i + 1 })
        }
      ),
      i < 2 && /* @__PURE__ */ jsxRuntimeExports.jsx(
        "div",
        {
          className: `w-0.5 h-8 mt-0.5 ${s.done ? "bg-primary/40" : "bg-border"}`
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "pb-6 min-w-0 flex-1", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "p",
        {
          className: `text-sm font-semibold ${s.done ? "text-primary" : s.active ? "text-secondary" : "text-muted-foreground"}`,
          children: s.label
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: s.role }),
      (s.at ?? s.remarks) && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-1.5 rounded-lg bg-muted/20 border border-border p-2.5 space-y-1", children: [
        s.at && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: new Date(Number(s.at / 1000000n)).toLocaleString() }),
        s.remarks && /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-foreground/80 italic", children: [
          "“",
          s.remarks,
          "”"
        ] })
      ] })
    ] })
  ] }, s.label)) });
}
function AddHazardDialog({ hiraNumber, onClose }) {
  const { actor, token } = useBackend();
  const qc = useQueryClient();
  const [hazardDesc, setHazardDesc] = reactExports.useState("");
  const [hazardType, setHazardType] = reactExports.useState(HazardType.Physical);
  const [likelihood, setLikelihood] = reactExports.useState(1);
  const [severity, setSeverity] = reactExports.useState(1);
  const [existingControls, setExistingControls] = reactExports.useState("");
  const [additionalControls, setAdditionalControls] = reactExports.useState("");
  const [residualLikelihood, setResidualLikelihood] = reactExports.useState(1);
  const [residualSeverity, setResidualSeverity] = reactExports.useState(1);
  const [errors, setErrors] = reactExports.useState({});
  const riskScore = calcRiskScore(likelihood, severity);
  const riskLevel = scoreToLevel(riskScore);
  const residualScore = calcRiskScore(residualLikelihood, residualSeverity);
  const mutation = useMutation({
    mutationFn: async () => {
      if (!actor || !token) throw new Error("Not authenticated");
      const rowId = `HAZARD-${Date.now()}`;
      const res = await actor.addHazardRow(
        token,
        hiraNumber,
        rowId,
        hazardDesc.trim(),
        hazardType,
        BigInt(likelihood),
        BigInt(severity),
        existingControls.trim(),
        additionalControls.trim(),
        BigInt(residualScore),
        null
      );
      if (res.__kind__ === "err") throw new Error(res.err);
    },
    onSuccess: () => {
      ue.success("Hazard row added.");
      qc.invalidateQueries({ queryKey: ["hiras"] });
      qc.invalidateQueries({ queryKey: ["hira", hiraNumber] });
      onClose();
    },
    onError: (e) => ue.error(e.message)
  });
  function validate() {
    const e = {};
    if (!hazardDesc.trim()) e.hazardDesc = "Hazard description is required.";
    if (!existingControls.trim())
      e.existingControls = "Existing controls are required.";
    setErrors(e);
    return Object.keys(e).length === 0;
  }
  function handleSubmit() {
    if (!validate()) return;
    mutation.mutate();
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open: true, onOpenChange: (v) => !v && onClose(), children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { className: "max-w-xl max-h-[90vh] overflow-y-auto bg-card border-border", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(DialogHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogTitle, { className: "flex items-center gap-2 text-foreground", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(ShieldAlert, { className: "w-5 h-5 text-secondary" }),
      "Add Hazard Row"
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4 pt-1", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-foreground", children: "Hazard Description *" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Textarea,
          {
            value: hazardDesc,
            onChange: (e) => setHazardDesc(e.target.value),
            placeholder: "Describe the hazard...",
            rows: 2,
            className: "bg-background border-input resize-none",
            "data-ocid": "hira.hazard.description.textarea"
          }
        ),
        errors.hazardDesc && /* @__PURE__ */ jsxRuntimeExports.jsx(
          "p",
          {
            className: "text-xs text-destructive",
            "data-ocid": "hira.hazard.description.field_error",
            children: errors.hazardDesc
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-foreground", children: "Hazard Type *" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Select,
          {
            value: hazardType,
            onValueChange: (v) => setHazardType(v),
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                SelectTrigger,
                {
                  className: "bg-background border-input",
                  "data-ocid": "hira.hazard.type.select",
                  children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, {})
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(SelectContent, { className: "bg-card border-border", children: Object.values(HazardType).map((t) => /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: t, children: HAZARD_TYPE_LABELS[t] }, t)) })
            ]
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-foreground", children: "Likelihood (1–5) *" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Input,
            {
              type: "number",
              min: 1,
              max: 5,
              value: likelihood,
              onChange: (e) => setLikelihood(
                Math.min(5, Math.max(1, Number(e.target.value)))
              ),
              className: "bg-background border-input",
              "data-ocid": "hira.hazard.likelihood.input"
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-foreground", children: "Severity (1–5) *" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Input,
            {
              type: "number",
              min: 1,
              max: 5,
              value: severity,
              onChange: (e) => setSeverity(Math.min(5, Math.max(1, Number(e.target.value)))),
              className: "bg-background border-input",
              "data-ocid": "hira.hazard.severity.input"
            }
          )
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 rounded-lg border border-border bg-muted/10 p-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: "Risk Score" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-2xl font-bold text-foreground", children: riskScore })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(RiskBadge, { level: riskLevel })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-foreground", children: "Existing Controls *" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Textarea,
          {
            value: existingControls,
            onChange: (e) => setExistingControls(e.target.value),
            placeholder: "Current controls already in place...",
            rows: 2,
            className: "bg-background border-input resize-none",
            "data-ocid": "hira.hazard.existing_controls.textarea"
          }
        ),
        errors.existingControls && /* @__PURE__ */ jsxRuntimeExports.jsx(
          "p",
          {
            className: "text-xs text-destructive",
            "data-ocid": "hira.hazard.existing_controls.field_error",
            children: errors.existingControls
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-foreground", children: "Additional Control Measures" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Textarea,
          {
            value: additionalControls,
            onChange: (e) => setAdditionalControls(e.target.value),
            placeholder: "Additional measures to reduce risk...",
            rows: 2,
            className: "bg-background border-input resize-none",
            "data-ocid": "hira.hazard.additional_controls.textarea"
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-lg border border-border bg-muted/10 p-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-semibold text-muted-foreground mb-2", children: "Residual Risk (after controls)" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs text-muted-foreground", children: "Residual Likelihood" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Input,
              {
                type: "number",
                min: 1,
                max: 5,
                value: residualLikelihood,
                onChange: (e) => setResidualLikelihood(
                  Math.min(5, Math.max(1, Number(e.target.value)))
                ),
                className: "bg-background border-input h-8 text-sm",
                "data-ocid": "hira.hazard.residual_likelihood.input"
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs text-muted-foreground", children: "Residual Severity" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Input,
              {
                type: "number",
                min: 1,
                max: 5,
                value: residualSeverity,
                onChange: (e) => setResidualSeverity(
                  Math.min(5, Math.max(1, Number(e.target.value)))
                ),
                className: "bg-background border-input h-8 text-sm",
                "data-ocid": "hira.hazard.residual_severity.input"
              }
            )
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mt-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground", children: "Residual Score:" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm font-bold text-foreground", children: residualScore }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(RiskBadge, { level: scoreToLevel(residualScore) })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Separator, { className: "bg-border" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-end gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Button,
          {
            type: "button",
            variant: "outline",
            onClick: onClose,
            className: "border-border",
            "data-ocid": "hira.hazard.cancel_button",
            children: "Cancel"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Button,
          {
            type: "button",
            disabled: mutation.isPending,
            onClick: handleSubmit,
            className: "safety-gradient-primary text-primary-foreground",
            "data-ocid": "hira.hazard.submit_button",
            children: [
              mutation.isPending && /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "w-4 h-4 animate-spin mr-2" }),
              "Add Hazard"
            ]
          }
        )
      ] })
    ] })
  ] }) });
}
function CreateHIRADialog({
  open,
  onClose
}) {
  const { actor, token, isReady } = useBackend();
  const qc = useQueryClient();
  const defaultReviewDate = reactExports.useMemo(() => {
    const d = /* @__PURE__ */ new Date();
    d.setFullYear(d.getFullYear() + 1);
    return d.toISOString().slice(0, 10);
  }, []);
  const [taskDescription, setTaskDescription] = reactExports.useState("");
  const [location, setLocation] = reactExports.useState("");
  const [area, setArea] = reactExports.useState("");
  const [department, setDepartment] = reactExports.useState("");
  const [reviewDate, setReviewDate] = reactExports.useState(defaultReviewDate);
  const [errors, setErrors] = reactExports.useState({});
  const mutation = useMutation({
    mutationFn: async (input) => {
      if (!actor || !token) throw new Error("Not authenticated");
      const res = await actor.createHIRA(token, input);
      if (res.__kind__ === "err") throw new Error(res.err);
      return res.ok;
    },
    onSuccess: (hiraNumber) => {
      ue.success(`HIRA ${hiraNumber} created.`);
      qc.invalidateQueries({ queryKey: ["hiras"] });
      handleClose();
    },
    onError: (e) => ue.error(e.message)
  });
  function handleClose() {
    setTaskDescription("");
    setLocation("");
    setArea("");
    setDepartment("");
    setReviewDate(defaultReviewDate);
    setErrors({});
    onClose();
  }
  function validate() {
    const e = {};
    if (!taskDescription.trim())
      e.taskDescription = "Task description is required.";
    if (!location.trim()) e.location = "Location is required.";
    if (!area.trim()) e.area = "Area is required.";
    if (!department.trim()) e.department = "Department is required.";
    if (!reviewDate) e.reviewDate = "Review date is required.";
    setErrors(e);
    return Object.keys(e).length === 0;
  }
  function handleCreate() {
    if (!validate()) return;
    mutation.mutate({
      taskDescription: taskDescription.trim(),
      location: location.trim(),
      area: area.trim(),
      department: department.trim(),
      reviewDate,
      responsibleEmpId: void 0
    });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open, onOpenChange: (v) => !v && handleClose(), children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { className: "max-w-lg max-h-[90vh] overflow-y-auto bg-card border-border", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(DialogHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogTitle, { className: "flex items-center gap-2 text-foreground", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(FileSearch, { className: "w-5 h-5 text-primary" }),
      "New HIRA Record"
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4 pt-1", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-foreground", children: "Task / Activity Description *" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Textarea,
          {
            value: taskDescription,
            onChange: (e) => setTaskDescription(e.target.value),
            placeholder: "Describe the task or activity being assessed...",
            rows: 3,
            className: "bg-background border-input resize-none",
            "data-ocid": "hira.create.task_description.textarea"
          }
        ),
        errors.taskDescription && /* @__PURE__ */ jsxRuntimeExports.jsx(
          "p",
          {
            className: "text-xs text-destructive",
            "data-ocid": "hira.create.task_description.field_error",
            children: errors.taskDescription
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-foreground", children: "Location *" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Input,
            {
              value: location,
              onChange: (e) => setLocation(e.target.value),
              placeholder: "e.g. Building A",
              className: "bg-background border-input",
              "data-ocid": "hira.create.location.input"
            }
          ),
          errors.location && /* @__PURE__ */ jsxRuntimeExports.jsx(
            "p",
            {
              className: "text-xs text-destructive",
              "data-ocid": "hira.create.location.field_error",
              children: errors.location
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-foreground", children: "Area *" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Input,
            {
              value: area,
              onChange: (e) => setArea(e.target.value),
              placeholder: "e.g. Workshop Zone 3",
              className: "bg-background border-input",
              "data-ocid": "hira.create.area.input"
            }
          ),
          errors.area && /* @__PURE__ */ jsxRuntimeExports.jsx(
            "p",
            {
              className: "text-xs text-destructive",
              "data-ocid": "hira.create.area.field_error",
              children: errors.area
            }
          )
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-foreground", children: "Department *" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Input,
          {
            value: department,
            onChange: (e) => setDepartment(e.target.value),
            placeholder: "e.g. Maintenance",
            className: "bg-background border-input",
            "data-ocid": "hira.create.department.input"
          }
        ),
        errors.department && /* @__PURE__ */ jsxRuntimeExports.jsx(
          "p",
          {
            className: "text-xs text-destructive",
            "data-ocid": "hira.create.department.field_error",
            children: errors.department
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-foreground", children: "Review Date *" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Input,
          {
            type: "date",
            value: reviewDate,
            onChange: (e) => setReviewDate(e.target.value),
            className: "bg-background border-input",
            "data-ocid": "hira.create.review_date.input"
          }
        ),
        errors.reviewDate && /* @__PURE__ */ jsxRuntimeExports.jsx(
          "p",
          {
            className: "text-xs text-destructive",
            "data-ocid": "hira.create.review_date.field_error",
            children: errors.reviewDate
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Separator, { className: "bg-border" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-end gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Button,
          {
            type: "button",
            variant: "outline",
            onClick: handleClose,
            className: "border-border",
            "data-ocid": "hira.create.cancel_button",
            children: "Cancel"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Button,
          {
            type: "button",
            disabled: !isReady || mutation.isPending,
            onClick: handleCreate,
            className: "safety-gradient-primary text-primary-foreground",
            "data-ocid": "hira.create.submit_button",
            children: [
              mutation.isPending && /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "w-4 h-4 animate-spin mr-2" }),
              "Create HIRA"
            ]
          }
        )
      ] })
    ] })
  ] }) });
}
function HIRADetailDialog({
  hiraNumber,
  userRole,
  userEmpId,
  onClose
}) {
  const { actor, token } = useBackend();
  const qc = useQueryClient();
  const [remarks, setRemarks] = reactExports.useState("");
  const [remarkErr, setRemarkErr] = reactExports.useState("");
  const [showAddHazard, setShowAddHazard] = reactExports.useState(false);
  const { data: hira, isLoading } = useQuery({
    queryKey: ["hira", hiraNumber],
    queryFn: async () => {
      if (!actor || !token) throw new Error("Not authenticated");
      const res = await actor.getHIRA(token, hiraNumber);
      if (res.__kind__ === "err") throw new Error(res.err);
      return res.ok;
    },
    enabled: !!actor && !!token
  });
  const step = hira ? Number(hira.approvalStep) : 0;
  const canAct = (hira == null ? void 0 : hira.status) === "UnderReview" && (userRole === "HOD" && step === 1 || userRole === "AreaInCharge" && step === 2 || userRole === "SafetyOfficer" && step === 3 || userRole === "SystemAdmin");
  const canSubmit = (hira == null ? void 0 : hira.status) === "Draft" && (hira.createdBy === userEmpId || userRole === "SafetyOfficer" || userRole === "HOD" || userRole === "SystemAdmin");
  const canAddHazard = (hira == null ? void 0 : hira.status) === "Draft";
  const submitMutation = useMutation({
    mutationFn: async () => {
      if (!actor || !token) throw new Error("Not authenticated");
      const res = await actor.submitHIRAForApproval(token, hiraNumber);
      if (res.__kind__ === "err") throw new Error(res.err);
    },
    onSuccess: () => {
      ue.success(`${hiraNumber} submitted for approval.`);
      qc.invalidateQueries({ queryKey: ["hiras"] });
      qc.invalidateQueries({ queryKey: ["hira", hiraNumber] });
    },
    onError: (e) => ue.error(e.message)
  });
  const actionMutation = useMutation({
    mutationFn: async ({ approve, rem }) => {
      if (!actor || !token) throw new Error("Not authenticated");
      const res = await actor.actOnHIRA(token, hiraNumber, approve, rem);
      if (res.__kind__ === "err") throw new Error(res.err);
    },
    onSuccess: (_data, vars) => {
      ue.success(
        vars.approve ? `${hiraNumber} approved.` : `${hiraNumber} rejected.`
      );
      qc.invalidateQueries({ queryKey: ["hiras"] });
      qc.invalidateQueries({ queryKey: ["hira", hiraNumber] });
    },
    onError: (e) => ue.error(e.message)
  });
  function handleAct(approve) {
    if (!approve && !remarks.trim()) {
      setRemarkErr("Rejection remarks are required.");
      return;
    }
    setRemarkErr("");
    actionMutation.mutate({ approve, rem: remarks });
  }
  const plottedCoords = hira ? hira.hazards.map((h) => [Number(h.likelihood), Number(h.severity)]) : [];
  const isBusy = submitMutation.isPending || actionMutation.isPending;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open: true, onOpenChange: (v) => !v && onClose(), children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { className: "max-w-3xl max-h-[92vh] overflow-y-auto bg-card border-border", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(DialogHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogTitle, { className: "flex items-center justify-between gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-2 text-foreground", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(FileSearch, { className: "w-5 h-5 text-primary" }),
          hiraNumber
        ] }),
        hira && /* @__PURE__ */ jsxRuntimeExports.jsx(StatusBadge, { status: hira.status })
      ] }) }),
      isLoading || !hira ? /* @__PURE__ */ jsxRuntimeExports.jsx(
        "div",
        {
          className: "space-y-3 py-4",
          "data-ocid": "hira.detail.loading_state",
          children: Array.from({ length: 4 }).map((_, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-10 w-full bg-muted/30" }, i))
        }
      ) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-2 sm:grid-cols-3 gap-3", children: [
          ["Task Description", hira.taskDescription],
          ["Location", hira.location],
          ["Area", hira.area],
          ["Department", hira.department],
          ["Review Date", hira.reviewDate],
          [
            "Created",
            new Date(
              Number(hira.createdAt / 1000000n)
            ).toLocaleDateString()
          ]
        ].map(([label, value]) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: "rounded-lg border border-border bg-muted/10 p-2.5",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mb-0.5", children: label }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-medium text-foreground break-words", children: value })
            ]
          },
          label
        )) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mb-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm font-semibold text-foreground flex items-center gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(ShieldAlert, { className: "w-4 h-4 text-secondary" }),
              "Hazard Rows (",
              hira.hazards.length,
              ")"
            ] }),
            canAddHazard && /* @__PURE__ */ jsxRuntimeExports.jsxs(
              Button,
              {
                type: "button",
                size: "sm",
                onClick: () => setShowAddHazard(true),
                className: "safety-gradient-primary text-primary-foreground gap-1 text-xs h-7",
                "data-ocid": "hira.add_hazard_button",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "w-3 h-3" }),
                  "Add Hazard"
                ]
              }
            )
          ] }),
          hira.hazards.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              className: "flex flex-col items-center justify-center py-8 border border-dashed border-border rounded-xl",
              "data-ocid": "hira.hazards.empty_state",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(ShieldAlert, { className: "w-8 h-8 text-muted-foreground mb-2" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "No hazard rows yet" }),
                canAddHazard && /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  Button,
                  {
                    type: "button",
                    size: "sm",
                    variant: "outline",
                    onClick: () => setShowAddHazard(true),
                    className: "mt-3 border-border gap-1",
                    "data-ocid": "hira.hazards.empty_state.add_button",
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "w-3 h-3" }),
                      "Add First Hazard"
                    ]
                  }
                )
              ]
            }
          ) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "overflow-x-auto rounded-xl border border-border", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "w-full text-xs", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { children: /* @__PURE__ */ jsxRuntimeExports.jsx("tr", { className: "border-b border-border bg-muted/20", children: [
              "#",
              "Hazard",
              "Type",
              "L",
              "S",
              "Score",
              "Level",
              "Existing Controls",
              "Additional Controls",
              "Residual"
            ].map((h) => /* @__PURE__ */ jsxRuntimeExports.jsx(
              "th",
              {
                className: "px-2 py-2 text-left font-semibold text-muted-foreground uppercase tracking-wide whitespace-nowrap",
                children: h
              },
              h
            )) }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("tbody", { children: hira.hazards.map((row, idx) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "tr",
              {
                className: "border-b border-border/50 hover:bg-muted/10",
                "data-ocid": `hira.hazard.item.${idx + 1}`,
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-2 py-2 text-muted-foreground", children: idx + 1 }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-2 py-2 text-foreground max-w-[140px]", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "span",
                    {
                      className: "block truncate",
                      title: row.hazardDescription,
                      children: row.hazardDescription
                    }
                  ) }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-2 py-2 text-muted-foreground whitespace-nowrap", children: row.hazardType }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-2 py-2 text-foreground text-center font-mono", children: String(row.likelihood) }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-2 py-2 text-foreground text-center font-mono", children: String(row.severity) }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-2 py-2 text-foreground text-center font-bold font-mono", children: String(row.riskScore) }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-2 py-2", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                    RiskBadge,
                    {
                      level: row.riskLevel
                    }
                  ) }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-2 py-2 text-muted-foreground max-w-[120px]", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "span",
                    {
                      className: "block truncate",
                      title: row.existingControls,
                      children: row.existingControls || "—"
                    }
                  ) }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-2 py-2 text-muted-foreground max-w-[120px]", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "span",
                    {
                      className: "block truncate",
                      title: row.additionalControls,
                      children: row.additionalControls || "—"
                    }
                  ) }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-2 py-2 text-foreground font-mono text-center", children: String(row.residualRiskScore) })
                ]
              },
              row.hazardId
            )) })
          ] }) })
        ] }),
        hira.hazards.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "elevated-card rounded-xl p-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx(RiskMatrix, { plotted: plottedCoords }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Separator, { className: "bg-border" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm font-semibold text-foreground mb-4 flex items-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "w-4 h-4 text-primary" }),
            "Approval Chain"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(HIRAApprovalStepper, { hira })
        ] }),
        canSubmit && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Separator, { className: "bg-border" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "div",
            {
              className: "flex justify-end",
              "data-ocid": "hira.submit_panel",
              children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
                Button,
                {
                  type: "button",
                  disabled: isBusy || hira.hazards.length === 0,
                  onClick: () => submitMutation.mutate(),
                  className: "safety-gradient-primary text-primary-foreground",
                  "data-ocid": "hira.submit_for_approval_button",
                  children: [
                    submitMutation.isPending && /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "w-4 h-4 animate-spin mr-2" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronRight, { className: "w-4 h-4 mr-1" }),
                    "Submit for Approval"
                  ]
                }
              )
            }
          ),
          hira.hazards.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-destructive text-right -mt-3", children: "Add at least one hazard row before submitting." })
        ] }),
        canAct && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Separator, { className: "bg-border" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              className: "space-y-3 rounded-lg border border-secondary/40 bg-secondary/5 p-4",
              "data-ocid": "hira.approval_panel",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm font-semibold text-secondary", children: [
                  "Your Action Required — Step ",
                  step,
                  " of 3"
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-foreground", children: "Remarks" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    Textarea,
                    {
                      value: remarks,
                      onChange: (e) => setRemarks(e.target.value),
                      placeholder: "Add review remarks (required for rejection)…",
                      rows: 2,
                      className: "bg-background border-input resize-none",
                      "data-ocid": "hira.approval.remarks.textarea"
                    }
                  ),
                  remarkErr && /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "p",
                    {
                      className: "text-xs text-destructive",
                      "data-ocid": "hira.approval.remarks.field_error",
                      children: remarkErr
                    }
                  )
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-3 justify-end", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs(
                    Button,
                    {
                      type: "button",
                      variant: "outline",
                      disabled: isBusy,
                      onClick: () => handleAct(false),
                      className: "border-destructive/40 text-destructive hover:bg-destructive/10",
                      "data-ocid": "hira.reject_button",
                      children: [
                        actionMutation.isPending && /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "w-4 h-4 animate-spin mr-2" }),
                        /* @__PURE__ */ jsxRuntimeExports.jsx(CircleX, { className: "w-4 h-4 mr-1" }),
                        "Reject"
                      ]
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs(
                    Button,
                    {
                      type: "button",
                      disabled: isBusy,
                      onClick: () => handleAct(true),
                      className: "safety-gradient-primary text-primary-foreground",
                      "data-ocid": "hira.approve_button",
                      children: [
                        actionMutation.isPending && /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "w-4 h-4 animate-spin mr-2" }),
                        /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "w-4 h-4 mr-1" }),
                        "Approve"
                      ]
                    }
                  )
                ] })
              ]
            }
          )
        ] })
      ] })
    ] }) }),
    showAddHazard && /* @__PURE__ */ jsxRuntimeExports.jsx(
      AddHazardDialog,
      {
        hiraNumber,
        onClose: () => setShowAddHazard(false)
      }
    )
  ] });
}
function HIRAPage() {
  const { actor, token, isReady } = useBackend();
  const { user } = useAuth();
  const userRole = (user == null ? void 0 : user.role) ?? "Employee";
  const userEmpId = (user == null ? void 0 : user.employeeId) ?? 0n;
  const [filterStatus, setFilterStatus] = reactExports.useState("ALL");
  const [filterDept, setFilterDept] = reactExports.useState("");
  const [filterRisk, setFilterRisk] = reactExports.useState("ALL");
  const [showCreate, setShowCreate] = reactExports.useState(false);
  const [selectedHIRA, setSelectedHIRA] = reactExports.useState(null);
  const { data: hiras, isLoading } = useQuery({
    queryKey: ["hiras"],
    queryFn: async () => {
      if (!actor || !token) return [];
      const res = await actor.listHIRAs(token);
      if (res.__kind__ === "err") throw new Error(res.err);
      return res.ok;
    },
    enabled: isReady
  });
  const stats = reactExports.useMemo(() => {
    if (!hiras)
      return { total: 0, approved: 0, highCritical: 0, overdueReview: 0 };
    return {
      total: hiras.length,
      approved: hiras.filter((h) => h.status === "Approved").length,
      highCritical: hiras.filter((h) => {
        const lvl = topRiskLevel(h);
        return lvl === "High" || lvl === "Critical";
      }).length,
      overdueReview: hiras.filter(isOverdueReview).length
    };
  }, [hiras]);
  const departments = reactExports.useMemo(() => {
    if (!hiras) return [];
    return Array.from(new Set(hiras.map((h) => h.department))).sort();
  }, [hiras]);
  const filtered = reactExports.useMemo(() => {
    if (!hiras) return [];
    return hiras.filter((h) => {
      if (filterStatus !== "ALL" && h.status !== filterStatus) return false;
      if (filterDept && h.department !== filterDept) return false;
      if (filterRisk !== "ALL" && topRiskLevel(h) !== filterRisk) return false;
      return true;
    });
  }, [hiras, filterStatus, filterDept, filterRisk]);
  const canCreate = userRole === "SafetyOfficer" || userRole === "HOD" || userRole === "SystemAdmin";
  const hasFilters = filterStatus !== "ALL" || !!filterDept || filterRisk !== "ALL";
  const statCards = [
    {
      label: "Total HIRAs",
      value: stats.total,
      icon: /* @__PURE__ */ jsxRuntimeExports.jsx(FileSearch, { className: "w-5 h-5" }),
      color: "text-primary",
      bg: "bg-primary/10 border-primary/20"
    },
    {
      label: "Approved",
      value: stats.approved,
      icon: /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "w-5 h-5" }),
      color: "text-primary",
      bg: "bg-primary/10 border-primary/20"
    },
    {
      label: "High / Critical Risk",
      value: stats.highCritical,
      icon: /* @__PURE__ */ jsxRuntimeExports.jsx(TriangleAlert, { className: "w-5 h-5" }),
      color: "text-destructive",
      bg: "bg-destructive/10 border-destructive/20"
    },
    {
      label: "Overdue Reviews",
      value: stats.overdueReview,
      icon: /* @__PURE__ */ jsxRuntimeExports.jsx(TrendingUp, { className: "w-5 h-5" }),
      color: "text-secondary",
      bg: "bg-secondary/10 border-secondary/20"
    }
  ];
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6", "data-ocid": "hira.page", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col sm:flex-row sm:items-center justify-between gap-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("h1", { className: "section-header flex items-center gap-2 mb-0", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(FileSearch, { className: "w-6 h-6 text-primary" }),
          "HIRA"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground mt-0.5", children: "Hazard Identification & Risk Assessment" })
      ] }),
      canCreate && /* @__PURE__ */ jsxRuntimeExports.jsxs(
        Button,
        {
          type: "button",
          onClick: () => setShowCreate(true),
          className: "safety-gradient-primary text-primary-foreground gap-2",
          "data-ocid": "hira.create.open_modal_button",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "w-4 h-4" }),
            "New HIRA"
          ]
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-2 lg:grid-cols-4 gap-4", children: statCards.map((s) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: `elevated-card rounded-xl p-4 border ${s.bg}`,
        "data-ocid": `hira.stat.${s.label.toLowerCase().replace(/[ /]/g, "_")}`,
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `${s.color} mb-2`, children: s.icon }),
          isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-8 w-16 bg-muted/30 mb-1" }) : /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: `text-2xl font-bold ${s.color}`, children: s.value }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: s.label })
        ]
      },
      s.label
    )) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "elevated-card rounded-xl p-4 flex flex-wrap gap-3 items-end",
        "data-ocid": "hira.filters_panel",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Funnel, { className: "w-4 h-4 text-muted-foreground self-center" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1 min-w-[160px]", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs text-muted-foreground", children: "Status" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              Select,
              {
                value: filterStatus,
                onValueChange: (v) => setFilterStatus(v),
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    SelectTrigger,
                    {
                      className: "h-8 text-sm bg-background border-input",
                      "data-ocid": "hira.filter.status.select",
                      children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, {})
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectContent, { className: "bg-card border-border", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "ALL", children: "All Statuses" }),
                    Object.values(HIRAStatus).map((s) => /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: s, children: STATUS_LABELS[s] }, s))
                  ] })
                ]
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1 min-w-[160px]", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs text-muted-foreground", children: "Risk Level" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              Select,
              {
                value: filterRisk,
                onValueChange: (v) => setFilterRisk(v),
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    SelectTrigger,
                    {
                      className: "h-8 text-sm bg-background border-input",
                      "data-ocid": "hira.filter.risk.select",
                      children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, {})
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectContent, { className: "bg-card border-border", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "ALL", children: "All Risk Levels" }),
                    ["Low", "Medium", "High", "Critical"].map(
                      (lvl) => /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: lvl, children: lvl }, lvl)
                    )
                  ] })
                ]
              }
            )
          ] }),
          departments.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1 min-w-[160px]", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs text-muted-foreground", children: "Department" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              Select,
              {
                value: filterDept || "ALL",
                onValueChange: (v) => setFilterDept(v === "ALL" ? "" : v),
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    SelectTrigger,
                    {
                      className: "h-8 text-sm bg-background border-input",
                      "data-ocid": "hira.filter.dept.select",
                      children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, {})
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectContent, { className: "bg-card border-border", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "ALL", children: "All Departments" }),
                    departments.map((d) => /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: d, children: d }, d))
                  ] })
                ]
              }
            )
          ] }),
          hasFilters && /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Button,
            {
              type: "button",
              variant: "ghost",
              size: "sm",
              onClick: () => {
                setFilterStatus("ALL");
                setFilterDept("");
                setFilterRisk("ALL");
              },
              className: "text-muted-foreground hover:text-foreground gap-1",
              "data-ocid": "hira.filter.clear_button",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "w-3.5 h-3.5" }),
                "Clear"
              ]
            }
          )
        ]
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "div",
      {
        className: "elevated-card rounded-xl overflow-hidden",
        "data-ocid": "hira.list",
        children: isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-6 space-y-3", "data-ocid": "hira.loading_state", children: Array.from({ length: 5 }).map((_, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-12 w-full bg-muted/30" }, i)) }) : filtered.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: "flex flex-col items-center justify-center py-16 gap-3",
            "data-ocid": "hira.empty_state",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-12 h-12 rounded-full bg-muted/30 flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(FileSearch, { className: "w-6 h-6 text-muted-foreground" }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-medium text-foreground", children: (hiras == null ? void 0 : hiras.length) === 0 ? "No HIRA records yet" : "No records match your filters" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: (hiras == null ? void 0 : hiras.length) === 0 ? "Create a new HIRA to get started." : "Try adjusting the filters above." }),
              canCreate && (hiras == null ? void 0 : hiras.length) === 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs(
                Button,
                {
                  type: "button",
                  size: "sm",
                  onClick: () => setShowCreate(true),
                  className: "safety-gradient-primary text-primary-foreground mt-2",
                  "data-ocid": "hira.empty_state.create_button",
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "w-4 h-4 mr-1" }),
                    "New HIRA"
                  ]
                }
              )
            ]
          }
        ) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "overflow-x-auto", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "w-full text-sm", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { children: /* @__PURE__ */ jsxRuntimeExports.jsx("tr", { className: "border-b border-border bg-muted/20", children: [
            "HIRA #",
            "Task Description",
            "Department",
            "Highest Risk",
            "Status",
            "Review Date",
            ""
          ].map((h, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(
            "th",
            {
              className: `text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide ${i === 1 ? "hidden sm:table-cell" : i === 2 ? "hidden md:table-cell" : i >= 5 ? "hidden lg:table-cell" : ""}`,
              children: h
            },
            h || i
          )) }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("tbody", { children: filtered.map((h, idx) => {
            const risk = topRiskLevel(h);
            const overdue = isOverdueReview(h);
            return /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "tr",
              {
                className: "border-b border-border/50 hover:bg-muted/10 transition-colors cursor-pointer",
                onClick: () => setSelectedHIRA(h.hiraNumber),
                onKeyDown: (e) => e.key === "Enter" && setSelectedHIRA(h.hiraNumber),
                tabIndex: 0,
                "data-ocid": `hira.item.${idx + 1}`,
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-mono text-xs font-semibold text-primary", children: h.hiraNumber }) }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 text-foreground hidden sm:table-cell max-w-[200px]", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "truncate block", children: h.taskDescription }) }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 text-muted-foreground hidden md:table-cell", children: h.department }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3", children: /* @__PURE__ */ jsxRuntimeExports.jsx(RiskBadge, { level: risk }) }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3", children: /* @__PURE__ */ jsxRuntimeExports.jsx(StatusBadge, { status: h.status }) }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 hidden lg:table-cell", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
                    "span",
                    {
                      className: `text-sm ${overdue ? "text-destructive font-semibold" : "text-muted-foreground"}`,
                      children: [
                        h.reviewDate,
                        overdue && " ⚠"
                      ]
                    }
                  ) }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                    Button,
                    {
                      type: "button",
                      variant: "ghost",
                      size: "icon",
                      className: "w-8 h-8 text-muted-foreground hover:text-foreground",
                      onClick: (e) => {
                        e.stopPropagation();
                        setSelectedHIRA(h.hiraNumber);
                      },
                      "aria-label": "View HIRA details",
                      "data-ocid": `hira.view_button.${idx + 1}`,
                      children: /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronRight, { className: "w-4 h-4" })
                    }
                  ) })
                ]
              },
              h.hiraNumber
            );
          }) })
        ] }) })
      }
    ),
    showCreate && /* @__PURE__ */ jsxRuntimeExports.jsx(
      CreateHIRADialog,
      {
        open: showCreate,
        onClose: () => setShowCreate(false)
      }
    ),
    selectedHIRA && /* @__PURE__ */ jsxRuntimeExports.jsx(
      HIRADetailDialog,
      {
        hiraNumber: selectedHIRA,
        userRole,
        userEmpId,
        onClose: () => setSelectedHIRA(null)
      }
    )
  ] });
}
export {
  HIRAPage as default
};
