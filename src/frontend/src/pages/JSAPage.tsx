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
  BookOpen,
  CheckCircle2,
  ChevronRight,
  ClipboardList,
  Clock,
  FileText,
  Filter,
  HardHat,
  Loader2,
  MapPin,
  Plus,
  Shield,
  Trash2,
  UserCheck,
  Users,
  X,
  XCircle,
} from "lucide-react";
import { useMemo, useState } from "react";
import type { ReactNode } from "react";
import { toast } from "sonner";
import {
  type CreateJSAInput,
  JSAStatus,
  type JSAStep,
  RiskLevel,
} from "../backend";
import type { JSAView } from "../backend";
import { useAuth } from "../hooks/useAuth";
import { useBackend } from "../hooks/useBackend";

// ── Constants ─────────────────────────────────────────────────────────────────

const STATUS_LABELS: Record<JSAStatus, string> = {
  Draft: "Draft",
  UnderReview: "Under Review",
  Approved: "Approved",
  Active: "Active",
  Closed: "Closed",
};

const RISK_LABELS: Record<RiskLevel, string> = {
  Low: "Low",
  Medium: "Medium",
  High: "High",
  Critical: "Critical",
};

const DEPARTMENTS = [
  "Maintenance",
  "Production",
  "Engineering",
  "Safety & Health",
  "Logistics",
  "Quality",
  "Administration",
  "Utilities",
];

const PPE_ITEMS: Array<{ key: keyof PPEFields; label: string }> = [
  { key: "helmetRequired", label: "Helmet" },
  { key: "safetyShoes", label: "Safety Shoes" },
  { key: "gloves", label: "Gloves" },
  { key: "harness", label: "Harness" },
  { key: "faceShield", label: "Face Shield" },
  { key: "goggles", label: "Goggles" },
  { key: "respirator", label: "Respirator" },
];

interface PPEFields {
  helmetRequired: boolean;
  safetyShoes: boolean;
  gloves: boolean;
  harness: boolean;
  faceShield: boolean;
  goggles: boolean;
  respirator: boolean;
}

// ── Helpers ────────────────────────────────────────────────────────────────────

function riskBadgeClass(level: RiskLevel): string {
  const map: Record<RiskLevel, string> = {
    Low: "bg-primary/15 text-primary border-primary/30",
    Medium: "bg-secondary/20 text-secondary border-secondary/40",
    High: "bg-orange-500/20 text-orange-400 border-orange-500/40",
    Critical: "bg-destructive/20 text-destructive border-destructive/40",
  };
  return map[level];
}

function getSelectedPPE(jsa: JSAView): string[] {
  const out: string[] = [];
  if (jsa.helmetRequired) out.push("Helmet");
  if (jsa.safetyShoes) out.push("Safety Shoes");
  if (jsa.gloves) out.push("Gloves");
  if (jsa.harness) out.push("Harness");
  if (jsa.faceShield) out.push("Face Shield");
  if (jsa.goggles) out.push("Goggles");
  if (jsa.respirator) out.push("Respirator");
  return out;
}

// ── Status Badge ───────────────────────────────────────────────────────────────

