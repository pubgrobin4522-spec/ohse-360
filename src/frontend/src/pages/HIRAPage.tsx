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
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  AlertTriangle,
  CheckCircle2,
  ChevronRight,
  Clock,
  FileSearch,
  Filter,
  Loader2,
  Plus,
  ShieldAlert,
  TrendingUp,
  X,
  XCircle,
} from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import {
  type CreateHIRAInput,
  HIRAStatus,
  type HIRAView,
  HazardType,
  RiskLevel,
} from "../backend";
import { useAuth } from "../hooks/useAuth";
import { useBackend } from "../hooks/useBackend";

// ─── Helpers ─────────────────────────────────────────────────────────────────

type RiskLevelKey = "Low" | "Medium" | "High" | "Critical";

function calcRiskScore(likelihood: number, severity: number): number {
  return likelihood * severity;
}

function scoreToLevel(score: number): RiskLevelKey {
  if (score <= 4) return "Low";
  if (score <= 9) return "Medium";
  if (score <= 16) return "High";
  return "Critical";
}

const RISK_COLORS: Record<RiskLevelKey, string> = {
  Low: "bg-primary/20 text-primary border-primary/40",
  Medium: "bg-secondary/20 text-secondary border-secondary/40",
  High: "bg-orange-500/20 text-orange-400 border-orange-500/40",
  Critical: "bg-destructive/20 text-destructive border-destructive/40",
};

const MATRIX_CELL_COLOR = (score: number): string => {
  if (score <= 4) return "bg-primary/30 border-primary/40";
  if (score <= 9) return "bg-secondary/30 border-secondary/40";
  if (score <= 16) return "bg-orange-500/30 border-orange-500/40";
  return "bg-destructive/30 border-destructive/40";
};

const HAZARD_TYPE_LABELS: Record<HazardType, string> = {
  Physical: "Physical",
  Chemical: "Chemical",
  Biological: "Biological",
  Ergonomic: "Ergonomic",
  Psychological: "Psychological",
  Environmental: "Environmental",
};

const STATUS_LABELS: Record<HIRAStatus, string> = {
  Draft: "Draft",
  UnderReview: "Under Review",
  Approved: "Approved",
  Expired: "Expired",
};

function topRiskLevel(hira: HIRAView): RiskLevelKey {
  if (!hira.hazards.length) return "Low";
  const maxScore = Math.max(...hira.hazards.map((h) => Number(h.riskScore)));
  return scoreToLevel(maxScore);
}

function isOverdueReview(hira: HIRAView): boolean {
  if (hira.status !== "Approved") return false;
  return new Date(hira.reviewDate) < new Date();
}

// ─── Risk Level Badge ─────────────────────────────────────────────────────────

function RiskBadge({ level }: { level: RiskLevelKey }) {
  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold border ${RISK_COLORS[level]}`}
    >
      {level}
    </span>
  );
}

// ─── Status Badge ─────────────────────────────────────────────────────────────

function StatusBadge({ status }: { status: HIRAStatus }) {
  const variants: Record<HIRAStatus, string> = {
    Draft: "bg-muted/50 text-muted-foreground border-border",
    UnderReview: "bg-secondary/20 text-secondary border-secondary/40",
    Approved: "bg-primary/20 text-primary border-primary/40",
    Expired: "bg-destructive/20 text-destructive border-destructive/40",
  };
  return (
    <span
      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold border ${
        variants[status]
      }`}
    >
      {status === "Approved" && (
        <span className="w-1.5 h-1.5 rounded-full bg-primary" />
      )}
      {STATUS_LABELS[status]}
    </span>
  );
}

// ─── Risk Matrix ─────────────────────────────────────────────────────────────

