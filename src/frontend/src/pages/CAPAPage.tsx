import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  AlertTriangle,
  ArrowLeft,
  CheckCircle2,
  ChevronRight,
  Clock,
  Filter,
  Plus,
  RefreshCw,
  Search,
  TrendingDown,
  X,
} from "lucide-react";
import { useMemo, useState } from "react";
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import { toast } from "sonner";
import {
  type CAPA2View,
  CAPASource2,
  CAPAStatus2,
  CAPAType,
  type CreateCAPAInput,
  RootCauseCat,
} from "../backend";

type CAPAPriority = "Low" | "Medium" | "High" | "Critical";
import { useAuth } from "../hooks/useAuth";
import { useBackend } from "../hooks/useBackend";

// ─── Helpers ────────────────────────────────────────────────────────────────
function priorityClass(p: CAPAPriority): string {
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

function statusClass(s: CAPAStatus2): string {
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

function formatStatus(s: CAPAStatus2): string {
  const labels: Record<CAPAStatus2, string> = {
    [CAPAStatus2.Open]: "Open",
    [CAPAStatus2.InProgress]: "In Progress",
    [CAPAStatus2.PendingVerification]: "Pending Verification",
    [CAPAStatus2.Closed]: "Closed",
    [CAPAStatus2.Overdue]: "Overdue",
  };
  return labels[s] ?? s;
}

function formatSource(s: CAPASource2): string {
  const labels: Record<CAPASource2, string> = {
    [CAPASource2.Incident]: "Incident",
    [CAPASource2.Observation]: "Observation",
    [CAPASource2.Audit]: "Audit",
    [CAPASource2.HIRA]: "HIRA",
    [CAPASource2.JSA]: "JSA",
    [CAPASource2.Manual]: "Manual",
  };
  return labels[s] ?? s;
}

function formatRootCause(r: RootCauseCat): string {
  const labels: Record<RootCauseCat, string> = {
    [RootCauseCat.HumanError]: "Human Error",
    [RootCauseCat.EquipmentFailure]: "Equipment Failure",
    [RootCauseCat.ProcedureGap]: "Procedure Gap",
    [RootCauseCat.TrainingGap]: "Training Gap",
    [RootCauseCat.Environmental]: "Environmental",
    [RootCauseCat.ManagementSystem]: "Management System",
  };
  return labels[r] ?? r;
}

function getDaysRemaining(targetDate: string): number {
  const target = new Date(targetDate);
  const now = new Date();
  return Math.ceil((target.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
}

const SOURCE_COLORS: Record<string, string> = {
  Incident: "#f87171",
  Observation: "#fb923c",
  Audit: "#facc15",
  HIRA: "#34d399",
  JSA: "#60a5fa",
  Manual: "#a78bfa",
};

// ─── Create CAPA Modal ───────────────────────────────────────────────────────
interface CreateCAPAModalProps {
  onClose: () => void;
  onCreated: (num: string) => void;
}

function CreateCAPAModal({ onClose, onCreated }: CreateCAPAModalProps) {
  const { actor, token } = useBackend();
  const [form, setForm] = useState<{
    source: CAPASource2;
    linkedRecord: string;
    capaType: CAPAType;
    findingDesc: string;
    rootCauseCat: RootCauseCat;
    rootCauseDesc: string;
    actionDesc: string;
    actionOwnerEmpId: string;
    department: string;
    targetDate: string;
    priority: CAPAPriority;
  }>({
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
    priority: "Medium" as CAPAPriority,
  });

  const mut = useMutation({
    mutationFn: async () => {
      if (!actor || !token) throw new Error("Not authenticated");
      const ownerId = BigInt(form.actionOwnerEmpId);
      if (Number.isNaN(Number(form.actionOwnerEmpId)))
        throw new Error("Action Owner Employee ID must be numeric");
      const input: CreateCAPAInput = {
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
        priority: form.priority,
      };
      const res = await actor.createCapa2(token, input);
      if (res.__kind__ === "err") throw new Error(res.err);
      return res.ok;
    },
    onSuccess: (num) => {
      toast.success(`CAPA ${num} created`);
      onCreated(num);
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const set = <K extends keyof typeof form>(k: K, v: (typeof form)[K]) =>
    setForm((f) => ({ ...f, [k]: v }));

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
      data-ocid="capa.dialog"
    >
      <div className="elevated-card rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-border">
          <h2 className="text-lg font-bold text-foreground">New CAPA</h2>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            data-ocid="capa.close_button"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
        <div className="p-6 space-y-4">
          {/* Row 1 */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label>Source</Label>
              <Select
                value={form.source}
                onValueChange={(v) => set("source", v as CAPASource2)}
              >
                <SelectTrigger data-ocid="capa.source_select">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.values(CAPASource2).map((s) => (
                    <SelectItem key={s} value={s}>
                      {formatSource(s)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>Linked Record #</Label>
              <Input
                placeholder="e.g. INC-2026-0012"
                value={form.linkedRecord}
                onChange={(e) => set("linkedRecord", e.target.value)}
                data-ocid="capa.linked_record_input"
              />
            </div>
          </div>
          {/* Row 2 */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label>CAPA Type</Label>
              <Select
                value={form.capaType}
                onValueChange={(v) => set("capaType", v as CAPAType)}
              >
                <SelectTrigger data-ocid="capa.type_select">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={CAPAType.Corrective}>
                    Corrective
                  </SelectItem>
                  <SelectItem value={CAPAType.Preventive}>
                    Preventive
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>Priority</Label>
              <Select
                value={form.priority}
                onValueChange={(v) => set("priority", v as CAPAPriority)}
              >
                <SelectTrigger data-ocid="capa.priority_select">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {(
                    ["Low", "Medium", "High", "Critical"] as CAPAPriority[]
                  ).map((p) => (
                    <SelectItem key={p as string} value={p as string}>
                      {p as string}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          {/* Finding */}
          <div className="space-y-1.5">
            <Label>Finding Description</Label>
            <Textarea
              rows={3}
              placeholder="Describe the finding or non-conformance…"
              value={form.findingDesc}
              onChange={(e) => set("findingDesc", e.target.value)}
              data-ocid="capa.finding_textarea"
            />
          </div>
          {/* Root Cause */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label>Root Cause Category</Label>
              <Select
                value={form.rootCauseCat}
                onValueChange={(v) => set("rootCauseCat", v as RootCauseCat)}
              >
                <SelectTrigger data-ocid="capa.root_cause_cat_select">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.values(RootCauseCat).map((r) => (
                    <SelectItem key={r} value={r}>
                      {formatRootCause(r)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>Department</Label>
              <Input
                placeholder="e.g. Maintenance"
                value={form.department}
                onChange={(e) => set("department", e.target.value)}
                data-ocid="capa.department_input"
              />
            </div>
          </div>
          <div className="space-y-1.5">
            <Label>Root Cause Description</Label>
            <Textarea
              rows={2}
              placeholder="Explain the root cause in detail…"
              value={form.rootCauseDesc}
              onChange={(e) => set("rootCauseDesc", e.target.value)}
              data-ocid="capa.root_cause_desc_textarea"
            />
          </div>
          {/* Action */}
          <div className="space-y-1.5">
            <Label>Action Description</Label>
            <Textarea
              rows={2}
              placeholder="Corrective/preventive action to be taken…"
              value={form.actionDesc}
              onChange={(e) => set("actionDesc", e.target.value)}
              data-ocid="capa.action_desc_textarea"
            />
          </div>
          {/* Owner + Date */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label>Action Owner Employee ID</Label>
              <Input
                placeholder="e.g. 100123"
                value={form.actionOwnerEmpId}
                onChange={(e) => set("actionOwnerEmpId", e.target.value)}
                data-ocid="capa.action_owner_input"
              />
            </div>
            <div className="space-y-1.5">
              <Label>Target Date</Label>
              <Input
                type="date"
                value={form.targetDate}
                onChange={(e) => set("targetDate", e.target.value)}
                data-ocid="capa.target_date_input"
              />
            </div>
          </div>
        </div>
        <div className="flex justify-end gap-3 p-6 border-t border-border">
          <Button
            variant="outline"
            onClick={onClose}
            data-ocid="capa.cancel_button"
          >
            Cancel
          </Button>
          <Button
            onClick={() => mut.mutate()}
            disabled={
              mut.isPending ||
              !form.findingDesc ||
              !form.actionDesc ||
              !form.targetDate ||
              !form.actionOwnerEmpId
            }
            data-ocid="capa.submit_button"
          >
            {mut.isPending ? "Creating…" : "Create CAPA"}
          </Button>
        </div>
      </div>
    </div>
  );
}

// ─── Progress Update Modal ───────────────────────────────────────────────────
interface ProgressModalProps {
  capa: CAPA2View;
  onClose: () => void;
  onUpdated: () => void;
}

function ProgressUpdateModal({ capa, onClose, onUpdated }: ProgressModalProps) {
  const { actor, token } = useBackend();
  const [progress, setProgress] = useState(capa.progressUpdate);
  const [evidence, setEvidence] = useState(capa.completionEvidence ?? "");
  const [submitForVerif, setSubmitForVerif] = useState(false);

  const qc = useQueryClient();

  const updateMut = useMutation({
    mutationFn: async () => {
      if (!actor || !token) throw new Error("Not authenticated");
      const res = await actor.updateCapa2Progress(
        token,
        capa.capaNumber,
        progress,
        evidence || null,
      );
      if (res.__kind__ === "err") throw new Error(res.err);
      if (submitForVerif) {
        const res2 = await actor.submitCapa2ForVerification(
          token,
          capa.capaNumber,
        );
        if (res2.__kind__ === "err") throw new Error(res2.err);
      }
    },
    onSuccess: () => {
      toast.success(
        submitForVerif ? "Submitted for verification" : "Progress updated",
      );
      qc.invalidateQueries({ queryKey: ["capa2s"] });
      qc.invalidateQueries({ queryKey: ["capa2-stats"] });
      onUpdated();
    },
    onError: (e: Error) => toast.error(e.message),
  });

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
      data-ocid="capa.progress_dialog"
    >
      <div className="elevated-card rounded-2xl w-full max-w-lg">
        <div className="flex items-center justify-between p-5 border-b border-border">
          <div>
            <h3 className="font-bold text-foreground">Update Progress</h3>
            <p className="text-xs text-muted-foreground mt-0.5">
              {capa.capaNumber}
            </p>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </div>
        <div className="p-5 space-y-4">
          <div className="space-y-1.5">
            <Label>Progress Update</Label>
            <Textarea
              rows={4}
              placeholder="Describe actions taken so far…"
              value={progress}
              onChange={(e) => setProgress(e.target.value)}
              data-ocid="capa.progress_textarea"
            />
          </div>
          <div className="space-y-1.5">
            <Label>Completion Evidence (URL or reference)</Label>
            <Input
              placeholder="e.g. https://docs.example.com/evidence.pdf"
              value={evidence}
              onChange={(e) => setEvidence(e.target.value)}
              data-ocid="capa.evidence_input"
            />
          </div>
          {capa.status === CAPAStatus2.InProgress && (
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={submitForVerif}
                onChange={(e) => setSubmitForVerif(e.target.checked)}
                className="rounded border-border"
                data-ocid="capa.submit_verif_checkbox"
              />
              <span className="text-sm text-foreground">
                Submit for Safety Officer verification
              </span>
            </label>
          )}
        </div>
        <div className="flex justify-end gap-3 p-5 border-t border-border">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            onClick={() => updateMut.mutate()}
            disabled={updateMut.isPending || !progress}
            data-ocid="capa.save_progress_button"
          >
            {updateMut.isPending ? "Saving…" : "Save Progress"}
          </Button>
        </div>
      </div>
    </div>
  );
}

// ─── Verify Modal ───────────────────────────────────────────────────────────
interface VerifyModalProps {
  capa: CAPA2View;
  onClose: () => void;
  onDone: () => void;
}

function VerifyModal({ capa, onClose, onDone }: VerifyModalProps) {
  const { actor, token } = useBackend();
  const [remarks, setRemarks] = useState("");
  const qc = useQueryClient();

  const mut = useMutation({
    mutationFn: async (approved: boolean) => {
      if (!actor || !token) throw new Error("Not authenticated");
      const res = await actor.verifyCapa2(
        token,
        capa.capaNumber,
        approved,
        remarks,
      );
      if (res.__kind__ === "err") throw new Error(res.err);
    },
    onSuccess: (_, approved) => {
      toast.success(
        approved ? "CAPA verified and closed" : "CAPA returned to In Progress",
      );
      qc.invalidateQueries({ queryKey: ["capa2s"] });
      qc.invalidateQueries({ queryKey: ["capa2-stats"] });
      onDone();
    },
    onError: (e: Error) => toast.error(e.message),
  });

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
      data-ocid="capa.verify_dialog"
    >
      <div className="elevated-card rounded-2xl w-full max-w-md">
        <div className="flex items-center justify-between p-5 border-b border-border">
          <h3 className="font-bold text-foreground">Verify CAPA</h3>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </div>
        <div className="p-5 space-y-3">
          <p className="text-sm text-muted-foreground">
            Review completion evidence and remarks before deciding.
          </p>
          {capa.completionEvidence && (
            <div className="p-3 rounded-lg bg-muted/30 text-sm">
              <span className="text-muted-foreground">Evidence: </span>
              <span className="text-foreground break-all">
                {capa.completionEvidence}
              </span>
            </div>
          )}
          <div className="space-y-1.5">
            <Label>Verification Remarks</Label>
            <Textarea
              rows={3}
              placeholder="Add remarks…"
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
              data-ocid="capa.verify_remarks_textarea"
            />
          </div>
        </div>
        <div className="flex justify-end gap-3 p-5 border-t border-border">
          <Button
            variant="outline"
            onClick={() => mut.mutate(false)}
            disabled={mut.isPending}
            className="border-amber-500/40 text-amber-400 hover:bg-amber-500/10"
            data-ocid="capa.return_to_progress_button"
          >
            Return to In Progress
          </Button>
          <Button
            onClick={() => mut.mutate(true)}
            disabled={mut.isPending}
            className="bg-green-600 hover:bg-green-700 text-white"
            data-ocid="capa.verify_close_button"
          >
            {mut.isPending ? "Processing…" : "Verify & Close"}
          </Button>
        </div>
      </div>
    </div>
  );
}

// ─── Status Timeline ─────────────────────────────────────────────────────────
const STATUS_STEPS: CAPAStatus2[] = [
  CAPAStatus2.Open,
  CAPAStatus2.InProgress,
  CAPAStatus2.PendingVerification,
  CAPAStatus2.Closed,
];

function StatusTimeline({ status }: { status: CAPAStatus2 }) {
  const activeIdx =
    status === CAPAStatus2.Overdue ? 1 : STATUS_STEPS.indexOf(status);

  return (
    <div className="flex items-center gap-1">
      {STATUS_STEPS.map((step, idx) => {
        const isActive = idx === activeIdx;
        const isDone = idx < activeIdx || status === CAPAStatus2.Closed;
        return (
          <div key={step} className="flex items-center gap-1">
            <div
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium transition-smooth ${
                isDone
                  ? "bg-green-500/20 text-green-400"
                  : isActive
                    ? status === CAPAStatus2.Overdue
                      ? "bg-red-500/20 text-red-400 ring-1 ring-red-500/50"
                      : "bg-primary/20 text-primary ring-1 ring-primary/50"
                    : "bg-muted/30 text-muted-foreground"
              }`}
            >
              {isDone ? (
                <CheckCircle2 className="w-3 h-3" />
              ) : (
                <span className="w-3 h-3 rounded-full border border-current opacity-60" />
              )}
              {formatStatus(step)}
            </div>
            {idx < STATUS_STEPS.length - 1 && (
              <ChevronRight className="w-3.5 h-3.5 text-muted-foreground/40" />
            )}
          </div>
        );
      })}
      {status === CAPAStatus2.Overdue && (
        <Badge
          variant="outline"
          className="ml-1 text-xs border-red-500/40 bg-red-500/20 text-red-400"
        >
          OVERDUE
        </Badge>
      )}
    </div>
  );
}

// ─── Detail View ─────────────────────────────────────────────────────────────
interface DetailViewProps {
  capa: CAPA2View;
  isSafetyAdmin: boolean;
  currentEmpId: bigint | null;
  onBack: () => void;
  onRefresh: () => void;
}

function CAPADetailView({
  capa,
  isSafetyAdmin,
  currentEmpId,
  onBack,
  onRefresh,
}: DetailViewProps) {
  const [showProgress, setShowProgress] = useState(false);
  const [showVerify, setShowVerify] = useState(false);

  const isOwner =
    currentEmpId !== null && currentEmpId === capa.actionOwnerEmpId;
  const canUpdateProgress =
    isOwner &&
    (capa.status === CAPAStatus2.Open ||
      capa.status === CAPAStatus2.InProgress ||
      capa.status === CAPAStatus2.Overdue);
  const canVerify =
    isSafetyAdmin && capa.status === CAPAStatus2.PendingVerification;

  const daysLeft = getDaysRemaining(capa.targetDate);

  return (
    <div className="space-y-5" data-ocid="capa.detail_panel">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Button
          variant="ghost"
          size="sm"
          onClick={onBack}
          className="gap-1.5"
          data-ocid="capa.back_button"
        >
          <ArrowLeft className="w-4 h-4" /> Back to List
        </Button>
        <div className="flex gap-2">
          {canUpdateProgress && (
            <Button
              size="sm"
              variant="outline"
              onClick={() => setShowProgress(true)}
              data-ocid="capa.update_progress_button"
            >
              Update Progress
            </Button>
          )}
          {canVerify && (
            <Button
              size="sm"
              className="bg-green-600 hover:bg-green-700 text-white"
              onClick={() => setShowVerify(true)}
              data-ocid="capa.verify_button"
            >
              Verify & Close
            </Button>
          )}
        </div>
      </div>

      {/* Overdue banner */}
      {capa.isOverdue && capa.status !== CAPAStatus2.Closed && (
        <div className="flex items-center gap-3 p-4 rounded-xl bg-red-500/10 border border-red-500/30">
          <AlertTriangle className="w-5 h-5 text-red-400 shrink-0" />
          <div>
            <p className="text-red-400 font-semibold text-sm">OVERDUE</p>
            <p className="text-red-400/70 text-xs">
              Target was {capa.targetDate} — {Math.abs(daysLeft)} day(s) past
              deadline
            </p>
          </div>
        </div>
      )}

      {/* Title card */}
      <div className="elevated-card rounded-xl p-5">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="font-mono text-xs text-muted-foreground">
              {capa.capaNumber}
            </p>
            <h2 className="text-xl font-bold text-foreground mt-1">
              {capa.capaType} CAPA
            </h2>
            <p className="text-muted-foreground text-sm mt-1">
              {capa.department}
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Badge
              variant="outline"
              className={`border ${statusClass(capa.status)}`}
            >
              {formatStatus(capa.status)}
            </Badge>
            <Badge
              variant="outline"
              className={`border ${priorityClass(capa.priority)}`}
            >
              {capa.priority}
            </Badge>
            <Badge
              variant="outline"
              className="border-muted text-muted-foreground"
            >
              {formatSource(capa.source)}
            </Badge>
          </div>
        </div>

        {/* Timeline */}
        <div className="mt-5 pt-4 border-t border-border overflow-x-auto">
          <StatusTimeline status={capa.status} />
        </div>
      </div>

      {/* Details grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="elevated-card rounded-xl p-5 space-y-4">
          <h3 className="font-semibold text-foreground text-sm">
            Finding Details
          </h3>
          <div>
            <p className="stat-label">Finding Description</p>
            <p className="text-foreground text-sm mt-1 leading-relaxed">
              {capa.findingDescription}
            </p>
          </div>
          <div>
            <p className="stat-label">Root Cause Category</p>
            <p className="text-foreground text-sm mt-1">
              {formatRootCause(capa.rootCauseCat)}
            </p>
          </div>
          <div>
            <p className="stat-label">Root Cause Description</p>
            <p className="text-foreground text-sm mt-1 leading-relaxed">
              {capa.rootCauseDesc || "—"}
            </p>
          </div>
          {capa.linkedRecordNumber && (
            <div>
              <p className="stat-label">Linked Record</p>
              <p className="font-mono text-sm text-primary mt-1">
                {capa.linkedRecordNumber}
              </p>
            </div>
          )}
        </div>

        <div className="elevated-card rounded-xl p-5 space-y-4">
          <h3 className="font-semibold text-foreground text-sm">
            Action Details
          </h3>
          <div>
            <p className="stat-label">Action Description</p>
            <p className="text-foreground text-sm mt-1 leading-relaxed">
              {capa.actionDescription}
            </p>
          </div>
          <div>
            <p className="stat-label">Action Owner</p>
            <p className="text-foreground text-sm mt-1">
              Emp ID: {String(capa.actionOwnerEmpId)}
            </p>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <p className="stat-label">Target Date</p>
              <p
                className={`text-sm mt-1 font-medium ${
                  capa.isOverdue && capa.status !== CAPAStatus2.Closed
                    ? "text-red-400"
                    : daysLeft <= 3
                      ? "text-amber-400"
                      : "text-foreground"
                }`}
              >
                {capa.targetDate}
                {capa.status !== CAPAStatus2.Closed && (
                  <span className="text-xs text-muted-foreground ml-1">
                    (
                    {daysLeft > 0
                      ? `${daysLeft}d left`
                      : `${Math.abs(daysLeft)}d overdue`}
                    )
                  </span>
                )}
              </p>
            </div>
            <div>
              <p className="stat-label">Created</p>
              <p className="text-foreground text-sm mt-1">
                {new Date(
                  Number(capa.createdAt) / 1_000_000,
                ).toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Progress */}
      {capa.progressUpdate && (
        <div className="elevated-card rounded-xl p-5">
          <h3 className="font-semibold text-foreground text-sm mb-3">
            Progress Update
          </h3>
          <p className="text-foreground text-sm leading-relaxed">
            {capa.progressUpdate}
          </p>
          {capa.completionEvidence && (
            <div className="mt-3 pt-3 border-t border-border">
              <p className="stat-label mb-1">Completion Evidence</p>
              <p className="text-sm text-primary break-all">
                {capa.completionEvidence}
              </p>
            </div>
          )}
        </div>
      )}

      {/* Verified */}
      {capa.status === CAPAStatus2.Closed && capa.verifiedByEmpId && (
        <div className="flex items-center gap-3 p-4 rounded-xl bg-green-500/10 border border-green-500/30">
          <CheckCircle2 className="w-5 h-5 text-green-400 shrink-0" />
          <div>
            <p className="text-green-400 font-semibold text-sm">
              Verified &amp; Closed
            </p>
            <p className="text-green-400/70 text-xs">
              By Emp ID {String(capa.verifiedByEmpId)} on{" "}
              {capa.verifiedAt
                ? new Date(
                    Number(capa.verifiedAt) / 1_000_000,
                  ).toLocaleDateString()
                : "—"}
            </p>
          </div>
        </div>
      )}

      {showProgress && (
        <ProgressUpdateModal
          capa={capa}
          onClose={() => setShowProgress(false)}
          onUpdated={() => {
            setShowProgress(false);
            onRefresh();
          }}
        />
      )}
      {showVerify && (
        <VerifyModal
          capa={capa}
          onClose={() => setShowVerify(false)}
          onDone={() => {
            setShowVerify(false);
            onRefresh();
          }}
        />
      )}
    </div>
  );
}

// ─── Stats Dashboard ─────────────────────────────────────────────────────────
interface StatsData {
  total: bigint;
  open: bigint;
  inProgress: bigint;
  overdue: bigint;
  closed: bigint;
  closureRate: bigint;
  avgDaysToClose: number;
  bySource: Array<[string, bigint]>;
  byDept: Array<[string, bigint]>;
}

function StatsDashboard({ stats }: { stats: StatsData }) {
  const sourceData = stats.bySource.map(([name, value]) => ({
    name,
    value: Number(value),
    color: SOURCE_COLORS[name] ?? "#60a5fa",
  }));

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
      {/* KPI cards */}
      {(
        [
          {
            label: "Total",
            value: Number(stats.total),
            cls: "text-foreground",
          },
          { label: "Open", value: Number(stats.open), cls: "text-blue-400" },
          {
            label: "In Progress",
            value: Number(stats.inProgress),
            cls: "text-amber-400",
          },
          {
            label: "Overdue",
            value: Number(stats.overdue),
            cls: "text-red-400",
          },
          {
            label: "Closure Rate",
            value: `${Number(stats.closureRate)}%`,
            cls: "text-green-400",
          },
          {
            label: "Avg Days Close",
            value: stats.avgDaysToClose.toFixed(1),
            cls: "text-cyan-400",
          },
        ] as const
      ).map(({ label, value, cls }) => (
        <div
          key={label}
          className={`elevated-card rounded-xl p-4 text-center ${
            label === "Overdue" && Number(stats.overdue) > 0
              ? "ring-1 ring-red-500/40"
              : ""
          }`}
        >
          <div className={`text-2xl font-bold font-mono ${cls}`}>
            {String(value)}
          </div>
          <div className="stat-label mt-1">{label}</div>
        </div>
      ))}

      {/* Source pie */}
      <div className="elevated-card rounded-xl p-4 col-span-2 sm:col-span-1">
        <p className="stat-label mb-2 text-center">By Source</p>
        {sourceData.length > 0 ? (
          <ResponsiveContainer width="100%" height={80}>
            <PieChart>
              <Pie
                data={sourceData}
                dataKey="value"
                cx="50%"
                cy="50%"
                innerRadius={22}
                outerRadius={36}
                strokeWidth={0}
              >
                {sourceData.map((entry) => (
                  <Cell key={entry.name} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  background: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "8px",
                  fontSize: "11px",
                  color: "hsl(var(--foreground))",
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        ) : (
          <div className="h-20 flex items-center justify-center">
            <p className="text-muted-foreground text-xs">No data</p>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Main Page ───────────────────────────────────────────────────────────────
export default function CAPAPage() {
  const { actor, token, isReady } = useBackend();
  const { user } = useAuth();
  const qc = useQueryClient();

  const [statusFilter, setStatusFilter] = useState<CAPAStatus2 | "all">("all");
  const [priorityFilter, setPriorityFilter] = useState<CAPAPriority | "all">(
    "all",
  );
  const [sourceFilter, setSourceFilter] = useState<CAPASource2 | "all">("all");
  const [deptFilter, setDeptFilter] = useState("");
  const [search, setSearch] = useState("");
  const [showCreate, setShowCreate] = useState(false);
  const [selected, setSelected] = useState<CAPA2View | null>(null);

  const isSafetyAdmin =
    user?.role === "SafetyOfficer" || user?.role === "SystemAdmin";
  const isHOD = user?.role === "HOD";
  const currentEmpId = user?.employeeId ?? null;

  // ── Fetch CAPAs ─────────────────────────────────────────────────────────
  const {
    data: capas,
    isLoading,
    error,
    refetch,
  } = useQuery<CAPA2View[]>({
    queryKey: ["capa2s"],
    queryFn: async () => {
      if (!actor || !token) return [];
      const res = await actor.listCapa2s(token);
      if (res.__kind__ === "err") throw new Error(res.err);
      return res.ok;
    },
    enabled: isReady,
  });

  // ── Fetch Stats ──────────────────────────────────────────────────────────
  const { data: statsData } = useQuery({
    queryKey: ["capa2-stats"],
    queryFn: async () => {
      if (!actor || !token) return null;
      const res = await actor.getCapa2Stats(token);
      if (res.__kind__ === "err") throw new Error(res.err);
      return res.ok;
    },
    enabled: isReady,
  });

  // ── Refresh selected CAPA ─────────────────────────────────────────────
  const refreshSelected = async () => {
    if (!actor || !token || !selected) return;
    const res = await actor.getCapa2(token, selected.capaNumber);
    if (res.__kind__ === "ok") setSelected(res.ok);
    refetch();
  };

  // ── Client-side filtering ────────────────────────────────────────────
  const filtered = useMemo(() => {
    if (!capas) return [];
    return capas.filter((c) => {
      if (statusFilter !== "all" && c.status !== statusFilter) return false;
      if (priorityFilter !== "all" && c.priority !== priorityFilter)
        return false;
      if (sourceFilter !== "all" && c.source !== sourceFilter) return false;
      if (
        deptFilter &&
        !c.department.toLowerCase().includes(deptFilter.toLowerCase())
      )
        return false;
      // Role-based: HOD sees own dept, Employee sees own assigned
      if (isHOD && user?.department && c.department !== user.department)
        return false;
      if (
        !isSafetyAdmin &&
        !isHOD &&
        currentEmpId !== null &&
        c.actionOwnerEmpId !== currentEmpId
      )
        return false;
      // search
      if (search) {
        const q = search.toLowerCase();
        if (
          !c.capaNumber.toLowerCase().includes(q) &&
          !c.department.toLowerCase().includes(q) &&
          !c.findingDescription.toLowerCase().includes(q)
        )
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
    currentEmpId,
  ]);

  const clearFilters = () => {
    setStatusFilter("all");
    setPriorityFilter("all");
    setSourceFilter("all");
    setDeptFilter("");
    setSearch("");
  };
  const hasActive =
    statusFilter !== "all" ||
    priorityFilter !== "all" ||
    sourceFilter !== "all" ||
    deptFilter ||
    search;

  const overdueCount =
    capas?.filter((c) => c.isOverdue && c.status !== CAPAStatus2.Closed)
      .length ?? 0;

  // ── Detail view ──────────────────────────────────────────────────────
  if (selected) {
    return (
      <CAPADetailView
        capa={selected}
        isSafetyAdmin={isSafetyAdmin}
        currentEmpId={currentEmpId ?? null}
        onBack={() => setSelected(null)}
        onRefresh={refreshSelected}
      />
    );
  }

  return (
    <div className="space-y-6" data-ocid="capa.page">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="section-header flex items-center gap-2 mb-1">
            <TrendingDown className="w-6 h-6 text-primary" />
            CAPA Tracking
          </h1>
          <p className="text-muted-foreground text-sm">
            {isSafetyAdmin
              ? "All corrective & preventive actions"
              : isHOD
                ? `Department: ${user?.department ?? "—"}`
                : "Your assigned actions"}
          </p>
        </div>
        <div className="flex items-center gap-2">
          {overdueCount > 0 && (
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-red-500/20 border border-red-500/30">
              <AlertTriangle className="w-3.5 h-3.5 text-red-400" />
              <span className="text-red-400 text-xs font-semibold">
                {overdueCount} Overdue
              </span>
            </div>
          )}
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              refetch();
              qc.invalidateQueries({ queryKey: ["capa2-stats"] });
            }}
            data-ocid="capa.refresh_button"
          >
            <RefreshCw className="w-4 h-4" />
          </Button>
          {isSafetyAdmin && (
            <Button
              size="sm"
              onClick={() => setShowCreate(true)}
              className="gap-1.5"
              data-ocid="capa.create_button"
            >
              <Plus className="w-4 h-4" /> New CAPA
            </Button>
          )}
        </div>
      </div>

      {/* Stats */}
      {statsData && <StatsDashboard stats={statsData} />}

      {/* Filters */}
      <div className="elevated-card rounded-xl p-4">
        <div className="flex flex-wrap gap-3 items-center">
          <div className="relative flex-1 min-w-[180px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search CAPA number, dept, finding…"
              className="pl-9"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              data-ocid="capa.search_input"
            />
          </div>
          <Select
            value={statusFilter}
            onValueChange={(v) => setStatusFilter(v as CAPAStatus2 | "all")}
          >
            <SelectTrigger className="w-44" data-ocid="capa.status_filter">
              <Filter className="w-3.5 h-3.5 mr-1.5" />
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              {Object.values(CAPAStatus2).map((s) => (
                <SelectItem key={s} value={s}>
                  {formatStatus(s)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select
            value={priorityFilter}
            onValueChange={(v) => setPriorityFilter(v as CAPAPriority | "all")}
          >
            <SelectTrigger className="w-36" data-ocid="capa.priority_filter">
              <SelectValue placeholder="Priority" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Priorities</SelectItem>
              {(["Low", "Medium", "High", "Critical"] as CAPAPriority[]).map(
                (p) => (
                  <SelectItem key={p as string} value={p as string}>
                    {p as string}
                  </SelectItem>
                ),
              )}
            </SelectContent>
          </Select>
          <Select
            value={sourceFilter}
            onValueChange={(v) => setSourceFilter(v as CAPASource2 | "all")}
          >
            <SelectTrigger className="w-36" data-ocid="capa.source_filter">
              <SelectValue placeholder="Source" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Sources</SelectItem>
              {Object.values(CAPASource2).map((s) => (
                <SelectItem key={s} value={s}>
                  {formatSource(s)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Input
            placeholder="Department…"
            className="w-36"
            value={deptFilter}
            onChange={(e) => setDeptFilter(e.target.value)}
            data-ocid="capa.dept_filter_input"
          />
          {hasActive && (
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

      {/* Table */}
      <div className="elevated-card rounded-xl overflow-hidden">
        {isLoading ? (
          <div className="p-6 space-y-3" data-ocid="capa.loading_state">
            {[...Array(5)].map((_, i) => (
              <Skeleton key={i} className="h-12 w-full" />
            ))}
          </div>
        ) : error ? (
          <div className="p-8 text-center" data-ocid="capa.error_state">
            <AlertTriangle className="w-8 h-8 text-destructive mx-auto mb-2" />
            <p className="text-destructive font-medium">Failed to load CAPAs</p>
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
          <div className="p-12 text-center" data-ocid="capa.empty_state">
            <TrendingDown className="w-10 h-10 text-muted-foreground/40 mx-auto mb-3" />
            <p className="text-muted-foreground font-medium">No CAPAs found</p>
            {hasActive ? (
              <p className="text-muted-foreground/60 text-sm mt-1">
                Try adjusting your filters
              </p>
            ) : isSafetyAdmin ? (
              <Button
                size="sm"
                className="mt-4"
                onClick={() => setShowCreate(true)}
                data-ocid="capa.create_first_button"
              >
                <Plus className="w-4 h-4 mr-1.5" /> Create First CAPA
              </Button>
            ) : (
              <p className="text-muted-foreground/60 text-sm mt-1">
                No actions assigned to you yet
              </p>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm" data-ocid="capa.table">
              <thead>
                <tr className="border-b border-border bg-muted/30">
                  <th className="text-left px-4 py-3 text-muted-foreground font-medium whitespace-nowrap">
                    CAPA #
                  </th>
                  <th className="text-left px-4 py-3 text-muted-foreground font-medium">
                    Source
                  </th>
                  <th className="text-left px-4 py-3 text-muted-foreground font-medium">
                    Type
                  </th>
                  <th className="text-left px-4 py-3 text-muted-foreground font-medium">
                    Priority
                  </th>
                  <th className="text-left px-4 py-3 text-muted-foreground font-medium">
                    Owner
                  </th>
                  <th className="text-left px-4 py-3 text-muted-foreground font-medium">
                    Department
                  </th>
                  <th className="text-left px-4 py-3 text-muted-foreground font-medium whitespace-nowrap">
                    Target Date
                  </th>
                  <th className="text-left px-4 py-3 text-muted-foreground font-medium">
                    Status
                  </th>
                  <th className="text-right px-4 py-3 text-muted-foreground font-medium whitespace-nowrap">
                    Days Left
                  </th>
                  <th className="px-4 py-3" />
                </tr>
              </thead>
              <tbody>
                {filtered.map((c, idx) => {
                  const days = getDaysRemaining(c.targetDate);
                  const rowOverdue =
                    c.isOverdue && c.status !== CAPAStatus2.Closed;
                  return (
                    <tr
                      key={c.capaNumber}
                      className={`border-b border-border/50 cursor-pointer transition-colors ${
                        rowOverdue
                          ? "bg-red-500/5 hover:bg-red-500/10"
                          : "hover:bg-muted/20"
                      }`}
                      onClick={() => setSelected(c)}
                      onKeyDown={(e) => e.key === "Enter" && setSelected(c)}
                      tabIndex={0}
                      data-ocid={`capa.item.${idx + 1}`}
                    >
                      <td className="px-4 py-3">
                        <span className="font-mono text-xs text-primary font-semibold">
                          {c.capaNumber}
                        </span>
                        {rowOverdue && (
                          <AlertTriangle className="inline w-3 h-3 text-red-400 ml-1.5" />
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <Badge
                          variant="outline"
                          className="text-xs border-muted text-muted-foreground"
                        >
                          {formatSource(c.source)}
                        </Badge>
                      </td>
                      <td className="px-4 py-3 text-foreground">
                        {c.capaType}
                      </td>
                      <td className="px-4 py-3">
                        <Badge
                          variant="outline"
                          className={`text-xs border ${priorityClass(c.priority)}`}
                        >
                          {c.priority}
                        </Badge>
                      </td>
                      <td className="px-4 py-3 text-muted-foreground font-mono text-xs">
                        {String(c.actionOwnerEmpId)}
                      </td>
                      <td className="px-4 py-3 text-muted-foreground max-w-[120px] truncate">
                        {c.department}
                      </td>
                      <td className="px-4 py-3 text-muted-foreground whitespace-nowrap">
                        {c.targetDate}
                      </td>
                      <td className="px-4 py-3">
                        <Badge
                          variant="outline"
                          className={`text-xs border ${statusClass(c.status)}`}
                        >
                          {formatStatus(c.status)}
                        </Badge>
                      </td>
                      <td className="px-4 py-3 text-right">
                        {c.status === CAPAStatus2.Closed ? (
                          <span className="text-green-400 text-xs">✓ Done</span>
                        ) : (
                          <span
                            className={`text-xs font-mono ${
                              days < 0
                                ? "text-red-400"
                                : days <= 3
                                  ? "text-amber-400"
                                  : "text-muted-foreground"
                            }`}
                          >
                            {days < 0 ? `${Math.abs(days)}d ago` : `${days}d`}
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-primary hover:text-primary h-7 px-2"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelected(c);
                          }}
                          data-ocid={`capa.view_button.${idx + 1}`}
                        >
                          View
                        </Button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Overdue summary (prominent) */}
      {overdueCount > 0 && !isLoading && (
        <div className="elevated-card rounded-xl p-4 border-red-500/30 ring-1 ring-red-500/20">
          <div className="flex items-center gap-2 mb-3">
            <Clock className="w-4 h-4 text-red-400" />
            <h3 className="font-semibold text-red-400 text-sm">
              {overdueCount} Overdue CAPA{overdueCount !== 1 ? "s" : ""} Require
              Attention
            </h3>
          </div>
          <div className="flex flex-wrap gap-2">
            {capas
              ?.filter((c) => c.isOverdue && c.status !== CAPAStatus2.Closed)
              .map((c) => (
                <button
                  key={c.capaNumber}
                  type="button"
                  onClick={() => setSelected(c)}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-red-500/10 border border-red-500/30 hover:bg-red-500/20 transition-smooth"
                >
                  <span className="font-mono text-xs text-red-400">
                    {c.capaNumber}
                  </span>
                  <Badge
                    variant="outline"
                    className={`text-xs border ${priorityClass(c.priority)}`}
                  >
                    {c.priority}
                  </Badge>
                  <span className="text-xs text-muted-foreground">
                    {c.department}
                  </span>
                </button>
              ))}
          </div>
        </div>
      )}

      {showCreate && (
        <CreateCAPAModal
          onClose={() => setShowCreate(false)}
          onCreated={(num) => {
            setShowCreate(false);
            qc.invalidateQueries({ queryKey: ["capa2s"] });
            qc.invalidateQueries({ queryKey: ["capa2-stats"] });
            toast.success(`${num} created successfully`);
          }}
        />
      )}
    </div>
  );
}
