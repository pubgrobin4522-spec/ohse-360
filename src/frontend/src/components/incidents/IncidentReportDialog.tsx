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
import { Textarea } from "@/components/ui/textarea";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";
import {
  type CreateIncidentInput,
  IncidentType,
  type IncidentView,
} from "../../backend";

type Severity = "Low" | "Medium" | "High" | "Critical";
import { DEPARTMENTS, LOCATIONS } from "../../constants/locations";
import { useAuth } from "../../hooks/useAuth";
import { useBackend } from "../../hooks/useBackend";
import { formatIncidentType } from "../../pages/IncidentsPage";

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
  "Other",
];

interface Props {
  open: boolean;
  onClose: () => void;
  onCreated: (inc: IncidentView) => void;
}

interface FormErrors {
  incidentType?: string;
  severity?: string;
  location?: string;
  department?: string;
  description?: string;
  incidentDate?: string;
  injuredPersonCode?: string;
  rootCauseCategory?: string;
  rootCauseFreeText?: string;
  correctiveAction?: string;
  capaActionOwnerId?: string;
  capaDeadline?: string;
}

interface FormState {
  incidentType: IncidentType | "";
  severity: Severity | "";
  location: string;
  department: string;
  description: string;
  incidentDate: string;
  injuredPersonCode: string;
  rootCauseCategory: string;
  rootCauseFreeText: string;
  correctiveAction: string;
  capaActionOwnerId: string;
  capaDeadline: string;
}

const EMPTY: FormState = {
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
  capaDeadline: "",
};

