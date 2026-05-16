import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
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
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Award,
  BookOpen,
  CheckCircle,
  Download,
  Loader2,
  Plus,
  Search,
  Users,
  X,
  XCircle,
} from "lucide-react";
import React from "react";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import {
  AttendanceStatus,
  CertificateStatus,
  type EmployeeView,
  type TrainingAttendeeView,
  TrainingFrequency,
  TrainingType,
  type TrainingView,
} from "../backend";
import CertificateModal from "../components/training/CertificateModal";
import type { CertificateTemplateProps } from "../components/training/CertificateTemplate";
import { useAuth } from "../hooks/useAuth";
import { useBackend } from "../hooks/useBackend";

// ─── Label maps ─────────────────────────────────────────────
const TRAINING_TYPE_LABELS: Record<TrainingType, string> = {
  Induction: "Induction",
  Refresher: "Refresher",
  Regulatory: "Regulatory",
  OnTheJob: "On-the-Job",
  External: "External",
};

const FREQUENCY_LABELS: Record<TrainingFrequency, string> = {
  OneTime: "One-time",
  Annual: "Annual",
  BiAnnual: "Bi-annual",
  ThreeYearly: "3-yearly",
};

const FREQUENCY_MONTHS: Record<TrainingFrequency, number | null> = {
  OneTime: null,
  Annual: 12,
  BiAnnual: 6,
  ThreeYearly: 36,
};

const TYPE_COLORS: Record<TrainingType, string> = {
  Induction: "bg-primary/20 text-primary border-primary/30",
  Refresher: "bg-secondary/20 text-secondary border-secondary/30",
  Regulatory: "bg-destructive/20 text-destructive border-destructive/30",
  OnTheJob: "bg-chart-4/20 text-chart-4 border-chart-4/30",
  External: "bg-chart-5/20 text-chart-5 border-chart-5/30",
};

// ─── Helpers ─────────────────────────────────────────────────
function calcExpiryDate(
  trainingDate: string,
  frequency: TrainingFrequency,
): string {
  const months = FREQUENCY_MONTHS[frequency];
  if (!months) return "—";
  const d = new Date(trainingDate);
  d.setMonth(d.getMonth() + months);
  return d.toISOString().slice(0, 10);
}

function certStatusBadge(status: CertificateStatus | undefined) {
  if (!status) return null;
  const map = {
    Valid: {
      label: "Valid",
      cls: "bg-primary/20 text-primary border-primary/30",
    },
    ExpiringSoon: {
      label: "Expiring Soon",
      cls: "bg-secondary/20 text-secondary border-secondary/30",
    },
    Expired: {
      label: "Expired",
      cls: "bg-destructive/20 text-destructive border-destructive/30",
    },
  };
  const { label, cls } = map[status];
  return (
    <span
      className={`inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-semibold ${cls}`}
    >
      {label}
    </span>
  );
}

function trainingAttendeePresent(attendees: TrainingAttendeeView[]): number {
  return attendees.filter((a) => a.attendance === AttendanceStatus.Present)
    .length;
}

function trainingOverallCertStatus(t: TrainingView): CertificateStatus | null {
  const statuses = t.attendees
    .map((a) => a.certStatus)
    .filter(Boolean) as CertificateStatus[];
  if (statuses.includes(CertificateStatus.Expired))
    return CertificateStatus.Expired;
  if (statuses.includes(CertificateStatus.ExpiringSoon))
    return CertificateStatus.ExpiringSoon;
  if (statuses.length > 0) return CertificateStatus.Valid;
  return null;
}

// ─── Create Training Dialog ──────────────────────────────────
interface CreateTrainingDialogProps {
  open: boolean;
  onClose: () => void;
  employees: EmployeeView[];
}

