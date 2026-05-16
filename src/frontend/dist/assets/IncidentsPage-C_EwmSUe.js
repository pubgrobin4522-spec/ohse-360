import { r as reactExports, j as jsxRuntimeExports, B as Button, q as IncidentStatus, C as ClipboardList, s as CAPAStatus, m as Label, T as TriangleAlert, u as useBackend, d as useAuth, i as useMutation, n as ue, t as IncidentType, I as Input, h as useQueryClient, f as useQuery } from "./index-KlJ1Xkuh.js";
import { B as Badge } from "./badge-9gf8k1SD.js";
import { S as Select, a as SelectTrigger, b as SelectValue, c as SelectContent, d as SelectItem } from "./select-07LXmFHp.js";
import { S as Skeleton } from "./skeleton-BD1qWQ8I.js";
import { T as Textarea } from "./textarea-DP5Vf31Z.js";
import { D as Dialog, a as DialogContent, b as DialogHeader, c as DialogTitle, d as DialogFooter } from "./dialog-Bs5nxuZB.js";
import { L as LOCATIONS, D as DEPARTMENTS } from "./locations-CVEfhVNL.js";
import { R as RefreshCw } from "./refresh-cw-lIVh7Ceb.js";
import { P as Plus, X } from "./x-De3qytGh.js";
import { S as Search } from "./search-B9Llb9ph.js";
import { F as Funnel } from "./funnel-DG1DJnBp.js";
import { A as ArrowLeft } from "./arrow-left-D6FXHsU6.js";
import { C as CircleCheck } from "./circle-check-DsbH8609.js";
import { C as Clock } from "./clock-DjENlzLj.js";
import { L as LoaderCircle } from "./loader-circle-BZFocWRy.js";
import "./index-DhDE9dTE.js";
const STEPS = [
  { status: IncidentStatus.Open, label: "Open" },
  { status: IncidentStatus.UnderInvestigation, label: "Under Investigation" },
  { status: IncidentStatus.CAPAPending, label: "CAPA Pending" },
  { status: IncidentStatus.Closed, label: "Closed" }
];
const STATUS_ORDER = {
  [IncidentStatus.Open]: 0,
  [IncidentStatus.UnderInvestigation]: 1,
  [IncidentStatus.CAPAPending]: 2,
  [IncidentStatus.Closed]: 3
};
function nextStatus(current) {
  const order = STATUS_ORDER[current];
  const next = STEPS.find((s) => STATUS_ORDER[s.status] === order + 1);
  return (next == null ? void 0 : next.status) ?? null;
}
function capaStatusClass(s) {
  switch (s) {
    case CAPAStatus.Open:
      return "bg-blue-500/20 text-blue-400 border-blue-500/40";
    case CAPAStatus.InProgress:
      return "bg-purple-500/20 text-purple-400 border-purple-500/40";
    case CAPAStatus.Overdue:
      return "bg-red-500/20 text-red-400 border-red-500/40";
    case CAPAStatus.Closed:
      return "bg-muted text-muted-foreground border-border";
  }
}
function formatTs(ts) {
  return new Date(Number(ts) / 1e6).toLocaleString();
}
function IncidentDetailPanel({
  incident,
  capas,
  isSafetyOfficer,
  isUpdating,
  isClosingCapa,
  onBack,
  onUpdateStatus,
  onCloseCAPA
}) {
  const next = nextStatus(incident.status);
  const [updateRootCause, setUpdateRootCause] = reactExports.useState(incident.rootCause);
  const [updateCorrectiveAction, setUpdateCorrectiveAction] = reactExports.useState(
    incident.correctiveAction
  );
  const [newStatus, setNewStatus] = reactExports.useState(next ?? "");
  const currentStep = STATUS_ORDER[incident.status];
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6", "data-ocid": "incidents.detail_panel", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        Button,
        {
          variant: "outline",
          size: "sm",
          onClick: onBack,
          className: "mt-0.5 shrink-0",
          "data-ocid": "incidents.back_button",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowLeft, { className: "w-4 h-4 mr-1.5" }),
            " Back"
          ]
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap items-center gap-3 mb-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-xl font-bold font-mono text-primary", children: incident.incidentNumber }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Badge,
            {
              variant: "outline",
              className: `border ${severityClass(incident.severity)}`,
              children: incident.severity
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Badge,
            {
              variant: "outline",
              className: `border ${statusClass(incident.status)}`,
              children: formatStatus(incident.status)
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-muted-foreground text-sm", children: [
          formatIncidentType(incident.incidentType),
          " · ",
          incident.department,
          " ",
          "· Reported ",
          formatTs(incident.createdAt)
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "elevated-card rounded-xl p-5", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-4", children: "Status Flow" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center gap-0", children: STEPS.map((step, i) => {
        const stepIdx = STATUS_ORDER[step.status];
        const done = stepIdx < currentStep;
        const active = stepIdx === currentStep;
        const isLast = i === STEPS.length - 1;
        return /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: "flex items-center flex-1 min-w-0",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-center", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "div",
                  {
                    className: `w-8 h-8 rounded-full flex items-center justify-center border-2 shrink-0 ${done ? "bg-primary border-primary text-primary-foreground" : active ? "bg-primary/20 border-primary text-primary" : "bg-muted/30 border-border text-muted-foreground"}`,
                    children: done ? /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "w-4 h-4" }) : active ? /* @__PURE__ */ jsxRuntimeExports.jsx(Clock, { className: "w-3.5 h-3.5" }) : /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-bold", children: i + 1 })
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "span",
                  {
                    className: `text-xs mt-1.5 text-center whitespace-nowrap ${active ? "text-primary font-semibold" : done ? "text-muted-foreground" : "text-muted-foreground/50"}`,
                    children: step.label
                  }
                )
              ] }),
              !isLast && /* @__PURE__ */ jsxRuntimeExports.jsx(
                "div",
                {
                  className: `h-0.5 flex-1 mx-1 ${stepIdx < currentStep ? "bg-primary" : "bg-border"}`
                }
              )
            ]
          },
          step.status
        );
      }) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "elevated-card rounded-xl p-5 space-y-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-sm font-semibold text-muted-foreground uppercase tracking-wide", children: "Incident Details" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Location", children: incident.location }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Department", children: incident.department }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Incident Date", children: incident.incidentDate }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Reported By", children: incident.reportedByName }),
        incident.injuredPersonCode && /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Injured Person", children: incident.injuredPersonCode })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "elevated-card rounded-xl p-5 space-y-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-sm font-semibold text-muted-foreground uppercase tracking-wide", children: "Investigation" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Description", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "whitespace-pre-wrap", children: incident.description }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Root Cause", children: incident.rootCause }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Corrective Action", children: incident.correctiveAction }),
        incident.closedAt && /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Closed At", children: formatTs(incident.closedAt) })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "elevated-card rounded-xl p-5", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mb-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(ClipboardList, { className: "w-4 h-4 text-primary" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-sm font-semibold text-muted-foreground uppercase tracking-wide", children: "CAPA Records" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "ml-auto text-muted-foreground/60 text-xs", children: [
          capas.length,
          " record",
          capas.length !== 1 ? "s" : ""
        ] })
      ] }),
      capas.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx(
        "p",
        {
          className: "text-muted-foreground text-sm",
          "data-ocid": "incidents.capa.empty_state",
          children: "No CAPA records for this incident."
        }
      ) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-3", children: capas.map((capa, idx) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "div",
        {
          className: "bg-muted/20 border border-border/60 rounded-lg p-4 flex flex-col sm:flex-row sm:items-center gap-3",
          "data-ocid": `incidents.capa.item.${idx + 1}`,
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0 space-y-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 flex-wrap", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-mono text-xs text-muted-foreground", children: [
                  "CAPA-",
                  String(capa.id).padStart(4, "0")
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Badge,
                  {
                    variant: "outline",
                    className: `text-xs border ${capaStatusClass(capa.status)}`,
                    children: capa.status
                  }
                ),
                capa.status === CAPAStatus.Overdue && /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Badge,
                  {
                    variant: "outline",
                    className: "text-xs border bg-red-500/20 text-red-400 border-red-500/40",
                    children: "OVERDUE"
                  }
                )
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-foreground", children: capa.description }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground", children: [
                "Owner:",
                " ",
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-foreground", children: capa.actionOwnerName }),
                " · ",
                "Deadline:",
                " ",
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "span",
                  {
                    className: capa.status === CAPAStatus.Overdue ? "text-red-400 font-medium" : "text-foreground",
                    children: capa.deadline
                  }
                )
              ] })
            ] }),
            isSafetyOfficer && capa.status !== CAPAStatus.Closed && /* @__PURE__ */ jsxRuntimeExports.jsx(
              Button,
              {
                variant: "outline",
                size: "sm",
                onClick: () => onCloseCAPA(capa.id),
                disabled: isClosingCapa,
                "data-ocid": `incidents.capa.close_button.${idx + 1}`,
                className: "shrink-0",
                children: isClosingCapa ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "w-3.5 h-3.5 animate-spin" }) : "Close CAPA"
              }
            )
          ]
        },
        String(capa.id)
      )) })
    ] }),
    isSafetyOfficer && incident.status !== IncidentStatus.Closed && /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "elevated-card rounded-xl p-5 space-y-4",
        "data-ocid": "incidents.status_update_panel",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Search, { className: "w-4 h-4 text-primary" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-sm font-semibold text-muted-foreground uppercase tracking-wide", children: "Update Status" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Move To Status" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              Select,
              {
                value: newStatus,
                onValueChange: (v) => setNewStatus(v),
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    SelectTrigger,
                    {
                      className: "w-64",
                      "data-ocid": "incidents.new_status_select",
                      children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, { placeholder: "Select next status…" })
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(SelectContent, { children: STEPS.filter((s) => STATUS_ORDER[s.status] > currentStep).map(
                    (s) => /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: s.status, children: s.label }, s.status)
                  ) })
                ]
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Root Cause (updated)" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Textarea,
                {
                  rows: 2,
                  value: updateRootCause,
                  onChange: (e) => setUpdateRootCause(e.target.value),
                  "data-ocid": "incidents.update_root_cause_textarea"
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Corrective Action (updated)" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Textarea,
                {
                  rows: 2,
                  value: updateCorrectiveAction,
                  onChange: (e) => setUpdateCorrectiveAction(e.target.value),
                  "data-ocid": "incidents.update_corrective_action_textarea"
                }
              )
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              onClick: () => {
                if (!newStatus) return;
                onUpdateStatus(
                  newStatus,
                  updateRootCause,
                  updateCorrectiveAction
                );
              },
              disabled: isUpdating || !newStatus,
              "data-ocid": "incidents.update_status_button",
              children: isUpdating ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "w-4 h-4 mr-1.5 animate-spin" }),
                " Updating…"
              ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx(jsxRuntimeExports.Fragment, { children: "Update Status" })
            }
          )
        ]
      }
    ),
    incident.status === IncidentStatus.Closed && /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "elevated-card rounded-xl p-5 flex items-center gap-3",
        "data-ocid": "incidents.closed_banner",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "w-5 h-5 text-primary shrink-0" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-foreground font-medium", children: "Incident Closed" }),
            incident.closedAt && /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-muted-foreground text-sm", children: [
              "Closed at ",
              formatTs(incident.closedAt)
            ] })
          ] })
        ]
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(TriangleAlert, { className: "hidden" })
  ] });
}
function Field({
  label,
  children
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-0.5", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground uppercase tracking-wide", children: label }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-foreground", children })
  ] });
}
const ROOT_CAUSE_CATEGORIES = [
  "Human Error",
  "Equipment Failure",
  "Process Failure",
  "Environmental Factor",
  "Lack of Training",
  "Inadequate PPE",
  "Unsafe Behaviour",
  "Communication Failure",
  "Management Failure",
  "Other"
];
const EMPTY = {
  incidentType: "",
  severity: "",
  location: "",
  department: "",
  description: "",
  incidentDate: "",
  injuredPersonCode: "",
  rootCauseCategory: "",
  rootCauseFreeText: "",
  correctiveAction: "",
  capaActionOwnerId: "",
  capaDeadline: ""
};
function IncidentReportDialog({ open, onClose, onCreated }) {
  const { actor, token } = useBackend();
  const { user } = useAuth();
  const [form, setForm] = reactExports.useState(EMPTY);
  const [errors, setErrors] = reactExports.useState({});
  const set = (key, val) => setForm((prev) => ({ ...prev, [key]: val }));
  const validate = () => {
    const e = {};
    if (!form.incidentType) e.incidentType = "Required";
    if (!form.severity) e.severity = "Required";
    if (!form.location.trim()) e.location = "Required";
    if (!form.department.trim()) e.department = "Required";
    if (!form.description.trim()) e.description = "Required";
    if (!form.incidentDate) e.incidentDate = "Required";
    if (!form.rootCauseCategory) e.rootCauseCategory = "Required";
    if (!form.correctiveAction.trim()) e.correctiveAction = "Required";
    if (!form.capaActionOwnerId.trim() || Number.isNaN(Number(form.capaActionOwnerId)))
      e.capaActionOwnerId = "Valid numeric Employee ID required";
    if (!form.capaDeadline) e.capaDeadline = "Required";
    setErrors(e);
    return Object.keys(e).length === 0;
  };
  const mutation = useMutation({
    mutationFn: async () => {
      if (!actor || !token) throw new Error("Not authenticated");
      const input = {
        incidentType: form.incidentType,
        severity: form.severity,
        location: form.location,
        department: form.department,
        description: form.description,
        incidentDate: form.incidentDate,
        injuredPersonCode: form.injuredPersonCode || void 0,
        capaActionOwnerId: BigInt(form.capaActionOwnerId),
        capaDeadline: form.capaDeadline
      };
      const res = await actor.reportIncident(token, input);
      if (res.__kind__ === "err") throw new Error(res.err);
      return res.ok;
    },
    onSuccess: (inc) => {
      setForm(EMPTY);
      setErrors({});
      onCreated(inc);
    },
    onError: (e) => ue.error(e.message)
  });
  const handleSubmit = () => {
    if (validate()) mutation.mutate();
  };
  const handleClose = () => {
    setForm(EMPTY);
    setErrors({});
    onClose();
  };
  const today = (/* @__PURE__ */ new Date()).toISOString().slice(0, 16);
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open, onOpenChange: (o) => !o && handleClose(), children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
    DialogContent,
    {
      className: "max-w-2xl max-h-[90vh] overflow-y-auto bg-card border-border",
      "data-ocid": "incidents.dialog",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogHeader, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTitle, { className: "text-foreground text-xl font-bold flex items-center gap-2", children: "Report New Incident" }),
          user && /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-muted-foreground text-sm", children: [
            "Reported by: ",
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-foreground", children: user.name }),
            " ",
            "· ",
            user.department
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-5 py-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs(Label, { children: [
                "Incident Type ",
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-destructive", children: "*" })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                Select,
                {
                  value: form.incidentType,
                  onValueChange: (v) => set("incidentType", v),
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      SelectTrigger,
                      {
                        "data-ocid": "incidents.type_select",
                        className: errors.incidentType ? "border-destructive" : "",
                        children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, { placeholder: "Select type…" })
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(SelectContent, { children: Object.values(IncidentType).map((t) => /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: t, children: formatIncidentType(t) }, t)) })
                  ]
                }
              ),
              errors.incidentType && /* @__PURE__ */ jsxRuntimeExports.jsx(
                "p",
                {
                  className: "text-destructive text-xs",
                  "data-ocid": "incidents.type.field_error",
                  children: errors.incidentType
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs(Label, { children: [
                "Severity ",
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-destructive", children: "*" })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                Select,
                {
                  value: form.severity,
                  onValueChange: (v) => set("severity", v),
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      SelectTrigger,
                      {
                        "data-ocid": "incidents.severity_select",
                        className: errors.severity ? "border-destructive" : "",
                        children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, { placeholder: "Select severity…" })
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(SelectContent, { children: ["Low", "Medium", "High", "Critical"].map(
                      (s) => /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: s, children: s }, s)
                    ) })
                  ]
                }
              ),
              errors.severity && /* @__PURE__ */ jsxRuntimeExports.jsx(
                "p",
                {
                  className: "text-destructive text-xs",
                  "data-ocid": "incidents.severity.field_error",
                  children: errors.severity
                }
              )
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs(Label, { children: [
                "Location ",
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-destructive", children: "*" })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                Select,
                {
                  value: form.location,
                  onValueChange: (v) => set("location", v),
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      SelectTrigger,
                      {
                        "data-ocid": "incidents.location_input",
                        className: errors.location ? "border-destructive" : "",
                        children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, { placeholder: "Select Location" })
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(SelectContent, { children: LOCATIONS.map((l) => /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: l, children: l }, l)) })
                  ]
                }
              ),
              errors.location && /* @__PURE__ */ jsxRuntimeExports.jsx(
                "p",
                {
                  className: "text-destructive text-xs",
                  "data-ocid": "incidents.location.field_error",
                  children: errors.location
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs(Label, { children: [
                "Department ",
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-destructive", children: "*" })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                Select,
                {
                  value: form.department,
                  onValueChange: (v) => set("department", v),
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      SelectTrigger,
                      {
                        "data-ocid": "incidents.department_input",
                        className: errors.department ? "border-destructive" : "",
                        children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, { placeholder: "Select Department" })
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(SelectContent, { children: DEPARTMENTS.map((d) => /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: d, children: d }, d)) })
                  ]
                }
              ),
              errors.department && /* @__PURE__ */ jsxRuntimeExports.jsx(
                "p",
                {
                  className: "text-destructive text-xs",
                  "data-ocid": "incidents.department.field_error",
                  children: errors.department
                }
              )
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs(Label, { children: [
                "Incident Date & Time ",
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-destructive", children: "*" })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Input,
                {
                  type: "datetime-local",
                  max: today,
                  value: form.incidentDate,
                  onChange: (e) => set("incidentDate", e.target.value),
                  "data-ocid": "incidents.date_input",
                  className: errors.incidentDate ? "border-destructive" : ""
                }
              ),
              errors.incidentDate && /* @__PURE__ */ jsxRuntimeExports.jsx(
                "p",
                {
                  className: "text-destructive text-xs",
                  "data-ocid": "incidents.date.field_error",
                  children: errors.incidentDate
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs(Label, { children: [
                "Injured Person Employee Code",
                " ",
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground text-xs", children: "(optional)" })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Input,
                {
                  placeholder: "e.g. EMP-0023",
                  value: form.injuredPersonCode,
                  onChange: (e) => set("injuredPersonCode", e.target.value),
                  "data-ocid": "incidents.injured_input"
                }
              )
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(Label, { children: [
              "Description ",
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-destructive", children: "*" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Textarea,
              {
                placeholder: "Describe what happened in detail…",
                rows: 3,
                value: form.description,
                onChange: (e) => set("description", e.target.value),
                "data-ocid": "incidents.description_textarea",
                className: errors.description ? "border-destructive" : ""
              }
            ),
            errors.description && /* @__PURE__ */ jsxRuntimeExports.jsx(
              "p",
              {
                className: "text-destructive text-xs",
                "data-ocid": "incidents.description.field_error",
                children: errors.description
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(Label, { children: [
              "Root Cause Category ",
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-destructive", children: "*" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              Select,
              {
                value: form.rootCauseCategory,
                onValueChange: (v) => set("rootCauseCategory", v),
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    SelectTrigger,
                    {
                      "data-ocid": "incidents.root_cause_select",
                      className: errors.rootCauseCategory ? "border-destructive" : "",
                      children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, { placeholder: "Select root cause…" })
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(SelectContent, { children: ROOT_CAUSE_CATEGORIES.map((c) => /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: c, children: c }, c)) })
                ]
              }
            ),
            errors.rootCauseCategory && /* @__PURE__ */ jsxRuntimeExports.jsx(
              "p",
              {
                className: "text-destructive text-xs",
                "data-ocid": "incidents.root_cause.field_error",
                children: errors.rootCauseCategory
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(Label, { children: [
              "Root Cause Details",
              " ",
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground text-xs", children: "(optional free text)" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Textarea,
              {
                placeholder: "Additional details about the root cause…",
                rows: 2,
                value: form.rootCauseFreeText,
                onChange: (e) => set("rootCauseFreeText", e.target.value),
                "data-ocid": "incidents.root_cause_detail_textarea"
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(Label, { children: [
              "Immediate Corrective Action",
              " ",
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-destructive", children: "*" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Textarea,
              {
                placeholder: "What immediate steps were taken?",
                rows: 2,
                value: form.correctiveAction,
                onChange: (e) => set("correctiveAction", e.target.value),
                "data-ocid": "incidents.corrective_action_textarea",
                className: errors.correctiveAction ? "border-destructive" : ""
              }
            ),
            errors.correctiveAction && /* @__PURE__ */ jsxRuntimeExports.jsx(
              "p",
              {
                className: "text-destructive text-xs",
                "data-ocid": "incidents.corrective_action.field_error",
                children: errors.correctiveAction
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-muted/20 border border-border/60 rounded-lg p-4 space-y-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-sm font-semibold text-foreground uppercase tracking-wide", children: "CAPA Assignment" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-4", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs(Label, { children: [
                  "Action Owner (Employee ID)",
                  " ",
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-destructive", children: "*" })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Input,
                  {
                    placeholder: "e.g. 100042",
                    value: form.capaActionOwnerId,
                    onChange: (e) => set("capaActionOwnerId", e.target.value),
                    "data-ocid": "incidents.capa_owner_input",
                    className: errors.capaActionOwnerId ? "border-destructive" : ""
                  }
                ),
                errors.capaActionOwnerId && /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "p",
                  {
                    className: "text-destructive text-xs",
                    "data-ocid": "incidents.capa_owner.field_error",
                    children: errors.capaActionOwnerId
                  }
                )
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs(Label, { children: [
                  "CAPA Deadline ",
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-destructive", children: "*" })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Input,
                  {
                    type: "date",
                    value: form.capaDeadline,
                    onChange: (e) => set("capaDeadline", e.target.value),
                    "data-ocid": "incidents.capa_deadline_input",
                    className: errors.capaDeadline ? "border-destructive" : ""
                  }
                ),
                errors.capaDeadline && /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "p",
                  {
                    className: "text-destructive text-xs",
                    "data-ocid": "incidents.capa_deadline.field_error",
                    children: errors.capaDeadline
                  }
                )
              ] })
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogFooter, { className: "gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              variant: "outline",
              onClick: handleClose,
              "data-ocid": "incidents.cancel_button",
              children: "Cancel"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              onClick: handleSubmit,
              disabled: mutation.isPending,
              "data-ocid": "incidents.submit_button",
              children: mutation.isPending ? "Submitting…" : "Submit Incident"
            }
          )
        ] })
      ]
    }
  ) });
}
function severityClass(s) {
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
function statusClass(s) {
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
function formatIncidentType(t) {
  const labels = {
    [IncidentType.NearMiss]: "Near Miss",
    [IncidentType.UnsafeAct]: "Unsafe Act",
    [IncidentType.UnsafeCondition]: "Unsafe Condition",
    [IncidentType.FirstAid]: "First Aid",
    [IncidentType.LTI]: "LTI",
    [IncidentType.Fatal]: "Fatal"
  };
  return labels[t] ?? t;
}
function formatStatus(s) {
  const labels = {
    [IncidentStatus.Open]: "Open",
    [IncidentStatus.UnderInvestigation]: "Under Investigation",
    [IncidentStatus.CAPAPending]: "CAPA Pending",
    [IncidentStatus.Closed]: "Closed"
  };
  return labels[s] ?? s;
}
function IncidentsPage() {
  const { actor, token, isReady } = useBackend();
  const { user } = useAuth();
  const qc = useQueryClient();
  const [typeFilter, setTypeFilter] = reactExports.useState("all");
  const [severityFilter, setSeverityFilter] = reactExports.useState("all");
  const [statusFilter, setStatusFilter] = reactExports.useState(
    "all"
  );
  const [search, setSearch] = reactExports.useState("");
  const [showReport, setShowReport] = reactExports.useState(false);
  const [selectedIncident, setSelectedIncident] = reactExports.useState(
    null
  );
  const {
    data: incidents,
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: ["incidents", typeFilter, severityFilter, statusFilter],
    queryFn: async () => {
      if (!actor || !token) return [];
      const res = await actor.listIncidents(
        token,
        typeFilter === "all" ? null : typeFilter,
        severityFilter === "all" ? null : severityFilter,
        statusFilter === "all" ? null : statusFilter,
        null
      );
      if (res.__kind__ === "err") throw new Error(res.err);
      return res.ok;
    },
    enabled: isReady
  });
  const { data: capas } = useQuery({
    queryKey: ["capas", selectedIncident == null ? void 0 : selectedIncident.incidentNumber],
    queryFn: async () => {
      if (!actor || !token || !selectedIncident) return [];
      const res = await actor.listCAPAs(token, selectedIncident.incidentNumber);
      if (res.__kind__ === "err") throw new Error(res.err);
      return res.ok;
    },
    enabled: isReady && !!selectedIncident
  });
  const closeCAPAMut = useMutation({
    mutationFn: async (capaId) => {
      if (!actor || !token) throw new Error("Not authenticated");
      const res = await actor.closeCAPA(token, capaId);
      if (res.__kind__ === "err") throw new Error(res.err);
    },
    onSuccess: () => {
      ue.success("CAPA closed successfully");
      qc.invalidateQueries({ queryKey: ["capas"] });
      qc.invalidateQueries({ queryKey: ["incidents"] });
    },
    onError: (e) => ue.error(e.message)
  });
  const updateStatusMut = useMutation({
    mutationFn: async ({
      incNum,
      status,
      rootCause,
      correctiveAction
    }) => {
      if (!actor || !token) throw new Error("Not authenticated");
      const res = await actor.updateIncidentStatus(
        token,
        incNum,
        status,
        rootCause,
        correctiveAction
      );
      if (res.__kind__ === "err") throw new Error(res.err);
    },
    onSuccess: (_, vars) => {
      ue.success("Status updated");
      qc.invalidateQueries({ queryKey: ["incidents"] });
      if ((selectedIncident == null ? void 0 : selectedIncident.incidentNumber) === vars.incNum && actor && token) {
        actor.getIncident(token, vars.incNum).then((r) => {
          if (r.__kind__ === "ok") setSelectedIncident(r.ok);
        });
      }
    },
    onError: (e) => ue.error(e.message)
  });
  const filtered = reactExports.useMemo(() => {
    if (!incidents) return [];
    const q = search.toLowerCase();
    if (!q) return incidents;
    return incidents.filter(
      (i) => i.incidentNumber.toLowerCase().includes(q) || i.location.toLowerCase().includes(q) || i.reportedByName.toLowerCase().includes(q) || i.department.toLowerCase().includes(q)
    );
  }, [incidents, search]);
  const isSafetyOfficer = (user == null ? void 0 : user.role) === "SafetyOfficer" || (user == null ? void 0 : user.role) === "SystemAdmin";
  const clearFilters = () => {
    setTypeFilter("all");
    setSeverityFilter("all");
    setStatusFilter("all");
    setSearch("");
  };
  const hasActiveFilters = typeFilter !== "all" || severityFilter !== "all" || statusFilter !== "all" || search;
  if (selectedIncident) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      IncidentDetailPanel,
      {
        incident: selectedIncident,
        capas: capas ?? [],
        isSafetyOfficer,
        isUpdating: updateStatusMut.isPending,
        isClosingCapa: closeCAPAMut.isPending,
        onBack: () => setSelectedIncident(null),
        onUpdateStatus: (status, rootCause, correctiveAction) => updateStatusMut.mutate({
          incNum: selectedIncident.incidentNumber,
          status,
          rootCause,
          correctiveAction
        }),
        onCloseCAPA: (id) => closeCAPAMut.mutate(id)
      }
    );
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6", "data-ocid": "incidents.page", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("h1", { className: "section-header flex items-center gap-2 mb-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(TriangleAlert, { className: "w-6 h-6 text-primary" }),
          "Incident Reporting"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground text-sm", children: isSafetyOfficer ? "All incidents across departments" : "Your reported incidents" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Button,
          {
            variant: "outline",
            size: "sm",
            onClick: () => refetch(),
            "data-ocid": "incidents.refresh_button",
            children: /* @__PURE__ */ jsxRuntimeExports.jsx(RefreshCw, { className: "w-4 h-4" })
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Button,
          {
            size: "sm",
            onClick: () => setShowReport(true),
            "data-ocid": "incidents.report_button",
            className: "gap-1.5",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "w-4 h-4" }),
              "Report Incident"
            ]
          }
        )
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "elevated-card rounded-xl p-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap gap-3 items-center", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative flex-1 min-w-[200px]", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Search, { className: "absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Input,
          {
            placeholder: "Search by number, location, reporter…",
            className: "pl-9",
            value: search,
            onChange: (e) => setSearch(e.target.value),
            "data-ocid": "incidents.search_input"
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        Select,
        {
          value: typeFilter,
          onValueChange: (v) => setTypeFilter(v),
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectTrigger, { className: "w-44", "data-ocid": "incidents.type_filter", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Funnel, { className: "w-3.5 h-3.5 mr-1.5" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, { placeholder: "Type" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectContent, { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "all", children: "All Types" }),
              Object.values(IncidentType).map((t) => /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: t, children: formatIncidentType(t) }, t))
            ] })
          ]
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        Select,
        {
          value: severityFilter,
          onValueChange: (v) => setSeverityFilter(v),
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              SelectTrigger,
              {
                className: "w-40",
                "data-ocid": "incidents.severity_filter",
                children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, { placeholder: "Severity" })
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectContent, { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "all", children: "All Severities" }),
              ["Low", "Medium", "High", "Critical"].map(
                (s) => /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: s, children: s }, s)
              )
            ] })
          ]
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        Select,
        {
          value: statusFilter,
          onValueChange: (v) => setStatusFilter(v),
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { className: "w-44", "data-ocid": "incidents.status_filter", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, { placeholder: "Status" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectContent, { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "all", children: "All Statuses" }),
              Object.values(IncidentStatus).map((s) => /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: s, children: formatStatus(s) }, s))
            ] })
          ]
        }
      ),
      hasActiveFilters && /* @__PURE__ */ jsxRuntimeExports.jsxs(
        Button,
        {
          variant: "ghost",
          size: "sm",
          onClick: clearFilters,
          className: "gap-1.5",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "w-3.5 h-3.5" }),
            " Clear"
          ]
        }
      )
    ] }) }),
    incidents && incidents.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-2 sm:grid-cols-4 gap-3", children: [
      {
        label: "Total",
        count: incidents.length,
        cls: "text-foreground"
      },
      {
        label: "Open",
        count: incidents.filter((i) => i.status === IncidentStatus.Open).length,
        cls: "text-blue-400"
      },
      {
        label: "CAPA Pending",
        count: incidents.filter(
          (i) => i.status === IncidentStatus.CAPAPending
        ).length,
        cls: "text-amber-400"
      },
      {
        label: "Critical",
        count: incidents.filter((i) => i.severity === "Critical").length,
        cls: "text-red-400"
      }
    ].map(({ label, count, cls }) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "elevated-card rounded-xl p-4 text-center",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `text-2xl font-bold font-mono ${cls}`, children: count }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "stat-label mt-1", children: label })
        ]
      },
      label
    )) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "elevated-card rounded-xl overflow-hidden", children: isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-6 space-y-3", "data-ocid": "incidents.loading_state", children: [...Array(5)].map((_, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-12 w-full" }, i)) }) : error ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-8 text-center", "data-ocid": "incidents.error_state", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(TriangleAlert, { className: "w-8 h-8 text-destructive mx-auto mb-2" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-destructive font-medium", children: "Failed to load incidents" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground text-sm mt-1", children: error.message }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Button,
        {
          variant: "outline",
          size: "sm",
          className: "mt-4",
          onClick: () => refetch(),
          children: "Retry"
        }
      )
    ] }) : filtered.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-12 text-center", "data-ocid": "incidents.empty_state", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(TriangleAlert, { className: "w-10 h-10 text-muted-foreground/40 mx-auto mb-3" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground font-medium", children: "No incidents found" }),
      hasActiveFilters ? /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground/60 text-sm mt-1", children: "Try adjusting your filters" }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(
        Button,
        {
          size: "sm",
          className: "mt-4",
          onClick: () => setShowReport(true),
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "w-4 h-4 mr-1.5" }),
            " Report First Incident"
          ]
        }
      )
    ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "overflow-x-auto", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "w-full text-sm", "data-ocid": "incidents.table", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "border-b border-border bg-muted/30", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-left px-4 py-3 text-muted-foreground font-medium whitespace-nowrap", children: "Incident #" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-left px-4 py-3 text-muted-foreground font-medium", children: "Type" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-left px-4 py-3 text-muted-foreground font-medium", children: "Severity" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-left px-4 py-3 text-muted-foreground font-medium", children: "Status" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-left px-4 py-3 text-muted-foreground font-medium", children: "Location" }),
        isSafetyOfficer && /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-left px-4 py-3 text-muted-foreground font-medium", children: "Reported By" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-left px-4 py-3 text-muted-foreground font-medium whitespace-nowrap", children: "Date" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-left px-4 py-3 text-muted-foreground font-medium", children: "Action" })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("tbody", { children: filtered.map((inc, idx) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "tr",
        {
          className: "border-b border-border/50 hover:bg-muted/20 transition-colors cursor-pointer",
          onClick: () => setSelectedIncident(inc),
          onKeyDown: (e) => e.key === "Enter" && setSelectedIncident(inc),
          tabIndex: 0,
          "data-ocid": `incidents.item.${idx + 1}`,
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-mono text-xs text-primary font-semibold", children: inc.incidentNumber }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 text-foreground whitespace-nowrap", children: formatIncidentType(inc.incidentType) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
              Badge,
              {
                variant: "outline",
                className: `text-xs font-semibold border ${severityClass(inc.severity)}`,
                children: inc.severity
              }
            ) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
              Badge,
              {
                variant: "outline",
                className: `text-xs border ${statusClass(inc.status)}`,
                children: formatStatus(inc.status)
              }
            ) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 text-muted-foreground max-w-[140px] truncate", children: inc.location }),
            isSafetyOfficer && /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 text-muted-foreground", children: inc.reportedByName }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 text-muted-foreground whitespace-nowrap", children: inc.incidentDate }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
              Button,
              {
                variant: "ghost",
                size: "sm",
                className: "text-primary hover:text-primary h-7 px-2",
                onClick: (e) => {
                  e.stopPropagation();
                  setSelectedIncident(inc);
                },
                "data-ocid": `incidents.view_button.${idx + 1}`,
                children: "View"
              }
            ) })
          ]
        },
        inc.incidentNumber
      )) })
    ] }) }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      IncidentReportDialog,
      {
        open: showReport,
        onClose: () => setShowReport(false),
        onCreated: (inc) => {
          qc.invalidateQueries({ queryKey: ["incidents"] });
          setShowReport(false);
          ue.success(`Incident ${inc.incidentNumber} reported successfully`);
          setSelectedIncident(inc);
        }
      }
    )
  ] });
}
export {
  IncidentsPage as default,
  formatIncidentType,
  formatStatus,
  severityClass,
  statusClass
};
