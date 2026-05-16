import { a as createLucideIcon, u as useBackend, d as useAuth, r as reactExports, f as useQuery, j as jsxRuntimeExports, C as ClipboardList, B as Button, z as Shield, m as Label, a5 as JSAStatus, h as useQueryClient, i as useMutation, n as ue, I as Input, U as Users, o as BookOpen, D as RiskLevel } from "./index-KlJ1Xkuh.js";
import { B as Badge } from "./badge-9gf8k1SD.js";
import { C as Checkbox, H as HardHat } from "./checkbox-1Az5Mr-_.js";
import { D as Dialog, a as DialogContent, b as DialogHeader, c as DialogTitle } from "./dialog-Bs5nxuZB.js";
import { S as Select, a as SelectTrigger, b as SelectValue, c as SelectContent, d as SelectItem } from "./select-07LXmFHp.js";
import { S as Separator } from "./separator-BAceehUw.js";
import { S as Skeleton } from "./skeleton-BD1qWQ8I.js";
import { T as Textarea } from "./textarea-DP5Vf31Z.js";
import { D as DEPARTMENTS, L as LOCATIONS } from "./locations-CVEfhVNL.js";
import { P as Plus, X } from "./x-De3qytGh.js";
import { C as Clock } from "./clock-DjENlzLj.js";
import { C as CircleCheck } from "./circle-check-DsbH8609.js";
import { F as Funnel } from "./funnel-DG1DJnBp.js";
import { C as ChevronRight } from "./chevron-right-DIz5FQTE.js";
import { L as LoaderCircle } from "./loader-circle-BZFocWRy.js";
import { F as FileText } from "./file-text-B7ROFFNi.js";
import { M as MapPin } from "./map-pin-GgwTiqua.js";
import { C as CircleX } from "./circle-x-CP1YIU34.js";
import { T as Trash2 } from "./trash-2-C0h2_E5u.js";
import "./index-DhDE9dTE.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  ["path", { d: "m16 11 2 2 4-4", key: "9rsbq5" }],
  ["path", { d: "M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2", key: "1yyitq" }],
  ["circle", { cx: "9", cy: "7", r: "4", key: "nufk8" }]
];
const UserCheck = createLucideIcon("user-check", __iconNode);
const STATUS_LABELS = {
  Draft: "Draft",
  UnderReview: "Under Review",
  Approved: "Approved",
  Active: "Active",
  Closed: "Closed"
};
const RISK_LABELS = {
  Low: "Low",
  Medium: "Medium",
  High: "High",
  Critical: "Critical"
};
const PPE_ITEMS = [
  { key: "helmetRequired", label: "Helmet" },
  { key: "safetyShoes", label: "Safety Shoes" },
  { key: "gloves", label: "Gloves" },
  { key: "harness", label: "Harness" },
  { key: "faceShield", label: "Face Shield" },
  { key: "goggles", label: "Goggles" },
  { key: "respirator", label: "Respirator" }
];
function riskBadgeClass(level) {
  const map = {
    Low: "bg-primary/15 text-primary border-primary/30",
    Medium: "bg-secondary/20 text-secondary border-secondary/40",
    High: "bg-orange-500/20 text-orange-400 border-orange-500/40",
    Critical: "bg-destructive/20 text-destructive border-destructive/40"
  };
  return map[level];
}
function getSelectedPPE(jsa) {
  const out = [];
  if (jsa.helmetRequired) out.push("Helmet");
  if (jsa.safetyShoes) out.push("Safety Shoes");
  if (jsa.gloves) out.push("Gloves");
  if (jsa.harness) out.push("Harness");
  if (jsa.faceShield) out.push("Face Shield");
  if (jsa.goggles) out.push("Goggles");
  if (jsa.respirator) out.push("Respirator");
  return out;
}
function StatusBadge({ status }) {
  const variants = {
    Draft: "bg-muted/50 text-muted-foreground border-border",
    UnderReview: "bg-secondary/20 text-secondary border-secondary/40",
    Approved: "bg-blue-500/20 text-blue-400 border-blue-500/40",
    Active: "bg-primary/20 text-primary border-primary/40",
    Closed: "bg-muted/40 text-muted-foreground border-border"
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "span",
    {
      className: `inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold border ${variants[status]}`,
      children: [
        status === "Active" && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "w-1.5 h-1.5 rounded-full bg-primary animate-pulse" }),
        STATUS_LABELS[status]
      ]
    }
  );
}
function InfoCell({
  icon,
  label,
  value
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-lg border border-border bg-muted/10 p-2.5", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground flex items-center gap-1 mb-0.5", children: [
      icon,
      label
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-medium text-foreground break-words", children: value })
  ] });
}
function StatCard({
  icon,
  label,
  value,
  accent
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "elevated-card rounded-xl p-4 flex items-center gap-4", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "div",
      {
        className: `w-10 h-10 rounded-lg flex items-center justify-center ${accent}`,
        children: icon
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-2xl font-bold text-foreground tabular-nums", children: value }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: label })
    ] })
  ] });
}
function StepRow({ step, index, editable, onChange, onDelete }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "tr",
    {
      className: "border-b border-border/50 align-top",
      "data-ocid": `jsa.step.${index + 1}`,
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-3 py-2 text-sm font-mono text-muted-foreground w-10", children: index + 1 }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-3 py-2", children: editable ? /* @__PURE__ */ jsxRuntimeExports.jsx(
          Textarea,
          {
            value: step.description ?? "",
            onChange: (e) => onChange(index, "description", e.target.value),
            placeholder: "Step description",
            rows: 2,
            className: "bg-background border-input text-sm resize-none min-w-[140px]",
            "data-ocid": `jsa.step.description.${index + 1}`
          }
        ) : /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm text-foreground", children: step.description }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-3 py-2", children: editable ? /* @__PURE__ */ jsxRuntimeExports.jsx(
          Textarea,
          {
            value: step.hazards ?? "",
            onChange: (e) => onChange(index, "hazards", e.target.value),
            placeholder: "Identified hazards",
            rows: 2,
            className: "bg-background border-input text-sm resize-none min-w-[140px]",
            "data-ocid": `jsa.step.hazards.${index + 1}`
          }
        ) : /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm text-foreground", children: step.hazards }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-3 py-2 w-32", children: editable ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Select,
          {
            value: step.riskLevel ?? RiskLevel.Low,
            onValueChange: (v) => onChange(index, "riskLevel", v),
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                SelectTrigger,
                {
                  className: "h-8 text-xs bg-background border-input",
                  "data-ocid": `jsa.step.risk.${index + 1}`,
                  children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, {})
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(SelectContent, { className: "bg-card border-border", children: Object.values(RiskLevel).map((r) => /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: r, children: RISK_LABELS[r] }, r)) })
            ]
          }
        ) : /* @__PURE__ */ jsxRuntimeExports.jsx(
          Badge,
          {
            variant: "outline",
            className: `text-xs ${riskBadgeClass(step.riskLevel ?? RiskLevel.Low)}`,
            children: RISK_LABELS[step.riskLevel ?? RiskLevel.Low]
          }
        ) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-3 py-2", children: editable ? /* @__PURE__ */ jsxRuntimeExports.jsx(
          Textarea,
          {
            value: step.controls ?? "",
            onChange: (e) => onChange(index, "controls", e.target.value),
            placeholder: "Control measures",
            rows: 2,
            className: "bg-background border-input text-sm resize-none min-w-[140px]",
            "data-ocid": `jsa.step.controls.${index + 1}`
          }
        ) : /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm text-foreground", children: step.controls }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-3 py-2 w-10 text-center", children: editable && /* @__PURE__ */ jsxRuntimeExports.jsx(
          Button,
          {
            type: "button",
            variant: "ghost",
            size: "icon",
            className: "w-7 h-7 text-destructive/70 hover:text-destructive hover:bg-destructive/10",
            onClick: () => onDelete(index),
            "aria-label": "Remove step",
            "data-ocid": `jsa.step.delete.${index + 1}`,
            children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "w-3.5 h-3.5" })
          }
        ) })
      ]
    }
  );
}
function CreateJSADialog({
  open,
  onClose
}) {
  const { actor, token, isReady } = useBackend();
  const { user } = useAuth();
  const qc = useQueryClient();
  const [jobTitle, setJobTitle] = reactExports.useState("");
  const [department, setDepartment] = reactExports.useState("");
  const [area, setArea] = reactExports.useState("");
  const [location, setLocation] = reactExports.useState("");
  const [analysisDate, setAnalysisDate] = reactExports.useState(
    (/* @__PURE__ */ new Date()).toISOString().slice(0, 10)
  );
  const [linkedPtwNumber, setLinkedPtwNumber] = reactExports.useState("");
  const [emergencyContacts, setEmergencyContacts] = reactExports.useState("");
  const [ppe, setPpe] = reactExports.useState({
    helmetRequired: false,
    safetyShoes: false,
    gloves: false,
    harness: false,
    faceShield: false,
    goggles: false,
    respirator: false
  });
  const [errors, setErrors] = reactExports.useState({});
  const mutation = useMutation({
    mutationFn: async (input) => {
      if (!actor || !token) throw new Error("Not authenticated");
      const res = await actor.createJSA(token, input);
      if (res.__kind__ === "err") throw new Error(res.err);
      return res.ok;
    },
    onSuccess: (jsaNumber) => {
      ue.success(`JSA ${jsaNumber} created.`);
      qc.invalidateQueries({ queryKey: ["jsas"] });
      handleClose();
    },
    onError: (e) => ue.error(e.message)
  });
  function handleClose() {
    setJobTitle("");
    setDepartment("");
    setArea("");
    setLocation("");
    setAnalysisDate((/* @__PURE__ */ new Date()).toISOString().slice(0, 10));
    setLinkedPtwNumber("");
    setEmergencyContacts("");
    setPpe({
      helmetRequired: false,
      safetyShoes: false,
      gloves: false,
      harness: false,
      faceShield: false,
      goggles: false,
      respirator: false
    });
    setErrors({});
    onClose();
  }
  function validate() {
    const e = {};
    if (!jobTitle.trim()) e.jobTitle = "Job title is required.";
    if (!department) e.department = "Department is required.";
    if (!area.trim()) e.area = "Area is required.";
    if (!location.trim()) e.location = "Location is required.";
    if (!analysisDate) e.analysisDate = "Analysis date is required.";
    setErrors(e);
    return Object.keys(e).length === 0;
  }
  function handleCreate() {
    if (!validate()) return;
    mutation.mutate({
      jobTitle: jobTitle.trim(),
      department,
      area: area.trim(),
      location: location.trim(),
      analysisDate,
      emergencyContacts: emergencyContacts.trim(),
      linkedPtwNumber: linkedPtwNumber.trim() || void 0,
      ...ppe
    });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open, onOpenChange: (v) => !v && handleClose(), children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { className: "max-w-xl max-h-[90vh] overflow-y-auto bg-card border-border", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(DialogHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogTitle, { className: "flex items-center gap-2 text-foreground", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(ClipboardList, { className: "w-5 h-5 text-primary" }),
      "New Job Safety Analysis"
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4 pt-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-foreground", children: "Job Title *" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Input,
          {
            value: jobTitle,
            onChange: (e) => setJobTitle(e.target.value),
            placeholder: "e.g. Hot work on reactor vessel",
            className: "bg-background border-input",
            "data-ocid": "jsa.create.job_title.input"
          }
        ),
        errors.jobTitle && /* @__PURE__ */ jsxRuntimeExports.jsx(
          "p",
          {
            className: "text-xs text-destructive",
            "data-ocid": "jsa.create.job_title.field_error",
            children: errors.jobTitle
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-foreground", children: "Department *" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Select, { value: department, onValueChange: setDepartment, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              SelectTrigger,
              {
                className: "bg-background border-input",
                "data-ocid": "jsa.create.department.select",
                children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, { placeholder: "Select…" })
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(SelectContent, { className: "bg-card border-border", children: DEPARTMENTS.map((d) => /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: d, children: d }, d)) })
          ] }),
          errors.department && /* @__PURE__ */ jsxRuntimeExports.jsx(
            "p",
            {
              className: "text-xs text-destructive",
              "data-ocid": "jsa.create.department.field_error",
              children: errors.department
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
              placeholder: "e.g. Zone B",
              className: "bg-background border-input",
              "data-ocid": "jsa.create.area.input"
            }
          ),
          errors.area && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-destructive", children: errors.area })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-foreground", children: "Location *" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Select, { value: location, onValueChange: setLocation, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              SelectTrigger,
              {
                className: "bg-background border-input",
                "data-ocid": "jsa.create.location.input",
                children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, { placeholder: "Select Location" })
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(SelectContent, { className: "bg-card border-border", children: LOCATIONS.map((l) => /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: l, children: l }, l)) })
          ] }),
          errors.location && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-destructive", children: errors.location })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-foreground", children: "Analysis Date *" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Input,
            {
              type: "date",
              value: analysisDate,
              onChange: (e) => setAnalysisDate(e.target.value),
              className: "bg-background border-input",
              "data-ocid": "jsa.create.date.input"
            }
          ),
          errors.analysisDate && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-destructive", children: errors.analysisDate })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-foreground", children: "Prepared By" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Input,
          {
            value: (user == null ? void 0 : user.name) ?? "",
            readOnly: true,
            className: "bg-muted/20 border-border text-muted-foreground cursor-default"
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-foreground", children: "Linked PTW Number (optional)" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Input,
          {
            value: linkedPtwNumber,
            onChange: (e) => setLinkedPtwNumber(e.target.value),
            placeholder: "e.g. PTW-2026-0001",
            className: "bg-background border-input",
            "data-ocid": "jsa.create.linked_ptw.input"
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-foreground", children: "Emergency Contacts" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Textarea,
          {
            value: emergencyContacts,
            onChange: (e) => setEmergencyContacts(e.target.value),
            placeholder: "Site emergency numbers, rescue team contact…",
            rows: 2,
            className: "bg-background border-input resize-none",
            "data-ocid": "jsa.create.emergency.textarea"
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-foreground", children: "PPE Required" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-2 gap-2", children: PPE_ITEMS.map(({ key, label }) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "label",
          {
            htmlFor: `create-ppe-${key}`,
            className: "flex items-center gap-2 rounded-md border border-border bg-muted/10 px-2.5 py-2 cursor-pointer hover:bg-muted/20 transition-colors",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Checkbox,
                {
                  id: `create-ppe-${key}`,
                  checked: ppe[key],
                  onCheckedChange: (v) => setPpe((prev) => ({ ...prev, [key]: !!v })),
                  "data-ocid": `jsa.create.ppe.${key}`
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm text-foreground", children: label })
            ]
          },
          key
        )) })
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
            "data-ocid": "jsa.create.cancel_button",
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
            "data-ocid": "jsa.create.submit_button",
            children: [
              mutation.isPending && /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "w-4 h-4 animate-spin mr-2" }),
              "Create JSA"
            ]
          }
        )
      ] })
    ] })
  ] }) });
}
function JSADetailDialog({
  jsaNumber,
  onClose,
  userRole,
  userEmpId
}) {
  const { actor, token } = useBackend();
  const qc = useQueryClient();
  const [remarks, setRemarks] = reactExports.useState("");
  const [remarkErr, setRemarkErr] = reactExports.useState("");
  const [briefingIds, setBriefingIds] = reactExports.useState("");
  const [showBriefingForm, setShowBriefingForm] = reactExports.useState(false);
  const [editSteps, setEditSteps] = reactExports.useState([]);
  const [stepsInitialised, setStepsInitialised] = reactExports.useState(false);
  const { data: jsa, isLoading } = useQuery({
    queryKey: ["jsa", jsaNumber],
    queryFn: async () => {
      if (!actor || !token) throw new Error("Not ready");
      const res = await actor.getJSA(token, jsaNumber);
      if (res.__kind__ === "err") throw new Error(res.err);
      return res.ok;
    },
    enabled: !!actor && !!token
  });
  if (jsa && !stepsInitialised) {
    setEditSteps(jsa.steps.length > 0 ? [...jsa.steps] : []);
    setStepsInitialised(true);
  }
  const isEditable = jsa && (jsa.status === "Draft" || jsa.status === "UnderReview") && (userRole === "SafetyOfficer" || userRole === "SystemAdmin" || userRole === "HOD" || jsa.preparedBy === userEmpId);
  const canSubmit = (jsa == null ? void 0 : jsa.status) === "Draft" && (jsa.preparedBy === userEmpId || userRole === "SafetyOfficer" || userRole === "SystemAdmin");
  const canApprove = jsa && (userRole === "HOD" && jsa.status === "UnderReview" && !jsa.hodAt || userRole === "SafetyOfficer" && jsa.status === "UnderReview" && !!jsa.hodAt && !jsa.soAt || userRole === "SystemAdmin" && jsa.status === "UnderReview");
  const canBrief = jsa && (jsa.status === "Approved" || jsa.status === "Active") && (userRole === "SafetyOfficer" || userRole === "SystemAdmin");
  const submitMut = useMutation({
    mutationFn: async () => {
      if (!actor || !token) throw new Error("Not authenticated");
      const res = await actor.submitJSAForApproval(token, jsaNumber);
      if (res.__kind__ === "err") throw new Error(res.err);
    },
    onSuccess: () => {
      ue.success("JSA submitted for approval.");
      qc.invalidateQueries({ queryKey: ["jsas"] });
      qc.invalidateQueries({ queryKey: ["jsa", jsaNumber] });
    },
    onError: (e) => ue.error(e.message)
  });
  const actionMut = useMutation({
    mutationFn: async ({ approve, rem }) => {
      if (!actor || !token) throw new Error("Not authenticated");
      const res = await actor.actOnJSA(token, jsaNumber, approve, rem);
      if (res.__kind__ === "err") throw new Error(res.err);
    },
    onSuccess: (_d, vars) => {
      ue.success(vars.approve ? "JSA approved." : "JSA rejected.");
      qc.invalidateQueries({ queryKey: ["jsas"] });
      qc.invalidateQueries({ queryKey: ["jsa", jsaNumber] });
      setRemarks("");
    },
    onError: (e) => ue.error(e.message)
  });
  const briefingMut = useMutation({
    mutationFn: async (ids) => {
      if (!actor || !token) throw new Error("Not authenticated");
      const res = await actor.recordJSABriefing(token, jsaNumber, ids);
      if (res.__kind__ === "err") throw new Error(res.err);
    },
    onSuccess: () => {
      ue.success("Briefing attendance recorded.");
      qc.invalidateQueries({ queryKey: ["jsa", jsaNumber] });
      setShowBriefingForm(false);
      setBriefingIds("");
    },
    onError: (e) => ue.error(e.message)
  });
  function handleAct(approve) {
    if (!approve && !remarks.trim()) {
      setRemarkErr("Rejection remarks are required.");
      return;
    }
    setRemarkErr("");
    actionMut.mutate({ approve, rem: remarks });
  }
  function handleBriefing() {
    const ids = briefingIds.split(/[,\s]+/).map((s) => s.trim()).filter(Boolean).map((s) => BigInt(s));
    if (ids.length === 0) {
      ue.error("Enter at least one Employee ID.");
      return;
    }
    briefingMut.mutate(ids);
  }
  function updateStep(index, field, value) {
    setEditSteps((prev) => {
      const next = [...prev];
      next[index] = { ...next[index], [field]: value };
      return next;
    });
  }
  function addStep() {
    setEditSteps((prev) => [
      ...prev,
      {
        stepNo: BigInt(prev.length + 1),
        description: "",
        hazards: "",
        riskLevel: RiskLevel.Low,
        controls: "",
        responsibleEmpId: void 0
      }
    ]);
  }
  function deleteStep(index) {
    setEditSteps(
      (prev) => prev.filter((_, i) => i !== index).map((s, i) => ({ ...s, stepNo: BigInt(i + 1) }))
    );
  }
  const isBusy = submitMut.isPending || actionMut.isPending || briefingMut.isPending;
  if (isLoading || !jsa) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open: true, onOpenChange: (v) => !v && onClose(), children: /* @__PURE__ */ jsxRuntimeExports.jsx(DialogContent, { className: "max-w-3xl bg-card border-border", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-3 p-4", "data-ocid": "jsa.detail.loading_state", children: Array.from({ length: 6 }).map((_, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-10 w-full bg-muted/30" }, i)) }) }) });
  }
  const ppeSelected = getSelectedPPE(jsa);
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open: true, onOpenChange: (v) => !v && onClose(), children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { className: "max-w-4xl max-h-[92vh] overflow-y-auto bg-card border-border", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(DialogHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogTitle, { className: "flex items-center justify-between gap-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-2 text-foreground", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(ClipboardList, { className: "w-5 h-5 text-primary" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-mono", children: jsa.jsaNumber }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-muted-foreground font-normal text-base hidden sm:inline", children: [
          "— ",
          jsa.jobTitle
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(StatusBadge, { status: jsa.status })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-5", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 sm:grid-cols-3 gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          InfoCell,
          {
            icon: /* @__PURE__ */ jsxRuntimeExports.jsx(FileText, { className: "w-3.5 h-3.5" }),
            label: "Job Title",
            value: jsa.jobTitle
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          InfoCell,
          {
            icon: /* @__PURE__ */ jsxRuntimeExports.jsx(MapPin, { className: "w-3.5 h-3.5" }),
            label: "Department",
            value: jsa.department
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          InfoCell,
          {
            icon: /* @__PURE__ */ jsxRuntimeExports.jsx(MapPin, { className: "w-3.5 h-3.5" }),
            label: "Area / Location",
            value: `${jsa.area} — ${jsa.location}`
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          InfoCell,
          {
            icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Users, { className: "w-3.5 h-3.5" }),
            label: "Prepared By",
            value: String(jsa.preparedBy)
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          InfoCell,
          {
            icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Clock, { className: "w-3.5 h-3.5" }),
            label: "Analysis Date",
            value: jsa.analysisDate
          }
        ),
        jsa.linkedPtwNumber && /* @__PURE__ */ jsxRuntimeExports.jsx(
          InfoCell,
          {
            icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Shield, { className: "w-3.5 h-3.5" }),
            label: "Linked PTW",
            value: jsa.linkedPtwNumber
          }
        )
      ] }),
      jsa.emergencyContacts && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-lg border border-secondary/30 bg-secondary/5 p-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-semibold text-secondary uppercase tracking-wide mb-1", children: "Emergency Contacts" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-foreground", children: jsa.emergencyContacts })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Separator, { className: "bg-border" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mb-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm font-semibold text-foreground flex items-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(BookOpen, { className: "w-4 h-4 text-primary" }),
            "Job Steps"
          ] }),
          isEditable && /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Button,
            {
              type: "button",
              size: "sm",
              variant: "outline",
              onClick: addStep,
              className: "gap-1.5 border-primary/30 text-primary hover:bg-primary/10",
              "data-ocid": "jsa.add_step_button",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "w-3.5 h-3.5" }),
                "Add Step"
              ]
            }
          )
        ] }),
        editSteps.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: "flex flex-col items-center justify-center py-8 rounded-lg border border-dashed border-border gap-2",
            "data-ocid": "jsa.steps.empty_state",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(BookOpen, { className: "w-8 h-8 text-muted-foreground" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "No steps defined yet." }),
              isEditable && /* @__PURE__ */ jsxRuntimeExports.jsxs(
                Button,
                {
                  type: "button",
                  size: "sm",
                  onClick: addStep,
                  className: "safety-gradient-primary text-primary-foreground mt-1",
                  "data-ocid": "jsa.steps.add_first_button",
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "w-3.5 h-3.5 mr-1" }),
                    "Add First Step"
                  ]
                }
              )
            ]
          }
        ) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "overflow-x-auto rounded-lg border border-border", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "w-full text-sm", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { children: /* @__PURE__ */ jsxRuntimeExports.jsx("tr", { className: "bg-muted/20 border-b border-border", children: [
            "#",
            "Step Description",
            "Hazards",
            "Risk Level",
            "Control Measures",
            ""
          ].map((h, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(
            "th",
            {
              className: "text-left px-3 py-2.5 text-xs font-semibold text-muted-foreground uppercase tracking-wide whitespace-nowrap",
              children: h
            },
            h || i
          )) }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("tbody", { children: editSteps.map((step, idx) => /* @__PURE__ */ jsxRuntimeExports.jsx(
            StepRow,
            {
              step,
              index: idx,
              editable: !!isEditable,
              onChange: updateStep,
              onDelete: deleteStep
            },
            idx
          )) })
        ] }) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Separator, { className: "bg-border" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm font-semibold text-foreground flex items-center gap-2 mb-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(HardHat, { className: "w-4 h-4 text-primary" }),
          "PPE Checklist"
        ] }),
        ppeSelected.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "No PPE specified." }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-wrap gap-2", children: ppeSelected.map((p) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Badge,
          {
            variant: "outline",
            className: "gap-1 border-primary/30 text-primary bg-primary/10",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(HardHat, { className: "w-3 h-3" }),
              p
            ]
          },
          p
        )) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Separator, { className: "bg-border" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm font-semibold text-foreground flex items-center gap-2 mb-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Shield, { className: "w-4 h-4 text-primary" }),
          "Approval Trail"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              className: `rounded-lg border px-4 py-3 ${jsa.hodAt ? "border-primary/30 bg-primary/5" : jsa.status === "UnderReview" ? "border-secondary/40 bg-secondary/5" : "border-border bg-muted/10"}`,
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mb-0.5", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "span",
                    {
                      className: `text-xs font-semibold ${jsa.hodAt ? "text-primary" : "text-muted-foreground"}`,
                      children: "Step 1 — HOD Review"
                    }
                  ),
                  jsa.hodAt && /* @__PURE__ */ jsxRuntimeExports.jsxs(
                    Badge,
                    {
                      variant: "outline",
                      className: "text-xs border-primary/30 text-primary bg-primary/10",
                      children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "w-3 h-3 mr-1" }),
                        "Approved"
                      ]
                    }
                  ),
                  !jsa.hodAt && jsa.status === "UnderReview" && /* @__PURE__ */ jsxRuntimeExports.jsxs(
                    Badge,
                    {
                      variant: "outline",
                      className: "text-xs border-secondary/40 text-secondary",
                      children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx(Clock, { className: "w-3 h-3 mr-1" }),
                        "Pending"
                      ]
                    }
                  )
                ] }),
                jsa.hodAt && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: new Date(Number(jsa.hodAt / 1000000n)).toLocaleString() }),
                jsa.hodRemarks && /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-foreground/70 italic mt-1", children: [
                  "“",
                  jsa.hodRemarks,
                  "”"
                ] })
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              className: `rounded-lg border px-4 py-3 ${jsa.soAt ? "border-primary/30 bg-primary/5" : jsa.hodAt && jsa.status === "UnderReview" ? "border-secondary/40 bg-secondary/5" : "border-border bg-muted/10"}`,
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mb-0.5", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "span",
                    {
                      className: `text-xs font-semibold ${jsa.soAt ? "text-primary" : "text-muted-foreground"}`,
                      children: "Step 2 — Safety Officer Approval"
                    }
                  ),
                  jsa.soAt && /* @__PURE__ */ jsxRuntimeExports.jsxs(
                    Badge,
                    {
                      variant: "outline",
                      className: "text-xs border-primary/30 text-primary bg-primary/10",
                      children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "w-3 h-3 mr-1" }),
                        "Approved"
                      ]
                    }
                  ),
                  jsa.hodAt && !jsa.soAt && jsa.status === "UnderReview" && /* @__PURE__ */ jsxRuntimeExports.jsxs(
                    Badge,
                    {
                      variant: "outline",
                      className: "text-xs border-secondary/40 text-secondary",
                      children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx(Clock, { className: "w-3 h-3 mr-1" }),
                        "Pending"
                      ]
                    }
                  )
                ] }),
                jsa.soAt && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: new Date(Number(jsa.soAt / 1000000n)).toLocaleString() }),
                jsa.soRemarks && /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-foreground/70 italic mt-1", children: [
                  "“",
                  jsa.soRemarks,
                  "”"
                ] })
              ]
            }
          )
        ] })
      ] }),
      (jsa.status === "Approved" || jsa.status === "Active") && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Separator, { className: "bg-border" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { "data-ocid": "jsa.briefing_section", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mb-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm font-semibold text-foreground flex items-center gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(UserCheck, { className: "w-4 h-4 text-primary" }),
              "Briefing Attendance"
            ] }),
            canBrief && /* @__PURE__ */ jsxRuntimeExports.jsxs(
              Button,
              {
                type: "button",
                size: "sm",
                variant: "outline",
                onClick: () => setShowBriefingForm((v) => !v),
                className: "gap-1.5 border-primary/30 text-primary hover:bg-primary/10",
                "data-ocid": "jsa.record_briefing_button",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(UserCheck, { className: "w-3.5 h-3.5" }),
                  "Record Briefing"
                ]
              }
            )
          ] }),
          jsa.briefingAttendees.length > 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-wrap gap-2", children: jsa.briefingAttendees.map((id) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Badge,
            {
              variant: "outline",
              className: "border-border text-muted-foreground",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Users, { className: "w-3 h-3 mr-1" }),
                "EMP-",
                String(id)
              ]
            },
            String(id)
          )) }) : /* @__PURE__ */ jsxRuntimeExports.jsx(
            "p",
            {
              className: "text-sm text-muted-foreground",
              "data-ocid": "jsa.briefing.empty_state",
              children: "No briefing attendance recorded yet."
            }
          ),
          showBriefingForm && /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              className: "mt-3 space-y-2 rounded-lg border border-primary/20 bg-primary/5 p-3",
              "data-ocid": "jsa.briefing_form",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-foreground text-sm", children: "Employee IDs (comma or space separated)" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Input,
                  {
                    value: briefingIds,
                    onChange: (e) => setBriefingIds(e.target.value),
                    placeholder: "e.g. 230034 230035 230036",
                    className: "bg-background border-input",
                    "data-ocid": "jsa.briefing.ids.input"
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2 justify-end", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    Button,
                    {
                      type: "button",
                      size: "sm",
                      variant: "ghost",
                      onClick: () => setShowBriefingForm(false),
                      className: "text-muted-foreground",
                      "data-ocid": "jsa.briefing.cancel_button",
                      children: "Cancel"
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs(
                    Button,
                    {
                      type: "button",
                      size: "sm",
                      disabled: briefingMut.isPending,
                      onClick: handleBriefing,
                      className: "safety-gradient-primary text-primary-foreground",
                      "data-ocid": "jsa.briefing.save_button",
                      children: [
                        briefingMut.isPending && /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "w-3.5 h-3.5 animate-spin mr-1" }),
                        "Save Attendance"
                      ]
                    }
                  )
                ] })
              ]
            }
          )
        ] })
      ] }),
      canSubmit && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Separator, { className: "bg-border" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex justify-end", "data-ocid": "jsa.submit_panel", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Button,
          {
            type: "button",
            disabled: isBusy,
            onClick: () => submitMut.mutate(),
            className: "safety-gradient-primary text-primary-foreground",
            "data-ocid": "jsa.submit_for_approval_button",
            children: [
              submitMut.isPending && /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "w-4 h-4 animate-spin mr-2" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronRight, { className: "w-4 h-4 mr-1" }),
              "Submit for Approval"
            ]
          }
        ) })
      ] }),
      canApprove && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Separator, { className: "bg-border" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: "rounded-lg border border-secondary/40 bg-secondary/5 p-4 space-y-3",
            "data-ocid": "jsa.approval_panel",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm font-semibold text-secondary flex items-center gap-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Shield, { className: "w-4 h-4" }),
                "Your Approval Required"
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
                    "data-ocid": "jsa.remarks.textarea"
                  }
                ),
                remarkErr && /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "p",
                  {
                    className: "text-xs text-destructive",
                    "data-ocid": "jsa.remarks.field_error",
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
                    "data-ocid": "jsa.reject_button",
                    children: [
                      actionMut.isPending && /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "w-4 h-4 animate-spin mr-2" }),
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
                    "data-ocid": "jsa.approve_button",
                    children: [
                      actionMut.isPending && /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "w-4 h-4 animate-spin mr-2" }),
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
  ] }) });
}
function JSAPage() {
  const { actor, token, isReady } = useBackend();
  const { user } = useAuth();
  const userRole = (user == null ? void 0 : user.role) ?? "Employee";
  const userEmpId = (user == null ? void 0 : user.employeeId) ?? 0n;
  const [filterStatus, setFilterStatus] = reactExports.useState("ALL");
  const [filterDept, setFilterDept] = reactExports.useState("ALL");
  const [showCreate, setShowCreate] = reactExports.useState(false);
  const [selectedJSA, setSelectedJSA] = reactExports.useState(null);
  const { data: jsas, isLoading } = useQuery({
    queryKey: ["jsas"],
    queryFn: async () => {
      if (!actor || !token) return [];
      const res = await actor.listJSAs(token);
      if (res.__kind__ === "err") throw new Error(res.err);
      return res.ok;
    },
    enabled: isReady
  });
  const filtered = reactExports.useMemo(() => {
    if (!jsas) return [];
    return jsas.filter((j) => {
      if (filterStatus !== "ALL" && j.status !== filterStatus) return false;
      if (filterDept !== "ALL" && userRole !== "SystemAdmin" && userRole !== "SafetyOfficer") {
        if (j.department !== filterDept) return false;
      } else if (filterDept !== "ALL") {
        if (j.department !== filterDept) return false;
      }
      if (userRole === "HOD" && j.department !== (user == null ? void 0 : user.department)) return false;
      return true;
    });
  }, [jsas, filterStatus, filterDept, userRole, user == null ? void 0 : user.department]);
  const stats = reactExports.useMemo(() => {
    const all = jsas ?? [];
    const now = /* @__PURE__ */ new Date();
    const thisMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
    return {
      total: all.length,
      active: all.filter((j) => j.status === "Active").length,
      pending: all.filter(
        (j) => j.status === "UnderReview" || j.status === "Draft"
      ).length,
      closedThisMonth: all.filter(
        (j) => j.status === "Closed" && new Date(Number(j.updatedAt / 1000000n)).toISOString().startsWith(thisMonth)
      ).length
    };
  }, [jsas]);
  const canCreate = userRole === "SafetyOfficer" || userRole === "HOD" || userRole === "SystemAdmin";
  const hasFilters = filterStatus !== "ALL" || filterDept !== "ALL";
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6", "data-ocid": "jsa.page", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col sm:flex-row sm:items-center justify-between gap-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("h1", { className: "section-header flex items-center gap-2 mb-0", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(ClipboardList, { className: "w-6 h-6 text-primary" }),
          "Job Safety Analysis (JSA)"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground mt-0.5", children: "Plan, analyse and control job-specific hazards before work begins" })
      ] }),
      canCreate && /* @__PURE__ */ jsxRuntimeExports.jsxs(
        Button,
        {
          type: "button",
          onClick: () => setShowCreate(true),
          className: "safety-gradient-primary text-primary-foreground gap-2 shrink-0",
          "data-ocid": "jsa.create.open_modal_button",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "w-4 h-4" }),
            "New JSA"
          ]
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "grid grid-cols-2 lg:grid-cols-4 gap-4",
        "data-ocid": "jsa.stats_section",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            StatCard,
            {
              icon: /* @__PURE__ */ jsxRuntimeExports.jsx(ClipboardList, { className: "w-5 h-5 text-primary" }),
              label: "Total JSAs",
              value: stats.total,
              accent: "bg-primary/15"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            StatCard,
            {
              icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Shield, { className: "w-5 h-5 text-green-400" }),
              label: "Active",
              value: stats.active,
              accent: "bg-green-500/15"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            StatCard,
            {
              icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Clock, { className: "w-5 h-5 text-secondary" }),
              label: "Pending Approval",
              value: stats.pending,
              accent: "bg-secondary/15"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            StatCard,
            {
              icon: /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "w-5 h-5 text-muted-foreground" }),
              label: "Closed This Month",
              value: stats.closedThisMonth,
              accent: "bg-muted/30"
            }
          )
        ]
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "elevated-card rounded-xl p-4 flex flex-wrap gap-3 items-end",
        "data-ocid": "jsa.filters_panel",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Funnel, { className: "w-4 h-4 text-muted-foreground self-center" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1 min-w-[180px]", children: [
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
                      "data-ocid": "jsa.filter.status.select",
                      children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, {})
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectContent, { className: "bg-card border-border", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "ALL", children: "All Statuses" }),
                    Object.values(JSAStatus).map((s) => /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: s, children: STATUS_LABELS[s] }, s))
                  ] })
                ]
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1 min-w-[180px]", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs text-muted-foreground", children: "Department" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(Select, { value: filterDept, onValueChange: setFilterDept, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                SelectTrigger,
                {
                  className: "h-8 text-sm bg-background border-input",
                  "data-ocid": "jsa.filter.department.select",
                  children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, {})
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectContent, { className: "bg-card border-border", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "ALL", children: "All Departments" }),
                DEPARTMENTS.map((d) => /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: d, children: d }, d))
              ] })
            ] })
          ] }),
          hasFilters && /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Button,
            {
              type: "button",
              variant: "ghost",
              size: "sm",
              onClick: () => {
                setFilterStatus("ALL");
                setFilterDept("ALL");
              },
              className: "text-muted-foreground hover:text-foreground gap-1",
              "data-ocid": "jsa.filter.clear_button",
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
        "data-ocid": "jsa.list",
        children: isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-6 space-y-3", "data-ocid": "jsa.loading_state", children: Array.from({ length: 5 }).map((_, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-12 w-full bg-muted/30" }, i)) }) : filtered.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: "flex flex-col items-center justify-center py-16 gap-3",
            "data-ocid": "jsa.empty_state",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-12 h-12 rounded-full bg-muted/30 flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ClipboardList, { className: "w-6 h-6 text-muted-foreground" }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-medium text-foreground", children: (jsas == null ? void 0 : jsas.length) === 0 ? "No JSAs yet" : "No JSAs match your filters" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: (jsas == null ? void 0 : jsas.length) === 0 ? "Create a new Job Safety Analysis to get started." : "Try adjusting your status or department filters." }),
              canCreate && (jsas == null ? void 0 : jsas.length) === 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs(
                Button,
                {
                  type: "button",
                  size: "sm",
                  onClick: () => setShowCreate(true),
                  className: "safety-gradient-primary text-primary-foreground mt-2",
                  "data-ocid": "jsa.empty_state.create_button",
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "w-4 h-4 mr-1" }),
                    "New JSA"
                  ]
                }
              )
            ]
          }
        ) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "overflow-x-auto", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "w-full text-sm", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { children: /* @__PURE__ */ jsxRuntimeExports.jsx("tr", { className: "border-b border-border bg-muted/20", children: [
            "JSA #",
            "Job Title",
            "Department",
            "Prepared By",
            "Status",
            "Date",
            ""
          ].map((h, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(
            "th",
            {
              className: `text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide ${i === 2 || i === 3 ? "hidden md:table-cell" : ""} ${i === 5 ? "hidden lg:table-cell" : ""}`,
              children: h
            },
            h || i
          )) }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("tbody", { children: filtered.map((j, idx) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "tr",
            {
              className: "border-b border-border/50 hover:bg-muted/10 transition-colors cursor-pointer",
              onClick: () => setSelectedJSA(j.jsaNumber),
              onKeyDown: (e) => e.key === "Enter" && setSelectedJSA(j.jsaNumber),
              tabIndex: 0,
              "data-ocid": `jsa.item.${idx + 1}`,
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-mono text-xs font-semibold text-primary", children: j.jsaNumber }) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-foreground font-medium truncate max-w-[180px] block", children: j.jobTitle }) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 text-muted-foreground hidden md:table-cell", children: j.department }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("td", { className: "px-4 py-3 text-muted-foreground hidden md:table-cell", children: [
                  "EMP-",
                  String(j.preparedBy)
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3", children: /* @__PURE__ */ jsxRuntimeExports.jsx(StatusBadge, { status: j.status }) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 text-muted-foreground hidden lg:table-cell", children: j.analysisDate }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Button,
                  {
                    type: "button",
                    variant: "ghost",
                    size: "icon",
                    className: "w-8 h-8 text-muted-foreground hover:text-foreground",
                    onClick: (e) => {
                      e.stopPropagation();
                      setSelectedJSA(j.jsaNumber);
                    },
                    "aria-label": "View JSA details",
                    "data-ocid": `jsa.view_button.${idx + 1}`,
                    children: /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronRight, { className: "w-4 h-4" })
                  }
                ) })
              ]
            },
            j.jsaNumber
          )) })
        ] }) })
      }
    ),
    showCreate && /* @__PURE__ */ jsxRuntimeExports.jsx(
      CreateJSADialog,
      {
        open: showCreate,
        onClose: () => setShowCreate(false)
      }
    ),
    selectedJSA && /* @__PURE__ */ jsxRuntimeExports.jsx(
      JSADetailDialog,
      {
        jsaNumber: selectedJSA,
        onClose: () => setSelectedJSA(null),
        userRole,
        userEmpId
      }
    )
  ] });
}
export {
  JSAPage as default
};
