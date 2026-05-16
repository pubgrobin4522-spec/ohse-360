import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
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
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  AlertTriangle,
  BarChart3,
  CalendarDays,
  CheckCircle2,
  ChevronRight,
  ClipboardCheck,
  Clock,
  FileText,
  Filter,
  Flame,
  HardHat,
  Info,
  Link2,
  Loader2,
  Lock,
  MapPin,
  Mountain,
  Plus,
  RefreshCw,
  Shield,
  Shovel,
  Timer,
  Users,
  Wind,
  X,
  XCircle,
  Zap,
} from "lucide-react";
import { useMemo, useState } from "react";
import type { ReactNode } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { toast } from "sonner";
import {
  type CreatePTWInput,
  type PTWExtension,
  type PTWExtensionView,
  PTWStatus,
  type PTWView,
  type PermitExtension,
  PermitType,
} from "../backend";
import { useAuth } from "../hooks/useAuth";
import { useBackend } from "../hooks/useBackend";

// --- Constants -----------------------------------------------------------

const PERMIT_TYPE_LABELS: Record<PermitType, string> = {
  HotWork: "Hot Work",
  ColdWork: "Cold Work",
  ConfinedSpace: "Confined Space",
  WorkAtHeight: "Work at Height",
  ElectricalIsolation: "Electrical Isolation",
  Excavation: "Excavation",
};

const STATUS_LABELS: Record<PTWStatus, string> = {
  Draft: "Draft",
  PendingHOD: "Pending HOD",
  PendingAreaInCharge: "Pending Area In Charge",
  PendingSafetyOfficer: "Pending Safety Officer",
  Active: "Active",
  Completed: "Completed",
  Closed: "Closed",
  Rejected: "Rejected",
};

const PPE_OPTIONS = [
  "Helmet",
  "Gloves",
  "Harness",
  "Goggles",
  "Respirator",
  "Boots",
  "Coverall",
  "Face Shield",
  "Ear Protection",
];

// Types requiring JSA attachment
const JSA_REQUIRED_TYPES: PermitType[] = [
  PermitType.HotWork,
  PermitType.ConfinedSpace,
  PermitType.WorkAtHeight,
  PermitType.ElectricalIsolation,
];

// Types requiring LOTO
const LOTO_REQUIRED_TYPES: PermitType[] = [PermitType.ElectricalIsolation];

function permitTypeIcon(t: PermitType): ReactNode {
  const map: Record<PermitType, ReactNode> = {
    HotWork: <Flame className="w-4 h-4" />,
    ColdWork: <Wind className="w-4 h-4" />,
    ConfinedSpace: <Mountain className="w-4 h-4" />,
    WorkAtHeight: <Shield className="w-4 h-4" />,
    ElectricalIsolation: <Zap className="w-4 h-4" />,
    Excavation: <Shovel className="w-4 h-4" />,
  };
  return map[t];
}

// --- Status Badge --------------------------------------------------------

