import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
  CheckCircle2,
  Eye,
  Filter,
  Plus,
  RefreshCw,
  Search,
  ShieldCheck,
  TrendingUp,
  X,
} from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import {
  type CreateObservationInput,
  ObservationSeverity,
  ObservationStatus,
  ObservationType,
  type ObservationView,
} from "../backend";
import { useAuth } from "../hooks/useAuth";
import { useBackend } from "../hooks/useBackend";

// ─── Helpers ──────────────────────────────────────────────────────────────────

function obsTypeLabel(t: ObservationType): string {
  const labels: Record<ObservationType, string> = {
    [ObservationType.SafeAct]: "Safe Act",
    [ObservationType.UnsafeAct]: "Unsafe Act",
    [ObservationType.UnsafeCondition]: "Unsafe Condition",
    [ObservationType.NearMiss]: "Near Miss",
    [ObservationType.PositiveReinforcement]: "Positive Reinforcement",
  };
  return labels[t] ?? t;
}

function obsTypeClass(t: ObservationType): string {
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

function obsStatusLabel(s: ObservationStatus): string {
  const labels: Record<ObservationStatus, string> = {
    [ObservationStatus.Open]: "Open",
    [ObservationStatus.UnderReview]: "Under Review",
    [ObservationStatus.CAPAPending]: "CAPA Pending",
    [ObservationStatus.Closed]: "Closed",
  };
  return labels[s] ?? s;
}

function obsStatusClass(s: ObservationStatus): string {
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

function obsSeverityClass(s: ObservationSeverity): string {
  switch (s) {
    case ObservationSeverity.High:
      return "bg-red-500/20 text-red-400 border-red-500/40";
    case ObservationSeverity.Medium:
      return "bg-yellow-500/20 text-yellow-400 border-yellow-500/40";
    case ObservationSeverity.Low:
      return "bg-green-500/20 text-green-400 border-green-500/40";
  }
}

function formatTs(ts: bigint): string {
  try {
    return new Date(Number(ts / 1_000_000n)).toLocaleDateString();
  } catch {
    return "—";
  }
}

// ─── BBS Stats Bar ────────────────────────────────────────────────────────────

interface BbsStats {
  total: bigint;
  safe: bigint;
  unsafe: bigint;
  score: bigint;
  byDept: Array<[string, bigint]>;
}

function BbsStatsBar({ stats }: { stats: BbsStats }) {
  const total = Number(stats.total);
  const safe = Number(stats.safe);
  const unsafe = Number(stats.unsafe);
  const score = Number(stats.score);
  const safeRatio = total > 0 ? (safe / total) * 100 : 0;

  const scoreColor =
    score >= 70
      ? "text-green-400"
      : score >= 50
        ? "text-amber-400"
        : "text-red-400";
  const scoreBg =
    score >= 70
      ? "from-green-500/20 to-green-500/5"
      : score >= 50
        ? "from-amber-500/20 to-amber-500/5"
        : "from-red-500/20 to-red-500/5";

  return (
    <div
      className="grid grid-cols-2 sm:grid-cols-4 gap-3"
      data-ocid="observations.stats_bar"
    >
      {/* Total */}
      <div className="elevated-card rounded-xl p-4 text-center">
        <div className="text-2xl font-bold font-mono text-foreground">
          {total}
        </div>
        <div className="stat-label mt-1">Total Observations</div>
      </div>

      {/* Safe vs Unsafe */}
      <div className="elevated-card rounded-xl p-4">
        <div className="flex justify-between text-xs text-muted-foreground mb-1.5">
          <span className="text-green-400 font-semibold">{safe} Safe</span>
          <span className="text-red-400 font-semibold">{unsafe} Unsafe</span>
        </div>
        <div className="h-2 rounded-full bg-muted overflow-hidden">
          <div
            className="h-full rounded-full bg-gradient-to-r from-green-500 to-green-400 transition-all"
            style={{ width: `${safeRatio}%` }}
          />
        </div>
        <div className="stat-label mt-2 text-center">Safe / Unsafe Ratio</div>
      </div>

      {/* BBS Score */}
      <div
        className={`elevated-card rounded-xl p-4 bg-gradient-to-br ${scoreBg} text-center`}
      >
        <div className={`text-3xl font-bold font-mono ${scoreColor}`}>
          {score}%
        </div>
        <div className="flex items-center justify-center gap-1 mt-0.5">
          <TrendingUp className="w-3 h-3 text-muted-foreground" />
          <span className="stat-label">BBS Score</span>
        </div>
      </div>

      {/* CAPA Pending count */}
      <div className="elevated-card rounded-xl p-4 text-center">
        <div className="text-2xl font-bold font-mono text-orange-400">
          {unsafe}
        </div>
        <div className="stat-label mt-1">Unsafe Findings</div>
      </div>
    </div>
  );
}

// ─── Submit Observation Modal ─────────────────────────────────────────────────

interface SubmitObsDialogProps {
  open: boolean;
  onClose: () => void;
  onCreated: () => void;
}

function SubmitObsDialog({ open, onClose, onCreated }: SubmitObsDialogProps) {
  const { actor, token } = useBackend();
  const { user } = useAuth();

  const [form, setForm] = useState({
    dateTime: new Date().toISOString().slice(0, 16),
    location: "",
    area: "",
    department: user?.department ?? "",
    obsType: ObservationType.SafeAct as ObservationType,
    severity: ObservationSeverity.Low as ObservationSeverity,
    description: "",
    immediateAction: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const submitMut = useMutation({
    mutationFn: async () => {
      if (!actor || !token) throw new Error("Not authenticated");
      const input: CreateObservationInput = {
        dateTime: BigInt(new Date(form.dateTime).getTime()) * 1_000_000n,
        location: form.location.trim(),
        area: form.area.trim(),
        department: form.department.trim(),
        obsType: form.obsType,
        severity: form.severity,
        description: form.description.trim(),
        immediateAction: form.immediateAction.trim(),
      };
      const res = await actor.createObservation(token, input);
      if (res.__kind__ === "err") throw new Error(res.err);
      return res.ok;
    },
    onSuccess: (obsNumber) => {
      toast.success(`Observation ${obsNumber} submitted successfully`);
      onCreated();
      onClose();
    },
    onError: (e: Error) => toast.error(e.message),
  });

  function validate(): boolean {
    const errs: Record<string, string> = {};
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

  const set = (k: string, v: string) => {
    setForm((f) => ({ ...f, [k]: v }));
    setErrors((e) => ({ ...e, [k]: "" }));
  };

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent
        className="bg-card border-border max-w-lg max-h-[90vh] overflow-y-auto"
        data-ocid="observations.dialog"
      >
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-foreground">
            <ShieldCheck className="w-5 h-5 text-primary" />
            Submit Safety Observation
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 mt-2">
          <div className="grid grid-cols-2 gap-3">
            <div className="col-span-2">
              <Label className="text-muted-foreground text-xs mb-1.5 block">
                Date & Time *
              </Label>
              <Input
                type="datetime-local"
                value={form.dateTime}
                onChange={(e) => set("dateTime", e.target.value)}
                className="bg-background"
                data-ocid="observations.datetime_input"
              />
            </div>

            <div>
              <Label className="text-muted-foreground text-xs mb-1.5 block">
                Location *
              </Label>
              <Input
                placeholder="e.g. Plant Floor A"
                value={form.location}
                onChange={(e) => set("location", e.target.value)}
                className="bg-background"
                data-ocid="observations.location_input"
              />
              {errors.location && (
                <p
                  className="text-destructive text-xs mt-1"
                  data-ocid="observations.location_field_error"
                >
                  {errors.location}
                </p>
              )}
            </div>

            <div>
              <Label className="text-muted-foreground text-xs mb-1.5 block">
                Area *
              </Label>
              <Input
                placeholder="e.g. Welding Bay"
                value={form.area}
                onChange={(e) => set("area", e.target.value)}
                className="bg-background"
                data-ocid="observations.area_input"
              />
              {errors.area && (
                <p
                  className="text-destructive text-xs mt-1"
                  data-ocid="observations.area_field_error"
                >
                  {errors.area}
                </p>
              )}
            </div>

            <div>
              <Label className="text-muted-foreground text-xs mb-1.5 block">
                Department *
              </Label>
              <Input
                placeholder="e.g. Production"
                value={form.department}
                onChange={(e) => set("department", e.target.value)}
                className="bg-background"
                data-ocid="observations.department_input"
              />
              {errors.department && (
                <p
                  className="text-destructive text-xs mt-1"
                  data-ocid="observations.department_field_error"
                >
                  {errors.department}
                </p>
              )}
            </div>

            <div>
              <Label className="text-muted-foreground text-xs mb-1.5 block">
                Observation Type
              </Label>
              <Select
                value={form.obsType}
                onValueChange={(v) => set("obsType", v)}
              >
                <SelectTrigger
                  className="bg-background"
                  data-ocid="observations.type_select"
                >
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.values(ObservationType).map((t) => (
                    <SelectItem key={t} value={t}>
                      {obsTypeLabel(t)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label className="text-muted-foreground text-xs mb-1.5 block">
                Severity
              </Label>
              <Select
                value={form.severity}
                onValueChange={(v) => set("severity", v)}
              >
                <SelectTrigger
                  className="bg-background"
                  data-ocid="observations.severity_select"
                >
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.values(ObservationSeverity).map((s) => (
                    <SelectItem key={s} value={s}>
                      {s}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="col-span-2">
              <Label className="text-muted-foreground text-xs mb-1.5 block">
                Description *
              </Label>
              <Textarea
                placeholder="Describe what you observed in detail..."
                value={form.description}
                onChange={(e) => set("description", e.target.value)}
                rows={3}
                className="bg-background resize-none"
                data-ocid="observations.description_textarea"
              />
              {errors.description && (
                <p
                  className="text-destructive text-xs mt-1"
                  data-ocid="observations.description_field_error"
                >
                  {errors.description}
                </p>
              )}
            </div>

            <div className="col-span-2">
              <Label className="text-muted-foreground text-xs mb-1.5 block">
                Immediate Action Taken
              </Label>
              <Textarea
                placeholder="Any immediate corrective action taken on the spot..."
                value={form.immediateAction}
                onChange={(e) => set("immediateAction", e.target.value)}
                rows={2}
                className="bg-background resize-none"
                data-ocid="observations.immediate_action_textarea"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-border">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              data-ocid="observations.cancel_button"
            >
              Cancel
            </Button>
            <Button
              type="button"
              onClick={handleSubmit}
              disabled={submitMut.isPending}
              data-ocid="observations.submit_button"
            >
              {submitMut.isPending ? "Submitting…" : "Submit Observation"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// ─── Observation Detail Panel ────────────────────────────────────────────────

interface DetailPanelProps {
  obs: ObservationView;
  canAcknowledge: boolean;
  onBack: () => void;
  onAcknowledge: (remarks: string) => void;
  onClose: () => void;
  isAcknowledging: boolean;
  isClosing: boolean;
}

function ObservationDetailPanel({
  obs,
  canAcknowledge,
  onBack,
  onAcknowledge,
  onClose: onCloseObs,
  isAcknowledging,
  isClosing,
}: DetailPanelProps) {
  const [ackRemarks, setAckRemarks] = useState("");

  const canClose =
    canAcknowledge &&
    obs.status !== ObservationStatus.Open &&
    obs.status !== ObservationStatus.Closed;

  return (
    <div className="space-y-6" data-ocid="observations.detail_panel">
      <div className="flex items-center gap-3">
        <Button
          variant="ghost"
          size="sm"
          onClick={onBack}
          className="gap-1.5"
          data-ocid="observations.back_button"
        >
          ← Back
        </Button>
        <div className="flex-1">
          <h1 className="section-header font-mono">{obs.obsNumber}</h1>
          <p className="text-muted-foreground text-sm">
            {obs.location} · {obs.department}
          </p>
        </div>
        <Badge
          variant="outline"
          className={`border ${obsStatusClass(obs.status)}`}
        >
          {obsStatusLabel(obs.status)}
        </Badge>
      </div>

      {/* Core fields */}
      <div className="elevated-card rounded-xl p-5 space-y-4">
        <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
          Observation Details
        </h2>
        <div className="grid grid-cols-2 gap-x-6 gap-y-3 text-sm">
          <Detail label="Observer" value={obs.observerName} />
          <Detail label="Date/Time" value={formatTs(obs.dateTime)} />
          <Detail label="Area" value={obs.area} />
          <Detail label="Department" value={obs.department} />
          <Detail
            label="Type"
            value={
              <Badge
                variant="outline"
                className={`text-xs border ${obsTypeClass(obs.obsType)}`}
              >
                {obsTypeLabel(obs.obsType)}
              </Badge>
            }
          />
          <Detail
            label="Severity"
            value={
              <Badge
                variant="outline"
                className={`text-xs border ${obsSeverityClass(obs.severity)}`}
              >
                {obs.severity}
              </Badge>
            }
          />
        </div>
        <div className="space-y-3 pt-2 border-t border-border">
          <div>
            <span className="text-xs text-muted-foreground uppercase tracking-wide">
              Description
            </span>
            <p className="text-foreground text-sm mt-1">{obs.description}</p>
          </div>
          {obs.immediateAction && (
            <div>
              <span className="text-xs text-muted-foreground uppercase tracking-wide">
                Immediate Action Taken
              </span>
              <p className="text-foreground text-sm mt-1">
                {obs.immediateAction}
              </p>
            </div>
          )}
          {obs.linkedCapaId && (
            <div className="flex items-center gap-2 mt-2 p-2.5 rounded-lg bg-orange-500/10 border border-orange-500/20">
              <AlertTriangle className="w-4 h-4 text-orange-400 shrink-0" />
              <span className="text-sm text-orange-300">
                Linked CAPA:{" "}
                <span className="font-mono font-semibold">
                  {obs.linkedCapaId}
                </span>
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Acknowledgement info */}
      {obs.acknowledgedBy && (
        <div className="elevated-card rounded-xl p-5 space-y-2">
          <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
            Acknowledgement
          </h2>
          <p className="text-sm text-foreground">
            {obs.acknowledgeRemarks ?? "—"}
          </p>
          <p className="text-xs text-muted-foreground">
            Acknowledged at{" "}
            {obs.acknowledgedAt ? formatTs(obs.acknowledgedAt) : "—"}
          </p>
        </div>
      )}

      {/* Safety Officer actions */}
      {canAcknowledge && obs.status === ObservationStatus.Open && (
        <div className="elevated-card rounded-xl p-5 space-y-3">
          <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
            Acknowledge Observation
          </h2>
          <Textarea
            placeholder="Enter acknowledgement remarks..."
            value={ackRemarks}
            onChange={(e) => setAckRemarks(e.target.value)}
            rows={2}
            className="bg-background resize-none"
            data-ocid="observations.ack_remarks_textarea"
          />
          <Button
            size="sm"
            onClick={() => onAcknowledge(ackRemarks)}
            disabled={isAcknowledging || !ackRemarks.trim()}
            className="gap-1.5"
            data-ocid="observations.acknowledge_button"
          >
            <CheckCircle2 className="w-4 h-4" />
            {isAcknowledging ? "Acknowledging…" : "Acknowledge"}
          </Button>
        </div>
      )}

      {canClose && (
        <div className="flex justify-end">
          <Button
            variant="outline"
            size="sm"
            onClick={onCloseObs}
            disabled={isClosing}
            className="gap-1.5 border-green-500/40 text-green-400 hover:bg-green-500/10"
            data-ocid="observations.close_button"
          >
            <CheckCircle2 className="w-4 h-4" />
            {isClosing ? "Closing…" : "Close Observation"}
          </Button>
        </div>
      )}
    </div>
  );
}

function Detail({
  label,
  value,
}: {
  label: string;
  value: React.ReactNode;
}) {
  return (
    <div>
      <span className="text-xs text-muted-foreground uppercase tracking-wide block">
        {label}
      </span>
      <div className="text-foreground text-sm mt-0.5">{value}</div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function ObservationsPage() {
  const { actor, token, isReady } = useBackend();
  const { user } = useAuth();
  const qc = useQueryClient();

  const isPrivileged =
    user?.role === "SafetyOfficer" || user?.role === "SystemAdmin";
  const isHOD = user?.role === "HOD";

  // Filters
  const [typeFilter, setTypeFilter] = useState<ObservationType | "all">("all");
  const [severityFilter, setSeverityFilter] = useState<
    ObservationSeverity | "all"
  >("all");
  const [statusFilter, setStatusFilter] = useState<ObservationStatus | "all">(
    "all",
  );
  const [deptFilter, setDeptFilter] = useState("");
  const [search, setSearch] = useState("");

  // UI state
  const [showSubmit, setShowSubmit] = useState(false);
  const [selected, setSelected] = useState<ObservationView | null>(null);

  // ── Fetch BBS Stats ─────────────────────────────────────────────────────────
  const { data: bbsStats } = useQuery<BbsStats | null>({
    queryKey: ["bbsStats"],
    queryFn: async () => {
      if (!actor || !token) return null;
      const res = await actor.getBbsStats(token);
      if (res.__kind__ === "err") return null;
      return res.ok;
    },
    enabled: isReady,
  });

  // ── Fetch Observations ──────────────────────────────────────────────────────
  const {
    data: observations,
    isLoading,
    error,
    refetch,
  } = useQuery<ObservationView[]>({
    queryKey: ["observations"],
    queryFn: async () => {
      if (!actor || !token) return [];
      const res = await actor.listObservations(token);
      if (res.__kind__ === "err") throw new Error(res.err);
      return res.ok;
    },
    enabled: isReady,
  });

  // ── Acknowledge mutation ────────────────────────────────────────────────────
  const ackMut = useMutation({
    mutationFn: async ({
      obsNumber,
      remarks,
    }: { obsNumber: string; remarks: string }) => {
      if (!actor || !token) throw new Error("Not authenticated");
      const res = await actor.acknowledgeObservation(token, obsNumber, remarks);
      if (res.__kind__ === "err") throw new Error(res.err);
    },
    onSuccess: (_, { obsNumber }) => {
      toast.success("Observation acknowledged");
      qc.invalidateQueries({ queryKey: ["observations"] });
      qc.invalidateQueries({ queryKey: ["bbsStats"] });
      if (selected?.obsNumber === obsNumber && actor && token) {
        actor.getObservation(token, obsNumber).then((r) => {
          if (r.__kind__ === "ok") setSelected(r.ok);
        });
      }
    },
    onError: (e: Error) => toast.error(e.message),
  });

  // ── Close observation mutation ──────────────────────────────────────────────
  const closeMut = useMutation({
    mutationFn: async (obsNumber: string) => {
      if (!actor || !token) throw new Error("Not authenticated");
      const res = await actor.closeObservation(token, obsNumber);
      if (res.__kind__ === "err") throw new Error(res.err);
    },
    onSuccess: (_, obsNumber) => {
      toast.success("Observation closed");
      qc.invalidateQueries({ queryKey: ["observations"] });
      qc.invalidateQueries({ queryKey: ["bbsStats"] });
      if (selected?.obsNumber === obsNumber && actor && token) {
        actor.getObservation(token, obsNumber).then((r) => {
          if (r.__kind__ === "ok") setSelected(r.ok);
        });
      }
    },
    onError: (e: Error) => toast.error(e.message),
  });

  // ── Client-side filtering ───────────────────────────────────────────────────
  const filtered = useMemo(() => {
    if (!observations) return [];
    return observations.filter((obs) => {
      // Role-based visibility
      if (!isPrivileged && !isHOD) {
        if (obs.observerEmpId !== user?.employeeId) return false;
      } else if (isHOD && !isPrivileged) {
        if (obs.department !== user?.department) return false;
      }
      if (typeFilter !== "all" && obs.obsType !== typeFilter) return false;
      if (severityFilter !== "all" && obs.severity !== severityFilter)
        return false;
      if (statusFilter !== "all" && obs.status !== statusFilter) return false;
      if (
        deptFilter &&
        !obs.department.toLowerCase().includes(deptFilter.toLowerCase())
      )
        return false;
      if (search) {
        const q = search.toLowerCase();
        if (
          !obs.obsNumber.toLowerCase().includes(q) &&
          !obs.location.toLowerCase().includes(q) &&
          !obs.observerName.toLowerCase().includes(q) &&
          !obs.department.toLowerCase().includes(q)
        )
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
    user,
  ]);

  const hasActiveFilters =
    typeFilter !== "all" ||
    severityFilter !== "all" ||
    statusFilter !== "all" ||
    deptFilter ||
    search;

  const clearFilters = () => {
    setTypeFilter("all");
    setSeverityFilter("all");
    setStatusFilter("all");
    setDeptFilter("");
    setSearch("");
  };

  // ── Detail view ──────────────────────────────────────────────────────────────
  if (selected) {
    return (
      <ObservationDetailPanel
        obs={selected}
        canAcknowledge={isPrivileged}
        onBack={() => setSelected(null)}
        onAcknowledge={(remarks) =>
          ackMut.mutate({ obsNumber: selected.obsNumber, remarks })
        }
        onClose={() => closeMut.mutate(selected.obsNumber)}
        isAcknowledging={ackMut.isPending}
        isClosing={closeMut.isPending}
      />
    );
  }

  return (
    <div className="space-y-6" data-ocid="observations.page">
      {/* ── Page header ──────────────────────────────────────────────────── */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="section-header flex items-center gap-2 mb-1">
            <Eye className="w-6 h-6 text-primary" />
            Safety Observations & BBS
          </h1>
          <p className="text-muted-foreground text-sm">
            {isPrivileged
              ? "All observations across departments"
              : isHOD
                ? `${user?.department ?? "Your"} department observations`
                : "Your submitted observations"}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => refetch()}
            data-ocid="observations.refresh_button"
          >
            <RefreshCw className="w-4 h-4" />
          </Button>
          <Button
            size="sm"
            onClick={() => setShowSubmit(true)}
            className="gap-1.5"
            data-ocid="observations.new_button"
          >
            <Plus className="w-4 h-4" />
            New Observation
          </Button>
        </div>
      </div>

      {/* ── BBS Stats ────────────────────────────────────────────────────── */}
      {bbsStats && <BbsStatsBar stats={bbsStats} />}

      {/* ── Filters ──────────────────────────────────────────────────────── */}
      <div className="elevated-card rounded-xl p-4">
        <div className="flex flex-wrap gap-3 items-center">
          <div className="relative flex-1 min-w-[180px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search OBS number, location, observer…"
              className="pl-9"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              data-ocid="observations.search_input"
            />
          </div>

          <Select
            value={typeFilter}
            onValueChange={(v) => setTypeFilter(v as ObservationType | "all")}
          >
            <SelectTrigger
              className="w-48"
              data-ocid="observations.type_filter"
            >
              <Filter className="w-3.5 h-3.5 mr-1.5" />
              <SelectValue placeholder="Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              {Object.values(ObservationType).map((t) => (
                <SelectItem key={t} value={t}>
                  {obsTypeLabel(t)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={severityFilter}
            onValueChange={(v) =>
              setSeverityFilter(v as ObservationSeverity | "all")
            }
          >
            <SelectTrigger
              className="w-36"
              data-ocid="observations.severity_filter"
            >
              <SelectValue placeholder="Severity" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Severities</SelectItem>
              {Object.values(ObservationSeverity).map((s) => (
                <SelectItem key={s} value={s}>
                  {s}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={statusFilter}
            onValueChange={(v) =>
              setStatusFilter(v as ObservationStatus | "all")
            }
          >
            <SelectTrigger
              className="w-40"
              data-ocid="observations.status_filter"
            >
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              {Object.values(ObservationStatus).map((s) => (
                <SelectItem key={s} value={s}>
                  {obsStatusLabel(s)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {isPrivileged && (
            <Input
              placeholder="Filter by dept…"
              className="w-36"
              value={deptFilter}
              onChange={(e) => setDeptFilter(e.target.value)}
              data-ocid="observations.dept_filter"
            />
          )}

          {hasActiveFilters && (
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

      {/* ── Table ────────────────────────────────────────────────────────── */}
      <div className="elevated-card rounded-xl overflow-hidden">
        {isLoading ? (
          <div className="p-6 space-y-3" data-ocid="observations.loading_state">
            {[...Array(5)].map((_, i) => (
              <Skeleton key={i} className="h-12 w-full" />
            ))}
          </div>
        ) : error ? (
          <div className="p-8 text-center" data-ocid="observations.error_state">
            <AlertTriangle className="w-8 h-8 text-destructive mx-auto mb-2" />
            <p className="text-destructive font-medium">
              Failed to load observations
            </p>
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
          <div
            className="p-12 text-center"
            data-ocid="observations.empty_state"
          >
            <ShieldCheck className="w-10 h-10 text-muted-foreground/40 mx-auto mb-3" />
            <p className="text-muted-foreground font-medium">
              No observations found
            </p>
            {hasActiveFilters ? (
              <p className="text-muted-foreground/60 text-sm mt-1">
                Try adjusting your filters
              </p>
            ) : (
              <Button
                size="sm"
                className="mt-4"
                onClick={() => setShowSubmit(true)}
              >
                <Plus className="w-4 h-4 mr-1.5" /> Submit First Observation
              </Button>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm" data-ocid="observations.table">
              <thead>
                <tr className="border-b border-border bg-muted/30">
                  <th className="text-left px-4 py-3 text-muted-foreground font-medium whitespace-nowrap">
                    OBS #
                  </th>
                  <th className="text-left px-4 py-3 text-muted-foreground font-medium">
                    Type
                  </th>
                  <th className="text-left px-4 py-3 text-muted-foreground font-medium">
                    Severity
                  </th>
                  {isPrivileged && (
                    <th className="text-left px-4 py-3 text-muted-foreground font-medium">
                      Department
                    </th>
                  )}
                  <th className="text-left px-4 py-3 text-muted-foreground font-medium">
                    Location
                  </th>
                  <th className="text-left px-4 py-3 text-muted-foreground font-medium">
                    Status
                  </th>
                  <th className="text-left px-4 py-3 text-muted-foreground font-medium whitespace-nowrap">
                    Date
                  </th>
                  <th className="text-left px-4 py-3 text-muted-foreground font-medium">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((obs, idx) => (
                  <tr
                    key={obs.obsNumber}
                    className="border-b border-border/50 hover:bg-muted/20 transition-colors cursor-pointer"
                    onClick={() => setSelected(obs)}
                    onKeyDown={(e) => e.key === "Enter" && setSelected(obs)}
                    tabIndex={0}
                    data-ocid={`observations.item.${idx + 1}`}
                  >
                    <td className="px-4 py-3">
                      <span className="font-mono text-xs text-primary font-semibold">
                        {obs.obsNumber}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <Badge
                        variant="outline"
                        className={`text-xs border ${obsTypeClass(obs.obsType)}`}
                      >
                        {obsTypeLabel(obs.obsType)}
                      </Badge>
                    </td>
                    <td className="px-4 py-3">
                      <Badge
                        variant="outline"
                        className={`text-xs border ${obsSeverityClass(obs.severity)}`}
                      >
                        {obs.severity}
                      </Badge>
                    </td>
                    {isPrivileged && (
                      <td className="px-4 py-3 text-muted-foreground">
                        {obs.department}
                      </td>
                    )}
                    <td className="px-4 py-3 text-muted-foreground max-w-[130px] truncate">
                      {obs.location}
                    </td>
                    <td className="px-4 py-3">
                      <Badge
                        variant="outline"
                        className={`text-xs border ${obsStatusClass(obs.status)}`}
                      >
                        {obsStatusLabel(obs.status)}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground whitespace-nowrap">
                      {formatTs(obs.dateTime)}
                    </td>
                    <td className="px-4 py-3">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-primary hover:text-primary h-7 px-2"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelected(obs);
                        }}
                        data-ocid={`observations.view_button.${idx + 1}`}
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

      {/* ── Submit dialog ──────────────────────────────────────────────────── */}
      <SubmitObsDialog
        open={showSubmit}
        onClose={() => setShowSubmit(false)}
        onCreated={() => {
          qc.invalidateQueries({ queryKey: ["observations"] });
          qc.invalidateQueries({ queryKey: ["bbsStats"] });
        }}
      />
    </div>
  );
}
