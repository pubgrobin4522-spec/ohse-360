import { u as useBackend, d as useAuth, h as useQueryClient, r as reactExports, f as useQuery, i as useMutation, j as jsxRuntimeExports, $ as Eye, B as Button, I as Input, a0 as ObservationType, a1 as ObservationSeverity, a2 as ObservationStatus, T as TriangleAlert, n as ue, m as Label } from "./index-KlJ1Xkuh.js";
import { B as Badge } from "./badge-9gf8k1SD.js";
import { D as Dialog, a as DialogContent, b as DialogHeader, c as DialogTitle } from "./dialog-Bs5nxuZB.js";
import { S as Select, a as SelectTrigger, b as SelectValue, c as SelectContent, d as SelectItem } from "./select-07LXmFHp.js";
import { S as Skeleton } from "./skeleton-BD1qWQ8I.js";
import { T as Textarea } from "./textarea-DP5Vf31Z.js";
import { L as LOCATIONS, D as DEPARTMENTS } from "./locations-CVEfhVNL.js";
import { R as RefreshCw } from "./refresh-cw-lIVh7Ceb.js";
import { P as Plus, X } from "./x-De3qytGh.js";
import { S as Search } from "./search-B9Llb9ph.js";
import { F as Funnel } from "./funnel-DG1DJnBp.js";
import { S as ShieldCheck } from "./shield-check-CrpLyen4.js";
import { C as CircleCheck } from "./circle-check-DsbH8609.js";
import { T as TrendingUp } from "./trending-up-CAvmj4MV.js";
import "./index-DhDE9dTE.js";
function obsTypeLabel(t) {
  const labels = {
    [ObservationType.SafeAct]: "Safe Act",
    [ObservationType.UnsafeAct]: "Unsafe Act",
    [ObservationType.UnsafeCondition]: "Unsafe Condition",
    [ObservationType.NearMiss]: "Near Miss",
    [ObservationType.PositiveReinforcement]: "Positive Reinforcement"
  };
  return labels[t] ?? t;
}
function obsTypeClass(t) {
  switch (t) {
    case ObservationType.SafeAct:
      return "bg-green-500/20 text-green-400 border-green-500/40";
    case ObservationType.UnsafeAct:
      return "bg-red-500/20 text-red-400 border-red-500/40";
    case ObservationType.UnsafeCondition:
      return "bg-orange-500/20 text-orange-400 border-orange-500/40";
    case ObservationType.NearMiss:
      return "bg-amber-500/20 text-amber-400 border-amber-500/40";
    case ObservationType.PositiveReinforcement:
      return "bg-cyan-500/20 text-cyan-400 border-cyan-500/40";
  }
}
function obsStatusLabel(s) {
  const labels = {
    [ObservationStatus.Open]: "Open",
    [ObservationStatus.UnderReview]: "Under Review",
    [ObservationStatus.CAPAPending]: "CAPA Pending",
    [ObservationStatus.Closed]: "Closed"
  };
  return labels[s] ?? s;
}
function obsStatusClass(s) {
  switch (s) {
    case ObservationStatus.Open:
      return "bg-blue-500/20 text-blue-400 border-blue-500/40";
    case ObservationStatus.UnderReview:
      return "bg-amber-500/20 text-amber-400 border-amber-500/40";
    case ObservationStatus.CAPAPending:
      return "bg-orange-500/20 text-orange-400 border-orange-500/40";
    case ObservationStatus.Closed:
      return "bg-muted text-muted-foreground border-border";
  }
}
function obsSeverityClass(s) {
  switch (s) {
    case ObservationSeverity.High:
      return "bg-red-500/20 text-red-400 border-red-500/40";
    case ObservationSeverity.Medium:
      return "bg-yellow-500/20 text-yellow-400 border-yellow-500/40";
    case ObservationSeverity.Low:
      return "bg-green-500/20 text-green-400 border-green-500/40";
  }
}
function formatTs(ts) {
  try {
    return new Date(Number(ts / 1000000n)).toLocaleDateString();
  } catch {
    return "—";
  }
}
function BbsStatsBar({ stats }) {
  const total = Number(stats.total);
  const safe = Number(stats.safe);
  const unsafe = Number(stats.unsafe);
  const score = Number(stats.score);
  const safeRatio = total > 0 ? safe / total * 100 : 0;
  const scoreColor = score >= 70 ? "text-green-400" : score >= 50 ? "text-amber-400" : "text-red-400";
  const scoreBg = score >= 70 ? "from-green-500/20 to-green-500/5" : score >= 50 ? "from-amber-500/20 to-amber-500/5" : "from-red-500/20 to-red-500/5";
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "grid grid-cols-2 sm:grid-cols-4 gap-3",
      "data-ocid": "observations.stats_bar",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "elevated-card rounded-xl p-4 text-center", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-2xl font-bold font-mono text-foreground", children: total }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "stat-label mt-1", children: "Total Observations" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "elevated-card rounded-xl p-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between text-xs text-muted-foreground mb-1.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-green-400 font-semibold", children: [
              safe,
              " Safe"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-red-400 font-semibold", children: [
              unsafe,
              " Unsafe"
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-2 rounded-full bg-muted overflow-hidden", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
            "div",
            {
              className: "h-full rounded-full bg-gradient-to-r from-green-500 to-green-400 transition-all",
              style: { width: `${safeRatio}%` }
            }
          ) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "stat-label mt-2 text-center", children: "Safe / Unsafe Ratio" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: `elevated-card rounded-xl p-4 bg-gradient-to-br ${scoreBg} text-center`,
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: `text-3xl font-bold font-mono ${scoreColor}`, children: [
                score,
                "%"
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-center gap-1 mt-0.5", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(TrendingUp, { className: "w-3 h-3 text-muted-foreground" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "stat-label", children: "BBS Score" })
              ] })
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "elevated-card rounded-xl p-4 text-center", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-2xl font-bold font-mono text-orange-400", children: unsafe }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "stat-label mt-1", children: "Unsafe Findings" })
        ] })
      ]
    }
  );
}
function SubmitObsDialog({ open, onClose, onCreated }) {
  const { actor, token } = useBackend();
  const { user } = useAuth();
  const [form, setForm] = reactExports.useState({
    dateTime: (/* @__PURE__ */ new Date()).toISOString().slice(0, 16),
    location: "",
    area: "",
    department: (user == null ? void 0 : user.department) ?? "",
    obsType: ObservationType.SafeAct,
    severity: ObservationSeverity.Low,
    description: "",
    immediateAction: ""
  });
  const [errors, setErrors] = reactExports.useState({});
  const submitMut = useMutation({
    mutationFn: async () => {
      if (!actor || !token) throw new Error("Not authenticated");
      const input = {
        dateTime: BigInt(new Date(form.dateTime).getTime()) * 1000000n,
        location: form.location.trim(),
        area: form.area.trim(),
        department: form.department.trim(),
        obsType: form.obsType,
        severity: form.severity,
        description: form.description.trim(),
        immediateAction: form.immediateAction.trim()
      };
      const res = await actor.createObservation(token, input);
      if (res.__kind__ === "err") throw new Error(res.err);
      return res.ok;
    },
    onSuccess: (obsNumber) => {
      ue.success(`Observation ${obsNumber} submitted successfully`);
      onCreated();
      onClose();
    },
    onError: (e) => ue.error(e.message)
  });
  function validate() {
    const errs = {};
    if (!form.location.trim()) errs.location = "Location is required";
    if (!form.area.trim()) errs.area = "Area is required";
    if (!form.department.trim()) errs.department = "Department is required";
    if (!form.description.trim()) errs.description = "Description is required";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  }
  function handleSubmit() {
    if (validate()) submitMut.mutate();
  }
  const set = (k, v) => {
    setForm((f) => ({ ...f, [k]: v }));
    setErrors((e) => ({ ...e, [k]: "" }));
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open, onOpenChange: (o) => !o && onClose(), children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
    DialogContent,
    {
      className: "bg-card border-border max-w-lg max-h-[90vh] overflow-y-auto",
      "data-ocid": "observations.dialog",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(DialogHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogTitle, { className: "flex items-center gap-2 text-foreground", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(ShieldCheck, { className: "w-5 h-5 text-primary" }),
          "Submit Safety Observation"
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4 mt-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "col-span-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-muted-foreground text-xs mb-1.5 block", children: "Date & Time *" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Input,
                {
                  type: "datetime-local",
                  value: form.dateTime,
                  onChange: (e) => set("dateTime", e.target.value),
                  className: "bg-background",
                  "data-ocid": "observations.datetime_input"
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-muted-foreground text-xs mb-1.5 block", children: "Location *" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                Select,
                {
                  value: form.location,
                  onValueChange: (v) => set("location", v),
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      SelectTrigger,
                      {
                        className: "bg-background",
                        "data-ocid": "observations.location_input",
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
                  className: "text-destructive text-xs mt-1",
                  "data-ocid": "observations.location_field_error",
                  children: errors.location
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-muted-foreground text-xs mb-1.5 block", children: "Area *" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(Select, { value: form.area, onValueChange: (v) => set("area", v), children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  SelectTrigger,
                  {
                    className: "bg-background",
                    "data-ocid": "observations.area_input",
                    children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, { placeholder: "Select Location" })
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(SelectContent, { children: LOCATIONS.map((l) => /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: l, children: l }, l)) })
              ] }),
              errors.area && /* @__PURE__ */ jsxRuntimeExports.jsx(
                "p",
                {
                  className: "text-destructive text-xs mt-1",
                  "data-ocid": "observations.area_field_error",
                  children: errors.area
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-muted-foreground text-xs mb-1.5 block", children: "Department *" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                Select,
                {
                  value: form.department,
                  onValueChange: (v) => set("department", v),
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      SelectTrigger,
                      {
                        className: "bg-background",
                        "data-ocid": "observations.department_input",
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
                  className: "text-destructive text-xs mt-1",
                  "data-ocid": "observations.department_field_error",
                  children: errors.department
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-muted-foreground text-xs mb-1.5 block", children: "Observation Type" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                Select,
                {
                  value: form.obsType,
                  onValueChange: (v) => set("obsType", v),
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      SelectTrigger,
                      {
                        className: "bg-background",
                        "data-ocid": "observations.type_select",
                        children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, {})
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(SelectContent, { children: Object.values(ObservationType).map((t) => /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: t, children: obsTypeLabel(t) }, t)) })
                  ]
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-muted-foreground text-xs mb-1.5 block", children: "Severity" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                Select,
                {
                  value: form.severity,
                  onValueChange: (v) => set("severity", v),
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      SelectTrigger,
                      {
                        className: "bg-background",
                        "data-ocid": "observations.severity_select",
                        children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, {})
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(SelectContent, { children: Object.values(ObservationSeverity).map((s) => /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: s, children: s }, s)) })
                  ]
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "col-span-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-muted-foreground text-xs mb-1.5 block", children: "Description *" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Textarea,
                {
                  placeholder: "Describe what you observed in detail...",
                  value: form.description,
                  onChange: (e) => set("description", e.target.value),
                  rows: 3,
                  className: "bg-background resize-none",
                  "data-ocid": "observations.description_textarea"
                }
              ),
              errors.description && /* @__PURE__ */ jsxRuntimeExports.jsx(
                "p",
                {
                  className: "text-destructive text-xs mt-1",
                  "data-ocid": "observations.description_field_error",
                  children: errors.description
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "col-span-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-muted-foreground text-xs mb-1.5 block", children: "Immediate Action Taken" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Textarea,
                {
                  placeholder: "Any immediate corrective action taken on the spot...",
                  value: form.immediateAction,
                  onChange: (e) => set("immediateAction", e.target.value),
                  rows: 2,
                  className: "bg-background resize-none",
                  "data-ocid": "observations.immediate_action_textarea"
                }
              )
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-end gap-2 pt-2 border-t border-border", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Button,
              {
                type: "button",
                variant: "outline",
                onClick: onClose,
                "data-ocid": "observations.cancel_button",
                children: "Cancel"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Button,
              {
                type: "button",
                onClick: handleSubmit,
                disabled: submitMut.isPending,
                "data-ocid": "observations.submit_button",
                children: submitMut.isPending ? "Submitting…" : "Submit Observation"
              }
            )
          ] })
        ] })
      ]
    }
  ) });
}
function ObservationDetailPanel({
  obs,
  canAcknowledge,
  onBack,
  onAcknowledge,
  onClose: onCloseObs,
  isAcknowledging,
  isClosing
}) {
  const [ackRemarks, setAckRemarks] = reactExports.useState("");
  const canClose = canAcknowledge && obs.status !== ObservationStatus.Open && obs.status !== ObservationStatus.Closed;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6", "data-ocid": "observations.detail_panel", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Button,
        {
          variant: "ghost",
          size: "sm",
          onClick: onBack,
          className: "gap-1.5",
          "data-ocid": "observations.back_button",
          children: "← Back"
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "section-header font-mono", children: obs.obsNumber }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-muted-foreground text-sm", children: [
          obs.location,
          " · ",
          obs.department
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Badge,
        {
          variant: "outline",
          className: `border ${obsStatusClass(obs.status)}`,
          children: obsStatusLabel(obs.status)
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "elevated-card rounded-xl p-5 space-y-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-sm font-semibold text-muted-foreground uppercase tracking-wide", children: "Observation Details" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-x-6 gap-y-3 text-sm", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Detail, { label: "Observer", value: obs.observerName }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Detail, { label: "Date/Time", value: formatTs(obs.dateTime) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Detail, { label: "Area", value: obs.area }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Detail, { label: "Department", value: obs.department }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Detail,
          {
            label: "Type",
            value: /* @__PURE__ */ jsxRuntimeExports.jsx(
              Badge,
              {
                variant: "outline",
                className: `text-xs border ${obsTypeClass(obs.obsType)}`,
                children: obsTypeLabel(obs.obsType)
              }
            )
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Detail,
          {
            label: "Severity",
            value: /* @__PURE__ */ jsxRuntimeExports.jsx(
              Badge,
              {
                variant: "outline",
                className: `text-xs border ${obsSeverityClass(obs.severity)}`,
                children: obs.severity
              }
            )
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3 pt-2 border-t border-border", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground uppercase tracking-wide", children: "Description" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-foreground text-sm mt-1", children: obs.description })
        ] }),
        obs.immediateAction && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground uppercase tracking-wide", children: "Immediate Action Taken" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-foreground text-sm mt-1", children: obs.immediateAction })
        ] }),
        obs.linkedCapaId && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mt-2 p-2.5 rounded-lg bg-orange-500/10 border border-orange-500/20", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(TriangleAlert, { className: "w-4 h-4 text-orange-400 shrink-0" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-sm text-orange-300", children: [
            "Linked CAPA:",
            " ",
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-mono font-semibold", children: obs.linkedCapaId })
          ] })
        ] })
      ] })
    ] }),
    obs.acknowledgedBy && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "elevated-card rounded-xl p-5 space-y-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-sm font-semibold text-muted-foreground uppercase tracking-wide", children: "Acknowledgement" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-foreground", children: obs.acknowledgeRemarks ?? "—" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground", children: [
        "Acknowledged at",
        " ",
        obs.acknowledgedAt ? formatTs(obs.acknowledgedAt) : "—"
      ] })
    ] }),
    canAcknowledge && obs.status === ObservationStatus.Open && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "elevated-card rounded-xl p-5 space-y-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-sm font-semibold text-muted-foreground uppercase tracking-wide", children: "Acknowledge Observation" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Textarea,
        {
          placeholder: "Enter acknowledgement remarks...",
          value: ackRemarks,
          onChange: (e) => setAckRemarks(e.target.value),
          rows: 2,
          className: "bg-background resize-none",
          "data-ocid": "observations.ack_remarks_textarea"
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        Button,
        {
          size: "sm",
          onClick: () => onAcknowledge(ackRemarks),
          disabled: isAcknowledging || !ackRemarks.trim(),
          className: "gap-1.5",
          "data-ocid": "observations.acknowledge_button",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "w-4 h-4" }),
            isAcknowledging ? "Acknowledging…" : "Acknowledge"
          ]
        }
      )
    ] }),
    canClose && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex justify-end", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
      Button,
      {
        variant: "outline",
        size: "sm",
        onClick: onCloseObs,
        disabled: isClosing,
        className: "gap-1.5 border-green-500/40 text-green-400 hover:bg-green-500/10",
        "data-ocid": "observations.close_button",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "w-4 h-4" }),
          isClosing ? "Closing…" : "Close Observation"
        ]
      }
    ) })
  ] });
}
function Detail({
  label,
  value
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground uppercase tracking-wide block", children: label }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-foreground text-sm mt-0.5", children: value })
  ] });
}
function ObservationsPage() {
  const { actor, token, isReady } = useBackend();
  const { user } = useAuth();
  const qc = useQueryClient();
  const isPrivileged = (user == null ? void 0 : user.role) === "SafetyOfficer" || (user == null ? void 0 : user.role) === "SystemAdmin";
  const isHOD = (user == null ? void 0 : user.role) === "HOD";
  const [typeFilter, setTypeFilter] = reactExports.useState("all");
  const [severityFilter, setSeverityFilter] = reactExports.useState("all");
  const [statusFilter, setStatusFilter] = reactExports.useState(
    "all"
  );
  const [deptFilter, setDeptFilter] = reactExports.useState("");
  const [search, setSearch] = reactExports.useState("");
  const [showSubmit, setShowSubmit] = reactExports.useState(false);
  const [selected, setSelected] = reactExports.useState(null);
  const { data: bbsStats } = useQuery({
    queryKey: ["bbsStats"],
    queryFn: async () => {
      if (!actor || !token) return null;
      const res = await actor.getBbsStats(token);
      if (res.__kind__ === "err") return null;
      return res.ok;
    },
    enabled: isReady
  });
  const {
    data: observations,
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: ["observations"],
    queryFn: async () => {
      if (!actor || !token) return [];
      const res = await actor.listObservations(token);
      if (res.__kind__ === "err") throw new Error(res.err);
      return res.ok;
    },
    enabled: isReady
  });
  const ackMut = useMutation({
    mutationFn: async ({
      obsNumber,
      remarks
    }) => {
      if (!actor || !token) throw new Error("Not authenticated");
      const res = await actor.acknowledgeObservation(token, obsNumber, remarks);
      if (res.__kind__ === "err") throw new Error(res.err);
    },
    onSuccess: (_, { obsNumber }) => {
      ue.success("Observation acknowledged");
      qc.invalidateQueries({ queryKey: ["observations"] });
      qc.invalidateQueries({ queryKey: ["bbsStats"] });
      if ((selected == null ? void 0 : selected.obsNumber) === obsNumber && actor && token) {
        actor.getObservation(token, obsNumber).then((r) => {
          if (r.__kind__ === "ok") setSelected(r.ok);
        });
      }
    },
    onError: (e) => ue.error(e.message)
  });
  const closeMut = useMutation({
    mutationFn: async (obsNumber) => {
      if (!actor || !token) throw new Error("Not authenticated");
      const res = await actor.closeObservation(token, obsNumber);
      if (res.__kind__ === "err") throw new Error(res.err);
    },
    onSuccess: (_, obsNumber) => {
      ue.success("Observation closed");
      qc.invalidateQueries({ queryKey: ["observations"] });
      qc.invalidateQueries({ queryKey: ["bbsStats"] });
      if ((selected == null ? void 0 : selected.obsNumber) === obsNumber && actor && token) {
        actor.getObservation(token, obsNumber).then((r) => {
          if (r.__kind__ === "ok") setSelected(r.ok);
        });
      }
    },
    onError: (e) => ue.error(e.message)
  });
  const filtered = reactExports.useMemo(() => {
    if (!observations) return [];
    return observations.filter((obs) => {
      if (!isPrivileged && !isHOD) {
        if (obs.observerEmpId !== (user == null ? void 0 : user.employeeId)) return false;
      } else if (isHOD && !isPrivileged) {
        if (obs.department !== (user == null ? void 0 : user.department)) return false;
      }
      if (typeFilter !== "all" && obs.obsType !== typeFilter) return false;
      if (severityFilter !== "all" && obs.severity !== severityFilter)
        return false;
      if (statusFilter !== "all" && obs.status !== statusFilter) return false;
      if (deptFilter && !obs.department.toLowerCase().includes(deptFilter.toLowerCase()))
        return false;
      if (search) {
        const q = search.toLowerCase();
        if (!obs.obsNumber.toLowerCase().includes(q) && !obs.location.toLowerCase().includes(q) && !obs.observerName.toLowerCase().includes(q) && !obs.department.toLowerCase().includes(q))
          return false;
      }
      return true;
    });
  }, [
    observations,
    typeFilter,
    severityFilter,
    statusFilter,
    deptFilter,
    search,
    isPrivileged,
    isHOD,
    user
  ]);
  const hasActiveFilters = typeFilter !== "all" || severityFilter !== "all" || statusFilter !== "all" || deptFilter || search;
  const clearFilters = () => {
    setTypeFilter("all");
    setSeverityFilter("all");
    setStatusFilter("all");
    setDeptFilter("");
    setSearch("");
  };
  if (selected) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      ObservationDetailPanel,
      {
        obs: selected,
        canAcknowledge: isPrivileged,
        onBack: () => setSelected(null),
        onAcknowledge: (remarks) => ackMut.mutate({ obsNumber: selected.obsNumber, remarks }),
        onClose: () => closeMut.mutate(selected.obsNumber),
        isAcknowledging: ackMut.isPending,
        isClosing: closeMut.isPending
      }
    );
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6", "data-ocid": "observations.page", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("h1", { className: "section-header flex items-center gap-2 mb-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Eye, { className: "w-6 h-6 text-primary" }),
          "Safety Observations & BBS"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground text-sm", children: isPrivileged ? "All observations across departments" : isHOD ? `${(user == null ? void 0 : user.department) ?? "Your"} department observations` : "Your submitted observations" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Button,
          {
            variant: "outline",
            size: "sm",
            onClick: () => refetch(),
            "data-ocid": "observations.refresh_button",
            children: /* @__PURE__ */ jsxRuntimeExports.jsx(RefreshCw, { className: "w-4 h-4" })
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Button,
          {
            size: "sm",
            onClick: () => setShowSubmit(true),
            className: "gap-1.5",
            "data-ocid": "observations.new_button",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "w-4 h-4" }),
              "New Observation"
            ]
          }
        )
      ] })
    ] }),
    bbsStats && /* @__PURE__ */ jsxRuntimeExports.jsx(BbsStatsBar, { stats: bbsStats }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "elevated-card rounded-xl p-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap gap-3 items-center", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative flex-1 min-w-[180px]", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Search, { className: "absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Input,
          {
            placeholder: "Search OBS number, location, observer…",
            className: "pl-9",
            value: search,
            onChange: (e) => setSearch(e.target.value),
            "data-ocid": "observations.search_input"
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        Select,
        {
          value: typeFilter,
          onValueChange: (v) => setTypeFilter(v),
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              SelectTrigger,
              {
                className: "w-48",
                "data-ocid": "observations.type_filter",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Funnel, { className: "w-3.5 h-3.5 mr-1.5" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, { placeholder: "Type" })
                ]
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectContent, { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "all", children: "All Types" }),
              Object.values(ObservationType).map((t) => /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: t, children: obsTypeLabel(t) }, t))
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
                className: "w-36",
                "data-ocid": "observations.severity_filter",
                children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, { placeholder: "Severity" })
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectContent, { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "all", children: "All Severities" }),
              Object.values(ObservationSeverity).map((s) => /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: s, children: s }, s))
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
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              SelectTrigger,
              {
                className: "w-40",
                "data-ocid": "observations.status_filter",
                children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, { placeholder: "Status" })
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectContent, { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "all", children: "All Statuses" }),
              Object.values(ObservationStatus).map((s) => /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: s, children: obsStatusLabel(s) }, s))
            ] })
          ]
        }
      ),
      isPrivileged && /* @__PURE__ */ jsxRuntimeExports.jsx(
        Input,
        {
          placeholder: "Filter by dept…",
          className: "w-36",
          value: deptFilter,
          onChange: (e) => setDeptFilter(e.target.value),
          "data-ocid": "observations.dept_filter"
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
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "elevated-card rounded-xl overflow-hidden", children: isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-6 space-y-3", "data-ocid": "observations.loading_state", children: [...Array(5)].map((_, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-12 w-full" }, i)) }) : error ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-8 text-center", "data-ocid": "observations.error_state", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(TriangleAlert, { className: "w-8 h-8 text-destructive mx-auto mb-2" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-destructive font-medium", children: "Failed to load observations" }),
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
    ] }) : filtered.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "p-12 text-center",
        "data-ocid": "observations.empty_state",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(ShieldCheck, { className: "w-10 h-10 text-muted-foreground/40 mx-auto mb-3" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground font-medium", children: "No observations found" }),
          hasActiveFilters ? /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground/60 text-sm mt-1", children: "Try adjusting your filters" }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Button,
            {
              size: "sm",
              className: "mt-4",
              onClick: () => setShowSubmit(true),
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "w-4 h-4 mr-1.5" }),
                " Submit First Observation"
              ]
            }
          )
        ]
      }
    ) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "overflow-x-auto", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "w-full text-sm", "data-ocid": "observations.table", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "border-b border-border bg-muted/30", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-left px-4 py-3 text-muted-foreground font-medium whitespace-nowrap", children: "OBS #" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-left px-4 py-3 text-muted-foreground font-medium", children: "Type" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-left px-4 py-3 text-muted-foreground font-medium", children: "Severity" }),
        isPrivileged && /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-left px-4 py-3 text-muted-foreground font-medium", children: "Department" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-left px-4 py-3 text-muted-foreground font-medium", children: "Location" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-left px-4 py-3 text-muted-foreground font-medium", children: "Status" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-left px-4 py-3 text-muted-foreground font-medium whitespace-nowrap", children: "Date" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-left px-4 py-3 text-muted-foreground font-medium", children: "Action" })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("tbody", { children: filtered.map((obs, idx) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "tr",
        {
          className: "border-b border-border/50 hover:bg-muted/20 transition-colors cursor-pointer",
          onClick: () => setSelected(obs),
          onKeyDown: (e) => e.key === "Enter" && setSelected(obs),
          tabIndex: 0,
          "data-ocid": `observations.item.${idx + 1}`,
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-mono text-xs text-primary font-semibold", children: obs.obsNumber }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
              Badge,
              {
                variant: "outline",
                className: `text-xs border ${obsTypeClass(obs.obsType)}`,
                children: obsTypeLabel(obs.obsType)
              }
            ) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
              Badge,
              {
                variant: "outline",
                className: `text-xs border ${obsSeverityClass(obs.severity)}`,
                children: obs.severity
              }
            ) }),
            isPrivileged && /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 text-muted-foreground", children: obs.department }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 text-muted-foreground max-w-[130px] truncate", children: obs.location }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
              Badge,
              {
                variant: "outline",
                className: `text-xs border ${obsStatusClass(obs.status)}`,
                children: obsStatusLabel(obs.status)
              }
            ) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 text-muted-foreground whitespace-nowrap", children: formatTs(obs.dateTime) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
              Button,
              {
                variant: "ghost",
                size: "sm",
                className: "text-primary hover:text-primary h-7 px-2",
                onClick: (e) => {
                  e.stopPropagation();
                  setSelected(obs);
                },
                "data-ocid": `observations.view_button.${idx + 1}`,
                children: "View"
              }
            ) })
          ]
        },
        obs.obsNumber
      )) })
    ] }) }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      SubmitObsDialog,
      {
        open: showSubmit,
        onClose: () => setShowSubmit(false),
        onCreated: () => {
          qc.invalidateQueries({ queryKey: ["observations"] });
          qc.invalidateQueries({ queryKey: ["bbsStats"] });
        }
      }
    )
  ] });
}
export {
  ObservationsPage as default
};
