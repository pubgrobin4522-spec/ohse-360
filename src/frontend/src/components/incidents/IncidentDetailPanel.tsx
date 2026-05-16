import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import {
  AlertTriangle,
  ArrowLeft,
  CheckCircle2,
  ClipboardList,
  Clock,
  Loader2,
  Search,
} from "lucide-react";
import { useState } from "react";
import {
  CAPAStatus,
  type CAPAView,
  IncidentStatus,
  type IncidentView,
} from "../../backend";
import {
  formatIncidentType,
  formatStatus,
  severityClass,
  statusClass,
} from "../../pages/IncidentsPage";

// ─── Status stepper ─────────────────────────────────────────────────────────
const STEPS: { status: IncidentStatus; label: string }[] = [
  { status: IncidentStatus.Open, label: "Open" },
  { status: IncidentStatus.UnderInvestigation, label: "Under Investigation" },
  { status: IncidentStatus.CAPAPending, label: "CAPA Pending" },
  { status: IncidentStatus.Closed, label: "Closed" },
];

const STATUS_ORDER: Record<IncidentStatus, number> = {
  [IncidentStatus.Open]: 0,
  [IncidentStatus.UnderInvestigation]: 1,
  [IncidentStatus.CAPAPending]: 2,
  [IncidentStatus.Closed]: 3,
};

function nextStatus(current: IncidentStatus): IncidentStatus | null {
  const order = STATUS_ORDER[current];
  const next = STEPS.find((s) => STATUS_ORDER[s.status] === order + 1);
  return next?.status ?? null;
}

