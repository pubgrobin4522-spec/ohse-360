import { u as useBackend, d as useAuth, h as useQueryClient, r as reactExports, f as useQuery, a7 as CAPAStatus2, j as jsxRuntimeExports, T as TriangleAlert, B as Button, I as Input, a8 as CAPASource2, n as ue, a9 as RootCauseCat, aa as CAPAType, i as useMutation, m as Label } from "./index-o5KNRZJC.js";
import { B as Badge } from "./badge-drMlJ0Eb.js";
import { S as Select, a as SelectTrigger, b as SelectValue, c as SelectContent, d as SelectItem } from "./select-DLpeTQN2.js";
import { S as Skeleton } from "./skeleton-FWJuhcbn.js";
import { T as Textarea } from "./textarea-DwLBGk5G.js";
import { T as TrendingDown } from "./trending-down-sdp8CbOH.js";
import { R as RefreshCw } from "./refresh-cw-C2ML6aao.js";
import { P as Plus, X } from "./x-CXE19MnU.js";
import { S as Search } from "./search-naONrdle.js";
import { F as Funnel } from "./funnel-zCB_4DbY.js";
import { C as Clock } from "./clock-DrVeXQTh.js";
import { A as ArrowLeft } from "./arrow-left-CjcMprl-.js";
import { C as CircleCheck } from "./circle-check-BdjlexTo.js";
import { R as ResponsiveContainer, C as Cell, T as Tooltip } from "./generateCategoricalChart-BOnoDJkg.js";
import { b as PieChart, c as Pie } from "./PieChart-CecCgq1x.js";
import { C as ChevronRight } from "./chevron-right-CrBkjx2r.js";
import "./index-BgKcp2pS.js";
function priorityClass(p) {
  switch (p) {
    case "Critical":
      return "bg-red-500/20 text-red-400 border-red-500/40";
    case "High":
      return "bg-orange-500/20 text-orange-400 border-orange-500/40";
    case "Medium":
      return "bg-amber-500/20 text-amber-400 border-amber-500/40";
    case "Low":
      return "bg-green-500/20 text-green-400 border-green-500/40";
    default:
      return "";
  }
}
function statusClass(s) {
  switch (s) {
    case CAPAStatus2.Open:
      return "bg-blue-500/20 text-blue-400 border-blue-500/40";
    case CAPAStatus2.InProgress:
      return "bg-amber-500/20 text-amber-400 border-amber-500/40";
    case CAPAStatus2.PendingVerification:
      return "bg-purple-500/20 text-purple-400 border-purple-500/40";
    case CAPAStatus2.Closed:
      return "bg-green-500/20 text-green-400 border-green-500/40";
    case CAPAStatus2.Overdue:
      return "bg-red-500/20 text-red-400 border-red-500/40";
  }
}
function formatStatus(s) {
  const labels = {
    [CAPAStatus2.Open]: "Open",
    [CAPAStatus2.InProgress]: "In Progress",
    [CAPAStatus2.PendingVerification]: "Pending Verification",
    [CAPAStatus2.Closed]: "Closed",
    [CAPAStatus2.Overdue]: "Overdue"
  };
  return labels[s] ?? s;
}
function formatSource(s) {
  const labels = {
    [CAPASource2.Incident]: "Incident",
    [CAPASource2.Observation]: "Observation",
    [CAPASource2.Audit]: "Audit",
    [CAPASource2.HIRA]: "HIRA",
    [CAPASource2.JSA]: "JSA",
    [CAPASource2.Manual]: "Manual"
  };
  return labels[s] ?? s;
}
function formatRootCause(r) {
  const labels = {
    [RootCauseCat.HumanError]: "Human Error",
    [RootCauseCat.EquipmentFailure]: "Equipment Failure",
    [RootCauseCat.ProcedureGap]: "Procedure Gap",
    [RootCauseCat.TrainingGap]: "Training Gap",
    [RootCauseCat.Environmental]: "Environmental",
    [RootCauseCat.ManagementSystem]: "Management System"
  };
  return labels[r] ?? r;
}
function getDaysRemaining(targetDate) {
  const target = new Date(targetDate);
  const now = /* @__PURE__ */ new Date();
  return Math.ceil((target.getTime() - now.getTime()) / (1e3 * 60 * 60 * 24));
}
const SOURCE_COLORS = {
  Incident: "#f87171",
  Observation: "#fb923c",
  Audit: "#facc15",
  HIRA: "#34d399",
  JSA: "#60a5fa",
  Manual: "#a78bfa"
};
function CreateCAPAModal({ onClose, onCreated }) {
  const { actor, token } = useBackend();
  const [form, setForm] = reactExports.useState({
    source: CAPASource2.Manual,
    linkedRecord: "",
    capaType: CAPAType.Corrective,
    findingDesc: "",
    rootCauseCat: RootCauseCat.HumanError,
    rootCauseDesc: "",
    actionDesc: "",
    actionOwnerEmpId: "",
    department: "",
    targetDate: "",
    priority: "Medium"
  });
  const mut = useMutation({
    mutationFn: async () => {
      if (!actor || !token) throw new Error("Not authenticated");
      const ownerId = BigInt(form.actionOwnerEmpId);
      if (Number.isNaN(Number(form.actionOwnerEmpId)))
        throw new Error("Action Owner Employee ID must be numeric");
      const input = {
        source: form.source,
        linkedRecordNumber: form.linkedRecord,
        capaType: form.capaType,
        findingDescription: form.findingDesc,
        rootCauseCat: form.rootCauseCat,
        rootCauseDesc: form.rootCauseDesc,
        actionDescription: form.actionDesc,
        actionOwnerEmpId: ownerId,
        department: form.department,
        targetDate: form.targetDate,
        priority: form.priority
      };
      const res = await actor.createCapa2(token, input);
      if (res.__kind__ === "err") throw new Error(res.err);
      return res.ok;
    },
    onSuccess: (num) => {
      ue.success(`CAPA ${num} created`);
      onCreated(num);
    },
    onError: (e) => ue.error(e.message)
  });
  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "div",
    {
      className: "fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4",
      "data-ocid": "capa.dialog",
      children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "elevated-card rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between p-6 border-b border-border", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-lg font-bold text-foreground", children: "New CAPA" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              variant: "ghost",
              size: "sm",
              onClick: onClose,
              "data-ocid": "capa.close_button",
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "w-4 h-4" })
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-6 space-y-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Source" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                Select,
                {
                  value: form.source,
                  onValueChange: (v) => set("source", v),
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { "data-ocid": "capa.source_select", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, {}) }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(SelectContent, { children: Object.values(CAPASource2).map((s) => /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: s, children: formatSource(s) }, s)) })
                  ]
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Linked Record #" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Input,
                {
                  placeholder: "e.g. INC-2026-0012",
                  value: form.linkedRecord,
                  onChange: (e) => set("linkedRecord", e.target.value),
                  "data-ocid": "capa.linked_record_input"
                }
              )
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "CAPA Type" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                Select,
                {
                  value: form.capaType,
                  onValueChange: (v) => set("capaType", v),
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { "data-ocid": "capa.type_select", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, {}) }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectContent, { children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: CAPAType.Corrective, children: "Corrective" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: CAPAType.Preventive, children: "Preventive" })
                    ] })
                  ]
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Priority" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                Select,
                {
                  value: form.priority,
                  onValueChange: (v) => set("priority", v),
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { "data-ocid": "capa.priority_select", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, {}) }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(SelectContent, { children: ["Low", "Medium", "High", "Critical"].map((p) => /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: p, children: p }, p)) })
                  ]
                }
              )
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Finding Description" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Textarea,
              {
                rows: 3,
                placeholder: "Describe the finding or non-conformance…",
                value: form.findingDesc,
                onChange: (e) => set("findingDesc", e.target.value),
                "data-ocid": "capa.finding_textarea"
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Root Cause Category" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                Select,
                {
                  value: form.rootCauseCat,
                  onValueChange: (v) => set("rootCauseCat", v),
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { "data-ocid": "capa.root_cause_cat_select", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, {}) }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(SelectContent, { children: Object.values(RootCauseCat).map((r) => /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: r, children: formatRootCause(r) }, r)) })
                  ]
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Department" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Input,
                {
                  placeholder: "e.g. Maintenance",
                  value: form.department,
                  onChange: (e) => set("department", e.target.value),
                  "data-ocid": "capa.department_input"
                }
              )
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Root Cause Description" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Textarea,
              {
                rows: 2,
                placeholder: "Explain the root cause in detail…",
                value: form.rootCauseDesc,
                onChange: (e) => set("rootCauseDesc", e.target.value),
                "data-ocid": "capa.root_cause_desc_textarea"
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Action Description" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Textarea,
              {
                rows: 2,
                placeholder: "Corrective/preventive action to be taken…",
                value: form.actionDesc,
                onChange: (e) => set("actionDesc", e.target.value),
                "data-ocid": "capa.action_desc_textarea"
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Action Owner Employee ID" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Input,
                {
                  placeholder: "e.g. 100123",
                  value: form.actionOwnerEmpId,
                  onChange: (e) => set("actionOwnerEmpId", e.target.value),
                  "data-ocid": "capa.action_owner_input"
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Target Date" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Input,
                {
                  type: "date",
                  value: form.targetDate,
                  onChange: (e) => set("targetDate", e.target.value),
                  "data-ocid": "capa.target_date_input"
                }
              )
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-end gap-3 p-6 border-t border-border", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              variant: "outline",
              onClick: onClose,
              "data-ocid": "capa.cancel_button",
              children: "Cancel"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              onClick: () => mut.mutate(),
              disabled: mut.isPending || !form.findingDesc || !form.actionDesc || !form.targetDate || !form.actionOwnerEmpId,
              "data-ocid": "capa.submit_button",
              children: mut.isPending ? "Creating…" : "Create CAPA"
            }
          )
        ] })
      ] })
    }
  );
}
function ProgressUpdateModal({ capa, onClose, onUpdated }) {
  const { actor, token } = useBackend();
  const [progress, setProgress] = reactExports.useState(capa.progressUpdate);
  const [evidence, setEvidence] = reactExports.useState(capa.completionEvidence ?? "");
  const [submitForVerif, setSubmitForVerif] = reactExports.useState(false);
  const qc = useQueryClient();
  const updateMut = useMutation({
    mutationFn: async () => {
      if (!actor || !token) throw new Error("Not authenticated");
      const res = await actor.updateCapa2Progress(
        token,
        capa.capaNumber,
        progress,
        evidence || null
      );
      if (res.__kind__ === "err") throw new Error(res.err);
      if (submitForVerif) {
        const res2 = await actor.submitCapa2ForVerification(
          token,
          capa.capaNumber
        );
        if (res2.__kind__ === "err") throw new Error(res2.err);
      }
    },
    onSuccess: () => {
      ue.success(
        submitForVerif ? "Submitted for verification" : "Progress updated"
      );
      qc.invalidateQueries({ queryKey: ["capa2s"] });
      qc.invalidateQueries({ queryKey: ["capa2-stats"] });
      onUpdated();
    },
    onError: (e) => ue.error(e.message)
  });
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "div",
    {
      className: "fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4",
      "data-ocid": "capa.progress_dialog",
      children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "elevated-card rounded-2xl w-full max-w-lg", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between p-5 border-b border-border", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-bold text-foreground", children: "Update Progress" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mt-0.5", children: capa.capaNumber })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "ghost", size: "sm", onClick: onClose, children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "w-4 h-4" }) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-5 space-y-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Progress Update" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Textarea,
              {
                rows: 4,
                placeholder: "Describe actions taken so far…",
                value: progress,
                onChange: (e) => setProgress(e.target.value),
                "data-ocid": "capa.progress_textarea"
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Completion Evidence (URL or reference)" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Input,
              {
                placeholder: "e.g. https://docs.example.com/evidence.pdf",
                value: evidence,
                onChange: (e) => setEvidence(e.target.value),
                "data-ocid": "capa.evidence_input"
              }
            )
          ] }),
          capa.status === CAPAStatus2.InProgress && /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "flex items-center gap-2 cursor-pointer", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "input",
              {
                type: "checkbox",
                checked: submitForVerif,
                onChange: (e) => setSubmitForVerif(e.target.checked),
                className: "rounded border-border",
                "data-ocid": "capa.submit_verif_checkbox"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm text-foreground", children: "Submit for Safety Officer verification" })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-end gap-3 p-5 border-t border-border", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "outline", onClick: onClose, children: "Cancel" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              onClick: () => updateMut.mutate(),
              disabled: updateMut.isPending || !progress,
              "data-ocid": "capa.save_progress_button",
              children: updateMut.isPending ? "Saving…" : "Save Progress"
            }
          )
        ] })
      ] })
    }
  );
}
function VerifyModal({ capa, onClose, onDone }) {
  const { actor, token } = useBackend();
  const [remarks, setRemarks] = reactExports.useState("");
  const qc = useQueryClient();
  const mut = useMutation({
    mutationFn: async (approved) => {
      if (!actor || !token) throw new Error("Not authenticated");
      const res = await actor.verifyCapa2(
        token,
        capa.capaNumber,
        approved,
        remarks
      );
      if (res.__kind__ === "err") throw new Error(res.err);
    },
    onSuccess: (_, approved) => {
      ue.success(
        approved ? "CAPA verified and closed" : "CAPA returned to In Progress"
      );
      qc.invalidateQueries({ queryKey: ["capa2s"] });
      qc.invalidateQueries({ queryKey: ["capa2-stats"] });
      onDone();
    },
    onError: (e) => ue.error(e.message)
  });
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "div",
    {
      className: "fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4",
      "data-ocid": "capa.verify_dialog",
      children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "elevated-card rounded-2xl w-full max-w-md", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between p-5 border-b border-border", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-bold text-foreground", children: "Verify CAPA" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "ghost", size: "sm", onClick: onClose, children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "w-4 h-4" }) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-5 space-y-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "Review completion evidence and remarks before deciding." }),
          capa.completionEvidence && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-3 rounded-lg bg-muted/30 text-sm", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground", children: "Evidence: " }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-foreground break-all", children: capa.completionEvidence })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Verification Remarks" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Textarea,
              {
                rows: 3,
                placeholder: "Add remarks…",
                value: remarks,
                onChange: (e) => setRemarks(e.target.value),
                "data-ocid": "capa.verify_remarks_textarea"
              }
            )
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-end gap-3 p-5 border-t border-border", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              variant: "outline",
              onClick: () => mut.mutate(false),
              disabled: mut.isPending,
              className: "border-amber-500/40 text-amber-400 hover:bg-amber-500/10",
              "data-ocid": "capa.return_to_progress_button",
              children: "Return to In Progress"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              onClick: () => mut.mutate(true),
              disabled: mut.isPending,
              className: "bg-green-600 hover:bg-green-700 text-white",
              "data-ocid": "capa.verify_close_button",
              children: mut.isPending ? "Processing…" : "Verify & Close"
            }
          )
        ] })
      ] })
    }
  );
}
const STATUS_STEPS = [
  CAPAStatus2.Open,
  CAPAStatus2.InProgress,
  CAPAStatus2.PendingVerification,
  CAPAStatus2.Closed
];
function StatusTimeline({ status }) {
  const activeIdx = status === CAPAStatus2.Overdue ? 1 : STATUS_STEPS.indexOf(status);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1", children: [
    STATUS_STEPS.map((step, idx) => {
      const isActive = idx === activeIdx;
      const isDone = idx < activeIdx || status === CAPAStatus2.Closed;
      return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: `flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium transition-smooth ${isDone ? "bg-green-500/20 text-green-400" : isActive ? status === CAPAStatus2.Overdue ? "bg-red-500/20 text-red-400 ring-1 ring-red-500/50" : "bg-primary/20 text-primary ring-1 ring-primary/50" : "bg-muted/30 text-muted-foreground"}`,
            children: [
              isDone ? /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "w-3 h-3" }) : /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "w-3 h-3 rounded-full border border-current opacity-60" }),
              formatStatus(step)
            ]
          }
        ),
        idx < STATUS_STEPS.length - 1 && /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronRight, { className: "w-3.5 h-3.5 text-muted-foreground/40" })
      ] }, step);
    }),
    status === CAPAStatus2.Overdue && /* @__PURE__ */ jsxRuntimeExports.jsx(
      Badge,
      {
        variant: "outline",
        className: "ml-1 text-xs border-red-500/40 bg-red-500/20 text-red-400",
        children: "OVERDUE"
      }
    )
  ] });
}
function CAPADetailView({
  capa,
  isSafetyAdmin,
  currentEmpId,
  onBack,
  onRefresh
}) {
  const [showProgress, setShowProgress] = reactExports.useState(false);
  const [showVerify, setShowVerify] = reactExports.useState(false);
  const isOwner = currentEmpId !== null && currentEmpId === capa.actionOwnerEmpId;
  const canUpdateProgress = isOwner && (capa.status === CAPAStatus2.Open || capa.status === CAPAStatus2.InProgress || capa.status === CAPAStatus2.Overdue);
  const canVerify = isSafetyAdmin && capa.status === CAPAStatus2.PendingVerification;
  const daysLeft = getDaysRemaining(capa.targetDate);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-5", "data-ocid": "capa.detail_panel", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        Button,
        {
          variant: "ghost",
          size: "sm",
          onClick: onBack,
          className: "gap-1.5",
          "data-ocid": "capa.back_button",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowLeft, { className: "w-4 h-4" }),
            " Back to List"
          ]
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2", children: [
        canUpdateProgress && /* @__PURE__ */ jsxRuntimeExports.jsx(
          Button,
          {
            size: "sm",
            variant: "outline",
            onClick: () => setShowProgress(true),
            "data-ocid": "capa.update_progress_button",
            children: "Update Progress"
          }
        ),
        canVerify && /* @__PURE__ */ jsxRuntimeExports.jsx(
          Button,
          {
            size: "sm",
            className: "bg-green-600 hover:bg-green-700 text-white",
            onClick: () => setShowVerify(true),
            "data-ocid": "capa.verify_button",
            children: "Verify & Close"
          }
        )
      ] })
    ] }),
    capa.isOverdue && capa.status !== CAPAStatus2.Closed && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 p-4 rounded-xl bg-red-500/10 border border-red-500/30", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(TriangleAlert, { className: "w-5 h-5 text-red-400 shrink-0" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-red-400 font-semibold text-sm", children: "OVERDUE" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-red-400/70 text-xs", children: [
          "Target was ",
          capa.targetDate,
          " — ",
          Math.abs(daysLeft),
          " day(s) past deadline"
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "elevated-card rounded-xl p-5", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap items-start justify-between gap-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-mono text-xs text-muted-foreground", children: capa.capaNumber }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("h2", { className: "text-xl font-bold text-foreground mt-1", children: [
            capa.capaType,
            " CAPA"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground text-sm mt-1", children: capa.department })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Badge,
            {
              variant: "outline",
              className: `border ${statusClass(capa.status)}`,
              children: formatStatus(capa.status)
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Badge,
            {
              variant: "outline",
              className: `border ${priorityClass(capa.priority)}`,
              children: capa.priority
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Badge,
            {
              variant: "outline",
              className: "border-muted text-muted-foreground",
              children: formatSource(capa.source)
            }
          )
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-5 pt-4 border-t border-border overflow-x-auto", children: /* @__PURE__ */ jsxRuntimeExports.jsx(StatusTimeline, { status: capa.status }) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "elevated-card rounded-xl p-5 space-y-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-semibold text-foreground text-sm", children: "Finding Details" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "stat-label", children: "Finding Description" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-foreground text-sm mt-1 leading-relaxed", children: capa.findingDescription })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "stat-label", children: "Root Cause Category" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-foreground text-sm mt-1", children: formatRootCause(capa.rootCauseCat) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "stat-label", children: "Root Cause Description" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-foreground text-sm mt-1 leading-relaxed", children: capa.rootCauseDesc || "—" })
        ] }),
        capa.linkedRecordNumber && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "stat-label", children: "Linked Record" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-mono text-sm text-primary mt-1", children: capa.linkedRecordNumber })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "elevated-card rounded-xl p-5 space-y-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-semibold text-foreground text-sm", children: "Action Details" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "stat-label", children: "Action Description" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-foreground text-sm mt-1 leading-relaxed", children: capa.actionDescription })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "stat-label", children: "Action Owner" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-foreground text-sm mt-1", children: [
            "Emp ID: ",
            String(capa.actionOwnerEmpId)
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "stat-label", children: "Target Date" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "p",
              {
                className: `text-sm mt-1 font-medium ${capa.isOverdue && capa.status !== CAPAStatus2.Closed ? "text-red-400" : daysLeft <= 3 ? "text-amber-400" : "text-foreground"}`,
                children: [
                  capa.targetDate,
                  capa.status !== CAPAStatus2.Closed && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs text-muted-foreground ml-1", children: [
                    "(",
                    daysLeft > 0 ? `${daysLeft}d left` : `${Math.abs(daysLeft)}d overdue`,
                    ")"
                  ] })
                ]
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "stat-label", children: "Created" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-foreground text-sm mt-1", children: new Date(
              Number(capa.createdAt) / 1e6
            ).toLocaleDateString() })
          ] })
        ] })
      ] })
    ] }),
    capa.progressUpdate && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "elevated-card rounded-xl p-5", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-semibold text-foreground text-sm mb-3", children: "Progress Update" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-foreground text-sm leading-relaxed", children: capa.progressUpdate }),
      capa.completionEvidence && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-3 pt-3 border-t border-border", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "stat-label mb-1", children: "Completion Evidence" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-primary break-all", children: capa.completionEvidence })
      ] })
    ] }),
    capa.status === CAPAStatus2.Closed && capa.verifiedByEmpId && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 p-4 rounded-xl bg-green-500/10 border border-green-500/30", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "w-5 h-5 text-green-400 shrink-0" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-green-400 font-semibold text-sm", children: "Verified & Closed" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-green-400/70 text-xs", children: [
          "By Emp ID ",
          String(capa.verifiedByEmpId),
          " on",
          " ",
          capa.verifiedAt ? new Date(
            Number(capa.verifiedAt) / 1e6
          ).toLocaleDateString() : "—"
        ] })
      ] })
    ] }),
    showProgress && /* @__PURE__ */ jsxRuntimeExports.jsx(
      ProgressUpdateModal,
      {
        capa,
        onClose: () => setShowProgress(false),
        onUpdated: () => {
          setShowProgress(false);
          onRefresh();
        }
      }
    ),
    showVerify && /* @__PURE__ */ jsxRuntimeExports.jsx(
      VerifyModal,
      {
        capa,
        onClose: () => setShowVerify(false),
        onDone: () => {
          setShowVerify(false);
          onRefresh();
        }
      }
    )
  ] });
}
function StatsDashboard({ stats }) {
  const sourceData = stats.bySource.map(([name, value]) => ({
    name,
    value: Number(value),
    color: SOURCE_COLORS[name] ?? "#60a5fa"
  }));
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3", children: [
    [
      {
        label: "Total",
        value: Number(stats.total),
        cls: "text-foreground"
      },
      { label: "Open", value: Number(stats.open), cls: "text-blue-400" },
      {
        label: "In Progress",
        value: Number(stats.inProgress),
        cls: "text-amber-400"
      },
      {
        label: "Overdue",
        value: Number(stats.overdue),
        cls: "text-red-400"
      },
      {
        label: "Closure Rate",
        value: `${Number(stats.closureRate)}%`,
        cls: "text-green-400"
      },
      {
        label: "Avg Days Close",
        value: stats.avgDaysToClose.toFixed(1),
        cls: "text-cyan-400"
      }
    ].map(({ label, value, cls }) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: `elevated-card rounded-xl p-4 text-center ${label === "Overdue" && Number(stats.overdue) > 0 ? "ring-1 ring-red-500/40" : ""}`,
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `text-2xl font-bold font-mono ${cls}`, children: String(value) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "stat-label mt-1", children: label })
        ]
      },
      label
    )),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "elevated-card rounded-xl p-4 col-span-2 sm:col-span-1", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "stat-label mb-2 text-center", children: "By Source" }),
      sourceData.length > 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx(ResponsiveContainer, { width: "100%", height: 80, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(PieChart, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Pie,
          {
            data: sourceData,
            dataKey: "value",
            cx: "50%",
            cy: "50%",
            innerRadius: 22,
            outerRadius: 36,
            strokeWidth: 0,
            children: sourceData.map((entry) => /* @__PURE__ */ jsxRuntimeExports.jsx(Cell, { fill: entry.color }, entry.name))
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Tooltip,
          {
            contentStyle: {
              background: "hsl(var(--card))",
              border: "1px solid hsl(var(--border))",
              borderRadius: "8px",
              fontSize: "11px",
              color: "hsl(var(--foreground))"
            }
          }
        )
      ] }) }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-20 flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground text-xs", children: "No data" }) })
    ] })
  ] });
}
function CAPAPage() {
  const { actor, token, isReady } = useBackend();
  const { user } = useAuth();
  const qc = useQueryClient();
  const [statusFilter, setStatusFilter] = reactExports.useState("all");
  const [priorityFilter, setPriorityFilter] = reactExports.useState(
    "all"
  );
  const [sourceFilter, setSourceFilter] = reactExports.useState("all");
  const [deptFilter, setDeptFilter] = reactExports.useState("");
  const [search, setSearch] = reactExports.useState("");
  const [showCreate, setShowCreate] = reactExports.useState(false);
  const [selected, setSelected] = reactExports.useState(null);
  const isSafetyAdmin = (user == null ? void 0 : user.role) === "SafetyOfficer" || (user == null ? void 0 : user.role) === "SystemAdmin";
  const isHOD = (user == null ? void 0 : user.role) === "HOD";
  const currentEmpId = (user == null ? void 0 : user.employeeId) ?? null;
  const {
    data: capas,
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: ["capa2s"],
    queryFn: async () => {
      if (!actor || !token) return [];
      const res = await actor.listCapa2s(token);
      if (res.__kind__ === "err") throw new Error(res.err);
      return res.ok;
    },
    enabled: isReady
  });
  const { data: statsData } = useQuery({
    queryKey: ["capa2-stats"],
    queryFn: async () => {
      if (!actor || !token) return null;
      const res = await actor.getCapa2Stats(token);
      if (res.__kind__ === "err") throw new Error(res.err);
      return res.ok;
    },
    enabled: isReady
  });
  const refreshSelected = async () => {
    if (!actor || !token || !selected) return;
    const res = await actor.getCapa2(token, selected.capaNumber);
    if (res.__kind__ === "ok") setSelected(res.ok);
    refetch();
  };
  const filtered = reactExports.useMemo(() => {
    if (!capas) return [];
    return capas.filter((c) => {
      if (statusFilter !== "all" && c.status !== statusFilter) return false;
      if (priorityFilter !== "all" && c.priority !== priorityFilter)
        return false;
      if (sourceFilter !== "all" && c.source !== sourceFilter) return false;
      if (deptFilter && !c.department.toLowerCase().includes(deptFilter.toLowerCase()))
        return false;
      if (isHOD && (user == null ? void 0 : user.department) && c.department !== user.department)
        return false;
      if (!isSafetyAdmin && !isHOD && currentEmpId !== null && c.actionOwnerEmpId !== currentEmpId)
        return false;
      if (search) {
        const q = search.toLowerCase();
        if (!c.capaNumber.toLowerCase().includes(q) && !c.department.toLowerCase().includes(q) && !c.findingDescription.toLowerCase().includes(q))
          return false;
      }
      return true;
    });
  }, [
    capas,
    statusFilter,
    priorityFilter,
    sourceFilter,
    deptFilter,
    search,
    isSafetyAdmin,
    isHOD,
    user,
    currentEmpId
  ]);
  const clearFilters = () => {
    setStatusFilter("all");
    setPriorityFilter("all");
    setSourceFilter("all");
    setDeptFilter("");
    setSearch("");
  };
  const hasActive = statusFilter !== "all" || priorityFilter !== "all" || sourceFilter !== "all" || deptFilter || search;
  const overdueCount = (capas == null ? void 0 : capas.filter((c) => c.isOverdue && c.status !== CAPAStatus2.Closed).length) ?? 0;
  if (selected) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      CAPADetailView,
      {
        capa: selected,
        isSafetyAdmin,
        currentEmpId: currentEmpId ?? null,
        onBack: () => setSelected(null),
        onRefresh: refreshSelected
      }
    );
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6", "data-ocid": "capa.page", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("h1", { className: "section-header flex items-center gap-2 mb-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(TrendingDown, { className: "w-6 h-6 text-primary" }),
          "CAPA Tracking"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground text-sm", children: isSafetyAdmin ? "All corrective & preventive actions" : isHOD ? `Department: ${(user == null ? void 0 : user.department) ?? "—"}` : "Your assigned actions" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
        overdueCount > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-red-500/20 border border-red-500/30", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(TriangleAlert, { className: "w-3.5 h-3.5 text-red-400" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-red-400 text-xs font-semibold", children: [
            overdueCount,
            " Overdue"
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Button,
          {
            variant: "outline",
            size: "sm",
            onClick: () => {
              refetch();
              qc.invalidateQueries({ queryKey: ["capa2-stats"] });
            },
            "data-ocid": "capa.refresh_button",
            children: /* @__PURE__ */ jsxRuntimeExports.jsx(RefreshCw, { className: "w-4 h-4" })
          }
        ),
        isSafetyAdmin && /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Button,
          {
            size: "sm",
            onClick: () => setShowCreate(true),
            className: "gap-1.5",
            "data-ocid": "capa.create_button",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "w-4 h-4" }),
              " New CAPA"
            ]
          }
        )
      ] })
    ] }),
    statsData && /* @__PURE__ */ jsxRuntimeExports.jsx(StatsDashboard, { stats: statsData }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "elevated-card rounded-xl p-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap gap-3 items-center", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative flex-1 min-w-[180px]", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Search, { className: "absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Input,
          {
            placeholder: "Search CAPA number, dept, finding…",
            className: "pl-9",
            value: search,
            onChange: (e) => setSearch(e.target.value),
            "data-ocid": "capa.search_input"
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        Select,
        {
          value: statusFilter,
          onValueChange: (v) => setStatusFilter(v),
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectTrigger, { className: "w-44", "data-ocid": "capa.status_filter", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Funnel, { className: "w-3.5 h-3.5 mr-1.5" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, { placeholder: "Status" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectContent, { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "all", children: "All Statuses" }),
              Object.values(CAPAStatus2).map((s) => /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: s, children: formatStatus(s) }, s))
            ] })
          ]
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        Select,
        {
          value: priorityFilter,
          onValueChange: (v) => setPriorityFilter(v),
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { className: "w-36", "data-ocid": "capa.priority_filter", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, { placeholder: "Priority" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectContent, { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "all", children: "All Priorities" }),
              ["Low", "Medium", "High", "Critical"].map(
                (p) => /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: p, children: p }, p)
              )
            ] })
          ]
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        Select,
        {
          value: sourceFilter,
          onValueChange: (v) => setSourceFilter(v),
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { className: "w-36", "data-ocid": "capa.source_filter", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, { placeholder: "Source" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectContent, { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "all", children: "All Sources" }),
              Object.values(CAPASource2).map((s) => /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: s, children: formatSource(s) }, s))
            ] })
          ]
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Input,
        {
          placeholder: "Department…",
          className: "w-36",
          value: deptFilter,
          onChange: (e) => setDeptFilter(e.target.value),
          "data-ocid": "capa.dept_filter_input"
        }
      ),
      hasActive && /* @__PURE__ */ jsxRuntimeExports.jsxs(
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
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "elevated-card rounded-xl overflow-hidden", children: isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-6 space-y-3", "data-ocid": "capa.loading_state", children: [...Array(5)].map((_, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-12 w-full" }, i)) }) : error ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-8 text-center", "data-ocid": "capa.error_state", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(TriangleAlert, { className: "w-8 h-8 text-destructive mx-auto mb-2" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-destructive font-medium", children: "Failed to load CAPAs" }),
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
    ] }) : filtered.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-12 text-center", "data-ocid": "capa.empty_state", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(TrendingDown, { className: "w-10 h-10 text-muted-foreground/40 mx-auto mb-3" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground font-medium", children: "No CAPAs found" }),
      hasActive ? /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground/60 text-sm mt-1", children: "Try adjusting your filters" }) : isSafetyAdmin ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
        Button,
        {
          size: "sm",
          className: "mt-4",
          onClick: () => setShowCreate(true),
          "data-ocid": "capa.create_first_button",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "w-4 h-4 mr-1.5" }),
            " Create First CAPA"
          ]
        }
      ) : /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground/60 text-sm mt-1", children: "No actions assigned to you yet" })
    ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "overflow-x-auto", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "w-full text-sm", "data-ocid": "capa.table", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "border-b border-border bg-muted/30", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-left px-4 py-3 text-muted-foreground font-medium whitespace-nowrap", children: "CAPA #" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-left px-4 py-3 text-muted-foreground font-medium", children: "Source" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-left px-4 py-3 text-muted-foreground font-medium", children: "Type" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-left px-4 py-3 text-muted-foreground font-medium", children: "Priority" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-left px-4 py-3 text-muted-foreground font-medium", children: "Owner" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-left px-4 py-3 text-muted-foreground font-medium", children: "Department" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-left px-4 py-3 text-muted-foreground font-medium whitespace-nowrap", children: "Target Date" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-left px-4 py-3 text-muted-foreground font-medium", children: "Status" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-right px-4 py-3 text-muted-foreground font-medium whitespace-nowrap", children: "Days Left" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3" })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("tbody", { children: filtered.map((c, idx) => {
        const days = getDaysRemaining(c.targetDate);
        const rowOverdue = c.isOverdue && c.status !== CAPAStatus2.Closed;
        return /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "tr",
          {
            className: `border-b border-border/50 cursor-pointer transition-colors ${rowOverdue ? "bg-red-500/5 hover:bg-red-500/10" : "hover:bg-muted/20"}`,
            onClick: () => setSelected(c),
            onKeyDown: (e) => e.key === "Enter" && setSelected(c),
            tabIndex: 0,
            "data-ocid": `capa.item.${idx + 1}`,
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("td", { className: "px-4 py-3", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-mono text-xs text-primary font-semibold", children: c.capaNumber }),
                rowOverdue && /* @__PURE__ */ jsxRuntimeExports.jsx(TriangleAlert, { className: "inline w-3 h-3 text-red-400 ml-1.5" })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                Badge,
                {
                  variant: "outline",
                  className: "text-xs border-muted text-muted-foreground",
                  children: formatSource(c.source)
                }
              ) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 text-foreground", children: c.capaType }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                Badge,
                {
                  variant: "outline",
                  className: `text-xs border ${priorityClass(c.priority)}`,
                  children: c.priority
                }
              ) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 text-muted-foreground font-mono text-xs", children: String(c.actionOwnerEmpId) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 text-muted-foreground max-w-[120px] truncate", children: c.department }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 text-muted-foreground whitespace-nowrap", children: c.targetDate }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                Badge,
                {
                  variant: "outline",
                  className: `text-xs border ${statusClass(c.status)}`,
                  children: formatStatus(c.status)
                }
              ) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 text-right", children: c.status === CAPAStatus2.Closed ? /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-green-400 text-xs", children: "✓ Done" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(
                "span",
                {
                  className: `text-xs font-mono ${days < 0 ? "text-red-400" : days <= 3 ? "text-amber-400" : "text-muted-foreground"}`,
                  children: days < 0 ? `${Math.abs(days)}d ago` : `${days}d`
                }
              ) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                Button,
                {
                  variant: "ghost",
                  size: "sm",
                  className: "text-primary hover:text-primary h-7 px-2",
                  onClick: (e) => {
                    e.stopPropagation();
                    setSelected(c);
                  },
                  "data-ocid": `capa.view_button.${idx + 1}`,
                  children: "View"
                }
              ) })
            ]
          },
          c.capaNumber
        );
      }) })
    ] }) }) }),
    overdueCount > 0 && !isLoading && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "elevated-card rounded-xl p-4 border-red-500/30 ring-1 ring-red-500/20", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mb-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Clock, { className: "w-4 h-4 text-red-400" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("h3", { className: "font-semibold text-red-400 text-sm", children: [
          overdueCount,
          " Overdue CAPA",
          overdueCount !== 1 ? "s" : "",
          " Require Attention"
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-wrap gap-2", children: capas == null ? void 0 : capas.filter((c) => c.isOverdue && c.status !== CAPAStatus2.Closed).map((c) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "button",
        {
          type: "button",
          onClick: () => setSelected(c),
          className: "flex items-center gap-2 px-3 py-1.5 rounded-lg bg-red-500/10 border border-red-500/30 hover:bg-red-500/20 transition-smooth",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-mono text-xs text-red-400", children: c.capaNumber }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Badge,
              {
                variant: "outline",
                className: `text-xs border ${priorityClass(c.priority)}`,
                children: c.priority
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground", children: c.department })
          ]
        },
        c.capaNumber
      )) })
    ] }),
    showCreate && /* @__PURE__ */ jsxRuntimeExports.jsx(
      CreateCAPAModal,
      {
        onClose: () => setShowCreate(false),
        onCreated: (num) => {
          setShowCreate(false);
          qc.invalidateQueries({ queryKey: ["capa2s"] });
          qc.invalidateQueries({ queryKey: ["capa2-stats"] });
          ue.success(`${num} created successfully`);
        }
      }
    )
  ] });
}
export {
  CAPAPage as default
};