export function IncidentReportDialog({ open, onClose, onCreated }: Props) {
  const { actor, token } = useBackend();
  const { user } = useAuth();
  const [form, setForm] = useState<FormState>(EMPTY);
  const [errors, setErrors] = useState<FormErrors>({});

  const set = (key: keyof FormState, val: string) =>
    setForm((prev) => ({ ...prev, [key]: val }));

  const validate = (): boolean => {
    const e: FormErrors = {};
    if (!form.incidentType) e.incidentType = "Required";
    if (!form.severity) e.severity = "Required";
    if (!form.location.trim()) e.location = "Required";
    if (!form.department.trim()) e.department = "Required";
    if (!form.description.trim()) e.description = "Required";
    if (!form.incidentDate) e.incidentDate = "Required";
    if (!form.rootCauseCategory) e.rootCauseCategory = "Required";
    if (!form.correctiveAction.trim()) e.correctiveAction = "Required";
    if (
      !form.capaActionOwnerId.trim() ||
      Number.isNaN(Number(form.capaActionOwnerId))
    )
      e.capaActionOwnerId = "Valid numeric Employee ID required";
    if (!form.capaDeadline) e.capaDeadline = "Required";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const mutation = useMutation({
    mutationFn: async () => {
      if (!actor || !token) throw new Error("Not authenticated");
      const input: CreateIncidentInput = {
        incidentType: form.incidentType as IncidentType,
        severity: form.severity as Severity,
        location: form.location,
        department: form.department,
        description: form.description,
        incidentDate: form.incidentDate,
        injuredPersonCode: form.injuredPersonCode || undefined,
        capaActionOwnerId: BigInt(form.capaActionOwnerId),
        capaDeadline: form.capaDeadline,
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
    onError: (e: Error) => toast.error(e.message),
  });

  const handleSubmit = () => {
    if (validate()) mutation.mutate();
  };

  const handleClose = () => {
    setForm(EMPTY);
    setErrors({});
    onClose();
  };

  const today = new Date().toISOString().slice(0, 16);

  return (
    <Dialog open={open} onOpenChange={(o) => !o && handleClose()}>
      <DialogContent
        className="max-w-2xl max-h-[90vh] overflow-y-auto bg-card border-border"
        data-ocid="incidents.dialog"
      >
        <DialogHeader>
          <DialogTitle className="text-foreground text-xl font-bold flex items-center gap-2">
            Report New Incident
          </DialogTitle>
          {user && (
            <p className="text-muted-foreground text-sm">
              Reported by: <span className="text-foreground">{user.name}</span>{" "}
              · {user.department}
            </p>
          )}
        </DialogHeader>

        <div className="space-y-5 py-2">
          {/* Row 1: Type + Severity */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label>
                Incident Type <span className="text-destructive">*</span>
              </Label>
              <Select
                value={form.incidentType}
                onValueChange={(v) => set("incidentType", v)}
              >
                <SelectTrigger
                  data-ocid="incidents.type_select"
                  className={errors.incidentType ? "border-destructive" : ""}
                >
                  <SelectValue placeholder="Select type…" />
                </SelectTrigger>
                <SelectContent>
                  {Object.values(IncidentType).map((t) => (
                    <SelectItem key={t} value={t}>
                      {formatIncidentType(t)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.incidentType && (
                <p
                  className="text-destructive text-xs"
                  data-ocid="incidents.type.field_error"
                >
                  {errors.incidentType}
                </p>
              )}
            </div>
            <div className="space-y-1.5">
              <Label>
                Severity <span className="text-destructive">*</span>
              </Label>
              <Select
                value={form.severity}
                onValueChange={(v) => set("severity", v)}
              >
                <SelectTrigger
                  data-ocid="incidents.severity_select"
                  className={errors.severity ? "border-destructive" : ""}
                >
                  <SelectValue placeholder="Select severity…" />
                </SelectTrigger>
                <SelectContent>
                  {(["Low", "Medium", "High", "Critical"] as Severity[]).map(
                    (s) => (
                      <SelectItem key={s as string} value={s as string}>
                        {s as string}
                      </SelectItem>
                    ),
                  )}
                </SelectContent>
              </Select>
              {errors.severity && (
                <p
                  className="text-destructive text-xs"
                  data-ocid="incidents.severity.field_error"
                >
                  {errors.severity}
                </p>
              )}
            </div>
          </div>

          {/* Row 2: Location + Department */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label>
                Location <span className="text-destructive">*</span>
              </Label>
              <Select
                value={form.location}
                onValueChange={(v) => set("location", v)}
              >
                <SelectTrigger
                  data-ocid="incidents.location_input"
                  className={errors.location ? "border-destructive" : ""}
                >
                  <SelectValue placeholder="Select Location" />
                </SelectTrigger>
                <SelectContent>
                  {LOCATIONS.map((l) => (
                    <SelectItem key={l} value={l}>
                      {l}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.location && (
                <p
                  className="text-destructive text-xs"
                  data-ocid="incidents.location.field_error"
                >
                  {errors.location}
                </p>
              )}
            </div>
            <div className="space-y-1.5">
              <Label>
                Department <span className="text-destructive">*</span>
              </Label>
              <Select
                value={form.department}
                onValueChange={(v) => set("department", v)}
              >
                <SelectTrigger
                  data-ocid="incidents.department_input"
                  className={errors.department ? "border-destructive" : ""}
                >
                  <SelectValue placeholder="Select Department" />
                </SelectTrigger>
                <SelectContent>
                  {DEPARTMENTS.map((d) => (
                    <SelectItem key={d} value={d}>
                      {d}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.department && (
                <p
                  className="text-destructive text-xs"
                  data-ocid="incidents.department.field_error"
                >
                  {errors.department}
                </p>
              )}
            </div>
          </div>

          {/* Row 3: Incident Date/Time + Injured Person */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label>
                Incident Date & Time <span className="text-destructive">*</span>
              </Label>
              <Input
                type="datetime-local"
                max={today}
                value={form.incidentDate}
                onChange={(e) => set("incidentDate", e.target.value)}
                data-ocid="incidents.date_input"
                className={errors.incidentDate ? "border-destructive" : ""}
              />
              {errors.incidentDate && (
                <p
                  className="text-destructive text-xs"
                  data-ocid="incidents.date.field_error"
                >
                  {errors.incidentDate}
                </p>
              )}
            </div>
            <div className="space-y-1.5">
              <Label>
                Injured Person Employee Code{" "}
                <span className="text-muted-foreground text-xs">
                  (optional)
                </span>
              </Label>
              <Input
                placeholder="e.g. EMP-0023"
                value={form.injuredPersonCode}
                onChange={(e) => set("injuredPersonCode", e.target.value)}
                data-ocid="incidents.injured_input"
              />
            </div>
          </div>

          {/* Description */}
          <div className="space-y-1.5">
            <Label>
              Description <span className="text-destructive">*</span>
            </Label>
            <Textarea
              placeholder="Describe what happened in detail…"
              rows={3}
              value={form.description}
              onChange={(e) => set("description", e.target.value)}
              data-ocid="incidents.description_textarea"
              className={errors.description ? "border-destructive" : ""}
            />
            {errors.description && (
              <p
                className="text-destructive text-xs"
                data-ocid="incidents.description.field_error"
              >
                {errors.description}
              </p>
            )}
          </div>

          {/* Root Cause */}
          <div className="space-y-1.5">
            <Label>
              Root Cause Category <span className="text-destructive">*</span>
            </Label>
            <Select
              value={form.rootCauseCategory}
              onValueChange={(v) => set("rootCauseCategory", v)}
            >
              <SelectTrigger
                data-ocid="incidents.root_cause_select"
                className={errors.rootCauseCategory ? "border-destructive" : ""}
              >
                <SelectValue placeholder="Select root cause…" />
              </SelectTrigger>
              <SelectContent>
                {ROOT_CAUSE_CATEGORIES.map((c) => (
                  <SelectItem key={c} value={c}>
                    {c}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.rootCauseCategory && (
              <p
                className="text-destructive text-xs"
                data-ocid="incidents.root_cause.field_error"
              >
                {errors.rootCauseCategory}
              </p>
            )}
          </div>
          <div className="space-y-1.5">
            <Label>
              Root Cause Details{" "}
              <span className="text-muted-foreground text-xs">
                (optional free text)
              </span>
            </Label>
            <Textarea
              placeholder="Additional details about the root cause…"
              rows={2}
              value={form.rootCauseFreeText}
              onChange={(e) => set("rootCauseFreeText", e.target.value)}
              data-ocid="incidents.root_cause_detail_textarea"
            />
          </div>

          {/* Corrective Action */}
          <div className="space-y-1.5">
            <Label>
              Immediate Corrective Action{" "}
              <span className="text-destructive">*</span>
            </Label>
            <Textarea
              placeholder="What immediate steps were taken?"
              rows={2}
              value={form.correctiveAction}
              onChange={(e) => set("correctiveAction", e.target.value)}
              data-ocid="incidents.corrective_action_textarea"
              className={errors.correctiveAction ? "border-destructive" : ""}
            />
            {errors.correctiveAction && (
              <p
                className="text-destructive text-xs"
                data-ocid="incidents.corrective_action.field_error"
              >
                {errors.correctiveAction}
              </p>
            )}
          </div>

          {/* CAPA section */}
          <div className="bg-muted/20 border border-border/60 rounded-lg p-4 space-y-4">
            <h3 className="text-sm font-semibold text-foreground uppercase tracking-wide">
              CAPA Assignment
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label>
                  Action Owner (Employee ID){" "}
                  <span className="text-destructive">*</span>
                </Label>
                <Input
                  placeholder="e.g. 100042"
                  value={form.capaActionOwnerId}
                  onChange={(e) => set("capaActionOwnerId", e.target.value)}
                  data-ocid="incidents.capa_owner_input"
                  className={
                    errors.capaActionOwnerId ? "border-destructive" : ""
                  }
                />
                {errors.capaActionOwnerId && (
                  <p
                    className="text-destructive text-xs"
                    data-ocid="incidents.capa_owner.field_error"
                  >
                    {errors.capaActionOwnerId}
                  </p>
                )}
              </div>
              <div className="space-y-1.5">
                <Label>
                  CAPA Deadline <span className="text-destructive">*</span>
                </Label>
                <Input
                  type="date"
                  value={form.capaDeadline}
                  onChange={(e) => set("capaDeadline", e.target.value)}
                  data-ocid="incidents.capa_deadline_input"
                  className={errors.capaDeadline ? "border-destructive" : ""}
                />
                {errors.capaDeadline && (
                  <p
                    className="text-destructive text-xs"
                    data-ocid="incidents.capa_deadline.field_error"
                  >
                    {errors.capaDeadline}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>

        <DialogFooter className="gap-2">
          <Button
            variant="outline"
            onClick={handleClose}
            data-ocid="incidents.cancel_button"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={mutation.isPending}
            data-ocid="incidents.submit_button"
          >
            {mutation.isPending ? "Submitting…" : "Submit Incident"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