function CreateTrainingDialog({
  open,
  onClose,
  employees,
}: CreateTrainingDialogProps) {
  const { actor, token } = useBackend();
  const { user } = useAuth();
  const qc = useQueryClient();

  const [name, setName] = useState("");
  const [type, setType] = useState<TrainingType>(TrainingType.Induction);
  const [frequency, setFrequency] = useState<TrainingFrequency>(
    TrainingFrequency.Annual,
  );
  const [trainingDate, setTrainingDate] = useState("");
  const [trainer, setTrainer] = useState("");
  const [dept, setDept] = useState("");
  const [attendeeSearch, setAttendeeSearch] = useState("");
  const [selectedCodes, setSelectedCodes] = useState<string[]>([]);

  const expiryPreview = trainingDate
    ? calcExpiryDate(trainingDate, frequency)
    : "—";

  const filteredEmployees = useMemo(() => {
    const q = attendeeSearch.toLowerCase();
    return employees.filter(
      (e) =>
        e.fullName.toLowerCase().includes(q) ||
        e.empCode.toLowerCase().includes(q) ||
        e.department.toLowerCase().includes(q),
    );
  }, [employees, attendeeSearch]);

  const toggleAttendee = (code: string) =>
    setSelectedCodes((prev) =>
      prev.includes(code) ? prev.filter((c) => c !== code) : [...prev, code],
    );

  const mutation = useMutation({
    mutationFn: async () => {
      if (!actor || !token) throw new Error("Not authenticated");
      const res = await actor.createTraining(token, {
        name: name.trim(),
        trainingType: type,
        frequency,
        trainingDate,
        trainer: trainer.trim(),
        department: dept.trim() || (user?.department ?? ""),
        attendeeCodes: selectedCodes,
      });
      if (res.__kind__ === "err") throw new Error(res.err);
      return res.ok;
    },
    onSuccess: () => {
      toast.success("Training created successfully");
      qc.invalidateQueries({ queryKey: ["trainings"] });
      onClose();
      resetForm();
    },
    onError: (e: Error) => toast.error(e.message),
  });

  function resetForm() {
    setName("");
    setType(TrainingType.Induction);
    setFrequency(TrainingFrequency.Annual);
    setTrainingDate("");
    setTrainer("");
    setDept("");
    setSelectedCodes([]);
    setAttendeeSearch("");
  }

  const canSubmit =
    name.trim() && trainingDate && trainer.trim() && selectedCodes.length > 0;

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent
        className="max-w-2xl bg-card border-border max-h-[90vh] overflow-y-auto"
        data-ocid="training.dialog"
      >
        <DialogHeader>
          <DialogTitle className="text-foreground flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-primary" />
            Create New Training
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Row 1: Name */}
          <div className="space-y-1.5">
            <Label htmlFor="t-name" className="text-foreground">
              Training Name *
            </Label>
            <Input
              id="t-name"
              placeholder="e.g. Fire Safety Induction"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="bg-background border-border"
              data-ocid="training.name_input"
            />
          </div>

          {/* Row 2: Type + Frequency */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label className="text-foreground">Training Type *</Label>
              <Select
                value={type}
                onValueChange={(v) => setType(v as TrainingType)}
              >
                <SelectTrigger
                  className="bg-background border-border"
                  data-ocid="training.type_select"
                >
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-card border-border">
                  {Object.values(TrainingType).map((t) => (
                    <SelectItem key={t} value={t}>
                      {TRAINING_TYPE_LABELS[t]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label className="text-foreground">Frequency *</Label>
              <Select
                value={frequency}
                onValueChange={(v) => setFrequency(v as TrainingFrequency)}
              >
                <SelectTrigger
                  className="bg-background border-border"
                  data-ocid="training.frequency_select"
                >
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-card border-border">
                  {Object.values(TrainingFrequency).map((f) => (
                    <SelectItem key={f} value={f}>
                      {FREQUENCY_LABELS[f]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Row 3: Date + Expiry preview */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="t-date" className="text-foreground">
                Training Date *
              </Label>
              <Input
                id="t-date"
                type="date"
                value={trainingDate}
                onChange={(e) => setTrainingDate(e.target.value)}
                className="bg-background border-border"
                data-ocid="training.date_input"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-foreground">Auto-calculated Expiry</Label>
              <div className="flex h-10 items-center rounded-md border border-border bg-muted/40 px-3 text-sm text-muted-foreground font-mono">
                {expiryPreview}
              </div>
            </div>
          </div>

          {/* Row 4: Trainer + Department */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="t-trainer" className="text-foreground">
                Trainer / Facilitator *
              </Label>
              <Input
                id="t-trainer"
                placeholder="Trainer name"
                value={trainer}
                onChange={(e) => setTrainer(e.target.value)}
                className="bg-background border-border"
                data-ocid="training.trainer_input"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="t-dept" className="text-foreground">
                Department
              </Label>
              <Input
                id="t-dept"
                placeholder="Defaults to your dept"
                value={dept}
                onChange={(e) => setDept(e.target.value)}
                className="bg-background border-border"
                data-ocid="training.dept_input"
              />
            </div>
          </div>

          {/* Attendees multi-select */}
          <div className="space-y-1.5">
            <Label className="text-foreground">
              Attendees * ({selectedCodes.length} selected)
            </Label>
            <Input
              placeholder="Search employees…"
              value={attendeeSearch}
              onChange={(e) => setAttendeeSearch(e.target.value)}
              className="bg-background border-border mb-2"
              data-ocid="training.attendee_search"
            />
            <div className="max-h-40 overflow-y-auto rounded-lg border border-border divide-y divide-border">
              {filteredEmployees.length === 0 && (
                <p className="p-3 text-sm text-muted-foreground text-center">
                  No employees found
                </p>
              )}
              {filteredEmployees.map((emp) => {
                const sel = selectedCodes.includes(emp.empCode);
                return (
                  <button
                    key={emp.empCode}
                    type="button"
                    onClick={() => toggleAttendee(emp.empCode)}
                    className={`w-full flex items-center gap-3 px-3 py-2 text-left text-sm transition-colors hover:bg-muted/40 ${
                      sel ? "bg-primary/10" : ""
                    }`}
                  >
                    <div
                      className={`w-4 h-4 rounded border flex-shrink-0 flex items-center justify-center ${
                        sel ? "bg-primary border-primary" : "border-border"
                      }`}
                    >
                      {sel && (
                        <CheckCircle className="w-3 h-3 text-primary-foreground" />
                      )}
                    </div>
                    <span className="font-medium text-foreground">
                      {emp.fullName}
                    </span>
                    <span className="text-muted-foreground">·</span>
                    <span className="text-muted-foreground text-xs">
                      {emp.empCode}
                    </span>
                    <span className="ml-auto text-muted-foreground text-xs">
                      {emp.department}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        <DialogFooter className="gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            className="border-border"
            data-ocid="training.cancel_button"
          >
            Cancel
          </Button>
          <Button
            type="button"
            disabled={!canSubmit || mutation.isPending}
            onClick={() => mutation.mutate()}
            data-ocid="training.submit_button"
          >
            {mutation.isPending ? "Creating…" : "Create Training"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ─── Attendance / Detail Dialog ──────────────────────────────
interface TrainingDetailDialogProps {
  training: TrainingView | null;
  onClose: () => void;
}

function TrainingDetailDialog({
  training,
  onClose,
}: TrainingDetailDialogProps) {
  const { actor, token } = useBackend();
  const qc = useQueryClient();

  const [certModal, setCertModal] = useState<CertificateTemplateProps | null>(
    null,
  );
  const [downloadingAll, setDownloadingAll] = useState(false);

  function buildCertProps(
    att: TrainingAttendeeView,
  ): CertificateTemplateProps | null {
    if (!att.certificateId || !training) return null;
    return {
      employeeName: att.empName,
      employeeCode: att.empCode,
      trainingName: training.name,
      certificateId: att.certificateId,
      issueDate: training.trainingDate,
      expiryDate:
        att.expiryDate ??
        calcExpiryDate(training.trainingDate, training.frequency),
      certStatus: att.certStatus as
        | "Valid"
        | "ExpiringSoon"
        | "Expired"
        | undefined,
    };
  }

  async function handleDownloadAll() {
    if (!training) return;
    const { generateCertificatePdf } = await import(
      "../utils/certificateGenerator"
    );
    setDownloadingAll(true);
    const presentWithCerts = training.attendees.filter(
      (a) => a.attendance === AttendanceStatus.Present && a.certificateId,
    );
    for (const att of presentWithCerts) {
      const container = document.createElement("div");
      container.style.cssText = "position:fixed;left:-9999px;top:0;";
      document.body.appendChild(container);
      const { default: ReactDOM } = await import("react-dom/client");
      const CertTplMod = await import(
        "../components/training/CertificateTemplate"
      );
      const CertTpl = CertTplMod.default;
      const props = buildCertProps(att);
      if (!props) {
        document.body.removeChild(container);
        continue;
      }
      await new Promise<void>((resolve) => {
        const root = ReactDOM.createRoot(container);
        root.render(React.createElement(CertTpl, props));
        setTimeout(async () => {
          const el = container.firstChild as HTMLElement | null;
          if (el) {
            const fn = `${att.certificateId}-${att.empCode}`
              .replace(/[^a-zA-Z0-9_-]/g, "-")
              .toLowerCase();
            await generateCertificatePdf(el, fn);
          }
          root.unmount();
          document.body.removeChild(container);
          resolve();
        }, 300);
      });
    }
    setDownloadingAll(false);
  }

  const attendanceMutation = useMutation({
    mutationFn: async ({
      empCode,
      attendance,
    }: { empCode: string; attendance: AttendanceStatus }) => {
      if (!actor || !token || !training) throw new Error("Not ready");
      const res = await actor.markAttendance(
        token,
        training.trainingId,
        empCode,
        attendance,
      );
      if (res.__kind__ === "err") throw new Error(res.err);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["trainings"] });
      qc.invalidateQueries({ queryKey: ["training", training?.trainingId] });
      toast.success("Attendance updated");
    },
    onError: (e: Error) => toast.error(e.message),
  });

  if (!training) return null;

  const expiry = calcExpiryDate(training.trainingDate, training.frequency);
  const presentCount = trainingAttendeePresent(training.attendees);

  return (
    <>
      <Dialog open={!!training} onOpenChange={(v) => !v && onClose()}>
        <DialogContent
          className="max-w-3xl bg-card border-border max-h-[90vh] overflow-y-auto"
          data-ocid="training.detail.dialog"
        >
          <DialogHeader>
            <div className="flex items-start justify-between gap-4">
              <div>
                <DialogTitle className="text-foreground text-xl">
                  {training.name}
                </DialogTitle>
                <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                  <span
                    className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold ${
                      TYPE_COLORS[training.trainingType]
                    }`}
                  >
                    {TRAINING_TYPE_LABELS[training.trainingType]}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {FREQUENCY_LABELS[training.frequency]}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    &middot;
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {training.department}
                  </span>
                </div>
              </div>
              {training.attendees.some(
                (a) =>
                  a.attendance === AttendanceStatus.Present && a.certificateId,
              ) && (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleDownloadAll}
                  disabled={downloadingAll}
                  className="flex-shrink-0 gap-1.5 border-border"
                  data-ocid="training.detail.download_all_button"
                >
                  {downloadingAll ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      Generating&hellip;
                    </>
                  ) : (
                    <>
                      <Download className="w-3.5 h-3.5" />
                      Download All Certs
                    </>
                  )}
                </Button>
              )}
            </div>
          </DialogHeader>

          {/* Meta info */}
          <div className="grid grid-cols-3 gap-4">
            {[
              { label: "Training Date", value: training.trainingDate },
              { label: "Expiry Date", value: expiry },
              { label: "Trainer", value: training.trainer },
            ].map(({ label, value }) => (
              <div key={label} className="bg-muted/30 rounded-lg p-3">
                <p className="text-xs text-muted-foreground mb-0.5">{label}</p>
                <p className="text-sm font-semibold text-foreground font-mono">
                  {value}
                </p>
              </div>
            ))}
          </div>

          {/* Attendance summary */}
          <div className="flex items-center gap-6 py-2 border-y border-border">
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm text-foreground font-medium">
                {training.attendees.length} attendees
              </span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-primary" />
              <span className="text-sm text-foreground">
                {presentCount} present
              </span>
            </div>
            <div className="flex items-center gap-2">
              <XCircle className="w-4 h-4 text-destructive" />
              <span className="text-sm text-foreground">
                {training.attendees.length - presentCount} absent
              </span>
            </div>
          </div>

          {/* Attendee rows */}
          <div className="space-y-2" data-ocid="training.detail.attendee_list">
            {training.attendees.length === 0 && (
              <div
                className="text-center py-8 text-muted-foreground text-sm"
                data-ocid="training.detail.empty_state"
              >
                No attendees assigned to this training
              </div>
            )}
            {training.attendees.map((att, idx) => (
              <div
                key={att.empCode}
                className="flex items-center gap-3 rounded-lg border border-border bg-background px-4 py-3"
                data-ocid={`training.detail.attendee.${idx + 1}`}
              >
                {/* Attendance toggle */}
                <button
                  type="button"
                  onClick={() =>
                    attendanceMutation.mutate({
                      empCode: att.empCode,
                      attendance:
                        att.attendance === AttendanceStatus.Present
                          ? AttendanceStatus.Absent
                          : AttendanceStatus.Present,
                    })
                  }
                  className={`flex-shrink-0 w-8 h-8 rounded-full border-2 flex items-center justify-center transition-smooth ${
                    att.attendance === AttendanceStatus.Present
                      ? "bg-primary/20 border-primary"
                      : "border-border hover:border-primary/50"
                  }`}
                  aria-label={`Toggle attendance for ${att.empName}`}
                  data-ocid={`training.detail.attendance_toggle.${idx + 1}`}
                >
                  {att.attendance === AttendanceStatus.Present && (
                    <CheckCircle className="w-4 h-4 text-primary" />
                  )}
                </button>

                {/* Name + code */}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">
                    {att.empName}
                  </p>
                  <p className="text-xs text-muted-foreground font-mono">
                    {att.empCode}
                  </p>
                </div>

                {/* Attendance status badge */}
                <span
                  className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                    att.attendance === AttendanceStatus.Present
                      ? "bg-primary/15 text-primary"
                      : "bg-muted text-muted-foreground"
                  }`}
                >
                  {att.attendance}
                </span>

                {/* Certificate section */}
                {att.certificateId ? (
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <div className="text-right min-w-0">
                      <button
                        type="button"
                        onClick={() => {
                          const p = buildCertProps(att);
                          if (p) setCertModal(p);
                        }}
                        className="flex items-center gap-1.5 hover:opacity-75 transition-smooth"
                        aria-label="View certificate"
                        data-ocid={`training.detail.view_cert.${idx + 1}`}
                      >
                        <Award className="w-3.5 h-3.5 text-secondary flex-shrink-0" />
                        <span className="text-xs font-mono text-secondary underline-offset-2 hover:underline truncate max-w-[140px]">
                          {att.certificateId}
                        </span>
                      </button>
                      {att.certStatus && certStatusBadge(att.certStatus)}
                    </div>
                    {/* Quick download */}
                    <button
                      type="button"
                      onClick={async () => {
                        const p = buildCertProps(att);
                        if (!p) return;
                        const { generateCertificatePdf } = await import(
                          "../utils/certificateGenerator"
                        );
                        const container = document.createElement("div");
                        container.style.cssText =
                          "position:fixed;left:-9999px;top:0;";
                        document.body.appendChild(container);
                        const { default: ReactDOM } = await import(
                          "react-dom/client"
                        );
                        const CertTplMod = await import(
                          "../components/training/CertificateTemplate"
                        );
                        const CertTpl = CertTplMod.default;
                        const root = ReactDOM.createRoot(container);
                        root.render(React.createElement(CertTpl, p));
                        await new Promise<void>((res) =>
                          setTimeout(async () => {
                            const el =
                              container.firstChild as HTMLElement | null;
                            if (el) {
                              const fn = `${att.certificateId}-${att.empCode}`
                                .replace(/[^a-zA-Z0-9_-]/g, "-")
                                .toLowerCase();
                              await generateCertificatePdf(el, fn);
                            }
                            root.unmount();
                            document.body.removeChild(container);
                            res();
                          }, 300),
                        );
                      }}
                      className="p-1.5 rounded hover:bg-muted/60 transition-smooth text-muted-foreground hover:text-foreground"
                      aria-label="Download certificate PDF"
                      data-ocid={`training.detail.download_cert.${idx + 1}`}
                    >
                      <Download className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ) : (
                  <span className="text-xs text-muted-foreground italic">
                    No cert
                  </span>
                )}
              </div>
            ))}
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="border-border"
              data-ocid="training.detail.close_button"
            >
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Certificate modal — rendered outside Dialog to avoid z-index issues */}
      {certModal && (
        <CertificateModal
          open
          onClose={() => setCertModal(null)}
          {...certModal}
        />
      )}
    </>
  );
}

// ─── Main Page ───────────────────────────────────────────────
export default function TrainingPage() {
  const { actor, token, isReady } = useBackend();
  const { user } = useAuth();

  const [showCreate, setShowCreate] = useState(false);
  const [selectedTraining, setSelectedTraining] = useState<TrainingView | null>(
    null,
  );

  // Filters
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState<TrainingType | "ALL">("ALL");
  const [filterCertStatus, setFilterCertStatus] = useState<
    CertificateStatus | "ALL"
  >("ALL");
  const [filterDept, setFilterDept] = useState("");

  // Fetch trainings
  const { data: trainings, isLoading: trainingsLoading } = useQuery({
    queryKey: ["trainings", filterType, filterDept],
    queryFn: async () => {
      if (!actor || !token) return [];
      const res = await actor.listTrainings(
        token,
        filterDept || null,
        filterType !== "ALL" ? filterType : null,
      );
      if (res.__kind__ === "err") throw new Error(res.err);
      return res.ok;
    },
    enabled: isReady,
  });

  // Fetch employees for create form
  const { data: employees } = useQuery({
    queryKey: ["employees", "all"],
    queryFn: async () => {
      if (!actor || !token) return [];
      const res = await actor.listEmployees(token, null, null, null, null);
      if (res.__kind__ === "err") throw new Error(res.err);
      return res.ok;
    },
    enabled: isReady,
  });

  // Fetch KPI summary for compliance %
  const { data: kpi } = useQuery({
    queryKey: ["kpi", user?.department ?? null],
    queryFn: async () => {
      if (!actor || !token) return null;
      const res = await actor.getKPISummary(token, null);
      if (res.__kind__ === "err") throw new Error(res.err);
      return res.ok;
    },
    enabled: isReady,
  });

  // Derived lists
  const departments = useMemo(() => {
    const set = new Set(
      (trainings ?? []).map((t) => t.department).filter(Boolean),
    );
    return Array.from(set).sort();
  }, [trainings]);

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return (trainings ?? []).filter((t) => {
      const matchSearch =
        !search ||
        t.name.toLowerCase().includes(q) ||
        t.trainer.toLowerCase().includes(q) ||
        t.department.toLowerCase().includes(q);
      const overallCert = trainingOverallCertStatus(t);
      const matchCert =
        filterCertStatus === "ALL" || overallCert === filterCertStatus;
      return matchSearch && matchCert;
    });
  }, [trainings, search, filterCertStatus]);

  const canCreate =
    user?.role === "SystemAdmin" ||
    user?.role === "SafetyOfficer" ||
    user?.role === "HOD";

  const compliancePct = kpi ? Math.round(kpi.trainingCompliancePct) : null;

  return (
    <div className="space-y-6" data-ocid="training.page">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="section-header flex items-center gap-2 mb-1">
            <BookOpen className="w-6 h-6 text-primary" />
            Training &amp; Compliance
          </h1>
          <p className="text-sm text-muted-foreground">
            Manage employee training records, attendance, and certificates
          </p>
        </div>
        {canCreate && (
          <Button
            onClick={() => setShowCreate(true)}
            className="gap-2"
            data-ocid="training.create_button"
          >
            <Plus className="w-4 h-4" />
            New Training
          </Button>
        )}
      </div>

      {/* Stat card — Compliance */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div
          className="elevated-card rounded-xl p-5 flex items-center gap-4"
          data-ocid="training.compliance_card"
        >
          <div
            className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 ${
              compliancePct === null
                ? "bg-muted"
                : compliancePct >= 80
                  ? "bg-primary/20"
                  : compliancePct >= 50
                    ? "bg-secondary/20"
                    : "bg-destructive/20"
            }`}
          >
            <Award
              className={`w-6 h-6 ${
                compliancePct === null
                  ? "text-muted-foreground"
                  : compliancePct >= 80
                    ? "text-primary"
                    : compliancePct >= 50
                      ? "text-secondary"
                      : "text-destructive"
              }`}
            />
          </div>
          <div>
            <p className="stat-label">Training Compliance</p>
            <p className="stat-value">
              {compliancePct === null ? "—" : `${compliancePct}%`}
            </p>
          </div>
        </div>

        <div
          className="elevated-card rounded-xl p-5 flex items-center gap-4"
          data-ocid="training.total_card"
        >
          <div className="w-12 h-12 rounded-full bg-chart-4/20 flex items-center justify-center flex-shrink-0">
            <BookOpen className="w-6 h-6 text-chart-4" />
          </div>
          <div>
            <p className="stat-label">Total Trainings</p>
            <p className="stat-value">{trainings?.length ?? "—"}</p>
          </div>
        </div>

        <div
          className="elevated-card rounded-xl p-5 flex items-center gap-4"
          data-ocid="training.valid_certs_card"
        >
          <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
            <CheckCircle className="w-6 h-6 text-primary" />
          </div>
          <div>
            <p className="stat-label">Valid Certificates</p>
            <p className="stat-value">
              {trainings
                ? trainings
                    .flatMap((t) => t.attendees)
                    .filter((a) => a.certStatus === CertificateStatus.Valid)
                    .length
                : "—"}
            </p>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="elevated-card rounded-xl p-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search trainings…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 bg-background border-border"
              data-ocid="training.search_input"
            />
          </div>

          <Select
            value={filterType}
            onValueChange={(v) => setFilterType(v as TrainingType | "ALL")}
          >
            <SelectTrigger
              className="bg-background border-border"
              data-ocid="training.filter_type_select"
            >
              <SelectValue placeholder="All Types" />
            </SelectTrigger>
            <SelectContent className="bg-card border-border">
              <SelectItem value="ALL">All Types</SelectItem>
              {Object.values(TrainingType).map((t) => (
                <SelectItem key={t} value={t}>
                  {TRAINING_TYPE_LABELS[t]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={filterCertStatus}
            onValueChange={(v) =>
              setFilterCertStatus(v as CertificateStatus | "ALL")
            }
          >
            <SelectTrigger
              className="bg-background border-border"
              data-ocid="training.filter_cert_select"
            >
              <SelectValue placeholder="All Cert Status" />
            </SelectTrigger>
            <SelectContent className="bg-card border-border">
              <SelectItem value="ALL">All Cert Status</SelectItem>
              <SelectItem value={CertificateStatus.Valid}>Valid</SelectItem>
              <SelectItem value={CertificateStatus.ExpiringSoon}>
                Expiring Soon
              </SelectItem>
              <SelectItem value={CertificateStatus.Expired}>Expired</SelectItem>
            </SelectContent>
          </Select>

          <Select
            value={filterDept || "ALL"}
            onValueChange={(v) => setFilterDept(v === "ALL" ? "" : v)}
          >
            <SelectTrigger
              className="bg-background border-border"
              data-ocid="training.filter_dept_select"
            >
              <SelectValue placeholder="All Departments" />
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
      </div>

      {/* Training list */}
      {trainingsLoading ? (
        <div className="space-y-3" data-ocid="training.loading_state">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-24 rounded-xl bg-muted/40" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div
          className="elevated-card rounded-xl p-12 flex flex-col items-center justify-center gap-3"
          data-ocid="training.empty_state"
        >
          <BookOpen className="w-10 h-10 text-muted-foreground" />
          <p className="text-foreground font-medium">No trainings found</p>
          <p className="text-sm text-muted-foreground">
            {search ||
            filterType !== "ALL" ||
            filterCertStatus !== "ALL" ||
            filterDept
              ? "Try adjusting your filters"
              : canCreate
                ? "Create the first training to get started"
                : "No training records yet"}
          </p>
          {canCreate &&
            !search &&
            filterType === "ALL" &&
            filterCertStatus === "ALL" &&
            !filterDept && (
              <Button
                onClick={() => setShowCreate(true)}
                className="mt-2 gap-2"
                data-ocid="training.empty_create_button"
              >
                <Plus className="w-4 h-4" /> New Training
              </Button>
            )}
        </div>
      ) : (
        <div className="space-y-3" data-ocid="training.list">
          {filtered.map((t, idx) => {
            const presentCount = trainingAttendeePresent(t.attendees);
            const overallCert = trainingOverallCertStatus(t);
            const expiry = calcExpiryDate(t.trainingDate, t.frequency);
            return (
              <button
                key={t.trainingId}
                type="button"
                onClick={() => setSelectedTraining(t)}
                className="w-full text-left elevated-card rounded-xl p-4 hover:border-primary/40 transition-smooth"
                data-ocid={`training.item.${idx + 1}`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <h3 className="text-base font-semibold text-foreground truncate">
                        {t.name}
                      </h3>
                      <span
                        className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold ${
                          TYPE_COLORS[t.trainingType]
                        }`}
                      >
                        {TRAINING_TYPE_LABELS[t.trainingType]}
                      </span>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground flex-wrap">
                      <span>
                        Trainer:{" "}
                        <span className="text-foreground">{t.trainer}</span>
                      </span>
                      <span>
                        Dept:{" "}
                        <span className="text-foreground">{t.department}</span>
                      </span>
                      <span className="flex items-center gap-1">
                        <Users className="w-3.5 h-3.5" />
                        <span>
                          {presentCount}/{t.attendees.length} present
                        </span>
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-col items-end gap-2 flex-shrink-0">
                    {overallCert && certStatusBadge(overallCert)}
                    <div className="flex items-center gap-3 text-xs text-muted-foreground">
                      <span className="font-mono">
                        <span className="text-muted-foreground">Date: </span>
                        <span className="text-foreground">
                          {t.trainingDate}
                        </span>
                      </span>
                      {expiry !== "—" && (
                        <span className="font-mono">
                          <span className="text-muted-foreground">Exp: </span>
                          <span
                            className={`${
                              new Date(expiry) < new Date()
                                ? "text-destructive"
                                : new Date(expiry) <
                                    new Date(Date.now() + 30 * 86400_000)
                                  ? "text-secondary"
                                  : "text-foreground"
                            }`}
                          >
                            {expiry}
                          </span>
                        </span>
                      )}
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {FREQUENCY_LABELS[t.frequency]}
                    </span>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      )}

      {/* Dialogs */}
      <CreateTrainingDialog
        open={showCreate}
        onClose={() => setShowCreate(false)}
        employees={employees ?? []}
      />
      <TrainingDetailDialog
        training={selectedTraining}
        onClose={() => setSelectedTraining(null)}
      />
    </div>
  );
}