function RiskMatrix({ plotted }: { plotted: Array<[number, number]> }) {
  const plottedSet = new Set(plotted.map(([l, s]) => `${l}-${s}`));
  return (
    <div>
      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">
        5×5 Risk Matrix
      </p>
      <div className="overflow-x-auto">
        <table className="border-collapse text-xs">
          <thead>
            <tr>
              <th className="w-12 text-muted-foreground text-right pr-1 pb-1 font-normal" />
              {[1, 2, 3, 4, 5].map((s) => (
                <th
                  key={s}
                  className="w-10 h-6 text-center text-muted-foreground font-semibold pb-1"
                >
                  S{s}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {[5, 4, 3, 2, 1].map((l) => (
              <tr key={l}>
                <td className="pr-1 text-right text-muted-foreground font-semibold">
                  L{l}
                </td>
                {[1, 2, 3, 4, 5].map((s) => {
                  const score = l * s;
                  const hasPlot = plottedSet.has(`${l}-${s}`);
                  return (
                    <td
                      key={s}
                      className={`w-10 h-9 text-center border ${MATRIX_CELL_COLOR(score)} text-foreground font-mono relative`}
                    >
                      <span className="text-[10px] opacity-70">{score}</span>
                      {hasPlot && (
                        <span className="absolute inset-0 flex items-center justify-center">
                          <span className="w-3 h-3 rounded-full bg-foreground/80 ring-1 ring-foreground" />
                        </span>
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
        <div className="flex flex-wrap gap-3 mt-3">
          {(
            [
              ["Low (1-4)", "bg-primary/30 border-primary/40"],
              ["Medium (5-9)", "bg-secondary/30 border-secondary/40"],
              ["High (10-16)", "bg-orange-500/30 border-orange-500/40"],
              ["Critical (17-25)", "bg-destructive/30 border-destructive/40"],
            ] as [string, string][]
          ).map(([label, cls]) => (
            <div key={label} className="flex items-center gap-1.5">
              <span className={`w-3 h-3 rounded border ${cls}`} />
              <span className="text-xs text-muted-foreground">{label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Approval Stepper ────────────────────────────────────────────────────────

function HIRAApprovalStepper({ hira }: { hira: HIRAView }) {
  const step = Number(hira.approvalStep);
  const steps = [
    {
      label: "HOD Review",
      role: "Head of Department",
      done: step > 1 || (hira.status === "Approved" && step >= 1),
      active: hira.status === "UnderReview" && step === 1,
      at: hira.hodAt,
      remarks: hira.hodRemarks,
    },
    {
      label: "Area In Charge Validation",
      role: "Area In Charge",
      done: step > 2 || (hira.status === "Approved" && step >= 2),
      active: hira.status === "UnderReview" && step === 2,
      at: hira.aicAt,
      remarks: hira.aicRemarks,
    },
    {
      label: "Safety Officer Approval",
      role: "Safety Officer",
      done: hira.status === "Approved",
      active: hira.status === "UnderReview" && step === 3,
      at: hira.soAt,
      remarks: hira.soRemarks,
    },
  ];

  return (
    <div className="space-y-0">
      {steps.map((s, i) => (
        <div key={s.label} className="flex gap-3">
          <div className="flex flex-col items-center">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 border-2 ${
                s.done
                  ? "bg-primary/20 border-primary"
                  : s.active
                    ? "bg-secondary/20 border-secondary animate-pulse"
                    : "bg-muted/30 border-border"
              }`}
            >
              {s.done ? (
                <CheckCircle2 className="w-4 h-4 text-primary" />
              ) : s.active ? (
                <Clock className="w-4 h-4 text-secondary" />
              ) : (
                <span className="text-xs font-bold text-muted-foreground">
                  {i + 1}
                </span>
              )}
            </div>
            {i < 2 && (
              <div
                className={`w-0.5 h-8 mt-0.5 ${s.done ? "bg-primary/40" : "bg-border"}`}
              />
            )}
          </div>
          <div className="pb-6 min-w-0 flex-1">
            <p
              className={`text-sm font-semibold ${
                s.done
                  ? "text-primary"
                  : s.active
                    ? "text-secondary"
                    : "text-muted-foreground"
              }`}
            >
              {s.label}
            </p>
            <p className="text-xs text-muted-foreground">{s.role}</p>
            {(s.at ?? s.remarks) && (
              <div className="mt-1.5 rounded-lg bg-muted/20 border border-border p-2.5 space-y-1">
                {s.at && (
                  <p className="text-xs text-muted-foreground">
                    {new Date(Number(s.at / 1_000_000n)).toLocaleString()}
                  </p>
                )}
                {s.remarks && (
                  <p className="text-xs text-foreground/80 italic">
                    &ldquo;{s.remarks}&rdquo;
                  </p>
                )}
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

// ─── Add Hazard Row Dialog ────────────────────────────────────────────────────

interface AddHazardDialogProps {
  hiraNumber: string;
  onClose: () => void;
}

function AddHazardDialog({ hiraNumber, onClose }: AddHazardDialogProps) {
  const { actor, token } = useBackend();
  const qc = useQueryClient();

  const [hazardDesc, setHazardDesc] = useState("");
  const [hazardType, setHazardType] = useState<HazardType>(HazardType.Physical);
  const [likelihood, setLikelihood] = useState(1);
  const [severity, setSeverity] = useState(1);
  const [existingControls, setExistingControls] = useState("");
  const [additionalControls, setAdditionalControls] = useState("");
  const [residualLikelihood, setResidualLikelihood] = useState(1);
  const [residualSeverity, setResidualSeverity] = useState(1);
  const [errors, setErrors] = useState<Record<string, string>>({});

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
        null,
      );
      if (res.__kind__ === "err") throw new Error(res.err);
    },
    onSuccess: () => {
      toast.success("Hazard row added.");
      qc.invalidateQueries({ queryKey: ["hiras"] });
      qc.invalidateQueries({ queryKey: ["hira", hiraNumber] });
      onClose();
    },
    onError: (e: Error) => toast.error(e.message),
  });

  function validate(): boolean {
    const e: Record<string, string> = {};
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

  return (
    <Dialog open onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="max-w-xl max-h-[90vh] overflow-y-auto bg-card border-border">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-foreground">
            <ShieldAlert className="w-5 h-5 text-secondary" />
            Add Hazard Row
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 pt-1">
          <div className="space-y-1.5">
            <Label className="text-foreground">Hazard Description *</Label>
            <Textarea
              value={hazardDesc}
              onChange={(e) => setHazardDesc(e.target.value)}
              placeholder="Describe the hazard..."
              rows={2}
              className="bg-background border-input resize-none"
              data-ocid="hira.hazard.description.textarea"
            />
            {errors.hazardDesc && (
              <p
                className="text-xs text-destructive"
                data-ocid="hira.hazard.description.field_error"
              >
                {errors.hazardDesc}
              </p>
            )}
          </div>

          <div className="space-y-1.5">
            <Label className="text-foreground">Hazard Type *</Label>
            <Select
              value={hazardType}
              onValueChange={(v) => setHazardType(v as HazardType)}
            >
              <SelectTrigger
                className="bg-background border-input"
                data-ocid="hira.hazard.type.select"
              >
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-card border-border">
                {Object.values(HazardType).map((t) => (
                  <SelectItem key={t} value={t}>
                    {HAZARD_TYPE_LABELS[t]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label className="text-foreground">Likelihood (1–5) *</Label>
              <Input
                type="number"
                min={1}
                max={5}
                value={likelihood}
                onChange={(e) =>
                  setLikelihood(
                    Math.min(5, Math.max(1, Number(e.target.value))),
                  )
                }
                className="bg-background border-input"
                data-ocid="hira.hazard.likelihood.input"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-foreground">Severity (1–5) *</Label>
              <Input
                type="number"
                min={1}
                max={5}
                value={severity}
                onChange={(e) =>
                  setSeverity(Math.min(5, Math.max(1, Number(e.target.value))))
                }
                className="bg-background border-input"
                data-ocid="hira.hazard.severity.input"
              />
            </div>
          </div>

          <div className="flex items-center gap-3 rounded-lg border border-border bg-muted/10 p-3">
            <div className="flex-1">
              <p className="text-xs text-muted-foreground">Risk Score</p>
              <p className="text-2xl font-bold text-foreground">{riskScore}</p>
            </div>
            <RiskBadge level={riskLevel} />
          </div>

          <div className="space-y-1.5">
            <Label className="text-foreground">Existing Controls *</Label>
            <Textarea
              value={existingControls}
              onChange={(e) => setExistingControls(e.target.value)}
              placeholder="Current controls already in place..."
              rows={2}
              className="bg-background border-input resize-none"
              data-ocid="hira.hazard.existing_controls.textarea"
            />
            {errors.existingControls && (
              <p
                className="text-xs text-destructive"
                data-ocid="hira.hazard.existing_controls.field_error"
              >
                {errors.existingControls}
              </p>
            )}
          </div>

          <div className="space-y-1.5">
            <Label className="text-foreground">
              Additional Control Measures
            </Label>
            <Textarea
              value={additionalControls}
              onChange={(e) => setAdditionalControls(e.target.value)}
              placeholder="Additional measures to reduce risk..."
              rows={2}
              className="bg-background border-input resize-none"
              data-ocid="hira.hazard.additional_controls.textarea"
            />
          </div>

          <div className="rounded-lg border border-border bg-muted/10 p-3">
            <p className="text-xs font-semibold text-muted-foreground mb-2">
              Residual Risk (after controls)
            </p>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label className="text-xs text-muted-foreground">
                  Residual Likelihood
                </Label>
                <Input
                  type="number"
                  min={1}
                  max={5}
                  value={residualLikelihood}
                  onChange={(e) =>
                    setResidualLikelihood(
                      Math.min(5, Math.max(1, Number(e.target.value))),
                    )
                  }
                  className="bg-background border-input h-8 text-sm"
                  data-ocid="hira.hazard.residual_likelihood.input"
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs text-muted-foreground">
                  Residual Severity
                </Label>
                <Input
                  type="number"
                  min={1}
                  max={5}
                  value={residualSeverity}
                  onChange={(e) =>
                    setResidualSeverity(
                      Math.min(5, Math.max(1, Number(e.target.value))),
                    )
                  }
                  className="bg-background border-input h-8 text-sm"
                  data-ocid="hira.hazard.residual_severity.input"
                />
              </div>
            </div>
            <div className="flex items-center gap-2 mt-2">
              <span className="text-xs text-muted-foreground">
                Residual Score:
              </span>
              <span className="text-sm font-bold text-foreground">
                {residualScore}
              </span>
              <RiskBadge level={scoreToLevel(residualScore)} />
            </div>
          </div>

          <Separator className="bg-border" />

          <div className="flex justify-end gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="border-border"
              data-ocid="hira.hazard.cancel_button"
            >
              Cancel
            </Button>
            <Button
              type="button"
              disabled={mutation.isPending}
              onClick={handleSubmit}
              className="safety-gradient-primary text-primary-foreground"
              data-ocid="hira.hazard.submit_button"
            >
              {mutation.isPending && (
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
              )}
              Add Hazard
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// ─── Create HIRA Dialog ───────────────────────────────────────────────────────

function CreateHIRADialog({
  open,
  onClose,
}: { open: boolean; onClose: () => void }) {
  const { actor, token, isReady } = useBackend();
  const qc = useQueryClient();

  const defaultReviewDate = useMemo(() => {
    const d = new Date();
    d.setFullYear(d.getFullYear() + 1);
    return d.toISOString().slice(0, 10);
  }, []);

  const [taskDescription, setTaskDescription] = useState("");
  const [location, setLocation] = useState("");
  const [area, setArea] = useState("");
  const [department, setDepartment] = useState("");
  const [reviewDate, setReviewDate] = useState(defaultReviewDate);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const mutation = useMutation({
    mutationFn: async (input: CreateHIRAInput) => {
      if (!actor || !token) throw new Error("Not authenticated");
      const res = await actor.createHIRA(token, input);
      if (res.__kind__ === "err") throw new Error(res.err);
      return res.ok;
    },
    onSuccess: (hiraNumber) => {
      toast.success(`HIRA ${hiraNumber} created.`);
      qc.invalidateQueries({ queryKey: ["hiras"] });
      handleClose();
    },
    onError: (e: Error) => toast.error(e.message),
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

  function validate(): boolean {
    const e: Record<string, string> = {};
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
      responsibleEmpId: undefined,
    });
  }

  return (
    <Dialog open={open} onOpenChange={(v) => !v && handleClose()}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto bg-card border-border">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-foreground">
            <FileSearch className="w-5 h-5 text-primary" />
            New HIRA Record
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 pt-1">
          <div className="space-y-1.5">
            <Label className="text-foreground">
              Task / Activity Description *
            </Label>
            <Textarea
              value={taskDescription}
              onChange={(e) => setTaskDescription(e.target.value)}
              placeholder="Describe the task or activity being assessed..."
              rows={3}
              className="bg-background border-input resize-none"
              data-ocid="hira.create.task_description.textarea"
            />
            {errors.taskDescription && (
              <p
                className="text-xs text-destructive"
                data-ocid="hira.create.task_description.field_error"
              >
                {errors.taskDescription}
              </p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label className="text-foreground">Location *</Label>
              <Input
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="e.g. Building A"
                className="bg-background border-input"
                data-ocid="hira.create.location.input"
              />
              {errors.location && (
                <p
                  className="text-xs text-destructive"
                  data-ocid="hira.create.location.field_error"
                >
                  {errors.location}
                </p>
              )}
            </div>
            <div className="space-y-1.5">
              <Label className="text-foreground">Area *</Label>
              <Input
                value={area}
                onChange={(e) => setArea(e.target.value)}
                placeholder="e.g. Workshop Zone 3"
                className="bg-background border-input"
                data-ocid="hira.create.area.input"
              />
              {errors.area && (
                <p
                  className="text-xs text-destructive"
                  data-ocid="hira.create.area.field_error"
                >
                  {errors.area}
                </p>
              )}
            </div>
          </div>

          <div className="space-y-1.5">
            <Label className="text-foreground">Department *</Label>
            <Input
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
              placeholder="e.g. Maintenance"
              className="bg-background border-input"
              data-ocid="hira.create.department.input"
            />
            {errors.department && (
              <p
                className="text-xs text-destructive"
                data-ocid="hira.create.department.field_error"
              >
                {errors.department}
              </p>
            )}
          </div>

          <div className="space-y-1.5">
            <Label className="text-foreground">Review Date *</Label>
            <Input
              type="date"
              value={reviewDate}
              onChange={(e) => setReviewDate(e.target.value)}
              className="bg-background border-input"
              data-ocid="hira.create.review_date.input"
            />
            {errors.reviewDate && (
              <p
                className="text-xs text-destructive"
                data-ocid="hira.create.review_date.field_error"
              >
                {errors.reviewDate}
              </p>
            )}
          </div>

          <Separator className="bg-border" />

          <div className="flex justify-end gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              className="border-border"
              data-ocid="hira.create.cancel_button"
            >
              Cancel
            </Button>
            <Button
              type="button"
              disabled={!isReady || mutation.isPending}
              onClick={handleCreate}
              className="safety-gradient-primary text-primary-foreground"
              data-ocid="hira.create.submit_button"
            >
              {mutation.isPending && (
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
              )}
              Create HIRA
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// ─── HIRA Detail Dialog ───────────────────────────────────────────────────────

function HIRADetailDialog({
  hiraNumber,
  userRole,
  userEmpId,
  onClose,
}: {
  hiraNumber: string;
  userRole: string;
  userEmpId: bigint;
  onClose: () => void;
}) {
  const { actor, token } = useBackend();
  const qc = useQueryClient();
  const [remarks, setRemarks] = useState("");
  const [remarkErr, setRemarkErr] = useState("");
  const [showAddHazard, setShowAddHazard] = useState(false);

  const { data: hira, isLoading } = useQuery<HIRAView>({
    queryKey: ["hira", hiraNumber],
    queryFn: async () => {
      if (!actor || !token) throw new Error("Not authenticated");
      const res = await actor.getHIRA(token, hiraNumber);
      if (res.__kind__ === "err") throw new Error(res.err);
      return res.ok;
    },
    enabled: !!actor && !!token,
  });

  const step = hira ? Number(hira.approvalStep) : 0;

  const canAct =
    hira?.status === "UnderReview" &&
    ((userRole === "HOD" && step === 1) ||
      (userRole === "AreaInCharge" && step === 2) ||
      (userRole === "SafetyOfficer" && step === 3) ||
      userRole === "SystemAdmin");

  const canSubmit =
    hira?.status === "Draft" &&
    (hira.createdBy === userEmpId ||
      userRole === "SafetyOfficer" ||
      userRole === "HOD" ||
      userRole === "SystemAdmin");

  const canAddHazard = hira?.status === "Draft";

  const submitMutation = useMutation({
    mutationFn: async () => {
      if (!actor || !token) throw new Error("Not authenticated");
      const res = await actor.submitHIRAForApproval(token, hiraNumber);
      if (res.__kind__ === "err") throw new Error(res.err);
    },
    onSuccess: () => {
      toast.success(`${hiraNumber} submitted for approval.`);
      qc.invalidateQueries({ queryKey: ["hiras"] });
      qc.invalidateQueries({ queryKey: ["hira", hiraNumber] });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const actionMutation = useMutation({
    mutationFn: async ({ approve, rem }: { approve: boolean; rem: string }) => {
      if (!actor || !token) throw new Error("Not authenticated");
      const res = await actor.actOnHIRA(token, hiraNumber, approve, rem);
      if (res.__kind__ === "err") throw new Error(res.err);
    },
    onSuccess: (_data, vars) => {
      toast.success(
        vars.approve ? `${hiraNumber} approved.` : `${hiraNumber} rejected.`,
      );
      qc.invalidateQueries({ queryKey: ["hiras"] });
      qc.invalidateQueries({ queryKey: ["hira", hiraNumber] });
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

  const plottedCoords: Array<[number, number]> = hira
    ? hira.hazards.map((h) => [Number(h.likelihood), Number(h.severity)])
    : [];

  const isBusy = submitMutation.isPending || actionMutation.isPending;

  return (
    <>
      <Dialog open onOpenChange={(v) => !v && onClose()}>
        <DialogContent className="max-w-3xl max-h-[92vh] overflow-y-auto bg-card border-border">
          <DialogHeader>
            <DialogTitle className="flex items-center justify-between gap-2">
              <span className="flex items-center gap-2 text-foreground">
                <FileSearch className="w-5 h-5 text-primary" />
                {hiraNumber}
              </span>
              {hira && <StatusBadge status={hira.status} />}
            </DialogTitle>
          </DialogHeader>

          {isLoading || !hira ? (
            <div
              className="space-y-3 py-4"
              data-ocid="hira.detail.loading_state"
            >
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="h-10 w-full bg-muted/30" />
              ))}
            </div>
          ) : (
            <div className="space-y-6">
              {/* Header Info Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {(
                  [
                    ["Task Description", hira.taskDescription],
                    ["Location", hira.location],
                    ["Area", hira.area],
                    ["Department", hira.department],
                    ["Review Date", hira.reviewDate],
                    [
                      "Created",
                      new Date(
                        Number(hira.createdAt / 1_000_000n),
                      ).toLocaleDateString(),
                    ],
                  ] as [string, string][]
                ).map(([label, value]) => (
                  <div
                    key={label}
                    className="rounded-lg border border-border bg-muted/10 p-2.5"
                  >
                    <p className="text-xs text-muted-foreground mb-0.5">
                      {label}
                    </p>
                    <p className="text-sm font-medium text-foreground break-words">
                      {value}
                    </p>
                  </div>
                ))}
              </div>

              {/* Hazard Rows Table */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <p className="text-sm font-semibold text-foreground flex items-center gap-2">
                    <ShieldAlert className="w-4 h-4 text-secondary" />
                    Hazard Rows ({hira.hazards.length})
                  </p>
                  {canAddHazard && (
                    <Button
                      type="button"
                      size="sm"
                      onClick={() => setShowAddHazard(true)}
                      className="safety-gradient-primary text-primary-foreground gap-1 text-xs h-7"
                      data-ocid="hira.add_hazard_button"
                    >
                      <Plus className="w-3 h-3" />
                      Add Hazard
                    </Button>
                  )}
                </div>

                {hira.hazards.length === 0 ? (
                  <div
                    className="flex flex-col items-center justify-center py-8 border border-dashed border-border rounded-xl"
                    data-ocid="hira.hazards.empty_state"
                  >
                    <ShieldAlert className="w-8 h-8 text-muted-foreground mb-2" />
                    <p className="text-sm text-muted-foreground">
                      No hazard rows yet
                    </p>
                    {canAddHazard && (
                      <Button
                        type="button"
                        size="sm"
                        variant="outline"
                        onClick={() => setShowAddHazard(true)}
                        className="mt-3 border-border gap-1"
                        data-ocid="hira.hazards.empty_state.add_button"
                      >
                        <Plus className="w-3 h-3" />
                        Add First Hazard
                      </Button>
                    )}
                  </div>
                ) : (
                  <div className="overflow-x-auto rounded-xl border border-border">
                    <table className="w-full text-xs">
                      <thead>
                        <tr className="border-b border-border bg-muted/20">
                          {[
                            "#",
                            "Hazard",
                            "Type",
                            "L",
                            "S",
                            "Score",
                            "Level",
                            "Existing Controls",
                            "Additional Controls",
                            "Residual",
                          ].map((h) => (
                            <th
                              key={h}
                              className="px-2 py-2 text-left font-semibold text-muted-foreground uppercase tracking-wide whitespace-nowrap"
                            >
                              {h}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {hira.hazards.map((row, idx) => (
                          <tr
                            key={row.hazardId}
                            className="border-b border-border/50 hover:bg-muted/10"
                            data-ocid={`hira.hazard.item.${idx + 1}`}
                          >
                            <td className="px-2 py-2 text-muted-foreground">
                              {idx + 1}
                            </td>
                            <td className="px-2 py-2 text-foreground max-w-[140px]">
                              <span
                                className="block truncate"
                                title={row.hazardDescription}
                              >
                                {row.hazardDescription}
                              </span>
                            </td>
                            <td className="px-2 py-2 text-muted-foreground whitespace-nowrap">
                              {row.hazardType}
                            </td>
                            <td className="px-2 py-2 text-foreground text-center font-mono">
                              {String(row.likelihood)}
                            </td>
                            <td className="px-2 py-2 text-foreground text-center font-mono">
                              {String(row.severity)}
                            </td>
                            <td className="px-2 py-2 text-foreground text-center font-bold font-mono">
                              {String(row.riskScore)}
                            </td>
                            <td className="px-2 py-2">
                              <RiskBadge
                                level={row.riskLevel as RiskLevelKey}
                              />
                            </td>
                            <td className="px-2 py-2 text-muted-foreground max-w-[120px]">
                              <span
                                className="block truncate"
                                title={row.existingControls}
                              >
                                {row.existingControls || "—"}
                              </span>
                            </td>
                            <td className="px-2 py-2 text-muted-foreground max-w-[120px]">
                              <span
                                className="block truncate"
                                title={row.additionalControls}
                              >
                                {row.additionalControls || "—"}
                              </span>
                            </td>
                            <td className="px-2 py-2 text-foreground font-mono text-center">
                              {String(row.residualRiskScore)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>

              {/* Risk Matrix */}
              {hira.hazards.length > 0 && (
                <div className="elevated-card rounded-xl p-4">
                  <RiskMatrix plotted={plottedCoords} />
                </div>
              )}

              <Separator className="bg-border" />

              {/* Approval Chain */}
              <div>
                <p className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-primary" />
                  Approval Chain
                </p>
                <HIRAApprovalStepper hira={hira} />
              </div>

              {/* Submit for Approval */}
              {canSubmit && (
                <>
                  <Separator className="bg-border" />
                  <div
                    className="flex justify-end"
                    data-ocid="hira.submit_panel"
                  >
                    <Button
                      type="button"
                      disabled={isBusy || hira.hazards.length === 0}
                      onClick={() => submitMutation.mutate()}
                      className="safety-gradient-primary text-primary-foreground"
                      data-ocid="hira.submit_for_approval_button"
                    >
                      {submitMutation.isPending && (
                        <Loader2 className="w-4 h-4 animate-spin mr-2" />
                      )}
                      <ChevronRight className="w-4 h-4 mr-1" />
                      Submit for Approval
                    </Button>
                  </div>
                  {hira.hazards.length === 0 && (
                    <p className="text-xs text-destructive text-right -mt-3">
                      Add at least one hazard row before submitting.
                    </p>
                  )}
                </>
              )}

              {/* Approval Actions */}
              {canAct && (
                <>
                  <Separator className="bg-border" />
                  <div
                    className="space-y-3 rounded-lg border border-secondary/40 bg-secondary/5 p-4"
                    data-ocid="hira.approval_panel"
                  >
                    <p className="text-sm font-semibold text-secondary">
                      Your Action Required — Step {step} of 3
                    </p>
                    <div className="space-y-1.5">
                      <Label className="text-foreground">Remarks</Label>
                      <Textarea
                        value={remarks}
                        onChange={(e) => setRemarks(e.target.value)}
                        placeholder="Add review remarks (required for rejection)…"
                        rows={2}
                        className="bg-background border-input resize-none"
                        data-ocid="hira.approval.remarks.textarea"
                      />
                      {remarkErr && (
                        <p
                          className="text-xs text-destructive"
                          data-ocid="hira.approval.remarks.field_error"
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
                        data-ocid="hira.reject_button"
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
                        data-ocid="hira.approve_button"
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
            </div>
          )}
        </DialogContent>
      </Dialog>

      {showAddHazard && (
        <AddHazardDialog
          hiraNumber={hiraNumber}
          onClose={() => setShowAddHazard(false)}
        />
      )}
    </>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function HIRAPage() {
  const { actor, token, isReady } = useBackend();
  const { user } = useAuth();
  const userRole = user?.role ?? "Employee";
  const userEmpId = user?.employeeId ?? 0n;

  const [filterStatus, setFilterStatus] = useState<HIRAStatus | "ALL">("ALL");
  const [filterDept, setFilterDept] = useState("");
  const [filterRisk, setFilterRisk] = useState<RiskLevelKey | "ALL">("ALL");
  const [showCreate, setShowCreate] = useState(false);
  const [selectedHIRA, setSelectedHIRA] = useState<string | null>(null);

  const { data: hiras, isLoading } = useQuery<HIRAView[]>({
    queryKey: ["hiras"],
    queryFn: async () => {
      if (!actor || !token) return [];
      const res = await actor.listHIRAs(token);
      if (res.__kind__ === "err") throw new Error(res.err);
      return res.ok;
    },
    enabled: isReady,
  });

  const stats = useMemo(() => {
    if (!hiras)
      return { total: 0, approved: 0, highCritical: 0, overdueReview: 0 };
    return {
      total: hiras.length,
      approved: hiras.filter((h) => h.status === "Approved").length,
      highCritical: hiras.filter((h) => {
        const lvl = topRiskLevel(h);
        return lvl === "High" || lvl === "Critical";
      }).length,
      overdueReview: hiras.filter(isOverdueReview).length,
    };
  }, [hiras]);

  const departments = useMemo(() => {
    if (!hiras) return [];
    return Array.from(new Set(hiras.map((h) => h.department))).sort();
  }, [hiras]);

  const filtered = useMemo(() => {
    if (!hiras) return [];
    return hiras.filter((h) => {
      if (filterStatus !== "ALL" && h.status !== filterStatus) return false;
      if (filterDept && h.department !== filterDept) return false;
      if (filterRisk !== "ALL" && topRiskLevel(h) !== filterRisk) return false;
      return true;
    });
  }, [hiras, filterStatus, filterDept, filterRisk]);

  const canCreate =
    userRole === "SafetyOfficer" ||
    userRole === "HOD" ||
    userRole === "SystemAdmin";

  const hasFilters =
    filterStatus !== "ALL" || !!filterDept || filterRisk !== "ALL";

  const statCards = [
    {
      label: "Total HIRAs",
      value: stats.total,
      icon: <FileSearch className="w-5 h-5" />,
      color: "text-primary",
      bg: "bg-primary/10 border-primary/20",
    },
    {
      label: "Approved",
      value: stats.approved,
      icon: <CheckCircle2 className="w-5 h-5" />,
      color: "text-primary",
      bg: "bg-primary/10 border-primary/20",
    },
    {
      label: "High / Critical Risk",
      value: stats.highCritical,
      icon: <AlertTriangle className="w-5 h-5" />,
      color: "text-destructive",
      bg: "bg-destructive/10 border-destructive/20",
    },
    {
      label: "Overdue Reviews",
      value: stats.overdueReview,
      icon: <TrendingUp className="w-5 h-5" />,
      color: "text-secondary",
      bg: "bg-secondary/10 border-secondary/20",
    },
  ];

  return (
    <div className="space-y-6" data-ocid="hira.page">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="section-header flex items-center gap-2 mb-0">
            <FileSearch className="w-6 h-6 text-primary" />
            HIRA
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Hazard Identification &amp; Risk Assessment
          </p>
        </div>
        {canCreate && (
          <Button
            type="button"
            onClick={() => setShowCreate(true)}
            className="safety-gradient-primary text-primary-foreground gap-2"
            data-ocid="hira.create.open_modal_button"
          >
            <Plus className="w-4 h-4" />
            New HIRA
          </Button>
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((s) => (
          <div
            key={s.label}
            className={`elevated-card rounded-xl p-4 border ${s.bg}`}
            data-ocid={`hira.stat.${s.label.toLowerCase().replace(/[ /]/g, "_")}`}
          >
            <div className={`${s.color} mb-2`}>{s.icon}</div>
            {isLoading ? (
              <Skeleton className="h-8 w-16 bg-muted/30 mb-1" />
            ) : (
              <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
            )}
            <p className="text-xs text-muted-foreground">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div
        className="elevated-card rounded-xl p-4 flex flex-wrap gap-3 items-end"
        data-ocid="hira.filters_panel"
      >
        <Filter className="w-4 h-4 text-muted-foreground self-center" />

        <div className="space-y-1 min-w-[160px]">
          <Label className="text-xs text-muted-foreground">Status</Label>
          <Select
            value={filterStatus}
            onValueChange={(v) => setFilterStatus(v as HIRAStatus | "ALL")}
          >
            <SelectTrigger
              className="h-8 text-sm bg-background border-input"
              data-ocid="hira.filter.status.select"
            >
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-card border-border">
              <SelectItem value="ALL">All Statuses</SelectItem>
              {Object.values(HIRAStatus).map((s) => (
                <SelectItem key={s} value={s}>
                  {STATUS_LABELS[s]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-1 min-w-[160px]">
          <Label className="text-xs text-muted-foreground">Risk Level</Label>
          <Select
            value={filterRisk}
            onValueChange={(v) => setFilterRisk(v as RiskLevelKey | "ALL")}
          >
            <SelectTrigger
              className="h-8 text-sm bg-background border-input"
              data-ocid="hira.filter.risk.select"
            >
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-card border-border">
              <SelectItem value="ALL">All Risk Levels</SelectItem>
              {(["Low", "Medium", "High", "Critical"] as RiskLevelKey[]).map(
                (lvl) => (
                  <SelectItem key={lvl} value={lvl}>
                    {lvl}
                  </SelectItem>
                ),
              )}
            </SelectContent>
          </Select>
        </div>

        {departments.length > 0 && (
          <div className="space-y-1 min-w-[160px]">
            <Label className="text-xs text-muted-foreground">Department</Label>
            <Select
              value={filterDept || "ALL"}
              onValueChange={(v) => setFilterDept(v === "ALL" ? "" : v)}
            >
              <SelectTrigger
                className="h-8 text-sm bg-background border-input"
                data-ocid="hira.filter.dept.select"
              >
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-card border-border">
                <SelectItem value="ALL">All Departments</SelectItem>
                {departments.map((d) => (
                  <SelectItem key={d} value={d}>
                    {d}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        {hasFilters && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => {
              setFilterStatus("ALL");
              setFilterDept("");
              setFilterRisk("ALL");
            }}
            className="text-muted-foreground hover:text-foreground gap-1"
            data-ocid="hira.filter.clear_button"
          >
            <X className="w-3.5 h-3.5" />
            Clear
          </Button>
        )}
      </div>

      {/* Table */}
      <div
        className="elevated-card rounded-xl overflow-hidden"
        data-ocid="hira.list"
      >
        {isLoading ? (
          <div className="p-6 space-y-3" data-ocid="hira.loading_state">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-12 w-full bg-muted/30" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div
            className="flex flex-col items-center justify-center py-16 gap-3"
            data-ocid="hira.empty_state"
          >
            <div className="w-12 h-12 rounded-full bg-muted/30 flex items-center justify-center">
              <FileSearch className="w-6 h-6 text-muted-foreground" />
            </div>
            <p className="text-sm font-medium text-foreground">
              {hiras?.length === 0
                ? "No HIRA records yet"
                : "No records match your filters"}
            </p>
            <p className="text-xs text-muted-foreground">
              {hiras?.length === 0
                ? "Create a new HIRA to get started."
                : "Try adjusting the filters above."}
            </p>
            {canCreate && hiras?.length === 0 && (
              <Button
                type="button"
                size="sm"
                onClick={() => setShowCreate(true)}
                className="safety-gradient-primary text-primary-foreground mt-2"
                data-ocid="hira.empty_state.create_button"
              >
                <Plus className="w-4 h-4 mr-1" />
                New HIRA
              </Button>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/20">
                  {[
                    "HIRA #",
                    "Task Description",
                    "Department",
                    "Highest Risk",
                    "Status",
                    "Review Date",
                    "",
                  ].map((h, i) => (
                    <th
                      key={h || i}
                      className={`text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide ${
                        i === 1
                          ? "hidden sm:table-cell"
                          : i === 2
                            ? "hidden md:table-cell"
                            : i >= 5
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
                {filtered.map((h, idx) => {
                  const risk = topRiskLevel(h);
                  const overdue = isOverdueReview(h);
                  return (
                    <tr
                      key={h.hiraNumber}
                      className="border-b border-border/50 hover:bg-muted/10 transition-colors cursor-pointer"
                      onClick={() => setSelectedHIRA(h.hiraNumber)}
                      onKeyDown={(e) =>
                        e.key === "Enter" && setSelectedHIRA(h.hiraNumber)
                      }
                      tabIndex={0}
                      data-ocid={`hira.item.${idx + 1}`}
                    >
                      <td className="px-4 py-3">
                        <span className="font-mono text-xs font-semibold text-primary">
                          {h.hiraNumber}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-foreground hidden sm:table-cell max-w-[200px]">
                        <span className="truncate block">
                          {h.taskDescription}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-muted-foreground hidden md:table-cell">
                        {h.department}
                      </td>
                      <td className="px-4 py-3">
                        <RiskBadge level={risk} />
                      </td>
                      <td className="px-4 py-3">
                        <StatusBadge status={h.status} />
                      </td>
                      <td className="px-4 py-3 hidden lg:table-cell">
                        <span
                          className={`text-sm ${
                            overdue
                              ? "text-destructive font-semibold"
                              : "text-muted-foreground"
                          }`}
                        >
                          {h.reviewDate}
                          {overdue && " ⚠"}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="w-8 h-8 text-muted-foreground hover:text-foreground"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedHIRA(h.hiraNumber);
                          }}
                          aria-label="View HIRA details"
                          data-ocid={`hira.view_button.${idx + 1}`}
                        >
                          <ChevronRight className="w-4 h-4" />
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

      {showCreate && (
        <CreateHIRADialog
          open={showCreate}
          onClose={() => setShowCreate(false)}
        />
      )}

      {selectedHIRA && (
        <HIRADetailDialog
          hiraNumber={selectedHIRA}
          userRole={userRole}
          userEmpId={userEmpId}
          onClose={() => setSelectedHIRA(null)}
        />
      )}
    </div>
  );
}