function StatusBadge({ status }: { status: PTWStatus }) {
  const variants: Record<PTWStatus, string> = {
    Draft: "bg-muted/50 text-muted-foreground border-border",
    PendingHOD: "bg-secondary/20 text-secondary border-secondary/40",
    PendingAreaInCharge: "bg-secondary/20 text-secondary border-secondary/40",
    PendingSafetyOfficer: "bg-secondary/20 text-secondary border-secondary/40",
    Active: "bg-primary/20 text-primary border-primary/40",
    Completed: "bg-primary/10 text-primary border-primary/30",
    Closed: "bg-muted/40 text-muted-foreground border-border",
    Rejected: "bg-destructive/20 text-destructive border-destructive/40",
  };
  return (
    <span
      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold border ${
        variants[status]
      }`}
    >
      {status === "Active" && (
        <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
      )}
      {STATUS_LABELS[status]}
    </span>
  );
}

// --- Approval Stepper ---------------------------------------------------

interface StepData {
  approverName: string;
  approved?: boolean;
  actionAt?: bigint;
  remarks: string;
}

interface ApprovalStep {
  label: string;
  role: string;
  step?: StepData;
  isPending: boolean;
}

function ApprovalStepper({ ptw }: { ptw: PTWView }) {
  const steps: ApprovalStep[] = [
    {
      label: "HOD Review",
      role: "Head of Department",
      step: ptw.hodStep
        ? {
            approverName: ptw.hodStep.approverName,
            approved: ptw.hodStep.approved,
            actionAt: ptw.hodStep.actionAt,
            remarks: ptw.hodStep.remarks,
          }
        : undefined,
      isPending: ptw.status === "PendingHOD",
    },
    {
      label: "Area In Charge Validation",
      role: "Area In Charge",
      step: ptw.aicStep
        ? {
            approverName: ptw.aicStep.approverName,
            approved: ptw.aicStep.approved,
            actionAt: ptw.aicStep.actionAt,
            remarks: ptw.aicStep.remarks,
          }
        : undefined,
      isPending: ptw.status === "PendingAreaInCharge",
    },
    {
      label: "Safety Officer Approval",
      role: "Safety Officer",
      step: ptw.soStep
        ? {
            approverName: ptw.soStep.approverName,
            approved: ptw.soStep.approved,
            actionAt: ptw.soStep.actionAt,
            remarks: ptw.soStep.remarks,
          }
        : undefined,
      isPending: ptw.status === "PendingSafetyOfficer",
    },
  ];

  return (
    <div className="space-y-0">
      {steps.map((s, i) => {
        const done = s.step?.approved === true;
        const rejected = s.step?.approved === false;
        return (
          <div key={s.label} className="flex gap-3">
            <div className="flex flex-col items-center">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 border-2 ${
                  done
                    ? "bg-primary/20 border-primary"
                    : rejected
                      ? "bg-destructive/20 border-destructive"
                      : s.isPending
                        ? "bg-secondary/20 border-secondary animate-pulse"
                        : "bg-muted/30 border-border"
                }`}
              >
                {done ? (
                  <CheckCircle2 className="w-4 h-4 text-primary" />
                ) : rejected ? (
                  <XCircle className="w-4 h-4 text-destructive" />
                ) : s.isPending ? (
                  <Clock className="w-4 h-4 text-secondary" />
                ) : (
                  <span className="text-xs font-bold text-muted-foreground">
                    {i + 1}
                  </span>
                )}
              </div>
              {i < 2 && (
                <div
                  className={`w-0.5 h-8 mt-0.5 ${
                    done ? "bg-primary/40" : "bg-border"
                  }`}
                />
              )}
            </div>
            <div className="pb-6 min-w-0 flex-1">
              <p
                className={`text-sm font-semibold ${
                  done
                    ? "text-primary"
                    : rejected
                      ? "text-destructive"
                      : s.isPending
                        ? "text-secondary"
                        : "text-muted-foreground"
                }`}
              >
                {s.label}
              </p>
              <p className="text-xs text-muted-foreground">{s.role}</p>
              {s.step && (
                <div className="mt-1.5 rounded-lg bg-muted/20 border border-border p-2.5 space-y-1">
                  <p className="text-xs font-medium text-foreground">
                    {s.step.approverName} &middot;{" "}
                    {s.step.approved === true
                      ? "Approved"
                      : s.step.approved === false
                        ? "Rejected"
                        : "Pending"}
                  </p>
                  {s.step.actionAt && (
                    <p className="text-xs text-muted-foreground">
                      {new Date(
                        Number(s.step.actionAt / 1_000_000n),
                      ).toLocaleString()}
                    </p>
                  )}
                  {s.step.remarks && (
                    <p className="text-xs text-foreground/80 italic">
                      &ldquo;{s.step.remarks}&rdquo;
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

// --- Create PTW Dialog --------------------------------------------------

function CreatePTWDialog({
  open,
  onClose,
}: { open: boolean; onClose: () => void }) {
  const { actor, token, isReady } = useBackend();
  const qc = useQueryClient();

  const [permitType, setPermitType] = useState<PermitType>(PermitType.HotWork);
  const [workDescription, setWorkDescription] = useState("");
  const [location, setLocation] = useState("");
  const [startDateTime, setStartDateTime] = useState("");
  const [endDateTime, setEndDateTime] = useState("");
  const [contractorTeam, setContractorTeam] = useState("");
  const [riskAssessed, setRiskAssessed] = useState(false);
  const [ppeRequired, setPpeRequired] = useState<string[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const mutation = useMutation({
    mutationFn: async (input: CreatePTWInput) => {
      if (!actor || !token) throw new Error("Not authenticated");
      const res = await actor.createPTW(token, input);
      if (res.__kind__ === "err") throw new Error(res.err);
      return res.ok;
    },
    onSuccess: (ptw) => {
      toast.success(`Permit ${ptw.permitNumber} created.`);
      qc.invalidateQueries({ queryKey: ["ptws"] });
      handleClose();
    },
    onError: (e: Error) => toast.error(e.message),
  });

  function handleClose() {
    setPermitType(PermitType.HotWork);
    setWorkDescription("");
    setLocation("");
    setStartDateTime("");
    setEndDateTime("");
    setContractorTeam("");
    setRiskAssessed(false);
    setPpeRequired([]);
    setErrors({});
    onClose();
  }

  function togglePPE(item: string) {
    setPpeRequired((prev) =>
      prev.includes(item) ? prev.filter((x) => x !== item) : [...prev, item],
    );
  }

  function validate(): boolean {
    const e: Record<string, string> = {};
    if (!workDescription.trim())
      e.workDescription = "Work description is required.";
    if (!location.trim()) e.location = "Location is required.";
    if (!startDateTime) e.startDateTime = "Start date/time is required.";
    if (!endDateTime) e.endDateTime = "End date/time is required.";
    if (startDateTime && endDateTime && endDateTime <= startDateTime)
      e.endDateTime = "End must be after start.";
    if (!contractorTeam.trim())
      e.contractorTeam = "Contractor/team is required.";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function handleCreate() {
    if (!validate()) return;
    mutation.mutate({
      permitType,
      workDescription: workDescription.trim(),
      location: location.trim(),
      startDateTime,
      endDateTime,
      contractorTeam: contractorTeam.trim(),
      riskAssessed,
      ppeRequired,
    });
  }

  return (
    <Dialog open={open} onOpenChange={(v) => !v && handleClose()}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-card border-border">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-foreground">
            <FileText className="w-5 h-5 text-primary" />
            New Work Permit (PTW)
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-5 pt-2">
          <div className="space-y-1.5">
            <Label className="text-foreground">Permit Type *</Label>
            <Select
              value={permitType}
              onValueChange={(v) => setPermitType(v as PermitType)}
            >
              <SelectTrigger
                className="bg-background border-input"
                data-ocid="ptw.type.select"
              >
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-card border-border">
                {Object.values(PermitType).map((t) => (
                  <SelectItem key={t} value={t}>
                    <span className="flex items-center gap-2">
                      {permitTypeIcon(t)}
                      {PERMIT_TYPE_LABELS[t]}
                    </span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <Label className="text-foreground">Work Description *</Label>
            <Textarea
              value={workDescription}
              onChange={(e) => setWorkDescription(e.target.value)}
              placeholder="Describe the work to be carried out…"
              rows={3}
              className="bg-background border-input resize-none"
              data-ocid="ptw.description.textarea"
            />
            {errors.workDescription && (
              <p
                className="text-xs text-destructive"
                data-ocid="ptw.description.field_error"
              >
                {errors.workDescription}
              </p>
            )}
          </div>

          <div className="space-y-1.5">
            <Label className="text-foreground">Location / Area *</Label>
            <Input
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="e.g. Boiler Room B3"
              className="bg-background border-input"
              data-ocid="ptw.location.input"
            />
            {errors.location && (
              <p
                className="text-xs text-destructive"
                data-ocid="ptw.location.field_error"
              >
                {errors.location}
              </p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label className="text-foreground">Start Date &amp; Time *</Label>
              <Input
                type="datetime-local"
                value={startDateTime}
                onChange={(e) => setStartDateTime(e.target.value)}
                className="bg-background border-input"
                data-ocid="ptw.start_datetime.input"
              />
              {errors.startDateTime && (
                <p
                  className="text-xs text-destructive"
                  data-ocid="ptw.start_datetime.field_error"
                >
                  {errors.startDateTime}
                </p>
              )}
            </div>
            <div className="space-y-1.5">
              <Label className="text-foreground">End Date &amp; Time *</Label>
              <Input
                type="datetime-local"
                value={endDateTime}
                onChange={(e) => setEndDateTime(e.target.value)}
                className="bg-background border-input"
                data-ocid="ptw.end_datetime.input"
              />
              {errors.endDateTime && (
                <p
                  className="text-xs text-destructive"
                  data-ocid="ptw.end_datetime.field_error"
                >
                  {errors.endDateTime}
                </p>
              )}
            </div>
          </div>

          <div className="space-y-1.5">
            <Label className="text-foreground">Contractor / Team *</Label>
            <Input
              value={contractorTeam}
              onChange={(e) => setContractorTeam(e.target.value)}
              placeholder="e.g. Apex Engineering Team"
              className="bg-background border-input"
              data-ocid="ptw.contractor.input"
            />
            {errors.contractorTeam && (
              <p
                className="text-xs text-destructive"
                data-ocid="ptw.contractor.field_error"
              >
                {errors.contractorTeam}
              </p>
            )}
          </div>

          <div className="flex items-center gap-3 rounded-lg border border-border bg-muted/10 p-3">
            <Checkbox
              id="riskAssessed"
              checked={riskAssessed}
              onCheckedChange={(v) => setRiskAssessed(!!v)}
              data-ocid="ptw.risk_assessed.checkbox"
            />
            <div>
              <Label
                htmlFor="riskAssessed"
                className="text-foreground cursor-pointer"
              >
                Risk Assessment Attached
              </Label>
              <p className="text-xs text-muted-foreground">
                Confirm a formal risk assessment document is attached or filed.
              </p>
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-foreground">PPE Required</Label>
            <div className="grid grid-cols-3 gap-2">
              {PPE_OPTIONS.map((ppe) => (
                <label
                  key={ppe}
                  htmlFor={`ppe-${ppe.toLowerCase().replace(/ /g, "-")}`}
                  className="flex items-center gap-2 rounded-md border border-border bg-muted/10 px-2.5 py-2 cursor-pointer hover:bg-muted/20 transition-colors"
                >
                  <Checkbox
                    id={`ppe-${ppe.toLowerCase().replace(/ /g, "-")}`}
                    checked={ppeRequired.includes(ppe)}
                    onCheckedChange={() => togglePPE(ppe)}
                    data-ocid={`ptw.ppe.checkbox.${ppe.toLowerCase().replace(/ /g, "_")}`}
                  />
                  <span className="text-sm text-foreground">{ppe}</span>
                </label>
              ))}
            </div>
          </div>

          <Separator className="bg-border" />

          <div className="flex justify-end gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              className="border-border"
              data-ocid="ptw.create.cancel_button"
            >
              Cancel
            </Button>
            <Button
              type="button"
              disabled={!isReady || mutation.isPending}
              onClick={handleCreate}
              className="safety-gradient-primary text-primary-foreground"
              data-ocid="ptw.create.submit_button"
            >
              {mutation.isPending && (
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
              )}
              Create Permit
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// --- Info Cell ----------------------------------------------------------

function InfoCell({
  icon,
  label,
  value,
}: {
  icon: ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-lg border border-border bg-muted/10 p-2.5">
      <p className="text-xs text-muted-foreground flex items-center gap-1 mb-0.5">
        {icon}
        {label}
      </p>
      <p className="text-sm font-medium text-foreground break-words">{value}</p>
    </div>
  );
}

// --- Gas Test Field -----------------------------------------------------

interface GasFieldProps {
  label: string;
  unit: string;
  safeRange: string;
  value: string;
  onChange: (v: string) => void;
  isInRange: boolean | null;
  ocid: string;
}

function GasField({
  label,
  unit,
  safeRange,
  value,
  onChange,
  isInRange,
  ocid,
}: GasFieldProps) {
  const border =
    isInRange === null
      ? "border-input"
      : isInRange
        ? "border-primary"
        : "border-destructive";
  const hint =
    isInRange === null
      ? "text-muted-foreground"
      : isInRange
        ? "text-primary"
        : "text-destructive";
  return (
    <div className="space-y-1">
      <Label className="text-foreground text-xs">
        {label} ({unit})
      </Label>
      <Input
        type="number"
        step="0.01"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="—"
        className={`bg-background ${border} h-8 text-sm`}
        data-ocid={ocid}
      />
      <p className={`text-xs ${hint} flex items-center gap-1`}>
        <Info className="w-3 h-3" />
        Safe: {safeRange}
        {isInRange === true && " ✓"}
        {isInRange === false && " ✗"}
      </p>
    </div>
  );
}

// --- Extend Permit Modal ------------------------------------------------

function ExtendPermitModal({
  permitNumber,
  onClose,
}: {
  permitNumber: string;
  onClose: () => void;
}) {
  const { actor, token } = useBackend();
  const qc = useQueryClient();
  const [newEndTime, setNewEndTime] = useState("");
  const [reason, setReason] = useState("");
  const [err, setErr] = useState("");

  const mutation = useMutation({
    mutationFn: async () => {
      if (!actor || !token) throw new Error("Not authenticated");
      if (!newEndTime) {
        setErr("New end date/time is required.");
        return;
      }
      if (!reason.trim()) {
        setErr("Reason is required.");
        return;
      }
      const ts = BigInt(new Date(newEndTime).getTime()) * 1_000_000n;
      const res = await actor.extendPermit(
        token,
        permitNumber,
        ts,
        reason.trim(),
      );
      if (res.__kind__ === "err") throw new Error(res.err);
    },
    onSuccess: () => {
      toast.success(`Permit ${permitNumber} extended.`);
      qc.invalidateQueries({ queryKey: ["ptws"] });
      qc.invalidateQueries({ queryKey: ["ptwext", permitNumber] });
      onClose();
    },
    onError: (e: Error) => toast.error(e.message),
  });

  return (
    <Dialog open onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="max-w-md bg-card border-border">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-foreground">
            <Timer className="w-4 h-4 text-primary" />
            Extend Permit — {permitNumber}
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4 pt-2">
          <div className="space-y-1.5">
            <Label className="text-foreground">New End Date &amp; Time *</Label>
            <Input
              type="datetime-local"
              value={newEndTime}
              onChange={(e) => setNewEndTime(e.target.value)}
              className="bg-background border-input"
              data-ocid="ptw.extend.end_datetime.input"
            />
          </div>
          <div className="space-y-1.5">
            <Label className="text-foreground">Reason *</Label>
            <Textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Reason for extension…"
              rows={2}
              className="bg-background border-input resize-none"
              data-ocid="ptw.extend.reason.textarea"
            />
          </div>
          {err && (
            <p
              className="text-xs text-destructive"
              data-ocid="ptw.extend.field_error"
            >
              {err}
            </p>
          )}
          <div className="flex justify-end gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="border-border"
              data-ocid="ptw.extend.cancel_button"
            >
              Cancel
            </Button>
            <Button
              type="button"
              disabled={mutation.isPending}
              onClick={() => mutation.mutate()}
              className="safety-gradient-primary text-primary-foreground"
              data-ocid="ptw.extend.submit_button"
            >
              {mutation.isPending && (
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
              )}
              Extend Permit
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// --- Cancel Permit Modal ------------------------------------------------

function CancelPermitModal({
  permitNumber,
  onClose,
}: {
  permitNumber: string;
  onClose: () => void;
}) {
  const { actor, token } = useBackend();
  const qc = useQueryClient();
  const [reason, setReason] = useState("");
  const [err, setErr] = useState("");

  const mutation = useMutation({
    mutationFn: async () => {
      if (!actor || !token) throw new Error("Not authenticated");
      if (!reason.trim()) {
        setErr("Cancellation reason is required.");
        return;
      }
      const res = await actor.cancelPermit(token, permitNumber, reason.trim());
      if (res.__kind__ === "err") throw new Error(res.err);
    },
    onSuccess: () => {
      toast.success(`Permit ${permitNumber} cancelled.`);
      qc.invalidateQueries({ queryKey: ["ptws"] });
      onClose();
    },
    onError: (e: Error) => toast.error(e.message),
  });

  return (
    <Dialog open onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="max-w-md bg-card border-border">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-destructive">
            <XCircle className="w-4 h-4" />
            Cancel Permit — {permitNumber}
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4 pt-2">
          <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-3">
            <p className="text-sm text-destructive font-medium">
              Warning: This action cannot be undone.
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              The permit will be permanently cancelled and all stakeholders
              notified.
            </p>
          </div>
          <div className="space-y-1.5">
            <Label className="text-foreground">Cancellation Reason *</Label>
            <Textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Reason for cancellation…"
              rows={3}
              className="bg-background border-input resize-none"
              data-ocid="ptw.cancel.reason.textarea"
            />
          </div>
          {err && (
            <p
              className="text-xs text-destructive"
              data-ocid="ptw.cancel.field_error"
            >
              {err}
            </p>
          )}
          <div className="flex justify-end gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="border-border"
              data-ocid="ptw.cancel.cancel_button"
            >
              Keep Permit
            </Button>
            <Button
              type="button"
              variant="outline"
              disabled={mutation.isPending}
              onClick={() => mutation.mutate()}
              className="border-destructive/40 text-destructive hover:bg-destructive/10"
              data-ocid="ptw.cancel.confirm_button"
            >
              {mutation.isPending && (
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
              )}
              Confirm Cancellation
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// --- Phase 2 Extension Panel -------------------------------------------

function PTWPhase2Panel({
  ptw,
  userRole,
}: {
  ptw: PTWView;
  userRole: string;
}) {
  const { actor, token } = useBackend();
  const qc = useQueryClient();

  const { data: ext } = useQuery<PTWExtensionView | null>({
    queryKey: ["ptwext", ptw.permitNumber],
    queryFn: async () => {
      if (!actor || !token) return null;
      const res = await actor.getPtwExtension(token, ptw.permitNumber);
      if (res.__kind__ === "err") return null;
      return res.ok;
    },
    enabled: !!actor && !!token,
  });

  const [jsaNumber, setJsaNumber] = useState("");
  const [hiraNumber, setHiraNumber] = useState("");
  const [lotoNumber, setLotoNumber] = useState("");
  const [gasO2, setGasO2] = useState("");
  const [gasLEL, setGasLEL] = useState("");
  const [gasH2S, setGasH2S] = useState("");
  const [gasCO, setGasCO] = useState("");
  const [toolboxAttendees, setToolboxAttendees] = useState("");
  const [toolboxDone, setToolboxDone] = useState(false);
  const [emergencyPlan, setEmergencyPlan] = useState(false);
  const [emergencyDesc, setEmergencyDesc] = useState("");
  const [showExtend, setShowExtend] = useState(false);
  const [showCancel, setShowCancel] = useState(false);

  const isConfinedSpace = ptw.permitType === PermitType.ConfinedSpace;
  const needsJSA = JSA_REQUIRED_TYPES.includes(ptw.permitType);
  const needsLOTO = LOTO_REQUIRED_TYPES.includes(ptw.permitType);
  const isActive = ptw.status === "Active";
  const canExtend = userRole === "SafetyOfficer" || userRole === "SystemAdmin";
  const canCancel =
    ["SafetyOfficer", "HOD", "AreaInCharge", "SystemAdmin"].includes(
      userRole,
    ) && isActive;

  // Gas range checks (null = not entered)
  const o2Val = gasO2 ? Number.parseFloat(gasO2) : null;
  const lelVal = gasLEL ? Number.parseFloat(gasLEL) : null;
  const h2sVal = gasH2S ? Number.parseFloat(gasH2S) : null;
  const coVal = gasCO ? Number.parseFloat(gasCO) : null;
  const o2InRange = o2Val !== null ? o2Val >= 19.5 && o2Val <= 23 : null;
  const lelInRange = lelVal !== null ? lelVal < 10 : null;
  const h2sInRange = h2sVal !== null ? h2sVal < 1 : null;
  const coInRange = coVal !== null ? coVal < 25 : null;

  const saveExtMutation = useMutation({
    mutationFn: async (data: Partial<PTWExtension>) => {
      if (!actor || !token) throw new Error("Not authenticated");
      const current: PTWExtension = ext ?? {
        isCancelled: false,
        toolboxAttendees: [],
        requiresLOTO: needsLOTO,
        permitNumber: ptw.permitNumber,
        gasTestPassed: false,
        emergencyRescuePlan: false,
        toolboxTalkDone: false,
        extensions: [],
        createdAt: BigInt(Date.now()) * 1_000_000n,
      };
      const payload: PTWExtension = {
        ...current,
        linkedJsaNumber: jsaNumber.trim() || undefined,
        linkedHiraNumber: hiraNumber.trim() || undefined,
        ...data,
      };
      const res = await actor.createOrUpdatePtwExtension(
        token,
        ptw.permitNumber,
        payload,
      );
      if (res.__kind__ === "err") throw new Error(res.err);
    },
    onSuccess: () => {
      toast.success("Extension data saved.");
      qc.invalidateQueries({ queryKey: ["ptwext", ptw.permitNumber] });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const gasTestMutation = useMutation({
    mutationFn: async () => {
      if (!actor || !token) throw new Error("Not authenticated");
      if (!gasO2 || !gasLEL || !gasH2S || !gasCO)
        throw new Error("All gas readings are required.");
      const res = await actor.setPtwGasTest(
        token,
        ptw.permitNumber,
        Number.parseFloat(gasO2),
        Number.parseFloat(gasLEL),
        Number.parseFloat(gasH2S),
        Number.parseFloat(gasCO),
      );
      if (res.__kind__ === "err") throw new Error(res.err);
      return res.ok;
    },
    onSuccess: (passed) => {
      toast.success(
        `Gas test submitted. Status: ${passed ? "PASS ✓" : "FAIL ✗"}`,
      );
      qc.invalidateQueries({ queryKey: ["ptwext", ptw.permitNumber] });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const toolboxMutation = useMutation({
    mutationFn: async () => {
      if (!actor || !token) throw new Error("Not authenticated");
      const ids = toolboxAttendees
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean)
        .map((s) => BigInt(s));
      const res = await actor.recordToolboxTalk(token, ptw.permitNumber, ids);
      if (res.__kind__ === "err") throw new Error(res.err);
    },
    onSuccess: () => {
      toast.success("Toolbox talk recorded.");
      qc.invalidateQueries({ queryKey: ["ptwext", ptw.permitNumber] });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const gasTestStatus =
    ext == null
      ? "Pending"
      : ext.gasTestO2 == null
        ? "Pending"
        : ext.gasTestPassed
          ? "Pass"
          : "Fail";

  return (
    <div className="space-y-5">
      {/* JSA Section */}
      {needsJSA && (
        <>
          <Separator className="bg-border" />
          <div className="space-y-3" data-ocid="ptw.jsa_section">
            <p className="text-sm font-semibold text-foreground flex items-center gap-2">
              <Link2 className="w-4 h-4 text-primary" />
              JSA Requirement
            </p>
            {!ext?.linkedJsaNumber && (
              <div className="flex items-center gap-2 rounded-lg border border-yellow-500/40 bg-yellow-500/10 px-3 py-2">
                <AlertTriangle className="w-4 h-4 text-yellow-500 shrink-0" />
                <p className="text-xs text-yellow-600 dark:text-yellow-400 font-medium">
                  A JSA is mandatory for {PERMIT_TYPE_LABELS[ptw.permitType]}{" "}
                  permits
                </p>
              </div>
            )}
            <div className="flex gap-2">
              <Input
                value={jsaNumber}
                onChange={(e) => setJsaNumber(e.target.value)}
                placeholder={ext?.linkedJsaNumber ?? "JSA-2026-0001"}
                className="bg-background border-input flex-1"
                data-ocid="ptw.jsa_number.input"
              />
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="border-border"
                onClick={() =>
                  saveExtMutation.mutate({
                    linkedJsaNumber: jsaNumber.trim() || undefined,
                  })
                }
                disabled={saveExtMutation.isPending}
                data-ocid="ptw.jsa_number.save_button"
              >
                {saveExtMutation.isPending ? (
                  <Loader2 className="w-3 h-3 animate-spin" />
                ) : (
                  "Link"
                )}
              </Button>
            </div>
            {ext?.linkedJsaNumber && (
              <p className="text-xs text-primary flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" /> Linked:{" "}
                {ext.linkedJsaNumber}
              </p>
            )}
          </div>
        </>
      )}

      {/* HIRA Section */}
      <>
        <Separator className="bg-border" />
        <div className="space-y-3" data-ocid="ptw.hira_section">
          <p className="text-sm font-semibold text-foreground flex items-center gap-2">
            <Shield className="w-4 h-4 text-primary" />
            HIRA Reference
          </p>
          <div className="flex gap-2">
            <Input
              value={hiraNumber}
              onChange={(e) => setHiraNumber(e.target.value)}
              placeholder={ext?.linkedHiraNumber ?? "HIRA-2026-0001"}
              className="bg-background border-input flex-1"
              data-ocid="ptw.hira_number.input"
            />
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="border-border"
              onClick={() =>
                saveExtMutation.mutate({
                  linkedHiraNumber: hiraNumber.trim() || undefined,
                })
              }
              disabled={saveExtMutation.isPending}
              data-ocid="ptw.hira_number.save_button"
            >
              {saveExtMutation.isPending ? (
                <Loader2 className="w-3 h-3 animate-spin" />
              ) : (
                "Link"
              )}
            </Button>
          </div>
          {ext?.linkedHiraNumber && (
            <p className="text-xs text-primary flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3" /> Linked:{" "}
              {ext.linkedHiraNumber}
            </p>
          )}
        </div>
      </>

      {/* LOTO Section */}
      {needsLOTO && (
        <>
          <Separator className="bg-border" />
          <div className="space-y-3" data-ocid="ptw.loto_section">
            <p className="text-sm font-semibold text-foreground flex items-center gap-2">
              <Lock className="w-4 h-4 text-destructive" />
              LOTO Required
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-destructive/20 text-destructive border border-destructive/40">
                Mandatory
              </span>
            </p>
            <div className="flex gap-2">
              <Input
                value={lotoNumber}
                onChange={(e) => setLotoNumber(e.target.value)}
                placeholder="LOTO-2026-0001"
                className="bg-background border-input flex-1"
                data-ocid="ptw.loto_number.input"
              />
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="border-border"
                onClick={() =>
                  toast.info(`Navigate to LOTO module to link: ${lotoNumber}`)
                }
                data-ocid="ptw.loto_number.link_button"
              >
                Link LOTO
              </Button>
            </div>
            {ext?.requiresLOTO && (
              <p className="text-xs text-destructive flex items-center gap-1">
                <AlertTriangle className="w-3 h-3" /> LOTO isolation must be
                verified before permit activation
              </p>
            )}
          </div>
        </>
      )}

      {/* Gas Test Section — ConfinedSpace only */}
      {isConfinedSpace && (
        <>
          <Separator className="bg-border" />
          <div className="space-y-4" data-ocid="ptw.gas_test_section">
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold text-foreground flex items-center gap-2">
                <Wind className="w-4 h-4 text-primary" />
                Gas Test (Confined Space)
              </p>
              <span
                className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold border ${
                  gasTestStatus === "Pass"
                    ? "bg-primary/20 text-primary border-primary/40"
                    : gasTestStatus === "Fail"
                      ? "bg-destructive/20 text-destructive border-destructive/40"
                      : "bg-muted/40 text-muted-foreground border-border"
                }`}
                data-ocid="ptw.gas_test_status"
              >
                {gasTestStatus}
              </span>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <GasField
                label="O₂"
                unit="%"
                safeRange="19.5–23%"
                value={gasO2}
                onChange={setGasO2}
                isInRange={o2InRange}
                ocid="ptw.gas_test.o2.input"
              />
              <GasField
                label="LEL"
                unit="%"
                safeRange="<10%"
                value={gasLEL}
                onChange={setGasLEL}
                isInRange={lelInRange}
                ocid="ptw.gas_test.lel.input"
              />
              <GasField
                label="H₂S"
                unit="ppm"
                safeRange="<1 ppm"
                value={gasH2S}
                onChange={setGasH2S}
                isInRange={h2sInRange}
                ocid="ptw.gas_test.h2s.input"
              />
              <GasField
                label="CO"
                unit="ppm"
                safeRange="<25 ppm"
                value={gasCO}
                onChange={setGasCO}
                isInRange={coInRange}
                ocid="ptw.gas_test.co.input"
              />
            </div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={
                !gasO2 ||
                !gasLEL ||
                !gasH2S ||
                !gasCO ||
                gasTestMutation.isPending
              }
              onClick={() => gasTestMutation.mutate()}
              className="border-border gap-2"
              data-ocid="ptw.gas_test.submit_button"
            >
              {gasTestMutation.isPending && (
                <Loader2 className="w-3 h-3 animate-spin" />
              )}
              Submit Gas Test
            </Button>
          </div>
        </>
      )}

      {/* Toolbox Talk Section */}
      <>
        <Separator className="bg-border" />
        <div className="space-y-3" data-ocid="ptw.toolbox_section">
          <p className="text-sm font-semibold text-foreground flex items-center gap-2">
            <Users className="w-4 h-4 text-primary" />
            Toolbox Talk
          </p>
          <div className="flex items-center gap-3 rounded-lg border border-border bg-muted/10 p-3">
            <Checkbox
              id="toolbox-done"
              checked={toolboxDone}
              onCheckedChange={(v) => setToolboxDone(!!v)}
              data-ocid="ptw.toolbox.checkbox"
            />
            <Label
              htmlFor="toolbox-done"
              className="text-foreground cursor-pointer"
            >
              Toolbox Talk Completed
            </Label>
            {ext?.toolboxTalkDone && (
              <span className="ml-auto text-xs text-primary flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" /> Recorded
              </span>
            )}
          </div>
          <div className="space-y-1.5">
            <Label className="text-foreground text-xs">
              Attendee Employee IDs (comma-separated)
            </Label>
            <div className="flex gap-2">
              <Input
                value={toolboxAttendees}
                onChange={(e) => setToolboxAttendees(e.target.value)}
                placeholder="e.g. 100001, 100002, 100003"
                className="bg-background border-input flex-1"
                data-ocid="ptw.toolbox.attendees.input"
              />
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="border-border"
                onClick={() => toolboxMutation.mutate()}
                disabled={!toolboxAttendees.trim() || toolboxMutation.isPending}
                data-ocid="ptw.toolbox.record_button"
              >
                {toolboxMutation.isPending ? (
                  <Loader2 className="w-3 h-3 animate-spin" />
                ) : (
                  "Record"
                )}
              </Button>
            </div>
          </div>
          {ext?.toolboxAttendees && ext.toolboxAttendees.length > 0 && (
            <p className="text-xs text-muted-foreground">
              {ext.toolboxAttendees.length} attendee
              {ext.toolboxAttendees.length !== 1 ? "s" : ""} recorded
            </p>
          )}
        </div>
      </>

      {/* Emergency Rescue Plan — ConfinedSpace only */}
      {isConfinedSpace && (
        <>
          <Separator className="bg-border" />
          <div className="space-y-3" data-ocid="ptw.emergency_rescue_section">
            <p className="text-sm font-semibold text-foreground flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-destructive" />
              Emergency Rescue Plan
            </p>
            <div className="flex items-center gap-3 rounded-lg border border-border bg-muted/10 p-3">
              <Checkbox
                id="emergency-plan"
                checked={emergencyPlan}
                onCheckedChange={(v) => setEmergencyPlan(!!v)}
                data-ocid="ptw.emergency_plan.checkbox"
              />
              <Label
                htmlFor="emergency-plan"
                className="text-foreground cursor-pointer"
              >
                Emergency Rescue Plan in Place
              </Label>
            </div>
            {emergencyPlan && (
              <div className="space-y-1.5">
                <Label className="text-foreground text-xs">
                  Rescue Plan Description
                </Label>
                <Textarea
                  value={emergencyDesc}
                  onChange={(e) => setEmergencyDesc(e.target.value)}
                  placeholder="Describe the emergency rescue plan, rescue team, equipment and procedure…"
                  rows={3}
                  className="bg-background border-input resize-none"
                  data-ocid="ptw.emergency_plan.description.textarea"
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="border-border"
                  onClick={() =>
                    saveExtMutation.mutate({
                      emergencyRescuePlan: emergencyPlan,
                      emergencyRescueDesc: emergencyDesc.trim() || undefined,
                    })
                  }
                  disabled={saveExtMutation.isPending}
                  data-ocid="ptw.emergency_plan.save_button"
                >
                  {saveExtMutation.isPending ? (
                    <Loader2 className="w-3 h-3 animate-spin" />
                  ) : (
                    "Save"
                  )}
                </Button>
              </div>
            )}
          </div>
        </>
      )}

      {/* Extension History */}
      {ext?.extensions && ext.extensions.length > 0 && (
        <>
          <Separator className="bg-border" />
          <div className="space-y-2" data-ocid="ptw.extension_history_section">
            <p className="text-sm font-semibold text-foreground flex items-center gap-2">
              <RefreshCw className="w-4 h-4 text-primary" />
              Extension History
            </p>
            <div className="space-y-2">
              {ext.extensions.map((ex: PermitExtension, i: number) => (
                <div
                  key={i}
                  className="rounded-lg border border-border bg-muted/10 p-3 space-y-1"
                >
                  <p className="text-xs font-medium text-foreground">
                    Extended by EMP#{String(ex.extendedBy)} &middot;{" "}
                    {new Date(
                      Number(ex.extendedAt / 1_000_000n),
                    ).toLocaleString()}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    New end:{" "}
                    {new Date(
                      Number(ex.newEndTime / 1_000_000n),
                    ).toLocaleString()}
                  </p>
                  {ex.reason && (
                    <p className="text-xs text-foreground/80 italic">
                      &ldquo;{ex.reason}&rdquo;
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      {/* Extend / Cancel Actions */}
      {(canExtend || canCancel) && isActive && (
        <>
          <Separator className="bg-border" />
          <div
            className="flex gap-3 flex-wrap"
            data-ocid="ptw.phase2_actions_panel"
          >
            {canExtend && (
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="border-primary/40 text-primary hover:bg-primary/10 gap-2"
                onClick={() => setShowExtend(true)}
                data-ocid="ptw.extend.open_modal_button"
              >
                <Timer className="w-4 h-4" />
                Extend Permit
              </Button>
            )}
            {canCancel && (
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="border-destructive/40 text-destructive hover:bg-destructive/10 gap-2"
                onClick={() => setShowCancel(true)}
                data-ocid="ptw.cancel.open_modal_button"
              >
                <XCircle className="w-4 h-4" />
                Cancel Permit
              </Button>
            )}
          </div>
        </>
      )}

      {showExtend && (
        <ExtendPermitModal
          permitNumber={ptw.permitNumber}
          onClose={() => setShowExtend(false)}
        />
      )}
      {showCancel && (
        <CancelPermitModal
          permitNumber={ptw.permitNumber}
          onClose={() => setShowCancel(false)}
        />
      )}
    </div>
  );
}

// --- PTW Detail Dialog --------------------------------------------------

function PTWDetailDialog({
  ptw,
  onClose,
  userRole,
}: {
  ptw: PTWView;
  onClose: () => void;
  userRole: string;
}) {
  const { actor, token } = useBackend();
  const qc = useQueryClient();
  const [remarks, setRemarks] = useState("");
  const [remarkErr, setRemarkErr] = useState("");

  const canAct =
    (userRole === "HOD" && ptw.status === "PendingHOD") ||
    (userRole === "AreaInCharge" && ptw.status === "PendingAreaInCharge") ||
    (userRole === "SafetyOfficer" && ptw.status === "PendingSafetyOfficer");
  const canClose =
    userRole === "SafetyOfficer" &&
    (ptw.status === "Active" || ptw.status === "Completed");
  const canSubmit =
    (userRole === "Employee" ||
      userRole === "ContractorAdmin" ||
      userRole === "SafetyOfficer") &&
    ptw.status === "Draft";

  const actionMutation = useMutation({
    mutationFn: async ({ approve, rem }: { approve: boolean; rem: string }) => {
      if (!actor || !token) throw new Error("Not authenticated");
      const res = await actor.actOnPTW(token, ptw.permitNumber, approve, rem);
      if (res.__kind__ === "err") throw new Error(res.err);
    },
    onSuccess: (_data, vars) => {
      toast.success(
        vars.approve
          ? `Permit ${ptw.permitNumber} approved.`
          : `Permit ${ptw.permitNumber} rejected.`,
      );
      qc.invalidateQueries({ queryKey: ["ptws"] });
      onClose();
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const closeMutation = useMutation({
    mutationFn: async () => {
      if (!actor || !token) throw new Error("Not authenticated");
      const res = await actor.closePTW(token, ptw.permitNumber);
      if (res.__kind__ === "err") throw new Error(res.err);
    },
    onSuccess: () => {
      toast.success(`Permit ${ptw.permitNumber} closed.`);
      qc.invalidateQueries({ queryKey: ["ptws"] });
      onClose();
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const submitMutation = useMutation({
    mutationFn: async () => {
      if (!actor || !token) throw new Error("Not authenticated");
      const res = await actor.submitPTW(token, ptw.permitNumber);
      if (res.__kind__ === "err") throw new Error(res.err);
    },
    onSuccess: () => {
      toast.success(`Permit ${ptw.permitNumber} submitted for approval.`);
      qc.invalidateQueries({ queryKey: ["ptws"] });
      onClose();
    },
    onError: (e: Error) => toast.error(e.message),
  });

  function handleAct(approve: boolean) {
    if (!approve && !remarks.trim()) {
      setRemarkErr("Rejection remarks are required.");
      return;
    }
    setRemarkErr("");
    actionMutation.mutate({ approve, rem: remarks });
  }

  const isBusy =
    actionMutation.isPending ||
    closeMutation.isPending ||
    submitMutation.isPending;

  return (
    <Dialog open onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-card border-border">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between gap-2">
            <span className="flex items-center gap-2 text-foreground">
              {permitTypeIcon(ptw.permitType)}
              {ptw.permitNumber}
            </span>
            <StatusBadge status={ptw.status} />
          </DialogTitle>
        </DialogHeader>

        {ptw.status === "Rejected" && ptw.rejectedRemarks && (
          <div
            className="flex gap-2 rounded-lg border border-destructive/40 bg-destructive/10 px-4 py-3"
            data-ocid="ptw.rejection_banner"
          >
            <AlertTriangle className="w-5 h-5 text-destructive shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-semibold text-destructive">
                Permit Rejected
              </p>
              <p className="text-sm text-foreground/80 mt-0.5">
                {ptw.rejectedRemarks}
              </p>
            </div>
          </div>
        )}

        <div className="space-y-5">
          <div className="grid grid-cols-2 gap-3">
            <InfoCell
              icon={<FileText className="w-3.5 h-3.5" />}
              label="Type"
              value={PERMIT_TYPE_LABELS[ptw.permitType]}
            />
            <InfoCell
              icon={<MapPin className="w-3.5 h-3.5" />}
              label="Location"
              value={ptw.location}
            />
            <InfoCell
              icon={<CalendarDays className="w-3.5 h-3.5" />}
              label="Start"
              value={ptw.startDateTime.replace("T", " ").slice(0, 16)}
            />
            <InfoCell
              icon={<CalendarDays className="w-3.5 h-3.5" />}
              label="End"
              value={ptw.endDateTime.replace("T", " ").slice(0, 16)}
            />
            <InfoCell
              icon={<Users className="w-3.5 h-3.5" />}
              label="Requested By"
              value={ptw.requestedByName}
            />
            <InfoCell
              icon={<Users className="w-3.5 h-3.5" />}
              label="Contractor / Team"
              value={ptw.contractorTeam}
            />
            <InfoCell
              icon={<ClipboardCheck className="w-3.5 h-3.5" />}
              label="Risk Assessment"
              value={ptw.riskAssessed ? "Attached" : "Not Attached"}
            />
          </div>

          <div className="rounded-lg border border-border bg-muted/10 p-3">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1">
              Work Description
            </p>
            <p className="text-sm text-foreground">{ptw.workDescription}</p>
          </div>

          {ptw.ppeRequired.length > 0 && (
            <div>
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">
                PPE Required
              </p>
              <div className="flex flex-wrap gap-2">
                {ptw.ppeRequired.map((ppe) => (
                  <Badge
                    key={ppe}
                    variant="outline"
                    className="border-primary/30 text-primary bg-primary/10 gap-1"
                  >
                    <HardHat className="w-3 h-3" />
                    {ppe}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          <Separator className="bg-border" />

          <div>
            <p className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
              <Shield className="w-4 h-4 text-primary" />
              Approval Chain
            </p>
            <ApprovalStepper ptw={ptw} />
          </div>

          {/* ---- Phase 2 Extension Panel ---- */}
          <PTWPhase2Panel ptw={ptw} userRole={userRole} />

          {canAct && (
            <>
              <Separator className="bg-border" />
              <div
                className="space-y-3 rounded-lg border border-secondary/40 bg-secondary/5 p-4"
                data-ocid="ptw.approval_panel"
              >
                <p className="text-sm font-semibold text-secondary">
                  Your Action Required
                </p>
                <div className="space-y-1.5">
                  <Label className="text-foreground">Remarks</Label>
                  <Textarea
                    value={remarks}
                    onChange={(e) => setRemarks(e.target.value)}
                    placeholder="Add review remarks (required for rejection)…"
                    rows={2}
                    className="bg-background border-input resize-none"
                    data-ocid="ptw.remarks.textarea"
                  />
                  {remarkErr && (
                    <p
                      className="text-xs text-destructive"
                      data-ocid="ptw.remarks.field_error"
                    >
                      {remarkErr}
                    </p>
                  )}
                </div>
                <div className="flex gap-3 justify-end">
                  <Button
                    type="button"
                    variant="outline"
                    disabled={isBusy}
                    onClick={() => handleAct(false)}
                    className="border-destructive/40 text-destructive hover:bg-destructive/10"
                    data-ocid="ptw.reject_button"
                  >
                    {actionMutation.isPending && (
                      <Loader2 className="w-4 h-4 animate-spin mr-2" />
                    )}
                    <XCircle className="w-4 h-4 mr-1" />
                    Reject
                  </Button>
                  <Button
                    type="button"
                    disabled={isBusy}
                    onClick={() => handleAct(true)}
                    className="safety-gradient-primary text-primary-foreground"
                    data-ocid="ptw.approve_button"
                  >
                    {actionMutation.isPending && (
                      <Loader2 className="w-4 h-4 animate-spin mr-2" />
                    )}
                    <CheckCircle2 className="w-4 h-4 mr-1" />
                    Approve
                  </Button>
                </div>
              </div>
            </>
          )}

          {canSubmit && (
            <>
              <Separator className="bg-border" />
              <div className="flex justify-end" data-ocid="ptw.submit_panel">
                <Button
                  type="button"
                  disabled={isBusy}
                  onClick={() => submitMutation.mutate()}
                  className="safety-gradient-primary text-primary-foreground"
                  data-ocid="ptw.submit_for_approval_button"
                >
                  {submitMutation.isPending && (
                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  )}
                  <ChevronRight className="w-4 h-4 mr-1" />
                  Submit for Approval
                </Button>
              </div>
            </>
          )}

          {canClose && (
            <>
              <Separator className="bg-border" />
              <div className="flex justify-end" data-ocid="ptw.close_panel">
                <Button
                  type="button"
                  variant="outline"
                  disabled={isBusy}
                  onClick={() => closeMutation.mutate()}
                  className="border-border text-foreground"
                  data-ocid="ptw.close_permit_button"
                >
                  {closeMutation.isPending && (
                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  )}
                  <ClipboardCheck className="w-4 h-4 mr-1" />
                  Close Permit
                </Button>
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

// --- PTW Dashboard Stats -----------------------------------------------

type PTWStats = {
  byType: [string, bigint][];
  avgCycleTimeDays: number;
  cancelledThisMonth: bigint;
};

function PTWDashboardStats({
  token,
  actor,
}: {
  token: string | null;
  actor: {
    getPtwDashboardStats: (
      t: string,
    ) => Promise<
      { __kind__: "ok"; ok: PTWStats } | { __kind__: "err"; err: string }
    >;
  } | null;
}) {
  const { data: stats, isLoading } = useQuery<PTWStats | null>({
    queryKey: ["ptwDashStats"],
    queryFn: async () => {
      if (!actor || !token) return null;
      const res = await actor.getPtwDashboardStats(token);
      if (res.__kind__ === "err") return null;
      return res.ok;
    },
    enabled: !!actor && !!token,
  });

  const chartData = useMemo(() => {
    if (!stats?.byType) return [];
    return stats.byType.map(([type, count]) => ({
      type: PERMIT_TYPE_LABELS[type as PermitType] ?? type,
      count: Number(count),
    }));
  }, [stats]);

  if (isLoading) {
    return (
      <div
        className="grid grid-cols-1 sm:grid-cols-3 gap-4"
        data-ocid="ptw.dashboard_stats.loading_state"
      >
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-20 bg-muted/30 rounded-xl" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4" data-ocid="ptw.dashboard_stats">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="elevated-card rounded-xl p-4 space-y-1">
          <p className="text-xs text-muted-foreground flex items-center gap-1">
            <BarChart3 className="w-3.5 h-3.5" />
            Avg Cycle Time
          </p>
          <p className="text-2xl font-bold text-foreground">
            {stats ? stats.avgCycleTimeDays.toFixed(1) : "—"}
          </p>
          <p className="text-xs text-muted-foreground">days (raise to close)</p>
        </div>
        <div className="elevated-card rounded-xl p-4 space-y-1">
          <p className="text-xs text-muted-foreground flex items-center gap-1">
            <XCircle className="w-3.5 h-3.5 text-destructive" />
            Cancelled This Month
          </p>
          <p className="text-2xl font-bold text-destructive">
            {stats ? String(stats.cancelledThisMonth) : "—"}
          </p>
          <p className="text-xs text-muted-foreground">permits cancelled</p>
        </div>
        <div className="elevated-card rounded-xl p-4 space-y-1">
          <p className="text-xs text-muted-foreground flex items-center gap-1">
            <FileText className="w-3.5 h-3.5 text-primary" />
            Total Permits
          </p>
          <p className="text-2xl font-bold text-foreground">
            {stats ? stats.byType.reduce((s, [, c]) => s + Number(c), 0) : "—"}
          </p>
          <p className="text-xs text-muted-foreground">across all types</p>
        </div>
      </div>

      {/* Permits by Type Bar Chart */}
      {chartData.length > 0 && (
        <div
          className="elevated-card rounded-xl p-4"
          data-ocid="ptw.dashboard_stats.by_type_chart"
        >
          <p className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-primary" />
            Permits by Type
          </p>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart
              data={chartData}
              margin={{ top: 4, right: 8, left: -20, bottom: 0 }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="hsl(var(--border))"
              />
              <XAxis
                dataKey="type"
                tick={{
                  fill: "hsl(var(--muted-foreground))",
                  fontSize: 10,
                }}
                tickLine={false}
              />
              <YAxis
                tick={{
                  fill: "hsl(var(--muted-foreground))",
                  fontSize: 10,
                }}
                tickLine={false}
                axisLine={false}
                allowDecimals={false}
              />
              <Tooltip
                contentStyle={{
                  background: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: 8,
                  color: "hsl(var(--foreground))",
                  fontSize: 12,
                }}
              />
              <Bar
                dataKey="count"
                fill="hsl(var(--primary))"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}

// --- Main Page ----------------------------------------------------------

export default function PTWPage() {
  const { actor, token, isReady } = useBackend();
  const { user } = useAuth();
  const userRole = user?.role ?? "Employee";

  const [filterStatus, setFilterStatus] = useState<PTWStatus | "ALL">("ALL");
  const [filterType, setFilterType] = useState<PermitType | "ALL">("ALL");
  const [filterDateFrom, setFilterDateFrom] = useState("");
  const [filterDateTo, setFilterDateTo] = useState("");
  const [showCreate, setShowCreate] = useState(false);
  const [selectedPTW, setSelectedPTW] = useState<PTWView | null>(null);

  const { data: ptws, isLoading } = useQuery<PTWView[]>({
    queryKey: ["ptws"],
    queryFn: async () => {
      if (!actor || !token) return [];
      const res = await actor.listPTWs(token, null, null);
      if (res.__kind__ === "err") throw new Error(res.err);
      return res.ok;
    },
    enabled: isReady,
  });

  const filtered = useMemo(() => {
    if (!ptws) return [];
    return ptws.filter((p) => {
      if (filterStatus !== "ALL" && p.status !== filterStatus) return false;
      if (filterType !== "ALL" && p.permitType !== filterType) return false;
      if (filterDateFrom && p.startDateTime < filterDateFrom) return false;
      if (filterDateTo && p.startDateTime > filterDateTo) return false;
      return true;
    });
  }, [ptws, filterStatus, filterType, filterDateFrom, filterDateTo]);

  const canCreate =
    userRole === "Employee" ||
    userRole === "ContractorAdmin" ||
    userRole === "SafetyOfficer" ||
    userRole === "SystemAdmin";

  const pendingCount = useMemo(() => {
    if (!ptws) return 0;
    if (userRole === "HOD")
      return ptws.filter((p) => p.status === "PendingHOD").length;
    if (userRole === "AreaInCharge")
      return ptws.filter((p) => p.status === "PendingAreaInCharge").length;
    if (userRole === "SafetyOfficer")
      return ptws.filter((p) => p.status === "PendingSafetyOfficer").length;
    return 0;
  }, [ptws, userRole]);

  const hasFilters =
    filterStatus !== "ALL" ||
    filterType !== "ALL" ||
    !!filterDateFrom ||
    !!filterDateTo;

  // Cast actor to typed version for dashboard stats
  const typedActorForStats = actor as {
    getPtwDashboardStats: (
      t: string,
    ) => Promise<
      { __kind__: "ok"; ok: PTWStats } | { __kind__: "err"; err: string }
    >;
  } | null;

  return (
    <div className="space-y-6" data-ocid="ptw.page">
      {/* Page header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="section-header flex items-center gap-2 mb-0">
            <FileText className="w-6 h-6 text-primary" />
            Work Permit (PTW)
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Manage permit-to-work requests and approvals
          </p>
        </div>
        <div className="flex items-center gap-3">
          {pendingCount > 0 && (
            <div
              className="flex items-center gap-2 rounded-lg border border-secondary/40 bg-secondary/10 px-3 py-2"
              data-ocid="ptw.pending_action_badge"
            >
              <Clock className="w-4 h-4 text-secondary" />
              <span className="text-sm font-semibold text-secondary">
                {pendingCount} awaiting your action
              </span>
            </div>
          )}
          {canCreate && (
            <Button
              type="button"
              onClick={() => setShowCreate(true)}
              className="safety-gradient-primary text-primary-foreground gap-2"
              data-ocid="ptw.create.open_modal_button"
            >
              <Plus className="w-4 h-4" />
              New Permit
            </Button>
          )}
        </div>
      </div>

      {/* Phase 2 Dashboard Stats */}
      <PTWDashboardStats token={token} actor={typedActorForStats} />

      {/* Filters */}
      <div
        className="elevated-card rounded-xl p-4 flex flex-wrap gap-3 items-end"
        data-ocid="ptw.filters_panel"
      >
        <Filter className="w-4 h-4 text-muted-foreground self-center" />

        <div className="space-y-1 min-w-[180px]">
          <Label className="text-xs text-muted-foreground">Status</Label>
          <Select
            value={filterStatus}
            onValueChange={(v) => setFilterStatus(v as PTWStatus | "ALL")}
          >
            <SelectTrigger
              className="h-8 text-sm bg-background border-input"
              data-ocid="ptw.filter.status.select"
            >
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-card border-border">
              <SelectItem value="ALL">All Statuses</SelectItem>
              {Object.values(PTWStatus).map((s) => (
                <SelectItem key={s} value={s}>
                  {STATUS_LABELS[s]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-1 min-w-[180px]">
          <Label className="text-xs text-muted-foreground">Type</Label>
          <Select
            value={filterType}
            onValueChange={(v) => setFilterType(v as PermitType | "ALL")}
          >
            <SelectTrigger
              className="h-8 text-sm bg-background border-input"
              data-ocid="ptw.filter.type.select"
            >
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-card border-border">
              <SelectItem value="ALL">All Types</SelectItem>
              {Object.values(PermitType).map((t) => (
                <SelectItem key={t} value={t}>
                  {PERMIT_TYPE_LABELS[t]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-1">
          <Label className="text-xs text-muted-foreground">From</Label>
          <Input
            type="date"
            value={filterDateFrom}
            onChange={(e) => setFilterDateFrom(e.target.value)}
            className="h-8 text-sm bg-background border-input"
            data-ocid="ptw.filter.date_from.input"
          />
        </div>

        <div className="space-y-1">
          <Label className="text-xs text-muted-foreground">To</Label>
          <Input
            type="date"
            value={filterDateTo}
            onChange={(e) => setFilterDateTo(e.target.value)}
            className="h-8 text-sm bg-background border-input"
            data-ocid="ptw.filter.date_to.input"
          />
        </div>

        {hasFilters && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => {
              setFilterStatus("ALL");
              setFilterType("ALL");
              setFilterDateFrom("");
              setFilterDateTo("");
            }}
            className="text-muted-foreground hover:text-foreground gap-1"
            data-ocid="ptw.filter.clear_button"
          >
            <X className="w-3.5 h-3.5" />
            Clear
          </Button>
        )}
      </div>

      {/* Table */}
      <div
        className="elevated-card rounded-xl overflow-hidden"
        data-ocid="ptw.list"
      >
        {isLoading ? (
          <div className="p-6 space-y-3" data-ocid="ptw.loading_state">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-12 w-full bg-muted/30" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div
            className="flex flex-col items-center justify-center py-16 gap-3"
            data-ocid="ptw.empty_state"
          >
            <div className="w-12 h-12 rounded-full bg-muted/30 flex items-center justify-center">
              <FileText className="w-6 h-6 text-muted-foreground" />
            </div>
            <p className="text-sm font-medium text-foreground">
              {ptws?.length === 0
                ? "No permits yet"
                : "No permits match your filters"}
            </p>
            <p className="text-xs text-muted-foreground">
              {ptws?.length === 0
                ? "Create a new work permit to get started."
                : "Try adjusting the status or type filters."}
            </p>
            {canCreate && ptws?.length === 0 && (
              <Button
                type="button"
                size="sm"
                onClick={() => setShowCreate(true)}
                className="safety-gradient-primary text-primary-foreground mt-2"
                data-ocid="ptw.empty_state.create_button"
              >
                <Plus className="w-4 h-4 mr-1" />
                New Permit
              </Button>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/20">
                  {[
                    "Permit #",
                    "Type",
                    "Location",
                    "Status",
                    "Start Date",
                    "Requested By",
                    "",
                  ].map((h, i) => (
                    <th
                      key={h || i}
                      className={`text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide ${
                        i === 2
                          ? "hidden md:table-cell"
                          : i >= 4
                            ? "hidden lg:table-cell"
                            : ""
                      }`}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((p, idx) => (
                  <tr
                    key={p.permitNumber}
                    className="border-b border-border/50 hover:bg-muted/10 transition-colors cursor-pointer"
                    onClick={() => setSelectedPTW(p)}
                    onKeyDown={(e) => e.key === "Enter" && setSelectedPTW(p)}
                    tabIndex={0}
                    data-ocid={`ptw.item.${idx + 1}`}
                  >
                    <td className="px-4 py-3">
                      <span className="font-mono text-xs font-semibold text-primary">
                        {p.permitNumber}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="flex items-center gap-1.5 text-foreground">
                        {permitTypeIcon(p.permitType)}
                        <span className="hidden sm:inline">
                          {PERMIT_TYPE_LABELS[p.permitType]}
                        </span>
                      </span>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground hidden md:table-cell max-w-[180px]">
                      <span className="truncate block">{p.location}</span>
                    </td>
                    <td className="px-4 py-3">
                      <StatusBadge status={p.status} />
                    </td>
                    <td className="px-4 py-3 text-muted-foreground hidden lg:table-cell">
                      {p.startDateTime.replace("T", " ").slice(0, 16)}
                    </td>
                    <td className="px-4 py-3 text-muted-foreground hidden lg:table-cell">
                      {p.requestedByName}
                    </td>
                    <td className="px-4 py-3">
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="w-8 h-8 text-muted-foreground hover:text-foreground"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedPTW(p);
                        }}
                        aria-label="View permit details"
                        data-ocid={`ptw.view_button.${idx + 1}`}
                      >
                        <ChevronRight className="w-4 h-4" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {showCreate && (
        <CreatePTWDialog
          open={showCreate}
          onClose={() => setShowCreate(false)}
        />
      )}
      {selectedPTW && (
        <PTWDetailDialog
          ptw={selectedPTW}
          onClose={() => setSelectedPTW(null)}
          userRole={userRole}
        />
      )}
    </div>
  );
}