function StatusBadge({ status }: { status: JSAStatus }) {
  const variants: Record<JSAStatus, string> = {
    Draft: "bg-muted/50 text-muted-foreground border-border",
    UnderReview: "bg-secondary/20 text-secondary border-secondary/40",
    Approved: "bg-blue-500/20 text-blue-400 border-blue-500/40",
    Active: "bg-primary/20 text-primary border-primary/40",
    Closed: "bg-muted/40 text-muted-foreground border-border",
  };
  return (
    <span
      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold border ${variants[status]}`}
    >
      {status === "Active" && (
        <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
      )}
      {STATUS_LABELS[status]}
    </span>
  );
}

// ── Info Cell ──────────────────────────────────────────────────────────────────

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

// ── Stat Card ─────────────────────────────────────────────────────────────────

function StatCard({
  icon,
  label,
  value,
  accent,
}: {
  icon: ReactNode;
  label: string;
  value: number;
  accent: string;
}) {
  return (
    <div className="elevated-card rounded-xl p-4 flex items-center gap-4">
      <div
        className={`w-10 h-10 rounded-lg flex items-center justify-center ${accent}`}
      >
        {icon}
      </div>
      <div>
        <p className="text-2xl font-bold text-foreground tabular-nums">
          {value}
        </p>
        <p className="text-xs text-muted-foreground">{label}</p>
      </div>
    </div>
  );
}

// ── Step Row Editor ────────────────────────────────────────────────────────────

interface StepRowProps {
  step: Partial<JSAStep>;
  index: number;
  editable: boolean;
  onChange: (index: number, field: string, value: string | RiskLevel) => void;
  onDelete: (index: number) => void;
}

function StepRow({ step, index, editable, onChange, onDelete }: StepRowProps) {
  return (
    <tr
      className="border-b border-border/50 align-top"
      data-ocid={`jsa.step.${index + 1}`}
    >
      <td className="px-3 py-2 text-sm font-mono text-muted-foreground w-10">
        {index + 1}
      </td>
      <td className="px-3 py-2">
        {editable ? (
          <Textarea
            value={step.description ?? ""}
            onChange={(e) => onChange(index, "description", e.target.value)}
            placeholder="Step description"
            rows={2}
            className="bg-background border-input text-sm resize-none min-w-[140px]"
            data-ocid={`jsa.step.description.${index + 1}`}
          />
        ) : (
          <span className="text-sm text-foreground">{step.description}</span>
        )}
      </td>
      <td className="px-3 py-2">
        {editable ? (
          <Textarea
            value={step.hazards ?? ""}
            onChange={(e) => onChange(index, "hazards", e.target.value)}
            placeholder="Identified hazards"
            rows={2}
            className="bg-background border-input text-sm resize-none min-w-[140px]"
            data-ocid={`jsa.step.hazards.${index + 1}`}
          />
        ) : (
          <span className="text-sm text-foreground">{step.hazards}</span>
        )}
      </td>
      <td className="px-3 py-2 w-32">
        {editable ? (
          <Select
            value={step.riskLevel ?? RiskLevel.Low}
            onValueChange={(v) => onChange(index, "riskLevel", v as RiskLevel)}
          >
            <SelectTrigger
              className="h-8 text-xs bg-background border-input"
              data-ocid={`jsa.step.risk.${index + 1}`}
            >
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-card border-border">
              {Object.values(RiskLevel).map((r) => (
                <SelectItem key={r} value={r}>
                  {RISK_LABELS[r]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        ) : (
          <Badge
            variant="outline"
            className={`text-xs ${riskBadgeClass(step.riskLevel ?? RiskLevel.Low)}`}
          >
            {RISK_LABELS[step.riskLevel ?? RiskLevel.Low]}
          </Badge>
        )}
      </td>
      <td className="px-3 py-2">
        {editable ? (
          <Textarea
            value={step.controls ?? ""}
            onChange={(e) => onChange(index, "controls", e.target.value)}
            placeholder="Control measures"
            rows={2}
            className="bg-background border-input text-sm resize-none min-w-[140px]"
            data-ocid={`jsa.step.controls.${index + 1}`}
          />
        ) : (
          <span className="text-sm text-foreground">{step.controls}</span>
        )}
      </td>
      <td className="px-3 py-2 w-10 text-center">
        {editable && (
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="w-7 h-7 text-destructive/70 hover:text-destructive hover:bg-destructive/10"
            onClick={() => onDelete(index)}
            aria-label="Remove step"
            data-ocid={`jsa.step.delete.${index + 1}`}
          >
            <Trash2 className="w-3.5 h-3.5" />
          </Button>
        )}
      </td>
    </tr>
  );
}

// ── Create JSA Dialog ──────────────────────────────────────────────────────────

function CreateJSADialog({
  open,
  onClose,
}: { open: boolean; onClose: () => void }) {
  const { actor, token, isReady } = useBackend();
  const { user } = useAuth();
  const qc = useQueryClient();

  const [jobTitle, setJobTitle] = useState("");
  const [department, setDepartment] = useState("");
  const [area, setArea] = useState("");
  const [location, setLocation] = useState("");
  const [analysisDate, setAnalysisDate] = useState(
    new Date().toISOString().slice(0, 10),
  );
  const [linkedPtwNumber, setLinkedPtwNumber] = useState("");
  const [emergencyContacts, setEmergencyContacts] = useState("");
  const [ppe, setPpe] = useState<PPEFields>({
    helmetRequired: false,
    safetyShoes: false,
    gloves: false,
    harness: false,
    faceShield: false,
    goggles: false,
    respirator: false,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const mutation = useMutation({
    mutationFn: async (input: CreateJSAInput) => {
      if (!actor || !token) throw new Error("Not authenticated");
      const res = await actor.createJSA(token, input);
      if (res.__kind__ === "err") throw new Error(res.err);
      return res.ok;
    },
    onSuccess: (jsaNumber) => {
      toast.success(`JSA ${jsaNumber} created.`);
      qc.invalidateQueries({ queryKey: ["jsas"] });
      handleClose();
    },
    onError: (e: Error) => toast.error(e.message),
  });

  function handleClose() {
    setJobTitle("");
    setDepartment("");
    setArea("");
    setLocation("");
    setAnalysisDate(new Date().toISOString().slice(0, 10));
    setLinkedPtwNumber("");
    setEmergencyContacts("");
    setPpe({
      helmetRequired: false,
      safetyShoes: false,
      gloves: false,
      harness: false,
      faceShield: false,
      goggles: false,
      respirator: false,
    });
    setErrors({});
    onClose();
  }

  function validate(): boolean {
    const e: Record<string, string> = {};
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
      linkedPtwNumber: linkedPtwNumber.trim() || undefined,
      ...ppe,
    });
  }

  return (
    <Dialog open={open} onOpenChange={(v) => !v && handleClose()}>
      <DialogContent className="max-w-xl max-h-[90vh] overflow-y-auto bg-card border-border">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-foreground">
            <ClipboardList className="w-5 h-5 text-primary" />
            New Job Safety Analysis
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 pt-2">
          {/* Job Title */}
          <div className="space-y-1.5">
            <Label className="text-foreground">Job Title *</Label>
            <Input
              value={jobTitle}
              onChange={(e) => setJobTitle(e.target.value)}
              placeholder="e.g. Hot work on reactor vessel"
              className="bg-background border-input"
              data-ocid="jsa.create.job_title.input"
            />
            {errors.jobTitle && (
              <p
                className="text-xs text-destructive"
                data-ocid="jsa.create.job_title.field_error"
              >
                {errors.jobTitle}
              </p>
            )}
          </div>

          {/* Dept + Area */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label className="text-foreground">Department *</Label>
              <Select value={department} onValueChange={setDepartment}>
                <SelectTrigger
                  className="bg-background border-input"
                  data-ocid="jsa.create.department.select"
                >
                  <SelectValue placeholder="Select…" />
                </SelectTrigger>
                <SelectContent className="bg-card border-border">
                  {DEPARTMENTS.map((d) => (
                    <SelectItem key={d} value={d}>
                      {d}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.department && (
                <p
                  className="text-xs text-destructive"
                  data-ocid="jsa.create.department.field_error"
                >
                  {errors.department}
                </p>
              )}
            </div>
            <div className="space-y-1.5">
              <Label className="text-foreground">Area *</Label>
              <Input
                value={area}
                onChange={(e) => setArea(e.target.value)}
                placeholder="e.g. Zone B"
                className="bg-background border-input"
                data-ocid="jsa.create.area.input"
              />
              {errors.area && (
                <p className="text-xs text-destructive">{errors.area}</p>
              )}
            </div>
          </div>

          {/* Location + Date */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label className="text-foreground">Location *</Label>
              <Input
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="e.g. Building 3, Level 2"
                className="bg-background border-input"
                data-ocid="jsa.create.location.input"
              />
              {errors.location && (
                <p className="text-xs text-destructive">{errors.location}</p>
              )}
            </div>
            <div className="space-y-1.5">
              <Label className="text-foreground">Analysis Date *</Label>
              <Input
                type="date"
                value={analysisDate}
                onChange={(e) => setAnalysisDate(e.target.value)}
                className="bg-background border-input"
                data-ocid="jsa.create.date.input"
              />
              {errors.analysisDate && (
                <p className="text-xs text-destructive">
                  {errors.analysisDate}
                </p>
              )}
            </div>
          </div>

          {/* Prepared By (read-only) */}
          <div className="space-y-1.5">
            <Label className="text-foreground">Prepared By</Label>
            <Input
              value={user?.name ?? ""}
              readOnly
              className="bg-muted/20 border-border text-muted-foreground cursor-default"
            />
          </div>

          {/* Linked PTW */}
          <div className="space-y-1.5">
            <Label className="text-foreground">
              Linked PTW Number (optional)
            </Label>
            <Input
              value={linkedPtwNumber}
              onChange={(e) => setLinkedPtwNumber(e.target.value)}
              placeholder="e.g. PTW-2026-0001"
              className="bg-background border-input"
              data-ocid="jsa.create.linked_ptw.input"
            />
          </div>

          {/* Emergency Contacts */}
          <div className="space-y-1.5">
            <Label className="text-foreground">Emergency Contacts</Label>
            <Textarea
              value={emergencyContacts}
              onChange={(e) => setEmergencyContacts(e.target.value)}
              placeholder="Site emergency numbers, rescue team contact…"
              rows={2}
              className="bg-background border-input resize-none"
              data-ocid="jsa.create.emergency.textarea"
            />
          </div>

          {/* PPE Checklist */}
          <div className="space-y-2">
            <Label className="text-foreground">PPE Required</Label>
            <div className="grid grid-cols-2 gap-2">
              {PPE_ITEMS.map(({ key, label }) => (
                <label
                  key={key}
                  htmlFor={`create-ppe-${key}`}
                  className="flex items-center gap-2 rounded-md border border-border bg-muted/10 px-2.5 py-2 cursor-pointer hover:bg-muted/20 transition-colors"
                >
                  <Checkbox
                    id={`create-ppe-${key}`}
                    checked={ppe[key]}
                    onCheckedChange={(v) =>
                      setPpe((prev) => ({ ...prev, [key]: !!v }))
                    }
                    data-ocid={`jsa.create.ppe.${key}`}
                  />
                  <span className="text-sm text-foreground">{label}</span>
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
              data-ocid="jsa.create.cancel_button"
            >
              Cancel
            </Button>
            <Button
              type="button"
              disabled={!isReady || mutation.isPending}
              onClick={handleCreate}
              className="safety-gradient-primary text-primary-foreground"
              data-ocid="jsa.create.submit_button"
            >
              {mutation.isPending && (
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
              )}
              Create JSA
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// ── JSA Detail Dialog ──────────────────────────────────────────────────────────

function JSADetailDialog({
  jsaNumber,
  onClose,
  userRole,
  userEmpId,
}: {
  jsaNumber: string;
  onClose: () => void;
  userRole: string;
  userEmpId: bigint;
}) {
  const { actor, token } = useBackend();
  const qc = useQueryClient();

  const [remarks, setRemarks] = useState("");
  const [remarkErr, setRemarkErr] = useState("");
  const [briefingIds, setBriefingIds] = useState("");
  const [showBriefingForm, setShowBriefingForm] = useState(false);

  // Editable steps state
  const [editSteps, setEditSteps] = useState<Array<Partial<JSAStep>>>([]);
  const [stepsInitialised, setStepsInitialised] = useState(false);

  const { data: jsa, isLoading } = useQuery<JSAView>({
    queryKey: ["jsa", jsaNumber],
    queryFn: async () => {
      if (!actor || !token) throw new Error("Not ready");
      const res = await actor.getJSA(token, jsaNumber);
      if (res.__kind__ === "err") throw new Error(res.err);
      return res.ok;
    },
    enabled: !!actor && !!token,
  });

  // Seed steps from loaded JSA once
  if (jsa && !stepsInitialised) {
    setEditSteps(jsa.steps.length > 0 ? [...jsa.steps] : []);
    setStepsInitialised(true);
  }

  const isEditable =
    jsa &&
    (jsa.status === "Draft" || jsa.status === "UnderReview") &&
    (userRole === "SafetyOfficer" ||
      userRole === "SystemAdmin" ||
      userRole === "HOD" ||
      jsa.preparedBy === userEmpId);

  const canSubmit =
    jsa?.status === "Draft" &&
    (jsa.preparedBy === userEmpId ||
      userRole === "SafetyOfficer" ||
      userRole === "SystemAdmin");

  const canApprove =
    jsa &&
    ((userRole === "HOD" && jsa.status === "UnderReview" && !jsa.hodAt) ||
      (userRole === "SafetyOfficer" &&
        jsa.status === "UnderReview" &&
        !!jsa.hodAt &&
        !jsa.soAt) ||
      (userRole === "SystemAdmin" && jsa.status === "UnderReview"));

  const canBrief =
    jsa &&
    (jsa.status === "Approved" || jsa.status === "Active") &&
    (userRole === "SafetyOfficer" || userRole === "SystemAdmin");

  // Mutations
  const submitMut = useMutation({
    mutationFn: async () => {
      if (!actor || !token) throw new Error("Not authenticated");
      const res = await actor.submitJSAForApproval(token, jsaNumber);
      if (res.__kind__ === "err") throw new Error(res.err);
    },
    onSuccess: () => {
      toast.success("JSA submitted for approval.");
      qc.invalidateQueries({ queryKey: ["jsas"] });
      qc.invalidateQueries({ queryKey: ["jsa", jsaNumber] });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const actionMut = useMutation({
    mutationFn: async ({ approve, rem }: { approve: boolean; rem: string }) => {
      if (!actor || !token) throw new Error("Not authenticated");
      const res = await actor.actOnJSA(token, jsaNumber, approve, rem);
      if (res.__kind__ === "err") throw new Error(res.err);
    },
    onSuccess: (_d, vars) => {
      toast.success(vars.approve ? "JSA approved." : "JSA rejected.");
      qc.invalidateQueries({ queryKey: ["jsas"] });
      qc.invalidateQueries({ queryKey: ["jsa", jsaNumber] });
      setRemarks("");
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const briefingMut = useMutation({
    mutationFn: async (ids: bigint[]) => {
      if (!actor || !token) throw new Error("Not authenticated");
      const res = await actor.recordJSABriefing(token, jsaNumber, ids);
      if (res.__kind__ === "err") throw new Error(res.err);
    },
    onSuccess: () => {
      toast.success("Briefing attendance recorded.");
      qc.invalidateQueries({ queryKey: ["jsa", jsaNumber] });
      setShowBriefingForm(false);
      setBriefingIds("");
    },
    onError: (e: Error) => toast.error(e.message),
  });

  function handleAct(approve: boolean) {
    if (!approve && !remarks.trim()) {
      setRemarkErr("Rejection remarks are required.");
      return;
    }
    setRemarkErr("");
    actionMut.mutate({ approve, rem: remarks });
  }

  function handleBriefing() {
    const ids = briefingIds
      .split(/[,\s]+/)
      .map((s) => s.trim())
      .filter(Boolean)
      .map((s) => BigInt(s));
    if (ids.length === 0) {
      toast.error("Enter at least one Employee ID.");
      return;
    }
    briefingMut.mutate(ids);
  }

  function updateStep(index: number, field: string, value: string | RiskLevel) {
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
        responsibleEmpId: undefined,
      },
    ]);
  }

  function deleteStep(index: number) {
    setEditSteps((prev) =>
      prev
        .filter((_, i) => i !== index)
        .map((s, i) => ({ ...s, stepNo: BigInt(i + 1) })),
    );
  }

  const isBusy =
    submitMut.isPending || actionMut.isPending || briefingMut.isPending;

  if (isLoading || !jsa) {
    return (
      <Dialog open onOpenChange={(v) => !v && onClose()}>
        <DialogContent className="max-w-3xl bg-card border-border">
          <div className="space-y-3 p-4" data-ocid="jsa.detail.loading_state">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-10 w-full bg-muted/30" />
            ))}
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  const ppeSelected = getSelectedPPE(jsa);

  return (
    <Dialog open onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="max-w-4xl max-h-[92vh] overflow-y-auto bg-card border-border">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between gap-2">
            <span className="flex items-center gap-2 text-foreground">
              <ClipboardList className="w-5 h-5 text-primary" />
              <span className="font-mono">{jsa.jsaNumber}</span>
              <span className="text-muted-foreground font-normal text-base hidden sm:inline">
                — {jsa.jobTitle}
              </span>
            </span>
            <StatusBadge status={jsa.status} />
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-5">
          {/* Header info grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <InfoCell
              icon={<FileText className="w-3.5 h-3.5" />}
              label="Job Title"
              value={jsa.jobTitle}
            />
            <InfoCell
              icon={<MapPin className="w-3.5 h-3.5" />}
              label="Department"
              value={jsa.department}
            />
            <InfoCell
              icon={<MapPin className="w-3.5 h-3.5" />}
              label="Area / Location"
              value={`${jsa.area} — ${jsa.location}`}
            />
            <InfoCell
              icon={<Users className="w-3.5 h-3.5" />}
              label="Prepared By"
              value={String(jsa.preparedBy)}
            />
            <InfoCell
              icon={<Clock className="w-3.5 h-3.5" />}
              label="Analysis Date"
              value={jsa.analysisDate}
            />
            {jsa.linkedPtwNumber && (
              <InfoCell
                icon={<Shield className="w-3.5 h-3.5" />}
                label="Linked PTW"
                value={jsa.linkedPtwNumber}
              />
            )}
          </div>

          {/* Emergency Contacts */}
          {jsa.emergencyContacts && (
            <div className="rounded-lg border border-secondary/30 bg-secondary/5 p-3">
              <p className="text-xs font-semibold text-secondary uppercase tracking-wide mb-1">
                Emergency Contacts
              </p>
              <p className="text-sm text-foreground">{jsa.emergencyContacts}</p>
            </div>
          )}

          <Separator className="bg-border" />

          {/* Job Steps Table */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <p className="text-sm font-semibold text-foreground flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-primary" />
                Job Steps
              </p>
              {isEditable && (
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  onClick={addStep}
                  className="gap-1.5 border-primary/30 text-primary hover:bg-primary/10"
                  data-ocid="jsa.add_step_button"
                >
                  <Plus className="w-3.5 h-3.5" />
                  Add Step
                </Button>
              )}
            </div>

            {editSteps.length === 0 ? (
              <div
                className="flex flex-col items-center justify-center py-8 rounded-lg border border-dashed border-border gap-2"
                data-ocid="jsa.steps.empty_state"
              >
                <BookOpen className="w-8 h-8 text-muted-foreground" />
                <p className="text-sm text-muted-foreground">
                  No steps defined yet.
                </p>
                {isEditable && (
                  <Button
                    type="button"
                    size="sm"
                    onClick={addStep}
                    className="safety-gradient-primary text-primary-foreground mt-1"
                    data-ocid="jsa.steps.add_first_button"
                  >
                    <Plus className="w-3.5 h-3.5 mr-1" />
                    Add First Step
                  </Button>
                )}
              </div>
            ) : (
              <div className="overflow-x-auto rounded-lg border border-border">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-muted/20 border-b border-border">
                      {[
                        "#",
                        "Step Description",
                        "Hazards",
                        "Risk Level",
                        "Control Measures",
                        "",
                      ].map((h, i) => (
                        <th
                          key={h || i}
                          className="text-left px-3 py-2.5 text-xs font-semibold text-muted-foreground uppercase tracking-wide whitespace-nowrap"
                        >
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {editSteps.map((step, idx) => (
                      <StepRow
                        key={idx}
                        step={step}
                        index={idx}
                        editable={!!isEditable}
                        onChange={updateStep}
                        onDelete={deleteStep}
                      />
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          <Separator className="bg-border" />

          {/* PPE Checklist */}
          <div>
            <p className="text-sm font-semibold text-foreground flex items-center gap-2 mb-3">
              <HardHat className="w-4 h-4 text-primary" />
              PPE Checklist
            </p>
            {ppeSelected.length === 0 ? (
              <p className="text-sm text-muted-foreground">No PPE specified.</p>
            ) : (
              <div className="flex flex-wrap gap-2">
                {ppeSelected.map((p) => (
                  <Badge
                    key={p}
                    variant="outline"
                    className="gap-1 border-primary/30 text-primary bg-primary/10"
                  >
                    <HardHat className="w-3 h-3" />
                    {p}
                  </Badge>
                ))}
              </div>
            )}
          </div>

          {/* Approval history */}
          <Separator className="bg-border" />
          <div>
            <p className="text-sm font-semibold text-foreground flex items-center gap-2 mb-3">
              <Shield className="w-4 h-4 text-primary" />
              Approval Trail
            </p>
            <div className="space-y-2">
              {/* Step 1: HOD */}
              <div
                className={`rounded-lg border px-4 py-3 ${
                  jsa.hodAt
                    ? "border-primary/30 bg-primary/5"
                    : jsa.status === "UnderReview"
                      ? "border-secondary/40 bg-secondary/5"
                      : "border-border bg-muted/10"
                }`}
              >
                <div className="flex items-center gap-2 mb-0.5">
                  <span
                    className={`text-xs font-semibold ${
                      jsa.hodAt ? "text-primary" : "text-muted-foreground"
                    }`}
                  >
                    Step 1 — HOD Review
                  </span>
                  {jsa.hodAt && (
                    <Badge
                      variant="outline"
                      className="text-xs border-primary/30 text-primary bg-primary/10"
                    >
                      <CheckCircle2 className="w-3 h-3 mr-1" />
                      Approved
                    </Badge>
                  )}
                  {!jsa.hodAt && jsa.status === "UnderReview" && (
                    <Badge
                      variant="outline"
                      className="text-xs border-secondary/40 text-secondary"
                    >
                      <Clock className="w-3 h-3 mr-1" />
                      Pending
                    </Badge>
                  )}
                </div>
                {jsa.hodAt && (
                  <p className="text-xs text-muted-foreground">
                    {new Date(Number(jsa.hodAt / 1_000_000n)).toLocaleString()}
                  </p>
                )}
                {jsa.hodRemarks && (
                  <p className="text-xs text-foreground/70 italic mt-1">
                    &ldquo;{jsa.hodRemarks}&rdquo;
                  </p>
                )}
              </div>

              {/* Step 2: Safety Officer */}
              <div
                className={`rounded-lg border px-4 py-3 ${
                  jsa.soAt
                    ? "border-primary/30 bg-primary/5"
                    : jsa.hodAt && jsa.status === "UnderReview"
                      ? "border-secondary/40 bg-secondary/5"
                      : "border-border bg-muted/10"
                }`}
              >
                <div className="flex items-center gap-2 mb-0.5">
                  <span
                    className={`text-xs font-semibold ${
                      jsa.soAt ? "text-primary" : "text-muted-foreground"
                    }`}
                  >
                    Step 2 — Safety Officer Approval
                  </span>
                  {jsa.soAt && (
                    <Badge
                      variant="outline"
                      className="text-xs border-primary/30 text-primary bg-primary/10"
                    >
                      <CheckCircle2 className="w-3 h-3 mr-1" />
                      Approved
                    </Badge>
                  )}
                  {jsa.hodAt && !jsa.soAt && jsa.status === "UnderReview" && (
                    <Badge
                      variant="outline"
                      className="text-xs border-secondary/40 text-secondary"
                    >
                      <Clock className="w-3 h-3 mr-1" />
                      Pending
                    </Badge>
                  )}
                </div>
                {jsa.soAt && (
                  <p className="text-xs text-muted-foreground">
                    {new Date(Number(jsa.soAt / 1_000_000n)).toLocaleString()}
                  </p>
                )}
                {jsa.soRemarks && (
                  <p className="text-xs text-foreground/70 italic mt-1">
                    &ldquo;{jsa.soRemarks}&rdquo;
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Briefing Attendance */}
          {(jsa.status === "Approved" || jsa.status === "Active") && (
            <>
              <Separator className="bg-border" />
              <div data-ocid="jsa.briefing_section">
                <div className="flex items-center justify-between mb-3">
                  <p className="text-sm font-semibold text-foreground flex items-center gap-2">
                    <UserCheck className="w-4 h-4 text-primary" />
                    Briefing Attendance
                  </p>
                  {canBrief && (
                    <Button
                      type="button"
                      size="sm"
                      variant="outline"
                      onClick={() => setShowBriefingForm((v) => !v)}
                      className="gap-1.5 border-primary/30 text-primary hover:bg-primary/10"
                      data-ocid="jsa.record_briefing_button"
                    >
                      <UserCheck className="w-3.5 h-3.5" />
                      Record Briefing
                    </Button>
                  )}
                </div>

                {jsa.briefingAttendees.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {jsa.briefingAttendees.map((id) => (
                      <Badge
                        key={String(id)}
                        variant="outline"
                        className="border-border text-muted-foreground"
                      >
                        <Users className="w-3 h-3 mr-1" />
                        EMP-{String(id)}
                      </Badge>
                    ))}
                  </div>
                ) : (
                  <p
                    className="text-sm text-muted-foreground"
                    data-ocid="jsa.briefing.empty_state"
                  >
                    No briefing attendance recorded yet.
                  </p>
                )}

                {showBriefingForm && (
                  <div
                    className="mt-3 space-y-2 rounded-lg border border-primary/20 bg-primary/5 p-3"
                    data-ocid="jsa.briefing_form"
                  >
                    <Label className="text-foreground text-sm">
                      Employee IDs (comma or space separated)
                    </Label>
                    <Input
                      value={briefingIds}
                      onChange={(e) => setBriefingIds(e.target.value)}
                      placeholder="e.g. 230034 230035 230036"
                      className="bg-background border-input"
                      data-ocid="jsa.briefing.ids.input"
                    />
                    <div className="flex gap-2 justify-end">
                      <Button
                        type="button"
                        size="sm"
                        variant="ghost"
                        onClick={() => setShowBriefingForm(false)}
                        className="text-muted-foreground"
                        data-ocid="jsa.briefing.cancel_button"
                      >
                        Cancel
                      </Button>
                      <Button
                        type="button"
                        size="sm"
                        disabled={briefingMut.isPending}
                        onClick={handleBriefing}
                        className="safety-gradient-primary text-primary-foreground"
                        data-ocid="jsa.briefing.save_button"
                      >
                        {briefingMut.isPending && (
                          <Loader2 className="w-3.5 h-3.5 animate-spin mr-1" />
                        )}
                        Save Attendance
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </>
          )}

          {/* Actions */}
          {canSubmit && (
            <>
              <Separator className="bg-border" />
              <div className="flex justify-end" data-ocid="jsa.submit_panel">
                <Button
                  type="button"
                  disabled={isBusy}
                  onClick={() => submitMut.mutate()}
                  className="safety-gradient-primary text-primary-foreground"
                  data-ocid="jsa.submit_for_approval_button"
                >
                  {submitMut.isPending && (
                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  )}
                  <ChevronRight className="w-4 h-4 mr-1" />
                  Submit for Approval
                </Button>
              </div>
            </>
          )}

          {canApprove && (
            <>
              <Separator className="bg-border" />
              <div
                className="rounded-lg border border-secondary/40 bg-secondary/5 p-4 space-y-3"
                data-ocid="jsa.approval_panel"
              >
                <p className="text-sm font-semibold text-secondary flex items-center gap-2">
                  <Shield className="w-4 h-4" />
                  Your Approval Required
                </p>
                <div className="space-y-1.5">
                  <Label className="text-foreground">Remarks</Label>
                  <Textarea
                    value={remarks}
                    onChange={(e) => setRemarks(e.target.value)}
                    placeholder="Add review remarks (required for rejection)…"
                    rows={2}
                    className="bg-background border-input resize-none"
                    data-ocid="jsa.remarks.textarea"
                  />
                  {remarkErr && (
                    <p
                      className="text-xs text-destructive"
                      data-ocid="jsa.remarks.field_error"
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
                    data-ocid="jsa.reject_button"
                  >
                    {actionMut.isPending && (
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
                    data-ocid="jsa.approve_button"
                  >
                    {actionMut.isPending && (
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
      </DialogContent>
    </Dialog>
  );
}

// ── Main Page ──────────────────────────────────────────────────────────────────

export default function JSAPage() {
  const { actor, token, isReady } = useBackend();
  const { user } = useAuth();
  const userRole = user?.role ?? "Employee";
  const userEmpId = user?.employeeId ?? 0n;

  const [filterStatus, setFilterStatus] = useState<JSAStatus | "ALL">("ALL");
  const [filterDept, setFilterDept] = useState("ALL");
  const [showCreate, setShowCreate] = useState(false);
  const [selectedJSA, setSelectedJSA] = useState<string | null>(null);

  const { data: jsas, isLoading } = useQuery<JSAView[]>({
    queryKey: ["jsas"],
    queryFn: async () => {
      if (!actor || !token) return [];
      const res = await actor.listJSAs(token);
      if (res.__kind__ === "err") throw new Error(res.err);
      return res.ok;
    },
    enabled: isReady,
  });

  const filtered = useMemo(() => {
    if (!jsas) return [];
    return jsas.filter((j) => {
      if (filterStatus !== "ALL" && j.status !== filterStatus) return false;
      if (
        filterDept !== "ALL" &&
        userRole !== "SystemAdmin" &&
        userRole !== "SafetyOfficer"
      ) {
        if (j.department !== filterDept) return false;
      } else if (filterDept !== "ALL") {
        if (j.department !== filterDept) return false;
      }
      if (userRole === "HOD" && j.department !== user?.department) return false;
      return true;
    });
  }, [jsas, filterStatus, filterDept, userRole, user?.department]);

  // Stats
  const stats = useMemo(() => {
    const all = jsas ?? [];
    const now = new Date();
    const thisMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
    return {
      total: all.length,
      active: all.filter((j) => j.status === "Active").length,
      pending: all.filter(
        (j) => j.status === "UnderReview" || j.status === "Draft",
      ).length,
      closedThisMonth: all.filter(
        (j) =>
          j.status === "Closed" &&
          new Date(Number(j.updatedAt / 1_000_000n))
            .toISOString()
            .startsWith(thisMonth),
      ).length,
    };
  }, [jsas]);

  const canCreate =
    userRole === "SafetyOfficer" ||
    userRole === "HOD" ||
    userRole === "SystemAdmin";

  const hasFilters = filterStatus !== "ALL" || filterDept !== "ALL";

  return (
    <div className="space-y-6" data-ocid="jsa.page">
      {/* Page header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="section-header flex items-center gap-2 mb-0">
            <ClipboardList className="w-6 h-6 text-primary" />
            Job Safety Analysis (JSA)
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Plan, analyse and control job-specific hazards before work begins
          </p>
        </div>
        {canCreate && (
          <Button
            type="button"
            onClick={() => setShowCreate(true)}
            className="safety-gradient-primary text-primary-foreground gap-2 shrink-0"
            data-ocid="jsa.create.open_modal_button"
          >
            <Plus className="w-4 h-4" />
            New JSA
          </Button>
        )}
      </div>

      {/* Stats */}
      <div
        className="grid grid-cols-2 lg:grid-cols-4 gap-4"
        data-ocid="jsa.stats_section"
      >
        <StatCard
          icon={<ClipboardList className="w-5 h-5 text-primary" />}
          label="Total JSAs"
          value={stats.total}
          accent="bg-primary/15"
        />
        <StatCard
          icon={<Shield className="w-5 h-5 text-green-400" />}
          label="Active"
          value={stats.active}
          accent="bg-green-500/15"
        />
        <StatCard
          icon={<Clock className="w-5 h-5 text-secondary" />}
          label="Pending Approval"
          value={stats.pending}
          accent="bg-secondary/15"
        />
        <StatCard
          icon={<CheckCircle2 className="w-5 h-5 text-muted-foreground" />}
          label="Closed This Month"
          value={stats.closedThisMonth}
          accent="bg-muted/30"
        />
      </div>

      {/* Filters */}
      <div
        className="elevated-card rounded-xl p-4 flex flex-wrap gap-3 items-end"
        data-ocid="jsa.filters_panel"
      >
        <Filter className="w-4 h-4 text-muted-foreground self-center" />

        <div className="space-y-1 min-w-[180px]">
          <Label className="text-xs text-muted-foreground">Status</Label>
          <Select
            value={filterStatus}
            onValueChange={(v) => setFilterStatus(v as JSAStatus | "ALL")}
          >
            <SelectTrigger
              className="h-8 text-sm bg-background border-input"
              data-ocid="jsa.filter.status.select"
            >
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-card border-border">
              <SelectItem value="ALL">All Statuses</SelectItem>
              {Object.values(JSAStatus).map((s) => (
                <SelectItem key={s} value={s}>
                  {STATUS_LABELS[s]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-1 min-w-[180px]">
          <Label className="text-xs text-muted-foreground">Department</Label>
          <Select value={filterDept} onValueChange={setFilterDept}>
            <SelectTrigger
              className="h-8 text-sm bg-background border-input"
              data-ocid="jsa.filter.department.select"
            >
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-card border-border">
              <SelectItem value="ALL">All Departments</SelectItem>
              {DEPARTMENTS.map((d) => (
                <SelectItem key={d} value={d}>
                  {d}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {hasFilters && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => {
              setFilterStatus("ALL");
              setFilterDept("ALL");
            }}
            className="text-muted-foreground hover:text-foreground gap-1"
            data-ocid="jsa.filter.clear_button"
          >
            <X className="w-3.5 h-3.5" />
            Clear
          </Button>
        )}
      </div>

      {/* Table */}
      <div
        className="elevated-card rounded-xl overflow-hidden"
        data-ocid="jsa.list"
      >
        {isLoading ? (
          <div className="p-6 space-y-3" data-ocid="jsa.loading_state">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-12 w-full bg-muted/30" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div
            className="flex flex-col items-center justify-center py-16 gap-3"
            data-ocid="jsa.empty_state"
          >
            <div className="w-12 h-12 rounded-full bg-muted/30 flex items-center justify-center">
              <ClipboardList className="w-6 h-6 text-muted-foreground" />
            </div>
            <p className="text-sm font-medium text-foreground">
              {jsas?.length === 0
                ? "No JSAs yet"
                : "No JSAs match your filters"}
            </p>
            <p className="text-xs text-muted-foreground">
              {jsas?.length === 0
                ? "Create a new Job Safety Analysis to get started."
                : "Try adjusting your status or department filters."}
            </p>
            {canCreate && jsas?.length === 0 && (
              <Button
                type="button"
                size="sm"
                onClick={() => setShowCreate(true)}
                className="safety-gradient-primary text-primary-foreground mt-2"
                data-ocid="jsa.empty_state.create_button"
              >
                <Plus className="w-4 h-4 mr-1" />
                New JSA
              </Button>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/20">
                  {[
                    "JSA #",
                    "Job Title",
                    "Department",
                    "Prepared By",
                    "Status",
                    "Date",
                    "",
                  ].map((h, i) => (
                    <th
                      key={h || i}
                      className={`text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide ${
                        i === 2 || i === 3 ? "hidden md:table-cell" : ""
                      } ${i === 5 ? "hidden lg:table-cell" : ""}`}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((j, idx) => (
                  <tr
                    key={j.jsaNumber}
                    className="border-b border-border/50 hover:bg-muted/10 transition-colors cursor-pointer"
                    onClick={() => setSelectedJSA(j.jsaNumber)}
                    onKeyDown={(e) =>
                      e.key === "Enter" && setSelectedJSA(j.jsaNumber)
                    }
                    tabIndex={0}
                    data-ocid={`jsa.item.${idx + 1}`}
                  >
                    <td className="px-4 py-3">
                      <span className="font-mono text-xs font-semibold text-primary">
                        {j.jsaNumber}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-foreground font-medium truncate max-w-[180px] block">
                        {j.jobTitle}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground hidden md:table-cell">
                      {j.department}
                    </td>
                    <td className="px-4 py-3 text-muted-foreground hidden md:table-cell">
                      EMP-{String(j.preparedBy)}
                    </td>
                    <td className="px-4 py-3">
                      <StatusBadge status={j.status} />
                    </td>
                    <td className="px-4 py-3 text-muted-foreground hidden lg:table-cell">
                      {j.analysisDate}
                    </td>
                    <td className="px-4 py-3">
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="w-8 h-8 text-muted-foreground hover:text-foreground"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedJSA(j.jsaNumber);
                        }}
                        aria-label="View JSA details"
                        data-ocid={`jsa.view_button.${idx + 1}`}
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

      {/* Dialogs */}
      {showCreate && (
        <CreateJSADialog
          open={showCreate}
          onClose={() => setShowCreate(false)}
        />
      )}
      {selectedJSA && (
        <JSADetailDialog
          jsaNumber={selectedJSA}
          onClose={() => setSelectedJSA(null)}
          userRole={userRole}
          userEmpId={userEmpId}
        />
      )}
    </div>
  );
}