function capaStatusClass(s: CAPAStatus): string {
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

function formatTs(ts: bigint): string {
  return new Date(Number(ts) / 1_000_000).toLocaleString();
}

// ─── Props ──────────────────────────────────────────────────────────────────
interface Props {
  incident: IncidentView;
  capas: CAPAView[];
  isSafetyOfficer: boolean;
  isUpdating: boolean;
  isClosingCapa: boolean;
  onBack: () => void;
  onUpdateStatus: (
    status: IncidentStatus,
    rootCause: string,
    correctiveAction: string,
  ) => void;
  onCloseCAPA: (id: bigint) => void;
}

export function IncidentDetailPanel({
  incident,
  capas,
  isSafetyOfficer,
  isUpdating,
  isClosingCapa,
  onBack,
  onUpdateStatus,
  onCloseCAPA,
}: Props) {
  const next = nextStatus(incident.status);
  const [updateRootCause, setUpdateRootCause] = useState(incident.rootCause);
  const [updateCorrectiveAction, setUpdateCorrectiveAction] = useState(
    incident.correctiveAction,
  );
  const [newStatus, setNewStatus] = useState<IncidentStatus | "">(next ?? "");

  const currentStep = STATUS_ORDER[incident.status];

  return (
    <div className="space-y-6" data-ocid="incidents.detail_panel">
      {/* ── Back + header ───────────────────────────────────────────── */}
      <div className="flex items-start gap-4">
        <Button
          variant="outline"
          size="sm"
          onClick={onBack}
          className="mt-0.5 shrink-0"
          data-ocid="incidents.back_button"
        >
          <ArrowLeft className="w-4 h-4 mr-1.5" /> Back
        </Button>
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-3 mb-1">
            <h1 className="text-xl font-bold font-mono text-primary">
              {incident.incidentNumber}
            </h1>
            <Badge
              variant="outline"
              className={`border ${severityClass(incident.severity)}`}
            >
              {incident.severity}
            </Badge>
            <Badge
              variant="outline"
              className={`border ${statusClass(incident.status)}`}
            >
              {formatStatus(incident.status)}
            </Badge>
          </div>
          <p className="text-muted-foreground text-sm">
            {formatIncidentType(incident.incidentType)} · {incident.department}{" "}
            · Reported {formatTs(incident.createdAt)}
          </p>
        </div>
      </div>

      {/* ── Status stepper ──────────────────────────────────────────── */}
      <div className="elevated-card rounded-xl p-5">
        <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-4">
          Status Flow
        </h2>
        <div className="flex items-center gap-0">
          {STEPS.map((step, i) => {
            const stepIdx = STATUS_ORDER[step.status];
            const done = stepIdx < currentStep;
            const active = stepIdx === currentStep;
            const isLast = i === STEPS.length - 1;
            return (
              <div
                key={step.status}
                className="flex items-center flex-1 min-w-0"
              >
                <div className="flex flex-col items-center">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center border-2 shrink-0 ${
                      done
                        ? "bg-primary border-primary text-primary-foreground"
                        : active
                          ? "bg-primary/20 border-primary text-primary"
                          : "bg-muted/30 border-border text-muted-foreground"
                    }`}
                  >
                    {done ? (
                      <CheckCircle2 className="w-4 h-4" />
                    ) : active ? (
                      <Clock className="w-3.5 h-3.5" />
                    ) : (
                      <span className="text-xs font-bold">{i + 1}</span>
                    )}
                  </div>
                  <span
                    className={`text-xs mt-1.5 text-center whitespace-nowrap ${
                      active
                        ? "text-primary font-semibold"
                        : done
                          ? "text-muted-foreground"
                          : "text-muted-foreground/50"
                    }`}
                  >
                    {step.label}
                  </span>
                </div>
                {!isLast && (
                  <div
                    className={`h-0.5 flex-1 mx-1 ${
                      stepIdx < currentStep ? "bg-primary" : "bg-border"
                    }`}
                  />
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* ── Detail fields ───────────────────────────────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="elevated-card rounded-xl p-5 space-y-3">
          <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
            Incident Details
          </h2>
          <Field label="Location">{incident.location}</Field>
          <Field label="Department">{incident.department}</Field>
          <Field label="Incident Date">{incident.incidentDate}</Field>
          <Field label="Reported By">{incident.reportedByName}</Field>
          {incident.injuredPersonCode && (
            <Field label="Injured Person">{incident.injuredPersonCode}</Field>
          )}
        </div>

        <div className="elevated-card rounded-xl p-5 space-y-3">
          <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
            Investigation
          </h2>
          <Field label="Description">
            <span className="whitespace-pre-wrap">{incident.description}</span>
          </Field>
          <Field label="Root Cause">{incident.rootCause}</Field>
          <Field label="Corrective Action">{incident.correctiveAction}</Field>
          {incident.closedAt && (
            <Field label="Closed At">{formatTs(incident.closedAt)}</Field>
          )}
        </div>
      </div>

      {/* ── CAPA Records ────────────────────────────────────────────── */}
      <div className="elevated-card rounded-xl p-5">
        <div className="flex items-center gap-2 mb-4">
          <ClipboardList className="w-4 h-4 text-primary" />
          <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
            CAPA Records
          </h2>
          <span className="ml-auto text-muted-foreground/60 text-xs">
            {capas.length} record{capas.length !== 1 ? "s" : ""}
          </span>
        </div>

        {capas.length === 0 ? (
          <p
            className="text-muted-foreground text-sm"
            data-ocid="incidents.capa.empty_state"
          >
            No CAPA records for this incident.
          </p>
        ) : (
          <div className="space-y-3">
            {capas.map((capa, idx) => (
              <div
                key={String(capa.id)}
                className="bg-muted/20 border border-border/60 rounded-lg p-4 flex flex-col sm:flex-row sm:items-center gap-3"
                data-ocid={`incidents.capa.item.${idx + 1}`}
              >
                <div className="flex-1 min-w-0 space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-mono text-xs text-muted-foreground">
                      CAPA-{String(capa.id).padStart(4, "0")}
                    </span>
                    <Badge
                      variant="outline"
                      className={`text-xs border ${capaStatusClass(capa.status)}`}
                    >
                      {capa.status}
                    </Badge>
                    {capa.status === CAPAStatus.Overdue && (
                      <Badge
                        variant="outline"
                        className="text-xs border bg-red-500/20 text-red-400 border-red-500/40"
                      >
                        OVERDUE
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm text-foreground">{capa.description}</p>
                  <p className="text-xs text-muted-foreground">
                    Owner:{" "}
                    <span className="text-foreground">
                      {capa.actionOwnerName}
                    </span>
                    {" · "}
                    Deadline:{" "}
                    <span
                      className={
                        capa.status === CAPAStatus.Overdue
                          ? "text-red-400 font-medium"
                          : "text-foreground"
                      }
                    >
                      {capa.deadline}
                    </span>
                  </p>
                </div>
                {isSafetyOfficer && capa.status !== CAPAStatus.Closed && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onCloseCAPA(capa.id)}
                    disabled={isClosingCapa}
                    data-ocid={`incidents.capa.close_button.${idx + 1}`}
                    className="shrink-0"
                  >
                    {isClosingCapa ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      "Close CAPA"
                    )}
                  </Button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ── Status update (Safety Officer only, non-closed) ─────────── */}
      {isSafetyOfficer && incident.status !== IncidentStatus.Closed && (
        <div
          className="elevated-card rounded-xl p-5 space-y-4"
          data-ocid="incidents.status_update_panel"
        >
          <div className="flex items-center gap-2">
            <Search className="w-4 h-4 text-primary" />
            <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
              Update Status
            </h2>
          </div>

          <div className="space-y-1.5">
            <Label>Move To Status</Label>
            <Select
              value={newStatus}
              onValueChange={(v) => setNewStatus(v as IncidentStatus)}
            >
              <SelectTrigger
                className="w-64"
                data-ocid="incidents.new_status_select"
              >
                <SelectValue placeholder="Select next status…" />
              </SelectTrigger>
              <SelectContent>
                {STEPS.filter((s) => STATUS_ORDER[s.status] > currentStep).map(
                  (s) => (
                    <SelectItem key={s.status} value={s.status}>
                      {s.label}
                    </SelectItem>
                  ),
                )}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label>Root Cause (updated)</Label>
              <Textarea
                rows={2}
                value={updateRootCause}
                onChange={(e) => setUpdateRootCause(e.target.value)}
                data-ocid="incidents.update_root_cause_textarea"
              />
            </div>
            <div className="space-y-1.5">
              <Label>Corrective Action (updated)</Label>
              <Textarea
                rows={2}
                value={updateCorrectiveAction}
                onChange={(e) => setUpdateCorrectiveAction(e.target.value)}
                data-ocid="incidents.update_corrective_action_textarea"
              />
            </div>
          </div>

          <Button
            onClick={() => {
              if (!newStatus) return;
              onUpdateStatus(
                newStatus as IncidentStatus,
                updateRootCause,
                updateCorrectiveAction,
              );
            }}
            disabled={isUpdating || !newStatus}
            data-ocid="incidents.update_status_button"
          >
            {isUpdating ? (
              <>
                <Loader2 className="w-4 h-4 mr-1.5 animate-spin" /> Updating…
              </>
            ) : (
              <>Update Status</>
            )}
          </Button>
        </div>
      )}

      {incident.status === IncidentStatus.Closed && (
        <div
          className="elevated-card rounded-xl p-5 flex items-center gap-3"
          data-ocid="incidents.closed_banner"
        >
          <CheckCircle2 className="w-5 h-5 text-primary shrink-0" />
          <div>
            <p className="text-foreground font-medium">Incident Closed</p>
            {incident.closedAt && (
              <p className="text-muted-foreground text-sm">
                Closed at {formatTs(incident.closedAt)}
              </p>
            )}
          </div>
        </div>
      )}

      {/* Separator from layout context */}
      <AlertTriangle className="hidden" />
    </div>
  );
}

function Field({
  label,
  children,
}: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-0.5">
      <p className="text-xs text-muted-foreground uppercase tracking-wide">
        {label}
      </p>
      <p className="text-sm text-foreground">{children}</p>
    </div>
  );
}
